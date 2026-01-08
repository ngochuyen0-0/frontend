import React, { useState, useEffect } from "react";
import {
    Card,
    Form,
    Input,
    Button,
    Radio,
    Divider,
    Space,
    Typography,
    Row,
    Col,
    Steps,
    Alert,
    Image,
    Tag,
    Select,
    Collapse,
    Table,
    Descriptions,
    Badge
} from "antd";
import {
    ArrowLeftOutlined,
    CreditCardOutlined,
    PayCircleOutlined,
    SafetyCertificateOutlined,
    LockOutlined,
    BankOutlined,
    CopyOutlined,
    QrcodeOutlined,
    UserOutlined,
    PhoneOutlined,
    MailOutlined,
    EnvironmentOutlined,
    ShoppingOutlined
} from "@ant-design/icons";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { getOrderById } from "../../services/orderService";
import { toast } from "sonner";
import { getProductVariantById } from "../../services/productService";
import { ProductVariantSingle } from "../../types/product";
import { Order, OrderItem } from "../../types/order";

const { Title, Text } = Typography;
const { Step } = Steps;
const { Option } = Select;
const { Panel } = Collapse;



// Danh sách ngân hàng hỗ trợ
const supportedBanks = [
    { code: "VCB", name: "Vietcombank", shortName: "VCB" },
    { code: "BIDV", name: "BIDV", shortName: "BIDV" },
    { code: "AGB", name: "Agribank", shortName: "Agribank" },
    { code: "TCB", name: "Techcombank", shortName: "Techcombank" },
    { code: "MB", name: "MB Bank", shortName: "MB" },
    { code: "VPB", name: "VP Bank", shortName: "VPBank" },
    { code: "STB", name: "Sacombank", shortName: "Sacombank" },
    { code: "ACB", name: "ACB", shortName: "ACB" }
];

// Thông tin tài khoản ngân hàng công ty
const companyBankAccounts = [
    {
        bank: "Vietcombank",
        accountNumber: "1234567890123",
        accountName: "CONG TY TNHH THUONG MAI ABC",
        branch: "Chi nhánh Hà Nội",
        qrCode: "/qr/vietcombank-qr.jpg"
    },
    {
        bank: "BIDV",
        accountNumber: "9876543210987",
        accountName: "CONG TY TNHH THUONG MAI ABC",
        branch: "Chi nhánh TP.HCM",
        qrCode: "/qr/bidv-qr.jpg"
    },
    {
        bank: "Techcombank",
        accountNumber: "4567890123456",
        accountName: "CONG TY TNHH THUONG MAI ABC",
        branch: "Chi nhánh Đà Nẵng",
        qrCode: "/qr/techcombank-qr.jpg"
    }
];

const PaymentPage: React.FC = () => {
    const [form] = Form.useForm();
    const { order_id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState<boolean>(false);
    const [paymentMethod, setPaymentMethod] = useState<string>("credit");
    const [selectedBank, setSelectedBank] = useState<string>("Vietcombank");
    const [orderData, setOrderData] = useState<Order | null>(null);
    const [variantImages, setVariantImages] = useState<Record<string, string>>({});


    useEffect(() => {
        const fecth = async () => {
            const mockOrderData: Order = await getOrderById(order_id as string);
            if (mockOrderData.status.toLocaleLowerCase() === "paid"){
                navigate(`/order-info/${mockOrderData.id}`)
            }
            const results = await Promise.all(mockOrderData.items.map(item => getProductVariantById(item.variant_id)));
            
            // Tạo map ảnh sản phẩm
            const imagesMap: Record<string, string> = {};
            results.forEach((e: ProductVariantSingle) => {
                if (e.product.images && e.product.images.length > 0) {
                    imagesMap[e.id || ''] = e.product.images[0].image_url || '/placeholder-image.jpg';
                } else {
                    imagesMap[e.id || ''] = '/placeholder-image.jpg';
                }
            });
            setVariantImages(imagesMap);
            
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
            setOrderData(mockOrderData)
        }
        fecth();
    }, [])

    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);
    };

    const formatCurrencyVND = (value: number): string => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleString('vi-VN');
    };

    const handleSubmit = async (values: any) => {
        if (!orderData) return;
        setLoading(true);

        try {
            const paymentPayload = {
                paymentMethod: paymentMethod,
                orderId: orderData.id,
                bankTransfer: paymentMethod === "bank" ? {
                    bankCode: selectedBank,
                    senderName: values.senderName,
                    senderAccount: values.senderAccount,
                    transferAmount: orderData.total_amount,
                    transferDate: values.transferDate,
                    transactionCode: values.transactionCode
                } : null,
                cardInfo: paymentMethod === "credit" ? {
                    cardNumber: values.cardNumber,
                    cardHolder: values.cardHolder,
                    expiryDate: values.expiryDate,
                    cvv: values.cvv
                } : null,
                amount: orderData.total_amount,
                currency: "VND"
            };
            if (paymentMethod === "bank") {
                toast.success("Đơn hàng đã được tạo! Vui lòng hoàn tất chuyển khoản trong vòng 24 giờ.");
            } else if (paymentMethod === "cod") {
                toast.success("Đơn hàng đã được đặt thành công! Bạn sẽ thanh toán khi nhận hàng.");
                setTimeout(() => {
                    navigate(`/order-info/${orderData.id}`); // Điều hướng đến trang thông tin đơn hàng sau 2 giây
                }, 2000);
            } else {
                toast.success("Thanh toán thành công! Đơn hàng của bạn đã được đặt.");
                setTimeout(() => {
                    navigate(`/order-info/${orderData.id}`); // Điều hướng đến trang thông tin đơn hàng sau 2 giây
                }, 2000);
            }

        } catch (error) {
            toast.error("Đã xảy ra lỗi trong quá trình xử lý thanh toán.");
            console.error("Lỗi thanh toán:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleBackToInformation = () => {
        navigate("/checkout");
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Đã sao chép vào clipboard!");
    };

    const getSelectedBankAccount = () => {
        return companyBankAccounts.find(acc => acc.bank === selectedBank) || companyBankAccounts[0];
    };

    // Columns cho bảng sản phẩm
    const productColumns = [
        {
            title: 'Sản phẩm',
            key: 'product',
            render: (_, record) => {
                // Sử dụng ảnh từ variantImages đã được fetch trước đó
                const imageUrl = variantImages[record.variant_id] || '/placeholder-image.jpg';
                
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '60px', height: '60px', backgroundColor: '#f5f5f5', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Image
                                src={imageUrl}
                                alt={record.product_name}
                                width={60}
                                height={60}
                                style={{ objectFit: 'cover', borderRadius: '4px' }}
                                fallback="/placeholder-image.jpg"
                            />
                        </div>
                        <div>
                            <div style={{ fontWeight: '500' }}>{record.product_name}</div>
                            <div style={{ fontSize: '12px', color: '#666' }}>Kích thước: {record.size || 'N/A'} | Màu: {record.color || 'N/A'}</div>
                        </div>
                    </div>
                );
            },
            width: '40%',
        },
        {
            title: 'Đơn giá',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => formatCurrency(price),
            width: '20%',
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            width: '15%',
        },
        {
            title: 'Tổng giá',
            key: 'total',
            render: (record: OrderItem) => formatCurrency(record.price * record.quantity),
            width: '25%',
        },
    ];

    if (!orderData) {
        return <div>Đang tải...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Checkout Steps */}
                <div className="mb-8">
                    <Steps current={2} className="mb-8">
                        <Step title="Giỏ hàng" description="Xem lại các mặt hàng" />
                        <Step title="Thông tin" description="Tạo đơn hàng" />
                        <Step title="Thanh toán" description="Phương thức thanh toán" />
                        <Step title="Xem lại" description="Cài đặt đơn hàng" />
                    </Steps>
                </div>

                <Row gutter={[32, 32]}>
                    {/* Left Column - Order Information */}
                    <Col xs={24} lg={14}>
                        <Card>
                            <Title level={3} className="mb-6">
                                <ShoppingOutlined /> Thông tin đơn hàng
                            </Title>

                            {/* Thông tin đơn hàng */}
                            <Descriptions
                                title="Chi tiết đơn hàng"
                                bordered
                                column={1}
                                className="mb-6"
                            >
                                <Descriptions.Item label="Mã đơn hàng">
                                    <Text strong>{orderData.id}</Text>
                                </Descriptions.Item>
                                <Descriptions.Item label="Ngày đặt hàng">
                                    {formatDate(orderData.created_at)}
                                </Descriptions.Item>
                                <Descriptions.Item label="Status">
                                    <Badge status="processing" text={orderData.status} />
                                </Descriptions.Item>
                                <Descriptions.Item label="Tổng tiền">
                                    <Text strong type="danger" className="text-lg">
                                        {formatCurrency(orderData.total_amount)}
                                    </Text>
                                </Descriptions.Item>
                            </Descriptions>

                            {/* Thông tin khách hàng */}
                            <Card title="Thông tin khách hàng" className="mb-6">
                                <Descriptions column={1}>
                                    <Descriptions.Item label={<><UserOutlined /> Họ tên đầy đủ</>}>
                                        {orderData.fullname}
                                    </Descriptions.Item>
                                    <Descriptions.Item label={<><MailOutlined /> Email</>}>
                                        {orderData.email}
                                    </Descriptions.Item>
                                    <Descriptions.Item label={<><PhoneOutlined /> Điện thoại</>}>
                                        {orderData.phone}
                                    </Descriptions.Item>
                                </Descriptions>
                            </Card>

                            {/* Thông tin giao hàng */}
                            <Card title="Thông tin giao hàng" className="mb-6">
                                <Descriptions column={1}>
                                    <Descriptions.Item label={<><EnvironmentOutlined /> Địa chỉ</>}>
                                        {orderData.specific_address}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Thành phố/Tỉnh">
                                        {orderData.city}, {orderData.province}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Phường/Xã/Quận/Huyện">
                                        {orderData.ward}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Mã bưu điện">
                                        {orderData.zipcode}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Quốc gia">
                                        {orderData.country}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Phương thức vận chuyển">
                                        <Tag color="blue">{orderData.shipping_method.toUpperCase()}</Tag>
                                    </Descriptions.Item>
                                </Descriptions>
                            </Card>

                            {/* Bảng sản phẩm */}
                            <Card title="Các mặt hàng trong đơn">
                                <Table
                                    columns={productColumns}
                                    dataSource={orderData.items.map(item => ({ ...item, key: item.id }))}
                                    pagination={false}
                                    summary={() => (
                                        <Table.Summary>
                                            <Table.Summary.Row style={{ backgroundColor: '#fafafa' }}>
                                                <Table.Summary.Cell index={0} colSpan={3} align="right">
                                                    <Text strong>Tổng cộng</Text>
                                                </Table.Summary.Cell>
                                                <Table.Summary.Cell index={1} align="left">
                                                    <Text strong type="danger" style={{ fontSize: '16px' }}>
                                                        {formatCurrency(orderData.total_amount)}
                                                    </Text>
                                                </Table.Summary.Cell>
                                            </Table.Summary.Row>
                                        </Table.Summary>
                                    )}
                                />
                            </Card>
                        </Card>
                    </Col>

                    {/* Right Column - Payment Methods */}
                    <Col xs={24} lg={10}>
                        <Card title="Phương thức thanh toán" className="sticky top-4">
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={handleSubmit}
                                initialValues={{
                                    paymentMethod: "credit"
                                }}
                                className="space-y-6"
                            >
                                {/* Payment Method Selection */}
                                <div className="mb-6">
                                    <Title level={5} className="mb-4">
                                        💳 Chọn phương thức thanh toán
                                    </Title>
<Form.Item
    name="paymentMethod" className="w-full">
    <Radio.Group
        onChange={(e) => setPaymentMethod(e.target.value)}
        className="w-full"
    >
        <Space direction="vertical" className="w-full" size="middle">
            <Radio value="credit" className="w-full">
                <div className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg w-full hover:border-blue-400 transition-colors">
                    <CreditCardOutlined className="text-blue-500 text-lg" />
                    <div className="flex-1">
                        <Text strong>Thẻ tín dụng/Thẻ ghi nợ</Text>
                        <br />
                        <Text type="secondary" className="text-sm">Thanh toán bằng Visa, Mastercard hoặc American Express</Text>
                    </div>
                </div>
            </Radio>

            <Radio value="bank" className="w-full">
                <div className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg w-full hover:border-green-400 transition-colors">
                    <BankOutlined className="text-green-500 text-lg" />
                    <div className="flex-1">
                        <Text strong>Chuyển khoản ngân hàng</Text>
                        <br />
                        <Text type="secondary" className="text-sm">Chuyển tiền qua internet banking</Text>
                    </div>
                </div>
            </Radio>


            <Radio value="cod" className="w-full">
                <div className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg w-full hover:border-green-400 transition-colors">
                    <SafetyCertificateOutlined className="text-green-500 text-lg" />
                    <div className="flex-1">
                        <Text strong>Thanh toán khi nhận hàng</Text>
                        <br />
                        <Text type="secondary" className="text-sm">Thanh toán khi bạn nhận được đơn hàng</Text>
                    </div>
                </div>
            </Radio>
        </Space>
    </Radio.Group>
</Form.Item>
                                </div>

                                {/* Credit Card Form */}
                                {paymentMethod === "credit" && (
                                    <div className="mb-6">
                                        <Title level={5} className="mb-4">
                                            🔒 Thông tin thẻ
                                        </Title>

                                        <Alert
                                            message="Thông tin thanh toán của bạn được bảo mật và mã hóa"
                                            type="info"
                                            icon={<LockOutlined />}
                                            className="mb-4"
                                        />

                                        <Form.Item
                                            name="cardHolder"
                                            label="Tên chủ thẻ"
                                            rules={[{ required: true, message: 'Tên chủ thẻ là bắt buộc' }]}
                                        >
                                            <Input
                                                placeholder="Họ tên đầy đủ như trên thẻ"
                                                size="large"
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            name="cardNumber"
                                            label="Số thẻ"
                                            rules={[
                                                { required: true, message: 'Số thẻ là bắt buộc' },
                                                { pattern: /^\d{16}$/, message: 'Số thẻ phải có 16 chữ số' }
                                            ]}
                                        >
                                            <Input
                                                placeholder="1234 5678 9012 3456"
                                                maxLength={16}
                                                size="large"
                                            />
                                        </Form.Item>

                                        <Row gutter={16}>
                                            <Col span={12}>
                                                <Form.Item
                                                    name="expiryDate"
                                                    label="Ngày hết hạn"
                                                    rules={[
                                                        { required: true, message: 'Ngày hết hạn là bắt buộc' },
                                                        { pattern: /^(0[1-9]|1[0-2])\/\d{2}$/, message: 'Định dạng: MM/YY' }
                                                    ]}
                                                >
                                                    <Input
                                                        placeholder="MM/YY"
                                                        maxLength={5}
                                                        size="large"
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item
                                                    name="cvv"
                                                    label="Mã CVV"
                                                    rules={[
                                                        { required: true, message: 'Mã CVV là bắt buộc' },
                                                        { pattern: /^\d{3,4}$/, message: 'Mã CVV phải có 3 hoặc 4 chữ số' }
                                                    ]}
                                                >
                                                    <Input
                                                        placeholder="123"
                                                        maxLength={4}
                                                        type="password"
                                                        size="large"
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </div>
                                )}

                                {/* Bank Transfer Form */}
                                {paymentMethod === "bank" && (
                                    <div className="mb-6">
                                        <Title level={5} className="mb-4">
                                            🏦 Thông tin chuyển khoản ngân hàng
                                        </Title>

                                        <Alert
                                            message="Vui lòng chuyển đúng số tiền và ghi rõ mã đơn hàng trong nội dung chuyển khoản"
                                            type="warning"
                                            className="mb-4"
                                        />

                                        {/* Company Bank Account Information */}
                                        <Card
                                            title="Chuyển đến tài khoản công ty chúng tôi"
                                            className="mb-4"
                                            extra={
                                                <Button
                                                    icon={<QrcodeOutlined />}
                                                    size="small"
                                                    onClick={() => toast.info("Mã QR sẽ được hiển thị ở đây")}
                                                >
                                                    Hiển thị QR
                                                </Button>
                                            }
                                        >
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <Text strong>Ngân hàng:</Text>
                                                    <Select
                                                        value={selectedBank}
                                                        onChange={setSelectedBank}
                                                        style={{ width: 200 }}
                                                        size="large"
                                                    >
                                                        {supportedBanks.map(bank => (
                                                            <Option key={bank.code} value={bank.name}>
                                                                {bank.name}
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                </div>

                                                <div className="flex justify-between items-center">
                                                    <Text strong>Số tài khoản:</Text>
                                                    <div className="flex items-center gap-2">
                                                        <Text strong className="text-lg">
                                                            {getSelectedBankAccount().accountNumber}
                                                        </Text>
                                                        <Button
                                                            type="text"
                                                            icon={<CopyOutlined />}
                                                            size="small"
                                                            onClick={() => copyToClipboard(getSelectedBankAccount().accountNumber)}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex justify-between items-center">
                                                    <Text strong>Tên tài khoản:</Text>
                                                    <div className="flex items-center gap-2">
                                                        <Text>{getSelectedBankAccount().accountName}</Text>
                                                        <Button
                                                            type="text"
                                                            icon={<CopyOutlined />}
                                                            size="small"
                                                            onClick={() => copyToClipboard(getSelectedBankAccount().accountName)}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex justify-between">
                                                    <Text strong>Chi nhánh:</Text>
                                                    <Text>{getSelectedBankAccount().branch}</Text>
                                                </div>

                                                <div className="flex justify-between text-lg font-bold">
                                                    <Text strong>Số tiền:</Text>
                                                    <Text type="danger">
                                                        {formatCurrency(orderData.total_amount)} ({formatCurrencyVND(orderData.total_amount)})
                                                    </Text>
                                                </div>
                                            </div>
                                        </Card>

                                        {/* Transfer Details Form */}
                                        <Title level={5} className="mb-4">
                                            Chi tiết chuyển khoản của bạn
                                        </Title>

                                        <Form.Item
                                            name="senderName"
                                            label="Tên người gửi (như trong tài khoản ngân hàng)"
                                            rules={[{ required: true, message: 'Tên người gửi là bắt buộc' }]}
                                        >
                                            <Input
                                                placeholder="Họ tên đầy đủ như hiển thị trong tài khoản ngân hàng"
                                                size="large"
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            name="senderAccount"
                                            label="Số tài khoản của bạn"
                                            rules={[{ required: true, message: 'Số tài khoản của bạn là bắt buộc' }]}
                                        >
                                            <Input
                                                placeholder="Số tài khoản ngân hàng của bạn"
                                                size="large"
                                            />
                                        </Form.Item>

                                        <Row gutter={16}>
                                            <Col span={12}>
                                                <Form.Item
                                                    name="transferDate"
                                                    label="Ngày chuyển khoản"
                                                    rules={[{ required: true, message: 'Ngày chuyển khoản là bắt buộc' }]}
                                                >
                                                    <Input
                                                        type="date"
                                                        size="large"
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item
                                                    name="transactionCode"
                                                    label="Mã tham chiếu giao dịch"
                                                    rules={[{ required: true, message: 'Mã tham chiếu giao dịch là bắt buộc' }]}
                                                >
                                                    <Input
                                                        placeholder="Mã tham chiếu chuyển khoản ngân hàng"
                                                        size="large"
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </div>
                                )}


                                {/* COD Info */}
                                {paymentMethod === "cod" && (
                                    <div className="mb-6">
                                        <Alert
                                            message="Thanh toán bằng tiền mặt khi đơn hàng được giao"
                                            type="warning"
                                            className="mb-4"
                                        />
                                        <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                                            <SafetyCertificateOutlined className="text-4xl text-green-500 mb-2" />
                                            <Title level={4}>Thanh toán khi nhận hàng</Title>
                                            <Text type="secondary">
                                                Bạn sẽ thanh toán cho nhân viên giao hàng khi nhận được đơn hàng
                                            </Text>
                                        </div>
                                    </div>
                                )}

                                {/* Payment Button */}
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
                                    loading={loading}
                                    icon={<LockOutlined />}
                                    className="w-full"

                                >
                                    {paymentMethod === "bank"
                                        ? `Xác nhận chuyển khoản - ${formatCurrency(orderData.total_amount)}`
                                        : `Thanh toán ngay - ${formatCurrency(orderData.total_amount)}`
                                    }
                                </Button>

                                {/* Security Notice */}
                                <div className="text-center p-4 bg-gray-50 rounded-lg mt-4">
                                    <LockOutlined className="text-green-500 text-lg mr-2" />
                                    <Text type="secondary">
                                        Thông tin thanh toán của bạn được bảo mật và mã hóa
                                    </Text>
                                </div>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default PaymentPage;