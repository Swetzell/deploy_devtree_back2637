import { Request, Response } from "express";
import User from "../models/User";

// Obtener información de un perfil por handle
export const getProfile = async (req: Request, res: Response) => {
  try {
    const { profileHandle } = req.params;

    const user = await User.findOne({ handle: profileHandle }).select('-password');
    if (!user) {
      return res.status(404).json({ error: "Perfil no encontrado" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    res.status(500).json({ error: "Error al obtener el perfil" });
  }
};

// Obtener el perfil del usuario autenticado
export const getOwnProfile = async (req: Request, res: Response) => {
  try {
    // El middleware auth.ts ya coloca el ID del usuario en req.user
    if (!req.user?.id) {
      return res.status(401).json({ error: "No autenticado" });
    }

    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error al obtener perfil propio:", error);
    res.status(500).json({ error: "Error al obtener el perfil" });
  }
};
