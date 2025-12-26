import { UserProfile } from "../types/profile";
import apiClient from "../utils/apiClient";

export const login = async (email: string, password: string) => {
    const res = await apiClient.post("/user/login", { email, password });
    return res.data;
};

export const register = async (
    email: string,
    username: string,
    password: string
) => {
    const res = await apiClient.post("/user/signin", {
        username,
        email,
        password,
    });
    return res.data;
};

export const sendVerifyEmail = async (email: string) => {
    const res = await apiClient.post(`/email/send-verify-mail/${email}`);
    return res.data;
};

export const verifyEmail = async (token: string) => {
    const res = await apiClient.post(`/email/verify-mail/${token}`);
    return res.data;
};

export const getInfo = async () => {
    const res = await apiClient.get(`/user/get-info`);
    return res.data as UserProfile;
};


export const changePassword = async (
    data: {
        email: string | undefined;
        username: string | undefined;
        password: string | undefined;
    },
    token?: string
) => {

    const config = token ? {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    } : {};

    const res = await apiClient.patch("/user/update", data, config);
    return res.data;
};
