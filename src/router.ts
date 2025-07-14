import { Router } from 'express'
import { body } from 'express-validator'

import { handleInputErrors } from './middleware/validation'
// ermite configurar un objeto con todas las rutas que despues podemos agregar a la app principal server.ts
import User from './models/User'
import { createAccount, login } from './handlers'
import { recordVisit, getVisitStats } from './handlers/visits'
import { checkAuth, optionalAuth } from './middleware/auth'

const router = Router()

/*autenticacion*/
router.post('/auth/register',
  body('handle').notEmpty().withMessage('El handle es obligatorio'),
  body('name').notEmpty().withMessage('El nombre es obligatorio'),
  body('email').isEmail().withMessage('El email es obligatorio'),
  body('password').isLength({ min: 8 }).withMessage('La contraseña es muy corta'),
  handleInputErrors,
  createAccount)

router.post('/auth/login',
  body('email').isEmail().withMessage('El email es obligatorio'),
  body('password').notEmpty().withMessage('el password es obligatorio'),
  handleInputErrors,
  login
)

// Importar el controlador de perfil
import { getProfile, getOwnProfile } from './handlers/profile';

// Rutas para perfiles y visitas
router.get('/profile/:profileHandle',
  getProfile
);

// Obtener el perfil del usuario autenticado
router.get('/profile',
  checkAuth,
  getOwnProfile
);

router.post('/profile/:profileHandle/visit',
  optionalAuth, // Permite autenticados o anónimos
  recordVisit
);

router.get('/profile/:profileHandle/stats',
  checkAuth, // Solo usuarios autenticados
  getVisitStats
);

export default router