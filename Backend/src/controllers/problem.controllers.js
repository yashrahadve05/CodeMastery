import { db } from "../libs/db.js";
import {
    getJudge0LanguageId,
    submitBatch,
    pollBatchResults,
} from "../libs/judge0.lib.js";

export const createProblem = async (req, res) => {
    // Get all the data from the request body
    const {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        testCases,
        codeSnippets,
        referenceSolution,
    } = req.body;

    // check the user role once again
    if (req.user.role !== "ADMIN") {
        return res.status(403).json({
            success: false,
            error: "You are not allowed to create a problem",
        });
    }

    try {
        // put a loop for each reference solution of different languages
        for (const [language, solutionCode] of Object.entries(
            referenceSolution
        )) {
            const languageId = getJudge0LanguageId(language);

            if (!languageId) {
                return res.status(403).json({
                    success: false,
                    error: `Language ${language} is not supported!`,
                });
            }

            const submissions = testCases.map(({ input, output }) => ({
                source_code: solutionCode,
                language_id: languageId,
                stdin: input,
                expected_output: output,
            }));

            const submissionResult = await submitBatch(submissions);
            const tokens = submissionResult.map((res) => res.token);

            const results = await pollBatchResults(tokens);

            for (let i = 0; i < results.length; i++) {
                const result = results[i];

                if (result.status.id !== 3) {
                    return res.status(400).json({
                        success: false,
                        error: `Testcase ${
                            i + 1
                        } faild for language ${language}`,
                    });
                }
            }

            // save the problems into the database
            const newProblem = await db.problem.create({
                data: {
                    title,
                    description,
                    difficulty,
                    tags,
                    examples,
                    constraints,
                    testCases,
                    codeSnippets,
                    referenceSolution,
                    userId: req.user.id,
                },
            });

            return res.status(201).json({
                sucess: true,
                message: "Problem Created Successfully",
                problem: newProblem,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: "Error While Creating Problem",
        });
    }
};

export const getAllProblems = async (req, res) => {
    try {
        const problems = await db.problem.findMany();

        if (!problems) {
            return res.status(404).json({
                success: false,
                error: "No Problem Found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Message Fetched Successfully",
            problems: problems,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Error while fetching problems",
        });
    }
};

export const getProblemById = async (req, res) => {
    const { id } = req.params;

    try {
        const problem = await db.problem.findUnique({
            where: {
                id: id,
            },
        });

        if (!problem) {
            return res.status(404).json({
                success: false,
                error: "Problem Not Found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Problem Fetched Successfully",
            problem: problem,
        });
    } catch (error) {
        console.log(error);
        res.status(404).json({
            success: false,
            message: "Error while fetching problem by id",
        });
    }
};

export const updateProblem = async (req, res) => {
    const { id } = req.params;

    const {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        testCases,
        codeSnippets,
        referenceSolution,
    } = req.body;

    if (req.user.role !== "ADMIN") {
        return res.status(403).json({
            success: false,
            error: "You are not allowed to create a problem",
        });
    }

    try {
        for (const [language, solutionCode] of Object.entries(
            referenceSolution
        )) {
            const languageId = getJudge0LanguageId(language);

            if (!languageId) {
                return res.status(403).json({
                    success: false,
                    error: `Language ${language} is not supported!`,
                });
            }

            const submissions = testCases.map(({ input, output }) => ({
                source_code: solutionCode,
                language_id: languageId,
                stdin: input,
                expected_output: output,
            }));

            const submissionResult = await submitBatch(submissions);

            const tokens = submissionResult.map((res) => res.token);

            const results = await pollBatchResults(tokens);

            for (let i = 0; i < results.length; i++) {
                const result = results[i];

                if (result.status.id !== 3) {
                    return res.status(400).json({
                        success: false,
                        error: `Testcase ${
                            i + 1
                        } faild for language ${language}`,
                    });
                }
            }

            // update the problem into the database
            const Problem = await db.problem.update({
                where: {
                    id: id,
                },
                data: {
                    title,
                    description,
                    difficulty,
                    tags,
                    examples,
                    constraints,
                    testCases,
                    codeSnippets,
                    referenceSolution,
                    userId: req.user.id,
                },
            });

            return res.status(201).json({
                sucess: true,
                message: "Problem Updated Successfully",
                problem: Problem,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: "Error While Updating Problem",
        });
    }
};

export const deleteProblem = async (req, res) => {
    const {id} = req.params;
    console.log(id);

    // if (req.user.role !== "ADMIN") {
    //     return res.status(403).json({
    //         success: false,
    //         error: "You are not allowed to delete a problem",
    //     })
    // }

    try {
        // check if the problem exists in the database
        const problem = await db.problem.findUnique({where: {id}})
        console.log(problem);

        if(!problem) {
            return res.status(404).json({
                success: false,
                error: "Problem not found"
            });
        }

        // delete the problem from the database
        await db.problem.delete({where: {id}})

        res.status(200).json({
            success: true,
            message: "Problem Deleted Successfully"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: "Error While Deleting Problem",
        });
    }
};

export const getAllProblemsSolvedByUser = async (req, res) => {};