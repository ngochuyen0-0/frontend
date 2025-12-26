import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  Checkbox,
  Button,
  Select,
  Tag,
  Empty,
  Divider,
  Dropdown,
  Space,
  message,
  Pagination
} from "antd";
import {
  HeartFilled,
  DeleteOutlined,
  ShoppingCartOutlined,
  EyeOutlined,
  ShareAltOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  SortAscendingOutlined,
  FilterOutlined
} from "@ant-design/icons";

const { Option } = Select;

// Mock data
const mockWishlistItems = [
  {
    id: "1",
    productId: "p1",
    name: "iPhone 14 Pro",
    imageUrl: "https://via.placeholder.com/200x200?text=iPhone",
    price: 999,
    salePrice: 1099,
    rating: 4.5,
    stock: 10,
    addedAt: new Date('2024-01-15'),
    category: "Electronics"
  },
  {
    id: "2",
    productId: "p2",
    name: "MacBook Air M2",
    imageUrl: "https://via.placeholder.com/200x200?text=MacBook",
    price: 1199,
    rating: 5.0,
    stock: 5,
    addedAt: new Date('2024-01-10'),
    category: "Electronics"
  },
  {
    id: "3",
    productId: "p3",
    name: "AirPods Pro",
    imageUrl: "https://via.placeholder.com/200x200?text=AirPods",
    price: 249,
    salePrice: 299,
    rating: 4.3,
    stock: 3,
    addedAt: new Date('2024-01-05'),
    category: "Electronics"
  },
  {
    id: "4",
    productId: "p4",
    name: "Nike Air Force 1",
    imageUrl: "https://via.placeholder.com/200x200?text=Nike",
    price: 120,
    rating: 3.2,
    stock: 0,
    addedAt: new Date('2024-01-01'),
    category: "Shoes"
  },
  {
    id: "5",
    productId: "p5",
    name: "Samsung Galaxy Watch",
    imageUrl: "https://via.placeholder.com/200x200?text=Watch",
    price: 299,
    salePrice: 349,
    rating: 4.7,
    stock: 8,
    addedAt: new Date('2023-12-28'),
    category: "Electronics"
  },
  {
    id: "6",
    productId: "p6",
    name: "Levi's Jeans",
    imageUrl: "https://via.placeholder.com/200x200?text=Jeans",
    price: 89,
    rating: 4.1,
    stock: 15,
    addedAt: new Date('2023-12-25'),
    category: "Clothing"
  }
];

type WishlistItem = {
  id: string;
  productId: string;
  name: string;
  imageUrl: string;
  price: number;
  salePrice?: number;
  rating: number;
  stock: number;
  addedAt: Date;
  category: string;
};

const WishlistPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [items] = useState<WishlistItem[]>(mockWishlistItems);

  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  // Handle selection
  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedItems(checked ? items.map(item => item.id) : []);
  };

  // Handle actions
  const handleAddToCart = (item: WishlistItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    message.success(`Added ${item.name} to cart`);
  };

  const handleRemoveItem = (itemId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    message.success('Item removed from wishlist');
  };

  const handleRemoveSelected = () => {
    if (selectedItems.length === 0) return;
    message.success(`Removed ${selectedItems.length} items from wishlist`);
    setSelectedItems([]);
  };

  const handleAddSelectedToCart = () => {
    if (selectedItems.length === 0) return;
    message.success(`Added ${selectedItems.length} items to cart`);
  };

  // Stock status component
  const renderStockStatus = (stock: number) => {
    if (stock === 0) {
      return <Tag color="red">Out of Stock</Tag>;
    } else if (stock < 5) {
      return <Tag color="orange">Only {stock} left</Tag>;
    } else {
      return <Tag color="green">In Stock</Tag>;
    }
  };

  // Rating stars component
  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        <span className="text-yellow-400">⭐</span>
        <span className="text-sm text-gray-600">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  // Grid View Item
  const GridItem: React.FC<{ item: WishlistItem }> = ({ item }) => {
    const isSelected = selectedItems.includes(item.id);
    const discountPercent = item.salePrice 
      ? Math.round((1 - item.price / item.salePrice) * 100)
      : 0;

    return (
      <Card
        className="relative group hover:shadow-lg transition-all duration-300"
        bodyStyle={{ padding: '16px' }}
      >
        {/* Selection checkbox */}
        <Checkbox
          checked={isSelected}
          onChange={() => handleSelectItem(item.id)}
          className="absolute top-3 left-3 z-10"
        />

        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            type="text"
            icon={<DeleteOutlined />}
            danger
            size="small"
            onClick={(e) => handleRemoveItem(item.id, e)}
          />
          <Button
            type="text"
            icon={<ShoppingCartOutlined />}
            size="small"
            onClick={(e) => handleAddToCart(item, e)}
            disabled={item.stock === 0}
          />
        </div>

        {/* Product image */}
        <div className="aspect-square mb-3 bg-gray-50 rounded-lg flex items-center justify-center p-4">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-contain"
          />
          {discountPercent > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              -{discountPercent}%
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2 h-12">
            {item.name}
          </h3>
          
          <div className="flex items-center justify-between">
            {renderRating(item.rating)}
            {renderStockStatus(item.stock)}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              {formatCurrency(item.price)}
            </span>
            {item.salePrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatCurrency(item.salePrice)}
              </span>
            )}
          </div>

          {/* Add to cart button */}
          <Button
            type="primary"
            block
            icon={<ShoppingCartOutlined />}
            onClick={(e) => handleAddToCart(item, e)}
            disabled={item.stock === 0}
            className="mt-2"
          >
            {item.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
      </Card>
    );
  };

  // List View Item
  const ListItem: React.FC<{ item: WishlistItem }> = ({ item }) => {
    const isSelected = selectedItems.includes(item.id);
    const discountPercent = item.salePrice 
      ? Math.round((1 - item.price / item.salePrice) * 100)
      : 0;

    return (
      <Card className="mb-4 hover:shadow-md transition-shadow" bodyStyle={{ padding: '16px' }}>
        <div className="flex gap-4">
          {/* Selection checkbox */}
          <Checkbox
            checked={isSelected}
            onChange={() => handleSelectItem(item.id)}
            className="mt-4"
          />

          {/* Product image */}
          <div className="w-24 h-24 bg-gray-50 rounded-lg flex items-center justify-center p-2 flex-shrink-0">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-contain"
            />
            {discountPercent > 0 && (
              <div className="absolute top-1 left-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded">
                -{discountPercent}%
              </div>
            )}
          </div>

          {/* Product details */}
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900 mb-1">
                  {item.name}
                </h3>
                <div className="flex items-center gap-4 mb-2">
                  {renderRating(item.rating)}
                  <span className="text-sm text-gray-500">
                    Added: {item.addedAt.toLocaleDateString()}
                  </span>
                  <Tag color="blue">{item.category}</Tag>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-gray-900">
                    {formatCurrency(item.price)}
                  </span>
                  {item.salePrice && (
                    <span className="text-lg text-gray-500 line-through">
                      {formatCurrency(item.salePrice)}
                    </span>
                  )}
                  {renderStockStatus(item.stock)}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <Button
                  icon={<ShoppingCartOutlined />}
                  onClick={(e) => handleAddToCart(item, e)}
                  disabled={item.stock === 0}
                >
                  {item.stock === 0 ? 'Notify Me' : 'Add to Cart'}
                </Button>
                <Button
                  icon={<DeleteOutlined />}
                  danger
                  onClick={(e) => handleRemoveItem(item.id, e)}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  // Empty state
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Empty
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            imageStyle={{ height: 120 }}
            description={
              <span className="text-gray-600 text-lg">
                Your wishlist is empty
              </span>
            }
          >
            <div className="text-center space-y-4">
              <p className="text-gray-500">
                Save items you love to see them here later
              </p>
              <Button type="primary" size="large" icon={<ShoppingCartOutlined />}>
                Continue Shopping
              </Button>
            </div>
          </Empty>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <span>Home</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">Wishlist</span>
          </div>
          <div className="flex items-center gap-3">
            <HeartFilled className="text-red-500 text-2xl" />
            <h1 className="text-3xl font-bold text-gray-900">
              My Wishlist ({items.length} items)
            </h1>
          </div>
        </div>

        {/* Control Bar */}
        <Card className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Checkbox
                checked={selectedItems.length === items.length && items.length > 0}
                indeterminate={selectedItems.length > 0 && selectedItems.length < items.length}
                onChange={(e) => handleSelectAll(e.target.checked)}
              >
                Select All ({selectedItems.length})
              </Checkbox>

              <Select
                value={sortBy}
                onChange={setSortBy}
                suffixIcon={<SortAscendingOutlined />}
                style={{ width: 160 }}
              >
                <Option value="newest">Newest First</Option>
                <Option value="price-low">Price: Low to High</Option>
                <Option value="price-high">Price: High to Low</Option>
                <Option value="name">Name: A-Z</Option>
                <Option value="rating">Highest Rated</Option>
              </Select>
            </div>

            <div className="flex items-center gap-4">
              {/* View Toggle */}
              <Button.Group>
                <Button
                  type={viewMode === 'grid' ? 'primary' : 'default'}
                  icon={<AppstoreOutlined />}
                  onClick={() => setViewMode('grid')}
                />
                <Button
                  type={viewMode === 'list' ? 'primary' : 'default'}
                  icon={<UnorderedListOutlined />}
                  onClick={() => setViewMode('list')}
                />
              </Button.Group>

              {/* Bulk Actions */}
              {selectedItems.length > 0 && (
                <div className="flex items-center gap-2">
                  <Button
                    type="primary"
                    icon={<ShoppingCartOutlined />}
                    onClick={handleAddSelectedToCart}
                  >
                    Add Selected to Cart ({selectedItems.length})
                  </Button>
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={handleRemoveSelected}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Products Grid/List */}
        {viewMode === 'grid' ? (
          <Row gutter={[16, 16]}>
            {items.map(item => (
              <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
                <GridItem item={item} />
              </Col>
            ))}
          </Row>
        ) : (
          <div>
            {items.map(item => (
              <ListItem key={item.id} item={item} />
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center mt-8">
          <Pagination
            total={items.length}
            showSizeChanger
            showQuickJumper
            showTotal={(total, range) => 
              `${range[0]}-${range[1]} of ${total} items`
            }
          />
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;