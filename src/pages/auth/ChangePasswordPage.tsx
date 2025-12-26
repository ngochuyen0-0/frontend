// pages/ChangePasswordPage.tsx
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    Card,
    Form,
    Input,
    Button,
    Typography,
    Space,
    Alert,
    Divider,
    Row,
    Col,
} from "antd";
import {
    LockOutlined,
    SafetyCertificateOutlined,
    CheckCircleOutlined,
    ArrowLeftOutlined,
} from "@ant-design/icons";
import { useAuthStore } from "../../store/useAuthStore";
import { toast } from "sonner";

const { Title, Text, Paragraph } = Typography;
const { Password } = Input;

const ChangePasswordPage: React.FC = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const { verifyData, clearVerifyData, changePassword } = useAuthStore();

    // Lấy email từ URL params (nếu có)
    const email = searchParams.get("email");

    const onFinish = async (values: any) => {
        if (!verifyData) {
            toast.error("Không tìm thấy thông tin xác thực");
            return;
        }
        setLoading(true);
        try {
            const result = await changePassword({
                email: verifyData.email,
                username: verifyData.username,
                newPassword: values.newPassword,
                token: verifyData.access_token
            });
            if (result.username) {
                setSuccess(true);
                // Tự động chuyển hướng sau 3 giây
                toast.success("Đặt mật khẩu thành công! Chuyển đến trang đăng nhập...");
                setTimeout(() => {
                    navigate("/auth/login");
                }, 3000);
            } else {
                toast.error(result.error || "Đặt mật khẩu thất bại");
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra khi đặt mật khẩu");
        } finally {
            setLoading(false);
        }
    };

    const handleGoToLogin = () => {
        navigate("/auth/login");
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    // Password strength validator
    const validatePassword = (_: any, value: string) => {
        if (!value) {
            return Promise.reject(new Error("Vui lòng nhập mật khẩu!"));
        }

        if (value.length < 6) {
            return Promise.reject(
                new Error("Mật khẩu phải có ít nhất 6 ký tự!")
            );
        }

        // Check password strength
        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumbers = /\d/.test(value);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

        if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
            return Promise.reject(
                new Error("Mật khẩu nên có chữ hoa, chữ thường và số!")
            );
        }

        return Promise.resolve();
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 px-4">
                <Card
                    style={{
                        width: 480,
                        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                        borderRadius: "16px",
                    }}
                    bodyStyle={{ padding: "48px" }}
                >
                    <div className="text-center">
                        {/* Logo */}
                        <div className="flex justify-center mb-8">
                            <img
                                src="../../../public/logo/logo_auth.png"
                                alt="Tadidas Store"
                                width={80}
                            />
                        </div>

                        {/* Success Icon */}
                        <div className="mb-6">
                            <CheckCircleOutlined
                                style={{ fontSize: 80, color: "#52c41a" }}
                            />
                        </div>

                        {/* Title */}
                        <Title
                            level={2}
                            style={{ color: "#52c41a", marginBottom: 16 }}
                        >
                            Đổi Mật Khẩu Thành Công!
                        </Title>

                        {/* Message */}
                        <Paragraph
                            style={{
                                color: "#666",
                                marginBottom: 32,
                                fontSize: "16px",
                            }}
                        >
                            Mật khẩu của bạn đã được đặt thành công. Bạn sẽ
                            được chuyển đến trang đăng nhập sau 3 giây.
                        </Paragraph>

                        {/* Action Button */}
                        <Button
                            type="primary"
                            size="large"
                            onClick={handleGoToLogin}
                            style={{
                                height: "48px",
                                fontSize: "16px",
                                borderRadius: "8px",
                                width: "100%",
                            }}
                        >
                            Đăng Nhập Ngay
                        </Button>

                        {/* Security Tip */}
                        <div
                            style={{
                                marginTop: 24,
                                padding: 16,
                                backgroundColor: "#f6ffed",
                                borderRadius: "8px",
                            }}
                        >
                            <Text type="secondary">
                                🔒 <strong>Mẹo bảo mật:</strong> Không chia sẻ
                                mật khẩu với ai và thay đổi mật khẩu định kỳ.
                            </Text>
                        </div>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 px-4">
            <Card
                style={{
                    width: 520,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                    borderRadius: "16px",
                }}
                bodyStyle={{ padding: "48px" }}
            >
                <div className="text-center">
                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <img
                            src="../../../public/logo/logo_auth.png"
                            alt="Tadidas Store"
                            width={80}
                        />
                    </div>

                    {/* Header */}
                    <div className="mb-8">
                        <SafetyCertificateOutlined
                            style={{
                                fontSize: 48,
                                color: "#1890ff",
                                marginBottom: 16,
                            }}
                        />
                        <Title
                            level={2}
                            style={{ color: "#1890ff", marginBottom: 8 }}
                        >
                            Đặt Lại Mật Khẩu
                        </Title>
                        <Text type="secondary" style={{ fontSize: "16px" }}>
                            Vui lòng tạo mật khẩu mới cho tài khoản của bạn
                        </Text>
                    </div>

                    {/* Info Alert */}
                    {email && (
                        <Alert
                            message={
                                <Space direction="vertical" size={2}>
                                    <Text strong>📧 Tài khoản: {email}</Text>
                                    <Text type="secondary">
                                        Vui lòng tạo mật khẩu mới để bảo mật tài
                                        khoản
                                    </Text>
                                </Space>
                            }
                            type="info"
                            showIcon
                            style={{
                                marginBottom: 24,
                                borderRadius: "8px",
                                textAlign: "left",
                            }}
                        />
                    )}

                    {/* Password Form */}
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        requiredMark={false}
                        size="large"
                    >
                        <Row gutter={[16, 0]}>
                            <Col span={24}>
                                <Form.Item
                                    label="Mật khẩu mới"
                                    name="newPassword"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Vui lòng nhập mật khẩu mới!",
                                        },
                                        { validator: validatePassword },
                                    ]}
                                    hasFeedback
                                >
                                    <Password
                                        prefix={<LockOutlined />}
                                        placeholder="Nhập mật khẩu mới"
                                        style={{
                                            height: "48px",
                                            borderRadius: "8px",
                                        }}
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={24}>
                                <Form.Item
                                    label="Xác nhận mật khẩu mới"
                                    name="confirmPassword"
                                    dependencies={["newPassword"]}
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Vui lòng xác nhận mật khẩu!",
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (
                                                    !value ||
                                                    getFieldValue(
                                                        "newPassword"
                                                    ) === value
                                                ) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(
                                                    new Error(
                                                        "Mật khẩu xác nhận không khớp!"
                                                    )
                                                );
                                            },
                                        }),
                                    ]}
                                    hasFeedback
                                >
                                    <Password
                                        prefix={<LockOutlined />}
                                        placeholder="Xác nhận mật khẩu mới"
                                        style={{
                                            height: "48px",
                                            borderRadius: "8px",
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        {/* Password Requirements */}
                        <div
                            style={{
                                backgroundColor: "#f8f9fa",
                                padding: "16px",
                                borderRadius: "8px",
                                marginBottom: "24px",
                                textAlign: "left",
                            }}
                        >
                            <Text
                                strong
                                style={{
                                    display: "block",
                                    marginBottom: "8px",
                                }}
                            >
                                🔐 Yêu cầu mật khẩu:
                            </Text>
                            <ul
                                style={{
                                    color: "#666",
                                    margin: 0,
                                    paddingLeft: "20px",
                                }}
                            >
                                <li>Ít nhất 6 ký tự</li>
                                <li>Chứa cả chữ hoa và chữ thường</li>
                                <li>Chứa ít nhất một số</li>
                                <li>Có thể chứa ký tự đặc biệt</li>
                            </ul>
                        </div>

                        {/* Submit Button */}
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                block
                                style={{
                                    height: "48px",
                                    fontSize: "16px",
                                    borderRadius: "8px",
                                    marginBottom: "16px",
                                }}
                            >
                                {loading ? "Đang xử lý..." : "Đổi Mật Khẩu"}
                            </Button>
                        </Form.Item>
                    </Form>

                    <Divider plain>hoặc</Divider>

                    {/* Action Links */}
                    <Space direction="vertical" style={{ width: "100%" }}>
                        <Button
                            type="link"
                            icon={<ArrowLeftOutlined />}
                            onClick={handleGoBack}
                            style={{ fontSize: "16px" }}
                        >
                            Quay lại trang trước
                        </Button>

                        <Button
                            type="text"
                            onClick={handleGoToLogin}
                            style={{ fontSize: "16px" }}
                        >
                            Đã có mật khẩu? Đăng nhập ngay
                        </Button>
                    </Space>

                    {/* Security Notice */}
                    <div
                        style={{
                            marginTop: "32px",
                            paddingTop: "16px",
                            borderTop: "1px solid #f0f0f0",
                        }}
                    >
                        <Text type="secondary" style={{ fontSize: "14px" }}>
                            💡 <strong>Lưu ý bảo mật:</strong> Mật khẩu của bạn
                            được mã hóa và bảo vệ an toàn.
                        </Text>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ChangePasswordPage;
