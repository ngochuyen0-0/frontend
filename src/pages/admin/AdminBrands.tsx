import React, { useEffect, useState } from "react";
import {
    Table,
    Card,
    Button,
    Input,
    Select,
    Tag,
    Space,
    Dropdown,
    Row,
    Col,
    Statistic,
    Image,
    Switch,
    Modal,
    Form,
    Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
    SearchOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    MoreOutlined,
    StarOutlined,
} from "@ant-design/icons";
import { useBrandStore } from "../../store/useBrandStore";
import { toast } from "sonner";

const { Option } = Select;

const AdminBrands: React.FC = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingBrand, setEditingBrand] = useState<any>(null);
    const [form] = Form.useForm();

    const { createBrand, updateBrand, getBrands, loading, brands } =
        useBrandStore();


    React.useEffect(() => {
        if (editingBrand) {
            form.setFieldsValue({
                name: editingBrand.name,
                description: editingBrand.description,
                logo_url: editingBrand.logo_url,
                status: editingBrand.status?.toLowerCase()
            });
        } else {
            form.resetFields();
        }
    }, [editingBrand, form]);
    useEffect(() => {
        const loadBrands = async () => {
            try {
                const res = await getBrands({
                    id: "",
                    searchKeyword: "",
                    page: 1,
                    row: 10,
                });
                console.log("resss: ", res);

            } catch (err) {
                console.error("Error loading brands:", err);
            }
        };

        loadBrands();
    }, [getBrands]);

    // Mock brands data

    // Định nghĩa cột
    const columns = [
        {
            title: "Logo",
            dataIndex: "logo_url",
            key: "logo_url",
            width: 80,
            render: (logo: string, record: any) => (
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    {logo ? (
                        <Image
                            src={logo}
                            alt={record.name}
                            className="w-8 h-8 p-2 object-contain"
                            preview={false}
                        />
                    ) : (
                        <div className="text-lg font-bold text-gray-400">
                            {record.name.charAt(0)}
                        </div>
                    )}
                </div>
            ),
        },
        {
            title: "Tên thương hiệu",
            dataIndex: "name",
            key: "name",
            render: (name: string, record: any) => (
                <div>
                    <div className="font-semibold flex items-center gap-2">
                        {name}
                        {record.featured && (
                            <StarOutlined className="text-yellow-500" />
                        )}
                    </div>
                    <div className="text-xs text-gray-500">
                        {record.website}
                    </div>
                </div>
            ),
            sorter: (a: any, b: any) => a.name.localeCompare(b.name),
        },
        {
            title: "Mô tả",
            dataIndex: "description",
            key: "description",
            render: (description: string) => (
                <div className="text-sm text-gray-600 line-clamp-2">
                    {description}
                </div>
            ),
        },
        {
            title: "Sản phẩm",
            dataIndex: "products",
            key: "products",
            render: (products: number) => (
                <Tag color="blue">{products} sản phẩm</Tag>
            ),
            sorter: (a: any, b: any) => a.products - b.products,
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status: string) => (
                <Tag color={status === "ACTIVE" ? "green" : "gray"}>
                    {status === "ACTIVE" ? "Hoạt động" : "Không hoạt động"}
                </Tag>
            ),
            filters: [
                { text: "Hoạt động", value: "active" },
                { text: "Không hoạt động", value: "draft" },
            ],
            onFilter: (value: any, record: any) => record.status === value,
        },
        {
            title: "Hành động",
            key: "actions",
            render: (_: any, record: any) => (
                <Dropdown
                    menu={{
                        items: [
                            {
                                key: "edit",
                                label: "Chỉnh sửa thương hiệu",
                                icon: <EditOutlined />,
                                onClick: () => handleEditBrand(record),
                            },
                            {
                                key: "view",
                                label: "Xem sản phẩm",
                                icon: <EyeOutlined />,
                                onClick: () => handleViewProducts(record.id),
                            },
                            { type: "divider" },
                            {
                                key: "delete",
                                label: "Xóa thương hiệu",
                                icon: <DeleteOutlined />,
                                danger: true,
                                onClick: () => handleDeleteBrand(record.id),
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

    // Handlers
    const handleToggleFeatured = (brandId: string, featured: boolean) => {
        console.log(`Toggle featured for brand ${brandId}: ${featured}`);
        // API call would go here
    };

    const handleEditBrand = (brand: any) => {
        setEditingBrand(brand);
        setIsModalVisible(true);
    };

    const handleViewProducts = (brandId: string) => {
        console.log(`View products for brand: ${brandId}`);
        // Navigate to products page filtered by brand
        window.location.href = `/admin/v1/products?brandId=${brandId}`;
    };

    const handleDeleteBrand = (brandId: string) => {
        Modal.confirm({
            title: "Xóa thương hiệu",
            content:
                "Bạn có chắc chắn muốn xóa thương hiệu này? Hành động này không thể hoàn tác.",
            okText: "Xóa",
            okType: "danger",
            cancelText: "Hủy",
            onOk() {
                console.log(`Xóa thương hiệu: ${brandId}`);
                // API call would go here
            },
        });
    };

    const handleAddBrand = () => {
        setEditingBrand(null);
        setIsModalVisible(true);
    };

    const handleModalOk = async () => {
        // Save brand logic would go here
        form.validateFields()
            .then(async (values) => {
                console.log("brand data: ", values);
                if (editingBrand) {
                    console.log(
                        "Editing brand:",
                        editingBrand.id,
                        "with data:",
                        values
                    );
                    // Chuyển đổi status từ lowercase sang uppercase để phù hợp với enum backend
                    const brandData = {
                        ...values,
                        status: values.status ? values.status.toUpperCase() : undefined
                    };
                    // Loại bỏ trường logo_url nếu không có giá trị để tránh lỗi cập nhật
                    const updateData = { ...brandData };
                    if (!updateData.logo_url) {
                        delete updateData.logo_url;
                    }
                    // Không cho phép cập nhật số lượng sản phẩm trực tiếp từ form
                    if (updateData.products !== undefined) {
                        delete updateData.products;
                    }
                    // API call để update brand
                    const res = await updateBrand(editingBrand.id, updateData);
                    console.log("API response from updateBrand:", res);
                    if (res) {
                        // Sau khi cập nhật, tải lại danh sách thương hiệu để cập nhật số lượng sản phẩm
                        try {
                            await getBrands({
                                id: "",
                                searchKeyword: "",
                                page: 1,
                                row: 10,
                            });
                        } catch (err) {
                            console.error("Error reloading brands:", err);
                        }
                        toast.success("Chỉnh sửa thương hiệu thành công");
                    }
                } else {
                    console.log("Adding new brand with data:", values);
                    // Chuyển đổi status từ lowercase sang uppercase để phù hợp với enum backend
                    const brandData = {
                        ...values,
                        status: values.status ? values.status.toUpperCase() : "ACTIVE"
                    };
                    // Loại bỏ trường logo_url nếu không có giá trị để tránh lỗi tạo mới
                    const createData = { ...brandData };
                    if (!createData.logo_url) {
                        delete createData.logo_url;
                    }
                    // API call để thêm brand mới
                    const res = await createBrand(createData);
                    console.log("API response from createBrand:", res);
                    if (res) {
                        // Sau khi tạo mới, tải lại danh sách thương hiệu để cập nhật
                        try {
                            await getBrands({
                                id: "",
                                searchKeyword: "",
                                page: 1,
                                row: 10,
                            });
                        } catch (err) {
                            console.error("Error reloading brands:", err);
                        }
                        toast.success("Thêm thương hiệu thành công");
                    }
                }

                setIsModalVisible(false);
                setEditingBrand(null);
                form.resetFields();
                // Tải lại danh sách thương hiệu sau khi đóng modal để đảm bảo dữ liệu được cập nhật
                try {
                    await getBrands({
                        id: "",
                        searchKeyword: "",
                        page: 1,
                        row: 10,
                    });
                } catch (err) {
                    console.error("Error reloading brands:", err);
                }
            })
            .catch((errorInfo) => {
                console.log("Validation failed:", errorInfo);
            });
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setEditingBrand(null);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: setSelectedRowKeys,
    };

    return (
        <>
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Quản lý thương hiệu</h1>
                    <p className="text-gray-600">
                        Quản lý các thương hiệu và nhà sản xuất sản phẩm
                    </p>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddBrand}
                >
                    Thêm thương hiệu mới
                </Button>
            </div>

            <Row gutter={16}>
                <Col span={6}>
                    <Card>
                        <Statistic title="Tổng số thương hiệu" value={brands.length} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Thương hiệu đang hoạt động"
                            value={brands.filter(b => b.status === "ACTIVE").length}
                            valueStyle={{ color: "#3f8600" }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Thương hiệu nổi bật"
                            value={brands.filter(b => b.featured === true).length}
                            valueStyle={{ color: "#cf1322" }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Tổng số sản phẩm"
                            value={brands.reduce((total, brand) => total + (brand.products || 0), 0)}
                            valueStyle={{ color: "#1890ff" }}
                        />
                    </Card>
                </Col>
            </Row>

            <Card>
                <div className="flex flex-wrap gap-4 items-center justify-between">
                    <Space>
                        <Input
                            placeholder="Tìm kiếm thương hiệu..."
                            prefix={<SearchOutlined />}
                            style={{ width: 250 }}
                        />
                        <Select placeholder="Tất cả trạng thái" style={{ width: 150 }}>
                            <Option value="active">Hoạt Động</Option>
                            <Option value="draft">Không Hoạt Động</Option>
                        </Select>
                        <Select placeholder="Nổi bật" style={{ width: 150 }}>
                            <Option value="true">Nổi bật</Option>
                            <Option value="false">Bình thường</Option>
                        </Select>
                    </Space>

                    <Space>
                        {selectedRowKeys.length > 0 && (
                            <Dropdown
                                menu={{
                                    items: [
                                        {
                                            key: "activate",
                                            label: "Kích hoạt đã chọn",
                                        },
                                        {
                                            key: "deactivate",
                                            label: "Vô hiệu hóa đã chọn",
                                        },
                                        {
                                            key: "feature",
                                            label: "Đánh dấu là nổi bật",
                                        },
                                        {
                                            key: "unfeature",
                                            label: "Bỏ đánh dấu nổi bật",
                                        },
                                        { type: "divider" },
                                        {
                                            key: "delete",
                                            label: "Xóa đã chọn",
                                            danger: true,
                                        },
                                    ],
                                }}
                            >
                                <Button>
                                    Hành động hàng loạt ({selectedRowKeys.length})
                                </Button>
                            </Dropdown>
                        )}
                    </Space>
                </div>
            </Card>

            <Card>
                <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={brands}
                    rowKey="id"
                    pagination={{
                        total: 24,
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} của ${total} thương hiệu`,
                    }}
                />
            </Card>

            {/* Add/Edit Brand Modal */}
            <Modal
                title={editingBrand ? "Chỉnh sửa thương hiệu" : "Thêm thương hiệu mới"}
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                width={600}
            >
                <Form layout="vertical" form={form}>
                    <Form.Item label="Tên thương hiệu" required name="name">
                        <Input placeholder="Nhập tên thương hiệu" />
                    </Form.Item>
                    <Form.Item label="Mô tả" name="description">
                        <Input.TextArea
                            rows={3}
                            placeholder="Nhập mô tả thương hiệu..."
                        />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Logo" name="logo_url">
                                <Input placeholder="URL logo hoặc chọn file" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Upload Logo Mới">
                                <Upload
                                    name="logo"
                                    accept="image/*"
                                    showUploadList={false}
                                    beforeUpload={(file) => {
                                        // Xử lý upload file ở đây
                                        const reader = new FileReader();
                                        reader.onload = (e) => {
                                            form.setFieldsValue({ logo_url: e.target?.result as string });
                                        };
                                        reader.readAsDataURL(file);
                                        return false; // Prevent upload
                                    }}
                                >
                                    <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                                </Upload>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Trạng thái" name="status">
                                <Select defaultValue="active">
                                    <Option value="active">Hoạt động</Option>
                                    <Option value="draft">Không hoạt động</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
};

export default AdminBrands;
