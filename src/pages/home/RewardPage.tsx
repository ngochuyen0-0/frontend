import React, { useEffect, useState } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  List,
  Tag,
  Button,
  Modal,
  Form,
  InputNumber,
  Input,
  Select,
  Divider,
  Timeline,
  Progress,
  Space,
  Typography,
  Alert,
  Grid,
  Badge,
  Avatar
} from 'antd';
import {
  StarOutlined,
  GiftOutlined,
  ShoppingOutlined,
  HistoryOutlined,
  QuestionCircleOutlined,
  FireOutlined,
  CrownOutlined,
  RocketOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import { DailyRewardHistory, UserProfile } from '../../types/profile';
import { getInfo } from '../../services/authService';
import { getWeeklyTaken } from '../../services/pointService';
import { Product } from '../../types/product';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { useBreakpoint } = Grid;

interface Voucher {
  id: string;
  name: string;
  description: string;
  type: 'discount' | 'shipping' | 'gift';
  discountValue: number;
  discountType: 'percentage' | 'fixed';
  pointsRequired: number;
  validityDays: number;
  category: string;
  isHot?: boolean;
  isNew?: boolean;
}


interface PointTransaction {
  id: string;
  date: string;
  type: 'earned' | 'spent' | 'expired';
  amount: number;
  description: string;
  orderId?: string;
  voucherId?: string;
}

const PointsAndVouchersPage: React.FC = () => {
  const screens = useBreakpoint();
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [redeemModalVisible, setRedeemModalVisible] = useState(false);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [point, setPoint] = useState<number>(0);
  const [redeemForm] = Form.useForm();
  const [userInfo, setUserInfo] = useState<UserProfile>();
  const [pointHistory, setPointHistory] = useState<DailyRewardHistory>();

  useEffect(() => {
    getInfo().then(res => {
      setUserInfo(res);
      setPoint(res.loyalty_points?.find(e => e.source == "daily_login")?.points || 0)
    }).catch(() => { });
    getWeeklyTaken().then(res => setPointHistory(res)).catch(() => { });
  }, [])

  // Mock data
  const pointsEarnedThisMonth = 350;
  const pointsExpiringNextMonth = 150;
  const level = 'Gold';
  const nextLevel = 'Platinum';
  const pointsToNextLevel = 750;

  const vouchers: Voucher[] = [
    {
      id: 'V001',
      name: 'Giảm 10% tất cả đơn hàng',
      description: 'Giảm 10% cho toàn bộ đơn hàng của bạn',
      type: 'discount',
      discountValue: 10,
      discountType: 'percentage',
      pointsRequired: 500,
      validityDays: 30,
      category: 'all',
      isHot: true
    },
    {
      id: 'V002',
      name: 'Miễn phí vận chuyển',
      description: 'Miễn phí vận chuyển cho đơn hàng trên $50',
      type: 'shipping',
      discountValue: 0,
      discountType: 'fixed',
      pointsRequired: 300,
      validityDays: 15,
      category: 'shipping'
    },
    {
      id: 'V003',
      name: 'Phiếu giảm giá $20',
      description: 'Giảm $20 cho đơn hàng tối thiểu $100',
      type: 'discount',
      discountValue: 20,
      discountType: 'fixed',
      pointsRequired: 800,
      validityDays: 60,
      category: 'all',
      isNew: true
    },
    {
      id: 'V004',
      name: 'Điện tử 15%',
      description: 'Giảm 15% cho danh mục điện tử',
      type: 'discount',
      discountValue: 15,
      discountType: 'percentage',
      pointsRequired: 600,
      validityDays: 45,
      category: 'electronics'
    },
    {
      id: 'V005',
      name: 'Ưu đãi sinh nhật',
      description: 'Giảm 20% trong tháng sinh nhật',
      type: 'discount',
      discountValue: 20,
      discountType: 'percentage',
      pointsRequired: 400,
      validityDays: 90,
      category: 'all'
    },
    {
      id: 'V006',
      name: 'Phiếu giảm giá Flash Sale',
      description: 'Giảm 25% cho các mặt hàng flash sale',
      type: 'discount',
      discountValue: 25,
      discountType: 'percentage',
      pointsRequired: 1000,
      validityDays: 7,
      category: 'flash-sale',
      isHot: true
    }
  ];

  const pointTransactions: PointTransaction[] = [
    {
      id: 'T001',
      date: '2024-01-15 14:30',
      type: 'earned',
      amount: 156,
      description: 'Đơn hàng #ORD001 - 10% của $156.00',
      orderId: 'ORD001'
    },
    {
      id: 'T002',
      date: '2024-01-14 11:20',
      type: 'spent',
      amount: -500,
      description: 'Đổi phiếu giảm giá: Giảm 10% tất cả đơn hàng',
      voucherId: 'V001'
    },
    {
      id: 'T003',
      date: '2024-01-10 09:15',
      type: 'earned',
      amount: 89,
      description: 'Đơn hàng #ORD002 - 10% của $89.99',
      orderId: 'ORD002'
    },
    {
      id: 'T004',
      date: '2024-01-05 16:45',
      type: 'earned',
      amount: 234,
      description: 'Đơn hàng #ORD003 - 10% của $234.50',
      orderId: 'ORD003'
    },
    {
      id: 'T005',
      date: '2024-01-01 10:00',
      type: 'expired',
      amount: -50,
      description: 'Điểm hết hạn',
    }
  ];

  const pointRules = [
    'Kiếm 10% giá trị đơn hàng dưới dạng điểm (1 điểm = $1)',
    'Đơn hàng tối thiểu $1 để kiếm điểm',
    'Điểm hết hạn sau 12 tháng không hoạt động',
    '100 điểm = $1 giảm giá',
    'Điểm không thể kết hợp với một số chương trình khuyến mãi',
    'Số điểm tối đa mỗi đơn hàng: 1000 điểm'
  ];

  const handleRedeemVoucher = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setRedeemModalVisible(true);
  };

  const handleConfirmRedeem = (values: any) => {
    console.log('Redeem values:', values);
    // Handle voucher redemption logic here
    setRedeemModalVisible(false);
    setSelectedVoucher(null);
  };

  const getVoucherColor = (type: string) => {
    switch (type) {
      case 'discount': return 'blue';
      case 'shipping': return 'green';
      case 'gift': return 'orange';
      default: return 'default';
    }
  };

  const getVoucherIcon = (type: string) => {
    switch (type) {
      case 'discount': return <ThunderboltOutlined />;
      case 'shipping': return <RocketOutlined />;
      case 'gift': return <GiftOutlined />;
      default: return <GiftOutlined />;
    }
  };

  const getTransactionColor = (amount: number) => {
    if (amount < 0) {
      return 'red'
    }
    else {
      return 'green'
    }
  };

  const getTransactionIcon = (amount: number) => {
    if (amount < 0) {
      return <ExclamationCircleOutlined />
    } else {
      return <CheckCircleOutlined />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <Title level={1} className="mb-2">
            <StarOutlined className="text-yellow-500 mr-3" />
            Phần thưởng Hapas
           </Title>
           <Paragraph type="secondary" className="text-lg">
             Kiếm điểm với mọi đơn hàng và đổi lấy các phiếu giảm giá tuyệt vời!
           </Paragraph>
         </div>

        <Row gutter={[24, 24]}>
          {/* Left Column - Points Overview */}
          <Col xs={24} lg={8}>
            {/* Points Summary */}
            <Card className="text-center mb-6">
              <Badge.Ribbon text={level} color="gold">
                <div className="pt-6">
                  <Avatar
                    size={80}
                    icon={<StarOutlined />}
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 mb-4"
                  />
                  <Statistic
                    title="Điểm của bạn"
                    value={point}
                    prefix={<StarOutlined className="text-yellow-500" />}
                    valueStyle={{ color: '#f59e0b', fontSize: '2.5rem' }}
                  />
                  <Text type="secondary">≈ ${(point / 100).toFixed(2)} trong phiếu giảm giá</Text>
                </div>
              </Badge.Ribbon>

              <Divider />

              <Space direction="vertical" className="w-full" size="middle">
                <div className="flex justify-between">
                  <Text>Đã kiếm trong tháng này:</Text>
                  <Text strong type="success">+{pointsEarnedThisMonth}</Text>
                </div>
                <div className="flex justify-between">
                  <Text>Sắp hết hạn tháng tới:</Text>
                  <Text strong type="warning">-{pointsExpiringNextMonth}</Text>
                </div>
                <div className="flex justify-between">
                  <Text>Cấp độ tiếp theo ({nextLevel}):</Text>
                  <Text strong>{pointsToNextLevel} điểm cần thiết</Text>
                </div>
              </Space>

              <Progress
                percent={Math.round((point / (point + pointsToNextLevel)) * 100)}
                strokeColor={{
                  '0%': '#f59e0b',
                  '100%': '#f97316',
                }}
                className="mt-4"
              />
            </Card>

            {/* How It Works */}
            <Card
              title={
                <Space>
                  <QuestionCircleOutlined />
                  Cách thức hoạt động
                </Space>
              }
              className="mb-6"
            >
              <Timeline>
                <Timeline.Item dot={<ShoppingOutlined className="text-blue-500" />}>
                  <Text strong>Mua sắm & Kiếm điểm</Text>
                  <br />
                  <Text type="secondary">Nhận 10% giá trị đơn hàng dưới dạng điểm</Text>
                </Timeline.Item>
                <Timeline.Item dot={<StarOutlined className="text-yellow-500" />}>
                  <Text strong>Tích lũy điểm</Text>
                  <br />
                  <Text type="secondary">Điểm không bao giờ hết hạn với tài khoản hoạt động</Text>
                </Timeline.Item>
                <Timeline.Item dot={<GiftOutlined className="text-green-500" />}>
                  <Text strong>Đổi phần thưởng</Text>
                  <br />
                  <Text type="secondary">Trao đổi điểm lấy phiếu giảm giá</Text>
                </Timeline.Item>
              </Timeline>
            </Card>

            {/* Quick Actions */}
            <Card title="Hành động nhanh">
              <Space direction="vertical" className="w-full">
                <Button
                  icon={<HistoryOutlined />}
                  block
                  size="large"
                  onClick={() => setHistoryModalVisible(true)}
                >
                  Lịch sử điểm
                </Button>
                <Button
                  icon={<ShoppingOutlined />}
                  type="primary"
                  block
                  size="large"
                  href="/products"
                >
                  Mua sắm để kiếm thêm
                </Button>
              </Space>
            </Card>
          </Col>

          {/* Right Column - Vouchers */}
          <Col xs={24} lg={16}>
            {/* Available Vouchers */}
            <Card
              title={
                <Space>
                  <GiftOutlined />
                  Phiếu giảm giá có sẵn
                  <Tag color="blue">{vouchers.length} có sẵn</Tag>
                </Space>
              }
              className="mb-6"
            >
              <Row gutter={[16, 16]}>
                {vouchers.map(voucher => (
                  <Col xs={24} md={12} key={voucher.id}>
                    <Card
                      size="small"
                      className={`border-2 hover:shadow-lg transition-all ${point >= voucher.pointsRequired
                        ? 'border-green-200 hover:border-green-400'
                        : 'border-gray-200 opacity-60'
                        }`}
                      extra={
                        <Space>
                          {voucher.isHot && <FireOutlined className="text-red-500" />}
                          {voucher.isNew && <Tag color="green">NEW</Tag>}
                        </Space>
                      }
                    >
                      <div className="flex justify-between items-start mb-3">
                        <Tag
                          color={getVoucherColor(voucher.type)}
                          icon={getVoucherIcon(voucher.type)}
                        >
                          {voucher.type.toUpperCase()}
                        </Tag>
                        <div className="text-right">
                          <Text strong className="text-lg text-yellow-600">
                            {voucher.pointsRequired} <StarOutlined />
                          </Text>
                        </div>
                      </div>

                      <Title level={5} className="mb-2">{voucher.name}</Title>
                      <Paragraph type="secondary" className="text-sm mb-3">
                        {voucher.description}
                      </Paragraph>

                      <div className="flex justify-between items-center mb-3">
                        <Text type="secondary" className="text-xs">
                          Có hiệu lực trong {voucher.validityDays} ngày
                        </Text>
                        <Tag>{voucher.category}</Tag>
                      </div>

                      <Button
                        type="primary"
                        block
                        disabled={point < voucher.pointsRequired}
                        onClick={() => handleRedeemVoucher(voucher)}
                        icon={<GiftOutlined />}
                      >
                        {point >= voucher.pointsRequired ? 'Đổi ngay' : 'Không đủ điểm'}
                      </Button>

                      {point < voucher.pointsRequired && (
                        <Text type="secondary" className="text-xs block text-center mt-2">
                          Cần thêm {voucher.pointsRequired - point} điểm
                        </Text>
                      )}
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>

            {/* Points Rules */}
            <Card title="Quy tắc & Thông tin điểm">
              <Alert
                message="Thông tin quan trọng"
                description="Điểm được kiếm với 10% giá trị đơn hàng của bạn và có thể được sử dụng để giảm giá cho các đơn hàng trong tương lai."
                type="info"
                showIcon
                className="mb-4"
              />

              <List
                dataSource={pointRules}
                renderItem={rule => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<CheckCircleOutlined className="text-green-500" />}
                      description={rule}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>

        {/* Redeem Modal */}
        <Modal
          title={
            <Space>
              <GiftOutlined />
              Đổi phiếu giảm giá
            </Space>
          }
          open={redeemModalVisible}
          onCancel={() => {
            setRedeemModalVisible(false);
            setSelectedVoucher(null);
          }}
          footer={null}
          width={500}
        >
          {selectedVoucher && (
            <Form
              form={redeemForm}
              layout="vertical"
              onFinish={handleConfirmRedeem}
            >
              <div className="text-center mb-6 p-4 bg-gray-50 rounded-lg">
                <Title level={4}>{selectedVoucher.name}</Title>
                <Text type="secondary">{selectedVoucher.description}</Text>
                <div className="mt-2">
                  <Text strong className="text-lg text-yellow-600">
                    Cost: {selectedVoucher.pointsRequired} points
                  </Text>
                </div>
                <div className="mt-1">
                  <Text type="secondary">
                    Your balance: <Text strong>{point} points</Text>
                  </Text>
                </div>
              </div>

              <Form.Item
                name="quantity"
                label="Quantity"
                initialValue={1}
                rules={[{ required: true, message: 'Vui lòng chọn số lượng' }]}
              >
                <InputNumber
                  min={1}
                  max={Math.floor(point / selectedVoucher.pointsRequired)}
                  style={{ width: '100%' }}
                  size="large"
                />
              </Form.Item>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <div className="flex justify-between">
                  <Text>Tổng chi phí:</Text>
                  <Text strong className="text-yellow-600">
                    {selectedVoucher.pointsRequired} điểm
                  </Text>
                </div>
                <div className="flex justify-between">
                  <Text>Số dư còn lại:</Text>
                  <Text strong>{point - selectedVoucher.pointsRequired} điểm</Text>
                </div>
              </div>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  icon={<CheckCircleOutlined />}
                >
                  Xác nhận đổi điểm
                </Button>
              </Form.Item>
            </Form>
          )}
        </Modal>

        {/* Points History Modal */}
        <Modal
          title={
            <Space>
              <HistoryOutlined />
              Lịch sử điểm
            </Space>
          }
          open={historyModalVisible}
          onCancel={() => setHistoryModalVisible(false)}
          footer={null}
          width={600}
        >
          <List
            dataSource={pointHistory?.history}
            renderItem={transaction => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      icon={getTransactionIcon(transaction.amount)}
                      style={{
                        backgroundColor: transaction.amount > 0 ? '#52c41a' :
                          transaction.amount < 0 ? '#ff4d4f' : '#fa8c16'
                      }}
                    />
                  }
                  title={
                    <Space>
                      <Text>{transaction.reason}</Text>
                      <Tag color={getTransactionColor(transaction.amount)}>
                        {(transaction.amount > 0 ? "Kiếm" : "Hết hạn")}
                      </Tag>
                    </Space>
                  }
                  description={
                    <Text type="secondary">
                      {new Date(transaction.created_at).toLocaleString()}
                    </Text>
                  }
                />
                <Text
                  strong
                  style={{
                    color: transaction.amount > 0 ? '#52c41a' :
                      transaction.amount < 0 ? '#ff4d4f' : '#fa8c16'
                  }}
                >
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                </Text>
              </List.Item>
            )}
          />
        </Modal>
      </div>
    </div>
  );
};

export default PointsAndVouchersPage;