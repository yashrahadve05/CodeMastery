import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-hot-toast";

const useProblemStore = create((set) => ({
    problems: [],
    problem: [],
    solvedProblems: [],
    isProblemsLoading: false,
    isProblemLoading: false,
    isSolvedProblemByUserLoading: false,

    getAllProblems: async () => {
        try {
            set({ isProblemsLoading: true });

            const res = await axiosInstance.get("/problems/get-all-problems", {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            set({ problems: res.data.problems });

            toast.success("Problems fetched successfully!");
        } catch (error) {
            console.log("Error while fetching all problems : ", error);
            toast.error("Error while fetching problems!");
        } finally {
            set({ isProblemsLoading: false });
        }
    },

    getProblemById: async (id) => {
        try {
            set({ isProblemLoading: true });

            const res = await axiosInstance.get(`/problems/get-problem/${id}`);
            set({ problem: res.data.problem });

            toast.success(res.data.message);
        } catch (error) {
            console.log("Error while fetching solved problem", error);
            toast.error("Error while fetching solved problem");
        } finally {
            set({ isProblemLoading: false });
        }
    },

    getSolvedProblemByUser: async () => {
        try {
            set({ isSolvedProblemByUserLoading: false });

            const res = await axiosInstance.get(
                "/problems/get-solved-problems"
            );
            set({ solvedProblems: res.data.problems });

            toast.success(res.data.message);
        } catch (error) {
            console.log("Error while fetching solved problem by user", error);
            toast.error("Error while fetching solved problem by user");
        }
    },
}));

export default useProblemStore;
