import React, { useState, useEffect } from "react";
import {
    Form,
    Input,
    Button,
    Card,
    Row,
    Col,
    Select,
    Tag,
    Space,
    message,
    Steps,
    Divider,
} from "antd";
import {
    ArrowLeftOutlined,
    ArrowRightOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import { toast } from "sonner";
import { useBrandStore } from "../../../store/useBrandStore";
import { useCategoryStore } from "../../../store/useCategoryStore";
import { useProductStore } from "../../../store/useProductStore";

const { Option } = Select;
const { TextArea } = Input;
const { Step } = Steps;

// Types
interface Brand {
    id: string;
    name: string;
    logo_url?: string;
}

interface Category {
    id: string;
    name: string;
    parent_id?: string;
    children?: Category[];
}

interface BasicProductData {
    id?: string;
    name: string;
    brand_id: string;
    category_id: string;
    description: string;
    // status: "draft" | "published";
}

interface Step1Props {
    onNext: (data: BasicProductData) => void;
    onCancel: () => void;
    initialData?: Partial<BasicProductData>;
}

const Step1BasicInfo: React.FC<Step1Props> = ({
    onNext,
    onCancel,
    initialData,
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    //   const [tags, setTags] = useState<string[]>(initialData?.tags || []);
    const [inputVisible, setInputVisible] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const { getBrands } = useBrandStore();
    const { getCategories } = useCategoryStore();
    const { createProduct } = useProductStore();

    // Mock data - sẽ thay bằng API calls
    const [brands, setBrands] = useState<Brand[]>([]);

    const [categories, setCategories] = useState<Category[]>([]);

    const [subcategories, setSubcategories] = useState<Category[]>([]);

    // Load data từ API
    useEffect(() => {
        loadBrands();
        loadCategories();
    }, []);

    const loadBrands = async () => {
        try {
            const response = await getBrands({
                id: "",
                searchKeyword: "",
                page: 1,
                row: 100,
            });
            setBrands(response.data);

            console.log("Loading brands...");
        } catch (error) {
            message.error("Failed to load brands");
        }
    };

    const loadCategories = async () => {
        try {
            const response = await getCategories({
                id: "",
                searchKeyword: "",
                page: 1,
                row: 100,
            });
            const parentCategories = response.data.filter(
                (item) => item.parent_id === null
            );

            // Tạo structure có children
            const categoriesWithChildren = parentCategories.map((parent) => ({
                ...parent,
                children: response.data.filter(
                    (child) => child.parent_id === parent.id
                ),
            }));

            setCategories(categoriesWithChildren);
            console.log("Categories with children:", categoriesWithChildren);
        } catch (error) {
            message.error("Failed to load categories");
        }
    };

    const handleCategoryChange = (categoryId: string) => {
        const category = categories.find((cat) => cat.id === categoryId);
        const subs = category?.children || [];

        setSubcategories(subs);
        // chỉ set category cha
        form.setFieldValue("parent_category_id", categoryId);
        form.setFieldValue("category_id", categoryId); // nếu không chọn subcate thì đây là cate chính

        // reset subcategory nếu đổi sang category khác
        if (subs.length === 0) {
            form.setFieldValue("category_id", categoryId);
        } else {
            form.setFieldValue("category_id", undefined);
        }
    };

    // Khi chọn subcategory
    const handleSubcategoryChange = (subcategoryId: string) => {
        // Set category_id là subcategory
        form.setFieldValue("category_id", subcategoryId);
    };

    // Tag management
    //   const handleTagClose = (removedTag: string) => {
    //     const newTags = tags.filter(tag => tag !== removedTag);
    //     setTags(newTags);
    //   };

    const showInput = () => {
        setInputVisible(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleInputConfirm = () => {
        // if (inputValue && !tags.includes(inputValue)) {
        //     setTags([...tags, inputValue]);
        // }
        setInputVisible(false);
        setInputValue("");
    };

    // Form submission
    const handleSubmit = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();

            const productData: BasicProductData = {
                name: values.name,
                brand_id: values.brand_id,
                category_id:
                    values.category_id === undefined
                        ? values.parent_category_id
                        : values.category_id, // Đây là id cuối cùng
                description: values.description,
                // tags: tags,
            };

            console.log("Step 1 Data:", productData);

            // Gọi API tạo product cơ bản
            const response = await createProduct(productData);

            if (response.id) {
                toast.success('Thêm sản phẩm thành công');
            }

            console.log('response prod: ', response);
            console.log('response status: ', response.status);
            
            const productId = response.id;
            const data = {
                ...productData,
                productId
            };

            // Truyền data sang step 2
            onNext(data);
        } catch (error) {
            console.error("Validation failed:", error);
            message.error("Please fill in all required fields");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Progress Steps */}
            <Card style={{ marginBottom: "20px" }}>
                <Steps current={0} size="small">
                    <Step title="Thông tin cơ bản" description="Chi tiết sản phẩm" />
                    <Step title="Biến thể" description="Các biến thể sản phẩm" />
                    <Step title="Hình ảnh" description="Hình ảnh sản phẩm" />
                    <Step title="Hoàn tất" description="Xem lại và chỉnh sửa" />
                </Steps>
            </Card>

            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    status: "draft",
                    ...initialData,
                }}
                onFinish={handleSubmit}
            >
                {/* Product Details */}
                <Card
                    title="🛠️ Chi tiết sản phẩm"
                    className="!shadow-sm"
                    style={{ marginBottom: "20px" }}
                >
                    <Space direction="vertical" className="w-full" size="large">
                        <Form.Item
                            label="Tên sản phẩm"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                                                         message: "Vui lòng nhập tên sản phẩm",
                                },
                                {
                                    min: 2,
                                                                         message:
                                                                             "Tên sản phẩm phải có ít nhất 2 ký tự",
                                },
                            ]}
                        >
                            <Input
                                size="large"
                                placeholder="e.g., Nike Air Jordan 1 High"
                                allowClear
                            />
                        </Form.Item>

                        <Form.Item
                            label="Mô tả"
                            name="description"
                            rules={[
                                {
                                    required: true,
                                                                         message: "Vui lòng nhập mô tả sản phẩm",
                                },
                                {
                                    min: 10,
                                                                         message:
                                                                             "Mô tả phải có ít nhất 10 ký tự",
                                },
                                {
                                    max: 2000,
                                                                         message:
                                                                             "Mô tả không được vượt quá 2000 ký tự",
                                },
                            ]}
                        >
                            <TextArea
                                rows={6}
                                placeholder="Mô tả chi tiết sản phẩm. Bao gồm các tính năng, chất liệu, thông tin kích thước, v.v."
                                showCount
                                maxLength={2000}
                            />
                        </Form.Item>
                    </Space>
                </Card>

                {/* Categorization */}
                <Card
                    title="🏷️ Phân loại"
                    className="!shadow-sm"
                    style={{ marginBottom: "20px" }}
                >
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Thương hiệu"
                                name="brand_id"
                                rules={[
                                    {
                                        required: true,
                                                                                 message: "Vui lòng chọn thương hiệu",
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="Chọn thương hiệu"
                                    size="large"
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                                                             (option?.label?.toString() ?? "")
                                                                                 .toLowerCase()
                                                                                 .includes(input.toLowerCase())
                                    }
                                >
                                    {brands.map((brand) => (
                                        <Option
                                            key={brand.id}
                                            value={brand.id}
                                            label={brand.name}
                                        >
                                            <div className="flex items-center gap-2">
                                                {brand.logo_url && (
                                                    <img
                                                        src={brand.logo_url}
                                                        alt={brand.name}
                                                        className="w-6 h-6 object-contain"
                                                    />
                                                )}
                                                <span>{brand.name}</span>
                                            </div>
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Danh mục"
                                name="parent_category_id"
                                rules={[
                                    {
                                        required: true,
                                                                                 message: "Vui lòng chọn danh mục",
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="Chọn danh mục"
                                    size="large"
                                    onChange={handleCategoryChange}
                                    showSearch
                                    optionFilterProp="children"
                                >
                                    {categories.map((category) => (
                                        <Option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item label="Subcategory" name="category_id">
                                <Select
                                    placeholder="Select subcategory (optional)"
                                    size="large"
                                    disabled={subcategories.length === 0}
                                    onChange={handleSubcategoryChange}
                                >
                                    {subcategories.map((subcategory) => (
                                        <Option
                                            key={subcategory.id}
                                            value={subcategory.id}
                                        >
                                            {subcategory.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item label="Status" name="status">
                                <Select size="large">
                                    <Option value="draft">Draft</Option>
                                    <Option value="published">Published</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>

                {/* Tags */}
                {/* <Card title="📝 Tags" className="!shadow-sm" style={{marginBottom: '20px'}}>
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-700 mb-2">Product Tags</div>
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map(tag => (
                <Tag
                  key={tag}
                  closable
                  onClose={() => handleTagClose(tag)}
                  className="px-3 py-1"
                >
                  {tag}
                </Tag>
              ))}
            </div>
            
            {inputVisible ? (
              <Input
                type="text"
                size="large"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputConfirm}
                onPressEnter={handleInputConfirm}
                placeholder="Enter tag name"
                autoFocus
              />
            ) : (
              <Button 
                type="dashed" 
                icon={<PlusOutlined />}
                onClick={showInput}
              >
                Add Tag
              </Button>
            )}
          </div>
          <div className="text-xs text-gray-500">
            Tags help customers find your product. Use relevant keywords.
          </div>
        </Card> */}

                {/* Action Buttons */}
                <Card className="!shadow-sm">
                    <div className="flex justify-between">
                        <Button
                            size="large"
                            onClick={onCancel}
                            icon={<ArrowLeftOutlined />}
                        >
                            Hủy
                        </Button>

                        <Button
                            type="primary"
                            size="large"
                            loading={loading}
                            htmlType="submit"
                            icon={<ArrowRightOutlined />}
                        >
                            Tiếp: Biến thể
                        </Button>
                    </div>
                </Card>
            </Form>
        </div>
    );
};

export default Step1BasicInfo;
