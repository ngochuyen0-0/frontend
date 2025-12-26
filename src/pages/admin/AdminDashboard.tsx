import {
    DollarOutlined,
    ShoppingOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Card, Col, Progress, Row, Statistic, Table, Tag } from "antd";
import React from "react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const AdminDashboard: React.FC = () => {
    // Mock data cho biểu đồ
    const revenueData = [
        { month: "Th1", revenue: 40000000, profit: 12000000 },
        { month: "Th2", revenue: 30000000, profit: 9000000 },
        { month: "Th3", revenue: 50000000, profit: 15000000 },
        { month: "Th4", revenue: 27800000, profit: 8000000 },
        { month: "Th5", revenue: 18900000, profit: 6000000 },
        { month: "Th6", revenue: 60000000, profit: 18000000 },
    ];

    const categoryData = [
        { name: "Giày thể thao", value: 35, color: "#8884d8" },
        { name: "Quần áo", value: 25, color: "#82ca9d" },
        { name: "Phụ kiện", value: 20, color: "#ffc658" },
        { name: "Thiết bị", value: 15, color: "#ff8042" },
        { name: "Khác", value: 5, color: "#0088fe" },
    ];

    const salesData = [
        { day: "T2", sales: 12, returns: 2 },
        { day: "T3", sales: 19, returns: 1 },
        { day: "T4", sales: 8, returns: 3 },
        { day: "T5", sales: 15, returns: 1 },
        { day: "T6", sales: 22, returns: 4 },
        { day: "T7", sales: 18, returns: 2 },
        { day: "CN", sales: 14, returns: 1 },
    ];

    // const statusColors: { [key: string]: string } = {
    //     completed: "green",
    //     processing: "blue",
    //     pending: "orange",
    //     cancelled: "red",
    // };

    const recentOrders = [
        {
            id: "ORD-001",
            customer: "Nguyễn Văn A",
            amount: 1200000,
            status: "Đã hoàn thành",
        },
        {
            id: "ORD-002",
            customer: "Trần Thị B",
            amount: 850000,
            status: "Đang xử lý",
        },
        {
            id: "ORD-003",
            customer: "Lê Văn C",
            amount: 2100000,
            status: "Chờ xác nhận",
        },
    ];

    const columns = [
        { title: "Mã đơn", dataIndex: "id", key: "id" },
        { title: "Khách hàng", dataIndex: "customer", key: "customer" },
        {
            title: "Số tiền",
            dataIndex: "amount",
            key: "amount",
            render: (amount: number) => `${amount.toLocaleString()}₫`,
        },
        { title: "Trạng thái đơn hàng", dataIndex: "status", key: "status" },
    ];

    const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(value)
  }
    return (
        <>
            {/* <h1 className="text-2xl font-bold mb-6">Dashboard</h1> */}

            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Bảng điều khiển</h1>
                <div className="text-sm text-gray-500">
                    Cập nhật lúc: {new Date().toLocaleString("vi-VN")}
                </div>
            </div>

            {/* Statistics Cards */}
            <Row gutter={[16, 16]} className="mb-6">
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Tổng doanh thu"
                            value={112893}
                            precision={2}
                            valueStyle={{ color: "#3f8600" }}
                            prefix={<DollarOutlined />}
                            suffix="₫"
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Đơn hàng"
                            value={93}
                            valueStyle={{ color: "#cf1322" }}
                            prefix={<ShoppingOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Người dùng"
                            value={1128}
                            valueStyle={{ color: "#1890ff" }}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Tỷ lệ chuyển đổi"
                            value={9.3}
                            precision={2}
                            valueStyle={{ color: "#3f8600" }}
                            suffix="%"
                        />
                    </Card>
                </Col>
            </Row>

            {/* Charts Row 1 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card 
            title="Doanh thu theo tháng"
            extra={<Tag color="blue">6 tháng gần đây</Tag>}
            className="h-auto"
          >
                <ResponsiveContainer width="100%" height={350} >
                    <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis
                            tick={{fill: '#0088fe'}}
                        tickFormatter={value => `${(value / 1000000).toFixed(0)}M`}
                        />
                        <Tooltip 
                        formatter={(value) => [formatCurrency(Number(value)), 'Doanh thu']}
                        />
                        <Legend />
                        <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#8884d8" 
                        strokeWidth={2}
                        name="Doanh thu"
                        />
                        <Line 
                        type="monotone" 
                        dataKey="profit" 
                        stroke="#82ca9d" 
                        strokeWidth={2}
                        name="Lợi nhuận"
                        />
                    </LineChart>
                </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card 
            title="Doanh số bán hàng theo ngày" 
            extra={<Tag color="green">Tuần này</Tag>}
            className="h-auto"
          >
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#8884d8" name="Đơn hàng" />
                <Bar dataKey="returns" fill="#ff8042" name="Trả hàng" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Charts Row 2 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card 
            title="Phân loại danh mục" 
            className="h-auto"
          >
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent as number * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Tỷ lệ']} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Thống kê trạng thái đơn hàng" className="h-80">
            <div className="space-y-6 pt-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Đã hoàn thành</span>
                  <span className="font-semibold">45%</span>
                </div>
                <Progress percent={45} strokeColor="#52c41a" size="small" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Đang xử lý</span>
                  <span className="font-semibold">30%</span>
                </div>
                <Progress percent={30} strokeColor="#1890ff" size="small" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Chờ xác nhận</span>
                  <span className="font-semibold">20%</span>
                </div>
                <Progress percent={20} strokeColor="#faad14" size="small" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Đã hủy</span>
                  <span className="font-semibold">5%</span>
                </div>
                <Progress percent={5} strokeColor="#ff4d4f" size="small" />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Hiệu suất hệ thống" className="h-80">
            <div className="space-y-6 pt-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Sử dụng CPU</span>
                  <span className="font-semibold">65%</span>
                </div>
                <Progress percent={65} strokeColor="#13c2c2" size="small" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Bộ nhớ</span>
                  <span className="font-semibold">42%</span>
                </div>
                <Progress percent={42} strokeColor="#722ed1" size="small" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Dung lượng đĩa</span>
                  <span className="font-semibold">78%</span>
                </div>
                <Progress percent={78} strokeColor="#eb2f96" size="small" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Mạng</span>
                  <span className="font-semibold">35%</span>
                </div>
                <Progress percent={35} strokeColor="#52c41a" size="small" />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

            {/* Recent Orders */}
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                    <Card
                        title="Đơn hàng gần đây"
                        extra={<a href="/admin/orders">Xem tất cả</a>}
                    >
                        <Table
                            dataSource={recentOrders}
                            columns={columns}
                            pagination={false}
                            size="small"
                            rowKey='id'
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card title="Thống kê trạng thái">
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span>Đã hoàn thành</span>
                                    <span>45%</span>
                                </div>
                                <Progress percent={45} strokeColor="#52c41a" />
                            </div>
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span>Đang xử lý</span>
                                    <span>30%</span>
                                </div>
                                <Progress percent={30} strokeColor="#1890ff" />
                            </div>
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span>Chờ xác nhận</span>
                                    <span>25%</span>
                                </div>
                                <Progress percent={25} strokeColor="#faad14" />
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default AdminDashboard;
