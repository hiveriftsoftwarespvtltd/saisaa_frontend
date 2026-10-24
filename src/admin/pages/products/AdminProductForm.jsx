import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Crown, X, Plus, Check, Tags, RefreshCw, Trash2, Image as ImageIcon } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { PageHeader } from '../../components/common/PageHeader';
import { ProductMediaUpload } from '../../components/products/ProductMediaUpload';

export const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addProduct, updateProduct, categories } = useAdmin();

  const isEditing = Boolean(id);
  const existingProduct = isEditing ? products.find((p) => p.id === id) : null;

  const [hasSizePricing, setHasSizePricing] = useState(() => {
    return Boolean(existingProduct?.sizeVariants && existingProduct.sizeVariants.length > 0);
  });
  const [customSizeInput, setCustomSizeInput] = useState('');

  // Form State initialized directly
  const [formData, setFormData] = useState(() => {
    if (existingProduct) {
      const initialCover =
        existingProduct.cardImage ||
        existingProduct.coverImage ||
        existingProduct.images?.[0] ||
        '/images/05_shop_product_card_1.jpg';
      return {
        name: existingProduct.name || '',
        sku: existingProduct.sku || '',
        description: existingProduct.description || '',
        category: existingProduct.category || 'Stitched Suits',
        subCategory:
          typeof existingProduct.subCategory === 'object' && existingProduct.subCategory !== null
            ? existingProduct.subCategory.name || ''
            : existingProduct.subCategory || '',
        price: existingProduct.price || '',
        originalPrice: existingProduct.originalPrice || '',
        stock: existingProduct.stock?.toString() || '0',
        lowStockThreshold: existingProduct.lowStockThreshold?.toString() || '5',
        fabric: existingProduct.fabric || '',
        color: existingProduct.color || '',
        work: existingProduct.work || '',
        care: existingProduct.care || 'Dry clean only.',
        features:
          Array.isArray(existingProduct.features) && existingProduct.features.length > 0
            ? existingProduct.features
            : [''],
        sizes: existingProduct.sizes || ['M', 'L'],
        sizeVariants: existingProduct.sizeVariants || [],
        status: existingProduct.status || 'Active',
        isFeatured: Boolean(existingProduct.isFeatured),
        isBestSeller: Boolean(existingProduct.isBestSeller),
        cardImage: initialCover,
        coverImage: initialCover,
        images:
          Array.isArray(existingProduct.images) && existingProduct.images.length > 0
            ? existingProduct.images
            : [initialCover],
      };
    }
    return {
      name: '',
      sku: '',
      description: '',
      category: 'Stitched Suits',
      subCategory: '3 pcs set',
      price: '',
      originalPrice: '',
      stock: '15',
      lowStockThreshold: '5',
      fabric: '',
      color: '',
      work: '',
      care: 'Dry clean only. Store in muslin bag.',
      features: [
        'Delicate hand-embroidered floral yoke detailing',
        'Scalloped lace trims along sleeves and neckline',
        'Includes matching trousers and artisan dupatta',
        'Soft breathable lining for all-day festive comfort',
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      sizeVariants: [],
      status: 'Active',
      isFeatured: false,
      isBestSeller: false,
      cardImage: '/images/05_shop_product_card_1.jpg',
      coverImage: '/images/05_shop_product_card_1.jpg',
      images: ['/images/05_shop_product_card_1.jpg'],
    };
  });

  const TAXONOMY_SUBCATEGORIES = {
    'Stitched Suits': [
      '3 pcs set',
      '2 pcs set',
      'long kurtis',
      'Short kurtis',
    ],
    'stitched-suits': [
      '3 pcs set',
      '2 pcs set',
      'long kurtis',
      'Short kurtis',
    ],
    'Unstitched Suits': [
      'Jamdani',
      'Banarasi silk',
      'Kanjivaram silk',
      'Pure cotton',
      'Muslin silk',
      'Linen fabric',
    ],
    'unstitched-suits': [
      'Jamdani',
      'Banarasi silk',
      'Kanjivaram silk',
      'Pure cotton',
      'Muslin silk',
      'Linen fabric',
    ],
    Sarees: [
      'Cotton sarees',
      'Chiffon sarees',
      'Silk sarees',
      'Kota sarees',
    ],
    sarees: [
      'Cotton sarees',
      'Chiffon sarees',
      'Silk sarees',
      'Kota sarees',
    ],
  };

  const availableSubCategories = useMemo(() => {
    const currentCategoryObj = categories?.find(
      (c) =>
        c.name?.toLowerCase() === formData.category?.toLowerCase() ||
        c.slug === formData.category?.toLowerCase()
    );
    const fromCategoryObj = (currentCategoryObj?.subCategories || [])
      .map((s) => (typeof s === 'object' && s !== null ? s.name : s))
      .filter((s) => typeof s === 'string' && s.trim().length > 0);
    const fromTaxonomy = (TAXONOMY_SUBCATEGORIES[formData.category] || [])
      .map((s) => (typeof s === 'object' && s !== null ? s.name : s))
      .filter((s) => typeof s === 'string' && s.trim().length > 0);
    return Array.from(new Set([...fromTaxonomy, ...fromCategoryObj]));
  }, [formData.category, categories]);

  const [isCustomSubCat, setIsCustomSubCat] = useState(() => {
    if (existingProduct?.subCategory) {
      const subName =
        typeof existingProduct.subCategory === 'object' && existingProduct.subCategory !== null
          ? existingProduct.subCategory.name
          : existingProduct.subCategory;
      const defaultList = TAXONOMY_SUBCATEGORIES[existingProduct.category] || [];
      return !defaultList.includes(subName);
    }
    return false;
  });

  const handleCategoryChange = (newCat) => {
    const currentCategoryObj = categories?.find(
      (c) =>
        c.name?.toLowerCase() === newCat?.toLowerCase() ||
        c.slug === newCat?.toLowerCase()
    );
    const fromCategoryObj = (currentCategoryObj?.subCategories || [])
      .map((s) => (typeof s === 'object' && s !== null ? s.name : s))
      .filter((s) => typeof s === 'string' && s.trim().length > 0);
    const matchingSubs = [
      ...(TAXONOMY_SUBCATEGORIES[newCat] || []),
      ...fromCategoryObj,
    ];
    setFormData((prev) => ({
      ...prev,
      category: newCat,
      subCategory: matchingSubs[0] || '',
    }));
    setIsCustomSubCat(false);
  };

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Standard'];
  const galleryPresets = [
    '/images/hero-model.jpg',
    '/images/blue-kurti.jpg',
    '/images/pink-kurti.jpg',
    '/images/maroon-story.jpg',
    '/images/saree-arch.jpg',
    '/images/saree-editorial.jpg',
    '/images/lavender-suit.jpg',
    '/images/rani-pink.jpg',
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleToggleSizePricing = (enable) => {
    setHasSizePricing(enable);
    if (enable) {
      setFormData((prev) => {
        if (prev.sizeVariants && prev.sizeVariants.length > 0) return prev;
        const initialVariants = (prev.sizes || ['XS', 'S', 'M', 'L', 'XL']).map((sz) => ({
          size: sz,
          price: prev.price || '',
          originalPrice: prev.originalPrice || '',
          stock: '',
        }));
        return { ...prev, sizeVariants: initialVariants };
      });
    }
  };

  const handleVariantChange = (index, field, value) => {
    setFormData((prev) => {
      const nextVariants = [...(prev.sizeVariants || [])];
      nextVariants[index] = { ...nextVariants[index], [field]: value };
      return { ...prev, sizeVariants: nextVariants };
    });
  };

  const handleAddCustomSizeVariant = (customSizeName) => {
    const trimmed = (customSizeName || '').trim();
    if (!trimmed) return;
    setFormData((prev) => {
      const exists = (prev.sizeVariants || []).some(
        (v) => v.size.toLowerCase() === trimmed.toLowerCase()
      );
      if (exists) return prev;
      const nextVariants = [
        ...(prev.sizeVariants || []),
        {
          size: trimmed,
          price: prev.price || '',
          originalPrice: prev.originalPrice || '',
          stock: '',
        },
      ];
      const nextSizes = prev.sizes.includes(trimmed) ? prev.sizes : [...prev.sizes, trimmed];
      return { ...prev, sizeVariants: nextVariants, sizes: nextSizes };
    });
  };

  const handleRemoveVariant = (index) => {
    setFormData((prev) => {
      const target = prev.sizeVariants[index];
      const nextVariants = prev.sizeVariants.filter((_, i) => i !== index);
      const nextSizes = prev.sizes.filter((s) => s !== target?.size);
      return { ...prev, sizeVariants: nextVariants, sizes: nextSizes };
    });
  };

  const handleSyncBasePriceToVariants = () => {
    if (!formData.price) return;
    setFormData((prev) => ({
      ...prev,
      sizeVariants: (prev.sizeVariants || []).map((v) => ({
        ...v,
        price: prev.price,
        originalPrice: prev.originalPrice || v.originalPrice,
      })),
    }));
  };

  const toggleSize = (size) => {
    setFormData((prev) => {
      const exists = prev.sizes.includes(size);
      let nextSizes;
      let nextVariants = prev.sizeVariants ? [...prev.sizeVariants] : [];

      if (exists) {
        nextSizes = prev.sizes.filter((s) => s !== size);
        nextVariants = nextVariants.filter((v) => v.size !== size);
      } else {
        nextSizes = [...prev.sizes, size];
        if (hasSizePricing && !nextVariants.some((v) => v.size === size)) {
          nextVariants.push({
            size,
            price: prev.price || '',
            originalPrice: prev.originalPrice || '',
            stock: '',
          });
        }
      }
      return { ...prev, sizes: nextSizes, sizeVariants: nextVariants };
    });
  };

  const addImagePreset = (imgUrl) => {
    if (!formData.images.includes(imgUrl)) {
      setFormData((prev) => ({ ...prev, images: [...prev.images, imgUrl] }));
    }
  };

  const removeImage = (imgUrl) => {
    if (formData.images.length > 1) {
      setFormData((prev) => ({
        ...prev,
        images: prev.images.filter((i) => i !== imgUrl),
      }));
    }
  };

  const handleFeatureChange = (index, value) => {
    setFormData((prev) => {
      const nextFeatures = [...(prev.features || [])];
      nextFeatures[index] = value;
      return { ...prev, features: nextFeatures };
    });
  };

  const handleAddFeature = (featureText = '') => {
    setFormData((prev) => ({
      ...prev,
      features: [...(prev.features || []), featureText],
    }));
  };

  const handleRemoveFeature = (index) => {
    setFormData((prev) => {
      const nextFeatures = (prev.features || []).filter((_, i) => i !== index);
      return {
        ...prev,
        features: nextFeatures.length > 0 ? nextFeatures : [''],
      };
    });
  };

  // Auto-calculated Discount %
  const calculatedDiscount =
    formData.originalPrice && formData.price && Number(formData.originalPrice) > Number(formData.price)
      ? Math.round(
          ((Number(formData.originalPrice) - Number(formData.price)) /
            Number(formData.originalPrice)) *
            100
        )
      : 0;

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanedVariants = hasSizePricing
      ? (formData.sizeVariants || [])
          .filter((v) => v.size && v.price !== '')
          .map((v) => ({
            size: v.size,
            price: Number(v.price) || Number(formData.price) || 0,
            originalPrice: v.originalPrice ? Number(v.originalPrice) : undefined,
            stock: v.stock !== '' && v.stock !== undefined ? Number(v.stock) : undefined,
          }))
      : [];

    const cleanedFeatures = (formData.features || [])
      .map((f) => (typeof f === 'string' ? f.trim() : ''))
      .filter((f) => f.length > 0);

    const effectiveBasePrice =
      Number(formData.price) ||
      (cleanedVariants.length > 0 ? Math.min(...cleanedVariants.map((v) => v.price)) : 0);

    const finalCover =
      formData.cardImage ||
      formData.coverImage ||
      (formData.images?.length > 0 ? formData.images[0] : '/images/05_shop_product_card_1.jpg');

    let finalImages = Array.isArray(formData.images) && formData.images.length > 0
      ? [...formData.images]
      : [finalCover];

    if (finalCover && !finalImages.includes(finalCover)) {
      finalImages = [finalCover, ...finalImages];
    }

    const payload = {
      ...formData,
      sku: formData.sku?.trim() || undefined,
      cardImage: finalCover,
      coverImage: finalCover,
      images: finalImages,
      features: cleanedFeatures,
      price: effectiveBasePrice,
      originalPrice: Number(formData.originalPrice) || 0,
      stock: Number(formData.stock) || 0,
      lowStockThreshold: Number(formData.lowStockThreshold) || 5,
      discount: calculatedDiscount,
      isFeatured: Boolean(formData.isFeatured),
      isBestSeller: Boolean(formData.isBestSeller),
      sizes:
        hasSizePricing && cleanedVariants.length > 0
          ? cleanedVariants.map((v) => v.size)
          : formData.sizes,
      sizeVariants: cleanedVariants,
    };

    if (isEditing) {
      updateProduct(id, payload);
    } else {
      addProduct(payload);
    }

    navigate('/admin/products');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      <PageHeader
        title={isEditing ? `Edit: ${formData.name || 'Product'}` : 'New Royal Product'}
        subtitle={
          isEditing
            ? `Update specifications and imagery for SKU ${formData.sku}`
            : 'Register a new luxury ethnic wear creation into the SAISAA collection.'
        }
        breadcrumbs={[
          { label: 'Catalog', path: '/admin/products' },
          { label: 'Products', path: '/admin/products' },
          { label: isEditing ? 'Edit Product' : 'New Product' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white border border-stone-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0A261C] hover:bg-[#123D2E] text-[#F7E7BE] rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Save className="w-4 h-4 text-[#D4AF37]" />
              <span>{isEditing ? 'Save Changes' : 'Publish Product'}</span>
            </button>
          </div>
        }
      />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Basic, Pricing, Details */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: Basic Information */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
            <h3 className="font-serif text-base font-bold text-stone-900 border-b border-stone-100 pb-2.5">
              1. Basic Information
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Handcrafted Marodi Velvet Anarkali Set"
                  className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C] text-stone-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    SKU Identifier *
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    required
                    placeholder="e.g. SAI-ST-009"
                    className="w-full px-3.5 py-2.5 text-xs font-mono bg-white rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C] text-stone-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C] text-stone-800 font-bold"
                  >
                    {categories && categories.length > 0 ? (
                      categories.map((c) => {
                        const catName = c.name || c;
                        const catKey = c.id || c._id || catName;
                        return (
                          <option key={catKey} value={catName}>
                            {catName}
                          </option>
                        );
                      })
                    ) : (
                      <>
                        <option value="Stitched Suits">Stitched Suits</option>
                        <option value="Unstitched Suits">Unstitched Suits</option>
                        <option value="Sarees">Sarees</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Sub-Category with Smart Dropdown, Quick Pills, and Custom Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                    Sub-Category / Cut *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomSubCat(!isCustomSubCat);
                      if (!isCustomSubCat && availableSubCategories.includes(formData.subCategory)) {
                        setFormData((prev) => ({ ...prev, subCategory: '' }));
                      }
                    }}
                    className="text-[10px] text-[#18523D] hover:underline font-semibold"
                  >
                    {isCustomSubCat ? '← Select from Predefined List' : '+ Enter Custom Sub-Category'}
                  </button>
                </div>

                {isCustomSubCat ? (
                  <div className="space-y-1">
                    <input
                      type="text"
                      name="subCategory"
                      value={formData.subCategory}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Awadhi Chikankari / Heirloom Banarasi"
                      className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-amber-300 ring-2 ring-amber-100/60 focus:outline-none focus:border-[#0A261C] text-stone-800"
                    />
                    <p className="text-[10px] text-stone-400">
                      Typing custom sub-category name. Will be assigned to this {formData.category} product.
                    </p>
                  </div>
                ) : (
                  <select
                    name="subCategory"
                    value={
                      typeof formData.subCategory === 'object' && formData.subCategory !== null
                        ? formData.subCategory.name || ''
                        : formData.subCategory || ''
                    }
                    onChange={(e) => {
                      if (e.target.value === '__custom__') {
                        setIsCustomSubCat(true);
                        setFormData((prev) => ({ ...prev, subCategory: '' }));
                      } else {
                        setFormData((prev) => ({ ...prev, subCategory: e.target.value }));
                      }
                    }}
                    className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C] text-stone-800 font-medium"
                  >
                    {availableSubCategories.map((sub) => {
                      const subName = typeof sub === 'object' && sub !== null ? sub.name : String(sub);
                      return (
                        <option key={subName} value={subName}>
                          {subName}
                        </option>
                      );
                    })}
                    <option value="__custom__">+ Enter Custom Sub-Category...</option>
                  </select>
                )}

                {/* Quick Selection Tag Pills */}
                {!isCustomSubCat && availableSubCategories.length > 0 && (
                  <div className="pt-1">
                    <span className="text-[10px] font-semibold text-stone-400 block mb-1.5 uppercase tracking-wider">
                      Quick Pick ({formData.category} Sub-Categories):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {availableSubCategories.map((sub) => {
                        const subName = typeof sub === 'object' && sub !== null ? sub.name : String(sub);
                        const isSelected =
                          (typeof formData.subCategory === 'object' && formData.subCategory !== null
                            ? formData.subCategory.name
                            : formData.subCategory) === subName;
                        return (
                          <button
                            type="button"
                            key={subName}
                            onClick={() =>
                              setFormData((prev) => ({ ...prev, subCategory: subName }))
                            }
                            className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                              isSelected
                                ? 'bg-[#0A261C] text-[#F7E7BE] border-[#0A261C] font-bold shadow-2xs'
                                : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100 hover:border-stone-300'
                            }`}
                          >
                            {subName}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Editorial Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the fabric origin, silhouette, and royal karigari craft..."
                  className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C] text-stone-800 leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Pricing & Inventory */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
            <h3 className="font-serif text-base font-bold text-stone-900 border-b border-stone-100 pb-2.5">
              2. Pricing & Inventory Engine
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Selling Price (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    placeholder="12999"
                    className="w-full pl-8 pr-3.5 py-2.5 text-xs font-bold bg-white rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C] text-[#0A261C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Original MSRP (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    placeholder="16999"
                    className="w-full pl-8 pr-3.5 py-2.5 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C] text-stone-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Discount Calculated
                </label>
                <div className="px-3.5 py-2.5 text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl flex items-center justify-between">
                  <span>{calculatedDiscount}% OFF</span>
                  <Crown className="w-4 h-4 text-emerald-600" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Current Stock Units *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 text-xs font-mono bg-white rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C] text-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Low Stock Threshold Alert
                </label>
                <input
                  type="number"
                  name="lowStockThreshold"
                  value={formData.lowStockThreshold}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs font-mono bg-white rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C] text-stone-800"
                />
              </div>
            </div>

            {/* Size-Wise Custom Pricing Toggle & Matrix */}
            <div className="pt-4 border-t border-stone-100 space-y-4">
              <div className="flex items-center justify-between p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Tags className="w-4 h-4 text-[#D4AF37]" />
                    <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                      Size-Wise Custom Pricing
                    </h4>
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Enable to set different selling prices and stock for different garment sizes (e.g. XS ₹2,499, XL ₹2,899, XXL ₹3,199).
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={hasSizePricing}
                    onChange={(e) => handleToggleSizePricing(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0A261C]"></div>
                </label>
              </div>

              {hasSizePricing && (
                <div className="space-y-3 bg-[#FAF7F2]/60 p-4 rounded-xl border border-[#D4AF37]/30">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#0A261C] uppercase tracking-wider">
                      Tiered Size Pricing Matrix ({formData.sizeVariants?.length || 0} Sizes)
                    </span>
                    <div className="flex items-center gap-2">
                      {formData.price && (
                        <button
                          type="button"
                          onClick={handleSyncBasePriceToVariants}
                          className="text-[11px] font-semibold text-[#18523D] hover:underline flex items-center gap-1 cursor-pointer bg-white px-2.5 py-1 rounded-lg border border-stone-200 shadow-2xs"
                        >
                          <RefreshCw className="w-3 h-3 text-[#D4AF37]" />
                          Fill Base Price (₹{formData.price})
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Table of Size Variants */}
                  <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white shadow-2xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-stone-50 border-b border-stone-200 text-[10px] font-bold uppercase tracking-wider text-stone-500">
                          <th className="py-2.5 px-3">Size</th>
                          <th className="py-2.5 px-3">Selling Price (₹) *</th>
                          <th className="py-2.5 px-3">Original MSRP (₹)</th>
                          <th className="py-2.5 px-3">Stock Units</th>
                          <th className="py-2.5 px-3 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 text-xs">
                        {(formData.sizeVariants || []).map((variant, vIdx) => (
                          <tr key={vIdx} className="hover:bg-stone-50/70 transition-colors">
                            <td className="py-2 px-3">
                              <span className="inline-flex items-center font-bold font-mono text-xs text-[#0A261C] bg-[#0A261C]/5 border border-[#0A261C]/20 px-2.5 py-1 rounded-md">
                                {variant.size}
                              </span>
                            </td>
                            <td className="py-2 px-3">
                              <div className="relative max-w-[130px]">
                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400 font-bold text-xs">
                                  ₹
                                </span>
                                <input
                                  type="number"
                                  value={variant.price}
                                  onChange={(e) => handleVariantChange(vIdx, 'price', e.target.value)}
                                  placeholder={formData.price || '0'}
                                  required
                                  className="w-full pl-6 pr-2 py-1.5 text-xs font-bold text-[#0A261C] bg-white rounded-lg border border-stone-200 focus:outline-none focus:border-[#0A261C]"
                                />
                              </div>
                            </td>
                            <td className="py-2 px-3">
                              <div className="relative max-w-[130px]">
                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400 font-bold text-xs">
                                  ₹
                                </span>
                                <input
                                  type="number"
                                  value={variant.originalPrice || ''}
                                  onChange={(e) => handleVariantChange(vIdx, 'originalPrice', e.target.value)}
                                  placeholder={formData.originalPrice || ''}
                                  className="w-full pl-6 pr-2 py-1.5 text-xs text-stone-600 bg-white rounded-lg border border-stone-200 focus:outline-none focus:border-[#0A261C]"
                                />
                              </div>
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="number"
                                value={variant.stock !== undefined ? variant.stock : ''}
                                onChange={(e) => handleVariantChange(vIdx, 'stock', e.target.value)}
                                placeholder="Units"
                                className="w-20 px-2 py-1.5 text-xs font-mono text-stone-800 bg-white rounded-lg border border-stone-200 focus:outline-none focus:border-[#0A261C]"
                              />
                            </td>
                            <td className="py-2 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveVariant(vIdx)}
                                className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                title="Remove Size Price"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Add Custom Size Variant Input */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={customSizeInput}
                      onChange={(e) => setCustomSizeInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomSizeVariant(customSizeInput);
                          setCustomSizeInput('');
                        }
                      }}
                      placeholder="Add custom size (e.g. 3XL, 4XL, Custom Tailored)..."
                      className="flex-1 max-w-xs px-3 py-1.5 text-xs bg-white rounded-lg border border-stone-200 focus:outline-none focus:border-[#0A261C]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        handleAddCustomSizeVariant(customSizeInput);
                        setCustomSizeInput('');
                      }}
                      className="px-3 py-1.5 text-xs font-bold bg-[#0A261C] text-[#F7E7BE] rounded-lg hover:bg-[#123D2E] transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
                      Add Size
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Product Details & Fabric Karigari */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
            <h3 className="font-serif text-base font-bold text-stone-900 border-b border-stone-100 pb-2.5">
              3. Artisan Fabric & Garment Specifications
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Fabric Composition
                </label>
                <input
                  type="text"
                  name="fabric"
                  value={formData.fabric}
                  onChange={handleChange}
                  placeholder="e.g. Mulberry Katan Silk / Chanderi"
                  className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C] text-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Color Shade
                </label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  placeholder="e.g. Mustard Gold / Emerald Green"
                  className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C] text-stone-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Embroidery & Karigari Work
              </label>
              <input
                type="text"
                name="work"
                value={formData.work}
                onChange={handleChange}
                placeholder="e.g. Artisanal Floral Neck Embroidery & Lace Trims"
                className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C] text-stone-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Care Instructions
              </label>
              <input
                type="text"
                name="care"
                value={formData.care}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C] text-stone-800"
              />
            </div>

            {/* Key Features / Bullet Points */}
            <div className="space-y-3 pt-3 border-t border-stone-100">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                    Key Features (Bullet Points)
                  </label>
                  <p className="text-[11px] text-stone-400">
                    Displayed on storefront under the "Key Features" tab.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleAddFeature('')}
                  className="px-3 py-1.5 text-xs font-bold text-[#0A261C] bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#18523D]" />
                  Add Bullet Point
                </button>
              </div>

              <div className="space-y-2">
                {(formData.features || []).map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0 border border-emerald-200">
                      {fIdx + 1}
                    </span>
                    <input
                      type="text"
                      value={feat}
                      onChange={(e) => handleFeatureChange(fIdx, e.target.value)}
                      placeholder="e.g. Scalloped lace trims along sleeves and neckline"
                      className="flex-1 px-3.5 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C] text-stone-800"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(fIdx)}
                      className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Remove feature"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Quick suggestions presets */}
              <div className="pt-1">
                <span className="text-[11px] text-stone-400 block mb-1.5 font-medium">Quick Suggestions (Click to Add):</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Pure Mulmul Cotton Breathable Lining',
                    'Handcrafted Zari & Dabka Embroidery Yoke',
                    'Includes Coordinated Trousers & Silk Dupatta',
                    'Artisanal Scalloped Hemline Finishing',
                    'Tailored Fit with Adjustable Concealed Zippers',
                    'Authentic Handloom Certified Weave',
                  ].map((suggestion) => (
                    <button
                      type="button"
                      key={suggestion}
                      onClick={() => handleAddFeature(suggestion)}
                      className="text-[11px] px-2.5 py-1 bg-stone-50 hover:bg-emerald-50 hover:text-emerald-900 hover:border-emerald-200 text-stone-600 rounded-lg border border-stone-200 transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3 text-[#18523D]" />
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sizes Selection Chips */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                Available Sizes
              </label>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((sz) => {
                  const isChecked = formData.sizes.includes(sz);
                  return (
                    <button
                      type="button"
                      key={sz}
                      onClick={() => toggleSize(sz)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        isChecked
                          ? 'bg-[#0A261C] text-[#F7E7BE] border-[#0A261C] shadow-xs'
                          : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Media Gallery & Publication Status */}
        <div className="lg:col-span-4 space-y-6">
          {/* Home Page Merchandising & Showcase Badges */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
              <h3 className="font-serif text-base font-bold text-stone-900 flex items-center gap-2">
                <Crown className="w-4 h-4 text-[#D4AF37]" />
                Storefront Showcases
              </h3>
              <span className="text-[10px] font-bold text-[#A37F15] bg-[#F7E7BE]/40 px-2 py-0.5 rounded border border-[#D4AF37]/30 uppercase tracking-wider">
                Home Page
              </span>
            </div>
            
            <p className="text-[11px] text-stone-500">
              Select which showcase sections on the Home Page will display this product.
            </p>

            <div className="space-y-3">
              {/* Checkbox 1: Featured Collection */}
              <label
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  formData.isFeatured
                    ? 'bg-[#0A261C]/5 border-[#0A261C] shadow-2xs'
                    : 'border-stone-200 hover:bg-stone-50/80'
                }`}
              >
                <div className="pt-0.5">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={Boolean(formData.isFeatured)}
                    onChange={handleChange}
                    className="w-4 h-4 rounded text-[#0A261C] focus:ring-[#0A261C] border-stone-300 accent-[#0A261C] cursor-pointer"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900">
                      Featured Collection
                    </span>
                    {formData.isFeatured && (
                      <span className="text-[9px] font-bold uppercase tracking-wider bg-[#18523D] text-[#F7E7BE] px-2 py-0.5 rounded-full">
                        Live on Home
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                    Display this product inside the "Featured Collection" grid on the home page.
                  </p>
                </div>
              </label>

              {/* Checkbox 2: Best Seller */}
              <label
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  formData.isBestSeller
                    ? 'bg-[#0A261C]/5 border-[#0A261C] shadow-2xs'
                    : 'border-stone-200 hover:bg-stone-50/80'
                }`}
              >
                <div className="pt-0.5">
                  <input
                    type="checkbox"
                    name="isBestSeller"
                    checked={Boolean(formData.isBestSeller)}
                    onChange={handleChange}
                    className="w-4 h-4 rounded text-[#0A261C] focus:ring-[#0A261C] border-stone-300 accent-[#0A261C] cursor-pointer"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900">
                      Royal Best Seller
                    </span>
                    {formData.isBestSeller && (
                      <span className="text-[9px] font-bold uppercase tracking-wider bg-[#09231A] text-[#F7E7BE] px-2 py-0.5 rounded-full border border-[#D4AF37]/40">
                        Live on Home
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                    Feature this product inside the "Best Seller" section on the home page with a luxury badge.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Status Panel */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
            <h3 className="font-serif text-base font-bold text-stone-900 border-b border-stone-100 pb-2.5">
              Publication Status
            </h3>

            <div className="space-y-2">
              {['Active', 'Draft', 'Low Stock', 'Out of Stock', 'Coming Soon'].map((st) => (
                <label
                  key={st}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    formData.status === st
                      ? 'bg-[#0A261C]/5 border-[#0A261C] text-[#0A261C] font-bold'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <span className="text-xs">{st}</span>
                  <input
                    type="radio"
                    name="status"
                    value={st}
                    checked={formData.status === st}
                    onChange={handleChange}
                    className="text-[#0A261C] focus:ring-[#0A261C]"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Simplified & Clean Product Photos Manager */}
          <ProductMediaUpload
            coverImage={formData.cardImage || formData.coverImage}
            onCoverChange={(newCoverUrl) => {
              setFormData((prev) => {
                let nextImgs = Array.isArray(prev.images) ? [...prev.images] : [];
                if (newCoverUrl && !nextImgs.includes(newCoverUrl)) {
                  nextImgs = [newCoverUrl, ...nextImgs];
                }
                return {
                  ...prev,
                  cardImage: newCoverUrl,
                  coverImage: newCoverUrl,
                  images: nextImgs,
                };
              });
            }}
            galleryImages={formData.images || []}
            onGalleryChange={(nextImgs) => {
              setFormData((prev) => {
                let nextCover = prev.cardImage;
                if (!nextCover && nextImgs.length > 0) {
                  nextCover = nextImgs[0];
                }
                return {
                  ...prev,
                  images: nextImgs,
                  cardImage: nextCover,
                  coverImage: nextCover,
                };
              });
            }}
          />
        </div>
      </form>
    </div>
  );
};
