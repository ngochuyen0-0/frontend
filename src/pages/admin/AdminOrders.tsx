import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  EyeOutlined,
  FilterOutlined,
  MoreOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Dropdown,
  Input,
  message,
  Modal,
  Popconfirm,
  Radio,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { OrdersData } from "../../types/order";
import { getOrders, updateOrderStatus } from "../../services/orderService";
import { getOrderStatusStatistics } from "../../services/statisticalService";

const { Option } = Select;
const { Title } = Typography;

const AdminOrders: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);
  const [ordersData, setOrdersData] = useState<OrdersData>();
  const [orderStats, setOrderStats] = useState<any[]>([]);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy dữ liệu đơn hàng
    getOrders({}).then(res => {
      setOrdersData(res);
    }).catch(err => {
      console.error("Lỗi khi lấy dữ liệu đơn hàng:", err);
    });

    // Lấy dữ liệu thống kê đơn hàng theo trạng thái
    getOrderStatusStatistics().then(res => {
      setOrderStats(res);
    }).catch(err => {
      console.error("Lỗi khi lấy dữ liệu thống kê:", err);
    });
  }, []);

  // Hàm xử lý cập nhật trạng thái đơn hàng
  const handleUpdateStatus = async (orderId: string, status: string) => {
    setUpdatingOrderId(orderId);
    try {
      await updateOrderStatus(orderId, status);
      
      // Cập nhật trực tiếp trong dữ liệu hiện tại để phản hồi nhanh
      if (ordersData && ordersData.data) {
        const updatedOrders = ordersData.data.map(order =>
          order.id === orderId ? { ...order, status: status } : order
        );
        setOrdersData({ ...ordersData, data: updatedOrders });
      }
      
      // Cập nhật lại thống kê
      const statsRes = await getOrderStatusStatistics();
      setOrderStats(statsRes);
      
      // Thông báo thành công
      message.success('Cập nhật trạng thái đơn hàng thành công!');
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
      message.error('Có lỗi xảy ra khi cập nhật trạng thái đơn hàng!');
      
      // Nếu cập nhật thất bại, có thể lấy lại dữ liệu để đảm bảo tính nhất quán
      try {
        const res = await getOrders({});
        setOrdersData(res);
      } catch (err) {
        console.error("Lỗi khi lấy lại dữ liệu đơn hàng:", err);
      }
    } finally {
      setUpdatingOrderId(null);
      // Đảm bảo đóng modal sau khi cập nhật xong
      setShowUpdateModal(false);
    }
  };

  // Status configurations
  const statusConfig: any = {
    Unpaid: { color: "orange", text: "Chờ xác nhận" },
    processing: { color: "blue", text: "Đang xử lý" },
    Paid: { color: "green", text: "Hoàn thành" },
    Canceled: { color: "red", text: "Đã hủy" },
    Deleted: { color: "red", text: "Đã xóa" },
  };

  const paymentConfig: any = {
    Unpaid: { color: "orange", text: "Chờ thanh toán" },
    Paid: { color: "green", text: "Đã thanh toán" },
    Canceled: { color: "red", text: "Thanh toán thất bại" },
    Deleted: { color: "gray", text: "Đã hoàn tiền" },
  };

  // Columns definition
  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "id",
      key: "id",
      width: 150,
      render: (id: string) => (
        <Button
          type="link"
          size="small"
          onClick={() => navigate(`/admin/v1/order/${id}`)}
        >
          {id.substring(0, 8)}...
        </Button>
      ),
      sorter: (a: any, b: any) => a.id.localeCompare(b.id),
    },
    {
      title: "Khách hàng",
      dataIndex: "fullname",
      key: "customer",
      render: (fullname: string, record: any) => (
        <div>
          <div className="font-semibold">{fullname}</div>
          <div className="text-xs text-gray-500">{record.email}</div>
          <div className="text-xs text-gray-500">{record.phone}</div>
        </div>
      ),
      sorter: (a: any, b: any) => a.fullname.localeCompare(b.fullname),
    },
    {
      title: "Sản phẩm",
      key: "products",
      render: (_: any, record: any) => (
        <div>
          <div className="text-sm">{record.items.length} sản phẩm</div>
          <div className="text-xs text-gray-500">
            {record.items.slice(0, 2).map((item: any, idx: number) => (
              <div key={idx}>{item.product_name || `Sản phẩm ${idx + 1}`}</div>
            ))}
            {record.items.length > 2 && (
              <div>+ {record.items.length - 2} sản phẩm khác</div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "total_amount",
      key: "total_amount",
      width: 120,
      render: (total: number) => (
        <div className="font-semibold text-right">
          {total ? total.toLocaleString() : '0'}₫
        </div>
      ),
      sorter: (a: any, b: any) => a.total_amount - b.total_amount,
      align: 'right' as const,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => {
        const config = statusConfig[status] || { color: "default", text: status };
        return <Tag color={config.color} className="mx-0">{config.text}</Tag>;
      },
      filters: Object.entries(statusConfig).map(([key, value]: [string, any]) => ({
        text: value.text,
        value: key,
      })),
      onFilter: (value: any, record: any) => record.status === value,
    },
    {
      title: "Thanh toán",
      dataIndex: "status",
      key: "payment_status",
      width: 120,
      render: (status: string) => {
        const config = paymentConfig[status] || { color: "default", text: status };
        return <Tag color={config.color} className="mx-0">{config.text}</Tag>;
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      width: 120,
      render: (date: string) => (
        <Tooltip title={date}>
          <span>{new Date(date).toLocaleDateString("vi-VN")}</span>
        </Tooltip>
      ),
      sorter: (a: any, b: any) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 80,
      render: (_: any, record: any) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "view",
                label: "Xem chi tiết",
                icon: <EyeOutlined />,
                onClick: () => navigate(`/admin/v1/order/${record.id}`),
              },
              {
                key: "edit",
                label: "Cập nhật trạng thái",
                icon: <EditOutlined />,
                onClick: () => {
                  setCurrentRecord(record);
                  setShowUpdateModal(true);
                  setNewStatus(''); // Reset trạng thái mới
                }
              },
              {
                key: "print",
                label: "In hóa đơn",
                icon: <ExportOutlined />,
              },
              { type: "divider" },
              {
                key: "cancel",
                label: "Hủy đơn hàng",
                icon: <DeleteOutlined />,
                danger: true,
                disabled:
                  record.status === "Paid" || record.status === "Canceled",
                onClick: () => {
                  // Gọi hàm hủy đơn hàng
                  handleUpdateStatus(record.id, "Canceled");
                }
              },
            ],
          }}
          trigger={["click"]}
        >
          <Button type="text" icon={<MoreOutlined />} size="small" />
        </Dropdown>
      ),
    },
  ];

  // Bulk actions
  const bulkActionItems = [
    { key: "process", label: "Chuyển sang đang xử lý" },
    { key: "complete", label: "Đánh dấu hoàn thành" },
    { key: "cancel", label: "Hủy đơn hàng", danger: true },
    { key: "export", label: "Xuất đơn hàng" },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys: React.Key[]) => setSelectedRowKeys(selectedKeys),
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Title level={2} className="mb-2">Quản lý đơn hàng</Title>
        <Typography.Text type="secondary">
          Theo dõi và quản lý tất cả đơn hàng trong hệ thống
        </Typography.Text>
      </div>

      {/* Quick Stats */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng đơn hàng"
              value={orderStats.reduce((sum, stat) => sum + stat.count, 0)}
              valueStyle={{ color: "#1890ff" }}
              prefix={<ReloadOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Chờ xác nhận"
              value={orderStats.find(stat => stat.status === 'Unpaid')?.count || 0}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Đang xử lý"
              value={orderStats.find(stat => stat.status === 'processing')?.count || 0}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Hoàn thành"
              value={orderStats.find(stat => stat.status === 'Paid')?.count || 0}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
      </Row>

      <Card className="mb-6">
        <div className="flex flex-col lg:flex-row flex-wrap gap-4 items-start lg:items-center justify-between">
          <Space className="w-full lg:w-auto">
            <Input.Search
              placeholder="Tìm kiếm mã đơn hàng, khách hàng..."
              allowClear
              style={{ width: 300 }}
              size="middle"
            />
            
            <Select
              placeholder="Trạng thái đơn hàng"
              style={{ width: 180 }}
              size="middle"
              allowClear
              options={Object.entries(statusConfig).map(([key, value]: [string, any]) => ({
                value: key,
                label: value.text
              }))}
            />
          </Space>

          <Space>
            {selectedRowKeys.length > 0 && (
              <Dropdown menu={{ items: bulkActionItems }}>
                <Button>
                  Thao tác hàng loạt ({selectedRowKeys.length})
                </Button>
              </Dropdown>
            )}
            <Button 
              icon={<FilterOutlined />} 
              size="middle"
            >
              Đặt lại bộ lọc
            </Button>
            <Button 
              icon={<ExportOutlined />} 
              size="middle"
            >
              Xuất Excel
            </Button>
          </Space>
        </div>
      </Card>

      <Card>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={ordersData?.data}
          rowKey="id"
          loading={loading}
          pagination={{
            total: ordersData?.total || 0,
            pageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} đơn hàng`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Modal cập nhật trạng thái đơn hàng */}
      <Modal
        title="Cập nhật trạng thái đơn hàng"
        open={showUpdateModal}
        onCancel={() => setShowUpdateModal(false)}
        footer={null}
      >
        {currentRecord && (
          <div className="mb-4">
            <p className="mb-2">Mã đơn hàng: <strong>{currentRecord.id}</strong></p>
            <p className="mb-2">
              Trạng thái hiện tại: <Tag color={statusConfig[currentRecord.status]?.color}>
                {statusConfig[currentRecord.status]?.text}
              </Tag>
            </p>
            <p className="mb-2">Chọn trạng thái mới:</p>
            <Select
              style={{ width: '100%' }}
              placeholder="Chọn trạng thái mới"
              value={newStatus}
              onChange={(value) => setNewStatus(value)}
              loading={updatingOrderId === currentRecord.id}
              options={Object.keys(statusConfig)
                .filter((status) => status !== currentRecord.status)
                .map((status) => ({
                  value: status,
                  label: statusConfig[status].text
                }))}
            />
          </div>
        )}
        <div className="flex justify-end space-x-2">
          <Button onClick={() => setShowUpdateModal(false)}>Hủy</Button>
          <Button
            type="primary"
            loading={updatingOrderId === currentRecord?.id}
            disabled={!newStatus}
            onClick={() => {
              if (currentRecord && newStatus) {
                handleUpdateStatus(currentRecord.id, newStatus);
                // setShowUpdateModal(false); // Đã chuyển vào finally của hàm handleUpdateStatus
              }
            }}
          >
            Cập nhật
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminOrders;
