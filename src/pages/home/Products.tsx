import React, { useState, useEffect } from 'react';
import {
    Row,
    Col,
    Card,
    Input,
    Select,
    Slider,
    Button,
    Pagination,
    Empty,
    Spin,
    Tag,
    Space,
    Divider,
    Typography,
    Checkbox,
    Rate,
    Breadcrumb,
    Image
} from 'antd';
import {
    SearchOutlined,
    FilterOutlined,
    ShoppingCartOutlined,
    HeartOutlined,
    EyeOutlined,
    StarFilled
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { getProducts } from '../../services/productService';
import { getBrands } from '../../services/brandService';
import { getCategories } from '../../services/categoryService';
import { Brand } from '../../types/brand';
import { Category } from '../../types/category';
import { Product } from '../../types/product';

const { Title, Text } = Typography;
const { Option } = Select;
const { Meta } = Card;

// Types
interface ProductImage {
    id: string;
    image_url: string;
    is_thumbnail: boolean;
}

interface ProductVariant {
    id: string;
    price: number;
    size?: string;
    color?: string;
    stock: number;
}


interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
    onViewDetail: (product: Product) => void;
}

// Product Card Component
const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetail }) => {
    const thumbnail = product.images?.find(img => img.is_thumbnail);
    const variants = product.variants || [];

    // Find minimum price variant
    let minPrice = Infinity;
    let minPriceVariant: ProductVariant | null = null;

    variants.forEach(variant => {
        if (variant.price < minPrice) {
            minPrice = variant.price;
            minPriceVariant = variant;
        }
    });

    const hasMultiplePrices = variants.length > 1 && variants.some(v => v.price !== minPrice);
    const maxPrice = Math.max(...variants.map(v => v.price));

    return (
        <Card
            className="product-card hover:shadow-lg transition-all duration-300"
            cover={
                <div className="relative">
                    <img
                        alt={product.name}
                        src={thumbnail?.image_url || '/placeholder-product.jpg'}
                        className="h-48 w-full object-cover"
                        onError={(e) => {
                            e.currentTarget.src = '/placeholder-product.jpg';
                        }}
                    />
                    <div className="absolute top-2 left-2">
                        {product.is_new && (
                            <Tag color="green" className="m-0">NEW</Tag>
                        )}
                        {product.is_featured && (
                            <Tag color="red" className="m-0">HOT</Tag>
                        )}
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            type="text"
                            icon={<HeartOutlined />}
                            className="bg-white hover:bg-red-50 text-gray-600"
                        />
                    </div>
                </div>
            }
            actions={[
                <Button
                    type="text"
                    icon={<EyeOutlined />}
                    onClick={() => onViewDetail(product)}
                >
                    View
                </Button>,
            ]}
        >
            <Meta
                title={
                    <Text ellipsis={{ tooltip: product.name }} className="font-semibold">
                        {product.name}
                    </Text>
                }
                description={
                    <div className="space-y-2">
                        <div>
                            <Rate
                                disabled
                                defaultValue={5}
                                className="text-sm"
                                character={<StarFilled />}
                            />
                            <Text type="secondary" className="text-xs ml-2">
                                ({10})
                            </Text>
                        </div>

                        <div className="flex items-center gap-2">
                            <Text strong className="text-lg text-red-600">
                                ${minPrice.toFixed(2)}
                            </Text>
                            {hasMultiplePrices && (
                                <Text type="secondary" className="text-sm line-through">
                                    ${maxPrice.toFixed(2)}
                                </Text>
                            )}
                            {hasMultiplePrices && (
                                <Tag color="orange" className="m-0">
                                    From ${minPrice.toFixed(2)}
                                </Tag>
                            )}
                        </div>

                        <Text type="secondary" className="text-xs block">
                            {product.brand.name} • {product.category.name}
                        </Text>

                        {variants.length > 1 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                                {variants.slice(0, 3).map((variant, index) => (
                                    <Tag key={index} className="m-0">
                                        {variant.size || variant.color}
                                    </Tag>
                                ))}
                                {variants.length > 3 && (
                                    <Tag className="m-0">
                                        +{variants.length - 3} more
                                    </Tag>
                                )}
                            </div>
                        )}
                    </div>
                }
            />
        </Card>
    );
};

// Main Products Page Component
const ProductsPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [productsData, setProductsData] = useState<any>();
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const queryParams = new URLSearchParams(location.search);

    const brandId = queryParams.get("brand_id");
    const categoryId = queryParams.get("category_id");

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
    const [sortBy, setSortBy] = useState<string>('newest');

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(12);
    const [totalProducts, setTotalProducts] = useState(0);

    // Available filters
    const [brands, setBrands] = useState<Brand[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);

        getBrands({}).then(res => { setBrands(res.data) });
        getCategories({}).then(res => { setCategories(res.data) });

        getProducts({}).then(res => {
            setProductsData(res);
            setLoading(false);
            setProducts(res.data)
            setFilteredProducts(res.data);
            setTotalProducts(res.data?.length);
        }).catch(() => {

        })
    };

    // Apply filters
    useEffect(() => {
        applyFilters();
    }, [searchTerm, selectedBrands, selectedCategories, priceRange, sortBy, products]);

    const applyFilters = () => {
        let filtered = [...products];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(product =>
                (product.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product.brand_id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product.category_id || "").toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        // Brand filter
        if (selectedBrands.length > 0) {
            filtered = filtered.filter(product => selectedBrands.includes(product.brand_id || ""));
        }
        // Category filter
        if (selectedCategories.length > 0) {
            filtered = filtered.filter(product => selectedCategories.includes(product.category_id || ""));
        }

        // Price range filter
        filtered = filtered.filter(product => {
            const minPrice = Math.min(...product.variants.map(v => v.price));
            return minPrice >= priceRange[0] && minPrice <= priceRange[1];
        });

        // Sort products
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return Math.min(...a.variants.map(v => v.price)) - Math.min(...b.variants.map(v => v.price));
                case 'price-high':
                    return Math.min(...b.variants.map(v => v.price)) - Math.min(...a.variants.map(v => v.price));
                case 'rating':
                    return b.rating - a.rating;
                case 'newest':
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                default:
                    return 0;
            }
        });

        setFilteredProducts(filtered);
        setTotalProducts(filtered.length);
        setCurrentPage(1); // Reset to first page when filters change
    };

    const handleAddToCart = (product: Product) => {
        // Add to cart logic here
        console.log('Adding to cart:', product);
    };

    const handleViewDetail = (product: Product) => {
        navigate(`/product/${product.id}`);
    };

    const clearAllFilters = () => {
        setSearchTerm('');
        setSelectedBrands([]);
        setSelectedCategories([]);
        setPriceRange([0, 1000]);
        setSortBy('newest');
    };

    // Calculate paginated products
    const paginatedProducts = filteredProducts?.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Breadcrumb */}
                <Breadcrumb className="mb-6">
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>Products</Breadcrumb.Item>
                </Breadcrumb>

                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
                    <div>
                        <Title level={2} className="mb-2">Our Products</Title>
                        <Text type="secondary">
                            Showing {filteredProducts?.length} of {products?.length} products
                        </Text>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        {/* Search */}
                        <Input
                            placeholder="Search products..."
                            prefix={<SearchOutlined />}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full lg:w-64"
                            size="large"
                        />

                        {/* Sort */}
                        <Select
                            value={sortBy}
                            onChange={setSortBy}
                            className="w-full lg:w-48"
                            size="large"
                        >
                            <Option value="newest">Newest First</Option>
                            <Option value="price-low">Price: Low to High</Option>
                            <Option value="price-high">Price: High to Low</Option>
                            <Option value="rating">Highest Rated</Option>
                        </Select>
                    </div>
                </div>

                <Row gutter={[24, 24]}>
                    {/* Filters Sidebar */}
                    <Col xs={24} lg={6}>
                        <Card
                            className='filters-box'
                            title={
                                <Space>
                                    <FilterOutlined />
                                    Filters
                                </Space>
                            }
                            extra={
                                <Button type="link" onClick={clearAllFilters} size="small">
                                    Clear All
                                </Button>
                            }
                        >
                            {/* Price Range Filter */}
                            <div className="mb-6">
                                <Title level={5}>Price Range</Title>
                                <Slider
                                    range
                                    min={0}
                                    max={1000}
                                    value={priceRange}
                                    onChange={setPriceRange}
                                    className="mb-2"
                                />
                                <div className="flex justify-between">
                                    <Text type="secondary">${priceRange[0]}</Text>
                                    <Text type="secondary">${priceRange[1]}</Text>
                                </div>
                            </div>

                            <Divider />

                            {/* Brands Filter */}
                            <div className="mb-6">
                                <Title level={5}>Brands</Title>
                                <Checkbox.Group
                                    value={selectedBrands}
                                    onChange={setSelectedBrands}
                                    className="w-full"
                                >
                                    <Space direction="vertical" className="w-full mt-2">
                                        {brands?.map(brand => (
                                            <Checkbox key={brand.id} value={brand.id} className="w-full flex">
                                                <div className='w-full flex gap-1'>
                                                    <img className='w-6' src={brand.logo_url} /> <div>{brand.name}</div>
                                                </div>
                                            </Checkbox>
                                        ))}
                                    </Space>
                                </Checkbox.Group>
                            </div>

                            <Divider />

                            {/* Categories Filter */}
                            <div className="mb-6">
                                <Title level={5}>Categories</Title>
                                <Checkbox.Group
                                    value={selectedCategories}
                                    onChange={setSelectedCategories}
                                    className="w-full"
                                >
                                    <Space direction="vertical" className="w-full mt-2">
                                        {categories?.map(category => (
                                            <Checkbox key={category.id} value={category.id} className="w-full flex">
                                                <div className='w-full flex gap-1'>
                                                    <Tag className='w-6'>{category.icon}</Tag> <div>{category.name}</div>
                                                </div>
                                            </Checkbox>
                                        ))}
                                    </Space>
                                </Checkbox.Group>
                            </div>
                        </Card>
                    </Col>

                    {/* Products Grid */}
                    <Col xs={24} lg={18}>
                        {loading ? (
                            <div className="text-center py-20">
                                <Spin size="large" />
                            </div>
                        ) : (
                            <>
                                {/* Active Filters */}
                                {(selectedBrands.length > 0 || selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < 1000) && (
                                    <div className="mb-6">
                                        <Space wrap>
                                            {selectedBrands.map(brand => (
                                                <Tag
                                                    key={brand}
                                                    closable
                                                    onClose={() => setSelectedBrands(prev => prev.filter(b => b !== brand))}
                                                >
                                                    Brand: {brand}
                                                </Tag>
                                            ))}
                                            {selectedCategories.map(category => (
                                                <Tag
                                                    key={category}
                                                    closable
                                                    onClose={() => setSelectedCategories(prev => prev.filter(c => c !== category))}
                                                >
                                                    Category: {category}
                                                </Tag>
                                            ))}
                                            {(priceRange[0] > 0 || priceRange[1] < 1000) && (
                                                <Tag
                                                    closable
                                                    onClose={() => setPriceRange([0, 1000])}
                                                >
                                                    Price: ${priceRange[0]} - ${priceRange[1]}
                                                </Tag>
                                            )}
                                        </Space>
                                    </div>
                                )}

                                {/* Products Grid */}
                                {paginatedProducts?.length > 0 ? (
                                    <>
                                        <Row gutter={[16, 16]}>
                                            {paginatedProducts?.map(product => {
                                                return (<Col xs={12} md={8} lg={6} key={product.id}>
                                                    <ProductCard
                                                        product={product}
                                                        onViewDetail={handleViewDetail}
                                                    />
                                                </Col>)
                                            })}
                                        </Row>

                                        {/* Pagination */}
                                        <div className="flex justify-center mt-8">
                                            <Pagination
                                                current={currentPage}
                                                pageSize={pageSize}
                                                total={totalProducts}
                                                onChange={(page, size) => {
                                                    setCurrentPage(page);
                                                    setPageSize(size || 12);
                                                }}
                                                showSizeChanger
                                                showQuickJumper
                                                showTotal={(total, range) =>
                                                    `${range[0]}-${range[1]} of ${total} items`
                                                }
                                                pageSizeOptions={['12', '24', '36', '48']}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <Empty
                                        description="No products found matching your criteria"
                                        className="py-20"
                                    >
                                        <Button type="primary" onClick={clearAllFilters}>
                                            Clear Filters
                                        </Button>
                                    </Empty>
                                )}
                            </>
                        )}
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default ProductsPage;