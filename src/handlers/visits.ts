import { Request, Response } from "express";
import ProfileVisit from "../models/ProfileVisit";
import User from "../models/User";

// Registrar una nueva visita al perfil
export const recordVisit = async (req: Request, res: Response) => {
  try {
    const { profileHandle } = req.params;
    const { referrer } = req.body;

    // Buscar el perfil por handle
    const profile = await User.findOne({ handle: profileHandle });
    if (!profile) {
      return res.status(404).json({ error: "Perfil no encontrado" });
    }

    // Crear registro de visita
    const visit = new ProfileVisit({
      profileId: profile._id,
      visitorId: req.user?.id || null, // Si hay usuario autenticado
      referrer: referrer || null,
    });

    await visit.save();

    res.status(201).json({ message: "Visita registrada" });
  } catch (error) {
    console.error("Error al registrar visita:", error);
    res.status(500).json({ error: "Error al registrar la visita" });
  }
};

// Obtener estadísticas de visitas de un perfil
export const getVisitStats = async (req: Request, res: Response) => {
  try {
    const { profileHandle } = req.params;
    const { period = "week" } = req.query; // 'day', 'week', 'month', 'all'

    // Verificar si el usuario tiene permisos para ver estas estadísticas
    const profile = await User.findOne({ handle: profileHandle });
    if (!profile) {
      return res.status(404).json({ error: "Perfil no encontrado" });
    }

    // Si no es el dueño del perfil, rechazar (no tenemos roles por ahora)
    if (profile._id.toString() !== req.user?.id) {
      return res.status(403).json({ error: "No tienes permisos para ver estas estadísticas" });
    }

    // Calcular fecha de inicio según el periodo
    const startDate = new Date();
    switch (period) {
      case 'day':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'all':
      default:
        break;
    }

    // Consulta base
    const query: any = { profileId: profile._id };

    // Agregamos filtro por fecha si no es 'all'
    if (period !== 'all') {
      query.date = { $gte: startDate };
    }

    // Estadísticas generales
    const totalVisits = await ProfileVisit.countDocuments(query);

    // Agrupar por día para gráfico
    const dailyStats = await ProfileVisit.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            day: { $dayOfMonth: "$date" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
    ]);

    // Formatear para respuesta
    const formattedStats = dailyStats.map(stat => ({
      date: new Date(stat._id.year, stat._id.month - 1, stat._id.day),
      visits: stat.count
    }));

    res.json({
      totalVisits,
      dailyStats: formattedStats
    });

  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    res.status(500).json({ error: "Error al obtener las estadísticas de visitas" });
  }
};
