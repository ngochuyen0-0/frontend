import React, { useState, useEffect } from 'react';
import {
    Card,
    Row,
    Col,
    Typography,
    Button,
    Steps,
    Tag,
    Divider,
    List,
    Space,
    Image,
    Descriptions,
    Alert,
    Timeline,
    Statistic,
    Badge,
    Modal
} from 'antd';
import {
    ArrowLeftOutlined,
    ShoppingOutlined,
    DollarOutlined,
    TruckOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    FileTextOutlined,
    PhoneOutlined,
    MailOutlined,
    EnvironmentOutlined,
    CreditCardOutlined,
    UserOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { getOrderById } from '../../services/orderService';
import { ProductVariantSingle } from '../../types/product';
import { getProductVariantById } from '../../services/productService';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

interface OrderItem {
    id: string;
    quantity: number;
    variant_id: string;
    price: number;
    product_name?: string;
    size?: string;
    color?: string;
    product_image?: string;
}

interface OrderData {
    id: string;
    fullname: string;
    email: string;
    status: string;
    province: string;
    zipcode: string;
    shipping_method: string;
    ward: string;
    specific_address: string;
    total_amount: number;
    phone: string;
    user_id: string | null;
    city: string;
    country: string;
    payment_method: string;
    created_at: string;
    items: OrderItem[];
}

const OrderDetailPage: React.FC = () => {
    const navigate = useNavigate();
    const { order_id } = useParams();
    const [order, setOrder] = useState<OrderData | null>(null);
    const [loading, setLoading] = useState(true);
    const [cancelModalVisible, setCancelModalVisible] = useState(false);

    useEffect(() => {
        const fecth = async () => {
            setLoading(true);
            try {
                const mockOrderData: OrderData = await getOrderById(order_id as string);
                if (mockOrderData.status.toLocaleLowerCase() === "paid") {
                    navigate(`/order-info/${mockOrderData.id}`)
                }
                const results = await Promise.all(mockOrderData.items.map(item => getProductVariantById(item.variant_id)));
                const itemsFecth = [] as OrderItem[];
                results.forEach((e: ProductVariantSingle) => {
                    const rawItem = mockOrderData.items.find(c => c.variant_id === e.id);
                    const orderItemFecth: OrderItem = {
                        id: rawItem?.id || "",
                        variant_id: e?.id || "",
                        product_name: e.product.name || "",
                        quantity: rawItem?.quantity || 0,
                        size: e?.size || "",
                        color: e?.color || "",
                        price: e?.price || 0,
                        product_image: e.product.images?.[0]?.image_url || "", // Lấy URL hình ảnh đầu tiên của sản phẩm
                    }
                    itemsFecth.push(orderItemFecth)
                })
                mockOrderData.items = itemsFecth;
                setOrder(mockOrderData)
            } catch {

            } finally {
                setLoading(false);
            }
        }
        fecth();
    }, [order_id])



    const getStatusColor = (status: string) => {
        const statusColors: { [key: string]: string } = {
           'Unpaid': 'red',
           'Paid': 'blue',
           'Processing': 'orange',
           'Shipped': 'purple',
           'Delivered': 'green',
           'Cancelled': 'gray',
           'Refunded': 'volcano'
        };
        return statusColors[status] || 'default';
    };

    const getStatusStep = (status: string) => {
        const statusSteps: { [key: string]: number } = {
           'Unpaid': 0,
           'Paid': 1,
           'Processing': 2,
           'Shipped': 3,
           'Delivered': 4
        };
        return statusSteps[status] || 0;
    };

    const getPaymentMethodIcon = (method: string) => {
        switch (method.toLowerCase()) {
            case 'cod':
                return <DollarOutlined />;
            case 'credit':
            case 'card':
                return <CreditCardOutlined />;
            case 'bank':
                return <FileTextOutlined />;
            case 'paypal':
                return <CreditCardOutlined />;
            default:
                return <CreditCardOutlined />;
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('vi-VN');
    };

    const translateStatus = (status: string) => {
        const statusTranslations: { [key: string]: string } = {
            'Unpaid': 'Chưa thanh toán',
            'Paid': 'Đã thanh toán',
            'Processing': 'Đang xử lý',
            'Shipped': 'Đã giao hàng',
            'Delivered': 'Đã nhận hàng',
            'Cancelled': 'Đã hủy',
            'Refunded': 'Đã hoàn tiền'
        };
        return statusTranslations[status] || status;
    };

    const handlePayNow = () => {
        if (order) {
            navigate(`/payment/${order.id}`);
        }
    };

    const handleCancelOrder = () => {
        // Handle cancel order logic
        setCancelModalVisible(false);
        // Call API to cancel order
    };

    const calculateSubtotal = () => {
        if (!order) return 0;
        return order.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getShippingCost = () => {
        if (!order) return 0;
        const shippingMethods: { [key: string]: number } = {
            'standard': 0,
            'express': 0,
            'overnight': 0
        };
        return shippingMethods[order.shipping_method] || 0;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div>Đang tải...</div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Alert
                    message="Không tìm thấy đơn hàng"
                    description="Đơn hàng bạn đang tìm kiếm không tồn tại."
                    type="error"
                    showIcon
                />
            </div>
        );
    }

    const subtotal = calculateSubtotal();
    const shippingCost = getShippingCost();
    const tax = 0; // Không tính thuế
    // Phí vận chuyển miễn phí cho tất cả các phương thức
    const total = subtotal + shippingCost + tax;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="mb-6">
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate('/orders')}
                        className="mb-4"
                    >
                        Quay lại đơn hàng
                    </Button>

                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <Title level={2} className="mb-2">Chi tiết đơn hàng</Title>
                            <Space>
                                <Text strong>Mã đơn hàng:</Text>
                                <Text code>{order.id}</Text>
                                <Tag color={getStatusColor(order.status)} className="text-sm">
                                    {translateStatus(order.status)}
                                </Tag>
                            </Space>
                        </div>

                        <Space>
                            {order.status === 'Unpaid' && (
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<DollarOutlined />}
                                    onClick={handlePayNow}
                                >
                                    Thanh toán ngay
                                </Button>
                            )}
                            {(order.status === 'Unpaid' || order.status === 'Processing') && (
                                <Button
                                    danger
                                    size="large"
                                    onClick={() => setCancelModalVisible(true)}
                                >
                                    Hủy đơn hàng
                                </Button>
                            )}
                            <Button
                                icon={<FileTextOutlined />}
                                size="large"
                            >
                                Hóa đơn
                            </Button>
                        </Space>
                    </div>
                </div>

                <Row gutter={[24, 24]}>
                    {/* Left Column - Order Progress & Items */}
                    <Col xs={24} lg={16}>
                        {/* Order Progress */}
                        <Card title="Trạng thái đơn hàng" className="mb-6 shadow-sm">
                            <Steps
                                current={getStatusStep(order.status)}
                                status={order.status === 'Cancelled' ? 'error' : 'process'}
                            >
                                <Step
                                    title="Đang xử lý"
                                    description="Chuẩn bị đơn hàng của bạn"
                                    icon={<ClockCircleOutlined />}
                                />
                                <Step
                                    title="Đã giao hàng"
                                    description="Đơn hàng đang trên đường vận chuyển"
                                    icon={<TruckOutlined />}
                                />
                                <Step
                                    title="Đã nhận hàng"
                                    description="Đơn hàng đã được giao thành công"
                                    icon={<CheckCircleOutlined />}
                                />
                            </Steps>

                            {order.status === 'Unpaid' && (
                                <Alert
                                    message="Yêu cầu thanh toán"
                                    description="Vui lòng hoàn tất thanh toán để xử lý đơn hàng."
                                    type="warning"
                                    showIcon
                                    className="mt-4"
                                />
                            )}
                        </Card>

                        {/* Order Items */}
                        <Card title="Sản phẩm trong đơn hàng" className="shadow-sm">
                            <List
                                dataSource={order.items}
                                renderItem={(item) => (
                                    <List.Item className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                                        <div className="flex items-start gap-4 w-full">
                                            {item.product_image ? (
                                                <div className="flex-shrink-0">
                                                    <Image
                                                        src={item.product_image}
                                                        alt={item.product_name}
                                                        width={100}
                                                        height={100}
                                                        className="rounded object-cover border border-gray-200 shadow-sm"
                                                        fallback="/src/assets/react.svg"
                                                        preview={false}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-24 h-24 rounded bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-gray-400 text-xs text-center">Chưa có ảnh</span>
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <Text strong className="text-base block mb-1 truncate">
                                                    {item.product_name}
                                                </Text>
                                                <div className="flex flex-wrap gap-2 mb-2">
                                                    {item.size && <Tag className="text-xs px-2 py-0.5">Kích thước: {item.size}</Tag>}
                                                    {item.color && <Tag color={['pink','red','yellow','orange','cyan','green','blue','purple','geekblue','magenta','volcano','gold','lime'].includes(item.color.toLowerCase()) ? item.color.toLowerCase() : 'default'} className="text-xs px-2 py-0.5">Màu sắc: {item.color}</Tag>}
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <Text type="secondary" className="text-sm">Số lượng: {item.quantity}</Text>
                                                    <Text strong className="text-lg text-red-500">
                                                        {formatCurrency(item.price * item.quantity)}
                                                    </Text>
                                                </div>
                                            </div>
                                        </div>
                                    </List.Item>
                                )}
                            />

                            <Divider />

                            {/* Order Summary */}
                            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                                <div className="flex justify-between py-2">
                                    <Text>Tạm tính:</Text>
                                    <Text>{formatCurrency(subtotal)}</Text>
                                </div>
                                <div className="flex justify-between py-2">
                                    <Text>Phí vận chuyển:</Text>
                                    <Text className="text-green-500 font-medium">{shippingCost > 0 ? formatCurrency(shippingCost) : 'Miễn phí'}</Text>
                                </div>
                                <Divider className="my-1" />
                                <div className="flex justify-between text-lg font-bold pt-2">
                                    <Text>Tổng thanh toán:</Text>
                                    <Text type="danger" className="text-xl">{formatCurrency(total)}</Text>
                                </div>
                            </div>
                        </Card>
                    </Col>

                    {/* Right Column - Order Information */}
                    <Col xs={24} lg={8}>
                        {/* Customer Information */}
                        <Card title="Thông tin khách hàng" className="mb-6 shadow-sm">
                            <Descriptions column={1} size="small" className="py-2">
                                <Descriptions.Item label={<><PhoneOutlined /> Điện thoại</>}>
                                    {order.phone}
                                </Descriptions.Item>
                                <Descriptions.Item label={<><MailOutlined /> Email</>}>
                                    {order.email}
                                </Descriptions.Item>
                                <Descriptions.Item label={<><UserOutlined /> Họ tên</>}>
                                    {order.fullname}
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>

                        {/* Shipping Address */}
                        <Card title="Địa chỉ giao hàng" className="mb-6 shadow-sm">
                            <Space direction="vertical">
                                <Text strong>{order.fullname}</Text>
                                <Text>{order.specific_address}</Text>
                                <Text>
                                    {order.ward}, {order.city}, {order.province}
                                </Text>
                                <Text>{order.country} - {order.zipcode}</Text>
                                <div className="flex items-center gap-2 mt-2">
                                    <EnvironmentOutlined className="text-gray-400" />
                                    <Text type="secondary">
                                        Vận chuyển: {order.shipping_method.toUpperCase()} - Miễn phí
                                    </Text>
                                </div>
                            </Space>
                        </Card>

                        {/* Payment Information */}
                        <Card title="Thông tin thanh toán" className="mb-6 shadow-sm">
                            <Space direction="vertical" className="w-full">
                                <div className="flex justify-between items-center">
                                    <Text strong>Phương thức:</Text>
                                    <Tag icon={getPaymentMethodIcon(order.payment_method)}>
                                        {order.payment_method.toUpperCase()}
                                    </Tag>
                                </div>
                                <div className="flex justify-between">
                                    <Text strong>Trạng thái:</Text>
                                    <Badge
                                        status={order.status === 'Unpaid' ? 'error' : 'success'}
                                        text={translateStatus(order.status)}
                                    />
                                </div>
                                <div className="flex justify-between">
                                    <Text strong>Ngày đặt hàng:</Text>
                                    <Text>{formatDate(order.created_at)}</Text>
                                </div>
                            </Space>
                        </Card>

                        {/* Order Timeline */}
                        <Card title="Lịch sử đơn hàng" className="shadow-sm">
                            <Timeline>
                                <Timeline.Item
                                    color="green"
                                    dot={<CheckCircleOutlined />}
                                >
                                    <Text strong>Đơn hàng đã tạo</Text>
                                    <br />
                                    <Text type="secondary">{formatDate(order.created_at)}</Text>
                                </Timeline.Item>
                                {order.status !== 'Unpaid' && (
                                    <Timeline.Item
                                        color="blue"
                                        dot={<DollarOutlined />}
                                    >
                                        <Text strong>Thanh toán hoàn tất</Text>
                                        <br />
                                        <Text type="secondary">{formatDate(order.created_at)}</Text>
                                    </Timeline.Item>
                                )}
                                {/* Add more timeline items based on order status */}
                            </Timeline>
                        </Card>
                    </Col>
                </Row>

                {/* Cancel Order Modal */}
                <Modal
                    title="Hủy đơn hàng"
                    open={cancelModalVisible}
                    onCancel={() => setCancelModalVisible(false)}
                    footer={[
                        <Button key="back" onClick={() => setCancelModalVisible(false)}>
                            Giữ đơn hàng
                        </Button>,
                        <Button
                            key="submit"
                            type="primary"
                            danger
                            onClick={handleCancelOrder}
                            icon={<CloseCircleOutlined />}
                        >
                            Xác nhận hủy
                        </Button>,
                    ]}
                >
                    <Alert
                        message="Bạn có chắc chắn muốn hủy đơn hàng này không?"
                        description="Thao tác này không thể hoàn tác. Sau khi hủy, đơn hàng sẽ bị xóa vĩnh viễn khỏi lịch sử đơn hàng của bạn."
                        type="warning"
                        showIcon
                    />
                </Modal>
            </div>
        </div>
    );
};

export default OrderDetailPage;