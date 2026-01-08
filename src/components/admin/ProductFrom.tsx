// components/admin/ProductForm.tsx
import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Upload, Button, message, Row, Col, Card, Image, Tag } from 'antd';
import { CheckOutlined, DeleteOutlined, EyeOutlined, FileImageOutlined, PlusCircleFilled, PlusCircleOutlined, PlusSquareFilled, UploadOutlined } from '@ant-design/icons';
import { Product } from '../../types/product';
import { createProduct, createProductImage, updateProduct, updateProductImage } from '../../services/productService';
import TextArea from 'antd/es/input/TextArea';
import { Brand } from '../../types/brand';
import { Category } from '../../types/category';
import { getBrands } from '../../services/brandService';
import { getCategories } from '../../services/categoryService';
import { useProductStore } from '../../store/useProductStore';
import { Label } from 'recharts';
import { toast } from 'sonner';

interface ProductFormProps {
  product: Product | null;
  type: 'create' | 'edit';
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  type,
  visible,
  onClose,
  onSuccess
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const [brands, setBrands] = useState<Brand[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [inputImageURLs, setinputImageURLs] = useState<Map<string, string>>(new Map());
  const [images, setImages] = useState<{ id: string, is_thumbnail: boolean, image_url: string }[]>([]);
  const useProduct = useProductStore();

  useEffect(() => {
    getBrands({}).then(res => setBrands(res?.data));
    getCategories({}).then(res => setCategories(res?.data));
  }, [])

  React.useEffect(() => {
    if (visible && product) {
      form.setFieldsValue(product);
      setImages(product.images?.map(img => ({
        id: img.id || "",
        is_thumbnail: img.is_thumbnail || false,
        image_url: img.image_url || ""
      })) || [])
    } else if (visible) {
      form.resetFields();
      setImages([]); // Reset danh sách hình ảnh khi mở form tạo mới
    }
  }, [visible, product, form]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      let productId = "";
      
      if (type === 'create') {
        // Đối với tạo sản phẩm mới
        const res = await createProduct(values);
        productId = res.data.id;
        
        // Sau khi tạo sản phẩm thành công, thêm các hình ảnh chờ xử lý
        if (inputImageURLs && inputImageURLs.size > 0) {
          // Duyệt qua từng hình ảnh để thêm
          for (let [id, url] of inputImageURLs) {
            if (url) {
              try {
                const imageRes = await createProductImage({
                  image_url: url,
                  is_thumbnail: false,
                  product_id: productId
                });
                
                // Cập nhật danh sách hình ảnh ngay lập tức
                setImages(prev => [...prev, {
                  id: imageRes.data.id || "",
                  is_thumbnail: imageRes.data.is_thumbnail || false,
                  image_url: imageRes.data.image_url || ""
                }]);
              } catch (error) {
                console.error("Lỗi khi tạo hình ảnh:", error);
                // Không throw error ở đây để cho phép tiếp tục xử lý
                toast.error(`Không thể thêm hình ảnh: ${url}`);
              }
            }
          }
          
          // Xóa các URL hình ảnh đã được thêm
          setinputImageURLs(new Map());
        }
        
        message.success('Tạo sản phẩm thành công');
      } else {
        // Đối với chỉnh sửa sản phẩm
        await updateProduct(product?.id || "", values);
        productId = product?.id || "";
        
        // Thêm hình ảnh mới nếu có
        if (inputImageURLs && inputImageURLs.size > 0) {
          // Duyệt qua từng hình ảnh để thêm
          for (let [id, url] of inputImageURLs) {
            if (url) {
              try {
                const imageRes = await createProductImage({
                  image_url: url,
                  is_thumbnail: false,
                  product_id: productId
                });
                
                // Cập nhật danh sách hình ảnh ngay lập tức
                setImages(prev => [...prev, {
                  id: imageRes.data.id || "",
                  is_thumbnail: imageRes.data.is_thumbnail || false,
                  image_url: imageRes.data.image_url || ""
                }]);
              } catch (error) {
                console.error("Lỗi khi tạo hình ảnh:", error);
                // Không throw error ở đây để cho phép tiếp tục xử lý
                toast.error(`Không thể thêm hình ảnh: ${url}`);
              }
            }
          }
          
          // Xóa các URL hình ảnh đã được thêm
          setinputImageURLs(new Map());
        }
        
        message.success('Cập nhật sản phẩm thành công');
      }
      
      // Cập nhật lại danh sách sản phẩm
      useProduct.getProducts();
      
    } catch (error) {
      if (type === 'create') {
        message.error('Tạo sản phẩm thất bại');
      } else {
        message.error('Cập nhật sản phẩm thất bại');
      }
      // Không throw error nữa để đảm bảo onSuccess luôn được gọi
      return; // Thoát khỏi hàm nhưng vẫn tiếp tục gọi onSuccess trong finally
    } finally {
      setLoading(false);
      // Luôn gọi onSuccess để đóng modal bất kể thành công hay thất bại
      onSuccess();
    }
  };

  useEffect(() => {
    console.log(images)
  }, [images])

  return (
    <Modal
      title={type === 'create' ? 'Tạo sản phẩm mới' : 'Chỉnh sửa sản phẩm'}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      destroyOnClose={true}  /* Đảm bảo modal được hủy khi đóng */
      maskClosable={false}   /* Ngăn người dùng đóng modal bằng cách click ra ngoài khi đang xử lý */
      closable={!loading}    /* Ẩn nút đóng khi đang xử lý */
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Tên"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
        >
          <Input placeholder='ví dụ: Túi xách tay' />
        </Form.Item>
        <Form.Item
          label="Mô tả"
          name="description"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
        >
          <TextArea placeholder='Nhập mô tả cho sản phẩm' rows={4} />
        </Form.Item>
        <div className='flex gap-1 w-full'>
          <Form.Item
            className='w-full'
            label="Thương hiệu"
            name="brand_id"
            rules={[{ required: true, message: 'Vui lòng chọn thương hiệu' }]}
          >
            <Select placeholder="Chọn thương hiệu" style={{ height: "auto" }}>
              {brands?.map((e, i) => {
                return (
                  <Select.Option key={i} value={e.id}>
                    <div style={{ display: "flex", gap: 10, padding: 5, alignItems: "center" }}>
                      <img style={{ width: 60, height: 60, objectFit: "contain", borderRadius: 5, overflow: "hidden" }} src={e.logo_url} />{`${e.name}`}
                    </div>
                  </Select.Option>
                )
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label="Danh mục"
            name="category_id"
            className='w-full'

            rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
          >
            <Select placeholder="Chọn danh mục" style={{ height: "auto" }}>
              {categories?.map((e, i) => {
                return (
                  <Select.Option key={i} value={e.id}>
                    <div style={{ display: "flex", gap: 10, padding: 5, alignItems: "center" }}>
                      {`${e.icon} ${e.name}`}
                    </div>
                  </Select.Option>
                )
              })}
            </Select>
          </Form.Item>
        </div>
        <label>Hình ảnh</label>
        {Array.from(inputImageURLs.keys()).map((id, i) => {
          return (
            <Card>
              <div className='flex gap-1 w-full'>
                <Input className='w-full' value={inputImageURLs.get(id) || ''}
                  onChange={(e) => {
                    const updatedData = new Map(inputImageURLs);
                    updatedData.set(id, e.target.value);
                    setinputImageURLs(updatedData);
                  }}
                  placeholder='ví dụ: https://hostname.image.service...'
                />
                <Button onClick={() => {
                  const inputValue = inputImageURLs.get(id);
                  if (!inputValue || inputValue == "") return toast.error("URL không hợp lệ!");
                  
                  // Nếu đang tạo sản phẩm mới mà chưa submit thì lưu URL hình ảnh vào mảng chờ
                  if (type === 'create' && !product?.id) {
                    // Thêm URL vào danh sách chờ và sẽ xử lý sau khi tạo sản phẩm xong
                    toast.info("Hình ảnh sẽ được thêm sau khi tạo sản phẩm!");
                    return;
                  }
                  
                  const newImages = {
                    image_url: inputImageURLs.get(id) || "",
                    is_thumbnail: false,
                    product_id: product?.id || ""
                  }
                  createProductImage(newImages).then(res => {
                    toast.success('Tạo hình ảnh thành công!')
                    setImages(prev => [...prev, {
                      id: res.data.id || "",
                      is_thumbnail: res.data.is_thumbnail || false,
                      image_url: res.data.image_url || ""
                    }]);
                    const updatedData = new Map(inputImageURLs);
                    updatedData.delete(id);
                    setinputImageURLs(updatedData);
                  }).catch(err => {
                    toast.error("Tạo hình ảnh thất bại!");
                  });
                }}><CheckOutlined /></Button>
                <Button onClick={() => {
                  const updatedData = new Map(inputImageURLs);
                  updatedData.delete(id);
                  setinputImageURLs(updatedData);
                }}><DeleteOutlined /></Button>
              </div>
            </Card>
          )
        })}
        <Row gutter={[16, 16]} className='p-1'>
          {images?.map((image, index) => (
            <Col xs={12} md={8} lg={6} key={index}>
              <Card
                size="small"
                className="relative"
                cover={
                  <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
                    <Image
                      src={image.image_url}
                      alt={`Product image ${index + 1
                        }`}
                      preview={{ visible: false }}
                      className="cursor-pointer object-contain max-h-32"
                      fallback="https://via.placeholder.com/150?text=Error+Loading"
                    />
                    {image.is_thumbnail && (
                      <div className="absolute top-2 left-2">
                        <Tag
                          color="blue"
                        >
                          Ảnh đại diện
                        </Tag>
                      </div>
                    )}
                  </div>
                }
                actions={[
                  <Button
                    type="link"
                    size="small"
                    key="thumbnail"
                    onClick={() => {
                      console.log(images)
                      // Cập nhật tất cả ảnh để không còn là ảnh đại diện
                      const updatePromises = images.map(img => {
                        if (img.id != image.id) {
                          return updateProductImage(img.id, {
                            is_thumbnail: false
                          });
                        } else {
                          return updateProductImage(image.id, {
                            is_thumbnail: true
                          });
                        }
                      });

                      // Chờ tất cả các yêu cầu cập nhật hoàn thành
                      Promise.all(updatePromises)
                        .then(() => {
                          toast.success("Cập nhật ảnh đại diện thành công!");
                          // Không gọi onSuccess ở đây để tránh đóng modal
                        })
                        .catch(error => {
                          console.error("Lỗi khi cập nhật ảnh:", error);
                          toast.error("Cập nhật ảnh đại diện thất bại!");
                        });
                    }
                    }
                    className={
                      image.is_thumbnail
                        ? "text-green-500"
                        : ""
                    }
                  >
                    {image.is_thumbnail
                      ? "✓ Đại diện"
                      : "Đặt đại diện"}
                  </Button>,
                  <DeleteOutlined
                    key="delete"
                    onClick={() => {
                      // Cập nhật giao diện để loại bỏ hình ảnh khỏi danh sách
                      const updatedImages = images.filter(img => img.id !== image.id);
                      setImages(updatedImages);
                      toast.success("Xóa hình ảnh thành công!");
                    }
                    }
                    className="hover:text-red-500"
                  />,
                ]}
              >
                <Card.Meta
                  description={
                    <div className="text-center">
                      <div
                        className="text-xs text-gray-500 truncate"
                        title={image.id}
                      >
                        {image.id ||
                          `Ảnh ${index + 1}`}
                      </div>
                      <div
                        className="text-xs text-gray-400 truncate"
                        title={image.image_url}
                      >
                        {image.image_url.length > 30
                          ? `${image.image_url.substring(
                            0,
                            30
                          )}...`
                          : image.image_url}
                      </div>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
          <Col xs={12} md={8} lg={6}>
            <Card
              size="small"
              className="relative h-full flex items-center justify-center cursor-pointer"
              style={{ backgroundColor: "#e2e2e2ff" }}
              onClick={() => {
                const id = `${Math.floor(Math.random() * 1000)}-${Math.floor(Math.random() * 1000)}-${Math.floor(Math.random() * 1000)}`
                const newData = new Map(inputImageURLs);
                newData.set(id, "");
                setinputImageURLs(newData);
              }}
            >
              <PlusSquareFilled style={{ color: "#666", fontSize: 50 }} />
            </Card>
          </Col>
        </Row>
        <Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={onClose}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
              {type === 'create' ? 'Tạo' : 'Cập nhật'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductForm;