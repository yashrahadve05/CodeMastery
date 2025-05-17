import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { executeCode } from "../controllers/executeCode.controllers.js";

const executionRoutes = Router();

executionRoutes.post("/", authMiddleware, executeCode);

export default executionRoutes;
