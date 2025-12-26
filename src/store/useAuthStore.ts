import { create } from "zustand";
import {
    changePassword,
    login,
    register,
    sendVerifyEmail,
    verifyEmail,
} from "../services/authService";

interface User {
    id: string;
    email: string;
    username: string;
    role?: string;
    created_at?: string;
    loyalty_points?: [];
    user_info?: [];
    user_tiers?: [];
    user_vouchers?: [];
    wishlists?: [];
}

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;

    loginUser: (email: string, password: string) => Promise<any>;
    registerUser: (
        email: string,
        username: string,
        password: string
    ) => Promise<void>;
    sendVerifyEmail: (email: string) => Promise<any>;
    verifyEmail: (token: string) => Promise<any>;
    logout: () => void;
    changePassword: (data: ChangePasswordData) => Promise<any>;

    verifyData: {
        access_token: string;
        email: string;
        username: string;
    } | null;
    setVerifyData: (data: {
        access_token: string;
        email: string;
        username: string;
    }) => void;
    clearVerifyData: () => void;
    setLoading: (loading: boolean) => void;
    setUser: (user: User) => void;
}

interface ChangePasswordData {
    email?: string;
    username?: string; // Cho trường hợp đổi pass thông thường
    newPassword: string;
    token?: string; // Cho trường hợp reset password
}

export const useAuthStore = create<AuthState>((set) => ({
    // user: null,
    // token: null,

    user: JSON.parse(sessionStorage.getItem("user") || "null"),
    token: sessionStorage.getItem("access_token") || null,
    isLoading: false,

    setLoading: (loading: boolean) => set({ isLoading: loading }),

    setUser: (user: User) => set({ user }),

    verifyData: null,
    setVerifyData: (data) => set({ verifyData: data }),
    clearVerifyData: () => set({ verifyData: null }),

    loginUser: async (email, password) => {
        const res = await login(email, password);
        const user = {
            id: res.user_id,
            name: res.user_name,
            email: res.email,
        };

        sessionStorage.setItem("access_token", res.access_token);
        sessionStorage.setItem("user", JSON.stringify(user));

        set({
            token: res.access_token,
            user: {
                id: res.user_id,
                username: res.user_name,
                email: res.email,
            },
        });

        return res;
    },

    sendVerifyEmail: async (email) => {
        const res = await sendVerifyEmail(email);
        return res;
    },

    verifyEmail: async (token) => {
        const res = await verifyEmail(token);
        return res;
        // if (res.status === "success") {
        //     set({ user: res.data });
        // }
    },

    registerUser: async (email, username, password) => {
        const res = await register(email, username, password);
        set({ user: res.user, token: res.token });
        sessionStorage.setItem("token", res.token);
    },

    logout: () => {
        sessionStorage.clear();
        set({ user: null, token: null });
    },

    changePassword: async (data: ChangePasswordData) => {
        try {
            const res = await changePassword(
                {
                    email: data.email,
                    username: data.username,
                    password: data.newPassword,
                },
                data.token
            );
            return res.data;
        } catch (error: any) {
            return {
                status: "error",
                error: error.res?.data?.error || "Đổi mật khẩu thất bại",
            };
        }
    },
}));
