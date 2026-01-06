// components/admin/VariantForm.tsx (Form Biến Thể Sản Phẩm)
import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, Switch, Button, message, Card } from 'antd';
import { ProductVariant } from '../../types/product';
import { useProductStore } from '../../store/useProductStore';
import { toast } from 'sonner';

interface VariantFormProps {
    variant: ProductVariant | null;
    type: 'create' | 'edit';
    visible: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const VariantForm: React.FC<VariantFormProps> = ({
    variant,
    type,
    visible,
    onClose,
    onSuccess
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = React.useState(false);
    const useProduct = useProductStore();

    useEffect(() => {
        useProduct?.getProducts();
    }, [])

    React.useEffect(() => {
        if (visible && variant) {
            form.setFieldsValue({
                ...variant,
                is_active: variant.is_active ?? false
            });
        } else if (visible) {
            form.resetFields();
            // Set default value for is_active when creating new variant
            form.setFieldValue("is_active", false);
        }
    }, [visible, variant, form]);
    
    const generateSKU = () => {
        const sku = `SKU-${Math.random()
            .toString(36)
            .substr(2, 9)
            .toUpperCase()}`;
        form.setFieldValue("sku", sku);
    };

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            if (type === 'create') {
                await useProduct.createProductVariant({
                    product_id: form.getFieldValue("product_id"),
                    sku: form.getFieldValue("sku"),
                    color: form.getFieldValue("color"),
                    size: form.getFieldValue("size"),
                    price: form.getFieldValue("price"),
                    stock: form.getFieldValue("stock_quantity"), // Sử dụng tên trường đúng theo interface
                    is_active: form.getFieldValue("is_active") ?? false,
                })
                toast.success('Biến thể được tạo thành công');
                useProduct.getProductVariants({ product_id: form.getFieldValue('product_id') });

            } else {
                await useProduct.updateProductVariant(form.getFieldValue("id"), {
                    sku: form.getFieldValue("sku"),
                    color: form.getFieldValue("color"),
                    size: form.getFieldValue("size"),
                    price: form.getFieldValue("price"),
                    stock: form.getFieldValue("stock_quantity"), // Sử dụng tên trường đúng theo interface
                    is_active: form.getFieldValue("is_active"),
                })
                toast.success('Biến thể được cập nhật thành công');
                useProduct.getProductVariants({ product_id: form.getFieldValue('product_id') });
            }
            onSuccess();
        } catch (error) {
            toast.error('Thao tác thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={type === 'create' ? 'Tạo Biến Thể Mới' : 'Chỉnh Sửa Biến Thể'}
            open={visible}
            onCancel={onClose}
            footer={null}
            width={600}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                {/* SKU */}
                <Form.Item
                    label="SKU"
                    name="sku"
                    rules={[{ required: true, message: 'Vui lòng nhập SKU' }]}

                >
                    <Input placeholder="Nhập SKU (ví dụ: NAF1)"
                        addonAfter={
                            <Button
                                type="link"
                                onClick={generateSKU}
                                style={{
                                    width: '50px'
                                }}
                            >
                                Tạo tự động
                            </Button>
                        }
                    />
                </Form.Item>

                {/* Color */}
                <Form.Item
                    label="Màu sắc"
                    name="color"
                    rules={[{ required: true, message: 'Vui lòng nhập màu sắc' }]}
                >
                    <Input placeholder="Nhập màu sắc (ví dụ: đỏ)" />
                </Form.Item>

                {/* Size */}
                <div className='flex gap-1'>
                    <Form.Item
                        label="Kích thước"
                        name="size"
                        rules={[{ required: true, message: 'Vui lòng nhập kích thước' }]}
                    >
                        <Input placeholder="Nhập kích thước (ví dụ: 32)" />
                    </Form.Item>

                    {/* Price */}
                    <Form.Item
                        label="Giá"
                        name="price"
                        rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
                    >
                        <InputNumber
                            className="w-full"
                            min={0}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as any}
                            placeholder="Nhập giá"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Số lượng tồn kho"
                        name="stock_quantity"
                        rules={[{ required: true, message: 'Vui lòng nhập số lượng tồn kho' }]}
                    >
                        <InputNumber className="w-full" min={0} placeholder="Nhập số lượng tồn kho" />
                    </Form.Item>
                </div>

                {/* Product ID */}
                <Form.Item
                    label="Sản phẩm"
                    name="product_id"
                    rules={[{ required: true, message: 'Vui lòng chọn sản phẩm' }]}
                >
                    <Select placeholder="Chọn sản phẩm" style={{ height: "auto" }}>
                        {useProduct?.products?.map((p, i) => {
                            const thumbnail = p.images?.find(i => i.is_thumbnail == true);
                            return (
                                <Select.Option key={i} value={p.id}>
                                    <div style={{ display: "flex", gap: 10, padding: 5 }}>
                                        <img style={{ width: 100, height: 60, objectFit: "contain", borderRadius: 5, overflow: "hidden" }} src={thumbnail?.image_url} />{`${p.name} - ${p.brand?.name}`}
                                    </div>
                                </Select.Option>
                            )
                        })}
                    </Select>
                </Form.Item>

                {/* Active status */}
                <Form.Item
                    label="Trạng thái hoạt động"
                    name="is_active"
                    valuePropName="checked"
                >
                    <Switch checkedChildren="Hoạt động" unCheckedChildren="Không hoạt động" />
                </Form.Item>

                {/* Buttons */}
                <Form.Item>
                    <div className="flex justify-end gap-2">
                        <Button onClick={onClose}>
                            Hủy
                        </Button>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            {type === 'create' ? 'Tạo' : 'Cập nhật'}
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default VariantForm;
