export interface ProductVariant {
    id?: string;
    product_id?: string;
    sku?: string;
    size?: string;
    price?: number;
    stock?: number;
    attributes?: Record<string, any>;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
    color?: string;
}

export interface ProductVariantSingle {
    id?: string;
    product_id?: string;
    sku?: string;
    size?: string;
    price?: number;
    stock?: number;
    attributes?: Record<string, any>;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
    color?: string;
    product: {
        id: string;
        name?: string;
        description?: string;
        brand_id?: string;
        category_id?: string;
        is_active?: boolean;
        created_at?: string;
        updated_at?: string;
        images?: ProductImage[];
        brand?: any;
        category?: any;
    }
}


export interface ProductImage {
    id?: string;
    product_id?: string;
    variant_id?: string;
    image_url?: string;
    is_thumbnail?: boolean;
    sort_order?: number;
}

export interface Product {
    id: string;
    name?: string;
    description?: string;
    brand_id?: string;
    category_id?: string;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
    variants?: ProductVariant[];
    images?: ProductImage[];
    brand?: any;
    category?: any;
}

export interface ProductPrice {
    id?: string;
    variant_id?: string;
    price?: number;
    effective_date?: string;
    created_at?: string;
}
