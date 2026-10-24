import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Star,
  Heart,
  ShoppingBag,
  Crown,
  ShieldCheck,
  Truck,
  Scissors,
  RotateCcw,
  Check,
  ChevronRight,
  MapPin,
  MessageCircle,
  Camera,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  ThumbsUp,
  Image as ImageIcon,
  X as CloseIcon,
} from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ProductCard } from '../components/ProductCard';
import { apiClient, API_ENDPOINTS } from '../config';

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Instantaneous hydration: Use state passed from ProductCard click, or matching static item, or null
  const initialProduct =
    location.state?.product ||
    PRODUCTS.find((p) => p.id === id || p.customId === id || p.slug === id) ||
    null;

  const [product, setProduct] = useState(initialProduct);
  const [isLoadingProduct, setIsLoadingProduct] = useState(!initialProduct);

  // Fetch live product details from NestJS Backend
  useEffect(() => {
    const fetchLiveProduct = async () => {
      try {
        if (!initialProduct) {
          setIsLoadingProduct(true);
        }
        const res = await apiClient.get(API_ENDPOINTS.PRODUCTS.BY_ID(id));
        if (res?.data) {
          const liveData = res.data;
          const cover = liveData.cardImage || liveData.coverImage;
          const mergedImages = [
            ...(cover ? [cover] : []),
            ...(Array.isArray(liveData.images) ? liveData.images : []),
          ];
          const uniqueImages = Array.from(new Set(mergedImages)).filter(Boolean);
          const finalImages = uniqueImages.length > 0 ? uniqueImages : ['/images/05_shop_product_card_1.jpg'];

          setProduct({
            ...liveData,
            id: liveData.customId || liveData.id || liveData._id,
            sizes: Array.isArray(liveData.sizes) && liveData.sizes.length > 0 ? liveData.sizes : ['Standard'],
            sizeVariants: Array.isArray(liveData.sizeVariants) ? liveData.sizeVariants : [],
            images: finalImages,
            cardImage: cover || finalImages[0],
            features: Array.isArray(liveData.features) ? liveData.features : [],
          });
        }
      } catch (err) {
        console.warn('Using static fallback for product details:', err.message);
        if (!product && !initialProduct) {
          setProduct(PRODUCTS[0]);
        }
      } finally {
        setIsLoadingProduct(false);
      }
    };
    if (id) {
      fetchLiveProduct();
    }
  }, [id]);

  const isUnstitched = Boolean(
    (typeof product?.category === 'string' && product.category.toLowerCase().includes('unstitched')) ||
    (typeof product?.subCategory === 'string' && product.subCategory.toLowerCase().includes('unstitched')) ||
    (typeof product?.name === 'string' && product.name.toLowerCase().includes('unstitched')) ||
    (typeof product?.slug === 'string' && product.slug.toLowerCase().includes('unstitched')) ||
    (typeof id === 'string' && id.toLowerCase().includes('unstitched')) ||
    (Array.isArray(product?.tags) && product.tags.some((t) => typeof t === 'string' && t.toLowerCase().includes('unstitched')))
  );

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(() =>
    isUnstitched ? 'Unstitched (Free Size)' : ((product?.sizes && product.sizes[0]) || 'Standard')
  );
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');

  // Synchronize size when product loads or switches to/from unstitched
  useEffect(() => {
    if (isUnstitched) {
      setSelectedSize('Unstitched (Free Size)');
    } else if (Array.isArray(product?.sizes) && product.sizes.length > 0) {
      if (!product.sizes.includes(selectedSize) || selectedSize === 'Unstitched (Free Size)') {
        setSelectedSize(product.sizes[0]);
      }
    }
  }, [product?.id, product?.category, product?.subCategory, product?.name, product?.slug, isUnstitched]);
  const [pincodeStatus, setPincodeStatus] = useState(null);
  const [activeTab, setActiveTab] = useState('details');

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const { addToast } = useToast();
  const isWishlisted = isInWishlist(product?.id);

  // Reviews & Verified Purchase State
  const [reviewsData, setReviewsData] = useState({
    reviews: [],
    totalCount: 0,
    averageRating: product?.rating || 4.8,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [eligibility, setEligibility] = useState({
    canReview: false,
    hasPurchased: false,
    hasReviewed: false,
    reason: '',
  });
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    review: '',
    images: [],
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  // Fetch live reviews and verify purchase eligibility
  useEffect(() => {
    const fetchReviewsAndEligibility = async () => {
      const targetId = product?.id || product?._id || id;
      if (!targetId) return;

      setIsLoadingReviews(true);
      try {
        const res = await apiClient.get(API_ENDPOINTS.REVIEWS.BY_PRODUCT(targetId));
        if (res?.data) {
          setReviewsData(res.data);
        }
      } catch (e) {
        console.warn('Live reviews fetch failed:', e.message);
      } finally {
        setIsLoadingReviews(false);
      }

      if (user?.email) {
        setIsCheckingEligibility(true);
        try {
          const elRes = await apiClient.get(
            API_ENDPOINTS.REVIEWS.ELIGIBILITY(targetId, user.email)
          );
          if (elRes?.data) {
            setEligibility(elRes.data);
          }
        } catch (e) {
          console.warn('Review eligibility check failed:', e.message);
        } finally {
          setIsCheckingEligibility(false);
        }
      } else {
        setEligibility({
          canReview: false,
          hasPurchased: false,
          hasReviewed: false,
          reason: 'Please sign in to verify your purchase history and review this creation.',
        });
      }
    };

    fetchReviewsAndEligibility();
  }, [id, product?.id, product?._id, user?.email]);

  const handleReviewImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setIsUploadingImage(true);
    try {
      const res = await apiClient.post(API_ENDPOINTS.UPLOAD.SINGLE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const url = res?.data?.url || res?.url;
      if (url) {
        setNewReview((prev) => ({
          ...prev,
          images: [...prev.images, url],
        }));
        addToast('Review photo uploaded successfully', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Image upload failed', 'error');
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');

    if (!user || !user.email) {
      setReviewError('Please sign in to submit a verified review.');
      return;
    }

    if (!newReview.review.trim()) {
      setReviewError('Please write your review feedback.');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const targetId = product?.id || product?._id || id;
      await apiClient.post(API_ENDPOINTS.REVIEWS.BASE, {
        productId: targetId,
        productName: product?.name,
        productImage: product?.cardImage || (product?.images && product.images[0]) || '',
        customer: user.name || 'Verified Patron',
        customerEmail: user.email,
        rating: Number(newReview.rating),
        title: newReview.title.trim(),
        review: newReview.review.trim(),
        images: newReview.images,
      });

      setReviewSuccess(
        'Thank you! Your verified review has been submitted for certification and will appear once approved by our atelier.'
      );
      setNewReview({ rating: 5, title: '', review: '', images: [] });
      setEligibility((prev) => ({ ...prev, canReview: false, hasReviewed: true }));
      setShowReviewForm(false);
      addToast('Review submitted for moderation', 'success');

      // Refresh reviews list
      const res = await apiClient.get(API_ENDPOINTS.REVIEWS.BY_PRODUCT(targetId));
      if (res?.data) {
        setReviewsData(res.data);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to submit review.';
      setReviewError(msg);
      addToast(msg, 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Dynamic price calculation according to selected size variant
  const activeVariant = Array.isArray(product?.sizeVariants)
    ? product.sizeVariants.find((v) => v.size === selectedSize)
    : null;

  const currentPrice = activeVariant?.price
    ? Number(activeVariant.price)
    : Number(product?.price || 0);

  const currentOriginalPrice = activeVariant?.originalPrice
    ? Number(activeVariant.originalPrice)
    : (product?.originalPrice ? Number(product.originalPrice) : null);

  const discountPercent =
    currentOriginalPrice && currentOriginalPrice > currentPrice
      ? Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)
      : 0;

  const handleAddToCart = () => {
    addToCart(
      {
        ...product,
        price: currentPrice,
        originalPrice: currentOriginalPrice,
      },
      isUnstitched ? 'Unstitched (Free Size)' : selectedSize,
      quantity
    );
  };

  const handleBuyNow = () => {
    addToCart(
      {
        ...product,
        price: currentPrice,
        originalPrice: currentOriginalPrice,
      },
      isUnstitched ? 'Unstitched (Free Size)' : selectedSize,
      quantity
    );
    navigate('/checkout');
  };

  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (pincode.length >= 5) {
      setPincodeStatus({
        success: true,
        message: 'Eligible for Royal Express Delivery (Delivers within 2-3 business days)',
      });
    } else {
      setPincodeStatus({
        success: false,
        message: 'Please enter a valid 6-digit postal code',
      });
    }
  };

  // Loading skeleton while fetching product if no initial product
  if (!product && isLoadingProduct) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 animate-pulse">
        <div className="h-4 w-48 bg-stone-200/80 rounded-md" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            <div className="flex md:flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-16 h-20 sm:w-20 sm:h-26 rounded-xl bg-stone-200/80" />
              ))}
            </div>
            <div className="flex-1 aspect-[3/4] rounded-2xl bg-stone-200/80" />
          </div>
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <div className="h-4 w-28 bg-stone-200/80 rounded-md" />
              <div className="h-8 w-3/4 bg-stone-200/80 rounded-lg" />
              <div className="h-6 w-36 bg-stone-200/80 rounded-md" />
            </div>
            <div className="h-24 bg-stone-100 rounded-xl border border-stone-200/60" />
            <div className="h-12 bg-stone-200/80 rounded-xl" />
            <div className="h-12 bg-stone-200/80 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // Not found fallback
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-stone-900">Creation Not Found</h2>
        <p className="text-sm text-stone-500">The artisanal creation you are seeking may have been archived.</p>
        <Link
          to="/shop"
          className="inline-block px-6 py-2.5 bg-[#09231A] text-[#F7E7BE] rounded-xl text-xs uppercase font-bold tracking-widest"
        >
          Explore All Creations
        </Link>
      </div>
    );
  }

  // Related products from same category or complementary
  const relatedProducts = PRODUCTS.filter(
    (p) => p.id !== product.id && (p.category === product.category || p.isBestSeller)
  ).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 pb-28 lg:pb-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center text-xs text-stone-500 gap-2">
        <Link to="/" className="hover:text-stone-900 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link
          to={`/${String(product.category || '').toLowerCase().replace(/\s+/g, '-')}`}
          className="hover:text-stone-900 capitalize transition-colors font-medium"
        >
          {String(product.category || '').toLowerCase() === 'stitched-suits' ||
          String(product.category || '').toLowerCase() === 'stitched suits'
            ? 'Stitched Suits'
            : String(product.category || '').toLowerCase() === 'unstitched-suits' ||
              String(product.category || '').toLowerCase() === 'unstitched suits'
            ? 'Unstitched Suits'
            : String(product.category || '').toLowerCase() === 'sarees'
            ? 'Sarees'
            : product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-stone-900 font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left: Gallery Column */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible shrink-0 pb-2 md:pb-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-16 h-20 sm:w-20 sm:h-26 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImage === idx
                      ? 'border-[#09231A] ring-2 ring-[#D4AF37]'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Main Stage Image */}
          <div className="relative flex-1 aspect-[3/4] rounded-2xl overflow-hidden border border-[#D4AF37]/30 bg-[#FAF7F2] shadow-lg group">
            <img
              src={
                product.images?.[activeImage] ||
                product.images?.[0] ||
                product.image ||
                product.cardImage ||
                '/images/hero-model.jpg'
              }
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            
            {/* Floating Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product)}
              className={`absolute top-4 right-4 w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md shadow-lg transition-all ${
                isWishlisted
                  ? 'bg-[#8C271E] text-white'
                  : 'bg-white/85 text-stone-700 hover:bg-[#09231A] hover:text-[#F7E7BE]'
              }`}
              aria-label="Wishlist"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>

            {/* Silk Mark Seal */}
            <div className="absolute bottom-4 left-4 bg-[#09231A]/90 text-[#F7E7BE] border border-[#D4AF37]/50 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-md">
              <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Certified Handcrafted Silk</span>
            </div>
          </div>
        </div>

        {/* Right: Buy Box & Options */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#18523D] font-bold mb-1">
              <span>{product.category}</span>
              <span>&bull;</span>
              <span>{product.subCategory}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 leading-tight">
              {product.name}
            </h1>

            {/* Reviews & Star Rating */}
            <div className="flex items-center gap-3 mt-3">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('reviews');
                  document.getElementById('product-tabs-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-2 hover:opacity-85 transition-opacity cursor-pointer text-left"
              >
                <div className="flex text-[#D4AF37]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(reviewsData.averageRating || product.rating)
                          ? 'fill-current'
                          : 'text-stone-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-stone-800">
                  {reviewsData.averageRating || product.rating}
                </span>
                <span className="text-xs text-stone-400 hover:text-stone-700 underline decoration-stone-300">
                  ({reviewsData.totalCount || product.reviewCount} Patron Reviews)
                </span>
              </button>
              <span className="text-stone-300">&bull;</span>
              <span className="text-xs text-[#18523D] font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Handloom Mark
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 rounded-xl bg-white border border-[#D4AF37]/25 shadow-sm space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-[#09231A]">
                ₹{currentPrice.toLocaleString('en-IN')}
              </span>
              {currentOriginalPrice && (
                <span className="text-base text-stone-400 line-through">
                  ₹{currentOriginalPrice.toLocaleString('en-IN')}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-xs font-bold text-[#8C271E] bg-[#8C271E]/10 px-2.5 py-0.5 rounded-full">
                  Save {discountPercent}%
                </span>
              )}
            </div>
            <p className="text-[11px] text-stone-500">
              Inclusive of all taxes &bull; Free worldwide express delivery on this creation
            </p>
          </div>

          {/* Short Narrative */}
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {product.description}
          </p>

          {/* Size Selection */}
          {isUnstitched ? (
            <div className="p-3.5 bg-[#FAF7F2] border border-[#D4AF37]/35 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#18523D]/10 flex items-center justify-center text-[#18523D] shrink-0">
                  <Scissors className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-stone-900">
                    Size: <span className="text-[#18523D]">Unstitched Fabric (Free Size)</span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Customizable Fabric Set &bull; Free size to tailor to your bespoke fit
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-semibold bg-[#18523D]/10 text-[#18523D] px-2.5 py-1 rounded-full whitespace-nowrap">
                Free Size
              </span>
            </div>
          ) : (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-900">
                  Select Size: <span className="text-[#18523D]">{selectedSize}</span>
                </label>
                <button
                  type="button"
                  onClick={() => alert('Standard Saisaa Couture Sizing: XS (Bust 34"), S (Bust 36"), M (Bust 38"), L (Bust 40"), XL (Bust 42"), XXL (Bust 44"). Custom tailored measurements also accepted.')}
                  className="text-xs text-[#18523D] underline font-semibold cursor-pointer hover:text-[#09231A]"
                >
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {product.sizes.map((sz) => {
                  const variant = product.sizeVariants?.find((v) => v.size === sz);
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all flex flex-col items-center gap-0.5 cursor-pointer ${
                        selectedSize === sz
                          ? 'bg-[#09231A] text-[#F7E7BE] border-[#09231A] shadow-md scale-102'
                          : 'border-stone-300 text-stone-700 hover:border-stone-400 bg-white'
                      }`}
                    >
                      <span>{sz}</span>
                      {variant?.price ? (
                        <span
                          className={`text-[10px] font-mono ${
                            selectedSize === sz ? 'text-[#D4AF37]' : 'text-stone-500'
                          }`}
                        >
                          ₹{Number(variant.price).toLocaleString('en-IN')}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center justify-between py-3 border-y border-stone-200/80">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-800">
                Quantity
              </span>
              <span className="text-[11px] text-[#18523D] font-medium">
                ({product.inStock ? 'In Stock' : 'Limited Edition'})
              </span>
            </div>
            <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden bg-white shadow-sm h-10 w-28">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-full bg-stone-50 hover:bg-stone-100 text-stone-700 font-bold text-base flex items-center justify-center transition-colors select-none active:bg-stone-200"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="flex-1 text-center text-xs font-bold text-stone-900 select-none">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-full bg-stone-50 hover:bg-stone-100 text-stone-700 font-bold text-base flex items-center justify-center transition-colors select-none active:bg-stone-200"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {/* Action CTA Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full h-12 bg-[#09231A] hover:bg-[#103B2C] text-[#F7E7BE] hover:text-white px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-[#D4AF37]/50 shadow-md transition-all active:scale-[0.98]"
            >
              <ShoppingBag className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>Add to Cart</span>
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full h-12 bg-[#D4AF37] hover:bg-[#F7E7BE] text-[#09231A] px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
            >
              <span>Buy Now</span>
              <span className="text-sm shrink-0">&rarr;</span>
            </button>
          </div>

          {/* Postal Delivery Checker */}
          <div className="pt-4 border-t border-stone-200">
            <form onSubmit={handleCheckPincode} className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#18523D]" /> Check Delivery Pincode
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit postal code"
                  className="flex-1 text-xs px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:border-[#09231A]"
                />
                <button
                  type="submit"
                  className="bg-stone-800 text-stone-100 px-4 py-2.5 rounded-lg text-xs font-semibold hover:bg-stone-900 transition-colors"
                >
                  Check
                </button>
              </div>
              {pincodeStatus && (
                <p
                  className={`text-xs ${
                    pincodeStatus.success ? 'text-[#18523D] font-medium' : 'text-red-600'
                  }`}
                >
                  {pincodeStatus.message}
                </p>
              )}
            </form>
          </div>

          {/* Boutique Assurances */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-stone-200 text-xs text-stone-600">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#18523D]" />
              <span>Free Insured Express Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <Scissors className="w-4 h-4 text-[#18523D]" />
              <span>Tailoring by Master Karigars</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-[#18523D]" />
              <span>7-Day Hassle-Free Exchange</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#18523D]" />
              <span>100% Authentic Handloom Certified</span>
            </div>
          </div>
        </div>

      </div>

      {/* Product Details Tabs (Fabric, Care, Story, Reviews) */}
      <div
        id="product-tabs-section"
        className="bg-white rounded-2xl border border-[#D4AF37]/25 shadow-sm p-6 sm:p-8 space-y-6"
      >
        <div className="flex border-b border-stone-200 gap-8 overflow-x-auto">
          {[
            { id: 'details', label: 'Artistry & Craft' },
            { id: 'features', label: 'Key Features' },
            { id: 'care', label: 'Fabric & Care' },
            { id: 'delivery', label: 'Shipping & Returns' },
            { id: 'reviews', label: `Patron Reviews (${reviewsData.totalCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-xs uppercase tracking-widest font-bold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                activeTab === tab
                  ? 'border-[#09231A] text-[#09231A]'
                  : 'border-transparent text-stone-400 hover:text-stone-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="text-sm text-stone-600 leading-relaxed pt-2">
          {activeTab === 'details' && (
            <div className="space-y-4">
              <p>
                {product.description ||
                  'Bespoke royal ethnic couture handcrafted with pure handwoven textures and artisanal needlework.'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-stone-200">
                  <span className="text-xs uppercase font-bold text-stone-400">Pure Fabric</span>
                  <p className="font-semibold text-stone-900 mt-1">
                    {product.fabric || 'Pure Silk Blend'}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-stone-200">
                  <span className="text-xs uppercase font-bold text-stone-400">Embroidery & Work</span>
                  <p className="font-semibold text-stone-900 mt-1">
                    {product.work || 'Handcrafted Royal Karigari'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="space-y-3">
              {Array.isArray(product.features) && product.features.length > 0 ? (
                <ul className="space-y-2.5">
                  {product.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-stone-700">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 border border-[#18523D]/30 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-[#18523D]" />
                      </div>
                      <span className="text-xs sm:text-sm font-medium leading-relaxed">{f}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-stone-200 text-stone-500 text-xs leading-relaxed">
                  Crafted with signature Saisaa artisanal finesse, hand-selected pure fabric, and bespoke hand-embroidery detailing.
                </div>
              )}
            </div>
          )}

          {activeTab === 'care' && (
            <div className="space-y-3">
              <p className="font-semibold text-stone-800">Caring for your royal heirloom:</p>
              <p>{product.care}</p>
              <p className="text-xs text-stone-500">
                To preserve pure zari wire and natural dyed threads, we advise against spraying perfumes or alcohol-based fragrances directly onto the embroidery surface.
              </p>
            </div>
          )}

          {activeTab === 'delivery' && (
            <div className="space-y-3">
              <p>
                All Saisaa orders are carefully hand-packed in our signature emerald velvet presentation box, wrapped with gold foil seal tissue.
              </p>
              <ul className="space-y-1.5 text-xs text-stone-600">
                <li>&bull; Domestic (India): 2-4 business days via express courier</li>
                <li>&bull; International (USA, UK, UAE, Canada): 4-7 business days via DHL Express</li>
                <li>&bull; Made-to-measure custom stitching requires 5 additional artisan working days</li>
              </ul>
            </div>
          )}

          {/* Patron Reviews Tab Content */}
          {activeTab === 'reviews' && (
            <div className="space-y-8 animate-fade-in">
              {/* Rating Summary Card */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 rounded-2xl bg-[#FAF7F2] border border-[#D4AF37]/30">
                {/* Score */}
                <div className="md:col-span-4 flex flex-col justify-center items-center text-center p-4 border-b md:border-b-0 md:border-r border-stone-200">
                  <span className="font-serif text-5xl font-bold text-[#09231A]">
                    {reviewsData.averageRating}
                  </span>
                  <div className="flex text-[#D4AF37] my-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(reviewsData.averageRating)
                            ? 'fill-current text-[#D4AF37]'
                            : 'text-stone-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-stone-500 font-medium">
                    Based on {reviewsData.totalCount} verified patron reviews
                  </span>
                </div>

                {/* Star Progress Bars */}
                <div className="md:col-span-5 space-y-2 flex flex-col justify-center">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const count = reviewsData.distribution[stars] || 0;
                    const percent =
                      reviewsData.totalCount > 0
                        ? Math.round((count / reviewsData.totalCount) * 100)
                        : 0;
                    return (
                      <div key={stars} className="flex items-center gap-2 text-xs text-stone-600">
                        <span className="w-8 font-medium shrink-0">{stars} ★</span>
                        <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#0A261C] rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="w-8 text-right text-[11px] text-stone-400 shrink-0">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Write Review Call-to-Action / Verified Badge */}
                <div className="md:col-span-3 flex flex-col justify-center items-center text-center p-2">
                  {eligibility.canReview ? (
                    <div className="space-y-2 w-full">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Verified Purchaser</span>
                      </div>
                      <p className="text-[11px] text-stone-500">
                        You have purchased this piece. Share your royal fitting experience!
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowReviewForm((prev) => !prev)}
                        className="w-full bg-[#09231A] hover:bg-[#124030] text-[#F7E7BE] px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
                      >
                        {showReviewForm ? 'Close Form' : 'Write a Review'}
                      </button>
                    </div>
                  ) : eligibility.hasReviewed ? (
                    <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-center space-y-1">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
                      <p className="text-xs font-bold text-emerald-900">Review Submitted</p>
                      <p className="text-[11px] text-emerald-700">
                        Thank you for sharing your feedback with the Saisaa community.
                      </p>
                    </div>
                  ) : user ? (
                    <div className="p-3 rounded-xl bg-stone-100 border border-stone-200 text-center space-y-1.5">
                      <ShieldCheck className="w-5 h-5 text-[#D4AF37] mx-auto" />
                      <p className="text-xs font-bold text-stone-800">Verified Buyers Only</p>
                      <p className="text-[11px] text-stone-500 leading-tight">
                        Reviews can only be submitted after acquiring this creation.
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-stone-100 border border-stone-200 text-center space-y-2">
                      <p className="text-xs font-semibold text-stone-700">Verified Patron Access</p>
                      <button
                        type="button"
                        onClick={() => navigate('/account')}
                        className="text-xs font-bold text-[#09231A] underline hover:text-[#18523D]"
                      >
                        Sign in to review
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Review Submission Form Modal / Drawer */}
              {showReviewForm && (
                <div className="p-6 rounded-2xl bg-white border border-[#D4AF37]/50 shadow-md space-y-5 animate-slide-in">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <div>
                      <h4 className="font-serif text-lg font-bold text-stone-900">
                        Share Your Styling Experience
                      </h4>
                      <p className="text-xs text-stone-500">
                        Verified Patron Review for <span className="font-semibold">{product.name}</span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
                    >
                      <CloseIcon className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    {/* Star Rating Picker */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                        Your Royal Rating *
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1 text-[#D4AF37]">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewReview((prev) => ({ ...prev, rating: star }))}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              className="p-1 hover:scale-110 transition-transform cursor-pointer"
                            >
                              <Star
                                className={`w-6 h-6 ${
                                  star <= (hoverRating || newReview.rating)
                                    ? 'fill-current text-[#D4AF37]'
                                    : 'text-stone-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                        <span className="text-xs font-bold text-stone-800 ml-2">
                          {newReview.rating === 5 && 'Exceptional (5/5)'}
                          {newReview.rating === 4 && 'Very Good (4/5)'}
                          {newReview.rating === 3 && 'Average (3/5)'}
                          {newReview.rating === 2 && 'Needs Improvement (2/5)'}
                          {newReview.rating === 1 && 'Unsatisfactory (1/5)'}
                        </span>
                      </div>
                    </div>

                    {/* Headline Title */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                        Review Title (Optional)
                      </label>
                      <input
                        type="text"
                        value={newReview.title}
                        onChange={(e) => setNewReview((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g. Breathtaking embroidery and pure silk drape"
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#09231A]"
                      />
                    </div>

                    {/* Feedback Commentary */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                        Detailed Commentary *
                      </label>
                      <textarea
                        rows={4}
                        value={newReview.review}
                        onChange={(e) => setNewReview((prev) => ({ ...prev, review: e.target.value }))}
                        placeholder="Describe the fabric quality, karigari finishing, sizing, drape, and where you wore it..."
                        className="w-full text-xs p-3.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#09231A]"
                        required
                      />
                    </div>

                    {/* Photo Upload Section */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                        Attach Product Photos (Optional)
                      </label>
                      <div className="flex flex-wrap items-center gap-3">
                        {newReview.images.map((imgUrl, idx) => (
                          <div
                            key={idx}
                            className="relative w-16 h-20 rounded-xl overflow-hidden border border-stone-200 group"
                          >
                            <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() =>
                                setNewReview((prev) => ({
                                  ...prev,
                                  images: prev.images.filter((_, i) => i !== idx),
                                }))
                              }
                              className="absolute top-1 right-1 p-0.5 bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <CloseIcon className="w-3 h-3" />
                            </button>
                          </div>
                        ))}

                        <label className="w-16 h-20 rounded-xl border-2 border-dashed border-stone-300 hover:border-[#09231A] flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors bg-[#FAF7F2]">
                          <Camera className="w-5 h-5 text-stone-400" />
                          <span className="text-[9px] font-bold text-stone-500 uppercase tracking-tight">
                            {isUploadingImage ? '...' : '+ Photo'}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleReviewImageUpload}
                            disabled={isUploadingImage}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    {reviewError && (
                      <p className="text-xs text-red-600 bg-rose-50 p-2.5 rounded-xl border border-red-200 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{reviewError}</span>
                      </p>
                    )}

                    {reviewSuccess && (
                      <p className="text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>{reviewSuccess}</span>
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmittingReview}
                        className="bg-[#09231A] hover:bg-[#124030] text-[#F7E7BE] px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all disabled:opacity-50"
                      >
                        {isSubmittingReview ? 'Submitting...' : 'Publish Verified Review'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Published Reviews List */}
              <div className="space-y-4">
                <h4 className="font-serif text-lg font-bold text-stone-900 border-b border-stone-100 pb-2">
                  Patron Commentary & Experiences ({reviewsData.reviews.length})
                </h4>

                {reviewsData.reviews.length === 0 ? (
                  <div className="text-center py-12 px-4 rounded-2xl bg-[#FAF7F2] border border-stone-200 space-y-2">
                    <Crown className="w-8 h-8 text-[#D4AF37] mx-auto opacity-75" />
                    <p className="font-serif text-base font-bold text-stone-800">
                      No Reviews Published Yet
                    </p>
                    <p className="text-xs text-stone-500 max-w-md mx-auto">
                      Be the first verified patron to acquire this creation and share your authentic styling testimonial!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {reviewsData.reviews.map((rev) => (
                      <div
                        key={rev.id || rev._id}
                        className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-[#0A261C] text-[#F7E7BE] font-bold text-xs flex items-center justify-center shrink-0">
                              {(rev.customer || 'P').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-stone-900">{rev.customer}</span>
                                {rev.verifiedPurchase && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                                    <Check className="w-3 h-3 text-emerald-600" />
                                    <span>Verified Buyer</span>
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-stone-400 block">{rev.date}</span>
                            </div>
                          </div>

                          {/* Star Rating */}
                          <div className="flex text-[#D4AF37]">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < rev.rating ? 'fill-current text-[#D4AF37]' : 'text-stone-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Title & Comment */}
                        <div className="space-y-1">
                          {rev.title && (
                            <h5 className="font-serif text-xs font-bold text-stone-900">
                              {rev.title}
                            </h5>
                          )}
                          <p className="text-xs text-stone-700 leading-relaxed italic">
                            "{rev.review}"
                          </p>
                        </div>

                        {/* Photos if any */}
                        {Array.isArray(rev.images) && rev.images.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {rev.images.map((imgUrl, imgIdx) => (
                              <img
                                key={imgIdx}
                                src={imgUrl}
                                alt="Review asset"
                                className="w-14 h-16 rounded-xl object-cover border border-stone-200"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Showcase */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#18523D] font-bold">You May Also Admire</span>
              <h3 className="font-serif text-2xl font-bold text-stone-900">Complementary Creations</h3>
            </div>
            <Link to="/shop" className="text-xs font-bold uppercase tracking-wider text-[#18523D] hover:underline">
              View All &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Mobile Sticky Floating Bar - Always visible on mobile */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#D4AF37]/30 px-4 py-3 shadow-[0_-4px_25px_rgba(0,0,0,0.12)] flex items-center justify-between gap-3">
        <div className="flex flex-col shrink-0 min-w-[70px]">
          <span className="text-[10px] uppercase font-bold text-stone-400 leading-none">Total</span>
          <span className="text-base font-bold text-[#09231A] leading-tight">₹{(product.price * quantity).toLocaleString('en-IN')}</span>
        </div>
        <div className="flex-1 flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 h-11 bg-[#09231A] hover:bg-[#103B2C] text-[#F7E7BE] rounded-xl text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 border border-[#D4AF37]/50 shadow-sm active:scale-95 transition-all"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
            <span className="whitespace-nowrap">Add to Cart</span>
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            className="flex-1 h-11 bg-[#D4AF37] hover:bg-[#F7E7BE] text-[#09231A] rounded-xl text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 shadow-sm active:scale-95 transition-all"
          >
            <span className="whitespace-nowrap">Buy Now</span>
            <span className="text-xs">&rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
};
