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
      title="Chi tiết người dùng"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <div className="space-y-6">
        {/* User Info */}
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Tên người dùng">
            {user.username}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {user.email}
          </Descriptions.Item>
          <Descriptions.Item label="Điện thoại">
            {user.user_info?.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Vai trò">
            <Tag color={
              user.role === 'ADMIN' ? 'red' :
                user.role === 'MODERATOR' ? 'blue' : 'green'
            }>
              {user?.role}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color={
              user.status === 'ACTIVE' ? 'green' :
                user.status === 'BANNED' ? 'red' : 'orange'
            }>
              {user.status}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Ngày đăng ký">
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
              <Statistic title="Tổng đơn hàng" value={ordersData?.total} />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Tổng chi tiêu"
                value={totalOrderValue}
                precision={0}
                prefix="$"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic title="Điểm xu" value={user.loyalty_points?.find(p => p.source == "daily_login")?.points} suffix="xu" />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Giá trị đơn hàng TB"
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