import React, { useEffect, useState } from "react";
import { Input, Badge, Menu, Dropdown } from "antd";
import type { MenuProps } from "antd";
import {
    UserOutlined,
    ShoppingCartOutlined,
    HeartOutlined,
    DownOutlined,
    GiftOutlined,
    SettingOutlined,
    LogoutOutlined,
} from "@ant-design/icons";
import ArrowDownIcon from "../../icons/ArrowDownIcon";
import { useNavigate } from "react-router-dom";
import { useCoinSystem } from "../../hooks/useCoinSystem";
import { useAuthStore } from "../../store/useAuthStore";
import { getCart } from "../../services/cartService";
import { UserProfile } from "../../types/profile";
import { getInfo } from "../../services/authService";
import SearchBox from "../search/SearchBox";
import { Category } from "../../types/category";
import { Brand } from "../../types/brand";
import { getBrands } from "../../services/brandService";
import { getCategories } from "../../services/categoryService";

const Header: React.FC = () => {
    // const userCoins = 150;
    // const showCoinPopup = true;
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const [userInfo, setUserInfo] = useState<UserProfile>()
    const { coinSystem, setCoinSystem } = useCoinSystem();
    const [forcusSearchBar, setForcusSearchBar] = useState(false)
    const [categories, setCategories] = useState<Category[]>();
    const [brands, setBrands] = useState<Brand[]>();


    useEffect(() => {
        getInfo().then(res => {
            setUserInfo(res)
        }).catch();
        getBrands({ page: 1, row: 10 }).then(res => setBrands(res.data)).catch(() => { })
        getCategories({ page: 1, row: 10 }).then(res => setCategories(res.data)).catch(() => { })
    }, [])
    const userMenu = (
        <Menu
            items={[
                {
                    key: "profile",
                    label: "Hồ sơ của tôi",
                    icon: <SettingOutlined />,
                    onClick: () => navigate("/my-profile"),
                },
                {
                    key: "logout",
                    label: "Đăng xuất",
                    icon: <LogoutOutlined />,
                    onClick: () => {
                        logout()
                        navigate("/auth/login");
                    },
                    danger: true,
                },
            ]}
        />
    );

    const menuItems: MenuProps["items"] = [
        { key: "home", label: "Trang chủ", onClick: () => { navigate("/") } },
        {
            key: "shop",
            label: (
                <span className="inline-flex items-center gap-1">
                    Cửa hàng <DownOutlined style={{ fontSize: 10 }} />
                </span>
            ),
            children: categories?.map((e) => {
                return ({ key: `shop:${e.id}`, label: e.name, onClick: () => navigate(`/products?category_id=${e.id}`)})
            }),
        },
        {
            key: "brands",
            label: (
                <span className="inline-flex items-center gap-1">
                    Thương hiệu <ArrowDownIcon />
                </span>
            ),
            children: brands?.map((e) => {
                return ({ key: `brand:${e.id}`, label: e.name, onClick: () => navigate(`/products?brand_id=${e.id}`) })
            }),
        },
        {
            key: "pages",
            label: (
                <span className="inline-flex items-center gap-1">
                    Trang <DownOutlined style={{ fontSize: 10 }} />
                </span>
            ),
            children: [
                { key: "pages:about", label: "Giới thiệu" },
                { key: "pages:blog", label: "Blog", onClick: () => navigate("/blogs") },
                { key: "pages:contact", label: "Liên hệ" },
            ],
        },
        { key: "sale", label: "Khuyến mãi" },
    ];

    const handleCoinClick = () => {
        // Mở popup nhận xu
        // setShowCoinPopup(true);
        setCoinSystem((prev) => ({
            ...prev,
            showCoinPopup: true,
        }));
        // console.log("Open coin popup");
    };
    return (
        <>
            <div className="border-[#E5E7EB] border-b">
                <div className="px-[10%]">
                    <div className="flex justify-between items-center py-2 text-[12px] text-[#6B7280]">
                        <div className="flex items-center">
                            <ul
                                className="flex items-center gap-4 border-r pr-4 "
                                style={{ marginBottom: "0" }}
                            >
                                <li className="cursor-pointer">Giới thiệu</li>
                                <li className="cursor-pointer">Tài khoản của tôi</li>
                                <li className="cursor-pointer">Danh sách yêu thích</li>
                            </ul>
                            <div className="pl-4">
                                <p
                                    className="text-[#6B7280]"
                                    style={{ marginBottom: "0" }}
                                >
                                    Chúng tôi giao hàng cho bạn mỗi ngày từ{" "}
                                    <span className="font-bold text-red-500">
                                        7:00 đến 23:00
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-5">
                            <div>Tiếng Việt</div>
                            <div>VND</div>
                            <div
                              className="cursor-pointer hover:text-orange-500 transition-colors"
                              onClick={() => navigate('/my-profile')}
                            >
                              Theo dõi đơn hàng
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* logo & search box */}

            <div className="border-[#E5E7EB] border-b">
                <div className="px-[10%] py-2 flex items-center justify-between gap-10">
                    <div className="w-[10%] cursor-pointer">
                        <img
                            src="../../../public/logo/logo.png"
                            width={70}
                            alt=""
                            onClick={() => navigate("/")}
                        />
                    </div>
                    <div className="w-[60%]">
                        {/* <Search
              placeholder="Search for shoes..."
              allowClear
              enterButton
              size="middle"
              onSearch={onSearch}
            /> */}

                        <Input.Search
                            onClick={() => setForcusSearchBar(true)}
                            placeholder="Tìm kiếm sản phẩm..."
                            size="large"
                            className="bg-gray-100 rounded-lg [&_.ant-input]:bg-gray-100 [&_.ant-input]:focus:shadow-none [&_.ant-input]:focus:border-gray-300 [&_.ant-input]:border-gray-300"
                        />
                    </div>
                    <div className=" flex items-center gap-6 text-xl text-gray-700 cursor-pointer">
                        <div
                            className="flex items-center gap-2 cursor-pointer hover:text-yellow-600 transition-colors"
                            onClick={handleCoinClick}
                        >
                            <div className="relative">
                                <GiftOutlined style={{ fontSize: "24px" }} />
                                {coinSystem.showCoinPopup && (
                                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                                )}
                            </div>
                            <div className="text-[14px]" onClick={() => {
                                navigate("/reward")
                            }}>
                                <span className="font-semibold text-yellow-600">
                                    {userInfo?.loyalty_points?.find(p => p.source == "daily_login")?.points}
                                </span>
                                <span className="text-gray-600 ml-1">xu</span>
                            </div>
                        </div>

                        {user ? (
                            <Dropdown
                                overlay={userMenu}
                                placement="bottomRight"
                                trigger={["click"]}
                            >
                                <div className="flex items-center gap-1 cursor-pointer select-none">
                                    <UserOutlined
                                        style={{ fontSize: "24px" }}
                                    />
                                    <div className="text-[14px] font-medium">
                                        Xin chào, {user.username}
                                    </div>
                                </div>
                            </Dropdown>
                        ) : (
                            <div
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={() => navigate("/auth/login")}
                            >
                                <UserOutlined style={{ fontSize: "24px" }} />
                                <div className="text-[14px]">Đăng nhập</div>
                            </div>
                        )}
                        {<Badge count={getCart().length} size="small">
                            <ShoppingCartOutlined
                                style={{ fontSize: "24px" }}
                                onClick={() => navigate("/shop-cart")}
                            />
                        </Badge>}

                        <Badge count={JSON.parse(localStorage.getItem('wishlist') || '[]').length} size="small">
                            <HeartOutlined
                                style={{ fontSize: "24px" }}
                                onClick={() => navigate("/wishlist")}
                            />
                        </Badge>
                    </div>
                </div>
            </div>

            {/* menu */}
            <div className="border-[#E5E7EB] border-b">
                <div className="px-[10%] py-2 flex items-center justify-between gap-10">
                    <Menu
                        mode="horizontal"
                        items={menuItems}
                        style={{ borderBottom: "none", flex: 1 }}
                        rootClassName="main-nav"
                    />
                </div>
            </div>
            {forcusSearchBar ? <SearchBox onClose={() => setForcusSearchBar(false)} /> : <></>}

        </>
    );
};
export default Header;
