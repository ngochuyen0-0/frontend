import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Form,
  Input,
  Select,
  Table,
  InputNumber,
  Space,
  Typography,
  Tag,
  Divider,
  message,
  DatePicker,
  Modal
} from 'antd';
import {
  PlusOutlined,
  MinusCircleOutlined,
  SaveOutlined,
  CloseOutlined,
  CheckOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useProductStore } from '../../store/useProductStore';
import { useBrandStore } from '../../store/useBrandStore';
import { Product } from '../../types/product';
import { Brand } from '../../types/brand';

const { Title, Text } = Typography;
const { Option } = Select;

interface ImportOrderItem {
  key: number;
  productId: string;
  productName: string;
  variantId: string;
  variantInfo: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  brand: string;
  category: string;
}

interface ProductVariant {
  id?: string;
  product_id?: string;
  sku?: string;
  size?: string;
  price?: number;
  stock_quantity?: number;
  attributes?: Record<string, any>;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  color?: string;
  [key: string]: any; // Cho phép các thuộc tính khác
}

const CreateImportOrder: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { products, getProducts, variants, getProductVariants } = useProductStore();
  const { brands, getBrands } = useBrandStore();
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');
  const [items, setItems] = useState<ImportOrderItem[]>([
    {
      key: Date.now(),
      productId: '',
      productName: '',
      variantId: '',
      variantInfo: '',
      quantity: 1,
      unitPrice: 0,
      totalAmount: 0,
      brand: '',
      category: ''
    }
  ]);

  // Load danh sách sản phẩm và thương hiệu khi component mount
  useEffect(() => {
    getProducts({});
    getBrands({
      id: "",
      searchKeyword: "",
      page: 1,
      row: 100, // Lấy nhiều thương hiệu
    });
  }, [getProducts, getBrands]);

  // Cập nhật thông tin sản phẩm khi chọn sản phẩm
  const updateProductInfo = (productId: string, index: number) => {
    const selectedProduct = products.find((p: Product) => p.id === productId);
    if (selectedProduct) {
      // Kiểm tra nếu sản phẩm có thương hiệu không khớp với nhà cung cấp đã chọn
      if (selectedSupplier && selectedProduct.brand?.name !== selectedSupplier) {
        message.warning(`Sản phẩm "${selectedProduct.name}" không thuộc thương hiệu "${selectedSupplier}" đã chọn.`);
      }
      
      const updatedItems = [...items];
      updatedItems[index].productName = selectedProduct.name;
      updatedItems[index].brand = selectedProduct.brand?.name || '';
      updatedItems[index].category = selectedProduct.category?.name || '';
      setItems(updatedItems);
      
      // Cập nhật form
      form.setFieldsValue({
        items: updatedItems
      });
    }
  };

  // Cập nhật thông tin biến thể khi chọn
  const updateVariantInfo = (variantId: string, index: number) => {
    const selectedVariant: any = variants.find((v: any) => v.id === variantId);
    if (selectedVariant) {
      const updatedItems = [...items];
      updatedItems[index].variantInfo = `${selectedVariant.size ? `Size: ${selectedVariant.size}` : ''} ${selectedVariant.color ? `Màu: ${selectedVariant.color}` : ''}`.trim();
      setItems(updatedItems);
      
      // Cập nhật form
      form.setFieldsValue({
        items: updatedItems
      });
    }
  };

  // Cột cho bảng sản phẩm
  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'productId',
      key: 'product',
      width: 200,
      render: (value: string, record: any, index: number) => (
        <Form.Item
          name={['items', index, 'productId']}
          rules={[{ required: true, message: 'Vui lòng chọn sản phẩm' }]}
        >
          <Select
            placeholder="Chọn sản phẩm"
            onChange={(val) => {
              updateProductInfo(val, index);
              // Khi chọn sản phẩm mới, xóa biến thể đã chọn trước đó
              const updatedItems = [...items];
              updatedItems[index].variantId = '';
              updatedItems[index].variantInfo = '';
              setItems(updatedItems);
              form.setFieldsValue({
                items: updatedItems
              });
            }}
            showSearch
          >
            {products
              .filter(product =>
                !selectedSupplier ||
                !product.brand ||
                product.brand.name === selectedSupplier
              )
              .map((product: Product) => (
                <Option key={product.id} value={product.id}>
                  {product.name} ({product.brand?.name || 'Không có thương hiệu'})
                </Option>
              ))}
          </Select>
        </Form.Item>
      ),
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
      render: (value: string) => <Text ellipsis={{ tooltip: value }}>{value}</Text>,
    },
    {
      title: 'Biến thể',
      dataIndex: 'variantId',
      key: 'variant',
      width: 150,
      render: (value: string, record: any, index: number) => (
        <Form.Item
          name={['items', index, 'variantId']}
          rules={[{ required: true, message: 'Vui lòng chọn biến thể' }]}
        >
          <Select
            placeholder="Chọn biến thể"
            disabled={!record.productId}
            onChange={(val) => updateVariantInfo(val, index)}
            showSearch
          >
            {record.productId &&
              products
                .find((p: Product) => p.id === record.productId)
                ?.variants
                ?.map((variant: ProductVariant, idx: number) => (
                  <Option key={variant.id} value={variant.id}>
                    {variant.size && `Size: ${variant.size}`} {variant.color && `Màu: ${variant.color}`}
                  </Option>
                ))
            }
          </Select>
        </Form.Item>
      ),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      render: (value: number, record: any, index: number) => (
        <Form.Item
          name={['items', index, 'quantity']}
          rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
        >
          <InputNumber
            min={1}
            style={{ width: '100%' }}
            onChange={(val) => {
              const updatedItems = [...items];
              updatedItems[index].quantity = val || 0;
              updatedItems[index].totalAmount = (val || 0) * updatedItems[index].unitPrice;
              setItems(updatedItems);
              
              // Cập nhật form
              form.setFieldsValue({
                items: updatedItems
              });
            }}
          />
        </Form.Item>
      ),
    },
    {
      title: 'Đơn giá nhập',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 120,
      render: (value: number, record: any, index: number) => (
        <Form.Item
          name={['items', index, 'unitPrice']}
          rules={[{ required: true, message: 'Vui lòng nhập đơn giá' }]}
        >
          <InputNumber
            min={0}
            formatter={value => `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value: string | undefined) => value ? parseFloat(value.replace(/\₫\s?|(,*)/g, '')) : 0}
            style={{ width: '100%' }}
            onChange={(val) => {
              const updatedItems = [...items];
              updatedItems[index].unitPrice = val || 0;
              updatedItems[index].totalAmount = updatedItems[index].quantity * (val || 0);
              setItems(updatedItems);
              
              // Cập nhật form
              form.setFieldsValue({
                items: updatedItems
              });
            }}
          />
        </Form.Item>
      ),
    },
    {
      title: 'Thành tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
      render: (value: number) => (
        <Text strong>
          {value ? `₫${value.toLocaleString()}` : '₫0'}
        </Text>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 80,
      render: (_, __, index) => (
        <Button
          type="text"
          danger
          icon={<MinusCircleOutlined />}
          onClick={() => {
            if (items.length > 1) {
              const newItems = [...items];
              newItems.splice(index, 1);
              setItems(newItems);
              form.setFieldsValue({
                items: newItems
              });
            } else {
              message.warning('Phải có ít nhất một sản phẩm trong đơn hàng');
            }
          }}
        />
      ),
    },
  ];

  // Tính tổng tiền đơn hàng
  const totalAmount = items.reduce((sum, item) => sum + item.totalAmount, 0);

  const handleAddItem = () => {
    const newItem = {
      key: Date.now(),
      productId: '',
      productName: '',
      variantId: '',
      variantInfo: '',
      quantity: 1,
      unitPrice: 0,
      totalAmount: 0,
      brand: '',
      category: ''
    };
    setItems([...items, newItem]);
  };

  const onFinish = (values: any) => {
    console.log('Form values:', values);
    
    // Kiểm tra xem có ít nhất một sản phẩm không
    if (!values.items || values.items.length === 0 || values.items.every((item: any) => !item.productId)) {
      message.error('Vui lòng thêm ít nhất một sản phẩm vào đơn hàng');
      return;
    }
    
    // Tạo đơn hàng nhập
    message.success('Tạo đơn hàng nhập thành công!');
    navigate('/admin/v1/import-orders');
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
    message.error('Vui lòng kiểm tra lại thông tin');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Title level={2} className="mb-2">Tạo đơn hàng nhập mới</Title>
        <Text type="secondary">
          Tạo đơn hàng nhập để bổ sung hàng hóa từ nhà cung cấp
        </Text>
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          initialValues={{
            supplier_name: '',
            supplier_contact: '',
            estimated_delivery_date: null,
            notes: ''
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Form.Item
              label="Nhà cung cấp (Thương hiệu)"
              name="supplier_name"
              rules={[{ required: true, message: 'Vui lòng chọn nhà cung cấp' }]}
            >
              <Select
                placeholder="Chọn nhà cung cấp (thương hiệu)"
                showSearch
                onChange={(value) => setSelectedSupplier(value)}
              >
                {brands.map((brand: any) => (
                  <Option key={brand?.id} value={brand?.name}>
                    {brand?.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Liên hệ nhà cung cấp"
              name="supplier_contact"
              rules={[
                { required: true, message: 'Vui lòng nhập thông tin liên hệ' },
                { pattern: /^0\d{9,10}$/, message: 'Số điện thoại không hợp lệ' }
              ]}
            >
              <Input placeholder="Số điện thoại hoặc email" />
            </Form.Item>

            <Form.Item
              label="Ngày dự kiến nhận hàng"
              name="estimated_delivery_date"
              rules={[{ required: true, message: 'Vui lòng chọn ngày dự kiến nhận hàng' }]}
            >
              <DatePicker
                style={{ width: '100%' }}
                placeholder="Chọn ngày dự kiến nhận"
              />
            </Form.Item>

            <Form.Item
              label="Tổng giá trị đơn hàng"
              name="total_amount"
            >
              <Input 
                readOnly 
                value={`₫${totalAmount.toLocaleString()}`}
                style={{ fontWeight: 'bold' }}
              />
            </Form.Item>
          </div>

          <Divider orientation="left">Danh sách sản phẩm cần nhập</Divider>
          
          <div className="mb-4">
            <Button 
              type="dashed" 
              onClick={handleAddItem}
              icon={<PlusOutlined />}
              block
            >
              Thêm sản phẩm
            </Button>
          </div>

          <Form.List name="items">
            {() => (
              <Table
                columns={columns}
                dataSource={items}
                pagination={false}
                rowKey="key"
                summary={() => (
                  <Table.Summary>
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0} colSpan={5}>
                        <Text strong>Tổng cộng</Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1}>
                        <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>
                          ₫{totalAmount.toLocaleString()}
                        </Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={2}></Table.Summary.Cell>
                    </Table.Summary.Row>
                  </Table.Summary>
                )}
              />
            )}
          </Form.List>

          <Divider />

          <Form.Item
            label="Ghi chú"
            name="notes"
          >
            <Input.TextArea 
              rows={4} 
              placeholder="Ghi chú về đơn hàng nhập (nếu có)" 
            />
          </Form.Item>

          <Form.Item className="text-right">
            <Space>
              <Button 
                size="large"
                icon={<CloseOutlined />}
                onClick={() => navigate('/admin/v1/import-orders')}
              >
                Hủy
              </Button>
              <Button 
                type="primary" 
                size="large"
                icon={<CheckOutlined />}
                htmlType="submit"
              >
                Tạo đơn hàng nhập
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreateImportOrder;