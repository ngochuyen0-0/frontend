import React, { Children, useEffect, useState } from 'react';
import {
  Card,
  Button,
  Input,
  Select,
  Tag,
  Space,
  Dropdown,
  Switch,
  Modal,
  Form,
  List,
  Avatar,
  message,
  Collapse
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  StarOutlined,
  StarFilled,
  CaretRightOutlined
} from '@ant-design/icons';
import apiClient from '../../utils/apiClient';
import { toast } from 'sonner';
import { createCategory, getCategories, updateCategory } from '../../services/categoryService';
import type { MenuProps } from 'antd';

const { Option } = Select;
const { TextArea } = Input;
const { Panel } = Collapse;

interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  productCount: number;
  parent_id?: string;
  children?: Category[];
  status: 'ACTIVE' | 'INACTIVE';
}

const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [featuredFilter, setFeaturedFilter] = useState<string>('all');
  const [expandedKeys, setExpandedKeys] = useState<string[]>(['1', '2']); // Mặc định mở một số panel
  const [form] = Form.useForm();


  useEffect(() => {
    getCategories({}).then(res => {
      const data = buildTree(res?.data);
      setCategories(data)
    }).catch(() => {

    })
  }, [])

  const buildTree = (list: Category[]) => {
    const map: Record<string, Category & { children: Category[] }> = {};
    const roots: (Category & { children: Category[] })[] = [];

    list.forEach(item => {
      map[item.id] = { ...item, children: [] };
    });

    list.forEach(item => {
      if (item.parent_id) {
        map[item.parent_id]?.children.push(map[item.id]);
      } else {
        roots.push(map[item.id]);
      }
    });

    return roots;
  };

  // Lấy tất cả categories không có parent (main categories)
  const mainCategories = categories.filter(cat => !cat.parent_id);

  // Filter categories based on search and filters
  const filteredMainCategories = mainCategories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchText.toLowerCase()) ||
      category.description.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all' || category.status === statusFilter;
    const matchesFeatured = featuredFilter === 'all';

    return matchesSearch && matchesStatus && matchesFeatured;
  });

  // Handlers
  const showModal = (category: Category | null = null, isSubcategory: boolean = false) => {
    setEditingCategory(category);

    if (category) {
      form.setFieldsValue({
        ...category,
        parent_id: category.parent_id || (isSubcategory ? '' : undefined)
      });
    } else {
      form.setFieldsValue({
        parent_id: isSubcategory ? '' : undefined,
        status: 'ACTIVE',
        featured: false
      });
    }
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      if (editingCategory) {
        await updateCategory(editingCategory.id, values)
        toast.success('Cập nhật danh mục thành công!');
        getCategories({})
      } else {
        // Add new category
        const newCategory = await createCategory(values)
        setCategories(prev => {
          if (values.parent_id) {
            // Nếu có parent_id, thêm vào children của parent
            return prev.map(cat =>
              cat.id === values.parent_id
                ? { ...cat, children: [...(cat.children || []), newCategory] }
                : cat
            );
          } else {
            // Nếu không có parent_id, thêm vào main categories
            return [...prev, newCategory];
          }
        });
        toast.success('Tạo danh mục thành công!');
      }

      setIsModalVisible(false);
      form.resetFields();
      setEditingCategory(null);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingCategory(null);
  };

  const handleDeleteCategory = (categoryId: string, isSubcategory: boolean = false) => {
    Modal.confirm({
      title: 'Xóa danh mục',
      content: 'Bạn có chắc chắn muốn xóa danh mục này không? Các sản phẩm trong danh mục này sẽ được chuyển sang danh mục chưa phân loại.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        setCategories(prev => {
          if (isSubcategory) {
            // Xóa subcategory - remove từ children array của parent
            return prev.map(cat => ({
              ...cat,
              children: cat.children?.filter(sub => sub.id !== categoryId) || []
            }));
          } else {
            // Xóa main category
            return prev.filter(cat => cat.id !== categoryId);
          }
        });
        message.success('Danh mục đã được xóa thành công!');
      },
    });
  };

  const handleToggleStatus = (categoryId: string, currentStatus: 'ACTIVE' | 'INACTIVE') => {
    setCategories(prev => prev.map(cat =>
      cat.id === categoryId ? { ...cat, status: currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : cat
    ));
    message.success(`Danh mục đã được ${currentStatus === 'ACTIVE' ? 'vô hiệu hóa' : 'kích hoạt'}!`);
  };

  const handleToggleFeatured = (categoryId: string, currentFeatured: boolean) => {
    setCategories(prev => prev.map(cat =>
      cat.id === categoryId ? { ...cat, featured: !currentFeatured } : cat
    ));
    message.success(`Danh mục đã được ${currentFeatured ? 'gỡ khỏi' : 'thêm vào'} nổi bật!`);
  };

  // Action dropdown menu
  const getActionMenu = (category: Category, isSubcategory: boolean = false): MenuProps => ({
    items: [
      {
        key: 'edit',
        label: 'Sửa danh mục',
        icon: <EditOutlined />,
        onClick: () => showModal(category, isSubcategory),
      },
      {
        key: 'add-subcategory',
        label: 'Thêm danh mục con',
        icon: <PlusOutlined />,
        onClick: () => showModal(null, true),
        disabled: isSubcategory // Subcategory không thể có subcategory con
      },
      {
        key: 'toggle-status',
        label: category.status === 'ACTIVE' ? 'Vô hiệu hóa' : 'Kích hoạt',
        icon: category.status === 'ACTIVE' ? <DeleteOutlined /> : <PlusOutlined />,
        onClick: () => handleToggleStatus(category.id, category.status),
      },
      { type: 'divider' },
      {
        key: 'delete',
        label: 'Xóa danh mục',
        icon: <DeleteOutlined />,
        danger: true,
        onClick: () => handleDeleteCategory(category.id, isSubcategory),
      },
    ],
  });

  // Render category item
  const renderCategoryItem = (category: Category, isSubcategory: boolean = false) => (
    <div className={`flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${isSubcategory ? 'bg-gray-50 ml-8' : ''
      }`}>
      <div className="flex items-center gap-3 flex-1">
        <Avatar
          size="large"
          className="bg-blue-100 flex items-center justify-center"
        >
          <span className="text-lg">{category.icon}</span>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">{category.name}</span>
            {isSubcategory && (
              <Tag color="blue">Danh mục con</Tag>
            )}
          </div>
          <p className="text-gray-600 text-sm mt-1">{category.description}</p>
          <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
            <span>{category.productCount} sản phẩm</span>
            {!isSubcategory && category.children && category.children.length > 0 && (
              <span>{category.children.length} danh mục con</span>
            )}
          </div>
        </div>
      </div>

      {/* Status and Featured Tags */}
      <div className="flex items-center gap-3">
        <Tag color={category.status === 'ACTIVE' ? 'green' : 'red'} className="m-0">
          {category.status === 'ACTIVE' ? 'Kích hoạt' : 'Vô hiệu'}
        </Tag>

        <Switch
          checked={category.status === 'ACTIVE'}
          onChange={() => handleToggleStatus(category.id, category.status)}
          size="small"
        />


        <Dropdown
          menu={getActionMenu(category, isSubcategory)}
          trigger={['click']}
          placement="bottomRight"
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Danh mục</h1>
          <p className="text-gray-600">Quản lý danh mục sản phẩm và tổ chức</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
          size="large"
        >
          Thêm danh mục
        </Button>
      </div>

      {/* Controls Bar */}
      <Card className="!shadow-sm">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <Space>
            <Input
              placeholder="Tìm kiếm danh mục..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 280 }}
              size="large"
            />
            <Select
              placeholder="Trạng thái"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 120 }}
              size="large"
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="ACTIVE">Kích hoạt</Option>
              <Option value="INACTIVE">Vô hiệu</Option>
            </Select>
            <Select
              placeholder="Nổi bật"
              value={featuredFilter}
              onChange={setFeaturedFilter}
              style={{ width: 120 }}
              size="large"
            >
              <Option value="all">Tất cả</Option>
              <Option value="featured">Nổi bật</Option>
              <Option value="regular">Thường</Option>
            </Select>
          </Space>

          <div className="text-sm text-gray-500">
            {filteredMainCategories.length} danh mục chính được tìm thấy
          </div>
        </div>
      </Card>

      {/* Categories List với Collapse */}
      <Card className="!shadow-sm">
        <Collapse
          activeKey={expandedKeys}
          onChange={setExpandedKeys}
          expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
          ghost
        >
          {filteredMainCategories.map(category => (
            <Panel
              key={category.id}
              header={
                <div className="flex items-center gap-3">
                  <Avatar
                    size="default"
                    className="bg-blue-100 flex items-center justify-center"
                  >
                    <span className="text-sm">{category.icon}</span>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{category.name}</div>
                    <div className="text-xs text-gray-500">
                      {category.productCount} sản phẩm • {category.children?.length || 0} danh mục con
                    </div>
                  </div>
                </div>
              }
              extra={
                <div className="flex items-center gap-2">
                  <Tag color={category.status === 'ACTIVE' ? 'green' : 'red'}>
                    {category.status === 'ACTIVE' ? 'Kích hoạt' : 'Vô hiệu'}
                  </Tag>
                </div>
              }
            >
              {/* Main Category Item */}
              {renderCategoryItem(category, false)}

              {/* Subcategories */}
              {category.children && category.children.map(subcategory =>
                renderCategoryItem(subcategory, true)
              )}

              {/* Add Subcategory Button */}
              <div className="ml-8 mt-2">
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={() => showModal(null, true)}
                  block
                >
                  Thêm danh mục con cho {category.name}
                </Button>
              </div>
            </Panel>
          ))}
        </Collapse>

        {/* Empty State */}
        {filteredMainCategories.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Không tìm thấy danh mục nào. Tạo danh mục đầu tiên của bạn!
          </div>
        )}
      </Card>

      {/* Add/Edit Category Modal */}
      <Modal
        title={editingCategory ? 'Sửa danh mục' : 'Thêm danh mục mới'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={500}
        okText={editingCategory ? 'Cập nhật danh mục' : 'Tạo danh mục'}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: 'ACTIVE',
            featured: false
          }}
        >
          <Form.Item
            name="name"
            label="Tên danh mục"
            rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}
          >
            <Input placeholder="ví dụ: Túi tote,..." />
          </Form.Item>

          <Form.Item
            name="parent_id"
            label="Danh mục cha"
            help={editingCategory?.parent_id ? "Đây là danh mục con" : "Chọn danh mục cha để tạo danh mục con"}
          >
            <Select
              placeholder="Chọn danh mục cha (tùy chọn)"
              allowClear
            >
              {mainCategories
                .filter(cat => !editingCategory || cat.id !== editingCategory.id) // Không thể chọn chính nó làm parent
                .map(category => (
                  <Option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </Option>
                ))
              }
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
          >
            <TextArea
              rows={3}
              placeholder="Mô tả danh mục này..."
              maxLength={500}
              showCount
            />
          </Form.Item>

          <Form.Item
            name="icon"
            label="Biểu tượng"
          >
            <Input placeholder="ví dụ: 🛍️, 👕, 🏠" />
          </Form.Item>

          <div className="flex gap-4">
            <Form.Item
              name="status"
              label="Trạng thái"
              className="flex-1"
            >
              <Select>
                <Option value="ACTIVE">Kích hoạt</Option>
                <Option value="INACTIVE">Vô hiệu</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="featured"
              label="Nổi bật"
              valuePropName="checked"
              className="flex-1"
            >
              <Switch checkedChildren="Có" unCheckedChildren="Không" />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminCategories;