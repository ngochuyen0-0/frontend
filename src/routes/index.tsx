import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
    useLocation,
} from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import HomePage from "../pages/home/HomePage";
import ProductDetailsPage from "../pages/home/ProductDetailsPage";
import ShoppingCartPage from "../pages/home/ShoppingCartPage";
import LoginPage from "../pages/auth/LoginPage";
import { AuthLayout } from "../layouts/AuthLayout";
import SearchPage from "../pages/home/SearchPage";
import WishlistPage from "../pages/home/WishlistPage";
import CheckoutPage from "../pages/home/CheckoutPage";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminProducts from "../pages/admin/AdminProducts";
import AdminOrders from "../pages/admin/AdminOrders";
import AdminBrands from "../pages/admin/AdminBrands";
import AdminCategories from "../pages/admin/AdminCategories";
import ProductAddPage from "../pages/admin/products/AddProducts";
import BlogPage from "../pages/home/BlogPage";
import BlogDetailPage from "../pages/home/BlogDetailPage";
import AdminUsers from "../pages/admin/AdminUsers";
import ProfilePage from "../pages/home/ProfilePage";
import AdminProfilePage from "../pages/admin/AdminProfile";
import VerifyEmailPage from "../pages/auth/VerifyEmailPage";
import ChangePasswordPage from "../pages/auth/ChangePasswordPage";
import AdminProductDetail from "../pages/admin/AdminProductDetail";
import PaymentPage from "../pages/home/PaymentPage";
import PointsAndVouchersPage from "../pages/home/RewardPage";
import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Spin } from "antd";
import Error403 from "../components/error/403";
import ProductsPage from "../pages/home/Products";
import PaymentCapturePage from "../pages/home/PayCapture";
import OrderDetailPage from "../pages/home/OrderInfo";
import AdminOrderDetailPage from "../pages/admin/AdminOrderDetail";

const ProtectedRoute: React.FC<{
    children: React.ReactNode;
    requireAuth?: boolean;
}> = ({ children, requireAuth = true }) => {
    const { token, isLoading } = useAuthStore();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spin size="large" tip="Đang xác thực..." />
            </div>
        );
    }

    if (requireAuth && !token) {
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const { user, token, isLoading } = useAuthStore();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spin size="large" tip="Đang xác thực..." />
            </div>
        );
    }

    if (!token) {
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    // if (user?.role !== "ADMIN") {
    //     return <Error403 />;
    // }

    return <>{children}</>;
};

// Auth Route Component (chỉ cho user chưa login)
const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { token, isLoading } = useAuthStore();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spin size="large" tip="Đang xác thực..." />
            </div>
        );
    }

    if (token) {
        const from = location.state?.from || "/";
        return <Navigate to={from} replace />;
    }

    return <>{children}</>;
};

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/auth"
                    element={
                        <AuthRoute>
                            <AuthLayout />
                        </AuthRoute>
                    }
                >
                    <Route path="login" element={<LoginPage />} />
                    <Route
                        path="verify-email/:token"
                        element={<VerifyEmailPage />}
                    />
                    <Route
                        path="change-password"
                        element={<ChangePasswordPage />}
                    />
                    {/* <Route path="register" element={<RegisterPage />} /> */}
                </Route>
                <Route path="/pay-capture/:pay_token" element={<PaymentCapturePage />} />
                <Route element={<MainLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route
                        path="/product/:id"
                        element={<ProductDetailsPage />}
                    />
                    <Route path="/order-info/:order_id" element={<OrderDetailPage />} />

                    <Route
                        path="/shop-cart"
                        element={
                            <ProtectedRoute requireAuth={true}>
                                <ShoppingCartPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/wishlist"
                        element={
                            <ProtectedRoute requireAuth={true}>
                                <WishlistPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/checkout"
                        element={
                            <ProtectedRoute requireAuth={true}>
                                <CheckoutPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/payment/:order_id"
                        element={
                            <ProtectedRoute requireAuth={true}>
                                <PaymentPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/my-profile"
                        element={
                            <ProtectedRoute requireAuth={true}>
                                <ProfilePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/blogs" element={<BlogPage />} />
                    <Route path="/reward" element={<PointsAndVouchersPage />} />
                    <Route path="/blogs/:tag" element={<BlogDetailPage />} />
                    <Route path="/search" element={<SearchPage />} />
                </Route>
                <Route
                    path="/admin/v1"
                    element={
                        <AdminProtectedRoute>
                            <AdminLayout />
                        </AdminProtectedRoute>
                    }
                >
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="order/:order_id" element={<AdminOrderDetailPage />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route
                        path="product/:product_id"
                        element={<AdminProductDetail />}
                    />
                    <Route
                        path="products/add-products"
                        element={<ProductAddPage />}
                    />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="brands" element={<AdminBrands />} />
                    <Route path="categories" element={<AdminCategories />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="profile" element={<AdminProfilePage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
