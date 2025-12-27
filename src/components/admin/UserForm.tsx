// components/admin/UserForm.tsx
import React from 'react';
import { Modal, Form, Input, Select, Button, message } from 'antd';
import { User } from '../../types/user';

interface UserFormProps {
  user: User | null;
  type: 'create' | 'edit';
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const UserForm: React.FC<UserFormProps> = ({
  user,
  type,
  visible,
  onClose,
  onSuccess
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (visible && user) {
      form.setFieldsValue(user);
    } else if (visible) {
      form.resetFields();
    }
  }, [visible, user, form]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      if (type === 'create') {
        // await userApi.createUser(values);
        message.success('Tạo người dùng thành công');
      } else {
        // await userApi.updateUser(user!.id, values);
        message.success('Cập nhật người dùng thành công');
      }
      onSuccess();
    } catch (error) {
      message.error('Thao tác thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={type === 'create' ? 'Tạo người dùng mới' : 'Chỉnh sửa người dùng'}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Họ và tên"
          name="fullName"
          rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Vui lòng nhập email hợp lệ' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Vai trò"
          name="role"
          rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
        >
          <Select>
            <Select.Option value="user">Người dùng</Select.Option>
            <Select.Option value="moderator">Quản trị viên</Select.Option>
            <Select.Option value="admin">Quản trị hệ thống</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Trạng thái"
          name="status"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
        >
          <Select>
            <Select.Option value="active">Hoạt động</Select.Option>
            <Select.Option value="inactive">Không hoạt động</Select.Option>
            <Select.Option value="banned">Bị cấm</Select.Option>
          </Select>
        </Form.Item>

        {type === 'create' && (
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          >
            <Input.Password />
          </Form.Item>
        )}

        <Form.Item
          label="Số xu"
          name="coins"
          rules={[{ required: true, message: 'Vui lòng nhập số xu' }]}
        >
          <Input type="number" />
        </Form.Item>

        <Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={onClose}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {type === 'create' ? 'Tạo' : 'Cập nhật'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserForm;