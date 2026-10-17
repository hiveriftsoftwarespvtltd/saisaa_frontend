import React, { useState } from 'react';
import { Star, Check, X, Trash2, Eye } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { AdminModal } from '../../components/common/AdminModal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

export const AdminReviews = () => {
  const { reviews, updateReviewStatus, deleteReview } = useAdmin();

  const [inspectReview, setInspectReview] = useState(null);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  const filterConfig = [
    {
      key: 'status',
      label: 'Moderation Status',
      options: [
        { value: 'Approved', label: 'Approved' },
        { value: 'Pending', label: 'Pending' },
        { value: 'Rejected', label: 'Rejected' },
      ],
    },
  ];

  const columns = [
    {
      key: 'productName',
      label: 'Product Creation',
      sortable: true,
      render: (pName, row) => (
        <div className="flex items-center gap-2.5">
          {row.productImage && (
            <img
              src={row.productImage}
              alt=""
              className="w-10 h-12 rounded-lg object-cover border border-stone-200 shrink-0"
            />
          )}
          <span className="font-serif text-xs font-bold text-stone-900 line-clamp-1 max-w-[150px]">
            {pName}
          </span>
        </div>
      ),
    },
    {
      key: 'customer',
      label: 'Reviewer',
      sortable: true,
      render: (cust) => <span className="font-semibold text-xs text-stone-800">{cust}</span>,
    },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      render: (rating) => (
        <div className="flex items-center gap-1 text-[#D4AF37]">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                i < rating ? 'fill-current text-[#D4AF37]' : 'text-stone-300'
              }`}
            />
          ))}
          <span className="font-bold text-xs text-stone-800 ml-1">{rating}.0</span>
        </div>
      ),
    },
    {
      key: 'review',
      label: 'Feedback Commentary',
      render: (text) => (
        <p className="text-xs text-stone-600 line-clamp-2 max-w-sm italic">
          "{text}"
        </p>
      ),
    },
    {
      key: 'date',
      label: 'Submitted Date',
      sortable: true,
      render: (dt) => <span className="text-xs text-stone-500">{dt}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (status) => <StatusBadge status={status} />,
    },
    {
      key: 'actions',
      label: 'Moderation Actions',
      render: (_, row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setInspectReview(row)}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
            title="Read Full Review"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          {row.status !== 'Approved' && (
            <button
              onClick={() => updateReviewStatus(row.id || row._id, 'Approved')}
              className="p-1.5 text-stone-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
              title="Approve & Publish to Store"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          )}
          {row.status !== 'Rejected' && (
            <button
              onClick={() => updateReviewStatus(row.id || row._id, 'Rejected')}
              className="p-1.5 text-stone-400 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
              title="Reject Review"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => setReviewToDelete(row)}
            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete Review"
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
        title="Patron Testimonials & Reviews"
        subtitle={`Moderating ${reviews.length} product reviews submitted by verified patrons.`}
        breadcrumbs={[{ label: 'Customers', path: '/admin/customers' }, { label: 'Reviews' }]}
      />

      <DataTable
        columns={columns}
        data={reviews}
        searchKeys={['productName', 'customer', 'review', 'status']}
        filters={filterConfig}
        pageSize={10}
        emptyMessage="No reviews match your moderation filters."
      />

      {/* Inspect Modal */}
      <AdminModal
        isOpen={Boolean(inspectReview)}
        onClose={() => setInspectReview(null)}
        title="Review Inspection"
        subtitle={`Submitted by ${inspectReview?.customer} on ${inspectReview?.date}`}
        maxWidth="max-w-md"
        footer={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setInspectReview(null)}
              className="px-4 py-2 text-xs font-semibold text-stone-600 bg-white border border-stone-200 rounded-xl"
            >
              Close
            </button>
            {inspectReview?.status !== 'Approved' && (
              <button
                onClick={() => {
                  updateReviewStatus(inspectReview.id || inspectReview._id, 'Approved');
                  setInspectReview(null);
                }}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl"
              >
                Approve & Publish
              </button>
            )}
          </div>
        }
      >
        <div className="space-y-4 py-1">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF9F5] border border-stone-200">
            {inspectReview?.productImage && (
              <img
                src={inspectReview.productImage}
                alt=""
                className="w-12 h-14 rounded-lg object-cover border border-stone-200"
              />
            )}
            <div>
              <h4 className="font-serif text-xs font-bold text-stone-900">
                {inspectReview?.productName}
              </h4>
              <div className="flex items-center gap-1 text-[#D4AF37] mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < (inspectReview?.rating || 0) ? 'fill-current' : 'text-stone-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-stone-200">
            <p className="text-xs text-stone-800 leading-relaxed italic">
              "{inspectReview?.review}"
            </p>
          </div>
        </div>
      </AdminModal>

      {/* Confirm Deletion */}
      <ConfirmDialog
        isOpen={Boolean(reviewToDelete)}
        onClose={() => setReviewToDelete(null)}
        onConfirm={() =>
          reviewToDelete && deleteReview(reviewToDelete.id || reviewToDelete._id)
        }
        title="Delete Review"
        message="Are you sure you want to permanently delete this customer review?"
      />
    </div>
  );
};
