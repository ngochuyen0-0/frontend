// pages/ProfilePage.tsx
import React, { useState, useEffect } from 'react';
import {
  Card,
  Tabs,
  Avatar,
  Button,
  Space,
  Tag,
  Statistic,
  Row,
  Col,
  message
} from 'antd';
import {
  EditOutlined,
  SettingOutlined,
  ShoppingOutlined,
  GiftOutlined,
  HeartOutlined,
  HistoryOutlined,
  UserOutlined
} from '@ant-design/icons';
import PersonalInfo from '../../components/profile/PersonalInfo';
import OrderHistory from '../../components/profile/OrderHistory';
import CoinWallet from '../../components/profile/CoinWallet';
// import Wishlist from '../../components/profile/Wishlist';
import { UserProfile, OrderHistory as OrderHistoryType, CoinHistory, DailyRewardHistory } from '../../types/profile';
import { getInfo } from '../../services/authService';
import { getOrders, getOrdersByUser } from '../../services/orderService';
import { getWeeklyTaken } from '../../services/pointService';

const { TabPane } = Tabs;

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [pointHistory, setPointHistory] = useState<DailyRewardHistory>();
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<OrderHistoryType[]>();

  useEffect(() => {
    loadProfile();
    loadOrders();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    getInfo().then(res=>{
      setLoading(false)
      setProfile(res)
    })
    getWeeklyTaken().then(res=>setPointHistory(res)).catch(()=>{})
  };
 const loadOrders = async () => {
    getOrdersByUser({}).then(res=>{
      setOrders(res.data)
    })
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <Card className="mb-6 !shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <Avatar
                size={100}
                src={""}
                className="border-4 border-white shadow-lg"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {profile?.user_info?.full_name}
                </h1>
                <div className="space-y-1 text-gray-600">
                  <div className="flex items-center gap-2">
                    <span>📧 {profile.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📱 {profile?.user_info?.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>👤 Thành viên từ {new Date(profile?.created_at || "").toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <Space>
              <Button icon={<EditOutlined />} type="primary">
                Chỉnh sửa hồ sơ
              </Button>
              <Button icon={<SettingOutlined />}>
                Cài đặt
              </Button>
            </Space>
          </div>
        </Card>

        {/* Stats Overview */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={8}>
            <Card className="text-center !shadow-sm">
              <Statistic
                title="Tổng đơn hàng"
                value={orders?.length}
                prefix={<ShoppingOutlined className="text-blue-500" />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="text-center !shadow-sm">
              <Statistic
                title="Xu hiện có"
                value={profile.loyalty_points?.find(p => p.source == "daily_login")?.points || 0}
                prefix={<GiftOutlined className="text-yellow-500" />}
                suffix="xu"
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="text-center !shadow-sm">
              <Statistic
                title="Sản phẩm yêu thích"
                value={12}
                prefix={<HeartOutlined className="text-red-500" />}
              />
            </Card>
          </Col>
        </Row>

        {/* Main Content Tabs */}
        <Card className="!shadow-sm">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            type="card"
            size="large"
          >
            <TabPane
              tab={
                <span className="flex items-center gap-2">
                  <UserOutlined  />
                  Thông tin cá nhân
                </span>
              }
              key="personal"
            >
              <PersonalInfo 
                profile={profile} 
                onUpdate={loadProfile}
              />
            </TabPane>

            <TabPane
              tab={
                <span className="flex items-center gap-2">
                  <ShoppingOutlined />
                  Lịch sử đơn hàng
                  <Tag color="blue">{orders?.length}</Tag>
                </span>
              }
              key="orders"
            >
              <OrderHistory orders={orders || []} />
            </TabPane>

            <TabPane
              tab={
                <span className="flex items-center gap-2">
                  <GiftOutlined />
                  Ví xu của tôi
                  <Tag color="gold">{profile.loyalty_points?.find(p => p.source == "daily_login")?.points || 0} xu</Tag>
                </span>
              }
              key="coins"
            >
              <CoinWallet 
                balance={profile.loyalty_points?.find(p => p.source == "daily_login")?.points || 0}
                history={pointHistory?.history}
              />
            </TabPane>

            {/* <TabPane
              tab={
                <span className="flex items-center gap-2">
                  <HeartOutlined />
                  Sản phẩm yêu thích
                  <Tag color="red">12</Tag>
                </span>
              }
              key="wishlist"
            >
              <Wishlist />
            </TabPane> */}

            <TabPane
              tab={
                <span className="flex items-center gap-2">
                  <HistoryOutlined />
                  Hoạt động gần đây
                </span>
              }
              key="activity"
            >
              <div className="text-center py-8">
                <HistoryOutlined className="text-4xl text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Lịch sử hoạt động
                </h3>
                <p className="text-gray-600">
                  Theo dõi các hoạt động gần đây của bạn
                </p>
              </div>
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;