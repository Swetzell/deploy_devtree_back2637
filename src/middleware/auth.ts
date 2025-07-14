import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/User";

// Extender Request para incluir el usuario
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role?: string;
      };
    }
  }
}

export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  // Verificar si hay token
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No autenticado" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

    // Buscar usuario
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ error: "Token no válido" });
    }

    // Agregar usuario al request
    req.user = {
      id: user._id.toString()
    };

    next();
  } catch (error) {
    console.error("Error en autenticación:", error);
    res.status(401).json({ error: "No autenticado" });
  }
};

// Middleware opcional para rutas que pueden ser públicas o autenticadas
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(); // Continuar sin autenticación
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

    const user = await User.findById(decoded.id).select("-password");
    if (user) {
      req.user = {
        id: user._id.toString()
      };
    }
  } catch (error) {
    // Ignoramos error - será una petición no autenticada
  }

  next();
};
