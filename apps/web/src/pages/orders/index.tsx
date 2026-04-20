import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Eye,
  Check,
  X,
  Clock,
  ChevronLeft,
  ChevronRight,
  Package,
  Truck,
  ShoppingBag,
  Monitor,
  Phone,
  CreditCard,
  Banknote,
  Smartphone,
  Calendar,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';

type OrderStatus = 'PENDING' | 'ACCEPTED' | 'PREPARING' | 'READY' | 'OUT_FOR_DELIVERY' | 'COMPLETED' | 'CANCELLED';
type OrderType = 'DELIVERY' | 'TAKEAWAY' | 'DINE_IN' | 'POS';
type PaymentMethod = 'CASH' | 'CARD' | 'JAZZCASH' | 'EASYPAISA';

interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

interface Order {
  id: string;
  orderNumber: number;
  type: OrderType;
  status: OrderStatus;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  total: number;
  paymentMethod: PaymentMethod;
  branch: string;
  createdAt: string;
}

const mockOrders: Order[] = [
  { id: '1', orderNumber: 1042, type: 'DELIVERY', status: 'PENDING', customerName: 'Ahmed Raza', customerPhone: '0321-4567890', items: [{ name: 'Zinger Burger', qty: 2, price: 650 }, { name: 'Fries (Large)', qty: 1, price: 320 }], total: 1620, paymentMethod: 'CASH', branch: 'Gulberg', createdAt: new Date(Date.now() - 5 * 60000).toISOString() },
  { id: '2', orderNumber: 1041, type: 'DINE_IN', status: 'PREPARING', customerName: 'Fatima Khan', customerPhone: '0333-1234567', items: [{ name: 'Chicken Biryani', qty: 1, price: 450 }, { name: 'Raita', qty: 1, price: 80 }, { name: 'Pepsi 1.5L', qty: 1, price: 180 }], total: 710, paymentMethod: 'CARD', branch: 'DHA Phase 5', createdAt: new Date(Date.now() - 12 * 60000).toISOString() },
  { id: '3', orderNumber: 1040, type: 'TAKEAWAY', status: 'READY', customerName: 'Usman Ali', customerPhone: '0300-9876543', items: [{ name: 'Loaded Fries', qty: 1, price: 450 }, { name: 'Mighty Burger', qty: 1, price: 750 }], total: 1200, paymentMethod: 'JAZZCASH', branch: 'Gulberg', createdAt: new Date(Date.now() - 25 * 60000).toISOString() },
  { id: '4', orderNumber: 1039, type: 'DELIVERY', status: 'OUT_FOR_DELIVERY', customerName: 'Sara Mahmood', customerPhone: '0312-5551234', items: [{ name: 'Family Deal', qty: 1, price: 2500 }, { name: 'Mint Margarita', qty: 2, price: 250 }], total: 3000, paymentMethod: 'EASYPAISA', branch: 'Model Town', createdAt: new Date(Date.now() - 40 * 60000).toISOString() },
  { id: '5', orderNumber: 1038, type: 'POS', status: 'COMPLETED', customerName: 'Hassan Sheikh', customerPhone: '0345-6789012', items: [{ name: 'BBQ Pizza (Large)', qty: 1, price: 1200 }, { name: 'Garlic Bread', qty: 1, price: 350 }], total: 1550, paymentMethod: 'CASH', branch: 'DHA Phase 5', createdAt: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: '6', orderNumber: 1037, type: 'DELIVERY', status: 'CANCELLED', customerName: 'Ayesha Siddiqui', customerPhone: '0331-2223334', items: [{ name: 'Chapli Kebab Roll', qty: 3, price: 380 }], total: 1140, paymentMethod: 'CASH', branch: 'Gulberg', createdAt: new Date(Date.now() - 3 * 3600000).toISOString() },
  { id: '7', orderNumber: 1036, type: 'DINE_IN', status: 'COMPLETED', customerName: 'Bilal Tariq', customerPhone: '0322-4445556', items: [{ name: 'Nihari', qty: 2, price: 550 }, { name: 'Naan', qty: 4, price: 60 }, { name: 'Lassi', qty: 2, price: 180 }], total: 1700, paymentMethod: 'CARD', branch: 'Model Town', createdAt: new Date(Date.now() - 4 * 3600000).toISOString() },
  { id: '8', orderNumber: 1035, type: 'TAKEAWAY', status: 'COMPLETED', customerName: 'Zainab Noor', customerPhone: '0315-7778889', items: [{ name: 'Shawarma Platter', qty: 1, price: 890 }, { name: 'Hummus', qty: 1, price: 280 }], total: 1170, paymentMethod: 'JAZZCASH', branch: 'DHA Phase 5', createdAt: new Date(Date.now() - 5 * 3600000).toISOString() },
  { id: '9', orderNumber: 1034, type: 'DELIVERY', status: 'PENDING', customerName: 'Muhammad Imran', customerPhone: '0308-1112223', items: [{ name: 'Chicken Karahi', qty: 1, price: 1800 }, { name: 'Raita', qty: 1, price: 80 }, { name: 'Naan', qty: 3, price: 60 }], total: 2060, paymentMethod: 'CASH', branch: 'Gulberg', createdAt: new Date(Date.now() - 3 * 60000).toISOString() },
  { id: '10', orderNumber: 1033, type: 'POS', status: 'COMPLETED', customerName: 'Hira Saeed', customerPhone: '0341-3334445', items: [{ name: 'Chicken Wings (12pc)', qty: 1, price: 780 }, { name: 'Coleslaw', qty: 1, price: 180 }], total: 960, paymentMethod: 'CARD', branch: 'Model Town', createdAt: new Date(Date.now() - 6 * 3600000).toISOString() },
  { id: '11', orderNumber: 1032, type: 'DELIVERY', status: 'PREPARING', customerName: 'Omar Farooq', customerPhone: '0335-5556667', items: [{ name: 'Double Decker Burger', qty: 1, price: 850 }, { name: 'Onion Rings', qty: 1, price: 350 }, { name: 'Coke 500ml', qty: 2, price: 120 }], total: 1440, paymentMethod: 'EASYPAISA', branch: 'Gulberg', createdAt: new Date(Date.now() - 18 * 60000).toISOString() },
  { id: '12', orderNumber: 1031, type: 'DINE_IN', status: 'ACCEPTED', customerName: 'Nadia Hussain', customerPhone: '0302-6667778', items: [{ name: 'Mutton Pulao', qty: 2, price: 650 }, { name: 'Seekh Kebab', qty: 4, price: 200 }], total: 2100, paymentMethod: 'CASH', branch: 'DHA Phase 5', createdAt: new Date(Date.now() - 8 * 60000).toISOString() },
  { id: '13', orderNumber: 1030, type: 'TAKEAWAY', status: 'PENDING', customerName: 'Kamran Akmal', customerPhone: '0317-8889990', items: [{ name: 'Beef Steak', qty: 1, price: 1450 }], total: 1450, paymentMethod: 'CARD', branch: 'Model Town', createdAt: new Date(Date.now() - 7 * 60000).toISOString() },
  { id: '14', orderNumber: 1029, type: 'DELIVERY', status: 'COMPLETED', customerName: 'Sana Javed', customerPhone: '0346-0001112', items: [{ name: 'Paneer Tikka', qty: 1, price: 680 }, { name: 'Dal Makhni', qty: 1, price: 420 }, { name: 'Butter Naan', qty: 2, price: 80 }], total: 1260, paymentMethod: 'JAZZCASH', branch: 'Gulberg', createdAt: new Date(Date.now() - 8 * 3600000).toISOString() },
  { id: '15', orderNumber: 1028, type: 'POS', status: 'COMPLETED', customerName: 'Rizwan Malik', customerPhone: '0309-2223334', items: [{ name: 'Club Sandwich', qty: 2, price: 480 }, { name: 'Fresh Juice', qty: 2, price: 280 }], total: 1520, paymentMethod: 'CASH', branch: 'DHA Phase 5', createdAt: new Date(Date.now() - 10 * 3600000).toISOString() },
  { id: '16', orderNumber: 1027, type: 'DELIVERY', status: 'CANCELLED', customerName: 'Mariam Iqbal', customerPhone: '0336-4445556', items: [{ name: 'Cheese Pizza (Medium)', qty: 1, price: 950 }, { name: 'Wings (6pc)', qty: 1, price: 480 }], total: 1430, paymentMethod: 'EASYPAISA', branch: 'Model Town', createdAt: new Date(Date.now() - 12 * 3600000).toISOString() },
  { id: '17', orderNumber: 1026, type: 'DINE_IN', status: 'COMPLETED', customerName: 'Tariq Jameel', customerPhone: '0303-5556667', items: [{ name: 'Lamb Chops', qty: 1, price: 1900 }, { name: 'Caesar Salad', qty: 1, price: 480 }, { name: 'Mocktail', qty: 2, price: 350 }], total: 3080, paymentMethod: 'CARD', branch: 'DHA Phase 5', createdAt: new Date(Date.now() - 14 * 3600000).toISOString() },
  { id: '18', orderNumber: 1025, type: 'TAKEAWAY', status: 'COMPLETED', customerName: 'Asma Begum', customerPhone: '0348-7778889', items: [{ name: 'Chicken Broast', qty: 1, price: 750 }, { name: 'Fries (Regular)', qty: 1, price: 220 }], total: 970, paymentMethod: 'CASH', branch: 'Gulberg', createdAt: new Date(Date.now() - 16 * 3600000).toISOString() },
  { id: '19', orderNumber: 1024, type: 'DELIVERY', status: 'COMPLETED', customerName: 'Shahid Afridi', customerPhone: '0311-8889990', items: [{ name: 'Tikka Boti', qty: 1, price: 980 }, { name: 'Chicken Malai Boti', qty: 1, price: 1050 }, { name: 'Naan', qty: 4, price: 60 }], total: 2270, paymentMethod: 'JAZZCASH', branch: 'Model Town', createdAt: new Date(Date.now() - 20 * 3600000).toISOString() },
  { id: '20', orderNumber: 1023, type: 'POS', status: 'COMPLETED', customerName: 'Rabia Tanveer', customerPhone: '0304-0001112', items: [{ name: 'Chicken Wrap', qty: 3, price: 420 }, { name: 'Iced Tea', qty: 3, price: 220 }], total: 1920, paymentMethod: 'CARD', branch: 'DHA Phase 5', createdAt: new Date(Date.now() - 24 * 3600000).toISOString() },
  { id: '21', orderNumber: 1022, type: 'DELIVERY', status: 'PREPARING', customerName: 'Waqar Younis', customerPhone: '0318-2223334', items: [{ name: 'Beef Burger', qty: 2, price: 720 }, { name: 'Cheese Fries', qty: 1, price: 420 }], total: 1860, paymentMethod: 'CASH', branch: 'Gulberg', createdAt: new Date(Date.now() - 15 * 60000).toISOString() },
  { id: '22', orderNumber: 1021, type: 'TAKEAWAY', status: 'READY', customerName: 'Amina Rashid', customerPhone: '0347-3334445', items: [{ name: 'Paratha Roll', qty: 2, price: 350 }, { name: 'Dahi Bhalla', qty: 1, price: 250 }], total: 950, paymentMethod: 'EASYPAISA', branch: 'Model Town', createdAt: new Date(Date.now() - 22 * 60000).toISOString() },
];

const statusConfig: Record<OrderStatus, { label: string; variant: 'warning' | 'primary' | 'info' | 'success' | 'secondary' | 'danger' | 'neutral' }> = {
  PENDING: { label: 'Pending', variant: 'warning' },
  ACCEPTED: { label: 'Accepted', variant: 'primary' },
  PREPARING: { label: 'Preparing', variant: 'info' },
  READY: { label: 'Ready', variant: 'success' },
  OUT_FOR_DELIVERY: { label: 'Out for Delivery', variant: 'secondary' },
  COMPLETED: { label: 'Completed', variant: 'success' },
  CANCELLED: { label: 'Cancelled', variant: 'danger' },
};

const typeConfig: Record<OrderType, { label: string; icon: typeof Truck; variant: 'secondary' | 'primary' | 'info' | 'neutral' }> = {
  DELIVERY: { label: 'Delivery', icon: Truck, variant: 'secondary' },
  TAKEAWAY: { label: 'Takeaway', icon: ShoppingBag, variant: 'primary' },
  DINE_IN: { label: 'Dine-in', icon: Package, variant: 'info' },
  POS: { label: 'POS', icon: Monitor, variant: 'neutral' },
};

const paymentIcons: Record<PaymentMethod, typeof Banknote> = {
  CASH: Banknote,
  CARD: CreditCard,
  JAZZCASH: Smartphone,
  EASYPAISA: Phone,
};

const ITEMS_PER_PAGE = 8;

const statusTabs: { key: OrderStatus | 'ALL'; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'PENDING', label: 'Pending' },
  { key: 'PREPARING', label: 'Preparing' },
  { key: 'READY', label: 'Ready' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
  { key: 'COMPLETED', label: 'Completed' },
  { key: 'CANCELLED', label: 'Cancelled' },
];

export default function OrdersPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<OrderStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: mockOrders.length };
    for (const order of mockOrders) {
      counts[order.status] = (counts[order.status] || 0) + 1;
    }
    return counts;
  }, []);

  const filteredOrders = useMemo(() => {
    let orders = mockOrders;
    if (activeTab !== 'ALL') {
      orders = orders.filter((o) => o.status === activeTab);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      orders = orders.filter(
        (o) =>
          o.customerName.toLowerCase().includes(q) ||
          o.customerPhone.includes(q) ||
          `#${o.orderNumber}`.includes(q)
      );
    }
    if (branchFilter) orders = orders.filter((o) => o.branch === branchFilter);
    if (typeFilter) orders = orders.filter((o) => o.type === typeFilter);
    if (paymentFilter) orders = orders.filter((o) => o.paymentMethod === paymentFilter);
    return orders;
  }, [activeTab, searchQuery, branchFilter, typeFilter, paymentFilter]);

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleTabChange = (tab: OrderStatus | 'ALL') => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white">Orders</h1>
          <p className="text-muted text-sm mt-1">Manage and track all your orders</p>
        </div>
        <Button variant="primary" icon={<Package size={16} />}>
          New Order
        </Button>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide">
        {statusTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              activeTab === tab.key
                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                : 'text-muted hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === tab.key
                  ? 'bg-white/20'
                  : 'bg-white/5'
              }`}
            >
              {statusCounts[tab.key] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <Card className="!p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search by order #, customer name or phone..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full h-10 rounded-lg bg-dark-bg border border-border pl-10 pr-4 text-sm text-white placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-muted" />
            <select
              value={branchFilter}
              onChange={(e) => { setBranchFilter(e.target.value); setCurrentPage(1); }}
              className="h-10 rounded-lg bg-dark-bg border border-border px-3 pr-8 text-sm text-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            >
              <option value="">All Branches</option>
              <option value="Gulberg">Gulberg</option>
              <option value="DHA Phase 5">DHA Phase 5</option>
              <option value="Model Town">Model Town</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
              className="h-10 rounded-lg bg-dark-bg border border-border px-3 pr-8 text-sm text-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            >
              <option value="">All Types</option>
              <option value="DELIVERY">Delivery</option>
              <option value="TAKEAWAY">Takeaway</option>
              <option value="DINE_IN">Dine-in</option>
              <option value="POS">POS</option>
            </select>
            <select
              value={paymentFilter}
              onChange={(e) => { setPaymentFilter(e.target.value); setCurrentPage(1); }}
              className="h-10 rounded-lg bg-dark-bg border border-border px-3 pr-8 text-sm text-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            >
              <option value="">All Payments</option>
              <option value="CASH">Cash</option>
              <option value="CARD">Card</option>
              <option value="JAZZCASH">JazzCash</option>
              <option value="EASYPAISA">Easypaisa</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Orders Grid */}
      {paginatedOrders.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16">
          <Package size={48} className="text-muted/30 mb-4" />
          <p className="text-muted text-lg font-medium">No orders found</p>
          <p className="text-muted/60 text-sm mt-1">Try adjusting your filters</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {paginatedOrders.map((order) => {
            const TypeIcon = typeConfig[order.type].icon;
            const PayIcon = paymentIcons[order.paymentMethod];
            const totalItems = order.items.reduce((sum, i) => sum + i.qty, 0);

            return (
              <Card key={order.id} hover className="flex flex-col justify-between">
                {/* Card Header */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-heading font-bold text-white">
                        #{order.orderNumber}
                      </span>
                      <Badge
                        variant={typeConfig[order.type].variant}
                        size="sm"
                      >
                        <TypeIcon size={10} />
                        {typeConfig[order.type].label}
                      </Badge>
                    </div>
                    <Badge variant={statusConfig[order.status].variant} size="sm" dot>
                      {statusConfig[order.status].label}
                    </Badge>
                  </div>

                  {/* Customer */}
                  <div className="mb-3">
                    <p className="text-sm font-medium text-white">{order.customerName}</p>
                    <p className="text-xs text-muted">{order.customerPhone}</p>
                  </div>

                  {/* Items Preview */}
                  <div className="text-xs text-muted mb-3 space-y-0.5">
                    {order.items.slice(0, 2).map((item, i) => (
                      <p key={i}>
                        {item.qty}x {item.name}
                      </p>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-muted/60">+{order.items.length - 2} more items</p>
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div>
                  <div className="flex items-center justify-between py-3 border-t border-border">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-white">
                        {formatCurrency(order.total)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted">
                      <PayIcon size={14} />
                      <span className="text-xs">{totalItems} items</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted">
                      <Clock size={12} />
                      {formatRelativeTime(order.createdAt)}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {order.status === 'PENDING' && (
                        <>
                          <Button size="sm" variant="success" className="!h-7 !px-2.5 !text-xs">
                            <Check size={12} />
                            Accept
                          </Button>
                          <Button size="sm" variant="danger" className="!h-7 !px-2.5 !text-xs">
                            <X size={12} />
                            Reject
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="!h-7 !px-2.5 !text-xs"
                        onClick={() => navigate(`/orders/${order.id}`)}
                      >
                        <Eye size={12} />
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredOrders.length)} of{' '}
            {filteredOrders.length} orders
          </p>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <ChevronLeft size={16} />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                  currentPage === page
                    ? 'bg-primary text-white'
                    : 'text-muted hover:text-white hover:bg-white/5'
                }`}
              >
                {page}
              </button>
            ))}
            <Button
              size="sm"
              variant="ghost"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
