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

    // Modal cập nhật trạng thái
    const [statusModalVisible, setStatusModalVisible] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [statusNotes, setStatusNotes] = useState('');

    // Modal theo dõi
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
            console.error('Lỗi khi tải thông tin đơn hàng:', error);
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
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('vi-VN');
    };

    const handleStatusUpdate = async () => {
        if (!order || !selectedStatus) return;

        setUpdating(true);
        try {
            // Gọi API để cập nhật trạng thái
            await new Promise(resolve => setTimeout(resolve, 1000)); // Mô phỏng gọi API

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
            // Gọi API để cập nhật theo dõi
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
            // Gọi API để cập nhật thông tin đơn hàng
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
            // Gọi API để hủy đơn hàng
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
                    {record.size && <Tag>Kích thước: {record.size}</Tag>}
                    {record.color && <Tag color={record.color.toLowerCase()}>Màu sắc: {record.color}</Tag>}
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
                        Quay lại Đơn hàng
                    </Button>

                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <Title level={2} className="mb-2">Chi tiết đơn hàng - Quản trị viên</Title>
                            <Space wrap>
                                <Text strong>Mã đơn hàng:</Text>
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
                                    Đã tạo: {formatDate(order.created_at)}
                                </Text>
                            </Space>
                        </div>

                        <Space wrap>
                            <Button
                                icon={<PrinterOutlined />}
                                size="large"
                            >
                                In hóa đơn
                            </Button>
                            <Button
                                icon={<EditOutlined />}
                                size="large"
                                onClick={() => setIsEditing(!isEditing)}
                            >
                                {isEditing ? 'Hủy chỉnh sửa' : 'Chỉnh sửa đơn hàng'}
                            </Button>
                            <Button
                                type="primary"
                                size="large"
                                onClick={() => setStatusModalVisible(true)}
                                icon={<SyncOutlined />}
                            >
                                Cập nhật trạng thái
                            </Button>
                            {order.status !== 'cancelled' && order.status !== 'refunded' && (
                                <Popconfirm
                                    title="Hủy đơn hàng"
                                    description="Bạn có chắc chắn muốn hủy đơn hàng này không?"
                                    onConfirm={handleCancelOrder}
                                    okText="Có"
                                    cancelText="Không"
                                >
                                    <Button
                                        danger
                                        size="large"
                                        icon={<CloseCircleOutlined />}
                                    >
                                        Hủy đơn hàng
                                    </Button>
                                </Popconfirm>
                            )}
                        </Space>
                    </div>
                </div>

                <Row gutter={[24, 24]}>
                    {/* Cột trái - Thông tin đơn hàng */}
                    <Col xs={24} lg={16}>
                        {/* Tiến trình đơn hàng */}
                        <Card
                            title="Tiến trình đơn hàng"
                            className="mb-6"
                            extra={
                                <Button
                                    type="link"
                                    icon={<EyeOutlined />}
                                    onClick={() => navigate(`/order/${order.id}`)}
                                >
                                    Xem khách hàng
                                </Button>
                            }
                        >
                            <Steps
                                current={getStatusStep(order.status)}
                                status={order.status === 'cancelled' ? 'error' : 'process'}
                            >
                                <Step
                                    title="Chờ xử lý"
                                    description="Đơn hàng đã được đặt"
                                />
                                <Step
                                    title="Đã xác nhận"
                                    description="Đơn hàng đã xác nhận"
                                />
                                <Step
                                    title="Đang xử lý"
                                    description="Đang chuẩn bị đơn hàng của bạn"
                                />
                                <Step
                                    title="Đã giao hàng"
                                    description="Đơn hàng đang trên đường giao"
                                />
                                <Step
                                    title="Đã nhận hàng"
                                    description="Đơn hàng đã được giao"
                                />
                            </Steps>

                            {order.tracking_number && (
                                <Alert
                                    message={
                                        <Space>
                                            <Text strong>Mã theo dõi:</Text>
                                            <Text code>{order.tracking_number}</Text>
                                            <Button
                                                type="link"
                                                size="small"
                                                onClick={() => setTrackingModalVisible(true)}
                                            >
                                                Cập nhật
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
                                    message="Sẵn sàng giao hàng"
                                    description="Thêm mã theo dõi khi đơn hàng được giao"
                                    type="warning"
                                    showIcon
                                    className="mt-4"
                                    action={
                                        <Button
                                            size="small"
                                            type="primary"
                                            onClick={() => setTrackingModalVisible(true)}
                                        >
                                            Thêm theo dõi
                                        </Button>
                                    }
                                />
                            )}
                        </Card>

                        {/* Mặt hàng trong đơn */}
                        <Card title="Mặt hàng trong đơn">
                            <Table
                                columns={orderItemsColumns}
                                dataSource={order.items.map(item => ({ ...item, key: item.id }))}
                                pagination={false}
                                summary={() => (
                                    <Table.Summary>
                                        <Table.Summary.Row>
                                            <Table.Summary.Cell index={0} colSpan={3}></Table.Summary.Cell>
                                            <Table.Summary.Cell index={1}>
                                                <Text strong>Tạm tính</Text>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={2}>
                                                <Text strong>{formatCurrency(subtotal)}</Text>
                                            </Table.Summary.Cell>
                                        </Table.Summary.Row>
                                        <Table.Summary.Row>
                                            <Table.Summary.Cell index={0} colSpan={3}></Table.Summary.Cell>
                                            <Table.Summary.Cell index={1}>
                                                <Text>Phí giao hàng</Text>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={2}>
                                                <Text>{formatCurrency(shippingCost)}</Text>
                                            </Table.Summary.Cell>
                                        </Table.Summary.Row>
                                        <Table.Summary.Row>
                                            <Table.Summary.Cell index={0} colSpan={3}></Table.Summary.Cell>
                                            <Table.Summary.Cell index={1}>
                                                <Text>Thuế</Text>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={2}>
                                                <Text>{formatCurrency(tax)}</Text>
                                            </Table.Summary.Cell>
                                        </Table.Summary.Row>
                                        <Table.Summary.Row>
                                            <Table.Summary.Cell index={0} colSpan={3}></Table.Summary.Cell>
                                            <Table.Summary.Cell index={1}>
                                                <Text strong>Tổng cộng</Text>
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

                    {/* Cột phải - Chi tiết đơn hàng và hành động */}
                    <Col xs={24} lg={8}>
                        {/* Thông tin khách hàng */}
                        <Card
                            title="Thông tin khách hàng"
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
                                        Lưu
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
                                <Form.Item name="fullname" label="Họ tên đầy đủ">
                                    <Input prefix={<UserOutlined />} />
                                </Form.Item>
                                <Form.Item name="email" label="Email">
                                    <Input prefix={<MailOutlined />} />
                                </Form.Item>
                                <Form.Item name="phone" label="Số điện thoại">
                                    <Input prefix={<PhoneOutlined />} />
                                </Form.Item>
                            </Form>
                        </Card>

                        {/* Thông tin vận chuyển & thanh toán */}
                        <Card title="Vận chuyển & Thanh toán" className="mb-6">
                            <Space direction="vertical" className="w-full" size="middle">
                                <div>
                                    <Text strong>Địa chỉ giao hàng</Text>
                                    <Paragraph className="mt-1">
                                        {order.specific_address}<br />
                                        {order.ward}, {order.city}, {order.province}<br />
                                        {order.country} - {order.zipcode}
                                    </Paragraph>
                                </div>

                                <Divider />

                                <div className="flex justify-between">
                                    <Text strong>Phương thức giao hàng:</Text>
                                    <Tag>{order.shipping_method.toUpperCase()}</Tag>
                                </div>

                                <div className="flex justify-between">
                                    <Text strong>Phương thức thanh toán:</Text>
                                    <Tag icon={<CreditCardOutlined />}>
                                        {order.payment_method.toUpperCase()}
                                    </Tag>
                                </div>

                                <div className="flex justify-between">
                                    <Text strong>Trạng thái thanh toán:</Text>
                                    <Badge
                                        status={order.payment_method === 'COD' ? 'warning' : 'success'}
                                        text={order.payment_method === 'COD' ? 'Chờ thanh toán' : 'Đã thanh toán'}
                                    />
                                </div>
                            </Space>
                        </Card>

                        {/* Ghi chú đơn hàng */}
                        <Card title="Ghi chú đơn hàng">
                            <TextArea
                                placeholder="Thêm ghi chú nội bộ..."
                                rows={4}
                                value={order.notes}
                                onChange={(e) => setOrder(prev => prev ? { ...prev, notes: e.target.value } : null)}
                            />
                            <Button type="dashed" block className="mt-2">
                                Thêm ghi chú
                            </Button>
                        </Card>

                        {/* Hành động nhanh */}
                        <Card title="Hành động nhanh" className="mt-6">
                            <Space direction="vertical" className="w-full">
                                <Button
                                    icon={<FileTextOutlined />}
                                    block
                                    onClick={() => window.print()}
                                >
                                    In hóa đơn
                                </Button>
                                <Button
                                    icon={<TruckOutlined />}
                                    block
                                    onClick={() => setTrackingModalVisible(true)}
                                    disabled={!order.tracking_number}
                                >
                                    Cập nhật theo dõi
                                </Button>
                                <Button
                                    icon={<MailOutlined />}
                                    block
                                >
                                    Gửi email cho khách hàng
                                </Button>
                            </Space>
                        </Card>
                    </Col>
                </Row>

                {/* Modal cập nhật trạng thái */}
                <Modal
                    title="Cập nhật trạng thái đơn hàng"
                    open={statusModalVisible}
                    onCancel={() => setStatusModalVisible(false)}
                    footer={[
                        <Button key="cancel" onClick={() => setStatusModalVisible(false)}>
                            Hủy
                        </Button>,
                        <Button
                            key="submit"
                            type="primary"
                            loading={updating}
                            onClick={handleStatusUpdate}
                            disabled={!selectedStatus}
                        >
                            Cập nhật trạng thái
                        </Button>,
                    ]}
                >
                    <Space direction="vertical" className="w-full" size="middle">
                        <div>
                            <Text strong>Trạng thái hiện tại:</Text>
                            <Tag color={getStatusColor(order.status)} className="ml-2">
                                {order.status.toUpperCase()}
                            </Tag>
                        </div>

                        <Select
                            placeholder="Chọn trạng thái mới"
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
                            placeholder="Thêm ghi chú về thay đổi trạng thái này (tùy chọn)"
                            value={statusNotes}
                            onChange={(e) => setStatusNotes(e.target.value)}
                            rows={3}
                        />
                    </Space>
                </Modal>

                {/* Modal cập nhật theo dõi */}
                <Modal
                    title="Cập nhật thông tin theo dõi"
                    open={trackingModalVisible}
                    onCancel={() => setTrackingModalVisible(false)}
                    footer={[
                        <Button key="cancel" onClick={() => setTrackingModalVisible(false)}>
                            Hủy
                        </Button>,
                        <Button
                            key="submit"
                            type="primary"
                            loading={updating}
                            onClick={handleTrackingUpdate}
                            disabled={!trackingNumber}
                        >
                            Cập nhật theo dõi
                        </Button>,
                    ]}
                >
                    <Space direction="vertical" className="w-full" size="middle">
                        <div>
                            <Text strong>Mã theo dõi hiện tại:</Text>
                            <Text code className="ml-2">
                                {order.tracking_number || 'Chưa thiết lập'}
                            </Text>
                        </div>

                        <Input
                            placeholder="Nhập mã theo dõi"
                            value={trackingNumber}
                            onChange={(e) => setTrackingNumber(e.target.value)}
                        />

                        <Alert
                            message="Trạng thái sẽ tự động cập nhật thành 'Đã giao hàng'"
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