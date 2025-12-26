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

  // Quick links data
  const shopLinks = [
    { label: 'About Us', href: '/about' },
    { label: 'Our Story', href: '/story' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
    { label: 'Sustainability', href: '/sustainability' }
  ];

  const customerServiceLinks = [
    { label: 'Contact Us', href: '/contact' },
    { label: 'Shipping Policy', href: '/shipping' },
    { label: 'Returns & Exchanges', href: '/returns' },
    { label: 'Size Guide', href: '/size-guide' },
    { label: 'FAQ', href: '/faq' }
  ];

  const policyLinks = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Payment Methods', href: '/payment-methods' }
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
              Your trusted partner in authentic fashion and lifestyle products. 
              We bring you the best quality items with exceptional customer service.
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
                  123 Fashion Street, District 1, Ho Chi Minh City, Vietnam
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
              Shop
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
              Customer Service
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
              Policies
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
              Newsletter
            </Title>
            <Text className="text-gray-300 block mb-4">
              Subscribe to get special offers, free giveaways, and exclusive deals.
            </Text>
            
            <Space.Compact className="w-full mb-2">
              <Input 
                placeholder="Enter your email" 
                size="large"
                className="bg-gray-800 border-gray-600 text-white"
              />
              <Button 
                type="primary" 
                size="large"
                icon={<SendOutlined />}
                className="bg-blue-600 hover:bg-blue-700 border-blue-600"
              >
                Subscribe
              </Button>
            </Space.Compact>
            
            <Text className="text-gray-400 text-xs">
              By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
            </Text>

            {/* Payment Methods */}
            <div className="mt-6">
              <Text strong className="text-white block mb-3">
                We Accept:
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
              © {currentYear} Hapas. All rights reserved.
            </Text>
          </Col>
          <Col>
            <Space size="middle">
              <Link href="/privacy" className="text-gray-400 hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white">
                Terms of Service
              </Link>
              <Link href="/sitemap" className="text-gray-400 hover:text-white">
                Sitemap
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
              Made with <HeartOutlined className="text-red-400" /> in Vietnam
            </Text>
          </Col>
        </Row>
      </div>
    </Footer>
  );
};

export default AppFooter;
