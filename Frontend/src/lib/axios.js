import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:8080/api/v1" : "https://codemastery-f9ik.onrender.com/api/v1",
    withCredentials: true,
    
})