// components/admin/VariantForm.tsx
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
            form.setFieldsValue(variant);
        } else if (visible) {
            form.resetFields();
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
                    stock_quantity: form.getFieldValue("stock_quantity"),
                })
                toast.success('Variant created successfully');
                useProduct.getProductVariants({ product_id: form.getFieldValue('product_id') });

            } else {
                await useProduct.updateProductVariant(form.getFieldValue("id"), {
                    sku: form.getFieldValue("sku"),
                    color: form.getFieldValue("color"),
                    size: form.getFieldValue("size"),
                    price: form.getFieldValue("price"),
                    stock_quantity: form.getFieldValue("stock_quantity"),
                })
                toast.success('Variant updated successfully');
                useProduct.getProductVariants({ product_id: form.getFieldValue('product_id') });
            }
            onSuccess();
        } catch (error) {
            toast.error('Operation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={type === 'create' ? 'Create New Variant' : 'Edit Variant'}
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
                    rules={[{ required: true, message: 'Please enter SKU' }]}

                >
                    <Input placeholder="Enter SKU (e.g. NAF1)"
                        addonAfter={
                            <Button
                                type="link"
                                onClick={generateSKU}
                                style={{
                                    width: '50px'
                                }}
                            >
                                Gen Auto
                            </Button>
                        }
                    />
                </Form.Item>

                {/* Color */}
                <Form.Item
                    label="Color"
                    name="color"
                    rules={[{ required: true, message: 'Please enter color' }]}
                >
                    <Input placeholder="Enter color (e.g. red)" />
                </Form.Item>

                {/* Size */}
                <div className='flex gap-1'>
                    <Form.Item
                        label="Size"
                        name="size"
                        rules={[{ required: true, message: 'Please enter size' }]}
                    >
                        <Input placeholder="Enter size (e.g. 32)" />
                    </Form.Item>

                    {/* Price */}
                    <Form.Item
                        label="Price ($)"
                        name="price"
                        rules={[{ required: true, message: 'Please enter price' }]}
                    >
                        <InputNumber
                            className="w-full"
                            min={0}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                            placeholder="Enter price"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Stock Quantity"
                        name="stock_quantity"
                        rules={[{ required: true, message: 'Please enter stock quantity' }]}
                    >
                        <InputNumber className="w-full" min={0} placeholder="Enter stock quantity" />
                    </Form.Item>
                </div>

                {/* Product ID */}
                <Form.Item
                    label="Product"
                    name="product_id"
                    rules={[{ required: true, message: 'Please select Product' }]}
                >
                    <Select placeholder="Select product" style={{ height: "auto" }}>
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
                    label="Active Status"
                    name="is_active"
                    valuePropName="checked"
                >
                    <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                </Form.Item>

                {/* Buttons */}
                <Form.Item>
                    <div className="flex justify-end gap-2">
                        <Button onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            {type === 'create' ? 'Create' : 'Update'}
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default VariantForm;
