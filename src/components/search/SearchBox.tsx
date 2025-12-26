import "./style.css";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import apiClient from "../../utils/apiClient";
import { BoxPlotOutlined, PlusCircleFilled, SearchOutlined } from "@ant-design/icons";
import { Button, Input, Tag } from "antd";
import { getProducts, searchProduct } from "../../services/productService";
import { getBrands } from "../../services/brandService";
import { Product } from "../../types/product";
import { Brand } from "../../types/brand";


interface SearchBoxProps {
    onClose: () => void;
}
const formatCurrency = (value: number): string =>
    new Intl.NumberFormat(undefined, { style: 'currency', currency: 'VND' }).format(value);
// ==== Component ====
export default function SearchBox({ onClose }: SearchBoxProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [searchKeyword, setSearchKeyword] = useState<string>("");
    const [debouncedValue, setDebouncedValue] = useState<string>(searchKeyword);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchHistorys, setSearchHistory] = useState<string[]>([]);

    // debounce
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(searchKeyword);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchKeyword]);

    // load history
    useEffect(() => {
        const rawHistorys = localStorage.getItem("search_historys");
        if (rawHistorys) {
            try {
                const historys: string[] = JSON.parse(rawHistorys);
                setSearchHistory(historys);
            } catch {
                localStorage.removeItem("search_historys");
            }
        }
    }, []);

    // search API
    useEffect(() => {
        if (!debouncedValue) return;

        setLoading(true);

        const fetchData = async () => {
            try {
                const [products, brands] = await Promise.all([
                    getProducts({ searchKeyword: debouncedValue }),
                    getBrands({ searchKeyword: debouncedValue })
                ]);

                setProducts(products?.data);
                setBrands(brands?.data);
            } catch (err: any) {
                toast.error(err?.status || "Error fetching data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [debouncedValue]);

    // add to history
    const addHistory = () => {
        if (!searchKeyword.trim()) return;

        try {
            const historys: string[] = JSON.parse(localStorage.getItem("search_historys") || "[]");
            if (!historys.includes(searchKeyword)) {
                const newHistorys =
                    historys.length >= 15
                        ? [searchKeyword, ...historys.slice(0, 14)]
                        : [searchKeyword, ...historys];
                localStorage.setItem("search_historys", JSON.stringify(newHistorys));
                setSearchHistory(newHistorys);
            }
        } catch {
            localStorage.removeItem("search_historys");
        }
    };

    // ==== Render ====
    return (
        <div
            className="search-box-container"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="search-box-main-form">
                {/* Input box */}
                <div className="__search-box">
                    <div className="___icon">
                        <SearchOutlined color="#5a5a5aff" />
                    </div>
                    <Input
                        maxLength={100}
                        placeholder="What are you looking for?"
                        value={searchKeyword}
                        onChange={(e) => {
                            setLoading(true);
                            setSearchKeyword(e.target.value);
                        }}
                    />
                    <Button value="Search" />
                </div>

                {/* Search history */}
                <div className="chip-tags">
                    {searchHistorys.map((item, i) => (
                        <Tag
                            key={i}
                            color="blue"
                            title={item}
                            onClick={() => setSearchKeyword(item)}
                        //   onRemove={() => {
                        //     try {
                        //       const historys: string[] = JSON.parse(localStorage.getItem("search_historys") || "[]");
                        //       const newHistorys = historys.filter((h) => h !== item);
                        //       localStorage.setItem("search_historys", JSON.stringify(newHistorys));
                        //       setSearchHistory(newHistorys);
                        //     } catch {
                        //       localStorage.removeItem("search_historys");
                        //     }
                        //   }}
                        />
                    ))}
                </div>

                {/* Results */}
                <div className="results-boxs">
                    <div className="__products">
                        {loading && (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "14px",
                                    padding: "40px",
                                }}
                            >
                                Searching...
                            </div>
                        )}

                        {!loading && products.length === 0 && brands.length === 0 && (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "14px",
                                    padding: "40px",
                                }}
                            >
                                <div>...</div>
                                No results found for "{searchKeyword}"
                            </div>
                        )}

                        {!loading && (
                            <>
                                {products?.map((e) => {
                                    const thumbnail = e.images?.find(p => p.is_thumbnail);
                                    const variants = e.variants || [];
                                    let index = 0;
                                    let min = Infinity;
                                    variants.forEach((v, i) => {
                                        if (v.price < min) {
                                            min = v.price;
                                            index = i;
                                        }
                                    });
                                    const minPriceVariant = variants[index];
                                    return (
                                        <a
                                            key={`product-${e.id}`}
                                            onClick={addHistory}
                                            href={`/product/${e.id}`}
                                            style={{ textDecoration: "none" }}
                                        >
                                            <div className="result-item">
                                                <img src={thumbnail?.image_url} />
                                                <div className="result-item-content">
                                                    <div className="result-item-main">
                                                        <div className="___title">
                                                            <strong style={{ fontSize: "16px" }}>{e.name}</strong>
                                                        </div>
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: "10px",
                                                                fontSize: "12px",
                                                            }}
                                                        >
                                                            <div className="___price">{formatCurrency(minPriceVariant.price || 0)}</div>
                                                        </div>
                                                    </div>
                                                    <div className="result-item-footer">
                                                        <div style={{ fontSize: "12px" }}>Product</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    )
                                })}

                                {brands?.map((e) => (
                                    <a
                                        key={`dest-${e.id}`}
                                        onClick={addHistory}
                                        href={`/brand/${e.id}`}
                                        style={{ textDecoration: "none" }}
                                    >
                                        <div className="result-item">
                                            <img src={e.logo_url} />
                                            <div className="result-item-content">
                                                <div className="result-item-main">
                                                    <div className="___title">
                                                        <strong style={{ fontSize: "16px" }}>{e.name}</strong>
                                                    </div>
                                                </div>
                                                <div className="result-item-footer">
                                                    <div style={{ fontSize: "12px" }}>Brand</div>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
