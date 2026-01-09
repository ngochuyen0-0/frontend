import {
    CopyOutlined,
    DeleteOutlined,
    EditOutlined,
    ExportOutlined,
    EyeOutlined,
    FilterOutlined,
    FormOutlined,
    MoreOutlined,
    PlusOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import {
    Badge,
    Button,
    Card,
    Col,
    Dropdown,
    Input,
    Row,
    Select,
    Space,
    Statistic,
    Table,
    Tag,
    Tooltip,
} from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { OrdersData } from "../../types/order";
import { getOrders } from "../../services/orderService";
import { getOrderStatusStatistics } from "../../services/statisticalService";

const { Option } = Select;

const AdminOrders: React.FC = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [loading, setLoading] = useState(false);
    const [ordersData, setOrdersData] = useState<OrdersData>({ data: [], max_page: 0, page: 0, row: 0, total: 0 })
    const [orderStats, setOrderStats] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Lấy dữ liệu đơn hàng
                const ordersRes = await getOrders({});
                setOrdersData(ordersRes);

                // Lấy dữ liệu thống kê đơn hàng theo trạng thái
                const statsRes = await getOrderStatusStatistics();
                setOrderStats(statsRes);
            } catch (err) {
                console.error("Lỗi khi lấy dữ liệu:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [])

    // Status configurations
    const statusConfig: any = {
        unpaid: { color: "orange", text: "Chờ xác nhận" },
        pending: { color: "orange", text: "Chờ xác nhận" },
        confirmed: { color: "blue", text: "Đã xác nhận" },
        processing: { color: "blue", text: "Đang xử lý" },
        shipped: { color: "purple", text: "Đã giao hàng" },
        delivered: { color: "green", text: "Đã nhận hàng" },
        cancelled: { color: "red", text: "Đã hủy" },
        refunded: { color: "volcano", text: "Đã hoàn tiền" },
    };

    const paymentConfig: any = {
        unpaid: { color: "orange", text: "Chờ thanh toán" },
        pending: { color: "orange", text: "Chờ thanh toán" },
        paid: { color: "green", text: "Đã thanh toán" },
        cancelled: { color: "red", text: "Thanh toán thất bại" },
        refunded: { color: "gray", text: "Đã hoàn tiền" },
    };

    const shippingConfig: any = {
        pending: { color: "orange", text: "Chờ giao hàng" },
        shipped: { color: "blue", text: "Đã giao hàng" },
        delivered: { color: "green", text: "Đã nhận hàng" },
        cancelled: { color: "red", text: "Đã hủy" },
    };

    // Columns definition
    const columns = [
        {
            title: "Mã đơn",
            dataIndex: "id",
            key: "id",
            render: (id: string) => (
                <Button
                    style={{ fontSize: 12 }}
                    type="link"
                    onClick={() => navigate(`/admin/v1/order/${id}`)}
                >
                    {id}
                </Button>
            ),
            sorter: (a: any, b: any) => a.id.localeCompare(b.id),
        },
        {
            title: "Khách hàng",
            dataIndex: "customer",
            key: "customer",
            render: (_: string, record: any) => (
                <div>
                    <div className="font-semibold">{record.fullname}</div>
                    <div className="text-xs text-gray-500">{record.email}</div>
                    <div className="text-xs text-gray-500">{record.phone}</div>
                </div>
            ),
            sorter: (a: any, b: any) => a.customer.localeCompare(b.customer),
        },
        {
            title: "Tổng tiền",
            dataIndex: "total_amount",
            key: "total_amount",
            render: (total_amount: number) => (
                <div className="font-semibold">{total_amount.toLocaleString()}₫</div>
            ),
            sorter: (a: any, b: any) => a.total_amount - b.total_amount,
        },
        {
            title: "Số lượng",
            dataIndex: "id",
            key: "id",
            render: (id, record) => <Badge count={record.items.length} showZero />,
            sorter: (a: any, b: any) => a.items.length - b.items.length,
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status: string) => {
                const config = statusConfig[status] || { color: "default", text: status };
                return <Tag color={config.color}>{config.text}</Tag>;
            },
            filters: [
                { text: "Chờ xác nhận", value: "pending" },
                { text: "Đang xử lý", value: "processing" },
                { text: "Đã giao hàng", value: "shipped" },
                { text: "Đã nhận hàng", value: "delivered" },
                { text: "Đã hủy", value: "cancelled" },
                { text: "Đã hoàn tiền", value: "refunded" },
            ],
            onFilter: (value: any, record: any) => record.status === value,
        },
        {
            title: "Thanh toán",
            dataIndex: "payment_method",
            key: "payment_method",
            render: (_: string, record: any) => {
                const config = paymentConfig[record.status] || { color: "default", text: record.status };
                return <Tag color={config.color}>{config.text}</Tag>;
            },
        },
        {
            title: "Vận chuyển",
            dataIndex: "shipping_method",
            key: "shipping_method",
            render: (shipping_method: string) => {
                const config =
                    shippingConfig[shipping_method] || { color: "default", text: shipping_method };
                return <Tag color={config.color}>{config.text}</Tag>;
            },
        },
        {
            title: "Ngày tạo",
            dataIndex: "created_at",
            key: "created_at",
            render: (date: string) => (
                <Tooltip title={date}>
                    <span>{new Date(date).toLocaleDateString("vi-VN")}</span>
                </Tooltip>
            ),
            sorter: (a: any, b: any) =>
                new Date(a.created_at).getTime() -
                new Date(b.created_at).getTime(),
        },
        {
            title: "Thao tác",
            key: "actions",
            render: (_: any, record: any) => (
                <Dropdown
                    menu={{
                        items: [
                            {
                                key: "view",
                                label: "Xem chi tiết",
                                icon: <EyeOutlined />,
                                onClick: () =>
                                    navigate(`/admin/v1/order/${record.id}`),
                            },
                            {
                                key: "edit",
                                label: "Cập nhật trạng thái",
                                icon: <EditOutlined />,
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
                                    record.status === "delivered" ||
                                    record.status === "cancelled",
                            },
                        ],
                    }}
                    trigger={["click"]}
                >
                    <Button type="text" icon={<MoreOutlined />} />
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
        onChange: setSelectedRowKeys,
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div>Đang tải dữ liệu...</div>
            </div>
        );
    }

    return (
        <>
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Quản lý đơn hàng</h1>
                    <p className="text-gray-600">
                        Theo dõi và quản lý tất cả đơn hàng
                    </p>
                </div>
                <Space>
                    <Button icon={<ExportOutlined />}>Xuất Excel</Button>
                    <Button type="primary">Tạo đơn hàng mới</Button>
                </Space>
            </div>

            {/* Quick Stats */}
            <Row gutter={16}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Tổng đơn hàng"
                            value={orderStats.reduce((sum, stat) => sum + stat.count, 0)}
                            valueStyle={{ color: "#1890ff" }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Chờ xác nhận"
                            value={orderStats.find(stat => stat.status === 'unpaid' || stat.status === 'pending')?.count || 0}
                            valueStyle={{ color: "#faad14" }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Đang xử lý"
                            value={orderStats.find(stat => stat.status === 'processing')?.count || 0}
                            valueStyle={{ color: "#1890ff" }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Hoàn thành"
                            value={orderStats.find(stat => stat.status === 'paid' || stat.status === 'delivered')?.count || 0}
                            valueStyle={{ color: "#52c41a" }}
                        />
                    </Card>
                </Col>
            </Row>

            <Card>
                <div className="flex flex-wrap gap-4 items-center justify-between">
                    <Space>
                        <Input
                            placeholder="Tìm kiếm đơn hàng, khách hàng..."
                            prefix={<SearchOutlined />}
                            style={{ width: 300 }}
                        />
                        <Select placeholder="Trạng thái" style={{ width: 150 }}>
                            <Option value="pending">Chờ xác nhận</Option>
                            <Option value="processing">Đang xử lý</Option>
                            <Option value="completed">Hoàn thành</Option>
                            <Option value="cancelled">Đã hủy</Option>
                        </Select>
                        <Select placeholder="Thanh toán" style={{ width: 150 }}>
                            <Option value="paid">Đã thanh toán</Option>
                            <Option value="pending">Chờ thanh toán</Option>
                            <Option value="failed">Thất bại</Option>
                        </Select>
                    </Space>

                    <Space>
                        {selectedRowKeys.length > 0 && (
                            <Dropdown menu={{ items: bulkActionItems }}>
                                <Button>
                                    Thao tác hàng loạt ({selectedRowKeys.length}
                                    )
                                </Button>
                            </Dropdown>
                        )}
                        <Button icon={<FilterOutlined />}>
                            Bộ lọc nâng cao
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
                    pagination={{
                        total: ordersData?.total || 0,
                        pageSize: 20,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} của ${total} đơn hàng`,
                    }}
                    scroll={{ x: 1200 }}
                />
            </Card>
        </>
    );
};

export default AdminOrders;
