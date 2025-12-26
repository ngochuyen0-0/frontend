// components/admin/UserForm.tsx
import React from 'react';
import { Modal, Form, Input, Select, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
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
        message.success('User created successfully');
      } else {
        // await userApi.updateUser(user!.id, values);
        message.success('User updated successfully');
      }
      onSuccess();
    } catch (error) {
      message.error('Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={type === 'create' ? 'Create New User' : 'Edit User'}
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
          label="Full Name"
          name="fullName"
          rules={[{ required: true, message: 'Please enter full name' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please enter email' },
            { type: 'email', message: 'Please enter valid email' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
          rules={[{ required: true, message: 'Please enter phone number' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true, message: 'Please select role' }]}
        >
          <Select>
            <Select.Option value="user">User</Select.Option>
            <Select.Option value="moderator">Moderator</Select.Option>
            <Select.Option value="admin">Admin</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: 'Please select status' }]}
        >
          <Select>
            <Select.Option value="active">Active</Select.Option>
            <Select.Option value="inactive">Inactive</Select.Option>
            <Select.Option value="banned">Banned</Select.Option>
          </Select>
        </Form.Item>

        {type === 'create' && (
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter password' }]}
          >
            <Input.Password />
          </Form.Item>
        )}

        <Form.Item
          label="Coins"
          name="coins"
          rules={[{ required: true, message: 'Please enter coins' }]}
        >
          <Input type="number" />
        </Form.Item>

        <Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={onClose}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {type === 'create' ? 'Create' : 'Update'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserForm;