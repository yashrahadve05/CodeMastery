import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const useExecutionStore = create((set) => ({
    isExecuting: false,
    submission: null,

    executeCode: async (
        source_code,
        language_id,
        stdin,
        expected_outputs,
        problemId
    ) => {
        try {
            set({ isExecuting: true });

            const res = await axiosInstance.post("/execute-code", {
                source_code,
                language_id,
                stdin,
                expected_outputs,
                problemId,
            });

            set({ submission: res.data.submission });

            toast(res.data.message || "Code Executed!");
        } catch (error) {
            console.log("Error while executing code", error);
            toast.error("Faild to execute code!");
        } finally {
            set({ isExecuting: false });
        }
    },
}));

export default useExecutionStore;
