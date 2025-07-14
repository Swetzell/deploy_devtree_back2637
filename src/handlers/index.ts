import { Request, Response } from "express";
import { validationResult } from "express-validator";
import User from '../models/User'
import { checkPassword, hashPassword } from "../utils/auth";
import slug from "slug";
import { generateJWT } from "../utils/jwt";
export const createAccount = async (req: Request, res: Response) => {
  //console.log(req.body)

  //manejo errores
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  const { email, password } = req.body
  const userExists = await User.findOne({ email })//es como un where
  if (userExists) {
    const error = new Error("El usuario ya existe")
    return res.status(409).json({ error: error.message })
  }

  const handle = slug(req.body.handle, '')
  const handleExist = await User.findOne({ handle })
  if (handleExist) {
    const error = new Error("nombre de usuario ya existe")
    return res.status(409).json({ error: error.message })
  }
  //otra forma de agregar datos es instanciar el modelo
  const user = new User(req.body)
  const hash = await hashPassword(password)
  user.handle = handle
  user.password = hash
  //console.log(slug(handle))
  //console.log(hash)
  await user.save()
  res.status(201).send("Usuario creado correctamente")
}

export const login = async (req: Request, res: Response) => {


  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user) {
    const error = new Error("El usuario no existe")
    return res.status(404).json({ error: error.message })
  }

  const isPasswordCorrect = await checkPassword(password, user.password)
  if (!isPasswordCorrect) {
    const error = new Error("Contraseña incorrecta")
    return res.status(401).json({ error: error.message })
    //401 no autorizado
  }
  const token = generateJWT({ id: user._id })
  res.send(token)
}