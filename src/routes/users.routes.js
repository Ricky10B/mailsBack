import express from 'express';

const routes = express.Router()

// Middlewares Authentication
import { authenticated, authorization } from '../auth/auth.js';

// controllers
import { userRegister, userLogin, userLogout } from '../controllers/usersControllers.js';
import { userVerifiedSuccess } from '../controllers/registroExitosoController.js';

// Routes
routes.post('/registerUser', userRegister)
routes.post('/loginUser', userLogin)
routes.get('/logout', authenticated, authorization, userLogout)
// verificar si el token es el mismo de la BD
routes.get('/authenticate/:id', userVerifiedSuccess)

export default routes