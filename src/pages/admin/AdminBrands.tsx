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
} from "antd";
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
        form.setFieldsValue(editingBrand);
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

    // Columns definition
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
            title: "Brand Name",
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
            title: "Description",
            dataIndex: "description",
            key: "description",
            render: (description: string) => (
                <div className="text-sm text-gray-600 line-clamp-2">
                    {description}
                </div>
            ),
        },
        {
            title: "Products",
            dataIndex: "products",
            key: "products",
            render: (products: number) => (
                <Tag color="blue">{products} 0 products</Tag>
            ),
            sorter: (a: any, b: any) => a.products - b.products,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) => (
                <Tag color={status === "ACTIVE" ? "green" : "gray"}>
                    {status === "ACTIVE" ? "Active" : "Draft"}
                </Tag>
            ),
            filters: [
                { text: "Active", value: "active" },
                { text: "Draft", value: "draft" },
            ],
            onFilter: (value: any, record: any) => record.status === value,
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: any) => (
                <Dropdown
                    menu={{
                        items: [
                            {
                                key: "edit",
                                label: "Edit Brand",
                                icon: <EditOutlined />,
                                onClick: () => handleEditBrand(record),
                            },
                            {
                                key: "view",
                                label: "View Products",
                                icon: <EyeOutlined />,
                                onClick: () => handleViewProducts(record.id),
                            },
                            { type: "divider" },
                            {
                                key: "delete",
                                label: "Delete Brand",
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
    };

    const handleDeleteBrand = (brandId: string) => {
        Modal.confirm({
            title: "Delete Brand",
            content:
                "Are you sure you want to delete this brand? This action cannot be undone.",
            okText: "Delete",
            okType: "danger",
            cancelText: "Cancel",
            onOk() {
                console.log(`Delete brand: ${brandId}`);
                // API call would go here
            },
        });
    };

    const handleAddBrand = () => {
        setEditingBrand(null);
        setIsModalVisible(true);
    };

    const handleModalOk = () => {
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
                    // API call để update brand
                    const res = await updateBrand(editingBrand.id, values);
                    console.log("API response from sendVerifyEmail:", res);
                    if (res) {
                        toast.success("Edit brand success");
                    }
                } else {
                    console.log("Adding new brand with data:", values);
                    // API call để thêm brand mới
                    const res = await createBrand(values);
                    console.log("API response from sendVerifyEmail:", res);
                    if (res) {
                        toast.success("Add brand success");
                    }
                }

                setIsModalVisible(false);
                setEditingBrand(null);
                form.resetFields();
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
                    <h1 className="text-2xl font-bold">Brands Management</h1>
                    <p className="text-gray-600">
                        Manage product brands and manufacturers
                    </p>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddBrand}
                >
                    Add New Brand
                </Button>
            </div>

            <Row gutter={16}>
                <Col span={6}>
                    <Card>
                        <Statistic title="Total Brands" value={brands.length} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Active Brands"
                            value={brands.filter(b => b.is_active != true).length}
                            valueStyle={{ color: "#3f8600" }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Featured Brands"
                            value={brands.length}
                            valueStyle={{ color: "#cf1322" }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Total Products"
                            value={156}
                            valueStyle={{ color: "#1890ff" }}
                        />
                    </Card>
                </Col>
            </Row>

            <Card>
                <div className="flex flex-wrap gap-4 items-center justify-between">
                    <Space>
                        <Input
                            placeholder="Search brands..."
                            prefix={<SearchOutlined />}
                            style={{ width: 250 }}
                        />
                        <Select placeholder="All Status" style={{ width: 150 }}>
                            <Option value="active">Active</Option>
                            <Option value="draft">Draft</Option>
                        </Select>
                        <Select placeholder="Featured" style={{ width: 150 }}>
                            <Option value="true">Featured</Option>
                            <Option value="false">Regular</Option>
                        </Select>
                    </Space>

                    <Space>
                        {selectedRowKeys.length > 0 && (
                            <Dropdown
                                menu={{
                                    items: [
                                        {
                                            key: "activate",
                                            label: "Activate Selected",
                                        },
                                        {
                                            key: "deactivate",
                                            label: "Deactivate Selected",
                                        },
                                        {
                                            key: "feature",
                                            label: "Mark as Featured",
                                        },
                                        {
                                            key: "unfeature",
                                            label: "Remove Featured",
                                        },
                                        { type: "divider" },
                                        {
                                            key: "delete",
                                            label: "Delete Selected",
                                            danger: true,
                                        },
                                    ],
                                }}
                            >
                                <Button>
                                    Bulk Actions ({selectedRowKeys.length})
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
                            `${range[0]}-${range[1]} of ${total} brands`,
                    }}
                />
            </Card>

            {/* Add/Edit Brand Modal */}
            <Modal
                title={editingBrand ? "Edit Brand" : "Add New Brand"}
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                width={600}
            >
                <Form layout="vertical" form={form}>
                    <Form.Item label="Brand Name" required name="name">
                        <Input placeholder="Enter brand name" />
                    </Form.Item>
                    <Form.Item label="Description" name="description">
                        <Input.TextArea
                            rows={3}
                            placeholder="Enter brand description..."
                        />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Logo" name="logo_url">
                                <Input placeholder="Logo URL" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Status">
                                <Select defaultValue="active">
                                    <Option value="active">Active</Option>
                                    <Option value="draft">Draft</Option>
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
