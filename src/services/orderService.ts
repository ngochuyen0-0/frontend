import { OrdersData } from "../types/order";
import apiClient from "../utils/apiClient";

// ==============================
// 🧾 Order Services
// ==============================

// Tạo đơn hàng
export const createOrder = async (data: any) => {
    const res = await apiClient.post("/orders/create", data);
    return res.data;
};

// Lấy đơn hàng theo ID
export const getOrderById = async (id: string) => {
    const res = await apiClient.get(`/orders/get/${id}`);
    return res.data;
};

// Lấy danh sách đơn hàng của người dùng (user)
export const getOrdersByUser = async (filters: any) => {
    const res = await apiClient.post(`/orders/user`, filters);
    return res.data;
};


// Lấy tất cả đơn hàng (chỉ admin)
export const getOrders = async (filters: any) => {
    const res = await apiClient.post(`/orders/get`, filters);
    return res.data as OrdersData;
};

// Xác nhận thanh toán đơn hàng (paid)
export const paidOrder = async (payToken: string) => {
    const res = await apiClient.post(`/orders/paid/${payToken}`);
    return res.data;
};
