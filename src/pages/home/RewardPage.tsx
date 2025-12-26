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
  const [point, setPoint] = useState<Product>(0);
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
      name: '10% Off All Orders',
      description: 'Get 10% discount on your entire order',
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
      name: 'Free Shipping',
      description: 'Free shipping on orders over $50',
      type: 'shipping',
      discountValue: 0,
      discountType: 'fixed',
      pointsRequired: 300,
      validityDays: 15,
      category: 'shipping'
    },
    {
      id: 'V003',
      name: '$20 Voucher',
      description: '$20 off on minimum $100 purchase',
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
      name: '15% Electronics',
      description: '15% off on electronics category',
      type: 'discount',
      discountValue: 15,
      discountType: 'percentage',
      pointsRequired: 600,
      validityDays: 45,
      category: 'electronics'
    },
    {
      id: 'V005',
      name: 'Birthday Special',
      description: '20% off for birthday month',
      type: 'discount',
      discountValue: 20,
      discountType: 'percentage',
      pointsRequired: 400,
      validityDays: 90,
      category: 'all'
    },
    {
      id: 'V006',
      name: 'Flash Sale Voucher',
      description: '25% off on flash sale items',
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
      description: 'Order #ORD001 - 10% of $156.00',
      orderId: 'ORD001'
    },
    {
      id: 'T002',
      date: '2024-01-14 11:20',
      type: 'spent',
      amount: -500,
      description: 'Redeemed voucher: 10% Off All Orders',
      voucherId: 'V001'
    },
    {
      id: 'T003',
      date: '2024-01-10 09:15',
      type: 'earned',
      amount: 89,
      description: 'Order #ORD002 - 10% of $89.99',
      orderId: 'ORD002'
    },
    {
      id: 'T004',
      date: '2024-01-05 16:45',
      type: 'earned',
      amount: 234,
      description: 'Order #ORD003 - 10% of $234.50',
      orderId: 'ORD003'
    },
    {
      id: 'T005',
      date: '2024-01-01 10:00',
      type: 'expired',
      amount: -50,
      description: 'Points expired',
    }
  ];

  const pointRules = [
    'Earn 10% of order value in points (1 point = $1)',
    'Minimum $1 order to earn points',
    'Points expire after 12 months of inactivity',
    '100 points = $1 discount',
    'Points cannot be combined with some promotions',
    'Maximum points per order: 1000 points'
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
            Hapas Rewards
          </Title>
          <Paragraph type="secondary" className="text-lg">
            Earn points with every purchase and redeem for amazing vouchers!
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
                    title="Your Points"
                    value={point}
                    prefix={<StarOutlined className="text-yellow-500" />}
                    valueStyle={{ color: '#f59e0b', fontSize: '2.5rem' }}
                  />
                  <Text type="secondary">≈ ${(point / 100).toFixed(2)} in discounts</Text>
                </div>
              </Badge.Ribbon>

              <Divider />

              <Space direction="vertical" className="w-full" size="middle">
                <div className="flex justify-between">
                  <Text>Earned this month:</Text>
                  <Text strong type="success">+{pointsEarnedThisMonth}</Text>
                </div>
                <div className="flex justify-between">
                  <Text>Expiring next month:</Text>
                  <Text strong type="warning">-{pointsExpiringNextMonth}</Text>
                </div>
                <div className="flex justify-between">
                  <Text>Next level ({nextLevel}):</Text>
                  <Text strong>{pointsToNextLevel} points needed</Text>
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
                  How It Works
                </Space>
              }
              className="mb-6"
            >
              <Timeline>
                <Timeline.Item dot={<ShoppingOutlined className="text-blue-500" />}>
                  <Text strong>Shop & Earn</Text>
                  <br />
                  <Text type="secondary">Get 10% of order value as points</Text>
                </Timeline.Item>
                <Timeline.Item dot={<StarOutlined className="text-yellow-500" />}>
                  <Text strong>Accumulate Points</Text>
                  <br />
                  <Text type="secondary">Points never expire with active account</Text>
                </Timeline.Item>
                <Timeline.Item dot={<GiftOutlined className="text-green-500" />}>
                  <Text strong>Redeem Rewards</Text>
                  <br />
                  <Text type="secondary">Exchange points for vouchers</Text>
                </Timeline.Item>
              </Timeline>
            </Card>

            {/* Quick Actions */}
            <Card title="Quick Actions">
              <Space direction="vertical" className="w-full">
                <Button
                  icon={<HistoryOutlined />}
                  block
                  size="large"
                  onClick={() => setHistoryModalVisible(true)}
                >
                  Points History
                </Button>
                <Button
                  icon={<ShoppingOutlined />}
                  type="primary"
                  block
                  size="large"
                  href="/products"
                >
                  Shop to Earn More
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
                  Available Vouchers
                  <Tag color="blue">{vouchers.length} available</Tag>
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
                          Valid for {voucher.validityDays} days
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
                        {point >= voucher.pointsRequired ? 'Redeem Now' : 'Not Enough Points'}
                      </Button>

                      {point < voucher.pointsRequired && (
                        <Text type="secondary" className="text-xs block text-center mt-2">
                          Need {voucher.pointsRequired - point} more points
                        </Text>
                      )}
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>

            {/* Points Rules */}
            <Card title="Points Rules & Information">
              <Alert
                message="Important Information"
                description="Points are earned at 10% of your order value and can be used for discounts on future purchases."
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
              Redeem Voucher
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
                rules={[{ required: true, message: 'Please select quantity' }]}
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
                  <Text>Total Cost:</Text>
                  <Text strong className="text-yellow-600">
                    {selectedVoucher.pointsRequired} points
                  </Text>
                </div>
                <div className="flex justify-between">
                  <Text>Remaining Balance:</Text>
                  <Text strong>{point - selectedVoucher.pointsRequired} points</Text>
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
                  Confirm Redemption
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
              Points History
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
                        {(transaction.amount > 0 ? "Earns" : "Expired")}
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