import axios from 'axios';

export const getJudge0LanguageId = (language) => {

    const languageMap = {
        "PYTHON": 71,
        "JAVA": 62,
        "JAVASCRIPT": 63,
        "C++": 64,
    }

    return languageMap[language.toUpperCase()];
}

const sleep = (milliSeconds) => new Promise((resolve) => setTimeout(resolve, milliSeconds));
// Alternative
/* 
const sleep = (milliSeconds) => {
    return new Promise((resolve) => {
        setTimeout(resolve, milliSeconds)
    })
}
*/

export const pollBatchResults = async (tokens) => {

    const MAX_WAIT_TIME = 15000 // 15 seconds
    const startTime = Date.now()

    // repetedly asks the endpoints ki meine jo kaam diya thaaa wo ho gaya?
    while (true) {

        if (Date.now() - startTime > MAX_WAIT_TIME) {
            throw new Error("Judge0 execution timeout")
        }

        const { data } = await axios.get(`${process.env.JUDGE0_API_URL}/submissions/batch`, {
            params: {
                tokens: tokens.join(","),
                base64_encoded: false,
            }
        })

        const results = data.submissions || [];
        const isAllDone = results.every(
            // arrow function shorthand
            (result) => result.status.id !== 1 && result.status.id !== 2
        )

        if (isAllDone) {
            return results;
        }
        await sleep(1000)
    }
}

export const submitBatch = async (submissions) => {
    try {
        const { data } = await axios.post(`${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`, {
            submissions
        })

        // [{token}, {token}, {token}] => the data has returned in the form of token
        console.log("Batch submission response from Judge0: ", data);
        return data; 
    } catch (error) {
        console.error("Error submitting batch to Judge0:", error);
        return error;
    }

}

export function getLanguageName(LanguageId) {
    const LANGUAGE_NAMES = {
        74: "TypeScript",
        63: "JavaScript",
        71: "Python",
        62: "Java",
        64: "C++",
    }

    return LANGUAGE_NAMES[LanguageId] || "Unknown"
}