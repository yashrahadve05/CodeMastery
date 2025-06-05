import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast"; 

const useSubmissionStore = create((set, get) => ({
    isLoading: null,
    submissions: [],
    submission: null,
    submissionCount: 0,

    getAllSubmissions: async () => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.get(
                "/submission/get-all-submissions"
            );

            set({ submissions: res.data.submissions });

            toast.success(
                res.data.message || "Submission fetched successfully"
            );
        } catch (error) {
            console.log("Fetch submission error", error);
            toast.error("Failed to fetch submissions");
        } finally {
            set({ isLoading: false });
        }
    },

    getSubmissionForProblem: async (problemId) => {
        try {
            set({ isLoading: true });

            const res = await axiosInstance.get(
                `/submission/get-submission/${problemId}`
            );
            set({ submission: res.data.submission });

            toast.success(
                res.data.message || "Submission fetched successfully"
            );
        } catch (error) {
            console.log("Fetch submission error", error);
            toast.error("Failed to fetch submissions");
        } finally {
            set({ isLoading: false });
        }
    },

    getSubmissionCountForProblem: async (problemId) => {
        try {

            const res = await axiosInstance.get(`/submission/get-submissions-count/${problemId}`);

            set({submissionCount: res.data.count});

        } catch (error) {
            console.error("Error while fetching submission count!", error);
        }
    },
}));

export default useSubmissionStore