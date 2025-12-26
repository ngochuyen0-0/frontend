// components/admin/UserDetailModal.tsx
import React, { useEffect, useState } from 'react';
import { Modal, Descriptions, Tag, Card, Statistic, Row, Col } from 'antd';
import { User } from '../../types/user';
import { OrderHistory, UserProfile } from '../../types/profile';
import { getOrdersByUser } from '../../services/orderService';
import { Order, OrdersData } from '../../types/order';

interface UserDetailModalProps {
  user: UserProfile | null;
  visible: boolean;
  onClose: () => void;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({
  user,
  visible,
  onClose
}) => {
  const [ordersData, setOrdersUser] = useState<OrdersData>()
  const [totalOrderValue, setTotalOrderValue] = useState<number>(0)

  useEffect(() => {
    let sumValue = 0;
    for (let i = 0; i <= (ordersData?.data.length || 0); i++) {
      sumValue += (ordersData?.data[i]?.total_amount || 0);
    }
    setTotalOrderValue(sumValue);
  }, [ordersData])

  useEffect(() => {
    getOrdersByUser({ user_id: user?.id }).then(res => {
      setOrdersUser(res)
    }).catch(err => { })
  }, [])

  if (!user) return null;

  return (
    <Modal
      title="User Details"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <div className="space-y-6">
        {/* User Info */}
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Username">
            {user.username}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {user.email}
          </Descriptions.Item>
          <Descriptions.Item label="Phone">
            {user.user_info?.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Role">
            <Tag color={
              user.role === 'ADMIN' ? 'red' :
                user.role === 'MODERATOR' ? 'blue' : 'green'
            }>
              {user?.role}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={
              user.status === 'ACTIVE' ? 'green' :
                user.status === 'BANNED' ? 'red' : 'orange'
            }>
              {user.status}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Registration Date">
            {new Date(user.created_at || "").toLocaleDateString('vi-VN')}
          </Descriptions.Item>
          {/* <Descriptions.Item label="Last Login">
            {new Date(user.lastLogin).toLocaleDateString('vi-VN')}
          </Descriptions.Item> */}
        </Descriptions>

        {/* Statistics */}
        <Row gutter={16}>
          <Col span={6}>
            <Card size="small">
              <Statistic title="Total Orders" value={ordersData?.total} />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Total Spent"
                value={totalOrderValue}
                precision={0}
                prefix="$"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic title="Coins" value={user.loyalty_points?.find(p => p.source == "daily_login")?.points} suffix="xu" />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Avg. Order Value"
                value={(ordersData?.total || 0) > 0 ? totalOrderValue / (ordersData?.total || 0) : 0}
                precision={0}
                prefix="$"
              />
            </Card>
          </Col>
        </Row>
      </div>
    </Modal>
  );
};

export default UserDetailModal;