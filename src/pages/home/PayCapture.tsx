import React, { useState, useEffect } from 'react';
import {
    Card,
    Row,
    Col,
    Typography,
    Spin,
    Result,
    Button,
    Steps,
    Space,
    Alert,
    Progress,
    Statistic
} from 'antd';
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    LoadingOutlined,
    DollarOutlined,
    CreditCardOutlined,
    ShoppingOutlined,
    ArrowLeftOutlined,
    ExclamationCircleOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { paypalCapture } from '../../services/paymentService';

const { Title, Text } = Typography;
const { Step } = Steps;

interface PaymentStatus {
    status: 'processing' | 'success' | 'failed' | 'cancelled';
    message: string;
    orderId?: string;
    transactionId?: string;
    errorCode?: string;
}

const PaymentCapturePage: React.FC = () => {
    const navigate = useNavigate();
    const { pay_token } = useParams();
    const [searchParams] = useSearchParams();
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({
        status: 'processing',
        message: 'Đang xử lý thanh toán...'
    });
    const [progress, setProgress] = useState(0);
    const [countdown, setCountdown] = useState(5);

    const orderPaypalToken = searchParams.get('token');
    const [orderId, setOrderId] = useState("");
    const paymentMethod = searchParams.get('method') || 'credit';

    useEffect(() => {
        simulatePaymentProcessing();
    }, []);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;

        if (paymentStatus.status === 'processing') {
            // Progress animation
            timer = setTimeout(() => {
                setProgress(prev => {
                    if (prev >= 90) return 90;
                    return prev + 10;
                });
            }, 500);
        } else if (paymentStatus.status === 'success') {
            // Countdown for success
            timer = setTimeout(() => {
                if (countdown > 0) {
                    setCountdown(prev => prev - 1);
                } else {
                    navigateToOrderDetail();
                }
            }, 1000);
        }

        return () => clearTimeout(timer);
    }, [paymentStatus.status, countdown]);


    const simulatePaymentProcessing = async () => {
        try {
            // Step 1: Validating payment information
            setPaymentStatus({
                status: 'processing',
                message: 'Đang xác thực thông tin thanh toán...'
            });
            await delay(1500);

            // Step 2: Processing payment
            setPaymentStatus({
                status: 'processing',
                message: 'Đang xử lý thanh toán với ngân hàng...'
            });
            await delay(2000);
            paypalCapture(pay_token || "", orderPaypalToken || "").then(res => {
                if (res.status == "PAID") {
                    setOrderId(res.order_id);

                    setPaymentStatus({
                        status: 'processing',
                        message: 'Đang hoàn tất giao dịch...'
                    });
                    const isSuccess = Math.random() > 0.1;

                    if (isSuccess) {
                        setPaymentStatus({
                            status: 'success',
                            message: 'Thanh toán thành công!',
                            orderId: orderId || '12345',
                            transactionId: generateTransactionId()
                        });
                        setProgress(100);
                        // Xóa giỏ hàng sau khi thanh toán thành công
                        localStorage.removeItem("cart");
                    } else {
                        setPaymentStatus({
                            status: 'failed',
                            message: 'Thanh toán thất bại',
                            errorCode: 'PAYMENT_DECLINED'
                        });
                    }
                }
            }).catch(() => { })



        } catch (error) {
            setPaymentStatus({
                status: 'failed',
                message: 'Có lỗi xảy ra trong quá trình thanh toán',
                errorCode: 'SYSTEM_ERROR'
            });
        }
    };

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const generateTransactionId = () => {
        return 'TXN' + Date.now().toString() + Math.random().toString(36).substr(2, 9).toUpperCase();
    };

    const navigateToOrderDetail = () => {
        if (orderId) {
            navigate(`/order-info/${orderId}`);
        }
    };

    const navigateToPaymentPage = () => {
        navigate(`/payment/${orderId}`);
    };

    const navigateToHome = () => {
        navigate('/');
    };

    const getPaymentMethodIcon = (method: string) => {
        switch (method) {
            case 'credit':
                return <CreditCardOutlined />;
            case 'bank':
                return <ShoppingOutlined />;
            case 'paypal':
                return <CreditCardOutlined />;
            case 'cod':
                return <DollarOutlined />;
            default:
                return <CreditCardOutlined />;
        }
    };

    const getPaymentMethodName = (method: string) => {
        switch (method) {
            case 'credit':
                return 'Thẻ tín dụng/ghi nợ';
            case 'bank':
                return 'Chuyển khoản ngân hàng';
            case 'paypal':
                return 'PayPal';
            case 'cod':
                return 'Thanh toán khi nhận hàng';
            default:
                return 'Thẻ tín dụng';
        }
    };

    const getErrorDescription = (errorCode?: string) => {
        switch (errorCode) {
            case 'PAYMENT_DECLINED':
                return 'Ngân hàng của bạn đã từ chối giao dịch. Vui lòng kiểm tra lại thông tin thẻ hoặc số dư tài khoản.';
            case 'INSUFFICIENT_FUNDS':
                return 'Tài khoản của bạn không đủ số dư để thực hiện giao dịch.';
            case 'INVALID_CARD':
                return 'Thông tin thẻ không hợp lệ. Vui lòng kiểm tra lại.';
            case 'TIMEOUT':
                return 'Quá thời gian chờ phản hồi từ ngân hàng. Vui lòng thử lại.';
            case 'SYSTEM_ERROR':
                return 'Hệ thống đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.';
            default:
                return 'Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại.';
        }
    };

    // Render different content based on payment status
    const renderContent = () => {
        switch (paymentStatus.status) {
            case 'processing':
                return renderProcessing();
            case 'success':
                return renderSuccess();
            case 'failed':
                return renderFailed();
            default:
                return renderProcessing();
        }
    };

    const renderProcessing = () => (
        <div className="text-center">
            <Spin
                indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
                className="mb-6"
            />
            <Title level={3} className="mb-4">Đang xử lý thanh toán</Title>
            <Text type="secondary" className="text-lg block mb-6">
                {paymentStatus.message}
            </Text>

            <Progress
                percent={progress}
                status="active"
                strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                }}
                className="max-w-md mx-auto mb-8"
            />

            <Alert
                style={{ margin: "50px auto" }}
                message="Vui lòng không đóng trang này"
                description="Quá trình thanh toán có thể mất từ 30 giây đến 2 phút. Xin vui lòng chờ trong giây lát."
                type="info"
                showIcon
                className="max-w-md mx-auto"
            />

            <div className="mt-8 space-y-4">
                {orderId && (
                    <Statistic title="Mã đơn hàng" value={orderId} />
                )}
            </div>
        </div>
    );

    const renderSuccess = () => (
        <Result
            icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            title="Thanh toán thành công!"
            subTitle={
                <Space direction="vertical" size="middle">
                    <Text>Đơn hàng của bạn đã được thanh toán thành công.</Text>
                    <div className="space-y-2">
                        {paymentStatus.orderId && (
                            <Text strong>Mã đơn hàng: {paymentStatus.orderId}</Text>
                        )}
                        {paymentStatus.transactionId && (
                            <Text strong>
                                Mã giao dịch: {paymentStatus.transactionId}
                            </Text>
                        )}
                    </div>
                    <Alert
                        message={`Tự động chuyển hướng đến trang đơn hàng sau ${countdown} giây...`}
                        type="info"
                        showIcon
                    />
                </Space>
            }
            extra={[
                <Button
                    key="detail"
                    type="primary"
                    size="large"
                    onClick={navigateToOrderDetail}
                >
                    Xem đơn hàng ngay
                </Button>,
                <Button
                    key="home"
                    size="large"
                    onClick={navigateToHome}
                >
                    Về trang chủ
                </Button>,
            ]}
        />
    );

    const renderFailed = () => (
        <Result
            icon={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
            title="Thanh toán thất bại"
            subTitle={
                <Space direction="vertical" size="middle">
                    <Text>{paymentStatus.message}</Text>
                    <Alert
                        message={getErrorDescription(paymentStatus.errorCode)}
                        type="error"
                        showIcon
                    />
                    <div className="space-y-2">
                        {orderId && (
                            <Text strong>Mã đơn hàng: {orderId}</Text>
                        )}
                        <Text type="secondary">
                            Đơn hàng của bạn vẫn được giữ lại. Bạn có thể thử thanh toán lại.
                        </Text>
                    </div>
                </Space>
            }
            extra={[
                <Button
                    key="retry"
                    type="primary"
                    danger
                    size="large"
                    onClick={navigateToPaymentPage}
                    icon={<ExclamationCircleOutlined />}
                >
                    Thử thanh toán lại
                </Button>,
                <Button
                    key="back"
                    size="large"
                    onClick={() => navigate('/cart')}
                    icon={<ArrowLeftOutlined />}
                >
                    Quay lại giỏ hàng
                </Button>,
                <Button
                    key="home"
                    size="large"
                    onClick={navigateToHome}
                >
                    Về trang chủ
                </Button>,
            ]}
        />
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <Card className="shadow-lg">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <Title level={2}>
                            <DollarOutlined className="mr-3" />
                            Xử lý thanh toán
                        </Title>
                    </div>

                    {/* Progress Steps */}
                    <div className="mb-12">
                        <Steps
                            current={paymentStatus.status === 'processing' ? 1 : paymentStatus.status === 'success' ? 2 : 0}
                            status={paymentStatus.status === 'failed' ? 'error' : 'process'}
                        >
                            <Step title="Thông tin" description="Nhập thông tin thanh toán" />
                            <Step
                                title="Xử lý"
                                description="Đang giao dịch với ngân hàng"
                                icon={paymentStatus.status === 'processing' ? <LoadingOutlined /> : undefined}
                            />
                            <Step title="Hoàn tất" description="Kết quả thanh toán" />
                        </Steps>
                    </div>

                    {/* Main Content */}
                    <div className="py-8">
                        {renderContent()}
                    </div>

                    {/* Footer Information */}
                    <div className="border-t pt-6 mt-8">
                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={8}>
                                <div className="text-center">
                                    <SecurityOutlined className="text-2xl text-green-500 mb-2" />
                                    <Text strong>Bảo mật</Text>
                                    <Text type="secondary" className="text-sm">
                                        Giao dịch được bảo mật SSL 256-bit
                                    </Text>
                                </div>
                            </Col>
                            <Col xs={24} md={8}>
                                <div className="text-center">
                                    <ClockCircleOutlined className="text-2xl text-blue-500 mb-2" />
                                    <Text strong>24/7 Hỗ trợ</Text>
                                    <Text type="secondary" className="text-sm">
                                        Hỗ trợ khách hàng 24/7
                                    </Text>
                                </div>
                            </Col>
                            <Col xs={24} md={8}>
                                <div className="text-center">
                                    <CheckCircleOutlined className="text-2xl text-green-500 mb-2" />
                                    <Text strong>Đảm bảo</Text>
                                    <Text type="secondary" className="text-sm">
                                        Hoàn tiền 100% nếu có lỗi
                                    </Text>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Card>

                {/* Contact Support */}
                {paymentStatus.status === 'processing' && (
                    <Alert
                        message="Cần hỗ trợ?"
                        description="Nếu quá trình xử lý mất nhiều thời gian hơn dự kiến, vui lòng liên hệ bộ phận hỗ trợ khách hàng của chúng tôi."
                        type="info"
                        showIcon
                        className="mt-6"
                        action={
                            <Button size="small" type="primary">
                                Liên hệ ngay
                            </Button>
                        }
                    />
                )}
            </div>
        </div>
    );
};

// Add missing icon component
const SecurityOutlined: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
        <path d="M866.9 169.9L527.1 54.1C523 52.7 517.5 52 512 52s-11 .7-15.1 2.1L157.1 169.9c-8.3 2.8-15.1 12.4-15.1 21.2v482.4c0 8.8 5.7 20.4 12.6 25.9L499.3 968c3.5 2.7 8 4.1 12.6 4.1s9.2-1.4 12.6-4.1l344.7-268.6c6.9-5.4 12.6-17 12.6-25.9V191.1c.2-8.8-6.6-18.3-14.9-21.2zM810 654.3L512 886.5 214 654.3V226.7l298-101.6 298 101.6v427.6z" />
        <path d="M402.9 528.8l-77.5 77.5c-3.1 3.1-3.1 8.2 0 11.3l34 34c3.1 3.1 8.2 3.1 11.3 0L446 585.3c3.1-3.1 3.1-8.2 0-11.3l-34-34c-3.1-3.1-8.2-3.1-11.3 0zm283.8-283.8l-11.3 11.3c-3.1 3.1-3.1 8.2 0 11.3l28.3 28.3c3.1 3.1 8.2 3.1 11.3 0l11.3-11.3c3.1-3.1 3.1-8.2 0-11.3l-28.3-28.3c-3.1-3.1-8.2-3.1-11.3 0zm-223.8 0c-3.1-3.1-8.2-3.1-11.3 0l-11.3 11.3c-3.1 3.1-3.1 8.2 0 11.3l28.3 28.3c3.1 3.1 8.2 3.1 11.3 0l11.3-11.3c3.1-3.1 3.1-8.2 0-11.3l-28.3-28.3z" />
    </svg>
);

export default PaymentCapturePage;