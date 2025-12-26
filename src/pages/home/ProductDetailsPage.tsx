import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Breadcrumb, Rate, Tabs, TabsProps, Tag } from "antd";
import CartIcon from '../../icons/CartIcon'
import HeartSolid from '../../icons/HeartSolid'
import { toast, Toaster } from "sonner";
import { Product, ProductVariant } from "../../types/product";
import { getProducts } from "../../services/productService";
import ProductCard from "../../components/card/ProductCard";
import { addToCart } from "../../services/cartService";


const formatCurrency = (value: number): string =>
    new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "VND",
    }).format(value);

const onChange = (key: string) => {
    console.log(key);
};

const items: TabsProps["items"] = [
    {
        key: "1",
        label: "Description",
        children: "Content of Tab Pane 1",
    },
    {
        key: "2",
        label: <span>Reviews (1)</span>,
        children: "Content of Tab Pane 2",
    },
];

const ProductDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [newProducts, setNewProduct] = useState<Product[]>([]);

    const [product, setThisProduct] = useState<Product>();
    const [inSale, setInSale] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);

    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectVariant, setSelectVariant] = useState<ProductVariant>();
    const [qty, setQty] = useState<number>(1);
    const navigate = useNavigate();
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });

        getProducts({ id: id }).then(res => {
            setThisProduct(res?.data?.[0]);
        }).catch();
    }, [id])
    useEffect(() => {
        getProducts({})
            .then((res) => {
                setNewProduct(res?.data);
            })
            .catch();
    }, []);


    const images = useMemo<string[]>(() => {
        if (!product) return [];
        return product.images;
    }, [product]);

    React.useEffect(() => {
        setSelectedIndex(0);
    }, [images]);
    React.useEffect(() => {
        setSelectVariant(product?.variants?.[0]);
    }, [product]);

    const priceRange = useMemo(() => {
        if (!product?.variants?.length) return null;
        const prices = product.variants.map((v) => v.price);
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        return { min, max };
    }, [product]);


    if (!product) {
        return (
            <>
                <div className="px-[10%] py-8">
                    <h2 className="text-xl font-semibold">Product not found</h2>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="px-[10%] py-8">
                <Breadcrumb>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <a href="">Application Center</a>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <a href="">Application List</a>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>An Application</Breadcrumb.Item>
                </Breadcrumb>

                {/* Top section: Image + Info */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                    {/* Image gallery: main image slider + thumbnails */}
                    <div className="rounded-lg border border-[#E5E7EB] bg-white p-4">
                        <div className="w-full h-72 overflow-hidden bg-white rounded-md">
                            <div className="w-full h-full overflow-hidden rounded-md">
                                <div
                                    className="flex h-48 transition-transform duration-300 ease-out"
                                    style={{
                                        transform: `translateX(-${selectedIndex * 100
                                            }%)`,
                                    }}
                                >
                                    {images.map((img, i) => (
                                        <div
                                            key={i}
                                            className="basis-full shrink-0 grow-0 h-48"
                                        >
                                            <img
                                                src={img.image_url}
                                                alt={product.name}
                                                className="w-full h-72 object-contain"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {images.length > 1 && (
                            <div className="mt-3 flex justify-center">
                                <div className="inline-flex flex-wrap justify-center gap-2">
                                    {images.map((img, i) => {
                                        const isActive = selectedIndex === i;
                                        return (
                                            <button
                                                key={img}
                                                type="button"
                                                onClick={() =>
                                                    setSelectedIndex(i)
                                                }
                                                aria-label="Select product image"
                                                aria-selected={isActive}
                                                className={`relative w-16 sm:w-20 md:w-24 lg:w-24 h-16 sm:h-20 md:h-24 lg:h-24 rounded-md border overflow-hidden transition ${isActive
                                                        ? "border-blue-600 ring-2 ring-blue-200"
                                                        : "border-[#E5E7EB] hover:border-blue-400"
                                                    }`}
                                            >
                                                <img
                                                    src={img.image_url}
                                                    alt={product.name}
                                                    className="w-full h-[70%] object-contain"
                                                />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div>
                        <h1 className="text-2xl font-bold text-[#111827]">
                            {product.name}
                        </h1>

                        <div className="mt-3 flex items-center gap-2">
                            <div className=" border-r border-r-[#D1D5DB] pr-3 flex items-center gap-2">
                                <Rate
                                    disabled
                                    allowHalf
                                    defaultValue={5}
                                    style={{ fontSize: "14px" }}
                                />
                                <div className="p-1 rounded-lg border border-[#D1D5DB]">
                                    <span className="text-sm text-[#6B7280]">
                                        {(5).toFixed(1)} / 5
                                    </span>
                                </div>
                            </div>

                            <div className="ml-2">
                                <span className="text-[#6B7280]">SKU:</span>
                                <span className="ml-2">
                                    {selectVariant?.sku}
                                </span>
                            </div>
                        </div>

                        <hr style={{ color: "#D1D5DB", margin: "20px 0px" }} />

                        <p className="text-[#4B5563]">
                            {product.description ??
                                "Premium materials, modern design, and everyday comfort. Perfect for urban lifestyle and casual outfits."}
                        </p>

                        <div className="mt-4 flex items-center gap-3">
                            {selectVariant ? (
                                <span className="text-[#111827] font-semibold text-2xl">
                                    {formatCurrency(selectVariant.price || 0)}
                                </span>
                            ) : priceRange ? (
                                priceRange.min === priceRange.max ? (
                                    <span className="text-[#111827] font-semibold text-2xl">
                                        {formatCurrency(priceRange.min)}
                                    </span>
                                ) : (
                                    <span className="text-[#111827] font-semibold text-2xl">
                                        {`${formatCurrency(
                                            priceRange.min
                                        )} - ${formatCurrency(priceRange.max)}`}
                                    </span>
                                )
                            ) : null}
                        </div>

                        {/* Size selector */}
                        <div className="mt-6">
                            <div className="text-sm font-medium text-[#111827] mb-2">
                                Size
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {product?.variants?.map((e, i) => {
                                    const active = selectVariant?.size === e.size;
                                    return (
                                        <button
                                            key={e.size}
                                            type="button"
                                            onClick={() => {
                                                setSelectVariant(e)
                                            }}
                                            className={`px-3 py-2 rounded-md border text-sm transition-colors ${active
                                                    ? "border-blue-600 text-blue-600 bg-blue-50"
                                                    : "border-[#E5E7EB] text-[#111827] hover:border-blue-400"
                                                }`}
                                        >
                                            {e.size}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="text-sm font-medium text-[#111827] mb-2">
                                Color
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {product?.variants?.map((e, i) => {
                                    const active = selectVariant?.color === e.color;
                                    return (
                                        <Tag
                                            key={e.size}
                                            onClick={() => {
                                                setSelectVariant(e)
                                            }}
                                            style={{
                                                cursor: "pointer"
                                            }}
                                            color={e.color}
                                        >
                                            {e.color}
                                        </Tag>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Quantity + Actions */}
                        <div className="mt-6 flex items-center gap-4">
                            <div className="flex items-center border border-[#E5E7EB] rounded-md overflow-hidden">
                                <button
                                    type="button"
                                    className="w-9 h-9 grid place-items-center hover:bg-gray-50"
                                    onClick={() =>
                                        setQty((q) => Math.max(1, q - 1))
                                    }
                                >
                                    -
                                </button>
                                <div className="w-12 text-center">{qty}</div>
                                <button
                                    type="button"
                                    className="w-9 h-9 grid place-items-center hover:bg-gray-50"
                                    onClick={() => setQty((q) => q + 1)}
                                >
                                    +
                                </button>
                            </div>

                            <button
                                type="button"
                                className="flex items-center gap-3 cursor-pointer px-6 py-3 rounded-md bg-[#16A34A]  hover:opacity-80 transition-colors duration-300"
                                onClick={() => {
                                    addToCart({ id: product.id, variant_id: selectVariant?.id, qty });
                                    toast.success('Add successfully')
                                }}
                                style={{ color: '#fff' }}
                            >
                                <CartIcon className="size-4" />
                                Add to Cart
                            </button>

                            <button
                                type="button"
                                className="cursor-pointer flex items-center gap-3 px-6 py-3 rounded-md border bg-[#000] !text-white hover:opacity-80 "
                                onClick={() => console.log("Buy now", { id: product.id, size: selectVariant?.size, qty })}
                            >
                                <CartIcon className="size-4" />
                                Buy Now
                            </button>
                        </div>
                        <div className="flex items-center mt-4 gap-4">
                            <div className="border border-[#E5E7EB] rounded-lg p-2 cursor-pointer">
                                <HeartSolid className="w-5 h-5" />
                            </div>
                            <span>Add to wishlist</span>
                        </div>
                    </div>
                </div>

                {/* Details tabs placeholder */}
                <div className="mt-20">
                    <div className="rounded-lg border border-[#E5E7EB] bg-white p-5">
                        {/* <h3 className="font-semibold text-[#111827] mb-3">Product Details</h3>
                        <ul className="list-disc pl-5 text-[#4B5563] space-y-1">
                            <li>Upper: Breathable mesh / premium synthetic overlays</li>
                            <li>Midsole: Cushioned foam with responsive feel</li>
                            <li>Outsole: Durable rubber for traction</li>
                            <li>Care: Spot clean with mild detergent</li>
                        </ul> */}

                        <Tabs
                            defaultActiveKey="1"
                            items={items}
                            onChange={onChange}
                        />
                    </div>
                </div>

                {/* Related products placeholder */}
                <div className="mt-10">
                    <h3 className="font-semibold text-[#111827] mb-4">
                        Related Products
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {newProducts.map((p) => {
                            const thumbnail = p.images?.find(
                                (p) => p.is_thumbnail
                            );
                            const variants = p.variants || [];
                            let index = 0;
                            let min = Infinity;
                            variants.forEach((v, i) => {
                                if (v.price < min) {
                                    min = v.price;
                                    index = i;
                                }
                            });
                            const minPriceVariant = variants[index];
                            return (
                                <ProductCard
                                    key={p.id}
                                    id={p.id}
                                    name={p.name || ""}
                                    imageUrl={thumbnail?.image_url}
                                    price={minPriceVariant.price}
                                    rating={4.3}
                                    salePrice={0.4}
                                />
                        );
                        })}
                    </div>
                </div>
            </div>

            <Toaster position="top-right" richColors />
        </>
    );
};

export default ProductDetailsPage;
