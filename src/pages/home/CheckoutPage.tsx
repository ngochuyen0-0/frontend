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
  EnvironmentOutlined
} from "@ant-design/icons";
import { getCart } from "../../services/cartService";
import { getProductVariantById } from "../../services/productService";
import { ProductVariantSingle } from "../../types/product";
import { toast } from "sonner";
import { createOrder } from "../../services/orderService";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { Option } = Select;
const { Step } = Steps;

interface CartItem {
  id: string;
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
  { id: "standard", name: "Standard Shipping", price: 5, days: "5-7 business days" },
  { id: "express", name: "Express Shipping", price: 15, days: "2-3 business days" },
  { id: "overnight", name: "Overnight Shipping", price: 25, days: "Next business day" }
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


  useEffect(() => {
    const cartItems = getCart();
    const fecth = async () => {
      const results = await Promise.all(cartItems.map(item => getProductVariantById(item.variant_id)));
      const itemsFecth = [] as CartItem[];
      let subtotal = 0
      results.forEach((e: ProductVariantSingle) => {
        const cartInfo = cartItems.find(c => c.variant_id === e.id);
        const avata = e.product.images?.find(i => i.is_thumbnail);
        const cartItem = {
          id: e.id || "",
          product_id: e.product_id || "",
          name: e.product.name || "",
          qty: cartInfo?.qty || 0,
          size: e?.size || "",
          color: e?.color || "",
          price: e?.price || 0,
          image: avata?.image_url || ""
        }
        subtotal = subtotal + ((e.price || 0) * (cartInfo?.qty || 0));
        itemsFecth.push(cartItem)
      })
      setOrderSummary({ ...orderSummary, items: itemsFecth, subtotal: subtotal })
    }
    fecth();
  }, [])

  const handleSubmit = async (values: any) => {
    setLoading(true);
    console.log("Information data:", values);

    const order_payload = {
      fullname: `${values.firstName} ${values.lastName}`,
      email: values.email,
      phone: values.phone,
      shipping_method: values.shippingMethod,
      country: values.country,
      city: values.city,
      zipcode: values.zipCode,
      province: values.state,
      ward: values.state,
      specific_address: values.address,
      items: getCart().map((e) => ({
        variant_id: e.variant_id,
        quantity: e.qty
      }))
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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
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
            <Step title="Cart" description="Review items" />
            <Step title="Information" description="Create order" />
            <Step title="Payment" description="Payment method" />
            <Step title="Review" description="Order setting" />
          </Steps>
        </div>

        <Row gutter={[32, 32]}>
          {/* Left Column - Information Forms */}
          <Col xs={24} lg={14}>
            <Card>
              <Title level={3} className="mb-6">
                Shipping Information
              </Title>

              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                  country: "US",
                  shippingMethod: "standard"
                }}
              >
                {/* Contact Information */}
                <div className="mb-6">
                  <Title level={5} className="mb-4">
                    📧 Contact Information
                  </Title>
                  <Row gutter={12}>
                    <Col span={12}>
                      <Form.Item
                        name="firstName"
                        label="First Name"
                        rules={[{ required: true, message: 'First name is required' }]}
                      >
                        <Input
                          prefix={<UserOutlined />}
                          placeholder="First Name"
                          size="large"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="lastName"
                        label="Last Name"
                        rules={[{ required: true, message: 'Last name is required' }]}
                      >
                        <Input
                          placeholder="Last Name"
                          size="large"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={12}>
                    <Col span={12}>
                      <Form.Item
                        name="email"
                        label="Email Address"
                        rules={[
                          { required: true, message: 'Email is required' },
                          { type: 'email', message: 'Invalid email address' }
                        ]}
                      >
                        <Input
                          prefix={<MailOutlined />}
                          placeholder="Email Address"
                          size="large"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="phone"
                        label="Phone Number"
                        rules={[{ required: true, message: 'Phone number is required' }]}
                      >
                        <Input
                          prefix={<PhoneOutlined />}
                          placeholder="Phone Number"
                          size="large"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>

                {/* Shipping Address */}
                <div className="mb-6">
                  <Title level={5} className="mb-4">
                    📦 Shipping Address
                  </Title>

                  <Form.Item
                    name="address"
                    label="Street Address"
                    rules={[{ required: true, message: 'Address is required' }]}
                  >
                    <Input
                      prefix={<EnvironmentOutlined />}
                      placeholder="Street Address"
                      size="large"
                    />
                  </Form.Item>

                  <Row gutter={12}>
                    <Col span={8}>
                      <Form.Item
                        name="city"
                        label="City"
                        rules={[{ required: true, message: 'City is required' }]}
                      >
                        <Input placeholder="City" size="large" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        name="state"
                        label="State/Province"
                        rules={[{ required: true, message: 'State is required' }]}
                      >
                        <Input placeholder="State" size="large" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        name="zipCode"
                        label="ZIP/Postal Code"
                        rules={[{ required: true, message: 'ZIP code is required' }]}
                      >
                        <Input placeholder="ZIP Code" size="large" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    name="country"
                    label="Country"
                    rules={[{ required: true, message: 'Country is required' }]}
                  >
                    <Select size="large">
                      <Option value="US">United States</Option>
                      <Option value="CA">Canada</Option>
                      <Option value="UK">United Kingdom</Option>
                      <Option value="AU">Australia</Option>
                      <Option value="VN">Vietnam</Option>
                    </Select>
                  </Form.Item>
                </div>

                {/* Shipping Method */}
                <div className="mb-6">
                  <Title level={5} className="mb-4">
                    🚚 Shipping Method
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
                    💳 Billing Address
                  </Title>
                  <Form.Item>
                    <Checkbox
                      checked={sameAsShipping}
                      onChange={(e) => setSameAsShipping(e.target.checked)}
                    >
                      Same as shipping address
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
                    Return to Cart
                  </Button>

                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={loading}

                  >
                    Continue to Payment
                  </Button>
                </div>
              </Form>
            </Card>
          </Col>

          {/* Right Column - Order Summary */}
          <Col xs={24} lg={10}>
            <Card title="Order Summary" className="sticky top-4">
              {/* Order Items */}
              <div className="space-y-3 mb-4">
                {orderSummary.items.map(item => (
                  <div>
                    <Text strong>{item.name}</Text>
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex gap-4 items-center">
                        <Text type="secondary">Qty: {item.qty}</Text>
                        <Tag>
                          {item.size}
                        </Tag>
                        <Tag color={item.color}>
                          {item.color}
                        </Tag>
                      </div>
                      <Text>{formatCurrency(item.price * item.qty)}</Text>
                    </div>
                  </div>

                ))}
              </div>

              <Divider />

              {/* Shipping Preview */}
              <div className="mb-4">
                <Text strong className="block mb-2">Shipping Method</Text>
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
                  <Text>Subtotal</Text>
                  <Text>{formatCurrency(orderSummary.subtotal)}</Text>
                </div>
                <div className="flex justify-between">
                  <Text>Shipping</Text>
                  <Text>{formatCurrency(getSelectedShipping()?.price || 0)}</Text>
                </div>
                <div className="flex justify-between">
                  <Text>Tax</Text>
                  <Text>{formatCurrency(orderSummary.tax)}</Text>
                </div>
                {orderSummary.discount < 0 && (
                  <div className="flex justify-between text-green-500">
                    <Text>Discount</Text>
                    <Text>{formatCurrency(orderSummary.discount)}</Text>
                  </div>
                )}
                <Divider className="my-2" />
                <div className="flex justify-between text-lg">
                  <Text strong>Total</Text>
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