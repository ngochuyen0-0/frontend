// pages/ContactPage.tsx
import React, { useState } from 'react';
import { Card, Row, Col, Typography, Input, Button, message, Form } from 'antd';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, UserOutlined, MessageOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const ContactPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = (values: any) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      message.success('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.');
      form.resetFields();
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Title level={1} className="text-4xl font-bold text-gray-900 mb-4">Liên Hệ Với Chúng Tôi</Title>
          <Paragraph className="text-xl text-gray-600 max-w-2xl mx-auto">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với chúng tôi qua các kênh dưới đây.
          </Paragraph>
        </div>

        <Row gutter={[32, 32]}>
          {/* Contact Info */}
          <Col xs={24} lg={12}>
            <Card className="h-full shadow-sm">
              <Title level={2} className="text-2xl font-bold text-gray-900 mb-6">Thông Tin Liên Hệ</Title>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <EnvironmentOutlined className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">Địa Chỉ</h3>
                    <p className="text-gray-600">123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <PhoneOutlined className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">Điện Thoại</h3>
                    <p className="text-gray-600">1900 123 456</p>
                    <p className="text-gray-600">+84 123 456 789</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-red-100 p-3 rounded-full">
                    <MailOutlined className="text-red-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">info@hapas.vn</p>
                    <p className="text-gray-600">support@hapas.vn</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <MessageOutlined className="text-purple-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">Hỗ Trợ Trực Tuyến</h3>
                    <p className="text-gray-600">Chat với chúng tôi trực tiếp trên website</p>
                    <p className="text-gray-600">Thời gian hoạt động: 8:00 - 22:00 hàng ngày</p>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="mt-8">
                <Title level={3} className="text-xl font-semibold text-gray-900 mb-4">Giờ Làm Việc</Title>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Thứ 2 - Thứ 6</span>
                    <span className="text-gray-900 font-medium">8:00 - 20:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Thứ 7</span>
                    <span className="text-gray-900 font-medium">8:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Chủ Nhật</span>
                    <span className="text-gray-900 font-medium">9:00 - 17:00</span>
                  </div>
                </div>
              </div>
            </Card>
          </Col>

          {/* Contact Form */}
          <Col xs={24} lg={12}>
            <Card className="h-full shadow-sm">
              <Title level={2} className="text-2xl font-bold text-gray-900 mb-6">Gửi Tin Nhắn</Title>
              
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
              >
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="firstName"
                      label="Họ"
                      rules={[{ required: true, message: 'Vui lòng nhập họ của bạn' }]}
                    >
                      <Input prefix={<UserOutlined />} placeholder="Nhập họ" size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="lastName"
                      label="Tên"
                      rules={[{ required: true, message: 'Vui lòng nhập tên của bạn' }]}
                    >
                      <Input placeholder="Nhập tên" size="large" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Vui lòng nhập email' },
                    { type: 'email', message: 'Email không hợp lệ' }
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder="Nhập email" size="large" />
                </Form.Item>

                <Form.Item
                  name="phone"
                  label="Số điện thoại"
                  rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                >
                  <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" size="large" />
                </Form.Item>

                <Form.Item
                  name="subject"
                  label="Chủ đề"
                  rules={[{ required: true, message: 'Vui lòng nhập chủ đề' }]}
                >
                  <Input placeholder="Nhập chủ đề" size="large" />
                </Form.Item>

                <Form.Item
                  name="message"
                  label="Tin nhắn"
                  rules={[{ required: true, message: 'Vui lòng nhập tin nhắn' }]}
                >
                  <TextArea 
                    rows={6} 
                    placeholder="Nhập tin nhắn của bạn..." 
                    size="large"
                    className="resize-none"
                  />
                </Form.Item>

                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    size="large" 
                    loading={loading}
                    block
                    className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700"
                  >
                    Gửi Tin Nhắn
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>

        {/* Map Section */}
        <div className="mt-12">
          <Card className="shadow-sm">
            <Title level={2} className="text-2xl font-bold text-gray-900 mb-6 text-center">Bản Đồ</Title>
            <div className="w-full h-80 rounded-xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.239051754801!2d106.6264223751322!3d10.783312458556138!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f2f00000000%3A0x7ac2c66d2d3e4b0!2zVHLGsOG7nW5nIMSQ4bqhaSBI4buNYyBD4bqnbiBUaMah!5e0!3m2!1svi!2s!4v1234567890123!5m2!1svi!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Bản đồ vị trí cửa hàng Hapas"
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;