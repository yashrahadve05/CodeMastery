import express, {Router} from 'express';
import { loginUser, logout, profile, registerUser } from '../controllers/auth.controllers.js';
import { authMiddleware } from '../middleware/auth.middleware.js';


const authRoutes = Router();


authRoutes.post("/register", registerUser);

authRoutes.post("/login", loginUser)

authRoutes.post("/logout", authMiddleware, logout)

authRoutes.get("/profile", authMiddleware, profile)


export default authRoutes;