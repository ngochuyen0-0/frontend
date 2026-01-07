import apiClient from "../utils/apiClient";

// ==============================
// 📊 Statistical Services
// ==============================

// Lấy thống kê đơn hàng theo trạng thái
export const getOrderStatusStatistics = async () => {
    const res = await apiClient.get("/statistical/orders-status");
    return res.data;
};

// Lấy thống kê tổng quan
export const getGeneralStatistics = async () => {
    const res = await apiClient.get("/statistical/general");
    return res.data;
};

// Lấy thống kê doanh thu theo tháng
export const getRevenueByMonth = async (year: number) => {
    const res = await apiClient.get(`/statistical/get_revenue_by_month/${year}`);
    return res.data;
};

// Lấy danh sách đơn hàng gần đây
export const getRecentOrders = async (limit: number = 5) => {
    const res = await apiClient.get(`/statistical/recent-orders?limit=${limit}`);
    return res.data;
};