import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Printer,
  MapPin,
  Mail,
  Phone,
  CheckCircle2,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';

export const AdminOrderDetails = () => {
  const { id } = useParams();
  const { orders, updateOrderStatus } = useAdmin();

  const order = orders.find((o) => o.id === id) || orders[0];

  const handleStatusChange = (newStatus) => {
    updateOrderStatus(order.id, newStatus);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!order) {
    return (
      <div className="py-16 text-center space-y-4">
        <p className="text-sm text-stone-500">Order not found.</p>
        <Link to="/admin/orders" className="text-xs text-[#0A261C] underline font-bold">
          &larr; Return to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      <PageHeader
        title={`Order #${order.id}`}
        subtitle={`Placed by ${order.customer.name} on ${order.date}`}
        breadcrumbs={[
          { label: 'Sales', path: '/admin/orders' },
          { label: 'Orders', path: '/admin/orders' },
          { label: `#${order.id}` },
        ]}
        actions={
          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-700 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-stone-500" />
              <span>Print Invoice</span>
            </button>
            <Link
              to="/admin/orders"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-600 bg-white border border-stone-200 rounded-xl hover:text-stone-900 shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Orders</span>
            </Link>
          </div>
        }
      />

      {/* Status Bar Changer */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Current Fulfillment Stage:
          </span>
          <StatusBadge status={order.orderStatus} className="text-xs py-1 px-3" />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500 font-medium">Update Stage:</span>
          <select
            value={order.orderStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="text-xs font-bold bg-[#0A261C] text-[#F7E7BE] border border-[#D4AF37]/40 rounded-xl px-3.5 py-2 focus:outline-none cursor-pointer shadow-sm"
          >
            {['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'].map(
              (st) => (
                <option key={st} value={st} className="bg-white text-stone-900 font-medium">
                  {st}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Line items, timeline, summary */}
        <div className="lg:col-span-8 space-y-6">
          {/* Order Items List */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
            <h3 className="font-serif text-base font-bold text-stone-900 border-b border-stone-100 pb-3">
              Ordered Creations ({order.items.length})
            </h3>

            <div className="divide-y divide-stone-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image || '/images/hero-model.jpg'}
                      alt={item.name}
                      className="w-16 h-20 rounded-xl object-cover border border-stone-200 shrink-0"
                    />
                    <div>
                      <h4 className="font-serif text-sm font-bold text-stone-900">
                        {item.name}
                      </h4>
                      <p className="text-xs text-stone-400 mt-0.5">
                        Size: <strong className="text-stone-700">{item.size || 'Standard'}</strong> &bull; Qty: <strong className="text-stone-700">{item.quantity}</strong>
                      </p>
                      <p className="text-xs font-semibold text-[#0A261C] mt-1">
                        ₹{item.price.toLocaleString('en-IN')} each
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-sm text-stone-900">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="pt-4 border-t border-stone-200 space-y-2 max-w-xs ml-auto text-xs">
              <div className="flex justify-between text-stone-500">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-800">
                  ₹{order.subtotal?.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Promo Discount</span>
                <span className="font-semibold">
                  -₹{order.discount?.toLocaleString('en-IN') || 0}
                </span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Royal Express Shipping</span>
                <span className="font-semibold text-stone-800">
                  {order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}
                </span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>GST / Taxes</span>
                <span className="font-semibold text-stone-800">Inclusive</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                <span>Grand Total</span>
                <span className="text-[#0A261C]">
                  ₹{order.grandTotal?.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
            <h3 className="font-serif text-base font-bold text-stone-900 border-b border-stone-100 pb-3">
              Fulfillment Journey & Parcel Tracking
            </h3>

            <div className="space-y-4 pt-2">
              {order.timeline?.map((step, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        step.done
                          ? 'bg-[#0A261C] text-[#F7E7BE]'
                          : 'bg-stone-100 text-stone-400 border border-stone-300'
                      }`}
                    >
                      {step.done ? <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" /> : idx + 1}
                    </div>
                    {idx < order.timeline.length - 1 && (
                      <div
                        className={`w-0.5 h-8 my-1 ${
                          step.done ? 'bg-[#0A261C]' : 'bg-stone-200'
                        }`}
                      />
                    )}
                  </div>

                  <div className="flex-1 pb-4">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${step.done ? 'text-stone-900' : 'text-stone-400'}`}>
                        {step.status}
                      </span>
                      <span className="text-[11px] text-stone-400 font-mono">
                        {step.date}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Customer Coordinates, Address, Payment */}
        <div className="lg:col-span-4 space-y-6">
          {/* Customer Card */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
            <h3 className="font-serif text-base font-bold text-stone-900 border-b border-stone-100 pb-2.5">
              Patron Profile
            </h3>

            <div className="space-y-3 text-xs">
              <p className="font-bold text-sm text-stone-900">{order.customer.name}</p>

              <div className="flex items-center gap-2 text-stone-600">
                <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span className="truncate">{order.customer.email}</span>
              </div>

              <div className="flex items-center gap-2 text-stone-600">
                <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span>{order.customer.phone}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
            <h3 className="font-serif text-base font-bold text-stone-900 border-b border-stone-100 pb-2.5">
              Shipping Destination
            </h3>

            <div className="flex items-start gap-3 text-xs text-stone-600 leading-relaxed">
              <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <span>{order.customer.address}</span>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
            <h3 className="font-serif text-base font-bold text-stone-900 border-b border-stone-100 pb-2.5">
              Settlement Coordinates
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-stone-500">Method</span>
                <span className="font-bold text-stone-800">{order.paymentMethod}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-stone-500">Transaction ID</span>
                <span className="font-mono text-[11px] text-stone-700">{order.transactionId}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-stone-500">Status</span>
                <StatusBadge status={order.paymentStatus} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
