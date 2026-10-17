import React, { useState } from 'react';
import { Plus, Edit, Trash2, Tag, Layers, Check } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { AdminModal } from '../../components/common/AdminModal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { ImageUpload } from '../../components/common/ImageUpload';

const formatLiveSlug = (text = '') =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');

const slugify = (text = '') =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

const getSubCategoryName = (sub) => {
  if (!sub) return '';
  if (typeof sub === 'string') return sub;
  return sub.name || '';
};

export const AdminCategories = () => {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useAdmin();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isSlugManual, setIsSlugManual] = useState(false);

  const [formState, setFormState] = useState({
    name: '',
    slug: '',
    description: '',
    status: 'Active',
    image: '',
    subCategories: [],
  });

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setIsSlugManual(false);
    setFormState({
      name: '',
      slug: '',
      description: '',
      status: 'Active',
      image: '',
      subCategories: [],
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setIsSlugManual(false);
    setFormState({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      status: cat.status || 'Active',
      image: cat.image || '',
      subCategories: cat.subCategories ? [...cat.subCategories] : [],
    });
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formState.name.trim()) return;

    const finalSlug = formState.slug?.trim()
      ? slugify(formState.slug)
      : slugify(formState.name);

    const payload = {
      ...formState,
      name: formState.name.trim(),
      slug: finalSlug,
    };

    if (editingCategory) {
      updateCategory(editingCategory.id, payload);
    } else {
      addCategory(payload);
    }
    setModalOpen(false);
  };

  const columns = [
    {
      key: 'image',
      label: 'Image',
      render: (img, row) => (
        <div className="w-12 h-12 rounded-xl overflow-hidden border border-stone-200 bg-stone-100 shrink-0">
          <img
            src={img || '/images/hero-model.jpg'}
            alt={row.name}
            className="w-full h-full object-cover"
          />
        </div>
      ),
    },
    {
      key: 'name',
      label: 'Category Name',
      sortable: true,
      render: (name, row) => (
        <div>
          <h4 className="font-serif text-xs font-bold text-stone-900">{name}</h4>
          <p className="text-[10px] text-stone-400 line-clamp-1 max-w-xs">{row.description}</p>
        </div>
      ),
    },
    {
      key: 'slug',
      label: 'URL Slug',
      sortable: true,
      render: (slug) => (
        <span className="font-mono text-xs text-[#0A261C] bg-stone-100 px-2 py-0.5 rounded font-semibold">
          /{slug}
        </span>
      ),
    },
    {
      key: 'subCategories',
      label: 'Sub-Categories',
      render: (subs) => (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {subs && subs.length > 0 ? (
            <>
              {subs.slice(0, 3).map((s, idx) => {
                const sName = getSubCategoryName(s);
                return (
                  <span
                    key={idx}
                    className="inline-flex items-center text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md font-medium border border-stone-200"
                  >
                    {sName}
                  </span>
                );
              })}
              {subs.length > 3 && (
                <span className="text-[10px] bg-[#0A261C]/5 text-[#0A261C] px-1.5 py-0.5 rounded-md font-bold">
                  +{subs.length - 3} more
                </span>
              )}
            </>
          ) : (
            <span className="text-[10px] text-stone-400 italic">None defined</span>
          )}
        </div>
      ),
    },
    {
      key: 'productsCount',
      label: 'Products Count',
      sortable: true,
      render: (cnt) => (
        <span className="font-mono font-bold text-xs text-stone-800">{cnt} items</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (status) => <StatusBadge status={status} />,
    },
    {
      key: 'createdDate',
      label: 'Created Date',
      sortable: true,
      render: (dt) => <span className="text-stone-500 text-xs">{dt}</span>,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 text-stone-400 hover:text-[#0A261C] hover:bg-stone-100 rounded-lg transition-colors"
            title="Edit Category & Sub-Categories"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setCategoryToDelete(row)}
            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete Category"
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
        title="Apparel Categories & Sub-Categories"
        subtitle={`Managing luxury taxonomy tiers: Suits, Kurtis, Sarees, and their corresponding artisanal cuts.`}
        breadcrumbs={[{ label: 'Catalog', path: '/admin/products' }, { label: 'Categories' }]}
        actions={
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0A261C] hover:bg-[#123D2E] text-[#F7E7BE] rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#D4AF37]" />
            <span>Add Category</span>
          </button>
        }
      />

      {/* Universal DataTable */}
      <DataTable
        columns={columns}
        data={categories}
        searchKeys={['name', 'slug', 'description']}
        pageSize={10}
        emptyMessage="No categories found matching your query."
      />

      {/* Visual Category & Sub-Categories Hierarchy Cards */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#D4AF37]" />
          <h3 className="font-serif text-sm font-bold text-stone-900 uppercase tracking-wider">
            Category & Sub-Category Architecture
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const catProds = products?.filter(
              (p) =>
                p.category?.toLowerCase() === cat.name?.toLowerCase() ||
                p.category?.toLowerCase() === cat.slug?.toLowerCase()
            ) || [];

            return (
              <div
                key={cat.id}
                className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-stone-200 bg-stone-100 shrink-0">
                      <img
                        src={cat.image || '/images/hero-model.jpg'}
                        alt={cat.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-serif text-sm font-bold text-stone-900 truncate">
                          {cat.name}
                        </h4>
                        <span className="font-mono text-[10px] text-stone-400">/{cat.slug}</span>
                      </div>
                      <p className="text-[10px] text-stone-500 line-clamp-1">{cat.description}</p>
                    </div>
                  </div>

                  {/* Sub-Categories Pills Grid */}
                  <div className="pt-3 space-y-2">
                    <div className="flex items-center justify-between text-xs text-stone-500">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                        Sub-Categories ({cat.subCategories?.length || 0})
                      </span>
                      <span className="text-[10px] font-semibold text-[#0A261C]">
                        {catProds.length} Products Linked
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {cat.subCategories && cat.subCategories.length > 0 ? (
                        cat.subCategories.map((sub, sIdx) => {
                          const subName = getSubCategoryName(sub);
                          const count = catProds.filter(
                            (p) =>
                              p.subCategory?.toLowerCase() === subName.toLowerCase() ||
                              p.subCategory === subName
                          ).length;
                          return (
                            <span
                              key={sIdx}
                              className="inline-flex items-center gap-1.5 text-xs bg-stone-50 text-stone-700 border border-stone-200 px-2.5 py-1 rounded-lg font-medium"
                            >
                              <span>{subName}</span>
                              {count > 0 && (
                                <span className="text-[9px] bg-[#0A261C] text-[#F7E7BE] px-1.5 py-0.2 rounded-full font-bold">
                                  {count}
                                </span>
                              )}
                            </span>
                          );
                        })
                      ) : (
                        <p className="text-xs text-stone-400 italic">
                          No sub-categories assigned yet. Click edit below to add.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400">
                    Live Route: <code className="text-[#0A261C] font-mono">/{cat.slug}</code>
                  </span>
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="text-xs text-[#18523D] hover:underline font-bold flex items-center gap-1"
                  >
                    <Edit className="w-3 h-3" />
                    <span>Manage Cuts</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCategory ? `Edit Category: ${editingCategory.name}` : 'Create New Category'}
        subtitle="Configure primary category tier details and luxury showcase photo."
        footer={
          <>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-stone-600 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#0A261C] bg-[#D4AF37] hover:bg-[#E5C786] rounded-xl shadow-sm transition-colors"
            >
              {editingCategory ? 'Save Changes' : 'Create Category'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Category Name *
            </label>
            <input
              type="text"
              value={formState.name}
              onChange={(e) => {
                const name = e.target.value;
                setFormState((prev) => ({
                  ...prev,
                  name,
                  slug: isSlugManual ? prev.slug : formatLiveSlug(name),
                }));
              }}
              required
              placeholder="e.g. Suits"
              className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                  URL Slug *
                </label>
                {isSlugManual && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsSlugManual(false);
                      setFormState((prev) => ({
                        ...prev,
                        slug: formatLiveSlug(prev.name),
                      }));
                    }}
                    className="text-[10px] text-[#18523D] hover:underline font-semibold cursor-pointer"
                  >
                    ↺ Sync with Name
                  </button>
                )}
              </div>
              <input
                type="text"
                value={formState.slug}
                onChange={(e) => {
                  setIsSlugManual(true);
                  setFormState((prev) => ({
                    ...prev,
                    slug: formatLiveSlug(e.target.value),
                  }));
                }}
                required
                placeholder="suits"
                className="w-full px-3.5 py-2 text-xs font-mono bg-white rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C]"
              />
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
                className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C]"
              >
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={formState.description}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Summary of fabrics and styles included in this tier..."
              className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C]"
            />
          </div>

          <ImageUpload
            label="Category Cover Photo"
            value={formState.image}
            onChange={(url) => setFormState((prev) => ({ ...prev, image: url }))}
            aspectRatio="aspect-[4/3]"
          />
        </form>
      </AdminModal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(categoryToDelete)}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={() => categoryToDelete && deleteCategory(categoryToDelete.id)}
        title="Delete Category Tier"
        message={`Are you sure you want to delete category "${categoryToDelete?.name}"?`}
      />
    </div>
  );
};
