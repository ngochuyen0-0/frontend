import { create } from "zustand";
import {
    createBrand,
    updateBrand,
    getBrands,
    getDisabledBrands,
} from "../services/brandService";

interface Brand {
    id: string;
    name: string;
    description: string;
    logo?: string;
    website?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface BrandState {
    brands: Brand[];
    disabledBrands: Brand[];
    currentBrand: Brand | null;
    loading: boolean;
    error: string | null;

    // Actions
    createBrand: (data: any) => Promise<any>;
    updateBrand: (id: string, data: any) => Promise<any>;
    getBrands: (filters?: any) => Promise<any>;
    getDisabledBrands: (filters?: any) => Promise<void>;
    setCurrentBrand: (brand: Brand | null) => void;
    clearError: () => void;
    clearBrands: () => void;
}

export const useBrandStore = create<BrandState>((set, get) => ({
    brands: [],
    disabledBrands: [],
    currentBrand: null,
    loading: false,
    error: null,

    createBrand: async (data) => {
        set({ loading: true, error: null });
        try {
            const newBrand = await createBrand(data);
            set((state) => ({
                brands: [...state.brands, newBrand],
                loading: false,
            }));
            return newBrand;
        } catch (error: any) {
            set({
                error: error.response?.data?.detail || "Failed to create brand",
                loading: false,
            });
            throw error;
        }
    },

    updateBrand: async (id, data) => {
        set({ loading: true, error: null });
        try {
            const updatedBrand = await updateBrand(id, data);
            set((state) => ({
                brands: state.brands.map((brand) =>
                    brand.id === id ? updatedBrand : brand
                ),
                currentBrand:
                    state.currentBrand?.id === id
                        ? updatedBrand
                        : state.currentBrand,
                loading: false,
            }));
            // return updateBrand;
        } catch (error: any) {
            set({
                error: error.response?.data?.detail || "Failed to update brand",
                loading: false,
            });
            throw error;
        }
    },

    getBrands: async (filters = {}) => {
        set({ loading: true, error: null });
        try {
            const response = await getBrands(filters);

            const items = Array.isArray(response?.data) ? response.data : [];

            set({
                brands: items,
                loading: false,
            });
            return response;
        } catch (error: any) {
            set({
                error: error.response?.data?.detail || "Failed to fetch brands",
                loading: false,
            });
            throw error;
        }
    },

    getDisabledBrands: async (filters = {}) => {
        set({ loading: true, error: null });
        try {
            const response = await getDisabledBrands(filters);
            set({
                disabledBrands: response.items || response,
                loading: false,
            });
        } catch (error: any) {
            set({
                error:
                    error.response?.data?.detail ||
                    "Failed to fetch disabled brands",
                loading: false,
            });
            throw error;
        }
    },

    setCurrentBrand: (brand) => {
        set({ currentBrand: brand });
    },

    clearError: () => {
        set({ error: null });
    },

    clearBrands: () => {
        set({ brands: [], disabledBrands: [], currentBrand: null });
    },
}));
