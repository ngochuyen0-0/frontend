import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  Checkbox,
  Slider,
  Select,
  Tag,
  Button,
  Input,
  Divider,
  Empty,
  Pagination,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  CloseOutlined,
} from "@ant-design/icons";

const { Option } = Select;

// Mock data
const brands = ["Apple", "Samsung", "Sony", "Xiaomi", "LG", "Dell", "HP"];
const categories = ["Electronics", "Clothing", "Books", "Home & Garden", "Sports", "Beauty"];
const colors = ["Red", "Blue", "Green", "Black", "White", "Yellow", "Purple"];
const statuses = ["In Stock", "Out of Stock", "On Sale", "New Arrival"];

type FilterType = {
  brands: string[];
  categories: string[];
  colors: string[];
  statuses: string[];
  priceRange: [number, number];
};

const SearchPage: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState<FilterType>({
    brands: [],
    categories: [],
    colors: [],
    statuses: [],
    priceRange: [0, 1000],
  });
  const [showFilters, setShowFilters] = useState(true);

  // Handle filter changes
  const handleBrandChange = (checkedValues: string[]) => {
    setFilters(prev => ({ ...prev, brands: checkedValues }));
  };

  const handleCategoryChange = (checkedValues: string[]) => {
    setFilters(prev => ({ ...prev, categories: checkedValues }));
  };

  const handleColorChange = (checkedValues: string[]) => {
    setFilters(prev => ({ ...prev, colors: checkedValues }));
  };

  const handleStatusChange = (checkedValues: string[]) => {
    setFilters(prev => ({ ...prev, statuses: checkedValues }));
  };

  const handlePriceChange = (value: [number, number]) => {
    setFilters(prev => ({ ...prev, priceRange: value }));
  };

  // Remove individual filter
  const removeFilter = (type: keyof FilterType, value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].filter(item => item !== value)
    }));
  };

  // Remove all filters
  const clearAllFilters = () => {
    setFilters({
      brands: [],
      categories: [],
      colors: [],
      statuses: [],
      priceRange: [0, 1000],
    });
  };

  // Check if any filter is active
  const hasActiveFilters = () => {
    return (
      filters.brands.length > 0 ||
      filters.categories.length > 0 ||
      filters.colors.length > 0 ||
      filters.statuses.length > 0 ||
      filters.priceRange[0] > 0 ||
      filters.priceRange[1] < 1000
    );
  };

  // Render filter tags
  const renderFilterTags = () => {
    const tags: React.ReactNode[] = [];

    filters.brands.forEach(brand => 
      tags.push(
        <Tag
          key={`brand-${brand}`}
          closable
          onClose={() => removeFilter('brands', brand)}
          className="mb-2"
        >
          Brand: {brand}
        </Tag>
      )
    );

    filters.categories.forEach(category => 
      tags.push(
        <Tag
          key={`category-${category}`}
          closable
          onClose={() => removeFilter('categories', category)}
          className="mb-2"
        >
          Category: {category}
        </Tag>
      )
    );

    filters.colors.forEach(color => 
      tags.push(
        <Tag
          key={`color-${color}`}
          closable
          onClose={() => removeFilter('colors', color)}
          className="mb-2"
        >
          Color: {color}
        </Tag>
      )
    );

    filters.statuses.forEach(status => 
      tags.push(
        <Tag
          key={`status-${status}`}
          closable
          onClose={() => removeFilter('statuses', status)}
          className="mb-2"
        >
          Status: {status}
        </Tag>
      )
    );

    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) {
      tags.push(
        <Tag
          key="price-range"
          closable
          onClose={() => setFilters(prev => ({ ...prev, priceRange: [0, 1000] }))}
          className="mb-2"
        >
          Price: ${filters.priceRange[0]} - ${filters.priceRange[1]}
        </Tag>
      );
    }

    return tags;
  };

  return (
    <div className="min-h-screen px-[10%] bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Search Header */}
        <Card className="mb-8" style={{marginBottom: '20px'}}>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full md:w-auto">
              <Input
                size="large"
                placeholder="Search products..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full"
              />
            </div>
            <Button
              icon={<FilterOutlined />}
              onClick={() => setShowFilters(!showFilters)}
              type={showFilters ? "primary" : "default"}
            >
              Filters
            </Button>
          </div>
        </Card>

        {/* Active Filters */}
        {hasActiveFilters() && (
          <Card className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold">Active Filters:</span>
              <Button type="link" onClick={clearAllFilters} className="p-0">
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {renderFilterTags()}
            </div>
          </Card>
        )}

        <Row gutter={[24, 24]}>
          {/* Filters Sidebar */}
          {showFilters && (
            <Col xs={24} md={6}>
              <Card title="Filters" className="sticky top-4">
                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Price Range</h4>
                  <Slider
                    range
                    min={0}
                    max={1000}
                    value={filters.priceRange}
                    // onChange={handlePriceChange}
                    tooltip={{ formatter: (value) => `$${value}` }}
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>${filters.priceRange[0]}</span>
                    <span>${filters.priceRange[1]}</span>
                  </div>
                </div>

                <Divider />

                {/* Brands */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Brands</h4>
                  <Checkbox.Group
                    value={filters.brands}
                    onChange={handleBrandChange}
                    className="flex flex-col gap-2"
                  >
                    {brands.map(brand => (
                      <Checkbox key={brand} value={brand}>
                        {brand}
                      </Checkbox>
                    ))}
                  </Checkbox.Group>
                </div>

                <Divider />

                {/* Categories */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Categories</h4>
                  <Checkbox.Group
                    value={filters.categories}
                    onChange={handleCategoryChange}
                    className="flex flex-col gap-2"
                  >
                    {categories.map(category => (
                      <Checkbox key={category} value={category}>
                        {category}
                      </Checkbox>
                    ))}
                  </Checkbox.Group>
                </div>

                <Divider />

                {/* Colors */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Colors</h4>
                  <Checkbox.Group
                    value={filters.colors}
                    onChange={handleColorChange}
                    className="flex flex-col gap-2"
                  >
                    {colors.map(color => (
                      <Checkbox key={color} value={color}>
                        <span className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full inline-block"
                            style={{ backgroundColor: color.toLowerCase() }}
                          />
                          {color}
                        </span>
                      </Checkbox>
                    ))}
                  </Checkbox.Group>
                </div>

                <Divider />

                {/* Status */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Status</h4>
                  <Checkbox.Group
                    value={filters.statuses}
                    onChange={handleStatusChange}
                    className="flex flex-col gap-2"
                  >
                    {statuses.map(status => (
                      <Checkbox key={status} value={status}>
                        {status}
                      </Checkbox>
                    ))}
                  </Checkbox.Group>
                </div>
              </Card>
            </Col>
          )}

          {/* Products Grid */}
          <Col xs={24} md={showFilters ? 18 : 24}>
            <div className="flex items-center justify-between mb-4 mt-6">
              <span className="text-gray-600">
                Showing 0 results {searchText && `for "${searchText}"`}
              </span>
              
              {/* Sort Options */}
              <Select defaultValue="featured" style={{ width: 200 }}>
                <Option value="featured">Featured</Option>
                <Option value="price-low">Price: Low to High</Option>
                <Option value="price-high">Price: High to Low</Option>
                <Option value="newest">Newest</Option>
                <Option value="rating">Best Rating</Option>
              </Select>
            </div>

            {/* Products List - Empty State for demo */}
            <Card>
              <Empty
                description={
                  searchText || hasActiveFilters() 
                    ? "No products found matching your criteria" 
                    : "Start searching or apply filters to see products"
                }
              />
            </Card>

            {/* Pagination */}
            <div className="flex justify-center mt-6">
              <Pagination
                total={0}
                showSizeChanger
                showQuickJumper
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`
                }
              />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default SearchPage;