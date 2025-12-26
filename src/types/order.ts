export interface Order {
    fullname: string,
    email: string,
    status: string,
    province: string,
    zipcode: string,
    shipping_method: string,
    ward: string,
    specific_address: string,
    total_amount: number,
    id: string,
    phone: string,
    user_id: string,
    city: string,
    country: string,
    payment_method: string,
    created_at: string,
    items: OrderItem[]
}

export interface OrdersData {
    data: Order[]
    max_page: number,
    page: number,
    row: number,
    total: number,
}


export interface OrderItem {
    id: string;
    quantity: number;
    variant_id: string;
    price: number;
    product_name?: string;
    sku?: string;
    size?: string;
    color?: string;
}
