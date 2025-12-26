// pages/admin/UserManagement.tsx
import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Button,
  Input,
  Select,
  Tag,
  Space,
  Modal,
  Form,
  DatePicker,
  message,
  Popconfirm,
  Tooltip,
  Row,
  Col,
  Statistic
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined,
  UserAddOutlined,
  ExportOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { User, UserFilters } from '../../types/user';
import UserDetailModal from '../../components/admin/UserDetailModal';
import UserForm from '../../components/admin/UserForm';
import { getUserProfiles } from '../../services/userService';
import { UserProfile, UserProfiles } from '../../types/profile';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<UserProfiles>();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    role: '',
    status: '',
    dateRange: ['', '']
  });
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [formType, setFormType] = useState<'create' | 'edit'>('create');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);


  useEffect(() => {
    loadUsers();
  }, [filters]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      getUserProfiles({}).then(res => {
        setUsers(res);
        setLoading(false);
      }).catch(err => {
      })
    } catch (error) {
      message.error('Failed to load users');
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
  };

  const handleRoleFilter = (value: string) => {
    setFilters(prev => ({ ...prev, role: value }));
  };

  const handleStatusFilter = (value: string) => {
    setFilters(prev => ({ ...prev, status: value }));
  };

  const handleDateRange = (dates: any) => {
    setFilters(prev => ({
      ...prev,
      dateRange: dates ? [dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD')] : ['', '']
    }));
  };

  const handleViewDetail = (user: UserProfile) => {
    setSelectedUser(user);
    setDetailModalVisible(true);
  };

  const handleEdit = (user: UserProfile) => {
    setSelectedUser(user);
    setFormType('edit');
    setFormModalVisible(true);
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setFormType('create');
    setFormModalVisible(true);
  };

  const handleDelete = async (userId: string) => {
    try {
      // await userApi.deleteUser(userId);
      message.success('User deleted successfully');
      loadUsers();
    } catch (error) {
      message.error('Failed to delete user');
    }
  };

  const handleBulkDelete = () => {
    Modal.confirm({
      title: 'Delete Selected Users',
      content: `Are you sure you want to delete ${selectedRowKeys.length} users?`,
      onOk: async () => {
        // await userApi.bulkDeleteUsers(selectedRowKeys as string[]);
        message.success(`Deleted ${selectedRowKeys.length} users`);
        setSelectedRowKeys([]);
        loadUsers();
      }
    });
  };

  const handleExport = () => {
    message.info('Export feature coming soon...');
  };

  const columns: ColumnsType<UserProfile> = [
    {
      title: 'User',
      dataIndex: 'fullName',
      key: 'user',
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <div>
            <div className="font-medium">{text}</div>
            <div className="text-gray-500 text-sm">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={
          role === 'admin' ? 'red' :
            role === 'moderator' ? 'blue' : 'green'
        }>
          {role.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={
          status === 'active' ? 'green' :
            status === 'banned' ? 'red' : 'orange'
        }>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Registration Date',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Coins',
      dataIndex: 'id',
      key: 'id',
      render: (id, record) => (
        <Tag color="gold">{record.loyalty_points?.find(p=>p.source=="daily_login")?.points} xu</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete User"
            description="Are you sure to delete this user?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const stats = {
    totalUsers: users?.data.length,
    activeUsers: users?.data.filter(u => u?.status === 'ACTIVE').length,
    newUsersToday: users?.data.filter(u =>
      new Date(u.created_at || "").toDateString() === new Date().toDateString()
    ).length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage your customers and their data</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
          size="large"
        >
          Add New User
        </Button>
      </div>

      {/* Statistics Cards */}
      <Row gutter={16}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={stats.totalUsers}
              prefix={<UserAddOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Active Users"
              value={stats.activeUsers}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic title="New Today" value={stats.newUsersToday} />
          </Card>
        </Col>
      </Row>

      {/* Filters Card */}
      <Card>
        <div className="flex flex-wrap gap-4 items-end mb-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium mb-2">Search</label>
            <Search
              placeholder="Search by name, email, phone..."
              allowClear
              onSearch={handleSearch}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ width: 120 }}>
            <label className="block text-sm font-medium mb-2">Role</label>
            <Select
              placeholder="All Roles"
              style={{ width: '100%' }}
              onChange={handleRoleFilter}
              allowClear
            >
              <Option value="admin">Admin</Option>
              <Option value="moderator">Moderator</Option>
              <Option value="user">User</Option>
            </Select>
          </div>

          <div style={{ width: 120 }}>
            <label className="block text-sm font-medium mb-2">Status</label>
            <Select
              placeholder="All Status"
              style={{ width: '100%' }}
              onChange={handleStatusFilter}
              allowClear
            >
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
              <Option value="banned">Banned</Option>
            </Select>
          </div>

          <div style={{ width: 250 }}>
            <label className="block text-sm font-medium mb-2">Registration Date</label>
            <RangePicker
              style={{ width: '100%' }}
              onChange={handleDateRange}
            />
          </div>

          <div className="flex gap-2">
            <Button
              icon={<ReloadOutlined />}
              onClick={loadUsers}
            >
              Refresh
            </Button>
            <Button
              icon={<ExportOutlined />}
              onClick={handleExport}
            >
              Export
            </Button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedRowKeys.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 rounded border">
            <Space>
              <span>{selectedRowKeys.length} users selected</span>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={handleBulkDelete}
                size="small"
              >
                Delete Selected
              </Button>
              <Button
                onClick={() => setSelectedRowKeys([])}
                size="small"
              >
                Clear Selection
              </Button>
            </Space>
          </div>
        )}

        {/* Users Table */}
        <Table
          columns={columns}
          dataSource={users?.data}
          rowKey="id"
          loading={loading}
          rowSelection={rowSelection}
          scroll={{ x: 1000 }}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
        />
      </Card>

      {/* Modals */}
      <UserDetailModal
        user={selectedUser}
        visible={detailModalVisible}
        onClose={() => setDetailModalVisible(false)}
      />

      <UserForm
        user={{
          fullName: selectedUser?.user_info?.full_name,
          phone: selectedUser?.user_info?.phone,
          email: selectedUser?.email || "",
          coins: selectedUser?.loyalty_points?.find(p=>p.source=="daily_login")?.points || 0,
          id: selectedUser?.id || "",
          lastLogin: "",
          orders: 0,
          registrationDate: selectedUser?.created_at || "",
          role: selectedUser?.role || "ADMIN",
          status: selectedUser?.status || "ACTIVE",
          totalSpent: 0,
        }}
        type={formType}
        visible={formModalVisible}
        onClose={() => setFormModalVisible(false)}
        onSuccess={() => {
          setFormModalVisible(false);
          loadUsers();
        }}
      />
    </div>
  );
};

export default AdminUsers;