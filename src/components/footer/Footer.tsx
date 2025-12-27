import React from 'react';
import {
  Layout,
  Row,
  Col,
  Typography,
  Divider,
  Space,
  Input,
  Button,
  List,
  Card
} from 'antd';
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  YoutubeOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  ClockCircleOutlined,
  SendOutlined,
  HeartOutlined
} from '@ant-design/icons';

const { Footer } = Layout;
const { Title, Text, Link } = Typography;
const { TextArea } = Input;

const AppFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  // Dữ liệu liên kết nhanh
    const shopLinks = [
      { label: 'Về chúng tôi', href: '/about' },
      { label: 'Câu chuyện của chúng tôi', href: '/story' },
      { label: 'Tuyển dụng', href: '/careers' },
      { label: 'Báo chí', href: '/press' },
      { label: 'Bền vững', href: '/sustainability' }
    ];
  
    const customerServiceLinks = [
      { label: 'Liên hệ với chúng tôi', href: '/contact' },
      { label: 'Chính sách vận chuyển', href: '/shipping' },
      { label: 'Đổi trả & Hoàn tiền', href: '/returns' },
      { label: 'Hướng dẫn chọn size', href: '/size-guide' },
      { label: 'Câu hỏi thường gặp', href: '/faq' }
    ];
  
    const policyLinks = [
      { label: 'Chính sách bảo mật', href: '/privacy' },
      { label: 'Điều khoản dịch vụ', href: '/terms' },
      { label: 'Chính sách cookie', href: '/cookies' },
      { label: 'Phương thức thanh toán', href: '/payment-methods' }
    ];

  return (
    <Footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Row gutter={[48, 32]}>
          {/* Company Info */}
          <Col xs={24} md={8}>
            <Title level={3} className="text-white mb-4">
              Hapas
            </Title>
            <Text className="text-gray-300 text-lg">
              Đối tác đáng tin cậy của bạn trong các sản phẩm thời trang và lối sống chính hãng.
              Chúng tôi mang đến cho bạn những mặt hàng chất lượng tốt nhất với dịch vụ khách hàng xuất sắc.
            </Text>
            
            <Space size="middle" className="mt-6">
              <Button 
                type="text" 
                icon={<FacebookOutlined />} 
                className="text-white text-2xl hover:text-blue-500 transition-colors"
                href="https://facebook.com" 
                target="_blank"
              />
              <Button 
                type="text" 
                icon={<InstagramOutlined />} 
                className="text-white text-2xl hover:text-pink-500 transition-colors"
                href="https://instagram.com" 
                target="_blank"
              />
              <Button 
                type="text" 
                icon={<TwitterOutlined />} 
                className="text-white text-2xl hover:text-blue-400 transition-colors"
                href="https://twitter.com" 
                target="_blank"
              />
              <Button 
                type="text" 
                icon={<YoutubeOutlined />} 
                className="text-white text-2xl hover:text-red-500 transition-colors"
                href="https://youtube.com" 
                target="_blank"
              />
            </Space>

            {/* Contact Info */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3">
                <EnvironmentOutlined className="text-gray-400" />
                <Text className="text-gray-300">
                  123 Đường Thời Trang, Quận 1, TP. Hồ Chí Minh, Việt Nam
                </Text>
              </div>
              <div className="flex items-center gap-3">
                <PhoneOutlined className="text-gray-400" />
                <Text className="text-gray-300">
                  +84 28 1234 5678
                </Text>
              </div>
              <div className="flex items-center gap-3">
                <MailOutlined className="text-gray-400" />
                <Text className="text-gray-300">
                  hello@hanpas.com
                </Text>
              </div>
              <div className="flex items-center gap-3">
                <ClockCircleOutlined className="text-gray-400" />
                <Text className="text-gray-300">
                  Mon - Sun: 9:00 AM - 10:00 PM
                </Text>
              </div>
            </div>
          </Col>

          {/* Quick Links */}
          <Col xs={12} md={4}>
            <Title level={4} className="text-white mb-6">
              Cửa hàng
            </Title>
            <List
              dataSource={shopLinks}
              renderItem={(item) => (
                <List.Item className="border-0 p-0 mb-2">
                  <Link 
                    href={item.href} 
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </List.Item>
              )}
            />
          </Col>

          {/* Customer Service */}
          <Col xs={12} md={4}>
            <Title level={4} className="text-white mb-6">
              Dịch vụ khách hàng
            </Title>
            <List
              dataSource={customerServiceLinks}
              renderItem={(item) => (
                <List.Item className="border-0 p-0 mb-2">
                  <Link 
                    href={item.href} 
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </List.Item>
              )}
            />
          </Col>

          {/* Policies */}
          <Col xs={12} md={4}>
            <Title level={4} className="text-white mb-6">
              Chính sách
            </Title>
            <List
              dataSource={policyLinks}
              renderItem={(item) => (
                <List.Item className="border-0 p-0 mb-2">
                  <Link 
                    href={item.href} 
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </List.Item>
              )}
            />
          </Col>

          {/* Newsletter */}
          <Col xs={24} md={4}>
            <Title level={4} className="text-white mb-6">
              Bản tin
            </Title>
            <Text className="text-gray-300 block mb-4">
              Đăng ký để nhận được các ưu đãi đặc biệt, quà tặng miễn phí và các chương trình độc quyền.
            </Text>
            
            <Space.Compact className="w-full mb-2">
              <Input
                placeholder="Nhập email của bạn"
                size="large"
                className="bg-gray-800 border-gray-600 text-white"
              />
              <Button 
                type="primary" 
                size="large"
                icon={<SendOutlined />}
                className="bg-blue-600 hover:bg-blue-700 border-blue-600"
              >
                Đăng ký
              </Button>
            </Space.Compact>
            
            <Text className="text-gray-400 text-xs">
              Bằng cách đăng ký, bạn đồng ý với Chính sách bảo mật của chúng tôi và đồng ý nhận các cập nhật từ công ty chúng tôi.
            </Text>

            {/* Payment Methods */}
            <div className="mt-6">
              <Text strong className="text-white block mb-3">
                Chúng tôi chấp nhận:
              </Text>
              <div className="flex flex-wrap gap-2">
                <div className="bg-white rounded px-2 py-1 text-xs font-bold">VISA</div>
                <div className="bg-white rounded px-2 py-1 text-xs font-bold">MC</div>
                <div className="bg-white rounded px-2 py-1 text-xs font-bold">PayPal</div>
                <div className="bg-white rounded px-2 py-1 text-xs font-bold">JCB</div>
                <div className="bg-white rounded px-2 py-1 text-xs font-bold">COD</div>
              </div>
            </div>
          </Col>
        </Row>

        <Divider className="bg-gray-700 my-12" />

        {/* Bottom Footer */}
        <Row justify="space-between" align="middle">
          <Col>
            <Text className="text-gray-400">
              © {currentYear} Hapas. Tất cả quyền được bảo lưu.
            </Text>
          </Col>
          <Col>
            <Space size="middle">
              <Link href="/privacy" className="text-gray-400 hover:text-white">
                Chính sách bảo mật
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white">
                Điều khoản dịch vụ
              </Link>
              <Link href="/sitemap" className="text-gray-400 hover:text-white">
                Sơ đồ trang web
              </Link>
            </Space>
          </Col>
        </Row>

        {/* Security Badges */}
        <Row justify="center" className="mt-8">
          <Col>
            <Space size="large">
              <Card size="small" className="bg-gray-800 border-gray-700 text-center">
                <Text className="text-green-400 text-xs">🔒 SSL Secure</Text>
                <Text className="text-gray-400 text-xs block">256-bit Encryption</Text>
              </Card>
              <Card size="small" className="bg-gray-800 border-gray-700 text-center">
                <Text className="text-yellow-400 text-xs">⭐️ Trusted</Text>
                <Text className="text-gray-400 text-xs block">1000+ Reviews</Text>
              </Card>
              <Card size="small" className="bg-gray-800 border-gray-700 text-center">
                <Text className="text-blue-400 text-xs">🚚 Fast</Text>
                <Text className="text-gray-400 text-xs block">Free Shipping</Text>
              </Card>
            </Space>
          </Col>
        </Row>

        {/* Made with love */}
        <Row justify="center" className="mt-6">
          <Col>
            <Text className="text-gray-500 text-sm">
              Được tạo ra với <HeartOutlined className="text-red-400" /> tại Việt Nam
            </Text>
          </Col>
        </Row>
      </div>
    </Footer>
  );
};

export default AppFooter;
