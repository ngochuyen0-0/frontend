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
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('vi-VN');
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
            'standard': 5,
            'express': 15,
            'overnight': 25
        };
        return shippingMethods[order.shipping_method] || 0;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div>Loading...</div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Alert
                    message="Order Not Found"
                    description="The order you are looking for does not exist."
                    type="error"
                    showIcon
                />
            </div>
        );
    }

    const subtotal = calculateSubtotal();
    const shippingCost = getShippingCost();
    const tax = subtotal * 0.08; // 8% tax
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
                        Back to Orders
                    </Button>

                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <Title level={2} className="mb-2">Order Details</Title>
                            <Space>
                                <Text strong>Order ID:</Text>
                                <Text code>{order.id}</Text>
                                <Tag color={getStatusColor(order.status)} className="text-sm">
                                    {order.status}
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
                                    Pay Now
                                </Button>
                            )}
                            {(order.status === 'Unpaid' || order.status === 'Processing') && (
                                <Button
                                    danger
                                    size="large"
                                    onClick={() => setCancelModalVisible(true)}
                                >
                                    Cancel Order
                                </Button>
                            )}
                            <Button
                                icon={<FileTextOutlined />}
                                size="large"
                            >
                                Invoice
                            </Button>
                        </Space>
                    </div>
                </div>

                <Row gutter={[24, 24]}>
                    {/* Left Column - Order Progress & Items */}
                    <Col xs={24} lg={16}>
                        {/* Order Progress */}
                        <Card title="Order Status" className="mb-6">
                            <Steps
                                current={getStatusStep(order.status)}
                                status={order.status === 'Cancelled' ? 'error' : 'process'}
                            >
                                <Step
                                    title="Processing"
                                    description="Preparing your order"
                                    icon={<ClockCircleOutlined />}
                                />
                                <Step
                                    title="Shipped"
                                    description="Order is on the way"
                                    icon={<TruckOutlined />}
                                />
                                <Step
                                    title="Delivered"
                                    description="Order has been delivered"
                                    icon={<CheckCircleOutlined />}
                                />
                            </Steps>

                            {order.status === 'Unpaid' && (
                                <Alert
                                    message="Payment Required"
                                    description="Please complete your payment to process the order."
                                    type="warning"
                                    showIcon
                                    className="mt-4"
                                />
                            )}
                        </Card>

                        {/* Order Items */}
                        <Card title="Order Items">
                            <List
                                dataSource={order.items}
                                renderItem={(item) => (
                                    <List.Item>
                                        <div className="flex w-full">
                                            <div className="flex-1 ml-4">
                                                <Text strong className="text-lg block mb-1">
                                                    {item.product_name}
                                                </Text>
                                                <Space size="small" className="mb-2">
                                                    {item.size && <Tag>Size: {item.size}</Tag>}
                                                    {item.color && <Tag color={item.color.toLowerCase()}>Color: {item.color}</Tag>}
                                                </Space>
                                                <div className="flex justify-between items-center">
                                                    <Text type="secondary">Quantity: {item.quantity}</Text>
                                                    <Text strong className="text-lg">
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
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <Text>Subtotal:</Text>
                                    <Text>{formatCurrency(subtotal)}</Text>
                                </div>
                                <div className="flex justify-between">
                                    <Text>Shipping:</Text>
                                    <Text>{formatCurrency(shippingCost)}</Text>
                                </div>
                                <div className="flex justify-between">
                                    <Text>Tax:</Text>
                                    <Text>{formatCurrency(tax)}</Text>
                                </div>
                                <Divider />
                                <div className="flex justify-between text-lg font-bold">
                                    <Text>Total:</Text>
                                    <Text type="danger">{formatCurrency(total)}</Text>
                                </div>
                            </div>
                        </Card>
                    </Col>

                    {/* Right Column - Order Information */}
                    <Col xs={24} lg={8}>
                        {/* Customer Information */}
                        <Card title="Customer Information" className="mb-6">
                            <Descriptions column={1} size="small">
                                <Descriptions.Item label={<><PhoneOutlined /> Phone</>}>
                                    {order.phone}
                                </Descriptions.Item>
                                <Descriptions.Item label={<><MailOutlined /> Email</>}>
                                    {order.email}
                                </Descriptions.Item>
                                <Descriptions.Item label={<><UserOutlined /> Full Name</>}>
                                    {order.fullname}
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>

                        {/* Shipping Address */}
                        <Card title="Shipping Address" className="mb-6">
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
                                        Shipping: {order.shipping_method.toUpperCase()}
                                    </Text>
                                </div>
                            </Space>
                        </Card>

                        {/* Payment Information */}
                        <Card title="Payment Information" className="mb-6">
                            <Space direction="vertical" className="w-full">
                                <div className="flex justify-between items-center">
                                    <Text strong>Method:</Text>
                                    <Tag icon={getPaymentMethodIcon(order.payment_method)}>
                                        {order.payment_method.toUpperCase()}
                                    </Tag>
                                </div>
                                <div className="flex justify-between">
                                    <Text strong>Status:</Text>
                                    <Badge
                                        status={order.status === 'Unpaid' ? 'error' : 'success'}
                                        text={order.status}
                                    />
                                </div>
                                <div className="flex justify-between">
                                    <Text strong>Order Date:</Text>
                                    <Text>{formatDate(order.created_at)}</Text>
                                </div>
                            </Space>
                        </Card>

                        {/* Order Timeline */}
                        <Card title="Order Timeline">
                            <Timeline>
                                <Timeline.Item
                                    color="green"
                                    dot={<CheckCircleOutlined />}
                                >
                                    <Text strong>Order Created</Text>
                                    <br />
                                    <Text type="secondary">{formatDate(order.created_at)}</Text>
                                </Timeline.Item>
                                {order.status !== 'Unpaid' && (
                                    <Timeline.Item
                                        color="blue"
                                        dot={<DollarOutlined />}
                                    >
                                        <Text strong>Payment Completed</Text>
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
                    title="Cancel Order"
                    open={cancelModalVisible}
                    onCancel={() => setCancelModalVisible(false)}
                    footer={[
                        <Button key="back" onClick={() => setCancelModalVisible(false)}>
                            Keep Order
                        </Button>,
                        <Button
                            key="submit"
                            type="primary"
                            danger
                            onClick={handleCancelOrder}
                            icon={<CloseCircleOutlined />}
                        >
                            Confirm Cancellation
                        </Button>,
                    ]}
                >
                    <Alert
                        message="Are you sure you want to cancel this order?"
                        description="This action cannot be undone. Once cancelled, the order will be permanently removed from your order history."
                        type="warning"
                        showIcon
                    />
                </Modal>
            </div>
        </div>
    );
};

export default OrderDetailPage;