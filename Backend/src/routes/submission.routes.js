import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getAllSubmission, getAllSubmissionCountForProblem, getSubmissionByProblemId } from "../controllers/submission.controllers.js";

const submissionRoutes = Router();


submissionRoutes.get("/get-all-submissions", authMiddleware, getAllSubmission);
submissionRoutes.get("/get-submission/:problemId", authMiddleware, getSubmissionByProblemId);
submissionRoutes.get("/get-submissions-count/:problemId", authMiddleware, getAllSubmissionCountForProblem);


export default submissionRoutes;