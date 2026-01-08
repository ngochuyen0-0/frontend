import Carousel from "../../components/carousel/Carousel";
import { Carousel as AntCarousel } from "antd";
import BrandCard from "../../components/card/BrandCard";
import ProductCard from "../../components/card/ProductCard";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { useEffect, useState } from "react";
import { Product } from "../../types/product";
import { getProducts } from "../../services/productService";
import { useBrandStore } from "../../store/useBrandStore";

const HomePage = () => {
    const navigate = useNavigate();
    const [newProducts, setNewProduct] = useState<Product[]>([]);
    const { brands, getBrands, loading } = useBrandStore();

    const slides = [
        {
            id: "1",
            imageUrl: "https://image6.slideserve.com/11709274/e-a-s-y-l.jpg", // Đường dẫn ảnh minh họa cho túi xách mới
            title: "Túi Xách Thời Thượng",
            subtitle: "Khám phá những mẫu túi mới nhất và phong cách kinh điển",
        },
        {
            id: "2",
            imageUrl: "https://i.pinimg.com/736x/33/4c/07/334c07d18e4ea82a8c056074fba3d6c1--handbags.jpg", // Đường dẫn ảnh cho dòng túi cao cấp
            title: "Đẳng Cấp Sang Trọng",
            subtitle: "Sự kết hợp hoàn hảo giữa chất liệu da cao cấp và thiết kế tinh xảo",
        },
        {
            id: "3",
            imageUrl: "https://tse4.mm.bing.net/th/id/OIP.JR-Ap6nvtZjLoXHTbXuOQQHaJQ?rs=1&pid=ImgDetMain&o=7&rm=3", // Đường dẫn ảnh cho túi dùng hàng ngày
            title: "Phong Cách Dạo Phố",
            subtitle: "Tiện dụng mỗi ngày nhưng vẫn giữ trọn nét thanh lịch",
        },
    ];

    useEffect(() => {
        // Lấy danh sách sản phẩm mới
        getProducts({}).then(res => {
            setNewProduct(res?.data);
        }).catch();

        // Lấy danh sách thương hiệu
        getBrands({});
    }, [getBrands]);

    return (
        <>
            <div className="px-[5%] py-8 max-w-[1400px] mx-auto">
                {/* Carousel Section with Modern Design */}
                <div className="relative rounded-2xl overflow-hidden shadow-xl mb-12 transition-all duration-300 hover:shadow-2xl">
                    <Carousel slides={slides} autoplay />
                </div>

                {/* Brands Section with Enhanced Styling */}
                <div className="mt-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-3xl font-bold text-gray-900 relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-12 after:h-1 after:bg-orange-500 after:rounded-full">
                            Thương hiệu nổi bật
                        </h2>
                    </div>
                    <div className="mt-6">
                        {(() => {
                            // Lọc các thương hiệu nổi bật hoặc tất cả thương hiệu
                            const featuredBrands = brands.filter(brand => brand.featured === true);
                            const displayBrands = featuredBrands.length > 0 ? featuredBrands : brands;
                            
                            const chunkSize = 6;
                            const chunks: typeof displayBrands[] = [] as any;
                            for (let i = 0; i < displayBrands.length; i += chunkSize) {
                                chunks.push(displayBrands.slice(i, i + chunkSize));
                            }
                            return (
                                <AntCarousel arrows dots autoplay>
                                    {chunks.map((group, idx) => (
                                        <div key={idx}>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
                                                {group.map((b) => (
                                                    <div
                                                        key={b.id}
                                                        className="flex justify-center items-center p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                                                    >
                                                        <BrandCard name={b.name} imageUrl={b.logo_url} />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </AntCarousel>
                            );
                        })()}
                    </div>
                </div>

                {/* New Products Section */}
                <div className="mt-16">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-12 after:h-1 after:bg-orange-500 after:rounded-full">
                            Sản phẩm mới
                        </h2>
                        <button 
                            className="text-orange-500 hover:text-orange-600 font-medium transition-colors cursor-pointer"
                            onClick={() => navigate('/products?sortBy=latest')}
                        >
                            Xem tất cả →
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                        {newProducts.map((p) => {
                            const thumbnail = p.images?.find(p => p.is_thumbnail);
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
                                    className="transition-all duration-300 hover:-translate-y-1"
                                >
                                    <ProductCard
                                        key={p.id}
                                        id={p.id}
                                        name={p.name || ""}
                                        imageUrl={thumbnail?.image_url}
                                        price={minPriceVariant?.price}
                                        rating={4.3}
                                        salePrice={0.4}
                                        onAddToCart={() => console.log('Add to cart', p.id)}
                                    />
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Featured Products Section with Enhanced Banner */}
                <div className="mt-16 mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-12 after:h-1 after:bg-orange-500 after:rounded-full">
                            Sản phẩm nổi bật
                        </h2>
                        <button 
                            className="text-orange-500 hover:text-orange-600 font-medium transition-colors cursor-pointer"
                            onClick={() => navigate('/products?sortBy=featured')}
                        >
                            Xem tất cả →
                        </button>
                    </div>
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Enhanced Banner Section */}
                        <div className="lg:w-1/3">
                            <div className="relative h-[450px] bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl overflow-hidden shadow-lg group transition-all duration-500 hover:shadow-xl">
                                <img
                                    src="/banner/Handbag-PNG-Picture.png"
                                    alt="Banner"
                                    className="absolute bottom-0 right-0 w-[70%] h-auto object-contain transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
                                <div className="relative z-10 p-8 h-full flex flex-col justify-center text-gray-800">
                                    <div className="text-3xl font-bold mb-4 text-[#EA580C]">Bộ sưu tập mới</div>
                                    <p className="text-base mb-6 max-w-md">Khám phá bộ sưu tập túi xách mới nhất của chúng tôi với chất lượng cao cấp và thiết kế hiện đại.</p>
                                    <button className="bg-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors w-fit text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-transform">
                                        Mua ngay
                                    </button>
                                </div>
                                <div className="absolute top-4 right-4 z-20">
                                    <span className="bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-md">
                                        -30% OFF
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Products Section */}
                        <div className="lg:w-2/3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 h-full">
                                {newProducts?.slice(0, 6).map((p) => {
                                    const thumbnail = p.images?.find(p => p.is_thumbnail);
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
                                            className="transition-all duration-300 hover:-translate-y-1"
                                        >
                                            <ProductCard
                                                id={p.id}
                                                key={p.id}
                                                name={p.name || ""}
                                                imageUrl={thumbnail?.image_url}
                                                price={minPriceVariant?.price || 0}
                                                rating={4.3}
                                                onClick={() => navigate(`/product/${p.id}`)}
                                                salePrice={3}
                                                onAddToCart={() => console.log('Add to cart', p.id)}
                                            />
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default HomePage;