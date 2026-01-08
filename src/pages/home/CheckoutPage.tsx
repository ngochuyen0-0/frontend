import React, { useEffect, useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Radio,
  Divider,
  Space,
  Typography,
  Row,
  Col,
  Select,
  Checkbox,
  Steps,
  Tag
} from "antd";
import {
  ArrowLeftOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  MinusOutlined,
  PlusOutlined
} from "@ant-design/icons";
import { getCart } from "../../services/cartService";
import { getProductVariantById } from "../../services/productService";
import { ProductVariantSingle } from "../../types/product";
import { toast } from "sonner";
import { createOrder } from "../../services/orderService";
import { useNavigate } from "react-router-dom";
import { vietnamProvinces, Province, District } from "../../utils/vietnam-provinces";
import TrashIcon from "../../icons/TrashIcon";

const { Title, Text } = Typography;
const { Option } = Select;
const { Step } = Steps;

interface CartItem {
  id: string;        // ID của biến thể sản phẩm (product variant ID)
  variant_id: string; // Thêm trường này để ánh xạ với giỏ hàng
  product_id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
  size?: string;
  color?: string;
}

interface orderSummary {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
};

const shippingMethods = [
  { id: "standard", name: "Vận chuyển tiêu chuẩn", price: 50000, days: "5-7 ngày làm việc" },
  { id: "express", name: "Vận chuyển nhanh", price: 150000, days: "2-3 ngày làm việc" },
  { id: "overnight", name: "Vận chuyển qua đêm", price: 250000, days: "Ngày làm việc tiếp theo" }
];

const CheckoutPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [sameAsShipping, setSameAsShipping] = useState<boolean>(true);
  const navigate = useNavigate();
  const [orderSummary, setOrderSummary] = useState<orderSummary>({
    items: [],
    subtotal: 0,
    shipping: 0,
    tax: 0,
    discount: 0,
    total: 0
  });
  const [selectedShipping, setSelectedShipping] = useState<string>("standard");
  const [provinces] = useState<Province[]>(vietnamProvinces);
  const [districts, setDistricts] = useState<District[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");


  const updateQuantity = (itemId: string, newQty: number) => {
    if (newQty < 1) return; // Không cho phép số lượng nhỏ hơn 1
    setOrderSummary(prev => {
      const updatedItems = prev.items.map(item =>
        item.id === itemId ? { ...item, qty: newQty } : item
      );
      const newSubtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
      return { ...prev, items: updatedItems, subtotal: newSubtotal };
    });

    // Cập nhật giỏ hàng trong localStorage
    const cartItems = getCart();
    const updatedCart = cartItems.map(item =>
      item.variant_id === itemId ? { ...item, qty: newQty } : item
    );
    
    // Lưu lại giỏ hàng đã cập nhật
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (itemId: string) => {
    setOrderSummary(prev => {
      const updatedItems = prev.items.filter(item => item.id !== itemId);
      const newSubtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
      return { ...prev, items: updatedItems, subtotal: newSubtotal };
    });

    // Cập nhật giỏ hàng trong localStorage
    const cartItems = getCart();
    const updatedCart = cartItems.filter(item => item.variant_id !== itemId);
    
    // Lưu lại giỏ hàng đã cập nhật
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };
  useEffect(() => {
    const cartItems = getCart();
    const fetch = async () => {
      const results = await Promise.all(cartItems.map(item => getProductVariantById(item.variant_id)));
      const itemsFetch = [] as CartItem[];
      let subtotal = 0
      results.forEach((e: ProductVariantSingle) => {
        const cartInfo = cartItems.find(c => c.variant_id === e.id);
        const avatar = e.product.images?.find(i => i.is_thumbnail);
        const cartItem = {
          id: e.id || "",
          variant_id: e.id || "",  // Sử dụng cùng ID cho cả hai trường
          product_id: e.product_id || "",
          name: e.product.name || "",
          qty: cartInfo?.qty || 0,
          size: e?.size || "",
          color: e?.color || "",
          price: e?.price || 0,
          image: avatar?.image_url || ""
        }
        subtotal = subtotal + ((e.price || 0) * (cartInfo?.qty || 0));
        itemsFetch.push(cartItem)
      })
      setOrderSummary({ items: itemsFetch, subtotal: subtotal, shipping: 0, tax: 0, discount: 0, total: 0 });
    }
    fetch();
  }, [])

  const handleProvinceChange = (provinceId: string) => {
    const selectedProv = provinces.find(prov => prov.id === provinceId);
    if (selectedProv) {
      setDistricts(selectedProv.districts);
      setSelectedProvince(selectedProv.name);
      // Reset district selection when province changes
      setSelectedDistrict("");
      form.setFieldsValue({ district: undefined });
    }
  };

  const handleDistrictChange = (districtId: string) => {
    const selectedDist = districts.find(dist => dist.id === districtId);
    if (selectedDist) {
      setSelectedDistrict(selectedDist.name);
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    console.log("Information data:", values);

    const order_payload = {
      fullname: `${values.firstName} ${values.lastName}`,
      email: values.email,
      phone: values.phone,
      shipping_method: values.shippingMethod,
      country: values.country,
      city: selectedProvince, // Gửi tên tỉnh/thành phố đã chọn vào trường city
      zipcode: "", // Không sử dụng mã bưu điện nữa
      province: selectedProvince,
      ward: selectedDistrict,
      specific_address: values.address,
      items: orderSummary.items.map((item) => ({
        variant_id: item.variant_id,
        quantity: item.qty
      })).filter(item => item.quantity > 0) // Chỉ gửi những sản phẩm có số lượng > 0
    }

    createOrder(order_payload).then(res => {
      if (res.id) {
        navigate(`/payment/${res.id}`)
      }
    }).catch(() => { }).finally(() => {
      setLoading(false);
    })
  };

  const formatCurrency = (value: number): string => {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(value);
    };

  const getSelectedShipping = () => {
    return shippingMethods.find(method => method.id === selectedShipping);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Checkout Steps */}
        <div className="mb-8">
          <Steps current={1} className="mb-8">
            <Step title="Giỏ hàng" description="Xem lại sản phẩm" />
            <Step title="Thông tin" description="Tạo đơn hàng" />
            <Step title="Thanh toán" description="Phương thức thanh toán" />
            <Step title="Xem lại" description="Cài đặt đơn hàng" />
          </Steps>
        </div>

        <Row gutter={[32, 32]}>
          {/* Left Column - Information Forms */}
          <Col xs={24} lg={14}>
            <Card>
              <Title level={3} className="mb-6">
                Thông tin vận chuyển
              </Title>

              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                  country: "VN",
                  shippingMethod: "standard",
                  province: "",
                  district: ""
                }}
              >
                {/* Contact Information */}
                <div className="mb-6">
                  <Title level={5} className="mb-4">
                    📧 Thông tin liên hệ
                  </Title>
                  <Row gutter={12}>
                    <Col span={12}>
                      <Form.Item
                        name="firstName"
                        label="Tên"
                        rules={[{ required: true, message: 'Tên là bắt buộc' }]}
                      >
                        <Input
                          prefix={<UserOutlined />}
                          placeholder="Nhập tên"
                          size="large"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="lastName"
                        label="Họ"
                        rules={[{ required: true, message: 'Họ là bắt buộc' }]}
                      >
                        <Input
                          placeholder="Nhập họ"
                          size="large"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={12}>
                    <Col span={12}>
                      <Form.Item
                        name="email"
                        label="Địa chỉ Email"
                        rules={[
                          { required: true, message: 'Email là bắt buộc' },
                          { type: 'email', message: 'Địa chỉ email không hợp lệ' }
                        ]}
                      >
                        <Input
                          prefix={<MailOutlined />}
                          placeholder="Nhập email"
                          size="large"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="phone"
                        label="Số điện thoại"
                        rules={[{ required: true, message: 'Số điện thoại là bắt buộc' }]}
                      >
                        <Input
                          prefix={<PhoneOutlined />}
                          placeholder="Nhập số điện thoại"
                          size="large"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>

                {/* Shipping Address */}
                <div className="mb-6">
                  <Title level={5} className="mb-4">
                    📦 Địa chỉ nhận hàng
                  </Title>

                  <Form.Item
                    name="address"
                    label="Địa chỉ"
                    rules={[{ required: true, message: 'Địa chỉ là bắt buộc' }]}
                  >
                    <Input
                      prefix={<EnvironmentOutlined />}
                      placeholder="Nhập địa chỉ nhận hàng"
                      size="large"
                    />
                  </Form.Item>

                  <Row gutter={8}>
                    <Col span={8}>
                      <Form.Item
                        name="province"
                        label="Tỉnh/Thành phố"
                        rules={[{ required: true, message: 'Tỉnh/Thành phố là bắt buộc' }]}
                      >
                        <Select
                          size="large"
                          placeholder="Chọn tỉnh/thành phố"
                          onChange={handleProvinceChange}
                          showSearch
                          filterOption={(input, option) =>
                            (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
                          }
                          optionFilterProp="label"
                        >
                          {provinces.map(province => (
                            <Option key={province.id} value={province.id} label={province.name}>
                              {province.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        name="district"
                        label="Quận/Huyện"
                        rules={[{ required: true, message: 'Quận/Huyện là bắt buộc' }]}
                      >
                        <Select
                          size="large"
                          placeholder="Chọn quận/huyện"
                          onChange={handleDistrictChange}
                          disabled={!selectedProvince}
                          showSearch
                          filterOption={(input, option) =>
                            (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
                          }
                          optionFilterProp="label"
                        >
                          {districts.map(district => (
                            <Option key={district.id} value={district.id} label={district.name}>
                              {district.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        name="ward"
                        label="Phường/Xã"
                        rules={[{ required: true, message: 'Phường/Xã là bắt buộc' }]}
                      >
                        <Input placeholder="Phường/Xã" size="large" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    name="country"
                    label="Quốc gia"
                    rules={[{ required: true, message: 'Quốc gia là bắt buộc' }]}
                  >
                    <Select size="large">
                      <Option value="VN">Vietnam</Option>
                    </Select>
                  </Form.Item>
                </div>

                {/* Shipping Method */}
                <div className="mb-6">
                  <Title level={5} className="mb-4">
                    🚚 Phương thức vận chuyển
                  </Title>
                  <Card className="w-full">
                    <Form.Item name="shippingMethod" className="w-full">
                      <Radio.Group
                        onChange={(e) => setSelectedShipping(e.target.value)}
                        className="w-full"
                      >
                        <Space direction="vertical" className="w-full">
                          {shippingMethods.map(method => (
                            <Radio key={method.id} value={method.id} className="w-full">
                              <div className="w-90 bg-gray-10 p-3 border border-gray-300 rounded-lg">
                                <div >
                                  <Text strong>{method.name}</Text>
                                  <br />
                                  <Text type="secondary">{method.days}</Text>
                                </div>
                                <Text strong>{formatCurrency(method.price)}</Text>
                              </div>
                            </Radio>
                          ))}
                        </Space>
                      </Radio.Group>
                    </Form.Item>
                  </Card>

                </div>

                {/* Billing Address */}
                <div className="mb-6">
                  <Title level={5} className="mb-4">
                    💳 Địa chỉ thanh toán
                  </Title>
                  <Form.Item>
                    <Checkbox
                      checked={sameAsShipping}
                      onChange={(e) => setSameAsShipping(e.target.checked)}
                    >
                      Giống địa chỉ nhận hàng
                    </Checkbox>
                  </Form.Item>

                  {!sameAsShipping && (
                    <div className="space-y-4">
                      <Form.Item
                        name="billingAddress"
                        label="Billing Address"
                        rules={[{ required: true, message: 'Billing address is required' }]}
                      >
                        <Input placeholder="Billing Address" size="large" />
                      </Form.Item>

                      <Row gutter={12}>
                        <Col span={12}>
                          <Form.Item
                            name="billingCity"
                            label="City"
                            rules={[{ required: true, message: 'City is required' }]}
                          >
                            <Input placeholder="City" size="large" />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            name="billingZip"
                            label="ZIP Code"
                            rules={[{ required: true, message: 'ZIP code is required' }]}
                          >
                            <Input placeholder="ZIP Code" size="large" />
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>
                  )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                  <Button
                    type="default"
                    icon={<ArrowLeftOutlined />}
                    size="large"
                  >
                    Quay lại giỏ hàng
                  </Button>

                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={loading}

                  >
                    Tiếp tục thanh toán
                  </Button>
                </div>
              </Form>
            </Card>
          </Col>

          {/* Right Column - Order Summary */}
          <Col xs={24} lg={10}>
            <Card title="Tóm tắt đơn hàng" className="sticky top-4">
              {/* Order Items */}
              <div className="space-y-3 mb-4">
                {orderSummary.items.map(item => (
                  <div key={item.id} className="border-b pb-3">
                    <div className="flex items-start gap-3">
                      {/* Product Image */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md border"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/src/assets/no-image-available.jpg'; // Fallback image
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <Text strong className="block truncate">{item.name}</Text>
                          <Button
                            type="text"
                            danger
                            size="small"
                            onClick={() => removeItem(item.id)}
                            className="p-0 m-0"
                          >
                            <TrashIcon width={16} height={16} />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Tag color="blue">
                            {item.size}
                          </Tag>
                          <Tag color="orange" className="capitalize">
                            {item.color}
                          </Tag>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border rounded-md">
                            <Button
                              type="text"
                              icon={<MinusOutlined />}
                              size="small"
                              onClick={() => updateQuantity(item.id, item.qty - 1)}
                              className="p-1"
                            />
                            <span className="px-2">{item.qty}</span>
                            <Button
                              type="text"
                              icon={<PlusOutlined />}
                              size="small"
                              onClick={() => updateQuantity(item.id, item.qty + 1)}
                              className="p-1"
                            />
                          </div>
                          <Text strong>{formatCurrency(item.price * item.qty)}</Text>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Divider />

              {/* Shipping Preview */}
              <div className="mb-4">
                <Text strong className="block mb-2">Phương thức vận chuyển</Text>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <Text strong>{getSelectedShipping()?.name}</Text>
                  <br />
                  <Text type="secondary">{getSelectedShipping()?.days}</Text>
                  <br />
                  <Text strong>{formatCurrency(getSelectedShipping()?.price || 0)}</Text>
                </div>
              </div>

              {/* Price Breakdown */}
              <Space direction="vertical" className="w-full">
                <div className="flex justify-between">
                  <Text>Tạm tính</Text>
                  <Text>{formatCurrency(orderSummary.subtotal)}</Text>
                </div>
                <div className="flex justify-between">
                  <Text>Vận chuyển</Text>
                  <Text>{formatCurrency(getSelectedShipping()?.price || 0)}</Text>
                </div>
                <div className="flex justify-between">
                  <Text>Thuế</Text>
                  <Text>{formatCurrency(orderSummary.tax)}</Text>
                </div>
                {orderSummary.discount < 0 && (
                  <div className="flex justify-between text-green-500">
                    <Text>Giảm giá</Text>
                    <Text>{formatCurrency(orderSummary.discount)}</Text>
                  </div>
                )}
                <Divider className="my-2" />
                <div className="flex justify-between text-lg">
                  <Text strong>Tổng cộng</Text>
                  <Text strong>
                    {formatCurrency(
                      orderSummary.subtotal +
                      (getSelectedShipping()?.price || 0) +
                      orderSummary.tax +
                      orderSummary.discount
                    )}
                  </Text>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default CheckoutPage;