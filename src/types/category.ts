export interface Category {
    id: string;
    icon: string;
    name: string;
    description: string;
    parent_id?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    children?: Category[]; // For nested categories
}
