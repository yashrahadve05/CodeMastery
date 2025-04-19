import express, {Router} from 'express';
import { registerUser } from '../controllers/auth.controllers';


const authRoutes = Router();


authRoutes.post("/register", registerUser);

authRoutes.post("/login", )

authRoutes.post("/logout", )

authRoutes.get("/profile", )


export default authRoutes;