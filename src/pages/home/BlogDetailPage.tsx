// pages/BlogDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Row,
  Col,
  Card,
  Tag,
  Button,
  Spin,
  Divider
} from 'antd';
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  ShareAltOutlined
} from '@ant-design/icons';
import { BlogPost } from '../../types/Blog';

const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    loadPost();
  }, [slug]);

 const loadPost = async () => {
    setLoading(true);
    try {
      // const response = await blogApi.getPostBySlug(slug!);
      // setPost(response.data);
      
      // Mock data cho trang chi tiết túi xách
      setTimeout(() => {
        setPost({
          id: '1',
          title: 'Bí quyết chọn túi xách hoàn hảo cho mọi dịp',
          content: `
            <h2>Giới thiệu</h2>
            <p>Một chiếc túi xách không chỉ là phụ kiện đựng đồ cá nhân, mà còn là tuyên ngôn về phong cách và gu thẩm mỹ của người sở hữu. Việc chọn đúng chiếc túi phù hợp sẽ giúp bạn tự tin và nổi bật hơn rất nhiều...</p>
            
            <h2>1. Xác định mục đích sử dụng</h2>
            <p>Trước khi mua, hãy tự hỏi bạn sẽ diện chiếc túi này đi đâu? Nếu là đi làm, bạn cần một chiếc túi Tote hoặc Satchel có ngăn chứa rộng rãi. Nếu là đi tiệc, một chiếc Clutch nhỏ gọn, đính đá sang trọng sẽ là lựa chọn tối ưu.</p>
            
            <h2>2. Lựa chọn chất liệu bền bỉ</h2>
            <p>Chất liệu da thật luôn là ưu tiên hàng đầu cho sự sang trọng và bền bỉ theo thời gian. Tuy nhiên, các dòng da tổng hợp cao cấp (PU) hiện nay cũng mang lại vẻ ngoài thời thượng với mức giá dễ tiếp cận hơn.</p>

            <h2>3. Phối hợp cùng trang phục</h2>
            <p>Đừng quên nguyên tắc cân bằng: Nếu trang phục của bạn đã quá cầu kỳ, hãy chọn một chiếc túi xách tối giản để tạo điểm nhấn thanh lịch.</p>
          `,
          excerpt: 'Khám phá bí quyết lựa chọn và phối hợp túi xách để luôn tự tin và thời thượng trong mọi hoàn cảnh...',
          author: 'Fashion Editor',
          published_date: '2024-03-22',
          featured_image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&h=400&auto=format&fit=crop',
          categories: ['Tips & Hướng dẫn'],
          tags: ['túi xách', 'phối đồ', 'thời trang'],
          status: 'published',
          slug: slug!,
          view_count: 3560,
          reading_time: 6
        });
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Failed to load post');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2>Bài viết không tồn tại</h2>
        <Button onClick={() => navigate('/blog')} className="mt-4">
          Quay lại Blog
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate('/blog')}
        className="mb-6"
      >
        Quay lại Blog
      </Button>

      <Row gutter={[32, 32]}>
        {/* Main Content */}
        <Col xs={24} lg={16}>
          <Card className="!shadow-sm">
            {/* Featured Image */}
            <div className="mb-6">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-auto rounded-lg"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-4">
              {post.categories.map(category => (
                <Tag key={category} color="blue" className="text-sm">
                  {category}
                </Tag>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6 pb-4 border-b">
              <div className="flex items-center gap-2">
                <CalendarOutlined />
                <span>{new Date(post.published_date).toLocaleDateString('vi-VN')}</span>
              </div>
              <div className="flex items-center gap-2">
                <EyeOutlined />
                <span>{post.view_count} lượt xem</span>
              </div>
              <div className="flex items-center gap-2">
                <ClockCircleOutlined />
                <span>{post.reading_time} phút đọc</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Bởi {post.author}</span>
              </div>
            </div>

            {/* Content */}
            <article 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            <Divider />
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <Tag key={tag} color="default">
                  #{tag}
                </Tag>
              ))}
            </div>

            {/* Share Buttons */}
            <div className="flex gap-2 mt-6">
              <Button icon={<ShareAltOutlined />}>
                Chia sẻ
              </Button>
            </div>
          </Card>
        </Col>

        {/* Sidebar */}
        <Col xs={24} lg={8}>
          {/* About Card */}
          <Card title="Về chúng tôi" className="mb-6 !shadow-sm">
            <p className="text-gray-600">
              Chuyên trang chia sẻ kiến thức về thời trang, giày dép và phong cách sống.
            </p>
          </Card>

          {/* Categories Card */}
          <Card title="Danh mục" className="mb-6 !shadow-sm">
            <div className="space-y-2">
              {['Tips & Hướng dẫn', 'Xu hướng', 'Đánh giá'].map(category => (
                <div key={category} className="flex justify-between items-center hover:text-blue-600 cursor-pointer">
                  <span>{category}</span>
                  <span className="text-gray-400">(12)</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Popular Posts */}
          <Card title="Bài viết phổ biến" className="!shadow-sm">
            <div className="space-y-4">
              {[1, 2, 3].map(item => (
                <div key={item} className="flex gap-3 cursor-pointer group">
                  <img
                    src="https://via.placeholder.com/60x60"
                    alt="Popular post"
                    className="w-15 h-15 object-cover rounded"
                  />
                  <div>
                    <h4 className="font-medium group-hover:text-blue-600 line-clamp-2">
                      Top 10 giày chạy bộ tốt nhất 2024
                    </h4>
                    <p className="text-gray-500 text-sm">1.2k lượt xem</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BlogDetailPage;