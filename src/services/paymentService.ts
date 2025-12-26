import apiClient from "../utils/apiClient";

export const payURLCreate = async (method: string, order_id: string) => {
    const res = await apiClient.post(`/payment/${method}/create/${order_id}`);
    return res.data;
};

export const paypalCapture = async (pay_token: string, order_id: string) => {
    const res = await apiClient.post(`/payment/paypal/capture?order_id=${order_id}&pay_token=${pay_token}`);
    return res.data;
};

