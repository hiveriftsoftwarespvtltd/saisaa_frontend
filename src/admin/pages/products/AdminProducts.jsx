import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Star, ExternalLink, RefreshCw, AlertTriangle, PackageOpen } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

export const AdminProducts = () => {
  const { products, deleteProduct, isLoadingProducts, productError, refreshProducts } = useAdmin();
  const navigate = useNavigate();

  const [productToDelete, setProductToDelete] = useState(null);

  // Filters setup for universal DataTable
  const filterConfig = [
    {
      key: 'category',
      label: 'Category',
      options: [
        { value: 'Stitched Suits', label: 'Stitched Suits' },
        { value: 'Unstitched Suits', label: 'Unstitched Suits' },
        { value: 'Sarees', label: 'Sarees' },
      ],
      matcher: (rowVal, filterVal) => {
        const r = String(rowVal || '').toLowerCase().replace(/[-_]+/g, ' ').trim();
        const f = String(filterVal || '').toLowerCase().replace(/[-_]+/g, ' ').trim();
        if (f === 'stitched suits') {
          return r === 'stitched suits' || r === 'stitched-suits' || r === 'suits';
        }
        if (f === 'unstitched suits') {
          return r === 'unstitched suits' || r === 'unstitched-suits';
        }
        if (f === 'sarees') {
          return r === 'sarees' || r === 'saree';
        }
        return r === f || r.replace(/\s+/g, '') === f.replace(/\s+/g, '');
      },
    },
    {
      key: 'subCategory',
      label: 'Sub-Category',
      options: [
        { value: '3 pcs set', label: '3 pcs set' },
        { value: '2 pcs set', label: '2 pcs set' },
        { value: 'long kurtis', label: 'long kurtis' },
        { value: 'Short kurtis', label: 'Short kurtis' },
        { value: 'Jamdani', label: 'Jamdani' },
        { value: 'Banarasi silk', label: 'Banarasi silk' },
        { value: 'Kanjivaram silk', label: 'Kanjivaram silk' },
        { value: 'Pure cotton', label: 'Pure cotton' },
        { value: 'Muslin silk', label: 'Muslin silk' },
        { value: 'Linen fabric', label: 'Linen fabric' },
        { value: 'Cotton sarees', label: 'Cotton sarees' },
        { value: 'Chiffon sarees', label: 'Chiffon sarees' },
        { value: 'Silk sarees', label: 'Silk sarees' },
        { value: 'Kota sarees', label: 'Kota sarees' },
      ],
      matcher: (rowVal, filterVal) => {
        const r = String(rowVal || '').toLowerCase().replace(/[-_\s]+/g, '');
        const f = String(filterVal || '').toLowerCase().replace(/[-_\s]+/g, '');
        return r === f;
      },
    },
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'Active', label: 'Active' },
        { value: 'Low Stock', label: 'Low Stock' },
        { value: 'Out of Stock', label: 'Out of Stock' },
        { value: 'Draft', label: 'Draft' },
      ],
    },
  ];

  // Universal DataTable Columns
  const columns = [
    {
      key: 'images',
      label: 'Image',
      render: (imgs, row) => (
        <div className="w-12 h-14 rounded-lg bg-stone-100 overflow-hidden border border-stone-200 shrink-0">
          <img
            src={row.cardImage || row.coverImage || imgs?.[0] || '/images/05_shop_product_card_1.jpg'}
            alt={row.name}
            className="w-full h-full object-cover"
          />
        </div>
      ),
    },
    {
      key: 'name',
      label: 'Product',
      sortable: true,
      render: (name, row) => (
        <div>
          <h4 className="font-serif text-xs font-bold text-stone-900 line-clamp-1 hover:text-[#0A261C]">
            {name}
          </h4>
          <span className="font-mono text-[10px] text-stone-400 block">{row.sku}</span>
          <div className="flex flex-wrap items-center gap-1 mt-1">
            {row.isFeatured && (
              <span className="inline-flex items-center text-[9px] font-bold bg-[#18523D]/10 text-[#18523D] border border-[#18523D]/25 px-1.5 py-0.5 rounded">
                ✦ Featured
              </span>
            )}
            {row.isBestSeller && (
              <span className="inline-flex items-center text-[9px] font-bold bg-[#09231A] text-[#F7E7BE] border border-[#D4AF37]/40 px-1.5 py-0.5 rounded">
                ★ Best Seller
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category & Sub-Cat',
      sortable: true,
      render: (cat, row) => {
        const formattedCat =
          cat === 'stitched-suits' || cat === 'stitched suits'
            ? 'Stitched Suits'
            : cat === 'unstitched-suits' || cat === 'unstitched suits'
            ? 'Unstitched Suits'
            : cat === 'sarees'
            ? 'Sarees'
            : cat;

        return (
          <div className="space-y-1">
            <span className="font-bold text-stone-900 block text-xs">{formattedCat}</span>
            {row.subCategory ? (
              <span className="inline-block text-[10px] font-medium bg-[#0A261C]/5 text-[#0A261C] border border-[#0A261C]/15 px-2 py-0.5 rounded-md truncate max-w-[130px]">
                {row.subCategory}
              </span>
            ) : (
              <span className="text-[10px] text-stone-400 italic">None</span>
            )}
          </div>
        );
      },
    },
    {
      key: 'price',
      label: 'Price',
      sortable: true,
      render: (price, row) => {
        const hasVariants = Array.isArray(row.sizeVariants) && row.sizeVariants.length > 0;
        const prices = hasVariants
          ? row.sizeVariants.map((v) => Number(v.price)).filter((p) => !isNaN(p))
          : [];
        const minPrice = prices.length > 0 ? Math.min(...prices) : price;
        const maxPrice = prices.length > 0 ? Math.max(...prices) : price;

        return (
          <div>
            <span className="font-bold text-stone-900 block">
              {minPrice !== maxPrice
                ? `₹${minPrice?.toLocaleString('en-IN')} - ₹${maxPrice?.toLocaleString('en-IN')}`
                : `₹${price?.toLocaleString('en-IN')}`}
            </span>
            {hasVariants && (
              <span className="inline-block text-[9px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 mt-0.5">
                {row.sizeVariants.length} Size Prices
              </span>
            )}
            {row.originalPrice && !hasVariants && (
              <span className="text-[10px] text-stone-400 line-through block">
                ₹{row.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: 'stock',
      label: 'Stock',
      sortable: true,
      render: (stock, row) => (
        <div>
          <span
            className={`font-mono font-bold text-xs ${
              stock === 0
                ? 'text-rose-600'
                : stock <= (row.lowStockThreshold || 5)
                ? 'text-amber-600'
                : 'text-stone-800'
            }`}
          >
            {stock} units
          </span>
          <span className="text-[10px] text-stone-400 block">
            Min: {row.lowStockThreshold || 5}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (status) => <StatusBadge status={status} />,
    },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      render: (rating, row) => (
        <div className="flex items-center gap-1 text-[#D4AF37]">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span className="font-semibold text-stone-800 text-xs">{rating}</span>
          <span className="text-stone-400 text-[10px]">({row.reviewCount || 0})</span>
        </div>
      ),
    },
    {
      key: 'created',
      label: 'Created',
      sortable: true,
      render: (created) => <span className="text-stone-500 text-xs">{created}</span>,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-1.5">
          <Link
            to={`/product/${row.id}`}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
            title="View in Customer Store"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => navigate(`/admin/products/${row.id}`)}
            className="p-1.5 text-stone-400 hover:text-[#0A261C] hover:bg-stone-100 rounded-lg transition-colors"
            title="Edit Product"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setProductToDelete(row)}
            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete Product"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <PageHeader
        title="Creations & Products"
        subtitle={`Managing ${products.length} luxury apparel items across unstitched suits, sarees, and kurtis.`}
        breadcrumbs={[{ label: 'Catalog', path: '/admin/products' }, { label: 'Products' }]}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={refreshProducts}
              disabled={isLoadingProducts}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white border border-stone-200 hover:border-stone-300 text-stone-700 rounded-xl text-xs font-semibold shadow-2xs transition-all disabled:opacity-60 cursor-pointer"
              title="Refresh Products from API"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingProducts ? 'animate-spin text-[#0A261C]' : ''}`} />
              <span className="hidden sm:inline">{isLoadingProducts ? 'Checking...' : 'Refresh'}</span>
            </button>
            <Link
              to="/admin/products/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0A261C] hover:bg-[#123D2E] text-[#F7E7BE] rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 text-[#D4AF37]" />
              <span>Add New Product</span>
            </Link>
          </div>
        }
      />

      {/* 1. Loading State */}
      {isLoadingProducts && products.length === 0 && (
        <div className="bg-white rounded-2xl border border-stone-200/80 p-12 text-center shadow-xs">
          <div className="flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-8 h-8 text-[#0A261C] animate-spin" />
            <h4 className="font-serif text-sm font-bold text-stone-800">
              Fetching Live Products...
            </h4>
            <p className="text-xs text-stone-400">
              Connecting to SAISAA database...
            </p>
          </div>
        </div>
      )}

      {/* 2. Error State (Server Down / 502 / Connection Refused) */}
      {!isLoadingProducts && productError && products.length === 0 && (
        <div className="bg-white rounded-2xl border border-rose-200 p-8 sm:p-12 text-center shadow-xs space-y-4">
          <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Unable to Load Products from Database
            </h3>
            <p className="text-xs font-mono text-rose-700 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
              {productError}
            </p>
            <p className="text-xs text-stone-500 pt-2 leading-relaxed">
              Backend server respond nahi kar raha (502 Bad Gateway / Network Error). Kripya check karein ki NestJS server port 6001 par running hai ya nahi.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={refreshProducts}
              disabled={isLoadingProducts}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0A261C] hover:bg-[#123D2E] text-[#F7E7BE] text-xs font-bold rounded-xl shadow transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingProducts ? 'animate-spin' : ''}`} />
              <span>Retry Fetching Products</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Empty State (Database is Online but has 0 products) */}
      {!isLoadingProducts && !productError && products.length === 0 && (
        <div className="bg-white rounded-2xl border border-stone-200 p-10 sm:p-14 text-center shadow-xs space-y-4">
          <div className="w-14 h-14 rounded-full bg-amber-50 text-[#D4AF37] flex items-center justify-center mx-auto border border-amber-200">
            <PackageOpen className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="font-serif text-lg font-bold text-stone-900">
              No Products in Database
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Database connected hai lekin abhi koi product available nahi hai. Naya product add karne ke liye niche button par click karein.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/admin/products/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0A261C] hover:bg-[#123D2E] text-[#F7E7BE] text-xs font-bold rounded-xl shadow transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 text-[#D4AF37]" />
              <span>Add First Product</span>
            </Link>
          </div>
        </div>
      )}

      {/* 4. Real Products Table */}
      {products.length > 0 && (
        <DataTable
          columns={columns}
          data={products}
          searchKeys={['name', 'sku', 'category', 'subCategory', 'fabric', 'color']}
          filters={filterConfig}
          pageSize={10}
          selectable={true}
          onBulkDelete={(ids) => {
            ids.forEach((id) => deleteProduct(id));
          }}
          emptyMessage="No products match the selected category or search filters."
        />
      )}

      {/* Confirm Deletion Dialog */}
      <ConfirmDialog
        isOpen={Boolean(productToDelete)}
        onClose={() => setProductToDelete(null)}
        onConfirm={() => productToDelete && deleteProduct(productToDelete.id)}
        title="Delete Royal Product"
        message={`Are you sure you want to delete "${productToDelete?.name}" (${productToDelete?.sku})? This product will immediately be removed from both the storefront catalogue and inventory reports.`}
      />
    </div>
  );
};
