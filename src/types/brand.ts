export interface Brand {
    id: string;
    name: string;
    description: string;
    logo_url?: string;
    featured?: boolean;
    is_active?: boolean;
    status: string;
    products?: number;
    created_at: string;
}
