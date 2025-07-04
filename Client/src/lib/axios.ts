import axios from "axios";

export const axiosInstance = axios.create({
    //baseURL: "http://localhost:5003/api",
    baseURL: "https://project-and-task-management-web-app.onrender.com/api",
    withCredentials: true,
})
