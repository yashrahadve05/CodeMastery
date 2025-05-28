import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-hot-toast";

export const useProblemStore = create((set) => ({
    problems: [],
    problem: null,
    solvedProblems: [],
    isProblemsLoading: false,
    isProblemLoading: false,
    isSolvedProblemByUserLoading: false,

    getAllProblems: async () => {
        try {
            set({isProblemsLoading: true})

            const res = await axiosInstance.get("/problems/get-all-problems");

            set({problems: res.data.problems});

            // toast.success("Problems fetched successfully!")

        } catch (error) {
            console.log("Error while fetching all problems : ", error)
            toast.error("Error while fetching problems!")
        } finally {
            set({isProblemsLoading: false})
        }
    },

    getProblemById: async () => {
        try {
            set({isProblemLoading: true});

            const res = await axiosInstance.get(`/problems/get-problem/${id}`);
            set({problem: res.data.problem});

            toast.success(res.data.message || "Problem fetched successfully!")
        } catch (error) {
            console.log("Error while fetching problem!", error);
            toast.error("Error while fetching problem!")
        } finally {
            set({isProblemLoading: false})
        }
    },

    getSolvedProblemByUser: async () => {
        try {
            set({isSolvedProblemByUserLoading: false});

            const res = await axiosInstance.get("/problems/get-solved-problems");
            set({solvedProblems: res.data.problems})

            toast.success(res.data.message);

        } catch (error) {
            console.log("Error while fetching solved problem by user", error);
            toast.error("Error while fetching solved problem by user")
        }
    },
}));



