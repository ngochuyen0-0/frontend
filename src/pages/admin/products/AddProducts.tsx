import React, { useState } from 'react';
import { message } from 'antd';
import Step1BasicInfo from './Step1';
import Step2Variants from './Step2';
import Step3Images from './Step3';
import Step4Review from './Step4';

const ProductAddPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [productData, setProductData] = useState<any>(null);
  const [variants, setVariants] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [productId, setProductId] = useState<string>('');

  const handleStep1Next = async (data: any) => {
    try {
      // Gọi API tạo product
      // const response = await api.post('/products', {
      //   name: data.name,
      //   brand_id: data.brand_id,
      //   category_id: data.category_id,
      //   description: data.description
      // });
      
      // Mock response
      const mockResponse = { id: 'prod-' + Date.now() };
      setProductId(mockResponse.id);
      setProductData(data);
      setCurrentStep(1);
      message.success('Product created successfully!');
    } catch (error) {
      message.error('Failed to create product');
    }
  };

  const handleStep2Next = async (variantsData: any[]) => {
    try {
      // Gọi API tạo variants
      // for (const variant of variantsData) {
      //   await api.post('/variants', {
      //     product_id: productId,
      //     sku: variant.sku,
      //     price: variant.price,
      //     color: variant.color,
      //     size: variant.size,
      //     stock_quantity: variant.stock_quantity
      //   });
      // }
      
      setVariants(variantsData);
      setCurrentStep(2);
      message.success('Variants added successfully!');
    } catch (error) {
      message.error('Failed to add variants');
    }
  };

  const handleStep3Next = async (imagesData: any[]) => {
    try {
      // Gọi API upload images
      // for (const image of imagesData) {
      //   await api.post('/images', {
      //     product_id: productId,
      //     image_url: image.url, // Trong thực tế cần upload file lên cloud
      //     is_thumbnail: image.is_thumbnail
      //   });
      // }
      
      setImages(imagesData);
      setCurrentStep(3);
      message.success('Images uploaded successfully!');
    } catch (error) {
      message.error('Failed to upload images');
    }
  };

  const handleFinalSubmit = async (finalData: any) => {
    // Tất cả data đã được lưu qua các bước trước
    // Ở đây có thể thực hiện các hành động cuối cùng
    console.log('Final product data:', finalData);
    
    // Redirect hoặc thông báo thành công
    message.success('Product completed successfully!');
  };

  const handleEditStep = (step: number) => {
    setCurrentStep(step);
  };

  const steps = [
    <Step1BasicInfo 
      key="step1"
      onNext={handleStep1Next}
      onCancel={() => console.log('cancel')}
    />,
    <Step2Variants 
      key="step2"
      onNext={handleStep2Next}
      onBack={() => setCurrentStep(0)}
      productData={productData}
      initialVariants={variants}
    />,
    <Step3Images 
      key="step3"
      onNext={handleStep3Next}
      onBack={() => setCurrentStep(1)}
      productData={productData}
      variants={variants}
      initialImages={images}
    />,
    <Step4Review 
      key="step4"
      onBack={() => setCurrentStep(2)}
      onEditStep={handleEditStep}
      productData={productData}
      variants={variants}
      images={images}
      onSubmit={handleFinalSubmit}
    />
  ];

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      {steps[currentStep]}
    </div>
  );
};

export default ProductAddPage;