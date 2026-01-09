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
    // Đảm bảo gửi thông tin phân trang để lấy nhiều sản phẩm hơn
    const defaultFilters = {
        page: 1,
        row: 100,  // Tăng số lượng sản phẩm mỗi trang
        ...filters  // Ghi đè bằng các bộ lọc được cung cấp
    };
    
    const params = new URLSearchParams();
    if (brandId) params.append('brand_id', brandId);
    if (categoryId) params.append('category_id', categoryId);
    
    const res = await apiClient.post(`/products/get?${params.toString()}`, defaultFilters);
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
    // Gọi API tìm kiếm với phân trang
    const filters = {
        page: 1,
        page_size: 100,  // Tăng số lượng sản phẩm mỗi trang
    };
    const res = await apiClient.post(`/products/search?keyword=${keyword}`, filters);
    return res.data;
}
export const getDisabledProducts = async (
    filters: any,
    brandId?: string,
    categoryId?: string
) => {
    // Đảm bảo gửi thông tin phân trang để lấy nhiều sản phẩm hơn
    const defaultFilters = {
        page: 1,
        row: 100,  // Tăng số lượng sản phẩm mỗi trang
        ...filters  // Ghi đè bằng các bộ lọc được cung cấp
    };
    
    const params = new URLSearchParams();
    if (brandId) params.append('brand_id', brandId);
    if (categoryId) params.append('category_id', categoryId);
    
    const res = await apiClient.post(`/product/get-disableds?${params.toString()}`, defaultFilters);
    return res.data;
}

export const getProductPrices = async (
    filters: any,
    variantId?: string
) => {
    // Đảm bảo gửi thông tin phân trang để lấy nhiều sản phẩm hơn
    const defaultFilters = {
        page: 1,
        row: 100,  // Tăng số lượng sản phẩm mỗi trang
        ...filters  // Ghi đè bằng các bộ lọc được cung cấp
    };
    
    const params = new URLSearchParams();
    if (variantId) params.append('variant_id', variantId);
    
    const res = await apiClient.post(`/product/get-prices?${params.toString()}`, defaultFilters);
    return res.data;
}


export const getProductVariants = async (filters: any) => {
    // Đảm bảo gửi thông tin phân trang để lấy nhiều sản phẩm hơn
    const defaultFilters = {
        page: 1,
        row: 100,  // Tăng số lượng sản phẩm mỗi trang
        ...filters  // Ghi đè bằng các bộ lọc được cung cấp
    };
    
    const res = await apiClient.post(`/products/get-variant`, defaultFilters);
    return res.data;
}

export const deleteProduct = async (id: string) => {
    const res = await apiClient.delete(`/products/delete/${id}`);
    return res.data;
}

export const deleteProductImage = async (id: string) => {
    const res = await apiClient.delete(`/products/image-delete/${id}`);
    return res.data;
}

export const toggleProductStatus = async (id: string, isActive: boolean) => {
    const status = isActive ? 'ACTIVE' : 'DRAFT';
    const res = await apiClient.patch(`/products/update/${id}`, { status: status });
    return res.data;
}
