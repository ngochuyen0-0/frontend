import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/v1",
    timeout: 10000,

});

apiClient.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("access_token");
        if (token && config.url !== "/auth/login" && config.url !== "/auth/register") {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            sessionStorage.removeItem("access_token");
            window.location.href = "/auth/login";
        }
        return Promise.reject(error);
    }
)
    
export default apiClient;