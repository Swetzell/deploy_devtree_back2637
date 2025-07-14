import type { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
export const handleInputErrors = (req: Request, res: Response, next: NextFunction) => {
  //middleware tiene acceso a req y res
  let errors = validationResult(req)
  console.log('desde validation.ts')
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next() //llama al siguiente middleware

}