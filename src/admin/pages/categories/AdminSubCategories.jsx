import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Edit,
  Trash2,
  Tag,
  Layers,
  ExternalLink,
  FolderTree,
  Package,
  Scissors,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { AdminModal } from '../../components/common/AdminModal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { ImageUpload } from '../../components/common/ImageUpload';

export const AdminSubCategories = () => {
  const {
    categories,
    products,
    addSubCategory,
    updateSubCategory,
    deleteSubCategory,
  } = useAdmin();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState(null);
  const [subCategoryToDelete, setSubCategoryToDelete] = useState(null);

  const [formState, setFormState] = useState({
    name: '',
    parentCategory: '',
    image: '',
    description: '',
    status: 'Active',
  });

  // Flattened reactive list of all sub-categories across all dynamic categories
  const allSubCategories = useMemo(() => {
    const list = [];
    (categories || []).forEach((cat) => {
      (cat.subCategories || []).forEach((subItem) => {
        const subName = typeof subItem === 'string' ? subItem : subItem?.name;
        if (!subName) return;

        const subImage =
          typeof subItem === 'object' && subItem?.image ? subItem.image : cat.image;
        const subStatus =
          typeof subItem === 'object' && subItem?.status ? subItem.status : 'Active';
        const subDesc =
          typeof subItem === 'object' && subItem?.description ? subItem.description : '';

        const matchingProducts = (products || []).filter(
          (p) =>
            p.subCategory === subName &&
            (p.category?.toLowerCase() === cat.name?.toLowerCase() ||
              p.category?.toLowerCase() === cat.slug?.toLowerCase())
        );

        list.push({
          id: `${cat.slug || 'cat'}-${subName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          name: subName,
          image: subImage,
          status: subStatus,
          description: subDesc,
          parentCategory: cat.name,
          parentCategoryId: cat.id,
          parentCategorySlug: cat.slug,
          parentCategoryImage: cat.image,
          productsCount: matchingProducts.length,
          storefrontUrl: `/${cat.slug || cat.name?.toLowerCase()}?subCategory=${encodeURIComponent(subName)}`,
        });
      });
    });
    return list;
  }, [categories, products]);

  // Filtered by selected category pill tab
  const filteredSubCategories = useMemo(() => {
    if (activeCategoryFilter === 'all') return allSubCategories;
    return allSubCategories.filter(
      (s) =>
        s.parentCategory.toLowerCase() === activeCategoryFilter.toLowerCase() ||
        s.parentCategorySlug?.toLowerCase() === activeCategoryFilter.toLowerCase()
    );
  }, [allSubCategories, activeCategoryFilter]);

  const handleOpenAdd = () => {
    const defaultParent =
      activeCategoryFilter !== 'all'
        ? activeCategoryFilter
        : (categories?.[0]?.name || '');

    setEditingSubCategory(null);
    setFormState({
      name: '',
      parentCategory: defaultParent,
      image: '',
      description: '',
      status: 'Active',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (subRow) => {
    setEditingSubCategory(subRow);
    setFormState({
      name: subRow.name,
      parentCategory: subRow.parentCategory,
      image: subRow.image || '',
      description: subRow.description || '',
      status: subRow.status || 'Active',
    });
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.parentCategory) return;

    const payload = {
      name: formState.name.trim(),
      image: formState.image,
      description: formState.description,
      status: formState.status,
    };

    if (editingSubCategory) {
      updateSubCategory(
        editingSubCategory.parentCategory,
        editingSubCategory.name,
        payload,
        formState.parentCategory
      );
    } else {
      addSubCategory(formState.parentCategory, payload);
    }
    setModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (subCategoryToDelete) {
      deleteSubCategory(
        subCategoryToDelete.parentCategory,
        subCategoryToDelete.name
      );
      setSubCategoryToDelete(null);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Sub-Category / Style Cut',
      sortable: true,
      render: (name, row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg overflow-hidden border border-stone-200 bg-stone-100 flex items-center justify-center text-[#0A261C] shrink-0">
            {row.image ? (
              <img
                src={row.image}
                alt={name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = row.parentCategoryImage || '/images/hero-model.jpg';
                }}
              />
            ) : (
              <Scissors className="w-4 h-4 text-[#D4AF37]" />
            )}
          </div>
          <div>
            <h4 className="font-serif text-xs font-bold text-stone-900">{name}</h4>
            {row.description ? (
              <span className="text-[10px] text-stone-400 block line-clamp-1 max-w-[200px]">
                {row.description}
              </span>
            ) : (
              <span className="font-mono text-[10px] text-stone-400 block">ID: {row.id}</span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'parentCategory',
      label: 'Parent Category',
      sortable: true,
      render: (cat, row) => {
        return (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md overflow-hidden border border-stone-200 shrink-0">
              <img
                src={row.parentCategoryImage || '/images/hero-model.jpg'}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md border bg-stone-50 text-stone-800 border-stone-200">
              {cat}
            </span>
          </div>
        );
      },
    },
    {
      key: 'productsCount',
      label: 'Catalog Products',
      sortable: true,
      render: (cnt) => (
        <div className="flex items-center gap-1.5">
          <Package className="w-3.5 h-3.5 text-stone-400" />
          <span className="font-mono font-bold text-xs text-stone-800">
            {cnt} {cnt === 1 ? 'item' : 'items'}
          </span>
        </div>
      ),
    },
    {
      key: 'storefrontUrl',
      label: 'Storefront Route',
      render: (url) => (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-[#18523D] hover:underline font-semibold bg-stone-50 px-2 py-1 rounded-md border border-stone-200"
        >
          <span className="font-mono text-[11px] truncate max-w-[140px]">{url}</span>
          <ExternalLink className="w-3 h-3 shrink-0" />
        </a>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (status) => <StatusBadge status={status} />,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 text-stone-400 hover:text-[#0A261C] hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            title="Edit Sub-Category"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setSubCategoryToDelete(row)}
            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Delete Sub-Category"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <PageHeader
        title="Sub-Categories & Artisanal Cuts"
        subtitle={`Managing ${allSubCategories.length} specific styling cuts nested under live primary categories.`}
        breadcrumbs={[
          { label: 'Catalog', path: '/admin/products' },
          { label: 'Categories', path: '/admin/categories' },
          { label: 'Sub-Categories' },
        ]}
        actions={
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0A261C] hover:bg-[#123D2E] text-[#F7E7BE] rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#D4AF37]" />
            <span>Add Sub-Category</span>
          </button>
        }
      />

      {/* Dynamic KPI Taxonomy Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveCategoryFilter('all')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeCategoryFilter === 'all'
              ? 'bg-[#0A261C] text-white border-[#0A261C] shadow-md'
              : 'bg-white text-stone-800 border-stone-200/90 hover:border-stone-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-xs uppercase tracking-wider font-semibold ${
                activeCategoryFilter === 'all' ? 'text-[#F7E7BE]' : 'text-stone-400'
              }`}
            >
              Total Cuts
            </span>
            <Tag
              className={`w-4 h-4 ${
                activeCategoryFilter === 'all' ? 'text-[#D4AF37]' : 'text-stone-400'
              }`}
            />
          </div>
          <div className="font-serif text-2xl font-bold mt-2">{allSubCategories.length}</div>
          <p
            className={`text-[10px] mt-1 ${
              activeCategoryFilter === 'all' ? 'text-stone-300' : 'text-stone-400'
            }`}
          >
            Across {categories.length} category tiers
          </p>
        </div>

        {categories.slice(0, 3).map((cat) => {
          const count = allSubCategories.filter(
            (s) =>
              s.parentCategory.toLowerCase() === cat.name?.toLowerCase() ||
              s.parentCategorySlug?.toLowerCase() === cat.slug?.toLowerCase()
          ).length;
          const isSelected =
            activeCategoryFilter.toLowerCase() === cat.name?.toLowerCase() ||
            activeCategoryFilter.toLowerCase() === cat.slug?.toLowerCase();

          return (
            <div
              key={cat.id || cat.slug || cat.name}
              onClick={() => setActiveCategoryFilter(cat.name)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#0A261C] text-white border-[#0A261C] shadow-md'
                  : 'bg-white text-stone-800 border-stone-200/90 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs uppercase tracking-wider font-semibold ${
                    isSelected ? 'text-[#F7E7BE]' : 'text-stone-400'
                  }`}
                >
                  {cat.name} Cuts
                </span>
                <Scissors
                  className={`w-4 h-4 ${
                    isSelected ? 'text-[#D4AF37]' : 'text-stone-400'
                  }`}
                />
              </div>
              <div className="font-serif text-2xl font-bold mt-2">{count}</div>
              <p
                className={`text-[10px] mt-1 ${
                  isSelected ? 'text-stone-300' : 'text-stone-400'
                }`}
              >
                /{cat.slug} category tier
              </p>
            </div>
          );
        })}
      </div>

      {/* Dynamic Category Scope Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider mr-1 shrink-0">
          Filter By Tier:
        </span>
        <button
          onClick={() => setActiveCategoryFilter('all')}
          className={`text-xs px-3.5 py-1.5 rounded-full font-medium transition-all shrink-0 cursor-pointer ${
            activeCategoryFilter === 'all'
              ? 'bg-[#0A261C] text-[#F7E7BE] font-bold shadow-xs'
              : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-300'
          }`}
        >
          All Sub-Categories ({allSubCategories.length})
        </button>
        {(categories || []).map((cat) => {
          const count = allSubCategories.filter(
            (s) =>
              s.parentCategory.toLowerCase() === cat.name?.toLowerCase() ||
              s.parentCategorySlug?.toLowerCase() === cat.slug?.toLowerCase()
          ).length;
          const isSelected =
            activeCategoryFilter.toLowerCase() === cat.name?.toLowerCase() ||
            activeCategoryFilter.toLowerCase() === cat.slug?.toLowerCase();

          return (
            <button
              key={cat.id || cat.slug || cat.name}
              onClick={() => setActiveCategoryFilter(cat.name)}
              className={`text-xs px-3.5 py-1.5 rounded-full font-medium transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-[#0A261C] text-[#F7E7BE] font-bold shadow-xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-300'
              }`}
            >
              <span>{cat.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected
                    ? 'bg-[#D4AF37] text-[#0A261C]'
                    : 'bg-stone-100 text-stone-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Universal DataTable */}
      <DataTable
        columns={columns}
        data={filteredSubCategories}
        searchKeys={['name', 'parentCategory', 'id']}
        pageSize={10}
        emptyMessage="No sub-categories found matching your criteria."
      />

      {/* Add / Edit Sub-Category Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          editingSubCategory
            ? `Edit Sub-Category: ${editingSubCategory.name}`
            : 'Create New Sub-Category'
        }
        subtitle="Define specialized silhouette cuts, karigari needlecraft, and regional weave variants."
        footer={
          <>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-stone-600 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#0A261C] bg-[#D4AF37] hover:bg-[#E5C786] rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              {editingSubCategory ? 'Save Changes' : 'Create Sub-Category'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Sub-Category / Style Cut Name *
            </label>
            <input
              type="text"
              value={formState.name}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, name: e.target.value }))
              }
              required
              placeholder="e.g. Sharara Sets / Awadhi Chikankari"
              className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C] text-stone-800 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Parent Category *
              </label>
              <select
                value={formState.parentCategory}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    parentCategory: e.target.value,
                  }))
                }
                required
                className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C] text-stone-800 font-semibold cursor-pointer"
              >
                <option value="" disabled>
                  -- Select Category --
                </option>
                {(categories || []).map((cat) => (
                  <option key={cat.id || cat.slug || cat.name} value={cat.name}>
                    {cat.name} ({cat.slug})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Status
              </label>
              <select
                value={formState.status}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, status: e.target.value }))
                }
                className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C] text-stone-800"
              >
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Description / Style Notes
            </label>
            <textarea
              rows={2}
              value={formState.description}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="e.g. Flared kalidar panels, hand-embroidered borders, festive ensemble..."
              className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C]"
            />
          </div>

          {/* Sub-Category Photo Upload */}
          <ImageUpload
            label="Sub-Category Photo / Sketch"
            value={formState.image}
            onChange={(url) => setFormState((prev) => ({ ...prev, image: url }))}
            aspectRatio="aspect-[4/3]"
          />

          <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-500 space-y-1">
            <span className="font-semibold text-stone-700 block">
              Classification Note:
            </span>
            <p>
              This sub-category will be available immediately in the storefront filter
              sidebar and in the product add & edit dropdown under{' '}
              <strong>{formState.parentCategory || 'selected category'}</strong>.
            </p>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(subCategoryToDelete)}
        onClose={() => setSubCategoryToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Sub-Category"
        message={`Are you sure you want to remove "${subCategoryToDelete?.name}" from ${subCategoryToDelete?.parentCategory}? Products assigned to this cut may need re-categorization.`}
      />
    </div>
  );
};

export default AdminSubCategories;
