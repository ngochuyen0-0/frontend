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
    const map = {};
    const roots = [];

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
        toast.success('Category updated successfully!');
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
        toast.success('Category created successfully!');
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
      title: 'Delete Category',
      content: 'Are you sure you want to delete this category? Products in this category will be moved to uncategorized.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
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
        message.success('Category deleted successfully!');
      },
    });
  };

  const handleToggleStatus = (categoryId: string, currentStatus: 'ACTIVE' | 'INACTIVE') => {
    setCategories(prev => prev.map(cat =>
      cat.id === categoryId ? { ...cat, status: currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : cat
    ));
    message.success(`Category ${currentStatus === 'ACTIVE' ? 'deactivated' : 'activated'}!`);
  };

  const handleToggleFeatured = (categoryId: string, currentFeatured: boolean) => {
    setCategories(prev => prev.map(cat =>
      cat.id === categoryId ? { ...cat, featured: !currentFeatured } : cat
    ));
    message.success(`Category ${currentFeatured ? 'removed from' : 'added to'} featured!`);
  };

  // Action dropdown menu
  const getActionMenu = (category: Category, isSubcategory: boolean = false) => ({
    items: [
      {
        key: 'edit',
        label: 'Edit Category',
        icon: <EditOutlined />,
        onClick: () => showModal(category, isSubcategory),
      },
      {
        key: 'add-subcategory',
        label: 'Add Subcategory',
        icon: <PlusOutlined />,
        onClick: () => showModal(null, true),
        disabled: isSubcategory // Subcategory không thể có subcategory con
      },
      {
        key: 'toggle-status',
        label: category.status === 'ACTIVE' ? 'Deactivate' : 'Activate',
        icon: category.status === 'ACTIVE' ? <DeleteOutlined /> : <PlusOutlined />,
        onClick: () => handleToggleStatus(category.id, category.status),
      },
      { type: 'divider' },
      {
        key: 'delete',
        label: 'Delete Category',
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
              <Tag color="blue">Subcategory</Tag>
            )}
          </div>
          <p className="text-gray-600 text-sm mt-1">{category.description}</p>
          <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
            <span>{category.productCount} products</span>
            {!isSubcategory && category.children && category.children.length > 0 && (
              <span>{category.children.length} children</span>
            )}
          </div>
        </div>
      </div>

      {/* Status and Featured Tags */}
      <div className="flex items-center gap-3">
        <Tag color={category.status === 'ACTIVE' ? 'green' : 'red'} className="m-0">
          {category.status === 'ACTIVE' ? 'Active' : 'INACTIVE'}
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
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600">Manage product categories and organization</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
          size="large"
        >
          Add Category
        </Button>
      </div>

      {/* Controls Bar */}
      <Card className="!shadow-sm">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <Space>
            <Input
              placeholder="Search categories..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 280 }}
              size="large"
            />
            <Select
              placeholder="Status"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 120 }}
              size="large"
            >
              <Option value="all">All Status</Option>
              <Option value="ACTIVE">Active</Option>
              <Option value="INACTIVE">INACTIVE</Option>
            </Select>
            <Select
              placeholder="Featured"
              value={featuredFilter}
              onChange={setFeaturedFilter}
              style={{ width: 120 }}
              size="large"
            >
              <Option value="all">All</Option>
              <Option value="featured">Featured</Option>
              <Option value="regular">Regular</Option>
            </Select>
          </Space>

          <div className="text-sm text-gray-500">
            {filteredMainCategories.length} main categories found
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
                      {category.productCount} products • {category.children?.length || 0} children
                    </div>
                  </div>
                </div>
              }
              extra={
                <div className="flex items-center gap-2">
                  <Tag color={category.status === 'ACTIVE' ? 'green' : 'red'}>
                    {category.status === 'ACTIVE' ? 'Active' : 'INACTIVE'}
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
                  Add Subcategory to {category.name}
                </Button>
              </div>
            </Panel>
          ))}
        </Collapse>

        {/* Empty State */}
        {filteredMainCategories.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No categories found. Create your first category!
          </div>
        )}
      </Card>

      {/* Add/Edit Category Modal */}
      <Modal
        title={editingCategory ? 'Edit Category' : 'Add New Category'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={500}
        okText={editingCategory ? 'Update Category' : 'Create Category'}
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
            label="Category Name"
            rules={[{ required: true, message: 'Please enter category name' }]}
          >
            <Input placeholder="e.g., Electronics, Clothing..." />
          </Form.Item>

          <Form.Item
            name="parent_id"
            label="Parent Category"
            help={editingCategory?.parent_id ? "This is a subcategory" : "Select parent category to create subcategory"}
          >
            <Select
              placeholder="Select parent category (optional)"
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
            label="Description"
          >
            <TextArea
              rows={3}
              placeholder="Describe this category..."
              maxLength={200}
              showCount
            />
          </Form.Item>

          <Form.Item
            name="icon"
            label="Icon"
          >
            <Input placeholder="e.g., 🛍️, 👕, 🏠" />
          </Form.Item>

          <div className="flex gap-4">
            <Form.Item
              name="status"
              label="Status"
              className="flex-1"
            >
              <Select>
                <Option value="ACTIVE">Active</Option>
                <Option value="INACTIVE">INACTIVE</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="featured"
              label="Featured"
              valuePropName="checked"
              className="flex-1"
            >
              <Switch checkedChildren="Yes" unCheckedChildren="No" />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminCategories;