import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useParams, Link } from 'react-router-dom';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Crown, Search, Check, Truck, ShieldCheck, Clock } from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { QuickViewModal } from '../components/QuickViewModal';
import { PageHeroBanner } from '../components/PageHeroBanner';
import { useToast } from '../context/ToastContext';
import { apiClient, API_ENDPOINTS } from '../config';

/**
 * Reusable Filter Controls for both Desktop Sticky Sidebar and Mobile Slide-Over Drawer
 */
const FilterContent = ({
  forcedCategory,
  selectedCategory,
  onCategoryChange,
  selectedSubCategory,
  onSubCategoryChange,
  availableSubCategories,
  categoryProductsCount,
  selectedFabric,
  onFabricChange,
  fabrics,
  priceMax,
  onPriceChange,
  onClearFilters,
  allProducts = [],
  categories = [],
}) => {
  return (
    <div className="space-y-6">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-stone-100">
        <h3 className="font-serif text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#D4AF37]" /> Filter By
        </h3>
        <button
          onClick={onClearFilters}
          className="text-xs text-[#18523D] hover:underline font-semibold"
        >
          Reset All
        </button>
      </div>

      {/* 1. Main Category Section (Shown only on general /shop, hidden when browsing /suits, /kurtis, /sarees) */}
      {!forcedCategory && (
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-2.5">
            Category
          </label>
          <div className="space-y-1.5">
            {(categories && categories.length > 0
              ? [
                  { id: 'all', label: 'All Collections' },
                  ...categories.map((c) => ({
                    id: (c.slug || c.name.toLowerCase().replace(/\s+/g, '-')).toLowerCase(),
                    label: c.name,
                  })),
                ]
              : [
                  { id: 'all', label: 'All Collections' },
                  { id: 'stitched-suits', label: 'Stitched Suits' },
                  { id: 'unstitched-suits', label: 'Unstitched Suits' },
                  { id: 'sarees', label: 'Sarees' },
                ]
            ).map((cat) => (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`w-full flex items-center justify-between text-xs py-2 px-3 rounded-xl transition-all text-left ${
                  selectedCategory === cat.id
                    ? 'bg-[#09231A] text-[#F7E7BE] font-bold shadow-xs'
                    : 'text-stone-600 hover:bg-stone-50 border border-transparent'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    selectedCategory === cat.id
                      ? 'bg-white/20 text-[#F7E7BE]'
                      : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  {cat.id === 'all'
                    ? allProducts.length
                    : allProducts.filter((p) => {
                        const pCat = (p.category || '').toLowerCase();
                        if (cat.id === 'stitched-suits' || cat.id === 'unstitched-suits') {
                          return pCat === 'suits' || pCat === cat.id;
                        }
                        return pCat === cat.id.toLowerCase();
                      }).length}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 2. Sub-Category Section (Suits, Kurtis, Sarees are categories; sub-categories are listed here) */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-800">
            Sub-Category
          </label>
          {selectedSubCategory !== 'all' && (
            <button
              onClick={() => onSubCategoryChange('all')}
              className="text-[10px] text-[#18523D] hover:underline font-medium"
            >
              Show All
            </button>
          )}
        </div>
        <div className="space-y-1.5">
          {/* "All" Subcategory Option */}
          <button
            onClick={() => onSubCategoryChange('all')}
            className={`w-full flex items-center justify-between text-xs py-2 px-3 rounded-xl transition-all text-left ${
              selectedSubCategory === 'all'
                ? 'bg-[#09231A] text-[#F7E7BE] font-bold shadow-xs'
                : 'text-stone-600 hover:bg-stone-50 border border-transparent'
            }`}
          >
            <span>
              {selectedCategory === 'stitched-suits'
                ? 'All Stitched Suits'
                : selectedCategory === 'unstitched-suits'
                ? 'All Unstitched Suits'
                : selectedCategory === 'suits'
                ? 'All Suits'
                : selectedCategory === 'kurtis'
                ? 'All Kurtis'
                : selectedCategory === 'sarees'
                ? 'All Sarees'
                : 'All Sub-Categories'}
            </span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                selectedSubCategory === 'all'
                  ? 'bg-white/20 text-[#F7E7BE]'
                  : 'bg-stone-100 text-stone-500'
              }`}
            >
              {categoryProductsCount}
            </span>
          </button>

          {availableSubCategories.map((subCat) => {
            const isSelected = (selectedSubCategory || '').toLowerCase() === subCat.toLowerCase();
            const count = allProducts.filter((p) => {
              const pCat = (p.category || '').toLowerCase();
              const sCat = selectedCategory.toLowerCase();
              let matchCat = sCat === 'all' || pCat === sCat;
              if (sCat === 'stitched-suits' || sCat === 'stitched suits') {
                matchCat = pCat === 'stitched-suits' || pCat === 'stitched suits';
              } else if (sCat === 'unstitched-suits' || sCat === 'unstitched suits') {
                matchCat = pCat === 'unstitched-suits' || pCat === 'unstitched suits';
              } else if (sCat === 'suits') {
                matchCat = pCat === 'suits' || pCat === 'stitched-suits' || pCat === 'unstitched-suits';
              }
              const pSub =
                typeof p.subCategory === 'object' && p.subCategory !== null
                  ? p.subCategory.name
                  : p.subCategory;
              return matchCat && (pSub || '').toLowerCase() === subCat.toLowerCase();
            }).length;

            return (
              <button
                key={subCat}
                onClick={() => onSubCategoryChange(isSelected ? 'all' : subCat)}
                className={`w-full flex items-center justify-between text-xs py-2 px-3 rounded-xl transition-all text-left ${
                  isSelected
                    ? 'bg-[#09231A] text-[#F7E7BE] font-bold shadow-xs'
                    : 'text-stone-600 hover:bg-stone-50 border border-transparent hover:border-stone-100'
                }`}
              >
                <span className="truncate pr-2">{subCat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full shrink-0 ${
                    isSelected
                      ? 'bg-white/20 text-[#F7E7BE]'
                      : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Fabric Filter */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-800">
            Fabric
          </label>
          {selectedFabric !== 'all' && (
            <button
              onClick={() => onFabricChange('all')}
              className="text-[10px] text-[#18523D] hover:underline font-medium"
            >
              Clear
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {fabrics.map((f) => (
            <button
              key={f}
              onClick={() => onFabricChange(f)}
              className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
                selectedFabric === f
                  ? 'bg-[#09231A] text-[#F7E7BE] border-[#09231A] font-bold'
                  : 'border-stone-200 text-stone-600 hover:border-stone-300 bg-white'
              }`}
            >
              {f === 'all' ? 'All Fabrics' : f}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Max Price Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-800">
            Max Price
          </label>
          <span className="text-xs font-bold text-[#09231A]">
            ₹{priceMax.toLocaleString('en-IN')}
          </span>
        </div>
        <input
          type="range"
          min="4000"
          max="35000"
          step="1000"
          value={priceMax}
          onChange={(e) => onPriceChange(Number(e.target.value))}
          className="w-full accent-[#09231A]"
        />
        <div className="flex justify-between text-[10px] text-stone-400 mt-1">
          <span>₹4,000</span>
          <span>₹35,000</span>
        </div>
      </div>
    </div>
  );
};

export const Shop = ({ forcedCategory = null }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { categorySlug } = useParams();
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters state
  const categoryParam = forcedCategory || categorySlug || searchParams.get('category') || 'all';
  const subCategoryParam = searchParams.get('subCategory') || 'all';
  const searchParam = searchParams.get('search') || '';
  const tagParam = searchParams.get('tag') || '';

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedSubCategory, setSelectedSubCategory] = useState(subCategoryParam);
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [selectedFabric, setSelectedFabric] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [priceMax, setPriceMax] = useState(35000);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [productsList, setProductsList] = useState(PRODUCTS);
  const [liveCategories, setLiveCategories] = useState([]);
  const [loadingLiveProducts, setLoadingLiveProducts] = useState(false);
  const { addToast } = useToast();

  // Fetch live categories from NestJS Backend
  useEffect(() => {
    const fetchLiveCategories = async () => {
      try {
        const res = await apiClient.get(API_ENDPOINTS.CATEGORIES.BASE);
        const data = res?.data || res;
        if (Array.isArray(data) && data.length > 0) {
          const active = data.filter(
            (c) => (c.status || 'Active').toLowerCase() === 'active'
          );
          if (active.length > 0) {
            setLiveCategories(active);
          }
        }
      } catch (err) {
        console.warn('Failed to load categories in Shop:', err.message);
      }
    };
    fetchLiveCategories();
  }, []);

  // Fetch live catalog from NestJS Backend
  useEffect(() => {
    const fetchLiveProducts = async () => {
      try {
        setLoadingLiveProducts(true);
        const res = await apiClient.get(API_ENDPOINTS.PRODUCTS.LIST(100));
        const items = res?.data?.items || res?.data;
        if (Array.isArray(items) && items.length > 0) {
          const normalized = items.map((p) => ({
            ...p,
            id: p.customId || p.id || (p._id ? p._id.toString() : ''),
            category: (typeof p.category === 'string' ? p.category : p.category?.name || '').toLowerCase(),
            subCategory:
              typeof p.subCategory === 'object' && p.subCategory !== null
                ? p.subCategory.name
                : p.subCategory || '',
            fabric: p.fabric || '',
            work: p.work || '',
            price: Number(p.price) || 0,
          }));
          setProductsList(normalized);
        }
      } catch (err) {
        console.warn('Storefront using static fallback products:', err.message);
      } finally {
        setLoadingLiveProducts(false);
      }
    };
    fetchLiveProducts();
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      addToast(`Thank you! You're now subscribed to Saisaa Royal Updates at ${newsletterEmail}`, 'success');
      setNewsletterEmail('');
    }
  };

  // Sync state when URL parameters change
  React.useEffect(() => {
    if (forcedCategory) {
      setSelectedCategory(forcedCategory);
    } else if (categorySlug) {
      setSelectedCategory(categorySlug);
    } else if (searchParams.get('category')) {
      setSelectedCategory(searchParams.get('category'));
    } else {
      setSelectedCategory('all');
    }
    if (searchParams.get('subCategory')) {
      setSelectedSubCategory(searchParams.get('subCategory'));
    }
    if (searchParams.get('search')) {
      setSearchQuery(searchParams.get('search'));
    }
  }, [forcedCategory, categorySlug, searchParams]);

  const fabrics = ['all', 'Velvet', 'Silk', 'Georgette', 'Chanderi', 'Organza', 'Cotton'];

  // Calculate dynamic sub-categories belonging to currently selected category
  const availableSubCategories = useMemo(() => {
    const currentCatObj = liveCategories.find((c) => {
      const cSlug = (c.slug || '').toLowerCase();
      const cName = (c.name || '').toLowerCase();
      const sCat = (selectedCategory || '').toLowerCase();
      return (
        cSlug === sCat ||
        cName === sCat ||
        (sCat === 'stitched-suits' && (cSlug === 'stitched-suits' || cName === 'stitched suits')) ||
        (sCat === 'unstitched-suits' && (cSlug === 'unstitched-suits' || cName === 'unstitched suits'))
      );
    });

    const definedSubs = (currentCatObj?.subCategories || [])
      .map((s) => (typeof s === 'object' && s !== null ? s.name : s))
      .filter((s) => typeof s === 'string' && s.trim().length > 0);

    const relevantProducts =
      selectedCategory === 'all'
        ? productsList
        : productsList.filter((p) => {
            const pCat = (p.category || '').toLowerCase();
            const sCat = selectedCategory.toLowerCase();
            if (sCat === 'stitched-suits' || sCat === 'stitched suits') {
              return pCat === 'stitched-suits' || pCat === 'stitched suits';
            }
            if (sCat === 'unstitched-suits' || sCat === 'unstitched suits') {
              return pCat === 'unstitched-suits' || pCat === 'unstitched suits';
            }
            if (sCat === 'suits') {
              return pCat === 'suits' || pCat === 'stitched-suits' || pCat === 'unstitched-suits';
            }
            return pCat === sCat;
          });

    const productSubs = relevantProducts
      .map((p) =>
        typeof p.subCategory === 'object' && p.subCategory !== null
          ? p.subCategory.name
          : p.subCategory
      )
      .filter(Boolean);

    if (definedSubs.length > 0) {
      return definedSubs;
    }

    return Array.from(new Set(productSubs));
  }, [selectedCategory, productsList, liveCategories]);

  // Total count of products in current category scope
  const categoryProductsCount = useMemo(() => {
    return selectedCategory === 'all'
      ? productsList.length
      : productsList.filter((p) => {
          const pCat = (p.category || '').toLowerCase();
          const sCat = selectedCategory.toLowerCase();
          if (sCat === 'stitched-suits' || sCat === 'stitched suits') {
            return pCat === 'stitched-suits' || pCat === 'stitched suits';
          }
          if (sCat === 'unstitched-suits' || sCat === 'unstitched suits') {
            return pCat === 'unstitched-suits' || pCat === 'unstitched suits';
          }
          if (sCat === 'suits') {
            return pCat === 'suits' || pCat === 'stitched-suits' || pCat === 'unstitched-suits';
          }
          return pCat === sCat;
        }).length;
  }, [selectedCategory, productsList]);

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    setSelectedSubCategory('all'); // Reset sub-category on category change
  };

  // Filtered products calculation (with productsList in dependency array)
  const filteredProducts = useMemo(() => {
    return productsList
      .filter((item) => {
        // 1. Primary Category filter
        const itemCat = (typeof item.category === 'string' ? item.category : item.category?.name || '').toLowerCase();
        if (selectedCategory !== 'all') {
          const selCat = selectedCategory.toLowerCase();
          if (selCat === 'stitched-suits' || selCat === 'stitched suits') {
            if (itemCat !== 'stitched-suits' && itemCat !== 'stitched suits') return false;
          } else if (selCat === 'unstitched-suits' || selCat === 'unstitched suits') {
            if (itemCat !== 'unstitched-suits' && itemCat !== 'unstitched suits') return false;
          } else if (selCat === 'suits') {
            if (itemCat !== 'suits' && itemCat !== 'stitched-suits' && itemCat !== 'unstitched-suits') return false;
          } else if (itemCat !== selCat) {
            return false;
          }
        }
        // 2. Sub-Category filter (e.g. 3 pcs set, 2 pcs set, long kurtis, Short kurtis)
        const itemSub =
          typeof item.subCategory === 'object' && item.subCategory !== null
            ? item.subCategory.name
            : item.subCategory;
        if (
          selectedSubCategory !== 'all' &&
          (itemSub || '').toLowerCase() !== selectedSubCategory.toLowerCase()
        ) {
          return false;
        }
        // 3. Search term
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchesName = (item.name || '').toLowerCase().includes(query);
          const matchesCategory = itemCat.includes(query);
          const matchesSubCategory = (itemSub || '').toLowerCase().includes(query);
          const matchesFabric = (item.fabric || '').toLowerCase().includes(query);
          const matchesWork = (item.work || '').toLowerCase().includes(query);
          if (
            !matchesName &&
            !matchesCategory &&
            !matchesSubCategory &&
            !matchesFabric &&
            !matchesWork
          ) {
            return false;
          }
        }
        // 4. Fabric
        if (selectedFabric !== 'all') {
          if (!(item.fabric || '').toLowerCase().includes(selectedFabric.toLowerCase())) {
            return false;
          }
        }
        // 5. Price
        if (item.price > priceMax) {
          return false;
        }
        // 6. Tag
        if (tagParam === 'bestseller' && !item.isBestSeller) {
          return false;
        }
        if (tagParam === 'new' && !item.isNewArrival) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        return 0; // featured default
      });
  }, [productsList, selectedCategory, selectedSubCategory, searchQuery, selectedFabric, priceMax, sortBy, tagParam]);

  // 6 products per page (grid of 2 rows x 3 columns on desktop)
  const ITEMS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page whenever any filter / category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedSubCategory, searchQuery, selectedFabric, priceMax, sortBy, tagParam]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const activePage = Math.min(Math.max(currentPage, 1), totalPages);

  const paginatedProducts = useMemo(() => {
    const startIndex = (activePage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, activePage]);

  const startItem = filteredProducts.length === 0 ? 0 : (activePage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(activePage * ITEMS_PER_PAGE, filteredProducts.length);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === activePage) return;
    setCurrentPage(newPage);
    const gridElem = document.getElementById('shop-products-section');
    if (gridElem) {
      gridElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (activePage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (activePage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', activePage - 1, activePage, activePage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const clearFilters = () => {
    setSelectedCategory(forcedCategory || 'all');
    setSelectedSubCategory('all');
    setSearchQuery('');
    setSelectedFabric('all');
    setPriceMax(35000);
    setSortBy('featured');
    setCurrentPage(1);
    setSearchParams({});
  };

  const hasActiveFilters =
    selectedSubCategory !== 'all' ||
    selectedFabric !== 'all' ||
    priceMax < 35000 ||
    searchQuery.trim().length > 0;

  const getCategoryDetails = () => {
    // Check dynamic liveCategories first
    const matchedLive = liveCategories.find(
      (c) =>
        (c.slug || '').toLowerCase() === selectedCategory.toLowerCase() ||
        (c.name || '').toLowerCase() === selectedCategory.toLowerCase()
    );

    if (matchedLive) {
      return {
        breadcrumb: matchedLive.name,
        titleLine1: 'Shop',
        titleLine2: matchedLive.name,
        description:
          matchedLive.description ||
          `Explore our latest collection of premium ${matchedLive.name.toLowerCase()} crafted for timeless style and modern womanhood.`,
        modelImage: matchedLive.image || '/images/02_category_suits.jpg',
        modelAlt: matchedLive.name,
      };
    }

    if (selectedCategory === 'stitched-suits') {
      return {
        breadcrumb: 'Stitched Suits',
        titleLine1: 'Shop',
        titleLine2: 'Stitched Suits',
        description: 'Explore our latest collection of premium tailored & stitched suit sets crafted for timeless style and modern womanhood.',
        modelImage: '/images/02_category_suits.jpg',
        modelAlt: 'Stitched Suits Collection',
      };
    }
    if (selectedCategory === 'unstitched-suits') {
      return {
        breadcrumb: 'Unstitched Suits',
        titleLine1: 'Shop',
        titleLine2: 'Unstitched Suits',
        description: 'Explore our curated unstitched suit sets giving you the bespoke freedom to style and tailor to your exact grace.',
        modelImage: '/images/02_category_suits.jpg',
        modelAlt: 'Unstitched Suits Collection',
      };
    }
    if (selectedCategory === 'suits') {
      return {
        breadcrumb: 'Suits',
        titleLine1: 'Shop',
        titleLine2: 'Royal Suits',
        description: 'Explore our latest collection of premium tailored & unstitched suit sets crafted for timeless style and modern womanhood.',
        modelImage: '/images/02_category_suits.jpg',
        modelAlt: 'Royal Suits Collection',
      };
    }
    if (selectedCategory === 'sarees') {
      return {
        breadcrumb: 'Sarees',
        titleLine1: 'Shop',
        titleLine2: 'Heirloom Sarees',
        description: 'Six yards of timeless royal grace woven in pure mulberry silk, antique gold tissue, and gossamer organza.',
        modelImage: '/images/04_category_sarees.jpg',
        modelAlt: 'Royal Heirloom Sarees',
      };
    }
    if (selectedCategory === 'kurtis') {
      return {
        breadcrumb: 'Kurtis',
        titleLine1: 'Shop',
        titleLine2: 'Artisanal Kurtis',
        description: 'Everyday elegance and festive statement pieces featuring delicate Awadhi needlecraft and vibrant prints.',
        modelImage: '/images/03_category_kurtis.jpg',
        modelAlt: 'Artisanal Kurtis Collection',
      };
    }
    return {
      breadcrumb: 'Shop',
      titleLine1: 'Shop',
      titleLine2: 'Royal Collections',
      description: 'Explore our complete treasury of regal suits, sarees, and handcrafted kurtis crafted with timeless elegance.',
      modelImage: '/images/01_shop_hero_banner.jpg',
      modelAlt: 'Saisaa Haute Couture Collections',
    };
  };

  const headerInfo = getCategoryDetails();

  return (
    <div className="w-full space-y-8 pb-16">
      {/* 1. Main Shop Hero Banner (Per Shop Handoff: 2400x950 recommended desktop ratio) */}
      {!forcedCategory && selectedCategory === 'all' ? (
        <section className="relative w-full bg-[#FAF6F0] border-b border-[#EADCC8] overflow-hidden">
          <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] md:aspect-[2400/950] min-h-[300px] max-h-[460px] overflow-hidden">
            <img
              src="/images/01_shop_hero_banner.jpg"
              alt="Saisaa Royal Shop Collection"
              className="w-full h-full object-cover object-center"
            />
            {/* Elegant gradient overlay to enhance typography contrast while highlighting photography */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FAF6F0]/95 via-[#FAF6F0]/85 sm:via-[#FAF6F0]/65 to-transparent flex items-center">
              <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="max-w-xl space-y-3 sm:space-y-4">
                  {/* Breadcrumb Navigation */}
                  <nav className="flex items-center gap-2 text-xs text-stone-600 font-light">
                    <Link to="/" className="hover:text-stone-900 transition-colors">
                      Home
                    </Link>
                    <span className="text-stone-400">&gt;</span>
                    <span className="text-stone-900 font-medium">Shop</span>
                  </nav>

                  <div className="inline-flex items-center gap-2 text-[#9B7B1C] text-[10px] font-bold uppercase tracking-[0.25em]">
                    <span>✦</span>
                    <span>HAUTE COUTURE EDIT</span>
                  </div>

                  <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1B2922] leading-[1.15] tracking-tight">
                    Shop Royal Collections
                  </h1>

                  <p className="text-stone-700 text-xs sm:text-sm font-light max-w-lg leading-relaxed">
                    Explore our complete treasury of regal suits, sarees, and handcrafted kurtis tailored for timeless style and modern womanhood.
                  </p>

                  <div className="pt-2 flex flex-wrap gap-2 sm:gap-3 text-[11px] font-medium text-stone-800">
                    <span className="bg-white/85 backdrop-blur-xs px-3 py-1 rounded-full border border-stone-200/80 shadow-2xs">
                      ✨ Handcrafted Zardozi
                    </span>
                    <span className="bg-white/85 backdrop-blur-xs px-3 py-1 rounded-full border border-stone-200/80 shadow-2xs">
                      🌿 Pure Mulberry Silk
                    </span>
                    <span className="bg-white/85 backdrop-blur-xs px-3 py-1 rounded-full border border-stone-200/80 shadow-2xs">
                      🚚 Free Express Delivery
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <PageHeroBanner
          breadcrumb={headerInfo.breadcrumb}
          titleLine1={headerInfo.titleLine1}
          titleLine2={headerInfo.titleLine2}
          description={headerInfo.description}
          modelImage={headerInfo.modelImage}
          modelAlt={headerInfo.modelAlt}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* 2. Category Cards Strip (Per Shop Image Handoff: approx 9:11 ratio) */}
        {!forcedCategory && selectedCategory === 'all' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {[
              {
                id: 'suits',
                title: 'Suits',
                subtitle: 'Effortless Grace',
                image: '/images/02_category_suits.jpg',
                link: '/suits',
                count: `${productsList.filter((p) => (p.category || '').toLowerCase() === 'suits').length} Creations`,
              },
              {
                id: 'kurtis',
                title: 'Kurtis',
                subtitle: 'Everyday Elegance',
                image: '/images/03_category_kurtis.jpg',
                link: '/kurtis',
                count: `${productsList.filter((p) => (p.category || '').toLowerCase() === 'kurtis').length} Creations`,
              },
              {
                id: 'sarees',
                title: 'Sarees',
                subtitle: 'Timeless Tradition',
                image: '/images/04_category_sarees.jpg',
                link: '/sarees',
                count: `${productsList.filter((p) => (p.category || '').toLowerCase() === 'sarees').length} Creations`,
              },
            ].map((cat) => (
              <Link
                key={cat.id}
                to={cat.link}
                className="group relative aspect-[9/11] rounded-2xl overflow-hidden border border-[#D4AF37]/35 shadow-sm hover:shadow-xl transition-all duration-500 block bg-[#FAF7F2]"
              >
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#082017]/90 via-[#082017]/25 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-white">
                  <div>
                    <h3 className="font-serif text-2xl font-bold tracking-wider text-white">
                      {cat.title}
                    </h3>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-[#E5C786] font-medium mt-0.5">
                      {cat.subtitle}
                    </p>
                    <span className="text-[10px] text-stone-300 block mt-1">
                      {cat.count}
                    </span>
                  </div>
                  <span className="text-xs bg-[#E5C786] text-[#09231A] font-bold px-3 py-1.5 rounded-full shadow-md group-hover:scale-105 transition-transform flex items-center gap-1">
                    Explore &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Toolbar: Search, Filters Button, Sort, Quick Sub-Category Pills */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#D4AF37]/25 shadow-sm space-y-3.5">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#09231A] text-[#F7E7BE] text-xs font-bold uppercase tracking-wider shadow-xs hover:bg-[#123B2D] transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                )}
              </button>

              <span className="text-xs text-stone-500 font-medium">
                Showing <strong className="text-stone-900 font-bold">{filteredProducts.length}</strong> creations
              </span>
            </div>

            {/* Search & Sort Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Quick Search */}
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search cuts, fabrics, craft..."
                  className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#09231A] transition-colors"
                />
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-500 hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-xs font-semibold py-2 px-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-[#09231A] text-stone-800"
                >
                  <option value="featured">Featured / Best Match</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Quick Sub-Category Pills Bar (Instant 1-Click Filtering) */}
          {availableSubCategories.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pt-3 border-t border-stone-100 scrollbar-none pb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 shrink-0 mr-1 hidden sm:inline">
                Sub-Categories:
              </span>
              <button
                onClick={() => setSelectedSubCategory('all')}
                className={`text-xs px-3.5 py-1.5 rounded-full shrink-0 font-medium transition-all ${
                  selectedSubCategory === 'all'
                    ? 'bg-[#09231A] text-[#F7E7BE] font-bold shadow-xs'
                    : 'bg-stone-50 text-stone-600 border border-stone-200 hover:border-stone-300 hover:bg-stone-100'
                }`}
              >
                All {selectedCategory !== 'all' ? (selectedCategory === 'stitched-suits' ? 'Stitched Suits' : selectedCategory === 'unstitched-suits' ? 'Unstitched Suits' : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)) : 'Creations'}
              </button>
              {availableSubCategories.map((subCat) => {
                const isSelected = (selectedSubCategory || '').toLowerCase() === subCat.toLowerCase();
                const count = productsList.filter((p) => {
                  const pCat = (p.category || '').toLowerCase();
                  const sCat = selectedCategory.toLowerCase();
                  let matchCat = sCat === 'all' || pCat === sCat;
                  if (sCat === 'stitched-suits' || sCat === 'stitched suits') {
                    matchCat = pCat === 'stitched-suits' || pCat === 'stitched suits';
                  } else if (sCat === 'unstitched-suits' || sCat === 'unstitched suits') {
                    matchCat = pCat === 'unstitched-suits' || pCat === 'unstitched suits';
                  } else if (sCat === 'suits') {
                    matchCat = pCat === 'suits' || pCat === 'stitched-suits' || pCat === 'unstitched-suits';
                  }
                  const pSub =
                    typeof p.subCategory === 'object' && p.subCategory !== null
                      ? p.subCategory.name
                      : p.subCategory;
                  return matchCat && (pSub || '').toLowerCase() === subCat.toLowerCase();
                }).length;
                return (
                  <button
                    key={subCat}
                    onClick={() => setSelectedSubCategory(isSelected ? 'all' : subCat)}
                    className={`text-xs px-3.5 py-1.5 rounded-full shrink-0 font-medium transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#09231A] text-[#F7E7BE] font-bold shadow-xs'
                        : 'bg-stone-50 text-stone-600 border border-stone-200 hover:border-stone-300 hover:bg-stone-100'
                    }`}
                  >
                    <span>{subCat}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isSelected
                          ? 'bg-white/20 text-[#F7E7BE]'
                          : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Active Filter Badges */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Active:
              </span>
              {selectedSubCategory !== 'all' && (
                <span className="inline-flex items-center gap-1.5 text-xs bg-[#09231A] text-[#F7E7BE] px-3 py-1 rounded-full font-medium shadow-2xs">
                  <span>Sub-Category: {selectedSubCategory}</span>
                  <button
                    onClick={() => setSelectedSubCategory('all')}
                    className="hover:text-white"
                    aria-label="Remove subcategory filter"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}
              {selectedFabric !== 'all' && (
                <span className="inline-flex items-center gap-1.5 text-xs bg-stone-100 text-stone-800 border border-stone-200 px-3 py-1 rounded-full font-medium">
                  <span>Fabric: {selectedFabric}</span>
                  <button
                    onClick={() => setSelectedFabric('all')}
                    className="text-stone-500 hover:text-stone-800"
                    aria-label="Remove fabric filter"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}
              {priceMax < 35000 && (
                <span className="inline-flex items-center gap-1.5 text-xs bg-stone-100 text-stone-800 border border-stone-200 px-3 py-1 rounded-full font-medium">
                  <span>Under ₹{priceMax.toLocaleString('en-IN')}</span>
                  <button
                    onClick={() => setPriceMax(35000)}
                    className="text-stone-500 hover:text-stone-800"
                    aria-label="Reset max price"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}
              {searchQuery.trim() && (
                <span className="inline-flex items-center gap-1.5 text-xs bg-stone-100 text-stone-800 border border-stone-200 px-3 py-1 rounded-full font-medium">
                  <span>"{searchQuery}"</span>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-stone-500 hover:text-stone-800"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-xs text-[#18523D] hover:underline font-semibold ml-1"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Main Grid: Sticky Desktop Filter Sidebar & Product Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Desktop Sticky Sidebar Filters */}
          <aside className="hidden lg:block lg:col-span-1 sticky top-24 self-start">
            <div className="bg-white rounded-2xl p-6 border border-[#D4AF37]/25 shadow-sm max-h-[calc(100vh-7rem)] overflow-y-auto">
              <FilterContent
                forcedCategory={forcedCategory}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                selectedSubCategory={selectedSubCategory}
                onSubCategoryChange={setSelectedSubCategory}
                availableSubCategories={availableSubCategories}
                categoryProductsCount={categoryProductsCount}
                selectedFabric={selectedFabric}
                onFabricChange={setSelectedFabric}
                fabrics={fabrics}
                priceMax={priceMax}
                onPriceChange={setPriceMax}
                onClearFilters={clearFilters}
                allProducts={productsList}
                categories={liveCategories}
              />
            </div>
          </aside>

          {/* Product Cards Grid */}
          <main id="shop-products-section" className="lg:col-span-3">
            {filteredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onQuickView={(p) => setQuickViewProduct(p)}
                    />
                  ))}
                </div>

                {/* 5. Pagination Bar (Per Shop Page Handoff Structure) */}
                <div className="mt-12 pt-8 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs text-stone-500 font-medium">
                    Showing <strong className="text-stone-900 font-bold">{startItem}–{endItem}</strong> of{' '}
                    <strong className="text-stone-900 font-bold">{filteredProducts.length}</strong> creations
                  </span>

                  {totalPages > 1 && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handlePageChange(activePage - 1)}
                        disabled={activePage <= 1}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                          activePage <= 1
                            ? 'text-stone-300 bg-stone-100 border border-stone-200 cursor-not-allowed'
                            : 'text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 cursor-pointer shadow-2xs'
                        }`}
                      >
                        &larr; Prev
                      </button>

                      {getPageNumbers().map((pg, idx) =>
                        pg === '...' ? (
                          <span key={`ellipsis-${idx}`} className="px-2 text-xs text-stone-400">
                            ...
                          </span>
                        ) : (
                          <button
                            key={pg}
                            onClick={() => handlePageChange(pg)}
                            className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              activePage === pg
                                ? 'bg-[#09231A] text-[#F7E7BE] shadow-xs'
                                : 'text-stone-700 bg-white border border-stone-200 hover:bg-stone-50'
                            }`}
                          >
                            {pg}
                          </button>
                        )
                      )}

                      <button
                        onClick={() => handlePageChange(activePage + 1)}
                        disabled={activePage >= totalPages}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                          activePage >= totalPages
                            ? 'text-stone-300 bg-stone-100 border border-stone-200 cursor-not-allowed'
                            : 'text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 cursor-pointer shadow-2xs'
                        }`}
                      >
                        Next &rarr;
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-stone-200 p-8 shadow-xs">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                  <Filter className="w-5 h-5" />
                </div>
                <p className="font-serif text-xl font-bold text-stone-800 mb-2">
                  No matching royal creations found
                </p>
                <p className="text-xs text-stone-500 max-w-md mx-auto mb-6">
                  {selectedSubCategory !== 'all'
                    ? `No products currently match the sub-category "${selectedSubCategory}". Try switching to another sub-category or resetting filters.`
                    : 'Try widening your price range, searching for different fabric names, or resetting your filters.'}
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-[#09231A] text-[#F7E7BE] px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#123B2D] transition-colors shadow-sm"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </main>

        </div>

        {/* 6. Benefits Strip (Per Shop Page Handoff Structure) */}
        <section className="pt-8">
          <div className="bg-[#F6EFE3] border border-[#D4AF37]/30 rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              <div className="flex items-center gap-3.5">
                <div className="text-[#A37F15] shrink-0">
                  <Truck className="w-6 h-6 stroke-[1.5]" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900 uppercase tracking-wider font-serif">
                    FREE SHIPPING
                  </h4>
                  <p className="text-[11px] text-stone-600 font-light">
                    Across India on all orders
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3.5">
                <div className="text-[#A37F15] shrink-0">
                  <ShieldCheck className="w-6 h-6 stroke-[1.5]" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900 uppercase tracking-wider font-serif">
                    PREMIUM QUALITY
                  </h4>
                  <p className="text-[11px] text-stone-600 font-light">
                    100% handcrafted fabrics
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3.5">
                <div className="text-[#A37F15] shrink-0">
                  <Clock className="w-6 h-6 stroke-[1.5]" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900 uppercase tracking-wider font-serif">
                    7-DAY EXCHANGE
                  </h4>
                  <p className="text-[11px] text-stone-600 font-light">
                    Hassle-free doorstep service
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3.5">
                <div className="text-[#A37F15] shrink-0">
                  <Crown className="w-6 h-6 stroke-[1.5]" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900 uppercase tracking-wider font-serif">
                    ROYAL PACKAGING
                  </h4>
                  <p className="text-[11px] text-stone-600 font-light">
                    Delivered in gold-embossed box
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Newsletter Section (Per Shop Page Handoff Structure) */}
        <section className="relative bg-[#082017] text-white rounded-2xl py-12 px-6 sm:px-10 border border-[#D4AF37]/30 overflow-hidden shadow-lg">
          <div className="absolute left-6 top-6 w-24 h-24 opacity-15 pointer-events-none text-[#D4AF37]">
            <svg viewBox="0 0 100 100" fill="currentColor">
              <path d="M10,90 Q50,50 90,10 Q50,30 30,50 Z" />
            </svg>
          </div>
          <div className="absolute right-6 bottom-6 w-24 h-24 opacity-15 pointer-events-none text-[#D4AF37]">
            <svg viewBox="0 0 100 100" fill="currentColor">
              <path d="M90,10 Q50,50 10,90 Q50,70 70,50 Z" />
            </svg>
          </div>

          <div className="max-w-2xl mx-auto text-center space-y-3 relative z-10">
            <div className="inline-flex items-center gap-1.5 text-[#E5C786] text-[10px] font-bold uppercase tracking-[0.25em]">
              <span>✦</span>
              <span>VIP PRIVILEGES</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#FAF7F2] tracking-tight">
              Be the First to Know
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 font-light max-w-lg mx-auto">
              Subscribe for exclusive previews of upcoming festive collections, early access & special royal offers.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full sm:flex-1 bg-white text-stone-900 placeholder-stone-400 text-xs px-4 py-3 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
              <button
                type="submit"
                className="w-full sm:w-auto bg-[#E5C786] hover:bg-[#F3DC9B] text-[#09231A] text-xs font-bold uppercase tracking-wider py-3 px-6 rounded-xl transition-colors shadow-sm"
              >
                NOTIFY ME
              </button>
            </form>
          </div>
        </section>
      </div>

      {/* Mobile Slide-Over Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            onClick={() => setMobileFilterOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          {/* Slide-over panel */}
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-300">
            {/* Drawer Header */}
            <div className="p-4 border-b border-[#D4AF37]/30 flex items-center justify-between bg-[#0A291E] text-white">
              <h3 className="font-serif text-base font-bold flex items-center gap-2 text-[#F7E7BE]">
                <Filter className="w-4 h-4 text-[#D4AF37]" /> Filter By
              </h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-lg text-stone-300 hover:text-white"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Content */}
            <div className="flex-1 overflow-y-auto p-5">
              <FilterContent
                forcedCategory={forcedCategory}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                selectedSubCategory={selectedSubCategory}
                onSubCategoryChange={setSelectedSubCategory}
                availableSubCategories={availableSubCategories}
                categoryProductsCount={categoryProductsCount}
                selectedFabric={selectedFabric}
                onFabricChange={setSelectedFabric}
                fabrics={fabrics}
                priceMax={priceMax}
                onPriceChange={setPriceMax}
                onClearFilters={clearFilters}
                allProducts={productsList}
                categories={liveCategories}
              />
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-stone-200 bg-stone-50 flex gap-3">
              <button
                onClick={clearFilters}
                className="flex-1 py-2.5 px-3 text-xs font-semibold text-stone-700 bg-white border border-stone-300 rounded-xl hover:bg-stone-100 transition-colors"
              >
                Reset All
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 px-3 text-xs font-bold text-[#F7E7BE] bg-[#09231A] rounded-xl hover:bg-[#123B2D] transition-colors shadow-sm"
              >
                View ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
};
