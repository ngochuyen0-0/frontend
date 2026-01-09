// pages/AboutPage.tsx
import React from 'react';
import { Card, Row, Col, Divider, Typography } from 'antd';

const { Title, Paragraph, Text } = Typography;

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Title level={1} className="text-4xl font-bold text-gray-900 mb-6">
            Về Chúng Tôi
          </Title>
          <Paragraph className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hapas - Nơi hội tụ của thời trang, chất lượng và phong cách sống hiện đại
          </Paragraph>
        </div>

        {/* Our Story */}
        <Card className="mb-12 shadow-sm">
          <Row gutter={[32, 32]} align="middle">
            <Col xs={24} lg={12}>
              <img
                src="https://cdn.hstatic.net/files/200000978078/collection/bia1_4163e94b56d64f17b2f21c8a2a8b25ee.png"
                alt="Hapas Story"
                className="w-full h-64 lg:h-80 object-cover rounded-xl"
              />
            </Col>
            <Col xs={24} lg={12}>
              <Title level={2} className="text-3xl font-bold text-gray-900 mb-4">
                Câu Chuyện Của Chúng Tôi
              </Title>
              <Paragraph className="text-lg text-gray-700 leading-relaxed">
                Được thành lập từ năm 2020, Hapas bắt đầu với niềm đam mê thời trang và mong muốn mang đến 
                những sản phẩm chất lượng cao cho khách hàng Việt Nam. Với hơn 4 năm kinh nghiệm trong ngành, 
                chúng tôi đã xây dựng được thương hiệu uy tín với hàng ngàn khách hàng hài lòng.
              </Paragraph>
              <Paragraph className="text-lg text-gray-700 leading-relaxed">
                Chúng tôi cam kết cung cấp những sản phẩm thời trang chất lượng, thiết kế hiện đại, phù hợp 
                với xu hướng quốc tế và gu thẩm mỹ của người Việt Nam.
              </Paragraph>
            </Col>
          </Row>
        </Card>

        {/* Our Values */}
        <Card className="mb-12 shadow-sm">
          <Title level={2} className="text-3xl font-bold text-center text-gray-900 mb-12">
            Giá Trị Cốt Lõi
          </Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Card className="text-center h-full hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">✨</div>
                <Title level={4} className="text-xl font-semibold text-gray-900 mb-2">
                  Chất Lượng
                </Title>
                <Paragraph className="text-gray-600">
                  Chúng tôi chỉ cung cấp những sản phẩm đạt tiêu chuẩn chất lượng cao, được kiểm tra nghiêm ngặt trước khi đến tay khách hàng.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="text-center h-full hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">❤️</div>
                <Title level={4} className="text-xl font-semibold text-gray-900 mb-2">
                  Khách Hàng Là Trên Hết
                </Title>
                <Paragraph className="text-gray-600">
                  Trải nghiệm khách hàng luôn là ưu tiên hàng đầu. Chúng tôi lắng nghe và cải thiện liên tục để phục vụ tốt hơn mỗi ngày.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="text-center h-full hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">🌍</div>
                <Title level={4} className="text-xl font-semibold text-gray-900 mb-2">
                  Bền Vững
                </Title>
                <Paragraph className="text-gray-600">
                  Chúng tôi hướng đến phát triển bền vững, sử dụng vật liệu thân thiện môi trường và hỗ trợ các nhà sản xuất có trách nhiệm.
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </Card>

        {/* Contact Info */}
        <Card className="shadow-sm">
          <Row gutter={[32, 32]} align="middle">
            <Col xs={24} lg={12}>
              <Title level={2} className="text-3xl font-bold text-gray-900 mb-4">
                Kết Nối Với Chúng Tôi
              </Title>
              <Paragraph className="text-lg text-gray-700 mb-6">
                Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với chúng tôi qua các kênh dưới đây.
              </Paragraph>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Text strong className="mr-3">📍 Địa chỉ:</Text>
                  <Text>123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh</Text>
                </div>
                <div className="flex items-center">
                  <Text strong className="mr-3">📞 Điện thoại:</Text>
                  <Text>1900 123 456</Text>
                </div>
                <div className="flex items-center">
                  <Text strong className="mr-3">✉️ Email:</Text>
                  <Text>info@hapas.vn</Text>
                </div>
                <div className="flex items-center">
                  <Text strong className="mr-3">🕒 Giờ mở cửa:</Text>
                  <Text>Thứ 2 - Chủ nhật: 8:00 - 22:00</Text>
                </div>
              </div>
            </Col>
            <Col xs={24} lg={12}>
              <img
                src="https://images.unsplash.com/photo-1533090368676-1fd25485db88?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80"
                alt="Hapas Store"
                className="w-full h-64 object-cover rounded-xl"
              />
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default AboutPage;