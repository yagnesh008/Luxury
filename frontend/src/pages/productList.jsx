import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { formatShortPrice } from "../utils/formatPrice";
import Navbar from "../components/navbar";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(50000);
  const [showFilters, setShowFilters] = useState(false);

  const navigate = useNavigate();
  const { cart, addToCart } = useCart();

  useEffect(() => {
    API.get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    document.body.style.overflow = showFilters ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showFilters]);

  const categories = [
    { label: "All", value: "all" },
    { label: "Rings", value: "rings" },
    { label: "Necklace", value: "necklaces" },
    { label: "Bracelet", value: "bracelets" },
    { label: "Coins", value: "coins" },
    { label: "Earrings", value: "earrings" },
    { label: "Bars", value: "bars" },
  ];

  const filtered = useMemo(() => {
    return [...products]
      .filter(
        (p) =>
          category === "all" ||
          p.category?.toLowerCase() === category.toLowerCase()
      )
      .filter(
        (p) => !search || p.name?.toLowerCase().includes(search.toLowerCase())
      )
      .filter((p) => Number(p.price) <= maxPrice)
      .sort((a, b) => {
        if (sort === "low-high") return a.price - b.price;
        if (sort === "high-low") return b.price - a.price;
        return 0;
      });
  }, [products, category, search, maxPrice, sort]);

  const clearFilters = () => {
    setCategory("all");
    setSearch("");
    setSort("");
    setMaxPrice(50000);
  };

  const renderFilterContent = () => (
    <>
      <div className="sidebar-section">
        <div className="section-head">
          <h3>Categories</h3>
        </div>

        <div className="category-list">
          {categories.map((item) => (
            <button
              key={item.value}
              type="button"
              className={`category-btn ${category === item.value ? "active" : ""}`}
              onClick={() => setCategory(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-section price-filter">
        <div className="section-head">
          <h3>Max Price</h3>
          <span className="price-value">{formatShortPrice(maxPrice)}</span>
        </div>

        <input
          type="range"
          min="10000"
          max="10000000"
          step="1000"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
        />
      </div>
    </>
  );

  return (
    <>
      <Navbar onMenuClick={() => setShowFilters(true)} />

      <div className="page-layout">
        <aside className="sidebar glass desktop-sidebar">
          <div className="sidebar-top">
            <h2 className="sidebar-title">Filters</h2>
            <button type="button" className="clear-btn" onClick={clearFilters}>
              Clear
            </button>
          </div>

          {renderFilterContent()}
        </aside>

        <main className="product-section">
          <div className="top-bar desktop-topbar">
            <div className="top-bar-right">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search jewelry..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="sort-box">
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="">Sort By</option>
                  <option value="low-high">Price Low → High</option>
                  <option value="high-low">Price High → Low</option>
                </select>
              </div>
            </div>
          </div>

          <div
            className={`filter-drawer-overlay ${showFilters ? "open" : ""}`}
            onClick={() => setShowFilters(false)}
          >
            <div className="filter-drawer" onClick={(e) => e.stopPropagation()}>
              <div className="filter-drawer-header">
                <h3>Filters</h3>
                <button
                  type="button"
                  className="filter-close-btn"
                  onClick={() => setShowFilters(false)}
                >
                  ✕
                </button>
              </div>

              <div className="filter-drawer-body">
                <div className="drawer-search-block">
                  <div className="section-head">
                    <h3>Search</h3>
                    <button
                      type="button"
                      className="clear-btn"
                      onClick={clearFilters}
                    >
                      Reset
                    </button>
                  </div>

                  <input
                    type="text"
                    placeholder="Search jewelry..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                {renderFilterContent()}
              </div>

              <div className="drawer-footer">
                <button
                  type="button"
                  className="btns drawer-clear-btn"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>

                <button
                  type="button"
                  className="btns drawer-apply-btn"
                  onClick={() => setShowFilters(false)}
                >
                  View {filtered.length} Product{filtered.length !== 1 ? "s" : ""}
                </button>
              </div>
            </div>
          </div>

          <div className="products-header">
            <div>
              <h2><span style={{ color: "var(--gold)"} }>Luxury </span> Collection</h2>
              <p>
                Showing <strong>{filtered.length}</strong> product
                {filtered.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className="product-container">
            {filtered.length === 0 ? (
              <div className="empty-state">
                <h2>No products found</h2>
                <p>Try changing category, search, or max price.</p>
              </div>
            ) : (
              filtered.map((p) => {
                const isInCart = cart.some((item) => item.product_id === p.id);

                return (
                  <div className="product-card glass" key={p.id}>
                    <img
                      src={p.image}
                      alt={p.name}
                      onError={(e) => {
                        e.currentTarget.src = "/no-image.png";
                      }}
                    />

                    <div className="product-info">
                      <h3>{p.name}</h3>
                      <p className="product-price">{formatShortPrice(p.price)}</p>
                    </div>

                    {isInCart ? (
                      <button className="btns" onClick={() => navigate("/cart")}>
                        Go to Cart
                      </button>
                    ) : (
                      <button
                        className="btns"
                        onClick={() => {
                          addToCart({
                            user_id: localStorage.getItem("userId"),
                            product_id: p.id,
                            quantity: 1,
                          });
                          toast.success("Added to cart");
                        }}
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>
    </>
  );
}