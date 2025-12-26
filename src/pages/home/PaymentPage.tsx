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
import { payURLCreate } from "../../services/paymentService";
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


    useEffect(() => {
        const fecth = async () => {
            const mockOrderData: Order = await getOrderById(order_id as string);
            if (mockOrderData.status.toLocaleLowerCase() === "paid"){
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
            setOrderData(mockOrderData)
        }
        fecth();
    }, [])

    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(value);
    };

    const formatCurrencyVND = (value: number): string => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value * 23000);
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
                currency: "USD"
            };
            if (paymentMethod === "paypal"){
                await payURLCreate("paypal", order_id || "").then(res=>{
                    window.open(res.approve_url)
                })
            }else if (paymentMethod === "bank") {
                toast.success("Order placed! Please complete bank transfer within 24 hours.");
            } else {
                toast.success("Payment successful! Your order has been placed.");
            }

        } catch (error) {
            toast.error("An error occurred during payment processing.");
            console.error("Payment error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleBackToInformation = () => {
        navigate("/checkout");
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!");
    };

    const getSelectedBankAccount = () => {
        return companyBankAccounts.find(acc => acc.bank === selectedBank) || companyBankAccounts[0];
    };

    // Columns cho bảng sản phẩm
    const productColumns = [
        {
            title: 'Name',
            dataIndex: 'product_name',
            key: 'product_name'
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => formatCurrency(price),
        },

        {
            title: 'Size',
            dataIndex: 'size',
            key: 'size',
            render: (size: string) => <Tag>{size}</Tag>,
        },

        {
            title: 'Color',
            dataIndex: 'color',
            key: 'color',
            render: (color: string) => <Tag color={color}>{color}</Tag>,
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Total Price',
            key: 'total',
            render: (record: OrderItem) => formatCurrency(record.price * record.quantity),
        },
    ];

    if (!orderData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Checkout Steps */}
                <div className="mb-8">
                    <Steps current={2} className="mb-8">
                        <Step title="Cart" description="Review items" />
                        <Step title="Information" description="Create order" />
                        <Step title="Payment" description="Payment method" />
                        <Step title="Review" description="Order setting" />
                    </Steps>
                </div>

                <Row gutter={[32, 32]}>
                    {/* Left Column - Order Information */}
                    <Col xs={24} lg={14}>
                        <Card>
                            <Title level={3} className="mb-6">
                                <ShoppingOutlined /> Order Information
                            </Title>

                            {/* Thông tin đơn hàng */}
                            <Descriptions
                                title="Order Details"
                                bordered
                                column={1}
                                className="mb-6"
                            >
                                <Descriptions.Item label="Order ID">
                                    <Text strong>{orderData.id}</Text>
                                </Descriptions.Item>
                                <Descriptions.Item label="Order Date">
                                    {formatDate(orderData.created_at)}
                                </Descriptions.Item>
                                <Descriptions.Item label="Status">
                                    <Badge status="processing" text={orderData.status} />
                                </Descriptions.Item>
                                <Descriptions.Item label="Total Amount">
                                    <Text strong type="danger" className="text-lg">
                                        {formatCurrency(orderData.total_amount)}
                                    </Text>
                                </Descriptions.Item>
                            </Descriptions>

                            {/* Thông tin khách hàng */}
                            <Card title="Customer Information" className="mb-6">
                                <Descriptions column={1}>
                                    <Descriptions.Item label={<><UserOutlined /> Full Name</>}>
                                        {orderData.fullname}
                                    </Descriptions.Item>
                                    <Descriptions.Item label={<><MailOutlined /> Email</>}>
                                        {orderData.email}
                                    </Descriptions.Item>
                                    <Descriptions.Item label={<><PhoneOutlined /> Phone</>}>
                                        {orderData.phone}
                                    </Descriptions.Item>
                                </Descriptions>
                            </Card>

                            {/* Thông tin giao hàng */}
                            <Card title="Shipping Information" className="mb-6">
                                <Descriptions column={1}>
                                    <Descriptions.Item label={<><EnvironmentOutlined /> Address</>}>
                                        {orderData.specific_address}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="City/Province">
                                        {orderData.city}, {orderData.province}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Ward/District">
                                        {orderData.ward}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="ZIP Code">
                                        {orderData.zipcode}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Country">
                                        {orderData.country}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Shipping Method">
                                        <Tag color="blue">{orderData.shipping_method.toUpperCase()}</Tag>
                                    </Descriptions.Item>
                                </Descriptions>
                            </Card>

                            {/* Bảng sản phẩm */}
                            <Card title="Order Items">
                                <Table
                                    columns={productColumns}
                                    dataSource={orderData.items.map(item => ({ ...item, key: item.id }))}
                                    pagination={false}
                                    summary={() => (
                                        <Table.Summary>
                                            <Table.Summary.Row>
                                                <Table.Summary.Cell index={0} colSpan={5}>
                                                    <Text strong>Total</Text>
                                                </Table.Summary.Cell>
                                                <Table.Summary.Cell index={1}>
                                                    <Text strong type="danger">
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
                        <Card title="Payment Method" className="sticky top-4">
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={handleSubmit}
                                initialValues={{
                                    paymentMethod: "credit"
                                }}
                            >
                                {/* Payment Method Selection */}
                                <div className="mb-6">
                                    <Title level={5} className="mb-4">
                                        💳 Select Payment Method
                                    </Title>

                                    <Form.Item name="paymentMethod" className="w-full">
                                        <Radio.Group
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-full"
                                        >
                                            <Space direction="vertical" className="w-full">
                                                <Radio value="credit" className="w-full">
                                                    <div className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg w-full">
                                                        <CreditCardOutlined className="text-blue-500 text-lg" />
                                                        <div>
                                                            <Text strong>Credit/Debit Card</Text>
                                                            <br />
                                                            <Text type="secondary">Pay with Visa, Mastercard, or American Express</Text>
                                                        </div>
                                                    </div>
                                                </Radio>

                                                <Radio value="bank" className="w-full">
                                                    <div className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg w-full">
                                                        <BankOutlined className="text-green-500 text-lg" />
                                                        <div>
                                                            <Text strong>Bank Transfer</Text>
                                                            <br />
                                                            <Text type="secondary">Transfer money via online banking</Text>
                                                        </div>
                                                    </div>
                                                </Radio>

                                                <Radio value="paypal" className="w-full">
                                                    <div className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg w-full">
                                                        <PayCircleOutlined className="text-blue-500 text-lg" />
                                                        <div>
                                                            <Text strong>PayPal</Text>
                                                            <br />
                                                            <Text type="secondary">Pay securely with your PayPal account</Text>
                                                        </div>
                                                    </div>
                                                </Radio>

                                                <Radio value="cod" className="w-full">
                                                    <div className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg w-full">
                                                        <SafetyCertificateOutlined className="text-green-500 text-lg" />
                                                        <div>
                                                            <Text strong>Cash on Delivery</Text>
                                                            <br />
                                                            <Text type="secondary">Pay when you receive your order</Text>
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
                                            🔒 Card Information
                                        </Title>

                                        <Alert
                                            message="Your payment information is secure and encrypted"
                                            type="info"
                                            icon={<LockOutlined />}
                                            className="mb-4"
                                        />

                                        <Form.Item
                                            name="cardHolder"
                                            label="Cardholder Name"
                                            rules={[{ required: true, message: 'Cardholder name is required' }]}
                                        >
                                            <Input
                                                placeholder="Full name as shown on card"
                                                size="large"
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            name="cardNumber"
                                            label="Card Number"
                                            rules={[
                                                { required: true, message: 'Card number is required' },
                                                { pattern: /^\d{16}$/, message: 'Card number must be 16 digits' }
                                            ]}
                                        >
                                            <Input
                                                placeholder="1234 5678 9012 3456"
                                                maxLength={16}
                                                size="large"
                                            />
                                        </Form.Item>

                                        <Row gutter={12}>
                                            <Col span={12}>
                                                <Form.Item
                                                    name="expiryDate"
                                                    label="Expiry Date"
                                                    rules={[
                                                        { required: true, message: 'Expiry date is required' },
                                                        { pattern: /^(0[1-9]|1[0-2])\/\d{2}$/, message: 'Format: MM/YY' }
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
                                                    label="CVV"
                                                    rules={[
                                                        { required: true, message: 'CVV is required' },
                                                        { pattern: /^\d{3,4}$/, message: 'CVV must be 3 or 4 digits' }
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
                                            🏦 Bank Transfer Information
                                        </Title>

                                        <Alert
                                            message="Please transfer the exact amount and include your order number in the transfer description"
                                            type="warning"
                                            className="mb-4"
                                        />

                                        {/* Company Bank Account Information */}
                                        <Card
                                            title="Transfer to Our Company Account"
                                            className="mb-4"
                                            extra={
                                                <Button
                                                    icon={<QrcodeOutlined />}
                                                    size="small"
                                                    onClick={() => toast.info("QR Code would be displayed here")}
                                                >
                                                    Show QR
                                                </Button>
                                            }
                                        >
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <Text strong>Bank:</Text>
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
                                                    <Text strong>Account Number:</Text>
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
                                                    <Text strong>Account Name:</Text>
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
                                                    <Text strong>Branch:</Text>
                                                    <Text>{getSelectedBankAccount().branch}</Text>
                                                </div>

                                                <div className="flex justify-between text-lg font-bold">
                                                    <Text strong>Amount:</Text>
                                                    <Text type="danger">
                                                        {formatCurrency(orderData.total_amount)} ({formatCurrencyVND(orderData.total_amount)})
                                                    </Text>
                                                </div>
                                            </div>
                                        </Card>

                                        {/* Transfer Details Form */}
                                        <Title level={5} className="mb-4">
                                            Your Transfer Details
                                        </Title>

                                        <Form.Item
                                            name="senderName"
                                            label="Sender Name (as in bank account)"
                                            rules={[{ required: true, message: 'Sender name is required' }]}
                                        >
                                            <Input
                                                placeholder="Your full name as shown in bank account"
                                                size="large"
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            name="senderAccount"
                                            label="Your Account Number"
                                            rules={[{ required: true, message: 'Your account number is required' }]}
                                        >
                                            <Input
                                                placeholder="Your bank account number"
                                                size="large"
                                            />
                                        </Form.Item>

                                        <Row gutter={12}>
                                            <Col span={12}>
                                                <Form.Item
                                                    name="transferDate"
                                                    label="Transfer Date"
                                                    rules={[{ required: true, message: 'Transfer date is required' }]}
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
                                                    label="Transaction Reference"
                                                    rules={[{ required: true, message: 'Transaction reference is required' }]}
                                                >
                                                    <Input
                                                        placeholder="Bank transfer reference code"
                                                        size="large"
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </div>
                                )}

                                {/* PayPal Info */}
                                {paymentMethod === "paypal" && (
                                    <div className="mb-6">
                                        <Alert
                                            message="You will be redirected to PayPal to complete your payment"
                                            type="info"
                                            className="mb-4"
                                        />
                                        <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                                            <PayCircleOutlined className="text-4xl text-blue-500 mb-2" />
                                            <Title level={4}>PayPal</Title>
                                            <Text type="secondary">
                                                Click "Place Order" to be redirected to PayPal's secure payment page
                                            </Text>
                                        </div>
                                    </div>
                                )}

                                {/* COD Info */}
                                {paymentMethod === "cod" && (
                                    <div className="mb-6">
                                        <Alert
                                            message="Pay with cash when your order is delivered"
                                            type="warning"
                                            className="mb-4"
                                        />
                                        <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                                            <SafetyCertificateOutlined className="text-4xl text-green-500 mb-2" />
                                            <Title level={4}>Cash on Delivery</Title>
                                            <Text type="secondary">
                                                You'll pay the delivery agent when you receive your order
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
                                        ? `Confirm Transfer - ${formatCurrency(orderData.total_amount)}`
                                        : `Pay Now - ${formatCurrency(orderData.total_amount)}`
                                    }
                                </Button>

                                {/* Security Notice */}
                                <div className="text-center p-4 bg-gray-50 rounded-lg mt-4">
                                    <LockOutlined className="text-green-500 text-lg mr-2" />
                                    <Text type="secondary">
                                        Your payment information is secure and encrypted
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