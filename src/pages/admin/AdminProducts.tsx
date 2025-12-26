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
import ProductForm from "../../components/admin/ProductFrom";
import { Product } from "../../types/product";

const { Option } = Select;

const AdminProducts: React.FC = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [loading, setLoading] = useState(false);
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

    // Columns definition
    const columns = [
        {
            title: "",
            dataIndex: "id",
            key: "id",
            render: (id: string, record: any) => {
                const thumbnail = record.images?.find(i => i.is_thumbnail) || "";
                return (<img style={{ width: 70, height: 40, borderRadius: 6 }} src={thumbnail.image_url} />)
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
                        {record.variants.length || 0} Biến thể
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
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status: string) => {
                const statusConfig: any = {
                    published: { color: "green", text: "Đã công bố" },
                    draft: { color: "blue", text: "Bản nháp" },
                    archived: { color: "gray", text: "Đã lưu trữ" },
                };

                const config = statusConfig[status] || statusConfig.draft;
                return <Tag color={config.color}>{config.text}</Tag>;
            },
            filters: [
                { text: "Đã công bố", value: "published" },
                { text: "Bản nháp", value: "draft" },
                { text: "Đã lưu trữ", value: "archived" },
            ],
            onFilter: (value: any, record: any) => record.status === value,
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
                                key: "quick-edit",
                                label: "Sửa nhanh",
                                icon: <FormOutlined />,
                            },
                            {
                                key: "view",
                                label: "Xem chi tiết",
                                icon: <EyeOutlined />,
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
        { key: "publish", label: "Công bố mục đã chọn" },
        { key: "draft", label: "Chuyển sang bản nháp" },
        { key: "archive", label: "Lưu trữ mục đã chọn" },
        { key: "delete", label: "Xóa mục đã chọn", danger: true },
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
                        <Button type="primary" onClick={() => navigate('/admin/v1/products/add-products')} icon={<PlusOutlined />}>
                            Thêm sản phẩm mới
                        </Button>
                    </Space>
                </div>

                <Row gutter={16}>
                    <Col span={6}>
                        <Card>
                            <Statistic title="Tổng số sản phẩm" value={156} />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Còn hàng"
                                value={45}
                                valueStyle={{ color: "#3f8600" }}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Sắp hết hàng"
                                value={12}
                                valueStyle={{ color: "#faad14" }}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Hết hàng"
                                value={3}
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
                        pagination={{
                            total: 156,
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

                    }}
                />
            </div>
        </>
    );
};

export default AdminProducts;
