import React, { useState } from "react";
import { Rate, Badge } from "antd";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import { toast, Toaster } from "sonner";
import { useNavigate } from "react-router-dom";

type ProductCardProps = {
    id: string,
    name?: string;
    imageUrl?: string;
    price?: number;
    rating?: number; // 0..5
    salePrice?: number;
    onClick?: () => void;
    onAddToCart?: () => void;
};

const formatCurrency = (value: number): string =>
    new Intl.NumberFormat(undefined, { style: 'currency', currency: 'VND' }).format(value);

const ProductCard: React.FC<ProductCardProps> = ({id, name, imageUrl, price, rating, salePrice, onClick, onAddToCart }) => {

    const [isAddToWishlist, setIsAddToWishlist] = useState(false);
    const navigate = useNavigate();

    return (
        <>
            <div
                className="cursor-pointer group select-none rounded-md border relative p-4 border-[#E5E7EB]"
                onClick={() => navigate(`/product/${id}`)}
            >
                <div className={`w-[24px] h-[24px] z-[1] absolute rounded-full right-0 top-[10px] transition-all 
                duration-300 hover:scale-125 ${isAddToWishlist ? 'scale-110' : ''}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsAddToWishlist(!isAddToWishlist);
                        toast.success(!isAddToWishlist ? <div>
                            Add to wishlist successfully. <a href="/wishlist" className="underline">Go to wishlist products</a>
                        </div> : <div>
                            Removed to wishlist successfully.
                        </div>)
                    }}
                >
                    {isAddToWishlist ? <HeartFilled /> : <HeartOutlined />}
                </div>
                <div className="w-full aspect-square overflow-hidden p-[12px] bg-white">
                    <img
                        src={imageUrl}
                        alt={name}
                        className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                </div>

                <div className="mt-3">
                    <div className="my-2 flex items-center gap-2">
                        <Rate disabled allowHalf defaultValue={rating} style={{ fontSize: '12px' }} />
                        <span className="text-xs text-[#6B7280]">{rating.toFixed(1)}</span>
                    </div>
                    <div className="text-[14px] text-[#111827] line-clamp-2 min-h-[40px]">{name}</div>
                    <div className=" flex items-center gap-2 text-[12px]">
                        {/* {salePrice !== undefined ? (
                            <>
                                <span className="text-red-600 font-semibold text-[15px]">{formatCurrency(price)}</span>
                                <span className="text-[#9CA3AF] line-through">{formatCurrency(salePrice)}</span>
                            </>
                        ) : (
                        )} */}
                        <span className="text-[#111827] font-semibold text-[15px]">{formatCurrency(price)}</span>
                    </div>

                </div>

            </div>

        </>
    )
}

export default ProductCard;