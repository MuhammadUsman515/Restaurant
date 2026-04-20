import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Printer,
  RotateCcw,
  X,
  Clock,
  Check,
  Truck,
  Package,
  MapPin,
  Phone,
  User,
  CreditCard,
  Banknote,
  ChefHat,
  CircleCheck,
  Ban,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { formatCurrency, formatDateTime, formatTime } from '@/lib/utils';

interface TimelineStep {
  key: string;
  label: string;
  icon: typeof Clock;
  time: string | null;
  active: boolean;
  completed: boolean;
}

interface OrderItemDetail {
  name: string;
  qty: number;
  unitPrice: number;
  modifiers: string[];
  total: number;
}

const mockOrder = {
  id: '1',
  orderNumber: 1042,
  type: 'DELIVERY' as const,
  status: 'PREPARING' as const,
  customerName: 'Ahmed Raza',
  customerPhone: '0321-4567890',
  customerEmail: 'ahmed.raza@email.com',
  deliveryAddress: 'House 42, Street 7, Block C, Gulberg III, Lahore',
  branch: 'Gulberg',
  createdAt: '2026-03-29T14:30:00Z',
  acceptedAt: '2026-03-29T14:32:00Z',
  preparingAt: '2026-03-29T14:35:00Z',
  readyAt: null as string | null,
  dispatchedAt: null as string | null,
  deliveredAt: null as string | null,
  items: [
    { name: 'Zinger Burger', qty: 2, unitPrice: 650, modifiers: ['Extra Cheese', 'No Onion'], total: 1300 },
    { name: 'Loaded Fries (Large)', qty: 1, unitPrice: 450, modifiers: ['Extra Sauce'], total: 450 },
    { name: 'Pepsi 1.5L', qty: 1, unitPrice: 180, modifiers: [], total: 180 },
    { name: 'Coleslaw', qty: 1, unitPrice: 150, modifiers: [], total: 150 },
  ] as OrderItemDetail[],
  subtotal: 2080,
  discount: 100,
  discountType: 'fixed' as const,
  taxRate: 16,
  taxAmount: 316,
  deliveryFee: 150,
  total: 2446,
  paymentMethod: 'CASH' as const,
  paymentStatus: 'PAID' as const,
  rider: {
    name: 'Kashif Mehmood',
    phone: '0300-1234567',
    vehicleNo: 'LEA-4521',
  },
  notes: 'Please ring the doorbell twice. Gate is on the left side.',
};

const statusColors: Record<string, string> = {
  PENDING: 'text-warning',
  ACCEPTED: 'text-primary-light',
  PREPARING: 'text-info',
  READY: 'text-success',
  OUT_FOR_DELIVERY: 'text-secondary',
  COMPLETED: 'text-success',
  CANCELLED: 'text-danger',
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const order = mockOrder;

  const timelineSteps: TimelineStep[] = [
    { key: 'placed', label: 'Order Placed', icon: Package, time: order.createdAt, active: true, completed: true },
    { key: 'accepted', label: 'Accepted', icon: Check, time: order.acceptedAt, active: !!order.acceptedAt, completed: !!order.acceptedAt },
    { key: 'preparing', label: 'Preparing', icon: ChefHat, time: order.preparingAt, active: !!order.preparingAt, completed: !!order.readyAt },
    { key: 'ready', label: 'Ready', icon: CircleCheck, time: order.readyAt, active: !!order.readyAt, completed: !!order.dispatchedAt },
    { key: 'dispatched', label: 'Dispatched', icon: Truck, time: order.dispatchedAt, active: !!order.dispatchedAt, completed: !!order.deliveredAt },
    { key: 'delivered', label: 'Delivered', icon: MapPin, time: order.deliveredAt, active: !!order.deliveredAt, completed: !!order.deliveredAt },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/orders')} className="!p-2">
            <ArrowLeft size={20} />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-heading font-bold text-white">
                Order #{order.orderNumber}
              </h1>
              <Badge variant="secondary" size="lg" dot>
                {order.type.replace('_', ' ')}
              </Badge>
              <Badge
                variant={
                  order.status === 'PREPARING' ? 'info' :
                  order.status === 'COMPLETED' ? 'success' :
                  order.status === 'CANCELLED' ? 'danger' :
                  order.status === 'PENDING' ? 'warning' : 'primary'
                }
                size="lg"
                dot
              >
                {order.status.replace(/_/g, ' ')}
              </Badge>
            </div>
            <p className="text-sm text-muted mt-1">
              {order.branch} Branch &middot; {formatDateTime(order.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" icon={<Printer size={16} />}>
            Print Receipt
          </Button>
          <Button variant="outline" icon={<RotateCcw size={16} />} onClick={() => setShowRefundModal(true)}>
            Refund
          </Button>
          <Button variant="danger" icon={<Ban size={16} />} onClick={() => setShowCancelModal(true)}>
            Cancel Order
          </Button>
        </div>
      </div>

      {/* Order Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Order Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between relative">
            {/* Progress Line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-border" />
            <div
              className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500"
              style={{
                width: `${(timelineSteps.filter((s) => s.active).length - 1) / (timelineSteps.length - 1) * 100}%`,
              }}
            />

            {timelineSteps.map((step) => {
              const StepIcon = step.icon;
              return (
                <div key={step.key} className="flex flex-col items-center gap-2 relative z-10">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                      step.completed
                        ? 'bg-primary border-primary text-white'
                        : step.active
                        ? 'bg-primary/20 border-primary text-primary-light animate-pulse'
                        : 'bg-card-bg border-border text-muted'
                    }`}
                  >
                    <StepIcon size={18} />
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      step.active ? 'text-white' : 'text-muted'
                    }`}
                  >
                    {step.label}
                  </span>
                  {step.time && (
                    <span className="text-[10px] text-muted">
                      {formatTime(step.time)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items - Takes 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
              <Badge variant="neutral" size="sm">
                {order.items.length} items
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-xs font-medium text-muted uppercase tracking-wider pb-3 pr-4">Item</th>
                      <th className="text-center text-xs font-medium text-muted uppercase tracking-wider pb-3 px-4">Qty</th>
                      <th className="text-right text-xs font-medium text-muted uppercase tracking-wider pb-3 px-4">Price</th>
                      <th className="text-right text-xs font-medium text-muted uppercase tracking-wider pb-3 pl-4">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, i) => (
                      <tr key={i} className="border-b border-border/50 last:border-0">
                        <td className="py-3 pr-4">
                          <p className="text-sm font-medium text-white">{item.name}</p>
                          {item.modifiers.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.modifiers.map((mod, j) => (
                                <span key={j} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-muted">
                                  {mod}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center text-sm text-white">{item.qty}</td>
                        <td className="py-3 px-4 text-right text-sm text-muted">{formatCurrency(item.unitPrice)}</td>
                        <td className="py-3 pl-4 text-right text-sm font-medium text-white">{formatCurrency(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="mt-4 pt-4 border-t border-border space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Subtotal</span>
                  <span className="text-white">{formatCurrency(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">
                      Discount {order.discountType === 'fixed' ? '' : `(${order.discount}%)`}
                    </span>
                    <span className="text-success">-{formatCurrency(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Tax (GST {order.taxRate}%)</span>
                  <span className="text-white">{formatCurrency(order.taxAmount)}</span>
                </div>
                {order.deliveryFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Delivery Fee</span>
                    <span className="text-white">{formatCurrency(order.deliveryFee)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold pt-2 border-t border-border">
                  <span className="text-white">Grand Total</span>
                  <span className="text-white">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Special Notes */}
          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Special Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-light bg-warning/5 border border-warning/20 rounded-lg p-3">
                  {order.notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <User size={18} className="text-primary-light" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{order.customerName}</p>
                  <p className="text-xs text-muted">{order.customerEmail}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted">
                <Phone size={14} />
                {order.customerPhone}
              </div>
              {order.deliveryAddress && (
                <div className="flex items-start gap-2 text-sm text-muted">
                  <MapPin size={14} className="mt-0.5 shrink-0" />
                  {order.deliveryAddress}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Rider Assignment */}
          {order.type === 'DELIVERY' && order.rider && (
            <Card>
              <CardHeader>
                <CardTitle>Rider</CardTitle>
                <Badge variant="success" size="sm" dot>Assigned</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                    <Truck size={18} className="text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{order.rider.name}</p>
                    <p className="text-xs text-muted">{order.rider.vehicleNo}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted">
                  <Phone size={14} />
                  {order.rider.phone}
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Change Rider
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Payment Details */}
          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
              <Badge
                variant={order.paymentStatus === 'PAID' ? 'success' : 'warning'}
                size="sm"
                dot
              >
                {order.paymentStatus}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  {order.paymentMethod === 'CASH' ? (
                    <Banknote size={18} className="text-success" />
                  ) : (
                    <CreditCard size={18} className="text-primary-light" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{order.paymentMethod}</p>
                  <p className="text-xs text-muted">
                    {order.paymentMethod === 'CASH' ? 'Cash on Delivery' : 'Paid Online'}
                  </p>
                </div>
                <span className="ml-auto text-lg font-bold text-white">
                  {formatCurrency(order.total)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <Modal
        open={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Order"
        size="sm"
      >
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-danger/20 flex items-center justify-center">
            <AlertTriangle size={32} className="text-danger" />
          </div>
          <div>
            <p className="text-white font-medium">
              Are you sure you want to cancel Order #{order.orderNumber}?
            </p>
            <p className="text-sm text-muted mt-1">This action cannot be undone.</p>
          </div>
          <div className="flex items-center gap-3 w-full">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => setShowCancelModal(false)}
            >
              Keep Order
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              onClick={() => setShowCancelModal(false)}
            >
              Yes, Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Refund Modal */}
      <Modal
        open={showRefundModal}
        onClose={() => setShowRefundModal(false)}
        title="Process Refund"
        size="sm"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-white/5 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted">Order Total</span>
              <span className="text-white font-medium">{formatCurrency(order.total)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Payment Method</span>
              <span className="text-white">{order.paymentMethod}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-light mb-1.5">
              Refund Amount
            </label>
            <input
              type="number"
              defaultValue={order.total}
              className="w-full h-10 rounded-lg bg-dark-bg border border-border px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-light mb-1.5">
              Reason
            </label>
            <textarea
              rows={3}
              placeholder="Enter refund reason..."
              className="w-full rounded-lg bg-dark-bg border border-border px-3 py-2 text-sm text-white placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
            />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="flex-1" onClick={() => setShowRefundModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" className="flex-1" onClick={() => setShowRefundModal(false)}>
              Process Refund
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
