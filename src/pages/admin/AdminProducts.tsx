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
import { useNavigate } from "react-router-dom";
import { useProductStore } from "../../store/useProductStore";
import { deleteProduct } from "../../services/productService";
import ProductForm from "../../components/admin/ProductFrom";
import { Product } from "../../types/product";

const { Option } = Select;

const AdminProducts: React.FC = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [tableLoading, setTableLoading] = useState(false);
    const navigate = useNavigate();
    const { products, getProducts } = useProductStore()
    const [selectProduct, setSelectProduct] = useState<Product | null>(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [formModalVisible, setFormModalVisible] = useState(false);
    const [formType, setFormType] = useState<'create' | 'edit'>('create');
    useEffect(() => {
        getProducts();
    }, [])

    const handleEdit = (product: Product) => {
        setSelectProduct(product);
        setFormType('edit');
        setFormModalVisible(true);
    };

    const handleCreate = () => {
        setSelectProduct(null);
        setFormType('create');
        setFormModalVisible(true);
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


    // Tính toán các thống kê
    const totalProducts = products.length;
    const inStockProducts = products.filter(product =>
        product.variants && Array.isArray(product.variants) && product.variants.some((variant: any) => variant.stock > 0)
    ).length;
    const lowStockProducts = products.filter(product =>
        product.variants && Array.isArray(product.variants) && product.variants.some((variant: any) => variant.stock > 0 && variant.stock <= 5)
    ).length;
    const outOfStockProducts = products.filter(product =>
        product.variants && Array.isArray(product.variants) && product.variants.every((variant: any) => variant.stock === 0)
    ).length;

    // Columns definition
    const columns = [
        {
            title: "",
            dataIndex: "id",
            key: "id",
            render: (id: string, record: any) => {
                const thumbnail = record.images?.find((i: any) => i.is_thumbnail);
                return thumbnail ? (<img style={{ width: 70, height: 40, borderRadius: 6 }} src={thumbnail.image_url} />) : <div className="w-[70px] h-[40px] bg-gray-200 rounded flex items-center justify-center">No Image</div>;
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
            filters: [
                { text: "Túi da", value: "leather" },
                { text: "túi vải", value: "cloth" },
                { text: "Bộ sưu tập", value: "limit" },
            ],
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
            title: "Trạng thái ",
            dataIndex: "is_active",
            key: "is_active",
            render: (_, record: any) => {
                // Kiểm tra xem sản phẩm có biến thể nào đang hoạt động không
                const hasActiveVariant = record.variants && record.variants.some((v: any) => v.is_active);
                const isActive = hasActiveVariant !== undefined ? hasActiveVariant : record.is_active;
                const color = isActive ? "green" : "red";
                const text = isActive ? "Hoạt động" : "Không hoạt động";
                return <Tag color={color}>{text}</Tag>;
            },
            filters: [
                { text: "Hoạt động", value: true },
                { text: "Không hoạt động", value: false },
            ],
            onFilter: (value: any, record: any) => {
                const hasActiveVariant = record.variants && record.variants.some((v: any) => v.is_active);
                const isActive = hasActiveVariant !== undefined ? hasActiveVariant : record.is_active;
                return isActive === value;
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
                            },
                            { type: "divider" },
                            {
                                key: "delete",
                                label: "Xóa",
                                icon: <DeleteOutlined />,
                                danger: true,
                                onClick: () => handleDelete(record)
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
                        <Button icon={<ExportOutlined />}>Xuất dữ liệu</Button>
                        <Button type="primary" onClick={handleCreate} icon={<PlusOutlined />}>
                            Thêm sản phẩm mới
                        </Button>
                    </Space>
                </div>

                <Row gutter={16}>
                    <Col span={6}>
                        <Card>
                            <Statistic title="Tổng số sản phẩm" value={totalProducts} />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Còn hàng"
                                value={inStockProducts}
                                valueStyle={{ color: "#3f8600" }}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Sắp hết hàng"
                                value={lowStockProducts}
                                valueStyle={{ color: "#faad14" }}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Hết hàng"
                                value={outOfStockProducts}
                                valueStyle={{ color: "#cf1322" }}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Controls Bar */}
                <Card>
                    <div className="flex flex-wrap gap-4 items-center justify-between">
                        <Space>
                            <Input
                                placeholder="Tìm kiếm sản phẩm..."
                                prefix={<SearchOutlined />}
                                style={{ width: 300 }}
                            />
                            <Select
                                placeholder="Tất cả danh mục"
                                style={{ width: 150 }}
                            >
                                <Option value="leather">Túi da</Option>
                                <Option value="cloth">Túi vải</Option>
                                <Option value="limit">Bộ sưu tập</Option>
                            </Select>
                            <Select
                                placeholder="Tất cả trạng thái"
                                style={{ width: 150 }}
                            >
                                <Option value="published">Đã công bố</Option>
                                <Option value="draft">Bản nháp</Option>
                                <Option value="archived">Đã lưu trữ</Option>
                            </Select>
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
                        dataSource={products}
                        rowKey="id"
                        loading={tableLoading}
                        pagination={{
                            total: products.length,
                            pageSize: 20,
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
                    onSuccess={() => {
                        setFormModalVisible(false);
                        getProducts(); // Cập nhật lại danh sách sản phẩm sau khi thành công
                    }}
                />
            </div>
        </>
    );
};

export default AdminProducts;
