// components/profile/OrderHistory.tsx
import React from 'react';
import { Table, Tag, Button, Space } from 'antd';
import { EyeOutlined, ShoppingOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { OrderHistory } from '../../types/profile';
import { useNavigate } from 'react-router-dom';

interface OrderHistoryProps {
  orders: OrderHistory[];
}

const OrderHistoryComponent: React.FC<OrderHistoryProps> = ({ orders }) => {
  const nav = useNavigate()
  const columns: ColumnsType<OrderHistory> = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      key: 'id',
      render: (text) => (
        <span className="font-medium text-blue-600">{text}</span>
      )
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => new Date(date).toLocaleDateString('vi-VN')
    },
    {
      title: 'Số lượng',
      dataIndex: 'items',
      key: 'items',
      align: 'center' as const,
      render: (data) => data.length

    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total_amount',
      key: 'total_amount',
      render: (total) => (
        <span className="font-semibold">
          {total.toLocaleString('vi-VN')} ₫
        </span>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        // Hỗ trợ cả trạng thái từ backend và từ định nghĩa types
        const statusConfig = {
          // Trạng thái từ định nghĩa trong types
          pending: { color: 'orange', text: 'Chờ xác nhận' },
          confirmed: { color: 'blue', text: 'Đã xác nhận' },
          shipping: { color: 'geekblue', text: 'Đang giao hàng' },
          delivered: { color: 'green', text: 'Đã giao hàng' },
          cancelled: { color: 'red', text: 'Đã hủy' },
          // Trạng thái từ backend
          Unpaid: { color: 'orange', text: 'Chờ xác nhận' },
          processing: { color: 'blue', text: 'Đang xử lý' },
          Paid: { color: 'green', text: 'Hoàn thành' },
          Canceled: { color: 'red', text: 'Đã hủy' },
          Deleted: { color: 'red', text: 'Đã xóa' }
        };

        const config = statusConfig[status] || { color: 'default', text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => nav(`/order-info/${record.id}`)}
          >
            Chi tiết
          </Button>
          {(['delivered', 'Paid'].includes(record.status)) && (
            <Button
              type="link"
              icon={<ShoppingOutlined />}
            >
              Mua lại
            </Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-medium">Lịch sử đơn hàng</h3>
        <Button type="primary">
          Xem tất cả đơn hàng
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={orders}
        rowKey="id"
        pagination={{
          pageSize: 5,
          showSizeChanger: false
        }}
      />
    </div>
  );
};

export default OrderHistoryComponent;