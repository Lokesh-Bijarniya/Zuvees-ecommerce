import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import {
  FaFilter,
  FaSearch,
  FaSortAmountDown,
  FaSortAmountUp,
  FaTimes,
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";
import { getProducts } from "../utils/api";

const ProductListing = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  // State
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: queryParams.get("category") || "all",
    priceRange: [0, 1000],
    sortBy: "newest",
  });

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getProducts();
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Apply filters whenever products or filters change
  useEffect(() => {
    if (products.length === 0) return;

    let result = [...products];

    // Apply category filter
    if (filters.category !== "all") {
      result = result.filter(
        (product) => product.category === filters.category
      );
    }

    // Apply price range filter
    result = result.filter((product) => {
      // Get min and max prices from variants
      const prices = product.variants.map((variant) => variant.price);
      const minPrice = Math.min(...prices);
      return (
        minPrice >= filters.priceRange[0] && minPrice <= filters.priceRange[1]
      );
    });

    // Apply search term
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    switch (filters.sortBy) {
      case "price-low-high":
        result.sort((a, b) => {
          const aMinPrice = Math.min(...a.variants.map((v) => v.price));
          const bMinPrice = Math.min(...b.variants.map((v) => v.price));
          return aMinPrice - bMinPrice;
        });
        break;
      case "price-high-low":
        result.sort((a, b) => {
          const aMinPrice = Math.min(...a.variants.map((v) => v.price));
          const bMinPrice = Math.min(...b.variants.map((v) => v.price));
          return bMinPrice - aMinPrice;
        });
        break;
      case "rating":
        result.sort(
          (a, b) => (b.ratings?.average || 0) - (a.ratings?.average || 0)
        );
        break;
      case "newest":
      default:
        // Assuming newest products have the most recent createdAt date
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    setFilteredProducts(result);
  }, [products, filters, searchTerm]);

  // Update URL when category filter changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (filters.category === "all") {
      params.delete("category");
    } else {
      params.set("category", filters.category);
    }

    navigate({ search: params.toString() }, { replace: true });
  }, [filters.category, location.search, navigate]);

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Handle price range change
  const handlePriceRangeChange = (index, value) => {
    const newRange = [...filters.priceRange];
    newRange[index] = Number(value);
    handleFilterChange("priceRange", newRange);
  };

  // Toggle filter sidebar
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  if (loading) {
    return <Spinner fullScreen size="large" />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-700 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900  mt-16 text-white p-16">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-200 mb-2 drop-shadow-lg">
          {filters.category === "all"
            ? "All Products"
            : filters.category === "fan"
            ? "Fans"
            : "Air Conditioners"}
        </h1>
        <p className="text-blue-200/70">Find the perfect cooling solution for your space</p>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        {/* Search Bar */}
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-blue-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-blue-400/40 rounded-lg bg-blue-950/60 text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400/40 placeholder:text-blue-200/60 backdrop-blur"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Sort Dropdown */}
        <div className="w-full md:w-64">
          <select
            className="block w-full px-3 py-2 border border-blue-400/40 rounded-lg bg-blue-950/60 text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400/40 backdrop-blur"
            value={filters.sortBy}
            onChange={(e) => handleFilterChange("sortBy", e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

        {/* Filter Button (Mobile) */}
        <button
          className="md:hidden bg-gradient-to-r from-blue-900/60 via-gray-900/60 to-blue-900/60 border border-blue-400/40 rounded-lg px-4 py-2 flex items-center justify-center text-blue-100 backdrop-blur hover:scale-105 transition-all"
          onClick={toggleFilter}
        >
          <FaFilter className="mr-2" />
          Filters
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filter Sidebar (Desktop) */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="bg-gradient-to-br from-blue-900/60 via-gray-900/60 to-blue-900/60 rounded-2xl shadow-xl p-6 backdrop-blur border border-blue-400/20">
            <h2 className="font-semibold text-lg mb-4 text-blue-200">Filters</h2>
            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="font-medium text-blue-100 mb-2">Category</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    value="all"
                    checked={filters.category === "all"}
                    onChange={() => handleFilterChange("category", "all")}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 accent-blue-600"
                  />
                  <span className="ml-2 text-blue-100">All Products</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    value="fan"
                    checked={filters.category === "fan"}
                    onChange={() => handleFilterChange("category", "fan")}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 accent-blue-600"
                  />
                  <span className="ml-2 text-blue-100">Fans</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    value="ac"
                    checked={filters.category === "ac"}
                    onChange={() => handleFilterChange("category", "ac")}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 accent-blue-600"
                  />
                  <span className="ml-2 text-blue-100">Air Conditioners</span>
                </label>
              </div>
            </div>
            {/* Price Range Filter */}
            <div className="mb-6">
              <h3 className="font-medium text-blue-100 mb-2">Price Range</h3>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-blue-200">$</span>
                <input
                  type="number"
                  min="0"
                  max={filters.priceRange[1]}
                  value={filters.priceRange[0]}
                  onChange={(e) => handlePriceRangeChange(0, e.target.value)}
                  className="w-full border border-blue-400/40 rounded px-2 py-1 bg-blue-950/40 text-blue-100"
                />
                <span className="text-blue-200">to</span>
                <input
                  type="number"
                  min={filters.priceRange[0]}
                  max="1000"
                  value={filters.priceRange[1]}
                  onChange={(e) => handlePriceRangeChange(1, e.target.value)}
                  className="w-full border border-blue-400/40 rounded px-2 py-1 bg-blue-950/40 text-blue-100"
                />
              </div>
              <div className="px-2">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={filters.priceRange[1]}
                  onChange={(e) => handlePriceRangeChange(1, e.target.value)}
                  className="w-full accent-blue-600"
                />
              </div>
            </div>
            {/* Sort By (Desktop) */}
            <div>
              <h3 className="font-medium text-blue-300 mb-2">Sort By</h3>
              <div className="space-y-2">
                <SortOption
                  value="newest"
                  label="Newest First"
                  currentValue={filters.sortBy}
                  onChange={(value) => handleFilterChange("sortBy", value)}
                />
                <SortOption
                  value="price-low-high"
                  label="Price: Low to High"
                  currentValue={filters.sortBy}
                  onChange={(value) => handleFilterChange("sortBy", value)}
                  icon={<FaSortAmountUp className="text-blue-400" />}
                />
                <SortOption
                  value="price-high-low"
                  label="Price: High to Low"
                  currentValue={filters.sortBy}
                  onChange={(value) => handleFilterChange("sortBy", value)}
                  icon={<FaSortAmountDown className="text-blue-400" />}
                />
                <SortOption
                  value="rating"
                  label="Highest Rated"
                  currentValue={filters.sortBy}
                  onChange={(value) => handleFilterChange("sortBy", value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Filter Sidebar */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleFilter}
            >
              <motion.div
                className="absolute right-0 top-0 bottom-0 w-80 bg-white p-4 overflow-y-auto"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "tween" }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold text-lg">Filters</h2>
                  <button onClick={toggleFilter}>
                    <FaTimes className="text-gray-500" />
                  </button>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-2">Category</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="category-mobile"
                        value="all"
                        checked={filters.category === "all"}
                        onChange={() => handleFilterChange("category", "all")}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-700">All Products</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="category-mobile"
                        value="fan"
                        checked={filters.category === "fan"}
                        onChange={() => handleFilterChange("category", "fan")}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-700">Fans</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="category-mobile"
                        value="ac"
                        checked={filters.category === "ac"}
                        onChange={() => handleFilterChange("category", "ac")}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-700">
                        Air Conditioners
                      </span>
                    </label>
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Price Range
                  </h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-gray-600">$</span>
                    <input
                      type="number"
                      min="0"
                      max={filters.priceRange[1]}
                      value={filters.priceRange[0]}
                      onChange={(e) =>
                        handlePriceRangeChange(0, e.target.value)
                      }
                      className="w-full border border-gray-300 rounded px-2 py-1"
                    />
                    <span className="text-gray-600">to</span>
                    <input
                      type="number"
                      min={filters.priceRange[0]}
                      max="1000"
                      value={filters.priceRange[1]}
                      onChange={(e) =>
                        handlePriceRangeChange(1, e.target.value)
                      }
                      className="w-full border border-gray-300 rounded px-2 py-1"
                    />
                  </div>
                  <div className="px-2">
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="10"
                      value={filters.priceRange[1]}
                      onChange={(e) =>
                        handlePriceRangeChange(1, e.target.value)
                      }
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Apply Filters Button */}
                <button
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={toggleFilter}
                >
                  Apply Filters
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product Grid */}
        <div className="flex-grow">
          {filteredProducts.length === 0 ? (
            <div className="bg-blue-900/30 rounded-2xl shadow-xl p-8 text-center border border-blue-400/20 backdrop-blur">
              <h3 className="text-xl font-semibold text-blue-100 mb-2">No Products Found</h3>
              <p className="text-blue-200 mb-4">Try adjusting your filters or search term to find what you're looking for.</p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilters({
                    category: "all",
                    priceRange: [0, 1000],
                    sortBy: "newest",
                  });
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-blue-200">Showing {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product._id}
                    className="h-full"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Sort Option Component
const SortOption = ({ value, label, currentValue, onChange, icon }) => (
  <label className="flex items-center">
    <input
      type="radio"
      name="sortBy"
      value={value}
      checked={currentValue === value}
      onChange={() => onChange(value)}
      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
    />
    <span className="ml-2 text-gray-700 flex items-center">
      {icon && <span className="mr-1">{icon}</span>}
      {label}
    </span>
  </label>
);

export default ProductListing;
