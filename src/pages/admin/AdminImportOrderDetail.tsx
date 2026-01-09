import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Steps,
  Tag,
  Divider,
  List,
  Space,
  Descriptions,
  Alert,
  Statistic,
  Badge,
  Modal,
  Form,
  Select,
  Input,
  message,
  Popconfirm,
  Table,
  Tooltip
} from 'antd';
import {
  ArrowLeftOutlined,
  ShoppingOutlined,
  DollarOutlined,
  TruckOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  UserOutlined,
  EditOutlined,
  SaveOutlined,
  StopOutlined,
  SyncOutlined,
  EyeOutlined,
  PrinterOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;
const { Option } = Select;
const { TextArea } = Input;

// Interfaces cho đơn hàng nhập
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
  supplier_email: string;
  order_date: string;
  estimated_delivery_date: string;
  received_date?: string;
  status: 'pending' | 'processing' | 'received' | 'cancelled';
  total_amount: number;
  items: ImportOrderItem[];
  notes?: string;
  created_by: string;
  tracking_number?: string;
}

const AdminImportOrderDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { order_id } = useParams<{ order_id: string }>();
  const [order, setOrder] = useState<ImportOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm] = Form.useForm();

  // Modal cập nhật trạng thái
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    // Mock dữ liệu đơn hàng nhập
    const mockOrder: ImportOrder = {
      id: order_id || "IMP001",
      supplier_name: "Công ty TNHH ABC",
      supplier_contact: "0987654321",
      supplier_email: "contact@abccompany.com",
      order_date: "2024-01-15",
      estimated_delivery_date: "2024-01-20",
      received_date: "2024-01-19",
      status: "received",
      total_amount: 50000000,
      created_by: "Admin 1",
      tracking_number: "TRK001234567",
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
      ],
      notes: "Đơn hàng ưu tiên, cần kiểm tra chất lượng kỹ trước khi đưa vào bán."
    };

    setOrder(mockOrder);
    editForm.setFieldsValue(mockOrder);
    setLoading(false);
  }, [order_id]);

  const getStatusColor = (status: string) => {
    const statusColors: { [key: string]: string } = {
      'pending': 'orange',
      'processing': 'blue',
      'received': 'green',
      'cancelled': 'red'
    };
    return statusColors[status] || 'default';
  };

  const getStatusStep = (status: string) => {
    const statusSteps: { [key: string]: number } = {
      'pending': 0,
      'processing': 1,
      'received': 2
    };
    return statusSteps[status] || 0;
  };

  const getStatusOptions = () => {
    const allStatuses = ['pending', 'processing', 'received', 'cancelled'];
    return allStatuses.filter(status => status !== order?.status);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const handleStatusUpdate = async () => {
    if (!order || !selectedStatus) return;

    setUpdating(true);
    try {
      // Cập nhật trạng thái đơn hàng trong state
      const updatedOrder = {
        ...order,
        status: selectedStatus as 'pending' | 'processing' | 'received' | 'cancelled',
        notes: order.notes ? `${order.notes}\n[${new Date().toLocaleString()}] Cập nhật trạng thái thành ${selectedStatus}` : `[${new Date().toLocaleString()}] Cập nhật trạng thái thành ${selectedStatus}`
      };

      setOrder(updatedOrder);
      setStatusModalVisible(false);
      setSelectedStatus('');

      message.success('Cập nhật trạng thái thành công');
    } catch (error) {
      message.error('Cập nhật trạng thái thất bại');
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveEdit = async (values: any) => {
    if (!order) return;

    setUpdating(true);
    try {
      // Cập nhật thông tin đơn hàng
      const updatedOrder = { ...order, ...values };
      setOrder(updatedOrder);
      setIsEditing(false);

      message.success('Cập nhật thông tin thành công');
    } catch (error) {
      message.error('Cập nhật thông tin thất bại');
    } finally {
      setUpdating(false);
    }
  };

  const importOrderItemsColumns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'product_name',
      key: 'product_name',
      render: (text: string, record: ImportOrderItem) => (
        <div className="flex items-center gap-3">
          <div>
            <Text strong>{text}</Text>
            <div className="flex gap-2 mt-1">
              <Text type="secondary" className="text-xs">Biến thể: {record.variant_info}</Text>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center' as const,
    },
    {
      title: 'Đơn giá nhập',
      dataIndex: 'unit_price',
      key: 'unit_price',
      render: (price: number) => formatCurrency(price),
      align: 'right' as const,
    },
    {
      title: 'Thành tiền',
      key: 'total',
      render: (record: ImportOrderItem) => formatCurrency(record.total_amount),
      align: 'right' as const,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Đang tải...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Alert
          message="Không tìm thấy đơn hàng nhập"
          description="Đơn hàng nhập bạn đang tìm kiếm không tồn tại."
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/admin/v1/import-orders')}
            className="mb-4"
          >
            Quay lại Đơn hàng nhập
          </Button>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <Title level={2} className="mb-2">Chi tiết đơn hàng nhập - Quản trị viên</Title>
              <Space wrap>
                <Text strong>Mã đơn hàng nhập:</Text>
                <Text code>{order.id}</Text>
                <Badge
                  status="processing"
                  text={
                    <Tag color={getStatusColor(order.status)} className="text-sm">
                      {order.status.toUpperCase()}
                    </Tag>
                  }
                />
                <Text type="secondary">
                  Đã tạo: {formatDate(order.order_date)}
                </Text>
              </Space>
            </div>

            <Space wrap>
              <Button
                icon={<PrinterOutlined />}
                size="large"
              >
                In đơn nhập
              </Button>
              <Button
                icon={<EditOutlined />}
                size="large"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Hủy chỉnh sửa' : 'Chỉnh sửa đơn hàng'}
              </Button>
              <Button
                type="primary"
                size="large"
                onClick={() => setStatusModalVisible(true)}
                icon={<SyncOutlined />}
              >
                Cập nhật trạng thái
              </Button>
              {order.status !== 'cancelled' && order.status !== 'received' && (
                <Popconfirm
                  title="Hủy đơn hàng nhập"
                  description="Bạn có chắc chắn muốn hủy đơn hàng nhập này không?"
                  onConfirm={() => {}}
                  okText="Có"
                  cancelText="Không"
                >
                  <Button
                    danger
                    size="large"
                    icon={<CloseCircleOutlined />}
                  >
                    Hủy đơn hàng
                  </Button>
                </Popconfirm>
              )}
            </Space>
          </div>
        </div>

        <Row gutter={[24, 24]}>
          {/* Cột trái - Thông tin đơn hàng */}
          <Col xs={24} lg={16}>
            {/* Tiến trình đơn hàng */}
            <Card
              title="Tiến trình đơn hàng nhập"
              className="mb-6"
            >
              <Steps
                current={getStatusStep(order.status)}
                status={order.status === 'cancelled' ? 'error' : 'process'}
              >
                <Step
                  title="Chờ xử lý"
                  description="Đơn hàng nhập đã được tạo"
                />
                <Step
                  title="Đang xử lý"
                  description="Đang chờ giao hàng từ nhà cung cấp"
                />
                <Step
                  title="Đã nhận hàng"
                  description="Đơn hàng đã được nhận vào kho"
                />
              </Steps>

              {order.tracking_number && (
                <Alert
                  message={
                    <Space>
                      <Text strong>Mã theo dõi:</Text>
                      <Text code>{order.tracking_number}</Text>
                    </Space>
                  }
                  type="info"
                  showIcon
                  className="mt-4"
                />
              )}

              {!order.tracking_number && order.status === 'processing' && (
                <Alert
                  message="Chờ nhận hàng"
                  description="Đang chờ nhận hàng từ nhà cung cấp"
                  type="warning"
                  showIcon
                  className="mt-4"
                />
              )}
            </Card>

            {/* Mặt hàng trong đơn nhập */}
            <Card title="Mặt hàng trong đơn nhập">
              <Table
                columns={importOrderItemsColumns}
                dataSource={order.items.map(item => ({ ...item, key: item.id }))}
                pagination={false}
                summary={() => (
                  <Table.Summary>
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0} colSpan={2}></Table.Summary.Cell>
                      <Table.Summary.Cell index={1}>
                        <Text strong>Tổng cộng</Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={2}>
                        <Text strong type="danger">{formatCurrency(order.total_amount)}</Text>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </Table.Summary>
                )}
              />
            </Card>
          </Col>

          {/* Cột phải - Chi tiết đơn hàng và hành động */}
          <Col xs={24} lg={8}>
            {/* Thông tin nhà cung cấp */}
            <Card
              title="Thông tin nhà cung cấp"
              className="mb-6"
              extra={
                isEditing ? (
                  <Button
                    type="primary"
                    size="small"
                    icon={<SaveOutlined />}
                    onClick={() => editForm.submit()}
                    loading={updating}
                  >
                    Lưu
                  </Button>
                ) : null
              }
            >
              <Form
                form={editForm}
                layout="vertical"
                onFinish={handleSaveEdit}
                disabled={!isEditing}
              >
                <Form.Item name="supplier_name" label="Tên nhà cung cấp">
                  <Input prefix={<UserOutlined />} />
                </Form.Item>
                <Form.Item name="supplier_email" label="Email">
                  <Input prefix={<MailOutlined />} />
                </Form.Item>
                <Form.Item name="supplier_contact" label="Số điện thoại">
                  <Input prefix={<PhoneOutlined />} />
                </Form.Item>
              </Form>
            </Card>

            {/* Thông tin đơn hàng nhập */}
            <Card title="Thông tin đơn hàng nhập" className="mb-6">
              <Space direction="vertical" className="w-full" size="middle">
                <div>
                  <Text strong>Ngày đặt hàng:</Text>
                  <Text className="ml-2">{formatDate(order.order_date)}</Text>
                </div>

                <div>
                  <Text strong>Ngày dự kiến nhận:</Text>
                  <Text className="ml-2">{formatDate(order.estimated_delivery_date)}</Text>
                </div>

                {order.received_date && (
                  <div>
                    <Text strong>Ngày nhận thực tế:</Text>
                    <Text className="ml-2">{formatDate(order.received_date)}</Text>
                  </div>
                )}

                <div className="flex justify-between">
                  <Text strong>Trạng thái:</Text>
                  <Tag color={getStatusColor(order.status)}>
                    {order.status.toUpperCase()}
                  </Tag>
                </div>

                <div className="flex justify-between">
                  <Text strong>Tổng giá trị:</Text>
                  <Text strong>{formatCurrency(order.total_amount)}</Text>
                </div>

                <div className="flex justify-between">
                  <Text strong>Người tạo:</Text>
                  <Text>{order.created_by}</Text>
                </div>
              </Space>
            </Card>

            {/* Ghi chú đơn hàng nhập */}
            <Card title="Ghi chú đơn hàng nhập">
              <TextArea
                placeholder="Thêm ghi chú nội bộ..."
                rows={4}
                value={order.notes || ''}
                onChange={(e) => {
                  if (order) {
                    setOrder({ ...order, notes: e.target.value });
                  }
                }}
              />
              <Button type="dashed" block className="mt-2">
                Thêm ghi chú
              </Button>
            </Card>

            {/* Hành động nhanh */}
            <Card title="Hành động nhanh" className="mt-6">
              <Space direction="vertical" className="w-full">
                <Button
                  icon={<FileTextOutlined />}
                  block
                  onClick={() => window.print()}
                >
                  In hóa đơn
                </Button>
                <Button
                  icon={<TruckOutlined />}
                  block
                  disabled={order.status === 'received' || order.status === 'cancelled'}
                >
                  Cập nhật tình trạng giao hàng
                </Button>
                <Button
                  icon={<MailOutlined />}
                  block
                >
                  Gửi email cho nhà cung cấp
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* Modal cập nhật trạng thái */}
        <Modal
          title="Cập nhật trạng thái đơn hàng nhập"
          open={statusModalVisible}
          onCancel={() => setStatusModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setStatusModalVisible(false)}>
              Hủy
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={updating}
              onClick={handleStatusUpdate}
              disabled={!selectedStatus}
            >
              Cập nhật trạng thái
            </Button>,
          ]}
        >
          <Space direction="vertical" className="w-full" size="middle">
            <div>
              <Text strong>Trạng thái hiện tại:</Text>
              <Tag color={getStatusColor(order.status)} className="ml-2">
                {order.status.toUpperCase()}
              </Tag>
            </div>

            <Select
              placeholder="Chọn trạng thái mới"
              value={selectedStatus}
              onChange={setSelectedStatus}
              className="w-full"
            >
              {getStatusOptions().map(status => (
                <Option key={status} value={status}>
                  {status.toUpperCase()}
                </Option>
              ))}
            </Select>

            <Alert
              message="Lưu ý"
              description="Việc cập nhật trạng thái sẽ ảnh hưởng đến tình trạng tồn kho tương ứng"
              type="info"
              showIcon
            />
          </Space>
        </Modal>
      </div>
    </div>
  );
};

export default AdminImportOrderDetailPage;