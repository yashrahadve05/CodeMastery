import { db } from "../libs/db.js";
import { submitBatch } from "../libs/problem.lib.js";

export const createProblem = async (req, res) => {
    // Get all the data from the request body
    const {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        tastcases,
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

    // put a loop for each reference solution of different languages
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

            const submissions = tastcases.map(({ input, output }) => ({
                source_code: solutionCode,
                language_id: languageId,
                stdin: input,
                expected_output: output,
            }));

            const submissionResult = await submitBatch(submissions);
            const tokens = submissionResult.map((res) => res.token);

            const results = await poolBatchResults(tokens);

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
                    tastcases,
                    codeSnippets,
                    referenceSolution,
                    userId: req.user.id,
                },
            });

            return res.status(201).json(newProblem)
        }
    } catch (error) {
        console.log(error);
    }
};

export const getAllProblems = async (req, res) => {};

export const getProblemById = async (req, res) => {};

export const updateProblem = async (req, res) => {};

export const deleteProblem = async (req, res) => {};

export const getAllProblemsSolvedByUser = async (req, res) => {};
