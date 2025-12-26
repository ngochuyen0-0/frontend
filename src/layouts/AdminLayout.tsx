import {
    DashboardOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    OrderedListOutlined,
    ProfileOutlined,
    SettingOutlined,
    ShoppingOutlined,
    TagOutlined,
    UserOutlined,
} from "@ant-design/icons";
import {
    Avatar,
    Breadcrumb,
    Button,
    Dropdown,
    Layout,
    Menu,
    Space,
    theme,
} from "antd";
import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;

const AdminLayout: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    // Menu items
    const menuItems = [
        {
            key: "/admin/v1/dashboard",
            icon: <DashboardOutlined />,
            label: "Dashboard",
        },
        {
            key: "/admin/v1/products",
            icon: <ShoppingOutlined />,
            label: "Sản phẩm",
        },
        {
            key: "/admin/v1/orders",
            icon: <OrderedListOutlined />,
            label: "Đơn hàng",
        },
        {
            key: "/admin/v1/users",
            icon: <UserOutlined />,
            label: "Người dùng",
        },
        {
            key: "/admin/v1/categories",
            icon: <TagOutlined />,
            label: "Danh mục",
        },
        {
            key: "/admin/v1/brands",
            icon: <TagOutlined />,
            label: "Thương hiệu",
        },
        {
            key: "/admin/v1/settings",
            icon: <SettingOutlined />,
            label: "Cài đặt",
        },
    ];

    // User dropdown menu
    const userMenuItems = [
        {
            key: "profile",
            icon: <ProfileOutlined />,
            label: "Hồ sơ",
            onClick: () => navigate('/admin/v1/profile')
            
        },
        {
            key: "logout",
            icon: <LogoutOutlined />,
            label: "Đăng xuất",
            danger: true,
        },
    ];

    // Breadcrumb items based on current route
    const getBreadcrumbItems = () => {
        const pathSnippets = location.pathname.split("/").filter((i) => i);
        const breadcrumbItems = [
            <Breadcrumb.Item key="home">
                <DashboardOutlined />
                <span>Admin</span>
            </Breadcrumb.Item>,
        ];

        pathSnippets.forEach((_, index) => {
            const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
            const isLast = index === pathSnippets.length - 1;

            const menuItem = menuItems.find((item) => item.key === url);
            if (menuItem) {
                breadcrumbItems.push(
                    <Breadcrumb.Item key={url}>
                        {isLast ? (
                            menuItem.label
                        ) : (
                            <a href={url}>{menuItem.label}</a>
                        )}
                    </Breadcrumb.Item>
                );
            }
        });

        return breadcrumbItems;
    };

    return (
        <Layout style={{ minHeight: "100vh" }}>
            {/* Sidebar */}
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                theme="dark"
                width={250}
                style={{
                    overflow: "auto",
                    height: "100vh",
                    position: "sticky",
                    insetInlineStart: 0,
                    top: 0,
                    bottom: 0,
                    scrollbarWidth: "thin",
                    scrollbarGutter: "stable",
                }}
            >
                <div className="p-4 text-white text-center border-b border-gray-700">
                    <h1
                        className={`font-bold text-xl ${
                            collapsed ? "text-lg" : "text-xl"
                        }`}
                    >
                        {collapsed ? "A" : "Admin Panel"}
                    </h1>
                </div>

                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    onClick={({ key }) => (window.location.href = key)}
                />
            </Sider>

            <Layout>
                {/* Header */}
                <Header
                    style={{
                        padding: "0 16px",
                        background: colorBgContainer,
                        display: "flex",
                        alignItems: "center",
                        position: "sticky",
                        top: 0,
                        zIndex: 2,
                        justifyContent: "space-between",
                        boxShadow: "0 1px 4px rgba(0,21,41,.08)",
                    }}
                >
                    <div className="flex items-center">
                        <Button
                            type="text"
                            icon={
                                collapsed ? (
                                    <MenuUnfoldOutlined />
                                ) : (
                                    <MenuFoldOutlined />
                                )
                            }
                            onClick={() => setCollapsed(!collapsed)}
                            style={{ fontSize: "16px", width: 64, height: 64 }}
                        />

                        <Breadcrumb style={{ margin: "0 16px" }}>
                            {getBreadcrumbItems()}
                        </Breadcrumb>
                    </div>

                    <Space>
                        <Dropdown
                            menu={{
                                items: userMenuItems,
                                onClick: ({ key }) => {
                                    if (key === "logout") {
                                        // Handle logout
                                        console.log("Logout");
                                    }
                                },
                            }}
                            placement="bottomRight"
                            arrow
                        >
                            <Button
                                type="text"
                                className="flex items-center gap-2"
                            >
                                <Avatar size="small" icon={<UserOutlined />} />
                                <span>Admin User</span>
                            </Button>
                        </Dropdown>
                    </Space>
                </Header>

                {/* Main Content */}
                <Content
                    style={{
                        margin: "24px 16px",
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;
