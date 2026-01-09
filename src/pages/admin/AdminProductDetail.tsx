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
    message,
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
    const [refreshKey, setRefreshKey] = useState(0);
    const { variants, getProductVariants } = useProductStore()


    const [selectVariant, setSelectVariant] = useState<ProductVariant | null>(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [formModalVisible, setFormModalVisible] = useState(false);
    const [formType, setFormType] = useState<'create' | 'edit'>('create');
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        // Gọi API để lấy cả các biến thể không hoạt động
        getProductVariants({ product_id: product_id, include_inactive: true });
        apiClient.post("/products/get", { id: product_id }).then(res => {
            setProduct(res?.data?.data?.[0])
        }).catch((err) => {

        })
    }, [refreshKey])

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

    const handleBulkActivate = async () => {
        try {
            // Call API to activate selected variants
            for (const variantId of selectedRowKeys) {
                const variant = variants.find(v => v.id === variantId);
                if (variant) {
                    await useProductStore.getState().updateProductVariant(String(variantId), {
                        is_active: true
                    });
                }
            }
            message.success(`Đã kích hoạt ${selectedRowKeys.length} biến thể`);
            // Refresh the variants list
            setTimeout(() => {
                setRefreshKey(prev => prev + 1);
            }, 300);
            setSelectedRowKeys([]);
        } catch (error) {
            message.error('Có lỗi khi kích hoạt biến thể');
        }
    };

    const handleBulkDeactivate = async () => {
        try {
            // Call API to deactivate selected variants
            for (const variantId of selectedRowKeys) {
                const variant = variants.find(v => v.id === variantId);
                if (variant) {
                    await useProductStore.getState().updateProductVariant(String(variantId), {
                        is_active: false
                    });
                }
            }
            message.success(`Đã vô hiệu hóa ${selectedRowKeys.length} biến thể`);
            // Refresh the variants list
            setTimeout(() => {
                setRefreshKey(prev => prev + 1);
            }, 300);
            setSelectedRowKeys([]);
        } catch (error) {
            message.error('Có lỗi khi vô hiệu hóa biến thể');
        }
    };

    // Columns definition
    const columns = [
        {
            title: "Mã SKU",
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
            title: "Giá (VND)",
            dataIndex: "price",
            key: "price",
            render: (value: string) => {
                return <Tag>{Number(value).toLocaleString()}</Tag>;
            },
            onFilter: (value: any, record: any) => record.status === value,
        },
        {
            title: "Kích cỡ",
            dataIndex: "size",
            key: "color",
            render: (value: string) => {
                return <Tag>{value}</Tag>;
            },
            onFilter: (value: any, record: any) => record.status === value,
        },
        {
            title: "Màu sắc",
            dataIndex: "color",
            key: "color",
            render: (color: string) => {
                // Chuyển đổi tên màu sang mã màu hex nếu cần
                const getColorHex = (colorName: string) => {
                    const colorMap: Record<string, string> = {
                        "đỏ": "#EF4444",
                        "xanh": "#3B82F6",
                        "xanh lá": "#22C55E",
                        "vàng": "#EAB308",
                        "tím": "#A855F7",
                        "cam": "#F97316",
                        "hồng": "#EC4899",
                        "nâu": "#92400E",
                        "xám": "#6B7280",
                        "đen": "#000000",
                        "trắng": "#FFFFFF",
                        "be": "#F5F5DC",
                        "xanh navy": "#1E3A8A",
                        "xanh ngọc": "#0F766E",
                        // Thêm các màu thông dụng khác nếu cần
                    };
                    
                    const normalizedColor = colorName.toLowerCase().trim();
                    return colorMap[normalizedColor] || colorName;
                };

                const colorHex = getColorHex(color);
                
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div
                            style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                backgroundColor: colorHex,
                                border: colorHex === "#FFFFFF" ? '1px solid #D1D5DB' : 'none',
                                display: 'inline-block'
                            }}
                        />
                        <span>{color}</span>
                    </div>
                );
            },
            onFilter: (value: any, record: any) => record.status === value,
        },
        {
            title: "Số lượng tồn kho",
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
            title: "Trạng thái",
            dataIndex: "is_active",
            key: "is_active",
            render: (isActive: boolean) => {
                return (
                    <Tag color={isActive ? "green" : "red"}>
                        {isActive ? "Hoạt động" : "Không hoạt động"}
                    </Tag>
                );
            },
            filters: [
                { text: 'Hoạt động', value: true },
                { text: 'Không hoạt động', value: false },
            ],
            onFilter: (value: any, record: any) => record.is_active === value,
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
                                key: "toggle",
                                label: record.is_active ? "Vô hiệu hóa" : "Kích hoạt",
                                icon: record.is_active ? <DeleteOutlined /> : <FormOutlined />,
                                onClick: () => {
                                    // Gọi API cập nhật trạng thái biến thể
                                    useProductStore.getState().updateProductVariant(record.id, {
                                        is_active: !record.is_active
                                    }).then(() => {
                                        message.success(`Biến thể đã được ${record.is_active ? 'vô hiệu hóa' : 'kích hoạt'}`);
                                        // Làm mới danh sách biến thể
                                        setRefreshKey(prev => prev + 1);
                                    }).catch(() => {
                                        message.error(`Lỗi khi ${record.is_active ? 'vô hiệu hóa' : 'kích hoạt'} biến thể`);
                                    });
                                }
                            },
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
        { key: "activate", label: "Kích hoạt đã chọn" },
        { key: "deactivate", label: "Vô hiệu hóa đã chọn" },
        { key: "archive", label: "Lưu trữ đã chọn" },
        { key: "delete", label: "Xóa đã chọn", danger: true },
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
                        Quản lý sản phẩm
                      </h1>
                      <p className="text-gray-600">
                          Quản lý sản phẩm, hàng tồn kho và giá cả
                      </p>
                  </div>
                <Space>
                    <Button icon={<ExportOutlined />}>Export</Button>
                    <Button type="primary" onClick={handleCreate} icon={<PlusOutlined />}>
                        Thêm phiên bản mới
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
                        Tổng số phiên bản:
                        <Tag color="blue" style={{
                            fontSize: "14px",
                            margin: "0px 10px"
                        }}>{variants.length} Phiên bản</Tag>
                    </Card>
                    <Card>
                        <label style={{ fontSize: "12px", fontWeight: 550 }}>Tên sản phẩm</label>
                        <Card>{product?.name}</Card>
                        <label style={{ fontSize: "12px", fontWeight: 550 }}>Mô tả</label>
                        <Card>{product?.description}</Card>
                        <label style={{ fontSize: "12px", fontWeight: 550 }}>Ngày tạo</label>
                        <Card>{`${new Date(product?.created_at || "").toLocaleDateString()} - ${new Date(product?.created_at || "").toLocaleTimeString()}`}</Card>
                    </Card>
                </div>
                <div>
                    {/* Controls Bar */}
                    <Card>
                        <div className="flex flex-wrap gap-4 items-center justify-between">
                            <Space>
                                <Input
                                    placeholder="Tìm kiếm sản phẩm..."
                                    prefix={<SearchOutlined />}
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                />
                            </Space>

                            <Space>
                                {selectedRowKeys.length > 0 && (
                                    <Dropdown
                                        menu={{
                                            items: bulkActionItems,
                                            onClick: (e) => {
                                                if (e.key === 'activate') {
                                                    handleBulkActivate();
                                                } else if (e.key === 'deactivate') {
                                                    handleBulkDeactivate();
                                                }
                                            }
                                        }}
                                    >
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
                            key={`variant-table-${refreshKey}`} // Thêm key để ép re-render khi refresh
                            rowSelection={rowSelection}
                            columns={columns}
                            dataSource={variants.filter(variant =>
                                !searchText ||
                                (variant.sku && variant.sku.toLowerCase().includes(searchText.toLowerCase()))
                            )}
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
                        // Làm mới danh sách biến thể sau khi tạo hoặc cập nhật
                        setTimeout(() => {
                            setRefreshKey(prev => prev + 1);
                        }, 300); // Thêm độ trễ nhỏ để đảm bảo cập nhật
                    }}
                />
            </div>
        </>
    );
};

export default AdminProductDetail;
