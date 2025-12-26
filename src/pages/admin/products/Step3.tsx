import React, { useState } from "react";
import {
    Card,
    Button,
    Input,
    Row,
    Col,
    Tag,
    message,
    Modal,
    Image,
    Form,
    Space,
    Steps,
} from "antd";
import {
    EyeOutlined,
    DeleteOutlined,
    ArrowLeftOutlined,
    ArrowRightOutlined,
    PlusOutlined,
    LinkOutlined,
} from "@ant-design/icons";
import { toast } from "sonner";
import { useProductStore } from "../../../store/useProductStore";
import { useNavigate } from "react-router-dom";

const { Step } = Steps;
const { TextArea } = Input;

interface ProductImage {
    url: string;
    is_thumbnail: boolean;
    name?: string;
}

interface Step3Props {
    onNext: (images: ProductImage[]) => void;
    onBack: () => void;
    productData: any;
    variants: any[];
    initialImages?: ProductImage[];
}

const Step3Images: React.FC<Step3Props> = ({
    onNext,
    onBack,
    productData,
    variants,
    initialImages = [],
}) => {
    const [images, setImages] = useState<ProductImage[]>(initialImages);
    const [previewImage, setPreviewImage] = useState<string>("");
    const [previewVisible, setPreviewVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [addImageModalVisible, setAddImageModalVisible] = useState(false);
    const [form] = Form.useForm();
    const nav = useNavigate();
    const { createProductImage } = useProductStore();

    const handleAddImage = (values: { imageUrls: string }) => {
        const urls = values.imageUrls
            .split("\n")
            .map((url) => url.trim())
            .filter((url) => url.length > 0 && isValidUrl(url));

        if (urls.length === 0) {
            toast.error("Vui lòng nhập ít nhất một URL ảnh hợp lệ");
            return;
        }

        const newImages: ProductImage[] = urls.map((url) => ({
            url: url,
            is_thumbnail: images.length === 0 && urls.indexOf(url) === 0, // First image of first batch is thumbnail
            name: getImageNameFromUrl(url),
        }));

        setImages((prev) => [...prev, ...newImages]);
        setAddImageModalVisible(false);
        form.resetFields();
        message.success(`Đã thêm ${urls.length} ảnh thành công`);
    };

    // const isValidUrl = (url: string): boolean => {
    //   try {
    //     new URL(url);
    //     return /\.(jpg|jpeg|png|webp|gif|bmp|svg)$/i.test(url);
    //   } catch {
    //     return false;
    //   }
    // };

    const isValidUrl = (url: string): boolean => {
        try {
            new URL(url);

            // 🎯 Cho phép tất cả URL hợp lệ, backend sẽ xử lý
            return true;

            // Hoặc check nghiêm ngặt hơn nhưng linh hoạt:
            const invalidPatterns = [
                /\.(pdf|doc|docx|xls|xlsx|zip|rar|exe)$/i, // Loại trừ file không phải ảnh
            ];

            return !invalidPatterns.some((pattern) => pattern.test(url));
        } catch {
            return false;
        }
    };

    const getImageNameFromUrl = (url: string): string => {
        try {
            const urlObj = new URL(url);
            return urlObj.pathname.split("/").pop() || "image";
        } catch {
            return "image";
        }
    };

    const handleRemove = (image: ProductImage) => {
        setImages((prev) => prev.filter((img) => img.url !== image.url));

        // If removing thumbnail, set first image as new thumbnail
        if (image.is_thumbnail && images.length > 1) {
            const remainingImages = images.filter(
                (img) => img.url !== image.url
            );
            if (remainingImages.length > 0) {
                setImages((prev) =>
                    prev.map((img, index) => ({
                        ...img,
                        is_thumbnail: index === 0,
                    }))
                );
            }
        }
        message.success("Đã xóa ảnh");
    };

    const setAsThumbnail = (imageUrl: string) => {
        setImages((prev) =>
            prev.map((img) => ({
                ...img,
                is_thumbnail: img.url === imageUrl,
            }))
        );
        message.success("Đã đặt làm ảnh đại diện");
    };

    const handleSubmit = async () => {
        if (images.length === 0) {
            toast.error("Vui lòng thêm ít nhất một ảnh");
            return;
        }

        const thumbnailCount = images.filter((img) => img.is_thumbnail).length;
        if (thumbnailCount !== 1) {
            toast.error("Vui lòng chọn exactly một ảnh đại diện");
            return;
        }

        const formattedImages = images.map((img) => ({
            image_url: img.url, // 🎯 Đổi từ "url" thành "image_url"
            is_thumbnail: img.is_thumbnail,
        }));

        for (const img of images) {
            await createProductImage({
                product_id: productData.productId,
                image_url: img.url,
                is_thumbnail: img.is_thumbnail,
            })
        }

        // 🎯 LOG ĐỂ KIỂM TRA
        console.log("📸 Formatted images data:", {
            total: formattedImages.length,
            thumbnail: formattedImages.find((img) => img.is_thumbnail),
            all_images: formattedImages,
        });
        setLoading(true);
        try {
            nav("/admin/v1/products")

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Progress Steps */}
            <Card>
                <Steps current={2} size="small">
                    <Step title="Basic Info" description="Product details" />
                    <Step title="Variants" description="Product variants" />
                    <Step title="Images" description="Product images" />
                    <Step title="Done" description="Review & edit" />
                </Steps>
            </Card>

            {/* Add Image Section */}
            <Card title="🖼️ Thêm Ảnh Sản Phẩm" className="!shadow-sm">
                <div className="mb-6">
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        size="large"
                        onClick={() => setAddImageModalVisible(true)}
                    >
                        Thêm Ảnh Bằng URL
                    </Button>
                    <div className="text-sm text-gray-500 mt-2">
                        Hỗ trợ JPG, PNG, WEBP, GIF. Mỗi dòng một URL
                    </div>
                </div>

                {/* Image Gallery */}
                {images.length > 0 && (
                    <div className="mt-6">
                        <div className="text-sm font-medium mb-3">
                            Ảnh đã thêm ({images.length})
                        </div>
                        <Row gutter={[16, 16]}>
                            {images.map((image, index) => (
                                <Col xs={12} md={8} lg={6} key={image.url}>
                                    <Card
                                        size="small"
                                        className="relative"
                                        cover={
                                            <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
                                                <Image
                                                    src={image.url}
                                                    alt={`Product image ${index + 1
                                                        }`}
                                                    preview={{ visible: false }}
                                                    onClick={() => {
                                                        setPreviewImage(
                                                            image.url
                                                        );
                                                        setPreviewVisible(true);
                                                    }}
                                                    className="cursor-pointer object-contain max-h-32"
                                                    fallback="https://via.placeholder.com/150?text=Error+Loading"
                                                />
                                                {image.is_thumbnail && (
                                                    <div className="absolute top-2 left-2">
                                                        <Tag
                                                            color="blue"
                                                        >
                                                            Ảnh đại diện
                                                        </Tag>
                                                    </div>
                                                )}
                                            </div>
                                        }
                                        actions={[
                                            <EyeOutlined
                                                key="view"
                                                onClick={() => {
                                                    setPreviewImage(image.url);
                                                    setPreviewVisible(true);
                                                }}
                                                className="hover:text-blue-500"
                                            />,
                                            <Button
                                                type="link"
                                                size="small"
                                                key="thumbnail"
                                                onClick={() =>
                                                    setAsThumbnail(image.url)
                                                }
                                                className={
                                                    image.is_thumbnail
                                                        ? "text-green-500"
                                                        : ""
                                                }
                                            >
                                                {image.is_thumbnail
                                                    ? "✓ Đại diện"
                                                    : "Đặt đại diện"}
                                            </Button>,
                                            <DeleteOutlined
                                                key="delete"
                                                onClick={() =>
                                                    handleRemove(image)
                                                }
                                                className="hover:text-red-500"
                                            />,
                                        ]}
                                    >
                                        <Card.Meta
                                            description={
                                                <div className="text-center">
                                                    <div
                                                        className="text-xs text-gray-500 truncate"
                                                        title={image.name}
                                                    >
                                                        {image.name ||
                                                            `Ảnh ${index + 1}`}
                                                    </div>
                                                    <div
                                                        className="text-xs text-gray-400 truncate"
                                                        title={image.url}
                                                    >
                                                        {image.url.length > 30
                                                            ? `${image.url.substring(
                                                                0,
                                                                30
                                                            )}...`
                                                            : image.url}
                                                    </div>
                                                </div>
                                            }
                                        />
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                )}

                {images.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <LinkOutlined className="text-4xl mb-4 block" />
                        <p>Chưa có ảnh nào được thêm</p>
                        <p className="text-sm">
                            Nhấn "Thêm Ảnh Bằng URL" để bắt đầu
                        </p>
                    </div>
                )}

                {/* Image Preview Modal */}
                <Modal
                    open={previewVisible}
                    footer={null}
                    onCancel={() => setPreviewVisible(false)}
                    width="80vw"
                    style={{ top: 20 }}
                    styles={{ body: { padding: 0, textAlign: "center" } }}
                >
                    <img
                        alt="Preview"
                        style={{
                            maxWidth: "100%",
                            maxHeight: "80vh",
                            objectFit: "contain",
                        }}
                        src={previewImage}
                    />
                </Modal>

                {/* Add Image Modal */}
                <Modal
                    title="Thêm Ảnh Bằng URL"
                    open={addImageModalVisible}
                    onCancel={() => {
                        setAddImageModalVisible(false);
                        form.resetFields();
                    }}
                    footer={null}
                    width={600}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleAddImage}
                    >
                        <Form.Item
                            label="URL Ảnh"
                            name="imageUrls"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập URL ảnh",
                                },
                                {
                                    validator: (_, value) => {
                                        if (!value) return Promise.resolve();
                                        const urls = value
                                            .split("\n")
                                            .map((url) => url.trim())
                                            .filter((url) => url);
                                        const invalidUrls = urls.filter(
                                            (url) => !isValidUrl(url)
                                        );
                                        if (invalidUrls.length > 0) {
                                            return Promise.reject(
                                                new Error(
                                                    `Các URL không hợp lệ: ${invalidUrls.join(
                                                        ", "
                                                    )}`
                                                )
                                            );
                                        }
                                        return Promise.resolve();
                                    },
                                },
                            ]}
                            extra="Mỗi dòng một URL. Hỗ trợ: JPG, PNG, WEBP, GIF"
                        >
                            <TextArea
                                rows={6}
                                placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.png&#10;https://example.com/image3.webp"
                                style={{ resize: "none" }}
                            />
                        </Form.Item>

                        <div className="flex justify-end gap-2">
                            <Button
                                onClick={() => setAddImageModalVisible(false)}
                            >
                                Hủy
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Thêm Ảnh
                            </Button>
                        </div>
                    </Form>

                    {/* Example URLs */}
                    <div className="mt-4 p-3 bg-blue-50 rounded">
                        <div className="text-sm font-medium mb-2">
                            📝 Ví dụ URL hợp lệ:
                        </div>
                        <div className="text-xs text-gray-600 space-y-1">
                            <div>• https://example.com/products/shoe-1.jpg</div>
                            <div>
                                • https://cdn.example.com/images/product.png
                            </div>
                            <div>
                                •
                                https://storage.googleapis.com/bucket/image.webp
                            </div>
                        </div>
                    </div>
                </Modal>
            </Card>

            {/* Variants Summary */}
            {variants.length > 0 && (
                <Card title="📋 Tổng quan biến thể" className="!shadow-sm">
                    <div className="text-sm mb-2">
                        Tổng số biến thể: <strong>{variants.length}</strong>
                    </div>
                    <Row gutter={[8, 8]}>
                        {variants.slice(0, 6).map((variant, index) => (
                            <Col key={variant.id}>
                                <Tag>
                                    {variant.color} / {variant.size}
                                </Tag>
                            </Col>
                        ))}
                        {variants.length > 6 && (
                            <Col>
                                <Tag>+{variants.length - 6} biến thể khác</Tag>
                            </Col>
                        )}
                    </Row>
                </Card>
            )}

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
                        disabled={images.length === 0}
                        icon={<ArrowRightOutlined />}
                    >
                        Xong
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default Step3Images;
