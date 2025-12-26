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

  // Mock data for admin
  const mockAdminProfile: AdminProfile = {
    id: 'admin-001',
    avatar: 'https://via.placeholder.com/100',
    fullName: 'Admin Manager',
    email: 'admin@company.com',
    phone: '0123 456 789',
    role: 'Super Admin',
    department: 'IT Department',
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
      message.error('Failed to load profile');
      setLoading(false);
    }
  };

  const handleSave = async (values: any) => {
    setLoading(true);
    try {
      // await adminApi.updateProfile(values);
      message.success('Profile updated successfully');
      setEditing(false);
      loadProfile();
    } catch (error) {
      message.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTwoFactorToggle = async (enabled: boolean) => {
    try {
      // await adminApi.toggleTwoFactor(enabled);
      setProfile(prev => prev ? { ...prev, twoFactorEnabled: enabled } : null);
      message.success(`Two-factor authentication ${enabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      message.error('Operation failed');
    }
  };

  const handleNotificationChange = async (key: string, value: boolean) => {
    try {
      // await adminApi.updateNotificationSettings({ [key]: value });
      setProfile(prev => prev ? {
        ...prev,
        notificationSettings: { ...prev.notificationSettings, [key]: value }
      } : null);
      message.success('Notification settings updated');
    } catch (error) {
      message.error('Update failed');
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
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
                    <span>Admin since {new Date(profile.createdAt).toLocaleDateString('vi-VN')}</span>
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
              {editing ? 'Save Changes' : 'Edit Profile'}
            </Button>
          </div>
        </Card>

        {/* Quick Stats */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={8}>
            <Card className="text-center !shadow-sm">
              <Statistic
                title="Last Login"
                value={new Date(profile.lastLogin).toLocaleDateString('vi-VN')}
                valueStyle={{ fontSize: '16px' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="text-center !shadow-sm">
              <Statistic
                title="Login IP"
                value={profile.loginIp}
                valueStyle={{ fontSize: '16px' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="text-center !shadow-sm">
              <Statistic
                title="2FA Status"
                value={profile.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                valueStyle={{
                  color: profile.twoFactorEnabled ? '#52c41a' : '#ff4d4f',
                  fontSize: '16px'
                }}
              />
            </Card>
          </Col>
        </Row>

        {/* Main Content */}
        <Card className="!shadow-sm">
          <Tabs defaultActiveKey="profile" size="large">
            {/* Personal Information Tab */}
            <TabPane
              tab={
                <span className="flex items-center gap-2">
                  <UserOutlined />
                  Personal Information
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
                    label="Full Name"
                    name="fullName"
                    rules={[{ required: true, message: 'Please enter full name' }]}
                  >
                    <Input prefix={<UserOutlined />} size="large" />
                  </Form.Item>

                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: 'Please enter email' },
                      { type: 'email', message: 'Invalid email' }
                    ]}
                  >
                    <Input prefix={<MailOutlined />} size="large" />
                  </Form.Item>

                  <Form.Item
                    label="Phone"
                    name="phone"
                    rules={[{ required: true, message: 'Please enter phone number' }]}
                  >
                    <Input prefix={<PhoneOutlined />} size="large" />
                  </Form.Item>

                  <Form.Item
                    label="Department"
                    name="department"
                  >
                    <Input size="large" />
                  </Form.Item>
                </div>

                {editing && (
                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button onClick={() => setEditing(false)}>
                      Cancel
                    </Button>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      Save Changes
                    </Button>
                  </div>
                )}
              </Form>

              {!editing && (
                <>
                  <Divider />
                  <Descriptions title="System Information" column={1}>
                    <Descriptions.Item label="User ID">
                      {profile.id}
                    </Descriptions.Item>
                    <Descriptions.Item label="Role">
                      <Tag color="red">{profile.role}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Department">
                      {profile.department}
                    </Descriptions.Item>
                    <Descriptions.Item label="Account Created">
                      {new Date(profile.createdAt).toLocaleString('vi-VN')}
                    </Descriptions.Item>
                  </Descriptions>
                </>
              )}
            </TabPane>

            {/* Security Tab */}
            <TabPane
              tab={
                <span className="flex items-center gap-2">
                  <SafetyOutlined />
                  Security
                </span>
              }
              key="security"
            >
              <div className="space-y-6">
                {/* Two-Factor Authentication */}
                <Card title="Two-Factor Authentication" className="!shadow-sm">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-gray-600 text-sm">
                        Add an extra layer of security to your account
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
                        ✅ Two-factor authentication is enabled for your account.
                      </p>
                    </div>
                  )}
                </Card>

                {/* Password Change */}
                <Card title="Password" className="!shadow-sm">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">Change Password</h4>
                      <p className="text-gray-600 text-sm">
                        Update your password regularly to keep your account secure
                      </p>
                    </div>
                    <Button type="primary" icon={<LockOutlined />}>
                      Change Password
                    </Button>
                  </div>
                </Card>

                {/* Permissions */}
                <Card title="Permissions" className="!shadow-sm">
                  <h4 className="font-medium mb-3">Your Permissions</h4>
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

            {/* Notifications Tab */}
            <TabPane
              tab={
                <span className="flex items-center gap-2">
                  <BellOutlined />
                  Notifications
                </span>
              }
              key="notifications"
            >
              <Card className="!shadow-sm">
                <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-gray-600 text-sm">
                        Receive important updates via email
                      </p>
                    </div>
                    <Switch
                      checked={profile.notificationSettings.email}
                      onChange={(checked) => handleNotificationChange('email', checked)}
                    />
                  </div>

                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Push Notifications</h4>
                      <p className="text-gray-600 text-sm">
                        Get instant notifications in your browser
                      </p>
                    </div>
                    <Switch
                      checked={profile.notificationSettings.push}
                      onChange={(checked) => handleNotificationChange('push', checked)}
                    />
                  </div>

                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">SMS Notifications</h4>
                      <p className="text-gray-600 text-sm">
                        Receive critical alerts via SMS
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

            {/* System Settings Tab */}
            <TabPane
              tab={
                <span className="flex items-center gap-2">
                  <SettingOutlined />
                  System Settings
                </span>
              }
              key="settings"
            >
              <Card className="!shadow-sm">
                <h3 className="text-lg font-medium mb-4">Admin System Settings</h3>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Dashboard Preferences</h4>
                    <p className="text-gray-600 text-sm mb-3">
                      Customize your admin dashboard view
                    </p>
                    <Button type="primary" size="small">
                      Configure Dashboard
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Data Export</h4>
                    <p className="text-gray-600 text-sm mb-3">
                      Export system data and reports
                    </p>
                    <Space>
                      <Button size="small">Export Users</Button>
                      <Button size="small">Export Orders</Button>
                      <Button size="small">Export Products</Button>
                    </Space>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">System Logs</h4>
                    <p className="text-gray-600 text-sm mb-3">
                      View and manage system activity logs
                    </p>
                    <Button size="small">View Logs</Button>
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