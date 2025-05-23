import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigninUp: false,
    isLoggingIn: false,
    isCheckingAuth: false,

    checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
            const res = await axiosInstance.get("/auth/profile");
            // console.log("Checkauth response: ", res.data);
            set({ authUser: res.data.user });
        } catch (error) {
            console.log("Error checking auth: ", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigninUp: true });

        try {
            const res = await axiosInstance.post("/auth/register", data);
            set({ authUser: res.data.user });

            toast.success(res.data.message);
        } catch (error) {
            console.log("Error Signing Up: ", error);
            toast.error("Error Signing Up");
        } finally {
            set({ isSigninUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data.user });

            toast.success(res.data.message);
        } catch (error) {
            console.log("Error logging in: ", error);
            toast.error("Error Logging In!");
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });

            toast.success("Logout Successfully");
        } catch (error) {
            console.log("Error logging our: ", error);
            toast.error("Error logging out!");
        }
    },
}));

export default useAuthStore;
