import {
    CopyOutlined,
    DeleteOutlined,
    EditOutlined,
    ExportOutlined,
    EyeOutlined,
    FilterOutlined,
    FormOutlined,
    MoreOutlined,
    PlusOutlined,
    SearchOutlined,
    PlayCircleOutlined,
    PoweroffOutlined,
} from "@ant-design/icons";
import {
    Button,
    Card,
    Col,
    Dropdown,
    Input,
    Row,
    Select,
    Space,
    Statistic,
    Table,
    Tag,
} from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useProductStore } from "../../store/useProductStore";
import { createProduct, deleteProduct, toggleProductStatus } from "../../services/productService";
import ProductForm from "../../components/admin/ProductFrom";
import { Product } from "../../types/product";

const { Option } = Select;

const AdminProducts: React.FC = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [tableLoading, setTableLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { products, getProducts } = useProductStore()
    const [selectProduct, setSelectProduct] = useState<Product | null>(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [formModalVisible, setFormModalVisible] = useState(false);
    const [formType, setFormType] = useState<'create' | 'edit'>('create');
    const [searchText, setSearchText] = useState('');
    const [searchType, setSearchType] = useState<'all' | 'name' | 'category' | 'brand'>('all');
    
    const [initialLoad, setInitialLoad] = useState(true);
    
    useEffect(() => {
        // Lấy tham số brandId từ URL nếu có
        const brandIdFromUrl = searchParams.get('brandId');
        
        const loadProducts = async () => {
            setTableLoading(true); // Bật loading trước khi tải dữ liệu
            // Gọi API với brandId nếu có trong URL
            await getProducts({}, brandIdFromUrl || undefined, undefined);
            
            if (brandIdFromUrl) {
                setSearchType('brand');
                
                // Cập nhật searchText với tên thương hiệu nếu có thể
                // Tìm tên thương hiệu từ danh sách sản phẩm
                setTimeout(() => {
                    const brand = products.find(p => p.brand?.id === brandIdFromUrl)?.brand?.name;
                    if (brand) {
                        setSearchText(brand);
                    }
                }, 100);
            }
            setInitialLoad(false);
            setTableLoading(false); // Tắt loading sau khi tải xong
        };
        
        loadProducts();
    }, [searchParams, getProducts])

    // Get unique categories for the filter dropdowns
    const categories = [...new Set(products.map(p => p.category?.name).filter(Boolean))];

    // Filter products based on search text only
    const filteredProducts = products.filter(product => {
        let matchesSearch = true;
        
        if (searchText) {
            switch (searchType) {
                case 'name':
                    matchesSearch = product.name?.toLowerCase().includes(searchText.toLowerCase()) || false;
                    break;
                case 'category':
                    matchesSearch = product.category?.name?.toLowerCase().includes(searchText.toLowerCase()) || false;
                    break;
                case 'brand':
                    matchesSearch = product.brand?.name?.toLowerCase().includes(searchText.toLowerCase()) || false;
                    break;
                case 'all':
                default:
                    matchesSearch = product.name?.toLowerCase().includes(searchText.toLowerCase()) ||
                        product.description?.toLowerCase().includes(searchText.toLowerCase()) ||
                        product.id.toLowerCase().includes(searchText.toLowerCase()) ||
                        product.category?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
                        product.brand?.name?.toLowerCase().includes(searchText.toLowerCase()) || false;
                    break;
            }
        }
        
        return matchesSearch;
    });

    const handleEdit = (product: Product) => {
        setSelectProduct(product);
        setFormType('edit');
        setFormModalVisible(true);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    const handleExportData = () => {
        // Tạo một phiên bản JSON của dữ liệu sản phẩm để xuất
        const dataToExport = filteredProducts.map(product => ({
            id: product.id,
            name: product.name,
            description: product.description,
            brand: product.brand?.name || '',
            category: product.category?.name || '',
            variants: product.variants?.length || 0,
            totalStock: product.variants && product.variants.length > 0
                ? product.variants.reduce((sum, variant) => sum + (variant.stock_quantity || 0), 0)
                : 0,
            minPrice: product.variants && product.variants.length > 0
                ? Math.min(...product.variants.map(v => v.price || 0)).toLocaleString() + 'đ'
                : '0đ',
            status: product.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'
        }));
        
        // Chuyển đổi dữ liệu sang định dạng JSON
        const jsonString = JSON.stringify(dataToExport, null, 2);
        
        // Tạo Blob và tải xuống file
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `products_export_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleDuplicate = (product: Product) => {
        // Tạo bản sao của sản phẩm với các trường cần thiết
        const duplicatedProduct: Omit<Product, 'id'> & { id?: string } = {
            ...product,
            id: undefined, // Bỏ ID để tạo sản phẩm mới
            name: `${product.name} (Bản sao)`, // Thêm tiền tố để phân biệt
            variants: product.variants?.map(variant => ({
                ...variant,
                id: undefined, // Bỏ ID biến thể
                product_id: undefined // Bỏ product_id vì sẽ được tạo mới
            })) || [],
            images: product.images?.map(image => ({
                ...image,
                id: undefined, // Bỏ ID hình ảnh
                product_id: undefined // Bỏ product_id
            })) || []
        };
        
        setSelectProduct(duplicatedProduct as Product);
        setFormType('create');
        setFormModalVisible(true);
    };

    const handleSearchTypeChange = (value: 'all' | 'name' | 'category' | 'brand') => {
        setSearchType(value);
    };

    const handleCreate = () => {
        setSelectProduct(null);
        setFormType('create');
        setFormModalVisible(true);
        // Đảm bảo xóa các bộ lọc tìm kiếm để sản phẩm mới không bị ẩn
        setSearchText('');
        setSearchType('all');
    };

    const handleDelete = async (product: Product) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${product.name}"?`)) {
            try {
                await deleteProduct(product.id);
                // Cập nhật lại danh sách sản phẩm sau khi xóa
                await getProducts();
                console.log("Xóa sản phẩm thành công");
            } catch (error) {
                console.error("Error deleting product:", error);
                alert("Xóa sản phẩm thất bại. Vui lòng thử lại.");
            }
        }
    };


    const handleToggleStatus = async (product: Product) => {
        if (window.confirm(`Bạn có chắc chắn muốn ${product.status === 'ACTIVE' ? 'vô hiệu hóa' : 'kích hoạt'} sản phẩm "${product.name}"?`)) {
            try {
                await toggleProductStatus(product.id, product.status !== 'ACTIVE');
                // Cập nhật lại danh sách sản phẩm sau khi thay đổi trạng thái
                await getProducts();
                console.log(`${product.status === 'ACTIVE' ? 'Vô hiệu hóa' : 'Kích hoạt'} sản phẩm thành công`);
            } catch (error) {
                console.error(`Lỗi ${product.status === 'ACTIVE' ? 'vô hiệu hóa' : 'kích hoạt'} sản phẩm:`, error);
                alert(`${product.status === 'ACTIVE' ? 'Vô hiệu hóa' : 'Kích hoạt'} sản phẩm thất bại. Vui lòng thử lại.`);
            }
        }
    };

    // Tính toán các thống kê dựa trên dữ liệu đã lọc
    const totalProducts = filteredProducts.length;
    const inStockProducts = filteredProducts.filter(product =>
        product.variants && Array.isArray(product.variants) && product.variants.some((variant: any) => variant.stock_quantity > 0)
    ).length;
    const lowStockProducts = filteredProducts.filter(product =>
        product.variants && Array.isArray(product.variants) && product.variants.some((variant: any) => variant.stock_quantity > 0 && variant.stock_quantity <= 5)
    ).length;
    const outOfStockProducts = filteredProducts.filter(product =>
        product.variants && Array.isArray(product.variants) && product.variants.every((variant: any) => variant.stock_quantity === 0)
    ).length;
    const totalStock = filteredProducts.reduce((sum, product) => {
        if (product.variants && Array.isArray(product.variants)) {
            return sum + product.variants.reduce((variantSum, variant) => variantSum + (variant.stock_quantity || 0), 0);
        }
        return sum;
    }, 0);

    // Columns definition
    const columns = [
        {
            title: "",
            dataIndex: "id",
            key: "id",
            render: (id: string, record: any) => {
                const thumbnail = record.images?.find((i: any) => i.is_thumbnail);
                return (
                    <div className="flex items-center justify-center w-[70px] h-[70px]">
                        {thumbnail ? (
                            <img
                                style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 6 }}
                                src={thumbnail.image_url}
                                alt="Thumbnail"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.onerror = null;
                                    target.style.display = 'none';
                                    const parent = target.parentElement;
                                    if (parent) {
                                        parent.innerHTML = '<div class="w-[70px] h-[70px] bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">No Image</div>';
                                    }
                                }}
                            />
                        ) : (
                            <div className="w-[70px] h-[70px] bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
                                No Image
                            </div>
                        )}
                    </div>
                );
            },
        }, {
            title: "Thông tin sản phẩm",
            dataIndex: "name",
            key: "name",
            render: (name: string, record: any) => (
                <div>
                    <div className="font-semibold text-blue-500" style={{
                        cursor: "pointer"
                    }} onClick={() => navigate(`/admin/v1/product/${record.id}`)}>{name}</div>
                    <div className="text-xs text-gray-400">
                        {record.variants && Array.isArray(record.variants) ? record.variants.length : 0} Biến thể
                    </div>
                </div>
            ),
            sorter: (a: any, b: any) => a.name.localeCompare(b.name),
        }, {
            title: "Thương hiệu",
            dataIndex: ["brand", "name"],
            key: "brand",
            render: (category: string) => <div>{category}</div>,
            onFilter: (value: any, record: any) => record.brand.name === value,
        },
        {
            title: "Danh mục",
            dataIndex: ["category", "name"],
            key: "category",
            render: (category: string) => <div>{category}</div>,
            filters: categories.map((name: any) => ({
                text: name,
                value: name
            })),
            onFilter: (value: any, record: any) => record.category.name === value,
        },
        {
            title: "Giá thấp nhất",
            key: "minPrice",
            render: (_, record: any) => {
                if (record.variants && record.variants.length > 0) {
                    const minPrice = Math.min(...record.variants.map((v: any) => v.price || 0));
                    return <div>{minPrice.toLocaleString()}đ</div>;
                }
                return <div>0đ</div>;
            },
            sorter: (a: any, b: any) => {
                const minPriceA = a.variants && a.variants.length > 0 ? Math.min(...a.variants.map((v: any) => v.price || 0)) : 0;
                const minPriceB = b.variants && b.variants.length > 0 ? Math.min(...b.variants.map((v: any) => v.price || 0)) : 0;
                return minPriceA - minPriceB;
            },
        },
        {
            title: "Màu sắc",
            key: "colors",
            render: (_, record: any) => {
                if (record.variants && record.variants.length > 0) {
                    const colors = [...new Set(record.variants.map((v: any) => v.color).filter(Boolean))].slice(0, 3);
                    return (
                        <div>
                            {colors.map((color: any, index: number) => (
                                <Tag key={index} color="blue" className="mb-1">{color}</Tag>
                            ))}
                            {record.variants.length > 3 && <Tag>+{record.variants.length - 3}</Tag>}
                        </div>
                    );
                }
                return <div>Không có</div>;
            },
        },
        {
            title: "Kích thước",
            key: "sizes",
            render: (_, record: any) => {
                if (record.variants && record.variants.length > 0) {
                    const sizes = [...new Set(record.variants.map((v: any) => v.size).filter(Boolean))].slice(0, 3);
                    return (
                        <div>
                            {sizes.map((size: any, index: number) => (
                                <Tag key={index} color="green" className="mb-1">{size}</Tag>
                            ))}
                            {record.variants.length > 3 && <Tag>+{record.variants.length - 3}</Tag>}
                        </div>
                    );
                }
                return <div>Không có</div>;
            },
        },
        {
            title: "Tổng số lượng",
            key: "totalStock",
            render: (_, record: any) => {
                if (record.variants && record.variants.length > 0) {
                    const totalStock = record.variants.reduce((sum: number, variant: any) => sum + (variant.stock_quantity || 0), 0);
                    return <div>{totalStock}</div>;
                }
                return <div>0</div>;
            },
            sorter: (a: any, b: any) => {
                const totalStockA = a.variants && a.variants.length > 0 ? a.variants.reduce((sum: number, v: any) => sum + (v.stock_quantity || 0), 0) : 0;
                const totalStockB = b.variants && b.variants.length > 0 ? b.variants.reduce((sum: number, v: any) => sum + (v.stock_quantity || 0), 0) : 0;
                return totalStockA - totalStockB;
            },
        },
        {
            title: "Trạng thái ",
            dataIndex: "status",
            key: "status",
            render: (status: any, record: any) => {
                // Sử dụng trường status từ sản phẩm chính
                const isActive = record.status === 'ACTIVE';
                
                const color = isActive ? "green" : "red";
                const text = isActive ? "Hoạt động" : "Không hoạt động";
                return <Tag color={color}>{text}</Tag>;
            },
            filters: [
                { text: "Hoạt động", value: "ACTIVE" },
                { text: "Không hoạt động", value: "DRAFT" },
            ],
            onFilter: (value: any, record: any) => {
                // Chỉ lọc theo trạng thái của sản phẩm chính
                return record.status === value;
            },
        },
        {
            title: "Hành động",
            key: "actions",
            width: 100,
            render: (_, record) => (
                <Dropdown
                    menu={{
                        items: [
                            {
                                key: "edit",
                                label: "Sửa",
                                icon: <EditOutlined />,
                                onClick: () => handleEdit(record)
                            },
                            {
                                key: "view",
                                label: "Xem chi tiết",
                                icon: <EyeOutlined />,
                                onClick: () => navigate(`/admin/v1/product/${record.id}`)
                            },
                            {
                                key: "duplicate",
                                label: "Nhân bản",
                                icon: <CopyOutlined />,
                                onClick: () => handleDuplicate(record)
                            },
                            { type: "divider" },
                            {
                                key: "delete",
                                label: "Xóa",
                                icon: <DeleteOutlined />,
                                danger: true,
                                onClick: () => handleDelete(record)
                            },
                            { type: "divider" },
                            {
                                key: "toggleStatus",
                                label: record.status === 'ACTIVE' ? "Vô hiệu hóa" : "Kích hoạt",
                                icon: record.status === 'ACTIVE' ? <PoweroffOutlined /> : <PlayCircleOutlined />,
                                onClick: () => handleToggleStatus(record)
                            },
                        ],
                    }}
                    trigger={["click"]}
                >
                    <Button type="text" icon={<MoreOutlined />} />
                </Dropdown>
            ),
        },
    ];

    const bulkActionItems = [
        {
            key: "publish",
            label: "Công bố mục đã chọn",
            onClick: () => {
                // TODO: Implement bulk publish
                getProducts();
            }
        },
        {
            key: "draft",
            label: "Chuyển sang bản nháp",
            onClick: () => {
                // TODO: Implement bulk draft
                getProducts();
            }
        },
        {
            key: "archive",
            label: "Lưu trữ mục đã chọn",
            onClick: () => {
                // TODO: Implement bulk archive
                getProducts();
            }
        },
        {
            key: "delete",
            label: "Xóa mục đã chọn",
            danger: true,
            onClick: async () => {
                if (window.confirm(`Bạn có chắc chắn muốn xóa ${selectedRowKeys.length} sản phẩm đã chọn?`)) {
                    try {
                        // Gọi API xóa từng sản phẩm
                        await Promise.all(selectedRowKeys.map(id => deleteProduct(id.toString())));
                        // Cập nhật lại danh sách sản phẩm sau khi xóa
                        await getProducts();
                        setSelectedRowKeys([]); // Xóa selections
                        console.log("Xóa sản phẩm thành công");
                    } catch (error) {
                        console.error("Error deleting products:", error);
                        alert("Xóa sản phẩm thất bại. Vui lòng thử lại.");
                    }
                }
            }
        },
    ];

    const rowSelection = {
        selectedRowKeys,
        onChange: setSelectedRowKeys,
    };
    return (
        <>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Quản lý sản phẩm
                        </h1>
                        <p className="text-gray-600">
                            Quản lý sản phẩm, hàng tồn kho và giá cả
                        </p>
                    </div>
                    <Space>
                        <Button icon={<ExportOutlined />} onClick={() => handleExportData()}>Xuất dữ liệu</Button>
                        <Button type="primary" onClick={handleCreate} icon={<PlusOutlined />}>
                            Thêm sản phẩm mới
                        </Button>
                    </Space>
                </div>

                <Row gutter={16} justify="space-around">
                    <Col flex="1">
                        <Card>
                            <Statistic title="Tổng số sản phẩm" value={totalProducts} />
                        </Card>
                    </Col>
                    <Col flex="1">
                        <Card>
                            <Statistic
                                title="Còn hàng"
                                value={inStockProducts}
                                valueStyle={{ color: "#3f8600" }}
                            />
                        </Card>
                    </Col>
                    <Col flex="1">
                        <Card>
                            <Statistic
                                title="Sắp hết hàng"
                                value={lowStockProducts}
                                valueStyle={{ color: "#faad14" }}
                            />
                        </Card>
                    </Col>
                    <Col flex="1">
                        <Card>
                            <Statistic
                                title="Hết hàng"
                                value={outOfStockProducts}
                                valueStyle={{ color: "#cf1322" }}
                            />
                        </Card>
                    </Col>
                    <Col flex="1">
                        <Card>
                            <Statistic
                                title="Tổng số lượng tồn kho"
                                value={totalStock}
                                valueStyle={{ color: "#1890ff" }}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Controls Bar */}
                <Card>
                    <div className="flex flex-wrap gap-4 items-center justify-between">
                        <Space>
                            <Select
                                value={searchType}
                                onChange={handleSearchTypeChange}
                                style={{ width: 120 }}
                            >
                                <Option value="all">Tất cả</Option>
                                <Option value="name">Tên SP</Option>
                                <Option value="category">Danh mục</Option>
                                <Option value="brand">Thương hiệu</Option>
                            </Select>
                            <Input
                                placeholder="Tìm kiếm sản phẩm..."
                                prefix={<SearchOutlined />}
                                style={{ width: 300 }}
                                value={searchText}
                                onChange={handleSearchChange}
                                allowClear
                            />
                        </Space>

                        <Space>
                            {selectedRowKeys.length > 0 && (
                                <Dropdown menu={{ items: bulkActionItems }}>
                                    <Button>
                                        Hành động hàng loạt ({selectedRowKeys.length})
                                    </Button>
                                </Dropdown>
                            )}
                            <Button icon={<FilterOutlined />}>
                                Bộ lọc khác
                            </Button>
                        </Space>
                    </div>
                </Card>

                {/* Products Table */}
                <Card>
                    <Table
                        rowSelection={rowSelection}
                        columns={columns}
                        dataSource={filteredProducts}
                        rowKey="id"
                        loading={tableLoading}
                        pagination={{
                            total: filteredProducts.length,
                            pageSize: 100, // Tăng kích thước trang để hiển thị nhiều sản phẩm hơn
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} trên ${total} mục`,
                        }}
                        scroll={{ x: 1000 }}
                    />
                </Card>
                <ProductForm
                    product={selectProduct}
                    type={formType}
                    visible={formModalVisible}
                    onClose={() => setFormModalVisible(false)}
                    onSuccess={async () => {
                        setFormModalVisible(false);
                        // Đặt lại các bộ lọc tìm kiếm để sản phẩm mới không bị ẩn
                        setSearchText('');
                        setSearchType('all');
                        await getProducts(); // Cập nhật lại danh sách sản phẩm sau khi thành công
                    }}
                />
            </div>
        </>
    );
};

export default AdminProducts;
