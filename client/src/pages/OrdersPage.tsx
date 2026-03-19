import { useState, useEffect } from 'react';
import { useDashboardStore } from '../store/dashboardStore';
import { CustomerOrder } from '../types';

const INITIAL_ORDER: Omit<CustomerOrder, 'id' | 'createdAt' | 'updatedAt'> = {
  customerId: '',
  customerName: '',
  email: '',
  phone: '',
  address: '',
  orderId: '',
  orderDate: new Date().toISOString().split('T')[0],
  product: '',
  quantity: 1,
  unitPrice: 0,
  totalAmount: 0,
  status: 'Pending',
  createdBy: 'Admin',
};

function OrdersPage() {
  const { orders, ordersLoading, loadOrders, createOrder, deleteOrder } = useDashboardStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(INITIAL_ORDER);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const handleInputChange = (field: string, value: any) => {
    const updated = { ...formData, [field]: value };
    if (field === 'quantity' || field === 'unitPrice') {
      updated.totalAmount = Number(updated.quantity) * Number(updated.unitPrice);
    }
    setFormData(updated);
  };

  const handleSubmit = async () => {
    setFormError('');
    if (!formData.customerId || !formData.customerName || !formData.email || !formData.orderId || !formData.orderDate || !formData.product) {
      setFormError('Please fill in all required fields');
      return;
    }
    setSubmitting(true);
    try {
      await createOrder(formData);
      setShowForm(false);
      setFormData(INITIAL_ORDER);
    } catch (err: any) {
      setFormError(err.message || 'Failed to create order');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    await deleteOrder(id);
    setDeleteConfirm(null);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Customer Orders</h1>
          <p className="text-sm text-gray-500 mt-1">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          id="create-order-btn"
          onClick={() => setShowForm(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-xl text-sm font-medium
            hover:from-brand-400 hover:to-brand-500 transition-all duration-200 shadow-lg shadow-brand-500/25
            hover:shadow-brand-400/30 hover:scale-[1.02] active:scale-[0.98]"
        >
          Create Order
        </button>
      </div>

      {/* Orders Table */}
      {ordersLoading && orders.length === 0 ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex items-center justify-center h-60 border-2 border-dashed border-white/10 rounded-2xl">
          <div className="text-center">
            <p className="text-gray-500 text-sm">No orders yet</p>
            <p className="text-gray-600 text-xs mt-1">Click "Create Order" to add your first order</p>
          </div>
        </div>
      ) : (
        <div className="bg-dark-900/50 rounded-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider bg-brand-500/10">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider bg-brand-500/10">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider bg-brand-500/10">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider bg-brand-500/10">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider bg-brand-500/10">Qty</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider bg-brand-500/10">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider bg-brand-500/10">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider bg-brand-500/10">Date</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider bg-brand-500/10">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 text-gray-300 font-mono text-xs">{order.orderId}</td>
                    <td className="px-4 py-3 text-gray-200">{order.customerName}</td>
                    <td className="px-4 py-3 text-gray-400">{order.email}</td>
                    <td className="px-4 py-3 text-gray-200">{order.product}</td>
                    <td className="px-4 py-3 text-gray-300">{order.quantity}</td>
                    <td className="px-4 py-3 text-brand-400 font-medium">${Number(order.totalAmount).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${order.status === 'Completed' ? 'bg-green-500/10 text-green-400' :
                          order.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-400' :
                            'bg-gray-500/10 text-gray-400'
                        }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">
                      {deleteConfirm === order.id ? (
                        <div className="flex items-center gap-1 justify-end">
                          <button onClick={() => setDeleteConfirm(null)} className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded">Cancel</button>
                          <button onClick={() => handleDelete(order.id!)} className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded hover:bg-red-500/30">Delete</button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(order.id!)}
                          className="text-gray-500 hover:text-red-400 transition-colors p-1 rounded hover:bg-red-500/10"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Order Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-dark-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <h2 className="text-lg font-semibold text-white">Create Order</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-4 space-y-4">
              {formError && (
                <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{formError}</div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Customer ID *" value={formData.customerId} onChange={(v) => handleInputChange('customerId', v)} />
                <FormField label="Customer Name *" value={formData.customerName} onChange={(v) => handleInputChange('customerName', v)} />
                <FormField label="Email *" type="email" value={formData.email} onChange={(v) => handleInputChange('email', v)} />
                <FormField label="Phone" value={formData.phone} onChange={(v) => handleInputChange('phone', v)} />
                <div className="col-span-2">
                  <FormField label="Address" value={formData.address} onChange={(v) => handleInputChange('address', v)} />
                </div>
                <FormField label="Order ID *" value={formData.orderId} onChange={(v) => handleInputChange('orderId', v)} />
                <FormField label="Order Date *" type="date" value={formData.orderDate} onChange={(v) => handleInputChange('orderDate', v)} />
                <FormField label="Product *" value={formData.product} onChange={(v) => handleInputChange('product', v)} />
                <FormField label="Status" value={formData.status} onChange={(v) => handleInputChange('status', v)} />
                <FormField label="Quantity" type="number" value={String(formData.quantity)} onChange={(v) => handleInputChange('quantity', Number(v))} />
                <FormField label="Unit Price" type="number" value={String(formData.unitPrice)} onChange={(v) => handleInputChange('unitPrice', Number(v))} />
                <FormField label="Total Amount" type="number" value={String(formData.totalAmount)} onChange={(v) => handleInputChange('totalAmount', Number(v))} disabled />
                <FormField label="Created By" value={formData.createdBy} onChange={(v) => handleInputChange('createdBy', v)} />
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-white/5">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white rounded-xl hover:bg-white/5 transition-all">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-5 py-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-xl text-sm font-medium
                  hover:from-brand-400 hover:to-brand-500 transition-all duration-200 disabled:opacity-50"
              >
                {submitting ? 'Creating...' : 'Create Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FormField({ label, value, onChange, type = 'text', disabled = false }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; disabled?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full px-3 py-2 bg-dark-800 border border-white/10 rounded-lg text-sm text-white
          focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 outline-none transition-all
          disabled:opacity-50 disabled:cursor-not-allowed placeholder-gray-600"
      />
    </div>
  );
}

export default OrdersPage;
