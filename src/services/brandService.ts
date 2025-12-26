import apiClient from "../utils/apiClient";

// Brand Services - Basic version
export const createBrand = async (data: any) => {
    const res = await apiClient.post("/brands/create", data);
    return res.data;
}

export const updateBrand = async (id: string, data: any) => {
    const res = await apiClient.patch(`/brands/update/${id}`, data);
    return res.data;
}

export const getBrands = async (filters: any) => {
    const res = await apiClient.post("/brands/get", filters);
    return res.data;
}

export const getDisabledBrands = async (filters: any) => {
    const res = await apiClient.post("/brands/get-disableds", filters);
    return res.data;
}