import { Router } from 'express';

import { authMiddleware, checkAdmin } from "../middleware/auth.middleware.js"
import { createProblem, deleteProblem, getAllProblems, getAllProblemsSolvedByUser, getProblemById, updateProblem } from '../controllers/problem.controllers.js';

const problemRoutes = Router();


// ************ Problem Management Routes ************ //
// create-problem -> For creating Problems
// get-all-problems -> For getting all problems
// get-problem/:id -> For getting specific problem
// update-problem/:id -> To update the problem
// delete-problem/:id -> To delete the problem
// get-solved-problems -> To get all the problems

problemRoutes.post("/create-problem", authMiddleware, checkAdmin, createProblem);

problemRoutes.get("/get-all-problems", authMiddleware, getAllProblems);

problemRoutes.get("/get-problem/:id", authMiddleware, getProblemById);

problemRoutes.put("/update-problem/:id", authMiddleware, checkAdmin, updateProblem);

problemRoutes.delete("delete-problem/:id", authMiddleware, checkAdmin, deleteProblem);

problemRoutes.get("get-solved-problems", authMiddleware, getAllProblemsSolvedByUser);




export default problemRoutes;