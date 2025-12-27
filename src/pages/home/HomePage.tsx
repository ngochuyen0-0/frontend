import Carousel from "../../components/carousel/Carousel";
import { Carousel as AntCarousel } from "antd";
import BrandCard from "../../components/card/BrandCard";
import ProductCard from "../../components/card/ProductCard";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { useEffect, useState } from "react";
import { Product } from "../../types/product";
import { getProducts } from "../../services/productService";

const HomePage = () => {
    const navigate = useNavigate();
    const [newProducts, setNewProduct] = useState<Product[]>([])
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

    const brands = [
        { id: '1', name: 'Louis Vuitton', imageUrl: "https://th.bing.com/th/id/R.666b24ea8787a4e8f5c1b108328c3181?rik=NkyXIiRQ0CpUsA&pid=ImgRaw&r=0" },
        { id: '2', name: 'Gucci', imageUrl: "https://logodix.com/logo/1482.jpg" },
        { id: '3', name: 'Chanel', imageUrl: "https://tse3.mm.bing.net/th/id/OIP.Dta-yW5xiTzD3biCbVhtdQAAAA?w=420&h=320&rs=1&pid=ImgDetMain&o=7&rm=3" },
        { id: '4', name: 'Hermès', imageUrl: "https://assets.turbologo.com/blog/en/2021/07/07062102/hermes-logo-color.png" },
        { id: '5', name: 'Prada', imageUrl: "https://th.bing.com/th/id/R.ab1db814563c8bede3703d88656e5850?rik=ZwtF5lTRxkcf6w&pid=ImgRaw&r=0" },
        { id: '6', name: 'Charles & Keith', imageUrl: "https://lazamia.com/wp-content/uploads/2018/10/Charles-Keith-logo.png" },
    ];

    useEffect(() => {
        getProducts({}).then(res => {
            setNewProduct(res?.data);
        }).catch();
    }, [])

    return (
        <>
            <div className="px-[10%] py-5">
                <Carousel slides={slides} autoplay />

                <div className="mt-5">
                    <h4 className="" style={{ fontWeight: '700' }}>Thương hiệu nổi bật</h4>
                </div>

                <div className="mt-3">
                    {(() => {
                        const chunkSize = 6;
                        const chunks: typeof brands[] = [] as any;
                        for (let i = 0; i < brands.length; i += chunkSize) {
                            chunks.push(brands.slice(i, i + chunkSize));
                        }
                        return (
                            <AntCarousel arrows dots autoplay>
                                {chunks.map((group, idx) => (
                                    <div key={idx}>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                            {group.map((b) => (
                                                <div key={b.id} className="px-1">
                                                    <BrandCard name={b.name} imageUrl={b.imageUrl} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </AntCarousel>
                        );
                    })()}
                </div>


                <div className="mt-8">
                    <div className="mb-3">
                        <h4 style={{ fontWeight: '700' }}>Sản phẩm mới</h4>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
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
                            )
                        })}
                    </div>
                </div>

                <div className="mt-8">
                    <div className="mb-3">
                        <h4 style={{ fontWeight: '700', fontSize: '21px' }}>Sản phẩm nổi bật</h4>
                    </div>
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Banner Section */}
                        <div className="lg:w-1/4">
                            <div className="relative h-80 bg-[#F4F1EC] rounded-lg overflow-hidden">
                                <img
                                    src="/banner/Handbag-PNG-Picture.png"
                                    alt="Banner"
                                    className="absolute bottom-0 right-0 w-[65%] h-auto object-contain"
                                />
                                <div className="relative z-10 p-6 h-full  text-gray-800">
                                    <div className="text-2xl font-bold mb-5 text-[#EA580C]">Bộ sưu tập mới</div>
                                    <p className="text-base mb-4">Khám phá bộ sưu tập túi xách mới nhất của chúng tôi với chất lượng cao cấp và thiết kế hiện đại.</p>
                                    <button className="bg-white text-black px-4 py-2 rounded-[60px] font-semibold hover:bg-blue-300 transition-colors w-fit text-sm">
                                        Mua ngay
                                    </button>
                                </div>
                                <div className="absolute top-3 right-3 z-10">
                                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                        -30% OFF
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Products Section */}
                        <div className="lg:w-3/4">
                            <div className="grid grid-cols-4 gap-4 h-full">
                                {newProducts?.map((p) => {
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