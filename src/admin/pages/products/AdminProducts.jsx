import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Star, ExternalLink } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

export const AdminProducts = () => {
  const { products, deleteProduct } = useAdmin();
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
      render: (cat, row) => (
        <div className="space-y-1">
          <span className="font-bold text-stone-900 block text-xs">{cat}</span>
          {row.subCategory ? (
            <span className="inline-block text-[10px] font-medium bg-[#0A261C]/5 text-[#0A261C] border border-[#0A261C]/15 px-2 py-0.5 rounded-md truncate max-w-[130px]">
              {row.subCategory}
            </span>
          ) : (
            <span className="text-[10px] text-stone-400 italic">None</span>
          )}
        </div>
      ),
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
          <Link
            to="/admin/products/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0A261C] hover:bg-[#123D2E] text-[#F7E7BE] rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 text-[#D4AF37]" />
            <span>Add New Product</span>
          </Link>
        }
      />

      {/* Universal DataTable instance */}
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
