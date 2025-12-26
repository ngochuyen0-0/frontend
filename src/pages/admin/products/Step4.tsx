import React, { useState } from 'react';
import {
  Card,
  Button,
  Row,
  Col,
  Descriptions,
  Tag,
  Image,
  Table,
  Space,
  message,
  Steps,
  Divider,
  Alert
} from 'antd';
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  EditOutlined,
  EyeOutlined
} from '@ant-design/icons';

interface Step4Props {
  onBack: () => void;
  onEditStep: (step: number) => void;
  productData: any;
  variants: any[];
  images: any[];
  onSubmit: (finalData: any) => Promise<void>;
}
const { Step } = Steps;

const Step4Review: React.FC<Step4Props> = ({ 
  onBack, 
  onEditStep,
  productData, 
  variants, 
  images,
  onSubmit 
}) => {
  const [loading, setLoading] = useState(false);
  const [publishStatus, setPublishStatus] = useState<'draft' | 'published'>(productData.status);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const finalData = {
        product: productData,
        variants: variants,
        images: images
      };

      await onSubmit(finalData);
      
      if (publishStatus === 'published') {
        message.success('Product published successfully!');
      } else {
        message.success('Product saved as draft!');
      }
    } catch (error) {
      message.error('Failed to save product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const variantColumns = [
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
    },
    {
      title: 'Color',
      dataIndex: 'color',
      key: 'color',
      render: (color: string) => <Tag color="blue">{color}</Tag>
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price.toFixed(2)}`
    },
    {
      title: 'Stock',
      dataIndex: 'stock_quantity',
      key: 'stock_quantity',
    },
  ];

  const thumbnail = images.find(img => img.is_thumbnail);
  const totalStock = variants.reduce((sum, variant) => sum + variant.stock_quantity, 0);
  const priceRange = variants.length > 0 ? {
    min: Math.min(...variants.map(v => v.price)),
    max: Math.max(...variants.map(v => v.price))
  } : null;

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <Card>
        <Steps current={3} size="small">
          <Step title="Thông tin cơ bản" description="Chi tiết sản phẩm" />
          <Step title="Biến thể" description="Các biến thể sản phẩm" />
          <Step title="Hình ảnh" description="Hình ảnh sản phẩm" />
          <Step title="Xem lại" description="Xác nhận & xuất bản" />
        </Steps>
      </Card>

      {/* Status Alert */}
      <Alert
        message={`Sản phẩm sẽ được ${publishStatus === 'published' ? 'xuất bản' : 'lưu dưới dạng bản nháp'}`}
        type={publishStatus === 'published' ? 'success' : 'info'}
        showIcon
        action={
          <Button 
            size="small" 
            type="link"
            onClick={() => setPublishStatus(
              publishStatus === 'published' ? 'draft' : 'published'
            )}
          >
            Chuyển sang {publishStatus === 'published' ? 'Bản nháp' : 'Xuất bản'}
          </Button>
        }
      />

      {/* Product Summary */}
      <Card 
        title="📝 Thông tin sản phẩm"
        className="!shadow-sm"
        extra={
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => onEditStep(0)}
          >
            Chỉnh sửa
          </Button>
        }
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Tên sản phẩm">
                               <strong>{productData.name}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Thương hiệu">
                               {productData.brand_id}
              </Descriptions.Item>
              <Descriptions.Item label="Danh mục">
                               {productData.category_id}
                               {productData.subcategory_id && ` / ${productData.subcategory_id}`}
              </Descriptions.Item>
            </Descriptions>
          </Col>
          <Col xs={24} md={12}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Trạng thái">
                               <Tag color={publishStatus === 'published' ? 'green' : 'orange'}>
                                 {publishStatus.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Tổng số biến thể">
                               <strong>{variants.length}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Tổng số tồn kho">
                               <strong>{totalStock}</strong> đơn vị
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>

        <Divider />

        <div>
          <div className="font-medium mb-2">Mô tả:</div>
          <div className="text-gray-700 whitespace-pre-wrap">
            {productData.description}
          </div>
        </div>

        {productData.tags && productData.tags.length > 0 && (
          <>
            <Divider />
            <div>
              <div className="font-medium mb-2">Thẻ:</div>
              <Space wrap>
                {productData.tags.map((tag: string) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </Space>
            </div>
          </>
        )}
      </Card>

      {/* Variants Summary */}
      <Card 
        title="🎨 Biến thể sản phẩm"
        className="!shadow-sm"
        extra={
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => onEditStep(1)}
          >
            Chỉnh sửa
          </Button>
        }
      >
        {priceRange && (
          <div className="mb-4">
            <strong>Phạm vi giá:</strong> ${priceRange.min.toFixed(2)} - ${priceRange.max.toFixed(2)}
          </div>
        )}
        
        <Table 
          columns={variantColumns}
          dataSource={variants}
          rowKey="id"
          pagination={false}
          size="small"
        />
      </Card>

      {/* Images Summary */}
      <Card 
        title="🖼️ Hình ảnh sản phẩm"
        className="!shadow-sm"
        extra={
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => onEditStep(2)}
          >
            Chỉnh sửa
          </Button>
        }
      >
        <div className="mb-3">
          <strong>Tổng số hình ảnh:</strong> {images.length}
          {thumbnail && (
            <span className="ml-4">
              <Tag color="blue">Thumbnail Selected</Tag>
            </span>
          )}
        </div>

        <Row gutter={[8, 8]}>
          {images.map((image, index) => (
            <Col key={image.url} xs={8} md={6} lg={4}>
              <div className={`border rounded p-1 ${image.is_thumbnail ? 'border-blue-500 border-2' : 'border-gray-200'}`}>
                <Image
                  src={image.url}
                  alt={`Product ${index + 1}`}
                  preview={{
                    mask: <EyeOutlined />,
                  }}
                  className="object-cover h-20 w-full"
                />
                {image.is_thumbnail && (
                  <div className="text-xs text-center text-blue-500 font-medium mt-1">
                    Thumbnail
                  </div>
                )}
              </div>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Action Buttons */}
      <Card className="!shadow-sm">
        <div className="flex justify-between">
          <Button 
            size="large"
            onClick={onBack}
            icon={<ArrowLeftOutlined />}
          >
            Quay lại
          </Button>
          
          <Space>
            <Button 
              size="large"
              onClick={() => setPublishStatus('draft')}
            >
              Lưu dưới dạng bản nháp
            </Button>
            
            <Button 
              type="primary" 
              size="large"
              loading={loading}
              onClick={handleSubmit}
              icon={<CheckCircleOutlined />}
            >
              {publishStatus === 'published' ? 'Xuất bản sản phẩm' : 'Lưu bản nháp'}
            </Button>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default Step4Review;