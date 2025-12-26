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
    Modal,
    Form,
    Select,
    Input,
    message,
    Popconfirm,
    Table,
    Tooltip
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
    UserOutlined,
    EditOutlined,
    SaveOutlined,
    StopOutlined,
    SyncOutlined,
    EyeOutlined,
    PrinterOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { getOrderById } from '../../services/orderService';
import { ProductVariantSingle } from '../../types/product';
import { getProductVariantById } from '../../services/productService';
import { Order, OrderItem } from '../../types/order';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;
const { Option } = Select;
const { TextArea } = Input;



const AdminOrderDetailPage: React.FC = () => {
    const navigate = useNavigate();
    const { order_id } = useParams<{ order_id: string }>();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm] = Form.useForm();

    // Status update modal
    const [statusModalVisible, setStatusModalVisible] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [statusNotes, setStatusNotes] = useState('');

    // Tracking modal
    const [trackingModalVisible, setTrackingModalVisible] = useState(false);
    const [trackingNumber, setTrackingNumber] = useState('');

    useEffect(() => {
        fetchOrderDetail();
    }, [order_id]);

    const fetchOrderDetail = async () => {
        setLoading(true);
        try {
            getOrderById(order_id || "").then(res => {
                Promise.all(res.items.map(item => getProductVariantById(item.variant_id))).then(results => {
                    const itemsFecth = [] as OrderItem[];
                    results.forEach((e: ProductVariantSingle) => {
                        const rawItem = res.items.find(c => c.variant_id === e.id);
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
                    res.items = itemsFecth;

                    setOrder(res);
                    editForm.setFieldsValue(res);
                })
            }).catch(err => { })
        } catch (error) {
            console.error('Error fetching order detail:', error);
            message.error('Không thể tải thông tin đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        const statusColors: { [key: string]: string } = {
            'pending': 'orange',
            'confirmed': 'blue',
            'processing': 'cyan',
            'shipped': 'purple',
            'delivered': 'green',
            'cancelled': 'red',
            'refunded': 'volcano',
            'unpaid': 'red'
        };
        return statusColors[status] || 'default';
    };

    const getStatusStep = (status: string) => {
        const statusSteps: { [key: string]: number } = {
            'pending': 0,
            'confirmed': 1,
            'processing': 2,
            'shipped': 3,
            'delivered': 4
        };
        return statusSteps[status] || 0;
    };

    const getStatusOptions = () => {
        const allStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
        return allStatuses.filter(status => status !== order?.status);
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

    const handleStatusUpdate = async () => {
        if (!order || !selectedStatus) return;

        setUpdating(true);
        try {
            // Call API to update status
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

            const updatedOrder = {
                ...order,
                status: selectedStatus,
                notes: statusNotes ? `${order.notes || ''}\n[${new Date().toLocaleString()}] ${statusNotes}` : order.notes
            };

            setOrder(updatedOrder);
            setStatusModalVisible(false);
            setSelectedStatus('');
            setStatusNotes('');

            message.success('Cập nhật trạng thái thành công');
        } catch (error) {
            message.error('Cập nhật trạng thái thất bại');
        } finally {
            setUpdating(false);
        }
    };

    const handleTrackingUpdate = async () => {
        if (!order || !trackingNumber) return;

        setUpdating(true);
        try {
            // Call API to update tracking
            await new Promise(resolve => setTimeout(resolve, 1000));

            const updatedOrder = {
                ...order,
                tracking_number: trackingNumber,
                status: 'shipped'
            };

            setOrder(updatedOrder);
            setTrackingModalVisible(false);
            setTrackingNumber('');

            message.success('Cập nhật mã theo dõi thành công');
        } catch (error) {
            message.error('Cập nhật mã theo dõi thất bại');
        } finally {
            setUpdating(false);
        }
    };

    const handleSaveEdit = async (values: any) => {
        if (!order) return;

        setUpdating(true);
        try {
            // Call API to update order info
            await new Promise(resolve => setTimeout(resolve, 1000));

            const updatedOrder = { ...order, ...values };
            setOrder(updatedOrder);
            setIsEditing(false);

            message.success('Cập nhật thông tin thành công');
        } catch (error) {
            message.error('Cập nhật thông tin thất bại');
        } finally {
            setUpdating(false);
        }
    };

    const handleCancelOrder = async () => {
        if (!order) return;

        setUpdating(true);
        try {
            // Call API to cancel order
            await new Promise(resolve => setTimeout(resolve, 1000));

            const updatedOrder = { ...order, status: 'cancelled' };
            setOrder(updatedOrder);

            message.success('Đã hủy đơn hàng');
        } catch (error) {
            message.error('Hủy đơn hàng thất bại');
        } finally {
            setUpdating(false);
        }
    };

    const orderItemsColumns = [
        {
            title: 'Sản phẩm',
            dataIndex: 'product_name',
            key: 'product_name',
            render: (text: string, record: OrderItem) => (
                <div className="flex items-center gap-3">
                    <div>
                        <Text strong>{text}</Text>
                        <div className="flex gap-2 mt-1">
                            {record.sku && <Text type="secondary" className="text-xs">SKU: {record.sku}</Text>}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Biến thể',
            key: 'variant',
            render: (record: OrderItem) => (
                <Space>
                    {record.size && <Tag>Size: {record.size}</Tag>}
                    {record.color && <Tag color={record.color.toLowerCase()}>Color: {record.color}</Tag>}
                </Space>
            ),
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            align: 'center' as const,
        },
        {
            title: 'Đơn giá',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => formatCurrency(price),
            align: 'right' as const,
        },
        {
            title: 'Thành tiền',
            key: 'total',
            render: (record: OrderItem) => formatCurrency(record.price * record.quantity),
            align: 'right' as const,
        },
    ];

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

    const subtotal = order.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shippingCost = order.shipping_method === 'standard' ? 5 :
        order.shipping_method === 'express' ? 15 : 25;
    const tax = subtotal * 0.08;
    const total = subtotal + shippingCost + tax;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="mb-6">
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate('/admin/v1/orders')}
                        className="mb-4"
                    >
                        Back to Orders
                    </Button>

                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <Title level={2} className="mb-2">Order Details - Admin</Title>
                            <Space wrap>
                                <Text strong>Order ID:</Text>
                                <Text code>{order.id}</Text>
                                <Badge
                                    status="processing"
                                    text={
                                        <Tag color={getStatusColor(order.status)} className="text-sm">
                                            {order.status.toUpperCase()}
                                        </Tag>
                                    }
                                />
                                <Text type="secondary">
                                    Created: {formatDate(order.created_at)}
                                </Text>
                            </Space>
                        </div>

                        <Space wrap>
                            <Button
                                icon={<PrinterOutlined />}
                                size="large"
                            >
                                Print Invoice
                            </Button>
                            <Button
                                icon={<EditOutlined />}
                                size="large"
                                onClick={() => setIsEditing(!isEditing)}
                            >
                                {isEditing ? 'Cancel Edit' : 'Edit Order'}
                            </Button>
                            <Button
                                type="primary"
                                size="large"
                                onClick={() => setStatusModalVisible(true)}
                                icon={<SyncOutlined />}
                            >
                                Update Status
                            </Button>
                            {order.status !== 'cancelled' && order.status !== 'refunded' && (
                                <Popconfirm
                                    title="Cancel Order"
                                    description="Are you sure you want to cancel this order?"
                                    onConfirm={handleCancelOrder}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button
                                        danger
                                        size="large"
                                        icon={<CloseCircleOutlined />}
                                    >
                                        Cancel Order
                                    </Button>
                                </Popconfirm>
                            )}
                        </Space>
                    </div>
                </div>

                <Row gutter={[24, 24]}>
                    {/* Left Column - Order Information */}
                    <Col xs={24} lg={16}>
                        {/* Order Progress */}
                        <Card
                            title="Order Progress"
                            className="mb-6"
                            extra={
                                <Button
                                    type="link"
                                    icon={<EyeOutlined />}
                                    onClick={() => navigate(`/order/${order.id}`)}
                                >
                                    Customer View
                                </Button>
                            }
                        >
                            <Steps
                                current={getStatusStep(order.status)}
                                status={order.status === 'cancelled' ? 'error' : 'process'}
                            >
                                <Step
                                    title="Pending"
                                    description="Order has been placed"
                                />
                                <Step
                                    title="Confirmed"
                                    description="Order confirmed"
                                />
                                <Step
                                    title="Processing"
                                    description="Preparing your order"
                                />
                                <Step
                                    title="Shipped"
                                    description="Order is on the way"
                                />
                                <Step
                                    title="Delivered"
                                    description="Order has been delivered"
                                />
                            </Steps>

                            {order.tracking_number && (
                                <Alert
                                    message={
                                        <Space>
                                            <Text strong>Tracking Number:</Text>
                                            <Text code>{order.tracking_number}</Text>
                                            <Button
                                                type="link"
                                                size="small"
                                                onClick={() => setTrackingModalVisible(true)}
                                            >
                                                Update
                                            </Button>
                                        </Space>
                                    }
                                    type="info"
                                    showIcon
                                    className="mt-4"
                                />
                            )}

                            {!order.tracking_number && order.status === 'processing' && (
                                <Alert
                                    message="Ready to Ship"
                                    description="Add tracking number when order is shipped"
                                    type="warning"
                                    showIcon
                                    className="mt-4"
                                    action={
                                        <Button
                                            size="small"
                                            type="primary"
                                            onClick={() => setTrackingModalVisible(true)}
                                        >
                                            Add Tracking
                                        </Button>
                                    }
                                />
                            )}
                        </Card>

                        {/* Order Items */}
                        <Card title="Order Items">
                            <Table
                                columns={orderItemsColumns}
                                dataSource={order.items.map(item => ({ ...item, key: item.id }))}
                                pagination={false}
                                summary={() => (
                                    <Table.Summary>
                                        <Table.Summary.Row>
                                            <Table.Summary.Cell index={0} colSpan={3}></Table.Summary.Cell>
                                            <Table.Summary.Cell index={1}>
                                                <Text strong>Subtotal</Text>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={2}>
                                                <Text strong>{formatCurrency(subtotal)}</Text>
                                            </Table.Summary.Cell>
                                        </Table.Summary.Row>
                                        <Table.Summary.Row>
                                            <Table.Summary.Cell index={0} colSpan={3}></Table.Summary.Cell>
                                            <Table.Summary.Cell index={1}>
                                                <Text>Shipping</Text>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={2}>
                                                <Text>{formatCurrency(shippingCost)}</Text>
                                            </Table.Summary.Cell>
                                        </Table.Summary.Row>
                                        <Table.Summary.Row>
                                            <Table.Summary.Cell index={0} colSpan={3}></Table.Summary.Cell>
                                            <Table.Summary.Cell index={1}>
                                                <Text>Tax</Text>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={2}>
                                                <Text>{formatCurrency(tax)}</Text>
                                            </Table.Summary.Cell>
                                        </Table.Summary.Row>
                                        <Table.Summary.Row>
                                            <Table.Summary.Cell index={0} colSpan={3}></Table.Summary.Cell>
                                            <Table.Summary.Cell index={1}>
                                                <Text strong>Total</Text>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={2}>
                                                <Text strong type="danger">{formatCurrency(total)}</Text>
                                            </Table.Summary.Cell>
                                        </Table.Summary.Row>
                                    </Table.Summary>
                                )}
                            />
                        </Card>
                    </Col>

                    {/* Right Column - Order Details & Actions */}
                    <Col xs={24} lg={8}>
                        {/* Customer Information */}
                        <Card
                            title="Customer Information"
                            className="mb-6"
                            extra={
                                isEditing ? (
                                    <Button
                                        type="primary"
                                        size="small"
                                        icon={<SaveOutlined />}
                                        onClick={() => editForm.submit()}
                                        loading={updating}
                                    >
                                        Save
                                    </Button>
                                ) : null
                            }
                        >
                            <Form
                                form={editForm}
                                layout="vertical"
                                onFinish={handleSaveEdit}
                                disabled={!isEditing}
                            >
                                <Form.Item name="fullname" label="Full Name">
                                    <Input prefix={<UserOutlined />} />
                                </Form.Item>
                                <Form.Item name="email" label="Email">
                                    <Input prefix={<MailOutlined />} />
                                </Form.Item>
                                <Form.Item name="phone" label="Phone">
                                    <Input prefix={<PhoneOutlined />} />
                                </Form.Item>
                            </Form>
                        </Card>

                        {/* Shipping & Payment Information */}
                        <Card title="Shipping & Payment" className="mb-6">
                            <Space direction="vertical" className="w-full" size="middle">
                                <div>
                                    <Text strong>Shipping Address</Text>
                                    <Paragraph className="mt-1">
                                        {order.specific_address}<br />
                                        {order.ward}, {order.city}, {order.province}<br />
                                        {order.country} - {order.zipcode}
                                    </Paragraph>
                                </div>

                                <Divider />

                                <div className="flex justify-between">
                                    <Text strong>Shipping Method:</Text>
                                    <Tag>{order.shipping_method.toUpperCase()}</Tag>
                                </div>

                                <div className="flex justify-between">
                                    <Text strong>Payment Method:</Text>
                                    <Tag icon={<CreditCardOutlined />}>
                                        {order.payment_method.toUpperCase()}
                                    </Tag>
                                </div>

                                <div className="flex justify-between">
                                    <Text strong>Payment Status:</Text>
                                    <Badge
                                        status={order.payment_method === 'COD' ? 'warning' : 'success'}
                                        text={order.payment_method === 'COD' ? 'Pending' : 'Paid'}
                                    />
                                </div>
                            </Space>
                        </Card>

                        {/* Order Notes */}
                        <Card title="Order Notes">
                            <TextArea
                                placeholder="Add internal notes..."
                                rows={4}
                                value={order.notes}
                                onChange={(e) => setOrder(prev => prev ? { ...prev, notes: e.target.value } : null)}
                            />
                            <Button type="dashed" block className="mt-2">
                                Add Note
                            </Button>
                        </Card>

                        {/* Quick Actions */}
                        <Card title="Quick Actions" className="mt-6">
                            <Space direction="vertical" className="w-full">
                                <Button
                                    icon={<FileTextOutlined />}
                                    block
                                    onClick={() => window.print()}
                                >
                                    Print Invoice
                                </Button>
                                <Button
                                    icon={<TruckOutlined />}
                                    block
                                    onClick={() => setTrackingModalVisible(true)}
                                    disabled={!order.tracking_number}
                                >
                                    Update Tracking
                                </Button>
                                <Button
                                    icon={<MailOutlined />}
                                    block
                                >
                                    Email Customer
                                </Button>
                            </Space>
                        </Card>
                    </Col>
                </Row>

                {/* Update Status Modal */}
                <Modal
                    title="Update Order Status"
                    open={statusModalVisible}
                    onCancel={() => setStatusModalVisible(false)}
                    footer={[
                        <Button key="cancel" onClick={() => setStatusModalVisible(false)}>
                            Cancel
                        </Button>,
                        <Button
                            key="submit"
                            type="primary"
                            loading={updating}
                            onClick={handleStatusUpdate}
                            disabled={!selectedStatus}
                        >
                            Update Status
                        </Button>,
                    ]}
                >
                    <Space direction="vertical" className="w-full" size="middle">
                        <div>
                            <Text strong>Current Status:</Text>
                            <Tag color={getStatusColor(order.status)} className="ml-2">
                                {order.status.toUpperCase()}
                            </Tag>
                        </div>

                        <Select
                            placeholder="Select new status"
                            value={selectedStatus}
                            onChange={setSelectedStatus}
                            className="w-full"
                        >
                            {getStatusOptions().map(status => (
                                <Option key={status} value={status}>
                                    {status.toUpperCase()}
                                </Option>
                            ))}
                        </Select>

                        <TextArea
                            placeholder="Add notes about this status change (optional)"
                            value={statusNotes}
                            onChange={(e) => setStatusNotes(e.target.value)}
                            rows={3}
                        />
                    </Space>
                </Modal>

                {/* Update Tracking Modal */}
                <Modal
                    title="Update Tracking Information"
                    open={trackingModalVisible}
                    onCancel={() => setTrackingModalVisible(false)}
                    footer={[
                        <Button key="cancel" onClick={() => setTrackingModalVisible(false)}>
                            Cancel
                        </Button>,
                        <Button
                            key="submit"
                            type="primary"
                            loading={updating}
                            onClick={handleTrackingUpdate}
                            disabled={!trackingNumber}
                        >
                            Update Tracking
                        </Button>,
                    ]}
                >
                    <Space direction="vertical" className="w-full" size="middle">
                        <div>
                            <Text strong>Current Tracking:</Text>
                            <Text code className="ml-2">
                                {order.tracking_number || 'Not set'}
                            </Text>
                        </div>

                        <Input
                            placeholder="Enter tracking number"
                            value={trackingNumber}
                            onChange={(e) => setTrackingNumber(e.target.value)}
                        />

                        <Alert
                            message="Status will be automatically updated to 'Shipped'"
                            type="info"
                            showIcon
                        />
                    </Space>
                </Modal>
            </div>
        </div>
    );
};

export default AdminOrderDetailPage;