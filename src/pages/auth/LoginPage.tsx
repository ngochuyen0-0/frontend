import React, { useEffect, useState } from "react";
import { Form, Input, Button, Card, Tabs, message, Divider, Space } from "antd";
import {
    UserOutlined,
    LockOutlined,
    MailOutlined,
    GoogleOutlined,
    FacebookOutlined,
} from "@ant-design/icons";
import type { TabsProps } from "antd";
import { useAuthStore } from "../../store/useAuthStore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const [loginFrm] = Form.useForm();
    const [registerFrm] = Form.useForm();

    const { sendVerifyEmail, loginUser } = useAuthStore();

    function base64UrlDecode(str) {
        str = str.replace(/-/g, "+").replace(/_/g, "/");
        const pad = str.length % 4;
        if (pad) {
            str += "=".repeat(4 - pad);
        }
        return atob(str);
    }

    function decodeJwtPayload(token) {
        try {
            const parts = token.split(".");
            if (parts.length !== 3) throw new Error("Invalid JWT format");
            const payload = JSON.parse(base64UrlDecode(parts[1]));
            return payload;
        } catch (err) {
            console.error("JWT decode error:", err);
            return null;
        }
    }

    const onLoginFinish = async (values: any) => {
        setLoading(true);
        try {
            // Xử lý login logic ở đây
            console.log("Login values:", values);
            const res = await loginUser(values.email, values.password);
            console.log("res auth:", res);

            const decode = decodeJwtPayload(res.access_token);
            console.log("payload: ", decode);

            toast.success("Đăng nhập thành công!");
            if (decode.role === "ADMIN") {
                navigate('/admin/v1/dashboard')
            } else {
                navigate("/");
            }
        } catch (error) {
            message.error("Đăng nhập thất bại!");
        } finally {
            setLoading(false);
        }
    };

    const onRegisterFinish = async (values: any) => {
        setLoading(true);
        try {
            // Xử lý register logic ở đây
            console.log("Register values:", values);
            const res = await sendVerifyEmail(values.email);
            console.log("API response from sendVerifyEmail:", res);
            if (res.status === "success") {
                toast.success(
                    "🎉 Đăng ký thành công! Vui lòng kiểm tra email của bạn để xác thực tài khoản trước khi đăng nhập."
                );

                registerFrm.resetFields();
            } else {
                toast.error(res.error);
            }
            // console.log(values.email);
        } catch (error) {
            toast.error("Đăng ký thất bại!");
        } finally {
            setLoading(false);
        }
    };

    const loginForm = (
        <Form
            form={loginFrm}
            name="login"
            onFinish={onLoginFinish}
            autoComplete="off"
            layout="vertical"
        >
            <Form.Item
                label="Email"
                name="email"
                rules={[
                    { required: true, message: "Vui lòng nhập email!" },
                    { type: "email", message: "Email không hợp lệ!" },
                ]}
            >
                <Input
                    prefix={<MailOutlined />}
                    placeholder="Nhập email của bạn"
                    size="large"
                />
            </Form.Item>

            <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
                <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Nhập mật khẩu"
                    size="large"
                />
            </Form.Item>

            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    block
                    size="large"
                >
                    Đăng nhập
                </Button>
            </Form.Item>
        </Form>
    );

    const registerForm = (
        <Form
            form={registerFrm}
            name="register"
            onFinish={onRegisterFinish}
            autoComplete="off"
            layout="vertical"
        >
            <Form.Item
                label="Tên đăng nhập"
                name="fullName"
                rules={[
                    { required: true, message: "Vui lòng nhập tên đăng nhập!" },
                ]}
            >
                <Input
                    prefix={<UserOutlined />}
                    placeholder="Tên đăng nhập"
                    size="large"
                />
            </Form.Item>

            <Form.Item
                label="Email"
                name="email"
                rules={[
                    { required: true, message: "Vui lòng nhập email!" },
                    { type: "email", message: "Email không hợp lệ!" },
                ]}
            >
                <Input
                    prefix={<MailOutlined />}
                    placeholder="Nhập email của bạn"
                    size="large"
                />
            </Form.Item>

            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    block
                    size="large"
                >
                    Đăng ký
                </Button>
            </Form.Item>
        </Form>
    );

    const tabItems: TabsProps["items"] = [
        {
            key: "login",
            label: "Đăng nhập",
            children: loginForm,
        },
        {
            key: "register",
            label: "Đăng ký",
            children: registerForm,
        },
    ];

    return (
        <>
            <Card
                style={{
                    width: 600,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                    borderRadius: "12px",
                }}
                bodyStyle={{ padding: "32px" }}
            >
                <div className="flex justify-center mb-6">
                    <img
                        src="../../../public/logo/logo_auth.png"
                        alt=""
                        width={100}
                    />
                </div>

                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                    <h1
                        style={{
                            color: "#1890ff",
                            marginBottom: "8px",
                            fontSize: "1.8rem",
                        }}
                    >
                        Welcome to HAPAS Store
                    </h1>
                    <p style={{ color: "#666" }}>
                        Đăng nhập hoặc đăng ký tài khoản
                    </p>
                </div>

                <Tabs defaultActiveKey="login" items={tabItems} centered />

                <Divider>Hoặc đăng nhập với</Divider>

                <Space
                    direction="vertical"
                    style={{ width: "100%" }}
                    size="middle"
                >
                    <Button
                        icon={<GoogleOutlined />}
                        block
                        size="large"
                        style={{
                            borderColor: "#db4437",
                            color: "#db4437",
                        }}
                    >
                        Google
                    </Button>
                    <Button
                        icon={<FacebookOutlined />}
                        block
                        size="large"
                        style={{
                            borderColor: "#4267B2",
                            color: "#4267B2",
                        }}
                    >
                        Facebook
                    </Button>
                </Space>
            </Card>
        </>
    );
};

export default LoginPage;
