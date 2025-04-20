import express, {Router} from 'express';
import { loginUser, logout, profile, registerUser } from '../controllers/auth.controllers.js';


const authRoutes = Router();


authRoutes.post("/register", registerUser);

authRoutes.post("/login", loginUser)

authRoutes.post("/logout", logout)

authRoutes.get("/profile", profile)


export default authRoutes;