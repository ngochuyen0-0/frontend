// pages/BlogPage.tsx
import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Input,
  Select,
  Button,
  Tag,
  Pagination,
  Empty,
  Spin,
  Typography
} from 'antd';
import {
  SearchOutlined,
  CalendarOutlined,
  EyeOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { BlogPost } from '../../types/Blog';

const { Search } = Input;
const { Option } = Select;
const { Title } = Typography;

const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(9);

  // Mock data - thay bằng API call
  const mockPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Bí quyết chọn túi xách phù hợp với dáng người',
      content: 'Nội dung đầy đủ...',
      excerpt: 'Một chiếc túi xách phù hợp không chỉ giúp đựng đồ mà còn tôn lên vóc dáng của bạn. Khám phá cách chọn túi cho dáng người tròn, gầy hay thấp bé...',
      author: 'Fashionista',
      published_date: '2024-03-20',
      featured_image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=400&h=250&auto=format&fit=crop', // Ảnh túi xách
      categories: ['Tips & Hướng dẫn'],
      tags: ['túi xách', 'phối đồ', 'thời trang nữ'],
      status: 'published',
      slug: 'bi-quyet-chon-tui-xach-phu-hop-voi-dang-nguoi',
      view_count: 2540,
      reading_time: 6
    },
    {
      id: '2',
      title: '5 Mẫu túi xách kinh điển không bao giờ lỗi mốt',
      content: 'Nội dung đầy đủ...',
      excerpt: 'Đầu tư vào những mẫu túi xách này, bạn sẽ luôn tự tin trong mọi hoàn cảnh từ công sở đến những bữa tiệc sang trọng...',
      author: 'Admin',
      published_date: '2024-03-18',
      featured_image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=400&h=250&auto=format&fit=crop', // Ảnh túi xách
      categories: ['Xu hướng'],
      tags: ['luxury', 'túi hiệu', 'classic'],
      status: 'published',
      slug: '5-mau-tui-xach-kinh-dien-khong-loi-mot',
      view_count: 1820,
      reading_time: 8
    },
    {
      id: '3',
      title: 'Xu hướng túi xách 2024: Mẫu mã không thể bỏ qua',
      content: 'Nội dung đầy đủ...',
      excerpt: 'Cập nhật những xu hướng túi xách mới nhất năm 2024, từ túi xách mini đến mẫu mã cổ điển, giúp bạn luôn thời trang và hiện đại...',
      author: 'BagExpert',
      published_date: '2024-02-15',
      featured_image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=400&h=250&auto=format&fit=crop',
      categories: ['Xu hướng'],
      tags: ['túi xách', 'xu hướng 2024', 'thời trang'],
      status: 'published',
      slug: 'xu-huong-tui-xach-2024',
      view_count: 3200,
      reading_time: 5
    },
    {
      id: '4',
      title: 'Cách phối đồ với túi xách cho nữ giới',
      content: 'Nội dung đầy đủ...',
      excerpt: 'Hướng dẫn cách phối đồ với túi xách để tạo nên phong cách thời trang nữ hiện đại, thanh lịch và cá tính...',
      author: 'WomenStyle',
      published_date: '2024-02-10',
      featured_image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=400&h=250&auto=format&fit=crop',
      categories: ['Tips & Hướng dẫn'],
      tags: ['túi xách', 'phối đồ nữ', 'thời trang nữ'],
      status: 'published',
      slug: 'cach-phoi-do-voi-tui-xach-cho-nu-gioi',
      view_count: 1950,
      reading_time: 7
    },
    {
      id: '5',
      title: 'Làm thế nào để bảo quản túi da luôn bền đẹp',
      content: 'Nội dung đầy đủ...',
      excerpt: 'Bí quyết bảo quản túi da đúng cách giúp kéo dài tuổi thọ sản phẩm và giữ cho chiếc túi luôn như mới...',
      author: 'BagCare',
      published_date: '2024-01-28',
      featured_image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=400&h=250&auto=format&fit=crop',
      categories: ['Tips & Hướng dẫn'],
      tags: ['bảo quản túi', 'túi da', 'chăm sóc túi'],
      status: 'published',
      slug: 'lam-the-nao-de-bao-quan-tui-da-luon-ben-dep',
      view_count: 2780,
      reading_time: 6
    },
    {
      id: '6',
      title: 'Top 10 thương hiệu túi xách nổi tiếng thế giới',
      content: 'Nội dung đầy đủ...',
      excerpt: 'Khám phá những thương hiệu túi xách nổi tiếng toàn cầu với chất lượng và thiết kế hàng đầu thế giới...',
      author: 'BrandExpert',
      published_date: '2024-01-15',
      featured_image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=400&h=250&auto=format&fit=crop',
      categories: ['Đánh giá'],
      tags: ['thương hiệu túi', 'túi cao cấp', 'xếp hạng'],
      status: 'published',
      slug: 'top-10-thuong-hieu-tui-xach-noi-tieng-the-gioi',
      view_count: 4100,
      reading_time: 10
    }
  ];

  useEffect(() => {
    loadPosts();
  }, [searchKeyword, selectedCategory, currentPage]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      // const response = await blogApi.getPosts({ searchKeyword, category: selectedCategory, page: currentPage });
      // setPosts(response.data);

      // Mock data
      setTimeout(() => {
        setPosts(mockPosts);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Failed to load posts');
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  const handlePostClick = (post: BlogPost) => {
    navigate(`/blogs/${post.slug}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Title level={1} className="text-4xl font-bold text-gray-900 mb-4">Blog Túi Xách & Thời Trang</Title>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Cập nhật những xu hướng túi xách mới nhất, bí quyết phối đồ và kiến thức hữu ích từ Hapas
          </p>
        </div>

        {/* Search and Filter */}
        <Card className="mb-8 shadow-sm">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={12}>
              <Search
                placeholder="Tìm kiếm bài viết..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                size="large"
                prefix={<SearchOutlined />}
              />
            </Col>
            <Col xs={24} md={6}>
              <Select
                placeholder="Danh mục"
                size="large"
                style={{ width: '100%' }}
                value={selectedCategory}
                onChange={setSelectedCategory}
                allowClear
              >
                <Option value="tips">Tips & Hướng dẫn</Option>
                <Option value="trends">Xu hướng</Option>
                <Option value="reviews">Đánh giá</Option>
                <Option value="bags">Túi xách</Option>
              </Select>
            </Col>
            <Col xs={24} md={6}>
              <Button
                type="primary"
                size="large"
                style={{ width: '100%' }}
                onClick={() => navigate('/blog/create')}
              >
                Viết bài chia sẻ
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Blog Posts Grid */}
        {loading ? (
          <div className="text-center py-12">
            <Spin size="large" />
          </div>
        ) : posts.length > 0 ? (
          <>
            <Row gutter={[24, 24]}>
              {posts.map(post => (
                <Col xs={24} md={8} key={post.id}>
                  <Card
                    hoverable
                    className="h-full !shadow-sm hover:!shadow-md transition-shadow"
                    cover={
                      <div className="aspect-video overflow-hidden">
                        <img
                          alt={post.title}
                          src={post.featured_image}
                          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    }
                    onClick={() => handlePostClick(post)}
                  >
                    <div className="space-y-3">
                      {/* Categories */}
                      <div className="flex flex-wrap gap-1">
                        {post.categories.map(category => (
                          <Tag key={category} color="blue">
                            {category}
                          </Tag>
                        ))}
                      </div>

                      {/* Title */}
                      <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 hover:text-blue-600 cursor-pointer">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {post.excerpt}
                      </p>

                      {/* Meta Info */}
                      <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t">
                        <div className="flex items-center gap-1">
                          <CalendarOutlined />
                          <span>{formatDate(post.published_date)}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <EyeOutlined />
                            <span>{post.view_count}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ClockCircleOutlined />
                            <span>{post.reading_time} phút</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Pagination */}
            <div className="flex justify-center mt-12">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={mockPosts.length} // Thay bằng total từ API
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger={false}
              />
            </div>
          </>
        ) : (
          <Empty
            description="Không tìm thấy bài viết nào"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </div>
    </div>
  );
};

export default BlogPage;