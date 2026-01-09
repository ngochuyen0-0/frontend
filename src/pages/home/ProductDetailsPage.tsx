import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Breadcrumb, Rate, Tabs, TabsProps, Tag, Button, message } from "antd";
import CartIcon from '../../icons/CartIcon'
import HeartSolid from '../../icons/HeartSolid'
import { toast, Toaster } from "sonner";
import { Product, ProductImage, ProductVariant } from "../../types/product";
import { getProducts } from "../../services/productService";
import ProductCard from "../../components/card/ProductCard";
import { addToCart } from "../../services/cartService";


const formatCurrency = (value: number): string =>
    new Intl.NumberFormat('vi-VN', {
        style: "currency",
        currency: "VND",
        minimumFractionDigits: 0,
    }).format(value);

const onChange = (key: string) => {
    console.log(key);
};

const ProductDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [newProducts, setNewProduct] = useState<Product[]>([]);

    const [product, setThisProduct] = useState<Product>();
    const [inSale, setInSale] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);

    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectVariant, setSelectVariant] = useState<ProductVariant>();
    const [qty, setQty] = useState<number>(1);
    const [activeTab, setActiveTab] = useState<string>('1');
    const [isInWishlist, setIsInWishlist] = useState<boolean>(false);
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


    const images = useMemo<ProductImage[]>(() => {
        if (!product || !product.images) return [];
        return product.images;
    }, [product]);

    React.useEffect(() => {
        setSelectedIndex(0);
    }, [images]);
    
    React.useEffect(() => {
        setSelectVariant(product?.variants?.[0]);
    }, [product]);
    
    // Kiểm tra xem sản phẩm có trong wishlist không
    useEffect(() => {
        if (product) {
            const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
            const isInWishlist = wishlist.some((item: any) => item.id === product.id);
            setIsInWishlist(isInWishlist);
        }
    }, [product]);

    const toggleWishlist = () => {
        if (!product) return;
        
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        const existingIndex = wishlist.findIndex((item: any) => item.id === product.id);
        
        if (existingIndex > -1) {
            // Xóa sản phẩm khỏi wishlist
            wishlist.splice(existingIndex, 1);
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            setIsInWishlist(false);
            toast.success('Đã xóa khỏi danh sách yêu thích!');
        } else {
            // Thêm sản phẩm vào wishlist
            // Lấy variant hiện tại hoặc variant đầu tiên
            const variant = selectVariant || product.variants?.[0];
            const wishlistItem = {
                id: product.id,
                productId: product.id,
                name: product.name,
                imageUrl: product.images?.[0]?.image_url || '',
                price: variant?.price || 0,
                salePrice: 0, // Không có thông tin giảm giá trong dữ liệu hiện tại
                rating: 4.5, // Không có thông tin đánh giá cụ thể trong dữ liệu hiện tại
                stock: variant?.stock_quantity || 100,
                addedAt: new Date(),
                category: 'General' // Không có thông tin category trong dữ liệu hiện tại
            };
            
            wishlist.push(wishlistItem);
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            setIsInWishlist(true);
            toast.success('Đã thêm vào danh sách yêu thích!');
        }
    };

    const priceRange = useMemo(() => {
        if (!product?.variants?.length) return null;
        const prices = product.variants.map((v) => v?.price || 0).filter(p => p > 0);
        if (prices.length === 0) return null;
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        return { min, max };
    }, [product]);


    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy sản phẩm</h2>
                    <Button type="primary" onClick={() => navigate('/')}>
                        Quay về trang chủ
                    </Button>
                </div>
            </div>
        );
    }

    const items: TabsProps["items"] = [
        {
            key: "1",
            label: "Mô tả",
            children: (
                <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                        {product.description || "Sản phẩm với chất liệu cao cấp, thiết kế hiện đại và sự thoải mái hàng ngày. Hoàn hảo cho phong cách sống đô thị và trang phục thường ngày."}
                    </p>
                    <div className="mt-6">
                        <h4 className="font-semibold text-gray-800 mb-3">Đặc điểm nổi bật:</h4>
                        <ul className="list-disc pl-5 space-y-2 text-gray-700">
                            <li>Chất liệu: Cao cấp, bền đẹp</li>
                            <li>Thiết kế: Hiện đại, thời trang</li>
                            <li>Độ bền: Cao, dễ bảo quản</li>
                            <li>Phù hợp: Mọi hoàn cảnh sử dụng</li>
                        </ul>
                    </div>
                </div>
            ),
        },
        {
            key: "2",
            label: <span>Đánh giá (0)</span>,
            children: (
                <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-gray-800">Đánh giá trung bình</h4>
                            <div className="flex items-center gap-2">
                                <Rate
                                    disabled
                                    value={4.5}
                                    className="text-lg"
                                />
                                <span className="text-gray-600">({4.5.toFixed(1)})</span>
                            </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                                className="bg-yellow-400 h-2.5 rounded-full"
                                style={{ width: `${(4.5 / 5) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-800">Viết đánh giá của bạn</h4>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-700 text-sm">Xếp hạng:</span>
                            <Rate onChange={(value) => console.log(value)} />
                        </div>
                        <textarea
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 min-h-24 text-sm"
                            rows={3}
                            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                        ></textarea>
                        <Button
                            type="primary"
                            className="mt-2 px-4 py-2 rounded-lg text-sm font-medium"
                        >
                            Gửi đánh giá
                        </Button>
                    </div>
                </div>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Breadcrumb className="mb-8 text-lg">
                    <Breadcrumb.Item>
                        <a href="/" className="text-blue-600 hover:text-blue-800 transition-colors">Trang chủ</a>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <a href="/products" className="text-blue-600 hover:text-blue-800 transition-colors">Sản phẩm</a>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item className="text-gray-900 font-medium">{product.name}</Breadcrumb.Item>
                </Breadcrumb>

                {/* Top section: Two equal columns */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                    {/* Left column: Image gallery */}
                    <div className="bg-white rounded-xl shadow-md p-6 h-full">
                        <div className="flex flex-col h-full">
                            <div className="flex-1 flex flex-col">
                                <div className="relative overflow-hidden rounded-lg bg-gray-50 shadow-inner flex-1">
                                    <div className="relative w-full h-full overflow-hidden rounded-lg bg-white">
                                        <div
                                            className="flex h-full transition-transform duration-500 ease-in-out"
                                            style={{
                                                transform: `translateX(-${selectedIndex * 100}%)`,
                                            }}
                                        >
                                            {images.map((img, i) => (
                                                <div
                                                    key={i}
                                                    className="w-full h-full flex-shrink-0 flex items-center justify-center bg-white"
                                                >
                                                    <img
                                                        src={img.image_url}
                                                        alt={product.name}
                                                        className="w-auto h-auto object-contain transition-all duration-300 hover:opacity-95"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        
                                        {/* Navigation arrows */}
                                        {images.length > 1 && (
                                            <>
                                                <button
                                                    onClick={() => setSelectedIndex(prev => prev > 0 ? prev - 1 : images.length - 1)}
                                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110"
                                                    aria-label="Previous image"
                                                >
                                                    <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => setSelectedIndex(prev => prev < images.length - 1 ? prev + 1 : 0)}
                                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110"
                                                    aria-label="Next image"
                                                >
                                                    <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Thumbnails below main image */}
                            {images.length > 1 && (
                                <div className="mt-4 flex flex-wrap gap-3 justify-center">
                                    {images.map((img, i) => {
                                        const isActive = selectedIndex === i;
                                        return (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => setSelectedIndex(i)}
                                                aria-label="Select product image"
                                                aria-selected={isActive}
                                                className={`relative w-16 h-16 rounded-md border-2 overflow-hidden transition-all duration-300 ${isActive
                                                        ? "border-blue-500 ring-2 ring-blue-200 scale-[1.05] shadow-md"
                                                        : "border-gray-300 hover:border-blue-400"
                                                    }`}
                                            >
                                                <img
                                                    src={img.image_url}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover transition-opacity duration-300"
                                                />
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Info column - same size as image column */}
                    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col">
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h1 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
                                    {product.name}
                                </h1>
                                
                                {/* Wishlist button at the top */}
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`border rounded-xl p-2 cursor-pointer transition-colors duration-300 ${isInWishlist ? 'bg-red-100 border-red-500' : 'border-gray-300 hover:bg-red-50'}`}
                                        onClick={() => toggleWishlist()}
                                    >
                                        <HeartSolid className={`w-5 h-5 ${isInWishlist ? 'text-red-500' : 'text-gray-600'}`} style={isInWishlist ? { fill: 'currentColor' } : {}} />
                                    </div>
                                    <span className="text-sm text-gray-700 font-medium">Yêu thích</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-200">
                                <div className="flex items-center">
                                    <Rate
                                        disabled
                                        allowHalf
                                        value={4.5}
                                        className="text-base"
                                    />
                                    <span className="ml-2 text-gray-700 font-medium text-sm">({4.5.toFixed(1)})</span>
                                </div>

                                <div className="h-4 w-px bg-gray-300"></div>
                                
                                <div>
                                    <span className="text-gray-600 text-sm">Mã sản phẩm:</span>
                                    <span className="ml-1 font-semibold text-gray-900 text-sm">
                                        {selectVariant?.sku || 'N/A'}
                                    </span>
                                </div>
                            </div>

                            <div className="mb-6">
                                <div className="text-sm text-gray-600">Chọn kích thước và màu sắc để xem chi tiết sản phẩm</div>
                            </div>

                            <div className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                                <div className="text-2xl font-bold text-gray-900">
                                    {selectVariant ? (
                                        <span>{formatCurrency(selectVariant.price || 0)}</span>
                                    ) : priceRange ? (
                                        priceRange.min === priceRange.max ? (
                                            <span>{formatCurrency(priceRange.min)}</span>
                                        ) : (
                                            <span>{`${formatCurrency(
                                                priceRange.min
                                            )} - ${formatCurrency(priceRange.max)}`}</span>
                                        )
                                    ) : null}
                                </div>
                                <div className="mt-1 text-xs text-gray-600">Giá đã bao gồm VAT</div>
                            </div>

                            {/* Size selector */}
                            <div className="mb-4">
                                <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
                                    <span className="mr-2 text-sm">📏</span> Kích thước
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {Array.from(new Set(product?.variants?.map(v => v.size) || []))
                                     .map((size, i) => {
                                         const active = selectVariant?.size === size;
                                         // Lấy variant đầu tiên có kích thước này để sử dụng khi chọn
                                         const variant = product?.variants?.find(v => v.size === size);
                                         return (
                                             <button
                                                 key={size}
                                                 type="button"
                                                 onClick={() => {
                                                     if (variant) setSelectVariant(variant);
                                                 }}
                                                 className={`px-3 py-1.5 rounded-md border text-sm font-medium transition-all duration-300 ${active
                                                         ? "border-blue-500 text-blue-700 bg-blue-100"
                                                         : "border-gray-300 text-gray-700 hover:border-blue-400 hover:bg-blue-50"
                                                     }`}
                                             >
                                                 {size}
                                             </button>
                                         );
                                     })}
                                </div>
                            </div>

                            <div className="mb-4">
                                <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
                                    <span className="mr-2 text-sm">🎨</span> Màu sắc
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {Array.from(new Set(product?.variants?.map(v => v.color) || []))
                                     .map((color, i) => {
                                         const active = selectVariant?.color === color;
                                         // Lấy variant đầu tiên có màu này để sử dụng khi chọn
                                         const variant = product?.variants?.find(v => v.color === color);
                                         const getColorValue = (color: any) => {
                                            if (!color) return '#cccccc';
                                            
                                            // Nếu là chuỗi, áp dụng xử lý như trước
                                            if (typeof color === 'string') {
                                                // Nếu là mã màu hex, rgb, rgba, hsl, hsla
                                                if (color.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/) ||
                                                    color.toLowerCase().startsWith('rgb') ||
                                                    color.toLowerCase().startsWith('hsl')) {
                                                    return color;
                                                }
                                                // Nếu là tên màu chuẩn CSS
                                                const validColorNames = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown',
                                                                         'black', 'white', 'gray', 'grey', 'silver', 'gold', 'cyan', 'magenta',
                                                                         'lime', 'maroon', 'navy', 'olive', 'teal', 'violet', 'aqua', 'fuchsia',
                                                                         'aliceblue', 'antiquewhite', 'aquamarine', 'azure', 'beige', 'bisque',
                                                                         'blanchedalmond', 'blueviolet', 'brown', 'burlywood', 'cadetblue',
                                                                         'chartreuse', 'chocolate', 'coral', 'cornflowerblue', 'cornsilk',
                                                                         'crimson', 'darkblue', 'darkcyan', 'darkgoldenrod', 'darkgray',
                                                                         'darkgreen', 'darkgrey', 'darkkhaki', 'darkmagenta', 'darkolivegreen',
                                                                         'darkorange', 'darkorchid', 'darkred', 'darksalmon', 'darkseagreen',
                                                                         'darkslateblue', 'darkslategray', 'darkslategrey', 'darkturquoise',
                                                                         'darkviolet', 'deeppink', 'deepskyblue', 'dimgray', 'dimgrey',
                                                                         'dodgerblue', 'firebrick', 'floralwhite', 'forestgreen', 'gainsboro',
                                                                         'ghostwhite', 'gold', 'goldenrod', 'green', 'greenyellow', 'honeydew',
                                                                         'hotpink', 'indianred', 'indigo', 'ivory', 'khaki', 'lavender',
                                                                         'lavenderblush', 'lawngreen', 'lemonchiffon', 'lightblue', 'lightcoral',
                                                                         'lightcyan', 'lightgoldenrodyellow', 'lightgray', 'lightgreen',
                                                                         'lightgrey', 'lightpink', 'lightsalmon', 'lightseagreen', 'lightskyblue',
                                                                         'lightslategray', 'lightslategrey', 'lightsteelblue', 'lightyellow',
                                                                         'limegreen', 'linen', 'magenta', 'mediumaquamarine', 'mediumblue',
                                                                         'mediumorchid', 'mediumpurple', 'mediumseagreen', 'mediumslateblue',
                                                                         'mediumspringgreen', 'mediumturquoise', 'mediumvioletred', 'midnightblue',
                                                                         'mintcream', 'mistyrose', 'moccasin', 'navajowhite', 'oldlace',
                                                                         'olivedrab', 'orange', 'orangered', 'orchid', 'palegoldenrod',
                                                                         'palegreen', 'paleturquoise', 'palevioletred', 'papayawhip',
                                                                         'peachpuff', 'peru', 'pink', 'plum', 'powderblue', 'rosybrown',
                                                                         'royalblue', 'saddlebrown', 'salmon', 'sandybrown', 'seagreen',
                                                                         'seashell', 'sienna', 'skyblue', 'slateblue', 'slategray',
                                                                         'slategrey', 'snow', 'springgreen', 'steelblue', 'tan', 'thistle',
                                                                         'tomato', 'turquoise', 'violet', 'wheat', 'white', 'whitesmoke',
                                                                         'yellowgreen'];
                                                if (validColorNames.includes(color.toLowerCase())) {
                                                    return color;
                                                }
                                                // Một số tên màu tiếng Việt hoặc tên màu mô tả
                                                const colorMap: Record<string, string> = {
                                                    'hồng': 'pink',
                                                    'hồng pastel': '#ffd1dc',
                                                    'xanh dương': 'blue',
                                                    'xanh lá': 'green',
                                                    'đỏ': 'red',
                                                    'vàng': 'yellow',
                                                    'tím': 'purple',
                                                    'cam': 'orange',
                                                    'nâu': 'brown',
                                                    'xám': 'gray',
                                                    'đen': 'black',
                                                    'trắng': 'white',
                                                    'hồng đậm': 'deepPink',
                                                    'xanh ngọc': 'turquoise',
                                                    'xanh da trời': 'skyblue'
                                                };
                                                
                                                const normalizedColor = color.toLowerCase().trim();
                                                if (colorMap[normalizedColor]) {
                                                    return colorMap[normalizedColor];
                                                }
                                                
                                                // Nếu không phải định dạng chuẩn, thử thêm # vào đầu
                                                if (!color.startsWith('#')) {
                                                    return `#${color}`;
                                                }
                                                return '#cccccc'; // fallback nếu không xác định được
                                            }
                                            
                                            // Nếu là object, thử lấy thuộc tính cụ thể
                                            if (typeof color === 'object') {
                                                // Kiểm tra nếu có thuộc tính màu sắc phổ biến
                                                if (color.hex) return color.hex;
                                                if (color.value) return color.value;
                                                if (color.name) return color.name;
                                                // Nếu không có thuộc tính đặc biệt, trả về fallback
                                                return '#cccccc';
                                            }
                                            
                                            // Trường hợp khác, chuyển sang string và xử lý
                                            return '#cccccc';
                                        };
                                        return (
                                            <div
                                                key={color || `color-${i}`}
                                                onClick={() => {
                                                    if (variant) setSelectVariant(variant);
                                                }}
                                                className={`flex flex-col items-center cursor-pointer transition-all duration-300 ${active ? 'scale-105' : 'hover:scale-105'}`}
                                            >
                                                <div
                                                    className={`w-10 h-10 rounded-full border-2 ${active ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'}`}
                                                    style={{
                                                        backgroundColor: getColorValue(color)
                                                    }}
                                                    title={color || 'Chưa có màu'}
                                                ></div>
                                                <span className="mt-1 text-xs">{color}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            
                            {/* Quantity + Actions */}
                            <div className="mb-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                        <button
                                            type="button"
                                            className="w-10 h-10 grid place-items-center hover:bg-gray-100 text-lg font-bold transition-colors duration-200"
                                            onClick={() =>
                                                setQty((q) => Math.max(1, q - 1))
                                            }
                                        >
                                            -
                                        </button>
                                        <div className="w-12 text-center text-base font-bold">{qty}</div>
                                        <button
                                            type="button"
                                            className="w-10 h-10 grid place-items-center hover:bg-gray-100 text-lg font-bold transition-colors duration-200"
                                            onClick={() => setQty((q) => q + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
 
                                    <div>
                                        <span className="text-gray-700 font-medium text-sm">Số lượng</span>
                                        <div className="text-xs text-gray-500 mt-1">Còn hàng: {selectVariant?.stock_quantity || 100}</div>
                                    </div>
                                </div>
 
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        className="flex items-center justify-center gap-2 cursor-pointer px-4 py-3 rounded-lg bg-pink-200 hover:bg-pink-300 transition-all duration-300 shadow-md hover:shadow-lg"
                                        onClick={() => {
                                            if (selectVariant?.id) {
                                                addToCart({ id: product.id, variant_id: selectVariant.id, qty });
                                                toast.success('Thêm vào giỏ hàng thành công!')
                                            } else {
                                                toast.error('Vui lòng chọn kích thước và màu sắc')
                                            }
                                        }}
                                        style={{ color: '#000' }}
                                    >
                                        <CartIcon className="size-4" />
                                        <span className="text-sm font-semibold">Thêm vào giỏ</span>
                                    </button>
 
                                    <button
                                        type="button"
                                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-pink-200 text-gray-800 hover:bg-pink-300 transition-all duration-300 shadow-md hover:shadow-lg"
                                        onClick={() => {
                                            if (selectVariant?.id) {
                                                // Tạo giỏ hàng tạm thời chỉ chứa sản phẩm này
                                                const tempCart = [{ id: product.id, variant_id: selectVariant.id, qty }];
                                                localStorage.setItem('temp_cart', JSON.stringify(tempCart));
                                                // Sau đó chuyển hướng đến trang thanh toán
                                                navigate('/checkout');
                                            } else {
                                                toast.error('Vui lòng chọn kích thước và màu sắc');
                                            }
                                        }}
                                    >
                                        <CartIcon className="size-4" />
                                        <span className="text-sm font-semibold">Mua ngay</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Details tabs */}
                <div className="mt-12 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md p-4">
                    <Tabs
                        defaultActiveKey="1"
                        items={items}
                        onChange={onChange}
                        className="ant-tabs-large"
                        size="small"
                    />
                </div>

                {/* Related products */}
                <div className="mt-12">
                    <div className="text-center mb-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Sản phẩm liên quan</h3>
                        <div className="w-16 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {newProducts.map((p) => {
                            const thumbnail = p.images?.find(
                                (p) => p.is_thumbnail
                            );
                            const variants = p.variants || [];
                            let index = 0;
                            let min = Infinity;
                            variants.forEach((v, i) => {
                                if (v.price && v.price < min) {
                                    min = v.price;
                                    index = i;
                                }
                            });
                            const minPriceVariant = variants[index];
                            return (
                                <div
                                    key={p.id}
                                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                                >
                                    <ProductCard
                                        id={p.id}
                                        name={p.name || ""}
                                        imageUrl={thumbnail?.image_url}
                                        price={minPriceVariant?.price}
                                        rating={4.3}
                                        salePrice={0.4}
                                    />
                                </div>
                        );
                        })}
                    </div>
                </div>
            </div>

            <Toaster position="top-right" richColors />
        </div>
    );
};

export default ProductDetailsPage;
