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
import { useNavigate, useParams } from "react-router-dom";
import { Product, useProductStore } from "../../store/useProductStore";
import { Label } from "recharts";
import axios from "axios";
import apiClient from "../../utils/apiClient";
import VariantForm from "../../components/admin/ProductVariantForm";
import { ProductVariant } from "../../types/product";

const { Option } = Select;

const AdminProductDetail: React.FC = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const { product_id } = useParams();
    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState<Product | undefined>(undefined);
    const navigate = useNavigate();
    const { variants, getProductVariants } = useProductStore()


    const [selectVariant, setSelectVariant] = useState<ProductVariant | null>(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [formModalVisible, setFormModalVisible] = useState(false);
    const [formType, setFormType] = useState<'create' | 'edit'>('create');

    useEffect(() => {
        getProductVariants({ product_id: product_id });
        apiClient.post("/products/get", { id: product_id }).then(res => {
            setProduct(res?.data?.data?.[0])
        }).catch((err) => {

        })
    }, [])

    const handleEdit = (product: ProductVariant) => {
        setSelectVariant(product);
        setFormType('edit');
        setFormModalVisible(true);
    };

    const handleCreate = () => {
        setSelectVariant(null);
        setFormType('create');
        setFormModalVisible(true);
    };
    // Columns definition
    const columns = [
        {
            title: "SKU Code",
            dataIndex: "sku",
            key: "sku",
            render: (sku: string, record: any) => (
                <div>
                    <div className="font-semibold text-blue-500" style={{
                        cursor: "pointer"
                    }}>{sku}</div>
                </div>
            ),
            sorter: (a: any, b: any) => a.sku.localeCompare(b.sku),
        },
        {
            title: "Price ($)",
            dataIndex: "price",
            key: "price",
            render: (value: string) => {
                return <Tag>{Number(value).toLocaleString()}</Tag>;
            },
            onFilter: (value: any, record: any) => record.status === value,
        },
        {
            title: "Size",
            dataIndex: "size",
            key: "color",
            render: (value: string) => {
                return <Tag>{value}</Tag>;
            },
            onFilter: (value: any, record: any) => record.status === value,
        },
        {
            title: "Color",
            dataIndex: "color",
            key: "color",
            render: (status: string) => {
                return <Tag color={status.toLocaleLowerCase() == "white" ? "#CCC" : status.toLocaleLowerCase()}>{status}</Tag>;
            },
            onFilter: (value: any, record: any) => record.status === value,
        },
        {
            title: "Stock Quantity",
            dataIndex: "stock_quantity",
            key: "stock_quantity",
            render: (value: string) => {
                const getColor = (num_stock: number) => {
                    if (num_stock < 2) return 'red';
                    if (num_stock < 4) return '#bd5b37ff'
                    if (num_stock < 6) return '#bf581cff'
                    if (num_stock < 8) return '#d6923aff'
                    if (num_stock < 10) return '#3ba26bff'
                    if (num_stock >= 10) return '#0b9c4fff'
                }
                const num_stock = Number(value)

                return <Tag color={getColor(num_stock)}>{num_stock.toLocaleString()}</Tag>;
            },
            onFilter: (value: any, record: any) => record.status === value,
        },
        {
            title: "Actions",
            key: "actions",
            width: 100,
            render: (_, record) => (
                <Dropdown
                    menu={{
                        items: [
                            {
                                key: "edit",
                                label: "Edit",
                                icon: <EditOutlined />,
                                onClick: () => handleEdit(record)
                            },
                            {
                                key: "view",
                                label: "View Details",
                                icon: <EyeOutlined />,
                            },
                            {
                                key: "duplicate",
                                label: "Duplicate",
                                icon: <CopyOutlined />,
                            },
                            { type: "divider" },
                            {
                                key: "delete",
                                label: "Delete",
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
        { key: "publish", label: "Publish Selected" },
        { key: "draft", label: "Move to Draft" },
        { key: "archive", label: "Archive Selected" },
        { key: "delete", label: "Delete Selected", danger: true },
    ];

    const rowSelection = {
        selectedRowKeys,
        onChange: setSelectedRowKeys,
    };
    return (
        <>
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">
                        Products Management
                    </h1>
                    <p className="text-gray-600">
                        Manage your products, inventory, and pricing
                    </p>
                </div>
                <Space>
                    <Button icon={<ExportOutlined />}>Export</Button>
                    <Button type="primary" onClick={handleCreate} icon={<PlusOutlined />}>
                        Add New Variant
                    </Button>
                </Space>
            </div>
            <div style={{
                display: "grid",
                gap: 10,
                gridTemplateColumns: "1fr 2fr"
            }}>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <Card>
                        Total Variant:
                        <Tag color="blue" style={{
                            fontSize: "14px",
                            margin: "0px 10px"
                        }}>{variants.length} Variants</Tag>
                    </Card>
                    <Card>
                        <label style={{ fontSize: "12px", fontWeight: 550 }}>Product Name</label>
                        <Card>{product?.name}</Card>
                        <label style={{ fontSize: "12px", fontWeight: 550 }}>Description</label>
                        <Card>{product?.description}</Card>
                        <label style={{ fontSize: "12px", fontWeight: 550 }}>Created Date</label>
                        <Card>{`${new Date(product?.created_at || "").toLocaleDateString()} - ${new Date(product?.created_at || "").toLocaleTimeString()}`}</Card>
                    </Card>
                </div>
                <div>
                    {/* Controls Bar */}
                    <Card>
                        <div className="flex flex-wrap gap-4 items-center justify-between">
                            <Space>
                                <Input
                                    placeholder="Search products..."
                                    prefix={<SearchOutlined />}
                                />
                                <Select
                                    placeholder="All Categories"
                                >
                                    <Option value="leather">Túi da</Option>
                                    <Option value="cloth">Túi vải</Option>
                                    <Option value="limit">Bộ sưu tập</Option>
                                </Select>
                                <Select
                                    placeholder="All Status"
                                >
                                    <Option value="published">Published</Option>
                                    <Option value="draft">Draft</Option>
                                    <Option value="archived">Archived</Option>
                                </Select>
                            </Space>

                            <Space>
                                {selectedRowKeys.length > 0 && (
                                    <Dropdown menu={{ items: bulkActionItems }}>
                                        <Button>
                                            Bulk Actions ({selectedRowKeys.length})
                                        </Button>
                                    </Dropdown>
                                )}
                                <Button icon={<FilterOutlined />}>
                                    More Filters
                                </Button>
                            </Space>
                        </div>
                    </Card>

                    {/* Products Table */}
                    <Card>
                        <Table
                            rowSelection={rowSelection}
                            columns={columns}
                            dataSource={variants}
                            rowKey="id"
                            pagination={{
                                total: 156,
                                pageSize: 20,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                showTotal: (total, range) =>
                                    `${range[0]}-${range[1]} of ${total} items`,
                            }}
                            scroll={{ x: 300 }}
                        />
                    </Card>
                </div>
                <VariantForm
                    variant={selectVariant}
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

export default AdminProductDetail;
