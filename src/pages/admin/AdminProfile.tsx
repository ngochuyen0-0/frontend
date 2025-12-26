// pages/admin/AdminProfilePage.tsx
import React, { useState, useEffect } from 'react';
import {
  Card,
  Tabs,
  Avatar,
  Button,
  Space,
  Tag,
  Statistic,
  Row,
  Col,
  Descriptions,
  Form,
  Input,
  Select,
  Upload,
  message,
  Switch,
  Divider,
  List
} from 'antd';
import {
  EditOutlined,
  SaveOutlined,
  UserOutlined,
  SafetyOutlined,
  BellOutlined,
  SettingOutlined,
  UploadOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined
} from '@ant-design/icons';

const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

interface AdminProfile {
  id: string;
  avatar: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  permissions: string[];
  lastLogin: string;
  loginIp: string;
  createdAt: string;
  twoFactorEnabled: boolean;
  notificationSettings: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

const AdminProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Mock data cho admin
  const mockAdminProfile: AdminProfile = {
    id: 'admin-001',
    avatar: 'https://via.placeholder.com/100',
    fullName: 'Quản trị viên',
    email: 'admin@company.com',
    phone: '0123 456 789',
    role: 'Quản trị viên cấp cao',
    department: 'Phòng IT',
    permissions: ['users:read', 'users:write', 'products:manage', 'orders:manage', 'settings:manage'],
    lastLogin: '2024-01-20 14:30:25',
    loginIp: '192.168.1.100',
    createdAt: '2023-01-15',
    twoFactorEnabled: true,
    notificationSettings: {
      email: true,
      push: false,
      sms: true
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      // const response = await adminApi.getMyProfile();
      // setProfile(response.data);
      
      setTimeout(() => {
        setProfile(mockAdminProfile);
        setLoading(false);
      }, 500);
    } catch (error) {
      message.error('Tải thông tin hồ sơ thất bại');
      setLoading(false);
    }
  };

  const handleSave = async (values: any) => {
    setLoading(true);
    try {
      // await adminApi.updateProfile(values);
      message.success('Cập nhật hồ sơ thành công');
      setEditing(false);
      loadProfile();
    } catch (error) {
      message.error('Cập nhật thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleTwoFactorToggle = async (enabled: boolean) => {
    try {
      // await adminApi.toggleTwoFactor(enabled);
      setProfile(prev => prev ? { ...prev, twoFactorEnabled: enabled } : null);
      message.success(`Xác thực hai yếu tố đã ${enabled ? 'bật' : 'tắt'}`);
    } catch (error) {
      message.error('Thao tác thất bại');
    }
  };

  const handleNotificationChange = async (key: string, value: boolean) => {
    try {
      // await adminApi.updateNotificationSettings({ [key]: value });
      setProfile(prev => prev ? {
        ...prev,
        notificationSettings: { ...prev.notificationSettings, [key]: value }
      } : null);
      message.success('Cài đặt thông báo đã được cập nhật');
    } catch (error) {
      message.error('Cập nhật thất bại');
    }
  };

  if (!profile) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <Card className="mb-6 !shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar
                  size={100}
                  src={profile.avatar}
                  icon={<UserOutlined />}
                  className="border-4 border-white shadow-lg"
                />
                <Upload
                  showUploadList={false}
                  // beforeUpload={handleAvatarUpload}
                >
                  <Button
                    type="primary"
                    shape="circle"
                    size="small"
                    icon={<UploadOutlined />}
                    className="absolute -bottom-2 -right-2 shadow-lg"
                  />
                </Upload>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {profile.fullName}
                  <Tag color="red" className="ml-2">
                    {profile.role}
                  </Tag>
                </h1>
                <div className="space-y-1 text-gray-600">
                  <div className="flex items-center gap-2">
                    <MailOutlined />
                    <span>{profile.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PhoneOutlined />
                    <span>{profile.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserOutlined />
                    <span>Quản trị viên từ {new Date(profile.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <Button
              type="primary"
              icon={editing ? <SaveOutlined /> : <EditOutlined />}
              loading={loading}
              onClick={editing ? form.submit : () => setEditing(true)}
            >
              {editing ? 'Lưu thay đổi' : 'Chỉnh sửa hồ sơ'}
            </Button>
          </div>
        </Card>

        {/* Thống kê nhanh */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={8}>
            <Card className="text-center !shadow-sm">
              <Statistic
                title="Lần đăng nhập cuối"
                value={new Date(profile.lastLogin).toLocaleDateString('vi-VN')}
                valueStyle={{ fontSize: '16px' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="text-center !shadow-sm">
              <Statistic
                title="IP đăng nhập"
                value={profile.loginIp}
                valueStyle={{ fontSize: '16px' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="text-center !shadow-sm">
              <Statistic
                title="Trạng thái 2FA"
                value={profile.twoFactorEnabled ? 'Đã bật' : 'Đã tắt'}
                valueStyle={{
                  color: profile.twoFactorEnabled ? '#52c41a' : '#ff4d4f',
                  fontSize: '16px'
                }}
              />
            </Card>
          </Col>
        </Row>

        {/* Nội dung chính */}
        <Card className="!shadow-sm">
          <Tabs defaultActiveKey="profile" size="large">
            {/* Tab Thông tin cá nhân */}
            <TabPane
              tab={
                <span className="flex items-center gap-2">
                  <UserOutlined />
                  Thông tin cá nhân
                </span>
              }
              key="profile"
            >
              <Form
                form={form}
                layout="vertical"
                initialValues={profile}
                onFinish={handleSave}
                disabled={!editing}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Form.Item
                    label="Họ và tên đầy đủ"
                    name="fullName"
                    rules={[{ required: true, message: 'Vui lòng nhập họ tên đầy đủ' }]}
                  >
                    <Input prefix={<UserOutlined />} size="large" />
                  </Form.Item>

                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: 'Vui lòng nhập email' },
                      { type: 'email', message: 'Email không hợp lệ' }
                    ]}
                  >
                    <Input prefix={<MailOutlined />} size="large" />
                  </Form.Item>

                  <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                  >
                    <Input prefix={<PhoneOutlined />} size="large" />
                  </Form.Item>

                  <Form.Item
                    label="Phòng ban"
                    name="department"
                  >
                    <Input size="large" />
                  </Form.Item>
                </div>

                {editing && (
                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button onClick={() => setEditing(false)}>
                      Hủy
                    </Button>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      Lưu thay đổi
                    </Button>
                  </div>
                )}
              </Form>

              {!editing && (
                <>
                  <Divider />
                  <Descriptions title="Thông tin hệ thống" column={1}>
                    <Descriptions.Item label="ID người dùng">
                      {profile.id}
                    </Descriptions.Item>
                    <Descriptions.Item label="Vai trò">
                      <Tag color="red">{profile.role}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Phòng ban">
                      {profile.department}
                    </Descriptions.Item>
                    <Descriptions.Item label="Tài khoản tạo lúc">
                      {new Date(profile.createdAt).toLocaleString('vi-VN')}
                    </Descriptions.Item>
                  </Descriptions>
                </>
              )}
            </TabPane>

            {/* Tab Bảo mật */}
            <TabPane
              tab={
                <span className="flex items-center gap-2">
                  <SafetyOutlined />
                  Bảo mật
                </span>
              }
              key="security"
            >
              <div className="space-y-6">
                {/* Xác thực hai yếu tố */}
                <Card title="Xác thực hai yếu tố" className="!shadow-sm">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">Xác thực hai yếu tố</h4>
                      <p className="text-gray-600 text-sm">
                        Thêm một lớp bảo mật bổ sung cho tài khoản của bạn
                      </p>
                    </div>
                    <Switch
                      checked={profile.twoFactorEnabled}
                      onChange={handleTwoFactorToggle}
                    />
                  </div>
                  {profile.twoFactorEnabled && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                      <p className="text-green-800 text-sm">
                        ✅ Xác thực hai yếu tố đã được bật cho tài khoản của bạn.
                      </p>
                    </div>
                  )}
                </Card>

                {/* Đổi mật khẩu */}
                <Card title="Mật khẩu" className="!shadow-sm">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">Đổi mật khẩu</h4>
                      <p className="text-gray-600 text-sm">
                        Cập nhật mật khẩu thường xuyên để giữ cho tài khoản của bạn an toàn
                      </p>
                    </div>
                    <Button type="primary" icon={<LockOutlined />}>
                      Đổi mật khẩu
                    </Button>
                  </div>
                </Card>

                {/* Quyền */}
                <Card title="Quyền" className="!shadow-sm">
                  <h4 className="font-medium mb-3">Quyền của bạn</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.permissions.map(permission => (
                      <Tag key={permission} color="blue">
                        {permission}
                      </Tag>
                    ))}
                  </div>
                </Card>
              </div>
            </TabPane>

            {/* Tab Thông báo */}
            <TabPane
              tab={
                <span className="flex items-center gap-2">
                  <BellOutlined />
                  Thông báo
                </span>
              }
              key="notifications"
            >
              <Card className="!shadow-sm">
                <h3 className="text-lg font-medium mb-4">Tùy chọn thông báo</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Thông báo Email</h4>
                      <p className="text-gray-600 text-sm">
                        Nhận các cập nhật quan trọng qua email
                      </p>
                    </div>
                    <Switch
                      checked={profile.notificationSettings.email}
                      onChange={(checked) => handleNotificationChange('email', checked)}
                    />
                  </div>

                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Thông báo đẩy</h4>
                      <p className="text-gray-600 text-sm">
                        Nhận thông báo tức thì trong trình duyệt của bạn
                      </p>
                    </div>
                    <Switch
                      checked={profile.notificationSettings.push}
                      onChange={(checked) => handleNotificationChange('push', checked)}
                    />
                  </div>

                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Thông báo SMS</h4>
                      <p className="text-gray-600 text-sm">
                        Nhận các cảnh báo quan trọng qua SMS
                      </p>
                    </div>
                    <Switch
                      checked={profile.notificationSettings.sms}
                      onChange={(checked) => handleNotificationChange('sms', checked)}
                    />
                  </div>
                </div>
              </Card>
            </TabPane>

            {/* Tab Cài đặt hệ thống */}
            <TabPane
              tab={
                <span className="flex items-center gap-2">
                  <SettingOutlined />
                  Cài đặt hệ thống
                </span>
              }
              key="settings"
            >
              <Card className="!shadow-sm">
                <h3 className="text-lg font-medium mb-4">Cài đặt hệ thống quản trị</h3>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Tùy chọn bảng điều khiển</h4>
                    <p className="text-gray-600 text-sm mb-3">
                      Tùy chỉnh chế độ xem bảng điều khiển quản trị viên của bạn
                    </p>
                    <Button type="primary" size="small">
                      Cấu hình bảng điều khiển
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Xuất dữ liệu</h4>
                    <p className="text-gray-600 text-sm mb-3">
                      Xuất dữ liệu hệ thống và báo cáo
                    </p>
                    <Space>
                      <Button size="small">Xuất người dùng</Button>
                      <Button size="small">Xuất đơn hàng</Button>
                      <Button size="small">Xuất sản phẩm</Button>
                    </Space>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Nhật ký hệ thống</h4>
                    <p className="text-gray-600 text-sm mb-3">
                      Xem và quản lý nhật ký hoạt động hệ thống
                    </p>
                    <Button size="small">Xem nhật ký</Button>
                  </div>
                </div>
              </Card>
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default AdminProfilePage;