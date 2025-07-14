//const express = require('express') //CJS Common JS
import express from 'express' // ESM ecmascript modules
import cors from 'cors' //para permitir el acceso a la API desde el frontend
import 'dotenv/config' //para que lea las variables de entorno
import router from './router'
import { connectDB } from './config/db'
import { corsConfig } from './config/cors'

// instancia del servidor
const app = express()

app.use(cors(corsConfig))

connectDB() //conectar a la base de datos
//leer datos del formulario
app.use(express.json()) //para que pueda leer los datos del formulario en formato json

//app.get('/', router)
app.use('/', router) //cada que hay une petición a la url principal se ejecuta a router

export default app