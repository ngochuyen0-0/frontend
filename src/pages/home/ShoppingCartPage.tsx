import {
    Breadcrumb,
    Card,
    Button,
    InputNumber,
    Divider,
    Empty,
    Tag,
    Space,
    Image,
} from "antd";
import React, { useEffect, useState } from "react";
import {
    DeleteOutlined,
    MinusOutlined,
    PlusOutlined,
    ShoppingCartOutlined,
    ArrowLeftOutlined,
} from "@ant-design/icons";
import { toast, Toaster } from "sonner";
import { getCart, removeFromCart, updateCartItem } from "../../services/cartService";
import {
    getProductById,
    getProductVariantById,
} from "../../services/productService";
import {
    Product,
    ProductVariant,
    ProductVariantSingle,
} from "../../types/product";
import { useNavigate } from "react-router-dom";

interface CartItem {
    id: string;
    product_id: string;
    name: string;
    price: number;
    qty: number;
    image: string;
    size?: string;
    color?: string;
}

const formatCurrency = (value: number): string =>
    new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(value);

const ShoppingCartPage: React.FC = () => {
    const [items, setItems] = useState<CartItem[]>([]);
    const navigator = useNavigate();

    useEffect(() => {
        const cartItems = getCart();
        const fecth = async () => {
            const results = await Promise.all(
                cartItems.map((item) => getProductVariantById(item.variant_id))
            ).catch((error) => { 
                console.error("Error fetching product variants:", error);
                clearCart();
                return [];
            });
            const itemsFecth = [] as CartItem[];
            results.forEach((e: ProductVariantSingle) => {
                const cartInfo = cartItems.find((c) => c.variant_id === e.id);
                const avata = e.product.images?.find((i) => i.is_thumbnail);
                const cartItem = {
                    id: e.id || "",
                    product_id: e.product_id || "",
                    name: e.product.name || "",
                    qty: cartInfo?.qty || 0,
                    size: e?.size || "",
                    color: e?.color || "",
                    price: e?.price || 0,
                    image: avata?.image_url || "",
                };
                itemsFecth.push(cartItem);
            });
            setItems(itemsFecth);
        };
        fecth();
    }, []);

    useEffect(() => {
        items.forEach((item) => {
            updateCartItem(item.product_id, item.id, item.qty);
        });
    }, [items]);

    const updateQty = (id: number, qty: number) => {
        if (qty < 1) return;

        setItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, qty: qty } : item))
        );

        if (qty === 0) {
            removeItem(id);
        }
    };

    const removeItem = (item: CartItem) => {
        setItems((prev) => prev.filter((e) => e.id !== item.id));
        removeFromCart(item.product_id, item.id)
        toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
    };

    const clearCart = () => {
        localStorage.removeItem("cart_items");
        toast.success("Đã xóa toàn bộ giỏ hàng");
    };

    const subtotal = items.reduce((acc, cur) => acc + cur.price * cur.qty, 0);
    const shippingFee = 0; // Free shipping
    // const tax = subtotal * 0.05; // 10% tax
    const total = subtotal + shippingFee;

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(items));
    }, [items]);

    return (
        <>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-6xl mx-auto px-4">
                    {/* Breadcrumb */}
                    <Breadcrumb className="mb-6">
                        <Breadcrumb.Item>
                            <a
                                href="/"
                                className="text-gray-500 hover:text-gray-700"
                            >
                                Trang chủ
                            </a>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item className="text-gray-900 font-medium">
                            Giỏ hàng
                        </Breadcrumb.Item>
                    </Breadcrumb>

                    {/* Page Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <ShoppingCartOutlined className="text-2xl text-blue-500" />
                            <h1 className="text-3xl font-bold text-gray-900">
                                Giỏ hàng của tôi
                            </h1>
                            <Tag color="blue" className="text-sm">
                                {items.length} sản phẩm
                            </Tag>
                        </div>

                        {items.length > 0 && (
                            <Button
                                type="link"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={clearCart}
                            >
                                Xóa tất cả
                            </Button>
                        )}
                    </div>

                    {items.length === 0 ? (
                        <Card className="text-center py-12">
                            <Empty
                                image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                                imageStyle={{ height: 100 }}
                                description={
                                    <span className="text-gray-600 text-lg">
                                        Giỏ hàng của bạn đang trống
                                    </span>
                                }
                            >
                                <div className="space-y-4">
                                    <p className="text-gray-500">
                                        Hãy thêm một số sản phẩm để bắt đầu mua
                                        sắm!
                                    </p>
                                    <Space>
                                        <Button
                                            type="primary"
                                            size="large"
                                            icon={<ArrowLeftOutlined />}
                                        >
                                            Tiếp tục mua sắm
                                        </Button>
                                    </Space>
                                </div>
                            </Empty>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left: Cart Items */}
                            <div className="lg:col-span-2 space-y-4">
                                {items.map((item) => (
                                    <Card
                                        key={item.id}
                                        className="hover:shadow-lg transition-shadow"
                                        bodyStyle={{ padding: "16px" }}
                                    >
                                        <div className="flex gap-4">
                                            {/* Product Image */}
                                            <div className="flex-shrink-0">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    width={120}
                                                    height={120}
                                                    className="rounded-lg object-cover"
                                                    fallback="https://via.placeholder.com/120x120?text=Product"
                                                    preview={false}
                                                />
                                            </div>

                                            {/* Product Info */}
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-lg text-gray-900 mb-2">
                                                            {item.name}
                                                        </h3>

                                                        {/* Product Variants */}
                                                        <Space
                                                            size="small"
                                                            className="mb-3"
                                                        >
                                                            {item.size && (
                                                                <Tag color="blue">
                                                                    Size:{" "}
                                                                    {item.size}
                                                                </Tag>
                                                            )}
                                                            {item.color && (
                                                                <Tag color="green">
                                                                    Màu:{" "}
                                                                    {item.color}
                                                                </Tag>
                                                            )}
                                                        </Space>

                                                        {/* Price */}
                                                        <p className="text-lg font-bold text-red-600 mb-3">
                                                            {formatCurrency(
                                                                item.price
                                                            )}
                                                        </p>

                                                        {/* Quantity Controls */}
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-gray-600 font-medium">
                                                                Số lượng:
                                                            </span>
                                                            <Button.Group>
                                                                <Button
                                                                    icon={
                                                                        <MinusOutlined />
                                                                    }
                                                                    onClick={() =>
                                                                        updateQty(
                                                                            item.id,
                                                                            item.qty -
                                                                            1
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        item.qty <=
                                                                        1
                                                                    }
                                                                />
                                                                {/* <InputNumber
                                                                    min={1}
                                                                    max={99}
                                                                    value={
                                                                        item.qty
                                                                    }
                                                                    onChange={(
                                                                        value
                                                                    ) =>
                                                                        updateQty(
                                                                            item.id,
                                                                            value ||
                                                                                1
                                                                        )
                                                                    }
                                                                    controls={
                                                                        false
                                                                    }
                                                                    className="w-16 text-center"
                                                                /> */}
                                                                <div className="w-16 text-center flex items-center justify-center border border-[#E5E7EB]">
                                                                    {item.qty}
                                                                </div>

                                                                <Button
                                                                    icon={
                                                                        <PlusOutlined />
                                                                    }
                                                                    onClick={() =>
                                                                        updateQty(
                                                                            item.id,
                                                                            item.qty +
                                                                            1
                                                                        )
                                                                    }
                                                                />
                                                            </Button.Group>
                                                        </div>
                                                    </div>

                                                    {/* Actions & Total */}
                                                    <div className="text-right flex flex-col items-end gap-3">
                                                        <div className="text-lg font-bold text-gray-900">
                                                            {formatCurrency(
                                                                item.price *
                                                                item.qty
                                                            )}
                                                        </div>
                                                        <Button
                                                            type="text"
                                                            danger
                                                            icon={
                                                                <DeleteOutlined />
                                                            }
                                                            onClick={() => {
                                                                removeItem(item)
                                                            }
                                                            }
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            Xóa
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>

                            {/* Right: Order Summary */}
                            <div className="lg:col-span-1">
                                <Card
                                    title="Tóm tắt đơn hàng"
                                    className="sticky top-4 shadow-lg"
                                >
                                    <Space
                                        direction="vertical"
                                        className="w-full"
                                    >
                                        {/* Price Breakdown */}
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                    Tạm tính:
                                                </span>
                                                <span className="font-medium">
                                                    {formatCurrency(subtotal)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                    Phí vận chuyển:
                                                </span>
                                                <span className="text-green-600 font-medium">
                                                    {shippingFee === 0
                                                        ? "Miễn phí"
                                                        : formatCurrency(
                                                            shippingFee
                                                        )}
                                                </span>
                                            </div>
                                            {/* <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                    Thuế (10%):
                                                </span>
                                                <span className="font-medium">
                                                    {formatCurrency(tax)}
                                                </span>
                                            </div> */}
                                            <Divider className="my-3" />
                                            <div className="flex justify-between text-lg font-bold">
                                                <span>Tổng cộng:</span>
                                                <span className="text-red-600">
                                                    {formatCurrency(total)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Checkout Button */}
                                        <Button
                                            type="primary"
                                            size="large"
                                            block
                                            className="h-12 bg-red-600 hover:bg-red-700 border-red-600 mt-4"
                                            onClick={() => {
                                                navigator("/checkout", {
                                                    state: {
                                                        cartItems: getCart(),
                                                    },
                                                });
                                            }}
                                        >
                                            Thanh toán ngay
                                        </Button>

                                        {/* Security Badge */}
                                        <div className="text-center mt-4 pt-4 border-t">
                                            <div className="flex justify-center gap-2 mb-2">
                                                <Tag color="green">
                                                    🔒 Bảo mật
                                                </Tag>
                                                <Tag color="blue">
                                                    ✓ SSL Secure
                                                </Tag>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                Thông tin thanh toán của bạn
                                                được bảo mật và mã hóa
                                            </p>
                                        </div>

                                        {/* Continue Shopping */}
                                        <Button
                                            type="default"
                                            block
                                            icon={<ArrowLeftOutlined />}
                                            className="mt-3"
                                        >
                                            Tiếp tục mua sắm
                                        </Button>
                                    </Space>
                                </Card>

                                {/* Promo Code */}
                                <Card className="mt-4" title="Mã giảm giá">
                                    <Space.Compact className="w-full">
                                        <InputNumber
                                            placeholder="Nhập mã giảm giá"
                                            className="flex-1"
                                        />
                                        <Button type="primary">Áp dụng</Button>
                                    </Space.Compact>
                                </Card>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Toaster position="top-right" richColors />
        </>
    );
};

export default ShoppingCartPage;
