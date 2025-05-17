import { db } from "../libs/db.js";

export const getAllSubmission = async (req, res) => {
    try {
        const userId = req.user.id;

        const submissions = await db.submission.findMany({
            where: {
                userId,
            },
        });

        res.status(200).json({
            success: true,
            message: "Submission fetched successfully",
            submissions,
        });
    } catch (error) {
        console.error("Fetch Submission Error: ", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch submissions",
        });
    }
};

export const getSubmissionByProblemId = async (req, res) => {
    try {
        const userId = req.user.id;
        const problemId = req.params.problemId;

        const submission = await db.submission.findMany({
            where: {
                userId,
                problemId,
            },
        });

        res.status(200).json({
            success: true,
            message: "Submission fetched successfuly!",
            submission,
        });
    } catch (error) {
        console.error("Error while fetching submission by problemId!", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch submissions by problemId",
        });
    }
};

export const getAllSubmissionCountForProblem = async (req, res) => {
    try {
        const problemId = req.params.problemId;
        const submissionCount = await db.submission.count({
            where: {
                problemId,
            },
        });

        res.status(200).json({
            success: true,
            message: "Submissions Fetched successfully!",
            count: submissionCount,
        });
    } catch (error) {
        console.error("Error while fetching submission count", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch submission count!",
        });
    }
};
