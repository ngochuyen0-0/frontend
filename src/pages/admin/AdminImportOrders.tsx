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

const { Option } = Select;
const { Title } = Typography;

// Interface cho đơn hàng nhập
interface ImportOrderItem {
  id: string;
  product_name: string;
  variant_info: string; // màu sắc, kích thước
  quantity: number;
  unit_price: number; // giá nhập
  total_amount: number;
}

interface ImportOrder {
  id: string;
  supplier_name: string;
  supplier_contact: string;
  order_date: string;
  estimated_delivery_date: string;
  received_date?: string;
  status: 'pending' | 'processing' | 'received' | 'cancelled';
  total_amount: number;
  items: ImportOrderItem[];
  notes?: string;
  created_by: string;
}

const AdminImportOrders: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<ImportOrder[]>([]);
  const [orderStats, setOrderStats] = useState<any[]>([]);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [currentRecord, setCurrentRecord] = useState<ImportOrder | null>(null);
  const navigate = useNavigate();

  // Mock data cho đơn hàng nhập
  useEffect(() => {
    // Tạo dữ liệu mẫu cho đơn hàng nhập
    const mockImportOrders: ImportOrder[] = [
      {
        id: "IMP001",
        supplier_name: "Công ty TNHH ABC",
        supplier_contact: "0987654321",
        order_date: "2024-01-15",
        estimated_delivery_date: "2024-01-20",
        received_date: "2024-01-19",
        status: "received",
        total_amount: 50000000,
        created_by: "Admin 1",
        items: [
          {
            id: "item1",
            product_name: "Giày thể thao Nike Air Max",
            variant_info: "Size 42, Màu đen",
            quantity: 50,
            unit_price: 800000,
            total_amount: 40000000
          },
          {
            id: "item2",
            product_name: "Áo thun cotton basic",
            variant_info: "Size M, Màu trắng",
            quantity: 100,
            unit_price: 100000,
            total_amount: 10000000
          }
        ]
      },
      {
        id: "IMP002",
        supplier_name: "Công ty XYZ Fashion",
        supplier_contact: "0123456789",
        order_date: "2024-01-18",
        estimated_delivery_date: "2024-01-25",
        status: "processing",
        total_amount: 30000000,
        created_by: "Admin 2",
        items: [
          {
            id: "item3",
            product_name: "Quần jeans nam",
            variant_info: "Size 32, Màu xanh",
            quantity: 60,
            unit_price: 500000,
            total_amount: 30000000
          }
        ]
      },
      {
        id: "IMP003",
        supplier_name: "Nhà cung cấp nội địa",
        supplier_contact: "0912345678",
        order_date: "2024-01-20",
        estimated_delivery_date: "2024-01-28",
        status: "pending",
        total_amount: 25000000,
        created_by: "Admin 1",
        items: [
          {
            id: "item4",
            product_name: "Túi xách nữ",
            variant_info: "Màu nâu, Da PU",
            quantity: 30,
            unit_price: 833333,
            total_amount: 25000000
          }
        ]
      },
      {
        id: "IMP004",
        supplier_name: "Công ty giày dép Việt Nam",
        supplier_contact: "0876543210",
        order_date: "2024-01-10",
        estimated_delivery_date: "2024-01-15",
        received_date: "2024-01-14",
        status: "received",
        total_amount: 45000000,
        created_by: "Admin 3",
        items: [
          {
            id: "item5",
            product_name: "Dép quai ngang",
            variant_info: "Size 37, Màu xám",
            quantity: 150,
            unit_price: 300000,
            total_amount: 45000000
          }
        ]
      }
    ];

    setOrders(mockImportOrders);

    // Tạo thống kê mẫu
    const stats = [
      { status: 'pending', count: mockImportOrders.filter(o => o.status === 'pending').length },
      { status: 'processing', count: mockImportOrders.filter(o => o.status === 'processing').length },
      { status: 'received', count: mockImportOrders.filter(o => o.status === 'received').length },
      { status: 'cancelled', count: mockImportOrders.filter(o => o.status === 'cancelled').length },
    ];
    setOrderStats(stats);
  }, []);

  // Cấu hình trạng thái
  const statusConfig: any = {
    pending: { color: "orange", text: "Chờ xử lý" },
    processing: { color: "blue", text: "Đang xử lý" },
    received: { color: "green", text: "Đã nhận hàng" },
    cancelled: { color: "red", text: "Đã hủy" },
  };

  // Cột cho bảng
  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "id",
      key: "id",
      width: 120,
      render: (id: string) => (
        <Button
          type="link"
          size="small"
          onClick={() => navigate(`/admin/v1/import-order/${id}`)}
        >
          {id}
        </Button>
      ),
      sorter: (a: ImportOrder, b: ImportOrder) => a.id.localeCompare(b.id),
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "supplier_name",
      key: "supplier",
      render: (supplier_name: string, record: ImportOrder) => (
        <div>
          <div className="font-semibold">{supplier_name}</div>
          <div className="text-xs text-gray-500">{record.supplier_contact}</div>
        </div>
      ),
      sorter: (a: ImportOrder, b: ImportOrder) => a.supplier_name.localeCompare(b.supplier_name),
    },
    {
      title: "Sản phẩm",
      key: "products",
      render: (_: any, record: ImportOrder) => (
        <div className="h-8 w-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-800 font-medium">
          {record.items.length}
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
      sorter: (a: ImportOrder, b: ImportOrder) => a.total_amount - b.total_amount,
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
      onFilter: (value: any, record: ImportOrder) => record.status === value,
    },
    {
      title: "Ngày tạo",
      dataIndex: "order_date",
      key: "order_date",
      width: 120,
      render: (date: string) => (
        <Tooltip title={date}>
          <span>{new Date(date).toLocaleDateString("vi-VN")}</span>
        </Tooltip>
      ),
      sorter: (a: ImportOrder, b: ImportOrder) =>
        new Date(a.order_date).getTime() - new Date(b.order_date).getTime(),
    },
    {
      title: "Ngày nhận dự kiến",
      dataIndex: "estimated_delivery_date",
      key: "estimated_delivery_date",
      width: 150,
      render: (date: string) => (
        <Tooltip title={date}>
          <span>{new Date(date).toLocaleDateString("vi-VN")}</span>
        </Tooltip>
      ),
    },
    {
      title: "Người tạo",
      dataIndex: "created_by",
      key: "created_by",
      width: 100,
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 80,
      render: (_: any, record: ImportOrder) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "view",
                label: "Xem chi tiết",
                icon: <EyeOutlined />,
                onClick: () => navigate(`/admin/v1/import-order/${record.id}`),
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
                label: "In đơn nhập",
                icon: <ExportOutlined />,
              },
              { type: "divider" },
              {
                key: "cancel",
                label: "Hủy đơn hàng",
                icon: <DeleteOutlined />,
                danger: true,
                disabled: record.status === "received" || record.status === "cancelled",
                onClick: () => {
                  // Gọi hàm hủy đơn hàng
                  handleUpdateStatus(record.id, "cancelled");
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

  // Hàm xử lý cập nhật trạng thái đơn hàng
  const handleUpdateStatus = async (orderId: string, status: string) => {
    setUpdatingOrderId(orderId);
    try {
      // Cập nhật trực tiếp trong dữ liệu hiện tại để phản hồi nhanh
      const updatedOrders = orders.map(order =>
        order.id === orderId ? { ...order, status: status as any } : order
      );
      setOrders(updatedOrders);
      
      // Cập nhật lại thống kê
      const statsRes = updatedOrders.reduce((acc: any[], order: ImportOrder) => {
        const existing = acc.find(s => s.status === order.status);
        if (existing) {
          existing.count += 1;
        } else {
          acc.push({ status: order.status, count: 1 });
        }
        return acc;
      }, []);
      setOrderStats(statsRes);
      
      // Thông báo thành công
      message.success('Cập nhật trạng thái đơn hàng nhập thành công!');
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng nhập:", error);
      message.error('Có lỗi xảy ra khi cập nhật trạng thái đơn hàng nhập!');
    } finally {
      setUpdatingOrderId(null);
      // Đảm bảo đóng modal sau khi cập nhật xong
      setShowUpdateModal(false);
    }
  };

  // Bulk actions
  const bulkActionItems = [
    { key: "process", label: "Chuyển sang đang xử lý" },
    { key: "receive", label: "Đánh dấu đã nhận" },
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
        <div className="flex justify-between items-center">
          <div>
            <Title level={2} className="mb-2">Quản lý đơn hàng nhập</Title>
            <Typography.Text type="secondary">
              Theo dõi và quản lý các đơn hàng nhập từ nhà cung cấp
            </Typography.Text>
          </div>
          <Button
            type="primary"
            size="large"
            onClick={() => navigate('/admin/v1/import-orders/create')}
          >
            Tạo đơn hàng nhập mới
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng đơn nhập"
              value={orderStats.reduce((sum, stat) => sum + stat.count, 0)}
              valueStyle={{ color: "#1890ff" }}
              prefix={<ReloadOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Chờ xử lý"
              value={orderStats.find(stat => stat.status === 'pending')?.count || 0}
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
              title="Đã nhận hàng"
              value={orderStats.find(stat => stat.status === 'received')?.count || 0}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
      </Row>

      <Card className="mb-6">
        <div className="flex flex-col lg:flex-row flex-wrap gap-4 items-start lg:items-center justify-between">
          <Space className="w-full lg:w-auto">
            <Input.Search
              placeholder="Tìm kiếm mã đơn, nhà cung cấp..."
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
          dataSource={orders}
          rowKey="id"
          loading={loading}
          pagination={{
            total: orders.length,
            pageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} đơn hàng nhập`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Modal cập nhật trạng thái đơn hàng */}
      <Modal
        title="Cập nhật trạng thái đơn hàng nhập"
        open={showUpdateModal}
        onCancel={() => setShowUpdateModal(false)}
        footer={null}
      >
        {currentRecord && (
          <div className="mb-4">
            <p className="mb-2">Mã đơn hàng: <strong>{currentRecord.id}</strong></p>
            <p className="mb-2">Nhà cung cấp: <strong>{currentRecord.supplier_name}</strong></p>
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

export default AdminImportOrders;