import apiClient from "../utils/apiClient";

// Product Services
export const createProduct = async (data: any) => {
    const res = await apiClient.post("/products/create", data);
    return res.data;
}

export const createProductVariant = async (data: any) => {
    const res = await apiClient.post("/products/create-variant", data);
    return res.data;
}

export const updateProduct = async (id: string, data: any) => {
    const res = await apiClient.patch(`/products/update/${id}`, data);
    return res.data;
}

export const updateProductVariant = async (id: string, data: any) => {
    const res = await apiClient.patch(`/products/variant-update/${id}`, data);
    return res.data;
}

export const updateProductImage = async (id: string, data: any) => {
    const res = await apiClient.patch(`/products/image-update/${id}`, data);
    return res.data;
}

export const createProductImage = async (data: any) => {
    const res = await apiClient.patch(`/products/image-create`, data);
    return res.data;
}


export const getProducts = async (
    filters: any, 
    brandId?: string, 
    categoryId?: string
) => {
    const params = new URLSearchParams();
    if (brandId) params.append('brand_id', brandId);
    if (categoryId) params.append('category_id', categoryId);
    
    const res = await apiClient.post(`/products/get?${params.toString()}`, filters);
    return res.data;
}

export const getProductById = async (
    id: string
) => {
    const res = await apiClient.get(`/products/get-by-id/${id}`);
    return res.data;
}

export const getProductVariantById = async (
    id: string
) => {
    const res = await apiClient.get(`/products/get-variant-by-id/${id}`);
    return res.data;
}


export const searchProduct = async (keyword) => {
    const res = await apiClient.post(`/products/search?keyword=${keyword}`);
    return res.data;
}
export const getDisabledProducts = async (
    filters: any,
    brandId?: string,
    categoryId?: string
) => {
    const params = new URLSearchParams();
    if (brandId) params.append('brand_id', brandId);
    if (categoryId) params.append('category_id', categoryId);
    
    const res = await apiClient.post(`/product/get-disableds?${params.toString()}`, filters);
    return res.data;
}

export const getProductPrices = async (
    filters: any,
    variantId?: string
) => {
    const params = new URLSearchParams();
    if (variantId) params.append('variant_id', variantId);
    
    const res = await apiClient.post(`/product/get-prices?${params.toString()}`, filters);
    return res.data;
}


export const getProductVariants = async (filters: any) => {
    const res = await apiClient.post(`/products/get-variant`, filters);
    return res.data;
}
