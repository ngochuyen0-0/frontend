import { create } from "zustand";
import {
    createCategory,
    updateCategory,
    getCategories,
    getDisabledCategories,
} from "../services/categoryService";

interface Category {
    id: string;
    name: string;
    description: string;
    parent_id?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    children?: Category[]; // For nested categories
}

interface CategoryState {
    categories: Category[];
    disabledCategories: Category[];
    currentCategory: Category | null;
    loading: boolean;
    error: string | null;
    
    // Actions
    createCategory: (data: any) => Promise<any>;
    updateCategory: (id: string, data: any) => Promise<void>;
    getCategories: (filters?: any) => Promise<any>;
    getDisabledCategories: (filters?: any) => Promise<void>;
    setCurrentCategory: (category: Category | null) => void;
    clearError: () => void;
    clearCategories: () => void;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
    categories: [],
    disabledCategories: [],
    currentCategory: null,
    loading: false,
    error: null,

    createCategory: async (data) => {
        set({ loading: true, error: null });
        try {
            const newCategory = await createCategory(data);
            set((state) => ({ 
                categories: [...state.categories, newCategory],
                loading: false 
            }));
        } catch (error: any) {
            set({ 
                error: error.response?.data?.detail || "Failed to create category",
                loading: false 
            });
            throw error;
        }
    },

    updateCategory: async (id, data) => {
        set({ loading: true, error: null });
        try {
            const updatedCategory = await updateCategory(id, data);
            set((state) => ({
                categories: state.categories.map(category => 
                    category.id === id ? updatedCategory : category
                ),
                currentCategory: state.currentCategory?.id === id ? updatedCategory : state.currentCategory,
                loading: false
            }));
        } catch (error: any) {
            set({ 
                error: error.response?.data?.detail || "Failed to update category",
                loading: false 
            });
            throw error;
        }
    },

    getCategories: async (filters = {}) => {
        set({ loading: true, error: null });
        try {
            const response = await getCategories(filters);

            const items = Array.isArray(response?.data) ? response.data : [];

            set({ 
                categories: items,
                loading: false 
            });
            return response;
        } catch (error: any) {
            set({ 
                error: error.response?.data?.detail || "Failed to fetch categories",
                loading: false 
            });
            throw error;
        }
    },

    getDisabledCategories: async (filters = {}) => {
        set({ loading: true, error: null });
        try {
            const response = await getDisabledCategories(filters);
            set({ 
                disabledCategories: response.items || response,
                loading: false 
            });
        } catch (error: any) {
            set({ 
                error: error.response?.data?.detail || "Failed to fetch disabled categories",
                loading: false 
            });
            throw error;
        }
    },

    setCurrentCategory: (category) => {
        set({ currentCategory: category });
    },

    clearError: () => {
        set({ error: null });
    },

    clearCategories: () => {
        set({ categories: [], disabledCategories: [], currentCategory: null });
    },
}));