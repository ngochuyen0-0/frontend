// pages/VerifyEmailPage.tsx
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Spin, Alert, Typography, Space } from "antd";
import {
    CheckCircleFilled,
    CloseCircleFilled,
    MailOutlined,
    ArrowLeftOutlined,
    ReloadOutlined,
} from "@ant-design/icons";
import { useAuthStore } from "../../store/useAuthStore";
import { setTokenCookie } from "../../services/accountService";

const { Title, Text, Paragraph } = Typography;

const VerifyEmailPage: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const [verificationStatus, setVerificationStatus] = useState<
        "loading" | "success" | "error"
    >("loading");
    const [message, setMessage] = useState("");
    const { verifyEmail, setVerifyData } = useAuthStore();

    const hasVerifiedRef = useRef(false);

    useEffect(() => {
        // Chỉ gọi API nếu chưa gọi và có token
        if (token && !hasVerifiedRef.current) {
            hasVerifiedRef.current = true;
            verifyEmailToken();
        }
    }, [token]);

    const verifyEmailToken = async () => {
        if (!token) {
            setVerificationStatus("error");
            setMessage("Liên kết xác thực không hợp lệ");
            return;
        }

        try {
            const response = await verifyEmail(token);
            console.log("response verify: ", response);

            if (response.status === "success") {
                setVerificationStatus("success");
                setMessage(
                    response.message ||
                        "Email của bạn đã được xác thực thành công!"
                );

                const { access_token, email, user_name } = response.data;
                setVerifyData({
                    access_token: access_token,
                    email: email,
                    username: user_name,
                });

                setTimeout(() => {
                    setTokenCookie(token, 15);
                    navigate("/auth/change-password");
                }, 5000);
            } else {
                setVerificationStatus("error");
                setMessage(
                    response.error ||
                        "Xác thực email thất bại. Vui lòng thử lại."
                );
            }
        } catch (error) {
            setVerificationStatus("error");
            setMessage(
                "Có lỗi xảy ra khi xác thực email. Vui lòng thử lại sau."
            );
        }
    };

    const handleGoToLogin = () => {
        navigate("/auth/login");
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleRetry = () => {
        setVerificationStatus("loading");
        setTimeout(() => {
            verifyEmailToken();
        }, 1000);
    };

    if (verificationStatus === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 px-4">
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

                        {/* Loading Animation */}
                        <div className="mb-6">
                            <Spin size="large" />
                        </div>

                        <Title
                            level={3}
                            style={{ color: "#1890ff", marginBottom: 8 }}
                        >
                            Đang xác thực email...
                        </Title>
                        <Text type="secondary">
                            Vui lòng chờ trong giây lát
                        </Text>

                        <div className="mt-8">
                            <Button
                                type="link"
                                icon={<ArrowLeftOutlined />}
                                onClick={handleGoBack}
                            >
                                Quay lại
                            </Button>
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

                    {/* Status Icon */}
                    <div className="mb-6">
                        {verificationStatus === "success" ? (
                            <CheckCircleFilled
                                style={{
                                    fontSize: 80,
                                    color: "#52c41a",
                                }}
                            />
                        ) : (
                            <CloseCircleFilled
                                style={{
                                    fontSize: 80,
                                    color: "#ff4d4f",
                                }}
                            />
                        )}
                    </div>

                    {/* Title */}
                    <Title
                        level={2}
                        style={{
                            color:
                                verificationStatus === "success"
                                    ? "#52c41a"
                                    : "#ff4d4f",
                            marginBottom: 16,
                        }}
                    >
                        {verificationStatus === "success"
                            ? "Xác Thực Thành Công!"
                            : "Xác Thực Thất Bại"}
                    </Title>

                    {/* Message */}
                    <Paragraph
                        style={{
                            fontSize: "16px",
                            color: "#666",
                            lineHeight: 1.6,
                            marginBottom: 32,
                        }}
                    >
                        {message}
                    </Paragraph>

                    {/* Additional Info for Success */}
                    {verificationStatus === "success" && (
                        <Alert
                            message={
                                <Space direction="vertical" size={2}>
                                    <Text strong>
                                        🎉 Chào mừng đến với Tadidas Store!
                                    </Text>
                                    <Text type="secondary">
                                        Bạn sẽ được chuyển hướng tự động đến
                                        trang đăng nhập sau 5 giây
                                    </Text>
                                </Space>
                            }
                            type="success"
                            showIcon
                            style={{
                                marginBottom: 32,
                                borderRadius: "8px",
                                textAlign: "left",
                            }}
                        />
                    )}

                    {/* Additional Info for Error */}
                    {verificationStatus === "error" && (
                        <Alert
                            message={
                                <Space direction="vertical" size={2}>
                                    <Text strong>💡 Gợi ý:</Text>
                                    <Text type="secondary">
                                        • Kiểm tra lại liên kết trong email
                                        <br />
                                        • Liên kết có thể đã hết hạn (15 phút)
                                        <br />• Thử gửi lại email xác thực
                                    </Text>
                                </Space>
                            }
                            type="info"
                            showIcon
                            style={{
                                marginBottom: 32,
                                borderRadius: "8px",
                                textAlign: "left",
                            }}
                        />
                    )}

                    {/* Action Buttons */}
                    <Space
                        direction="vertical"
                        style={{ width: "100%" }}
                        size="middle"
                    >
                        {verificationStatus === "success" ? (
                            <Button
                                type="primary"
                                size="large"
                                block
                                onClick={handleGoToLogin}
                                style={{
                                    height: "48px",
                                    fontSize: "16px",
                                    borderRadius: "8px",
                                }}
                            >
                                Đăng Nhập Ngay
                            </Button>
                        ) : (
                            <>
                                <Button
                                    type="primary"
                                    size="large"
                                    block
                                    icon={<ReloadOutlined />}
                                    onClick={handleRetry}
                                    style={{
                                        height: "48px",
                                        fontSize: "16px",
                                        borderRadius: "8px",
                                    }}
                                >
                                    Thử Lại
                                </Button>
                                <Button
                                    size="large"
                                    block
                                    onClick={handleGoToLogin}
                                    style={{
                                        height: "48px",
                                        fontSize: "16px",
                                        borderRadius: "8px",
                                    }}
                                >
                                    Quay Về Đăng Nhập
                                </Button>
                            </>
                        )}

                        {/* Back Button */}
                        <Button
                            type="link"
                            icon={<ArrowLeftOutlined />}
                            onClick={handleGoBack}
                            style={{ marginTop: 16 }}
                        >
                            Quay lại trang trước
                        </Button>
                    </Space>

                    {/* Footer Text */}
                    <div
                        style={{
                            marginTop: 32,
                            paddingTop: 16,
                            borderTop: "1px solid #f0f0f0",
                        }}
                    >
                        <Text type="secondary">
                            Cần hỗ trợ? Liên hệ{" "}
                            <Text strong style={{ color: "#1890ff" }}>
                                support@tadidas.com
                            </Text>
                        </Text>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default VerifyEmailPage;
