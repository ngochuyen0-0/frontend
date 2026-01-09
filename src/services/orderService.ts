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

// Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (orderId: string, status: string, notes?: string) => {
    const res = await apiClient.put(`/orders/update-status/${orderId}`, { status, notes });
    return res.data;
};

// Cập nhật thông tin theo dõi đơn hàng
export const updateOrderTracking = async (orderId: string, trackingNumber: string) => {
    const res = await apiClient.put(`/orders/update-tracking/${orderId}`, { tracking_number: trackingNumber });
    return res.data;
};

// Cập nhật thông tin đơn hàng
export const updateOrderInfo = async (orderId: string, data: any) => {
    const res = await apiClient.put(`/orders/update/${orderId}`, data);
    return res.data;
};

// Hủy đơn hàng
export const cancelOrder = async (orderId: string) => {
    const res = await apiClient.put(`/orders/cancel/${orderId}`);
    return res.data;
};
