// components/profile/PersonalInfo.tsx
import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Space,
  message,
  Upload,
  Avatar
} from 'antd';
import {
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  UploadOutlined,
  UserOutlined
} from '@ant-design/icons';
import { UserProfile } from '../../types/profile';

const { Option } = Select;
const { TextArea } = Input;

interface PersonalInfoProps {
  profile: UserProfile;
  onUpdate: () => void;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ profile, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSave = async (values: any) => {
    setLoading(true);
    try {
      // await profileApi.updateProfile(values);
      message.success('Cập nhật thông tin thành công');
      setEditing(false);
      onUpdate();
    } catch (error) {
      message.error('Cập nhật thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setEditing(false);
  };

  const handleEdit = () => {
    form.setFieldsValue({
      ...profile,
      dateOfBirth: profile.dateOfBirth ? moment(profile.dateOfBirth) : null
    });
    setEditing(true);
  };

  return (
    <div className="space-y-6">
      {/* Avatar Section */}
      <Card title="Ảnh đại diện" className="!shadow-sm">
        <div className="flex items-center gap-6">
          <Avatar
            size={100}
            src={profile.avatar}
            icon={<UserOutlined />}
            className="border-2 border-gray-200"
          />
          <div className="flex-1">
            <div className="mb-4">
              <p className="text-gray-600 mb-2">
                Ảnh đại diện giúp mọi người nhận ra bạn dễ dàng hơn
              </p>
              <Upload
                accept="image/*"
                showUploadList={false}
                // beforeUpload={handleAvatarUpload}
              >
                <Button icon={<UploadOutlined />}>
                  Thay đổi ảnh đại diện
                </Button>
              </Upload>
            </div>
          </div>
        </div>
      </Card>

      {/* Personal Information */}
      <Card 
        title="Thông tin cá nhân"
        extra={
          !editing ? (
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={handleEdit}
            >
              Chỉnh sửa
            </Button>
          ) : null
        }
        className="!shadow-sm"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          disabled={!editing}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Họ và tên"
              name="fullName"
              rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { type: 'email', message: 'Email không hợp lệ' }
              ]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              label="Ngày sinh"
              name="dateOfBirth"
            >
              <DatePicker
                format="DD/MM/YYYY"
                style={{ width: '100%' }}
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Giới tính"
              name="gender"
            >
              <Select size="large">
                <Option value="male">Nam</Option>
                <Option value="female">Nữ</Option>
                <Option value="other">Khác</Option>
              </Select>
            </Form.Item>
          </div>

          {/* Address Section */}
          <div className="border-t pt-4 mt-4">
            <h4 className="text-lg font-medium mb-4">Địa chỉ</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                label="Thành phố"
                name={['address', 'city']}
              >
                <Input size="large" />
              </Form.Item>

              <Form.Item
                label="Quận/Huyện"
                name={['address', 'district']}
              >
                <Input size="large" />
              </Form.Item>

              <Form.Item
                label="Phường/Xã"
                name={['address', 'ward']}
              >
                <Input size="large" />
              </Form.Item>

              <Form.Item
                label="Địa chỉ cụ thể"
                name={['address', 'street']}
              >
                <Input size="large" />
              </Form.Item>
            </div>
          </div>

          {/* Action Buttons */}
          {editing && (
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                onClick={handleCancel}
                icon={<CloseOutlined />}
              >
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<SaveOutlined />}
              >
                Lưu thay đổi
              </Button>
            </div>
          )}
        </Form>
      </Card>

      {/* Account Security */}
      <Card title="Bảo mật tài khoản" className="!shadow-sm">
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Đổi mật khẩu</h4>
              <p className="text-gray-600 text-sm">
                Cập nhật mật khẩu để bảo vệ tài khoản
              </p>
            </div>
            <Button type="link">
              Thay đổi
            </Button>
          </div>

          <div className="flex justify-between items-center p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Xác minh 2 bước</h4>
              <p className="text-gray-600 text-sm">
                Thêm lớp bảo mật cho tài khoản
              </p>
            </div>
            <Button type="link">
              Thiết lập
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PersonalInfo;