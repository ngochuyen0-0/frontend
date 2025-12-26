import apiClient from "../utils/apiClient";

// Category Services
export const createCategory = async (data: any) => {
    const res = await apiClient.post("/categories/create", data);
    return res.data;
}

export const updateCategory = async (id: string, data: any) => {
    const res = await apiClient.patch(`/categories/update/${id}`, data);
    return res.data;
}

export const getCategories = async (filters: any) => {
    const res = await apiClient.post("/categories/get", filters);
    return res.data;
}

export const getDisabledCategories = async (filters: any) => {
    const res = await apiClient.post("/categories/get-disableds", filters);
    return res.data;
}