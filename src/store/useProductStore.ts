import { create } from "zustand";
import {
    createProduct,
    createProductVariant,
    updateProduct,
    updateProductVariant,
    updateProductImage,
    getProducts,
    getDisabledProducts,
    getProductPrices,
    createProductImage,
    getProductVariants,
} from "../services/productService";

interface ProductVariant {
    id: string;
    product_id: string;
    sku: string;
    price: number;
    stock: number;
    attributes?: Record<string, any>;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface ProductImage {
    id: string;
    product_id: string;
    variant_id?: string;
    image_url: string;
    is_thumbnail: boolean;
    sort_order: number;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    brand_id: string;
    category_id: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    variants?: ProductVariant[];
    images?: ProductImage[];
    brand?: any;
    category?: any;
}

interface ProductPrice {
    id: string;
    variant_id: string;
    price: number;
    effective_date: string;
    created_at: string;
}

interface ProductState {
    products: Product[];
    variants: ProductVariant[];
    disabledProducts: Product[];
    productPrices: ProductPrice[];
    currentProduct: Product | null;
    currentVariant: ProductVariant | null;
    loading: boolean;
    error: string | null;

    // Actions
    createProduct: (data: any) => Promise<any>;
    createProductVariant: (data: any) => Promise<any>;
    updateProduct: (id: string, data: any) => Promise<any>;
    updateProductVariant: (id: string, data: any) => Promise<any>;
    updateProductImage: (id: string, data: any) => Promise<any>;
    createProductImage: (data: any) => Promise<any>;
    getProducts: (
        filters?: any,
        brandId?: string,
        categoryId?: string
    ) => Promise<any>;
    getProductVariants: (filters: any) => Promise<any>;
    getDisabledProducts: (
        filters?: any,
        brandId?: string,
        categoryId?: string
    ) => Promise<any>;
    getProductPrices: (filters?: any, variantId?: string) => Promise<any>;
    setCurrentProduct: (product: Product | null) => void;
    setCurrentVariant: (variant: ProductVariant | null) => void;
    clearError: () => void;
    clearProducts: () => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
    products: [],
    variants: [],
    disabledProducts: [],
    productPrices: [],
    currentProduct: null,
    currentVariant: null,
    loading: false,
    error: null,

    createProduct: async (data) => {
        set({ loading: true, error: null });
        try {
            const newProduct = await createProduct(data);
            set((state) => ({
                products: [...state.products, newProduct],
                loading: false,
            }));
            return newProduct;
        } catch (error: any) {
            set({
                error:
                    error.response?.data?.detail || "Failed to create product",
                loading: false,
            });
            throw error;
        }
    },

    createProductVariant: async (data) => {
        set({ loading: true, error: null });
        try {
            const newVariant = await createProductVariant(data);
            set((state) => {
                const updatedProducts = state.products.map((product) =>
                    product.id === newVariant.product_id
                        ? {
                            ...product,
                            variants: [
                                ...(product.variants || []),
                                newVariant,
                            ],
                        }
                        : product
                );

                let updatedCurrentProduct = state.currentProduct;
                if (
                    state.currentProduct &&
                    state.currentProduct.id === newVariant.product_id
                ) {
                    updatedCurrentProduct = {
                        ...state.currentProduct,
                        variants: [
                            ...(state.currentProduct.variants || []),
                            newVariant,
                        ],
                    };
                }

                return {
                    products: updatedProducts,
                    currentProduct: updatedCurrentProduct,
                    loading: false,
                };
            });
        } catch (error: any) {
            set({
                error:
                    error.response?.data?.detail ||
                    "Failed to create product variant",
                loading: false,
            });
            throw error;
        }
    },

    updateProduct: async (id, data) => {
        set({ loading: true, error: null });
        try {
            const updatedProduct = await updateProduct(id, data);
            set((state) => ({
                products: state.products.map((product) =>
                    product.id === id ? updatedProduct : product
                ),
                currentProduct:
                    state.currentProduct?.id === id
                        ? updatedProduct
                        : state.currentProduct,
                loading: false,
            }));
        } catch (error: any) {
            set({
                error:
                    error.response?.data?.detail || "Failed to update product",
                loading: false,
            });
            throw error;
        }
    },

    updateProductVariant: async (id, data) => {
        set({ loading: true, error: null });
        try {
            const updatedVariant = await updateProductVariant(id, data);
            set((state) => ({
                products: state.products.map((product) => ({
                    ...product,
                    variants:
                        product.variants?.map((variant) =>
                            variant.id === id ? updatedVariant : variant
                        ) || [],
                })),
                currentVariant:
                    state.currentVariant?.id === id
                        ? updatedVariant
                        : state.currentVariant,
                currentProduct: state.currentProduct
                    ? {
                        ...state.currentProduct,
                        variants:
                            state.currentProduct.variants?.map((variant) =>
                                variant.id === id ? updatedVariant : variant
                            ) || [],
                    }
                    : state.currentProduct,
                loading: false,
            }));
        } catch (error: any) {
            set({
                error:
                    error.response?.data?.detail ||
                    "Failed to update product variant",
                loading: false,
            });
            throw error;
        }
    },

    updateProductImage: async (id, data) => {
        set({ loading: true, error: null });
        try {
            const updatedImage = await updateProductImage(id, data);
            set((state) => ({
                products: state.products.map((product) => ({
                    ...product,
                    images:
                        product.images?.map((image) =>
                            image.id === id ? updatedImage : image
                        ) || [],
                })),
                currentProduct: state.currentProduct
                    ? {
                        ...state.currentProduct,
                        images:
                            state.currentProduct.images?.map((image) =>
                                image.id === id ? updatedImage : image
                            ) || [],
                    }
                    : state.currentProduct,
                loading: false,
            }));
        } catch (error: any) {
            set({
                error:
                    error.response?.data?.detail ||
                    "Failed to update product image",
                loading: false,
            });
            throw error;
        }
    },
    createProductImage: async (data) => {
        set({ loading: true, error: null });
        try {
            const updatedImage = await createProductImage(data);

        } catch (error: any) {
            set({
                error:
                    error.response?.data?.detail ||
                    "Failed to update product image",
                loading: false,
            });
            throw error;
        }
    },

    getProducts: async (filters = {}, brandId, categoryId) => {
        set({ loading: true, error: null });
        try {
            const response = await getProducts(filters, brandId, categoryId);
            set({
                products: response.data,
                loading: false,
            });
        } catch (error: any) {
            set({
                error:
                    error.response?.data?.detail || "Failed to fetch products",
                loading: false,
            });
            throw error;
        }
    },


    getDisabledProducts: async (filters = {}, brandId, categoryId) => {
        set({ loading: true, error: null });
        try {
            const response = await getDisabledProducts(
                filters,
                brandId,
                categoryId
            );
            set({
                disabledProducts: response.items || response,
                loading: false,
            });
        } catch (error: any) {
            set({
                error:
                    error.response?.data?.detail ||
                    "Failed to fetch disabled products",
                loading: false,
            });
            throw error;
        }
    },
    getProductVariants: async (filters = {}) => {
        set({ loading: true, error: null });
        try {
            const response = await getProductVariants(filters);
            set({
                variants: response.data,
                loading: false,
            });
        } catch (error: any) {
            set({
                error:
                    error.response?.data?.detail || "Failed to fetch products",
                loading: false,
            });
            throw error;
        }
    },
    getProductPrices: async (filters = {}, variantId) => {
        set({ loading: true, error: null });
        try {
            const response = await getProductPrices(filters, variantId);
            set({
                productPrices: response.items || response,
                loading: false,
            });
        } catch (error: any) {
            set({
                error:
                    error.response?.data?.detail ||
                    "Failed to fetch product prices",
                loading: false,
            });
            throw error;
        }
    },

    setCurrentProduct: (product) => {
        set({ currentProduct: product });
    },

    setCurrentVariant: (variant) => {
        set({ currentVariant: variant });
    },

    clearError: () => {
        set({ error: null });
    },

    clearProducts: () => {
        set({
            products: [],
            disabledProducts: [],
            productPrices: [],
            currentProduct: null,
            currentVariant: null,
        });
    },
}));
