export interface Category {
    id: string;
    name: string;
    slug?: string;
    description?: string;
}

export interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    image_urls: string[];
    category_id?: string;
    sizes: string[];
    is_active?: boolean;
    created_at?: string;
    categories?: Category; // Join result from Supabase
}

export interface CartItem {
    product: Product;
    quantity: number;
    selectedSize: string;
}
