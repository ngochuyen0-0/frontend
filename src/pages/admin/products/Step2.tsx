import React, { useState } from "react";
import {
    Form,
    Input,
    Button,
    Card,
    Row,
    Col,
    InputNumber,
    Table,
    Space,
    message,
    Modal,
    Tag,
    Steps,
} from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    ArrowLeftOutlined,
    ArrowRightOutlined,
} from "@ant-design/icons";
import { useProductStore } from "../../../store/useProductStore";
import { toast } from "sonner";

const { Step } = Steps;

interface Variant {
    id?: string;
    sku: string;
    price: number;
    color: string;
    size: string;
    stock_quantity: number;
}

interface Step2Props {
    onNext: (variants: Variant[]) => void;
    onBack: () => void;
    productData: any; // Data từ step 1
    initialVariants?: Variant[];
}

const Step2Variants: React.FC<Step2Props> = ({
    onNext,
    onBack,
    productData,
    initialVariants = [],
}) => {
    console.log("profile prod data: ", productData);

    const [variants, setVariants] = useState<Variant[]>(initialVariants);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingVariant, setEditingVariant] = useState<Variant | null>(null);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { createProductVariant } = useProductStore();

    const handleAddVariant = (values: Omit<Variant, "id">) => {
        const newVariant: Variant = {
            ...values,
            id: Date.now().toString(), // Temporary ID
        };

        setVariants((prev) => [...prev, newVariant]);
        setModalVisible(false);
        form.resetFields();
        message.success("Variant added successfully");
    };

    const handleEditVariant = (values: Omit<Variant, "id">) => {
        if (editingVariant) {
            setVariants((prev) =>
                prev.map((v) =>
                    v.id === editingVariant.id
                        ? { ...values, id: editingVariant.id }
                        : v
                )
            );
            setModalVisible(false);
            setEditingVariant(null);
            form.resetFields();
            message.success("Variant updated successfully");
        }
    };

    const handleDeleteVariant = (id: string) => {
        setVariants((prev) => prev.filter((v) => v.id !== id));
        message.success("Variant deleted successfully");
    };

    const generateSKU = () => {
        const sku = `SKU-${Math.random()
            .toString(36)
            .substr(2, 9)
            .toUpperCase()}`;
        form.setFieldValue("sku", sku);
    };

    const openEditModal = (variant: Variant) => {
        setEditingVariant(variant);
        form.setFieldsValue(variant);
        setModalVisible(true);
    };

    const handleSubmit = async () => {
        if (variants.length === 0) {
            message.error("Please add at least one variant");
            return;
        }

        setLoading(true);
        try {
            // Validate variants
            const hasInvalidPrice = variants.some((v) => v.price <= 0);
            const hasInvalidStock = variants.some((v) => v.stock_quantity < 0);
            const hasDuplicateSKU =
                new Set(variants.map((v) => v.sku)).size !== variants.length;

            if (hasInvalidPrice) {
                toast.error("All prices must be greater than 0");
                return;
            }

            if (hasInvalidStock) {
                toast.error("Stock quantity cannot be negative");
                return;
            }

            if (hasDuplicateSKU) {
                toast.error("SKU must be unique for each variant");
                return;
            }

            console.log("📤 Sending variants data:", {
                productId: productData.productId,
                variants: variants.map((v) => ({
                    product_id: productData.productId,
                    sku: v.sku,
                    price: v.price,
                    color: v.color,
                    size: v.size,
                    stock_quantity: v.stock_quantity,
                })),
            });

            for (const variant of variants) {
                await createProductVariant({
                    product_id: productData.productId, // 🎯 Sử dụng productId
                    sku: variant.sku,
                    price: variant.price,
                    color: variant.color,
                    size: variant.size,
                    sold_quantity: 0,
                    stock_quantity: variant.stock_quantity
                        ? variant.stock_quantity
                        : 0,
                });
            }

            console.log(
                "✅ All variants created for product:",
                productData.productId
            );

            //   console.log('📦 Step 2 - Variants data before submit:', {
            //   variants: variants,
            //   variantsCount: variants.length,
            //   totalStock: variants.reduce((sum, v) => sum + v.stock_quantity, 0),
            //   priceRange: {
            //     min: Math.min(...variants.map(v => v.price)),
            //     max: Math.max(...variants.map(v => v.price))
            //   },
            //   skus: variants.map(v => v.sku)
            // });

            toast.success("Variants saved successfully!");

            onNext(variants);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: "SKU",
            dataIndex: "sku",
            key: "sku",
        },
        {
            title: "Color",
            dataIndex: "color",
            key: "color",
            render: (color: string) => <Tag color="blue">{color}</Tag>,
        },
        {
            title: "Size",
            dataIndex: "size",
            key: "size",
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            render: (price: number) => `$${price.toFixed(2)}`,
        },
        {
            title: "Stock",
            dataIndex: "stock_quantity",
            key: "stock_quantity",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record: Variant) => (
                <Space>
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => openEditModal(record)}
                    >
                        Edit
                    </Button>
                    <Button
                        type="link"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteVariant(record.id!)}
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            {/* Progress Steps */}
            <Card>
                <Steps current={1} size="small">
                    <Step title="Thông tin cơ bản" description="Chi tiết sản phẩm" />
                    <Step title="Biến thể" description="Các biến thể sản phẩm" />
                    <Step title="Hình ảnh" description="Hình ảnh sản phẩm" />
                    <Step title="Hoàn tất" description="Xem lại và chỉnh sửa" />
                </Steps>
            </Card>

            {/* Product Summary */}
            <Card title="📦 Product Summary" className="!shadow-sm">
                <Row gutter={[16, 8]}>
                    <Col xs={24} md={12}>
                        <div>
                            <strong>Tên:</strong> {productData.name}
                        </div>
                        <div>
                            <strong>Description:</strong>{" "}
                            {productData.description}
                        </div>
                    </Col>
                    <Col xs={24} md={12}>
                        <div>
                            <strong>Thương hiệu:</strong> {productData.brand_id}
                        </div>
                        <div>
                            <strong>Danh mục:</strong> {productData.category_id}
                        </div>
                    </Col>
                </Row>
            </Card>

            {/* Variants Management */}
            <Card
                title="🎨 Biến thể sản phẩm"
                className="!shadow-sm"
                extra={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setEditingVariant(null);
                            form.resetFields();
                            setModalVisible(true);
                        }}
                    >
                        Thêm biến thể
                    </Button>
                }
            >
                {variants.length > 0 ? (
                    <Table
                        columns={columns}
                        dataSource={variants}
                        rowKey="id"
                        pagination={false}
                    />
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        Chưa có biến thể nào được thêm. Nhấn "Thêm biến thể" để bắt đầu.
                    </div>
                )}

                <div className="mt-4 text-sm text-gray-500">
                    💡 Mẹo: Mỗi biến thể đại diện cho một sự kết hợp duy nhất của màu sắc và kích thước.
                </div>
            </Card>

            {/* Action Buttons */}
            <Card className="!shadow-sm">
                <div className="flex justify-between">
                    <Button
                        size="large"
                        onClick={onBack}
                        icon={<ArrowLeftOutlined />}
                    >
                        Quay lại
                    </Button>

                    <Button
                        type="primary"
                        size="large"
                        loading={loading}
                        onClick={handleSubmit}
                        disabled={variants.length === 0}
                        icon={<ArrowRightOutlined />}
                    >
                        Tiếp: Hình ảnh
                    </Button>
                </div>
            </Card>

            {/* Add/Edit Variant Modal */}
            <Modal
                title={editingVariant ? "Chỉnh sửa biến thể" : "Thêm biến thể"}
                open={modalVisible}
                onCancel={() => {
                    setModalVisible(false);
                    setEditingVariant(null);
                    form.resetFields();
                }}
                footer={null}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={
                        editingVariant ? handleEditVariant : handleAddVariant
                    }
                >
                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            {/* <Form.Item
                                label="SKU"
                                name="sku"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter SKU",
                                    },
                                    {
                                        min: 3,
                                        message:
                                            "SKU must be at least 3 characters",
                                    },
                                ]}
                            >
                                <Input placeholder="e.g., NIKE-AJ1-RED-42" />
                            </Form.Item> */}

                            <Form.Item
                                label="SKU (Đơn vị lưu kho)"
                                name="sku"
                                rules={[
                                    {
                                        required: true,
                                                                                 message: "Vui lòng nhập SKU",
                                    },
                                    {
                                        min: 3,
                                                                                 message:
                                                                                     "SKU phải có ít nhất 3 ký tự",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="e.g., NK-AM2024-BL"
                                    addonAfter={
                                        <Button
                                            type="link"
                                            onClick={generateSKU}
                                            style={{
                                              width: '50px'
                                            }}
                                        >
                                            Tự động tạo
                                        </Button>
                                    }
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Giá"
                                name="price"
                                rules={[
                                    {
                                        required: true,
                                                                                 message: "Vui lòng nhập giá",
                                    },
                                    {
                                        type: "number",
                                                                                 min: 0.01,
                                                                                 message: "Giá phải lớn hơn 0",
                                    },
                                ]}
                            >
                                <InputNumber
                                    style={{ width: "100%" }}
                                    placeholder="0.00"
                                    min={0.01}
                                    step={0.01}
                                    formatter={(value) =>
                                        `$ ${value}`.replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ","
                                        )
                                    }
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Màu sắc"
                                name="color"
                                rules={[
                                    {
                                        required: true,
                                                                                 message: "Vui lòng nhập màu sắc",
                                    },
                                ]}
                            >
                                <Input placeholder="e.g., Red, Black, White" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Kích thước"
                                name="size"
                                rules={[
                                    {
                                        required: true,
                                                                                 message: "Vui lòng nhập kích thước",
                                    },
                                ]}
                            >
                                <Input placeholder="e.g., S, M, L, 42, 10.5" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Số lượng tồn kho"
                        name="stock_quantity"
                        rules={[
                            {
                                required: true,
                                                                 message: "Vui lòng nhập số lượng tồn kho",
                            },
                            {
                                type: "number",
                                                                 min: 0,
                                                                 message: "Tồn kho không thể âm",
                            },
                        ]}
                    >
                        <InputNumber
                            style={{ width: "100%" }}
                            placeholder="0"
                            min={0}
                        />
                    </Form.Item>

                    <div className="flex justify-end gap-2">
                        <Button
                            onClick={() => {
                                setModalVisible(false);
                                setEditingVariant(null);
                                form.resetFields();
                            }}
                        >
                            Hủy
                        </Button>
                        <Button type="primary" htmlType="submit">
                            {editingVariant ? "Cập nhật" : "Thêm"} biến thể
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default Step2Variants;
