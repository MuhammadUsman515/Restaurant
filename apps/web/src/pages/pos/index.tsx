import { useState, useCallback } from 'react';
import { Search, Plus, Minus, X, ShoppingCart, CreditCard, Banknote, Smartphone, Check, Utensils, ShoppingBag, Truck } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const categories = ['All', 'Burgers', 'Sides', 'Drinks', 'Desserts', 'Deals'];

const menuItems = [
  { id: '1', name: 'Classic Burger', price: 550, category: 'Burgers', emoji: '🍔' },
  { id: '2', name: 'Zinger Burger', price: 650, category: 'Burgers', emoji: '🍔' },
  { id: '3', name: 'Double Patty', price: 850, category: 'Burgers', emoji: '🍔' },
  { id: '4', name: 'Chicken Shawarma', price: 450, category: 'Burgers', emoji: '🌯' },
  { id: '5', name: 'BBQ Burger', price: 750, category: 'Burgers', emoji: '🍔' },
  { id: '6', name: 'Smash Burger', price: 600, category: 'Burgers', emoji: '🍔' },
  { id: '7', name: 'Mushroom Swiss', price: 700, category: 'Burgers', emoji: '🍔' },
  { id: '8', name: 'Spicy Crunch', price: 620, category: 'Burgers', emoji: '🌶️' },
  { id: '9', name: 'Regular Fries', price: 200, category: 'Sides', emoji: '🍟' },
  { id: '10', name: 'Loaded Fries', price: 350, category: 'Sides', emoji: '🍟' },
  { id: '11', name: 'Coleslaw', price: 150, category: 'Sides', emoji: '🥗' },
  { id: '12', name: 'Onion Rings', price: 250, category: 'Sides', emoji: '🧅' },
  { id: '13', name: 'Pepsi', price: 100, category: 'Drinks', emoji: '🥤' },
  { id: '14', name: '7UP', price: 100, category: 'Drinks', emoji: '🥤' },
  { id: '15', name: 'Fresh Lime', price: 150, category: 'Drinks', emoji: '🍋' },
  { id: '16', name: 'Mango Shake', price: 250, category: 'Drinks', emoji: '🥭' },
  { id: '17', name: 'Chocolate Brownie', price: 300, category: 'Desserts', emoji: '🍫' },
  { id: '18', name: 'Ice Cream Sundae', price: 350, category: 'Desserts', emoji: '🍨' },
  { id: '19', name: 'Family Deal', price: 2500, category: 'Deals', emoji: '🎉' },
  { id: '20', name: 'Buddy Deal', price: 1200, category: 'Deals', emoji: '👫' },
];

type OrderMode = 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';

export default function POSPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderMode, setOrderMode] = useState<OrderMode>('DINE_IN');
  const [discount, setDiscount] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [cashReceived, setCashReceived] = useState('');
  const [orderComplete, setOrderComplete] = useState(false);

  const filteredItems = menuItems.filter((item) => {
    const matchCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const addToCart = useCallback((item: typeof menuItems[0]) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
  }, []);

  const updateQty = useCallback((id: string, delta: number) => {
    setCart((prev) => prev.map((c) => {
      if (c.id !== id) return c;
      const newQty = c.quantity + delta;
      return newQty > 0 ? { ...c, quantity: newQty } : c;
    }).filter((c) => c.quantity > 0));
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = discount ? (discount.includes('%') ? subtotal * (parseFloat(discount) / 100) : parseFloat(discount) || 0) : 0;
  const tax = Math.round((subtotal - discountAmount) * 0.16);
  const total = subtotal - discountAmount + tax;
  const change = cashReceived ? parseFloat(cashReceived) - total : 0;

  const handleCompleteOrder = () => {
    setOrderComplete(true);
    setTimeout(() => {
      setOrderComplete(false);
      setShowPayment(false);
      setPaymentMethod(null);
      setCashReceived('');
      setCart([]);
      setDiscount('');
    }, 2000);
  };

  const modeIcons = { DINE_IN: Utensils, TAKEAWAY: ShoppingBag, DELIVERY: Truck };

  return (
    <div className="fixed inset-0 bg-[#0F0A1E] flex">
      {/* Left Panel - Menu Items */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#2D1F50]">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold font-[Syne] text-white">Point of Sale</h1>
            <span className="text-xs text-[#9CA3AF]">Burger Palace — Main Branch</span>
          </div>
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-[#1A1030] border border-[#2D1F50] rounded-lg text-sm text-white placeholder-[#4B5563] focus:outline-none focus:border-[#4B1FA8] focus:ring-1 focus:ring-[#4B1FA8]/30"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 px-4 py-3 overflow-x-auto border-b border-[#2D1F50] scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-[#4B1FA8] text-white'
                  : 'bg-[#1A1030] text-[#9CA3AF] hover:text-white hover:bg-[#2D1F50]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Item Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={() => addToCart(item)}
                className="bg-gradient-to-br from-[#1A1030] to-[#1E1440] border border-[#2D1F50] rounded-xl p-4 text-left hover:border-[#4B1FA8] hover:shadow-lg hover:shadow-[#4B1FA8]/10 transition-all active:scale-95 group"
              >
                <div className="text-3xl mb-2">{item.emoji}</div>
                <p className="text-sm font-medium text-white group-hover:text-[#D8B4FE] transition-colors">{item.name}</p>
                <p className="text-sm font-bold text-[#F97316] mt-1">Rs {item.price}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Cart */}
      <div className="w-[380px] bg-[#1A1030] border-l border-[#2D1F50] flex flex-col">
        {/* Order Type */}
        <div className="p-4 border-b border-[#2D1F50]">
          <div className="flex items-center gap-2 mb-3">
            <ShoppingCart size={18} className="text-[#4B1FA8]" />
            <h2 className="text-sm font-semibold text-white">Current Order</h2>
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-[#4B1FA8]/20 text-[#D8B4FE]">{cart.length} items</span>
          </div>
          <div className="flex gap-1 bg-[#0F0A1E] rounded-lg p-1">
            {(['DINE_IN', 'TAKEAWAY', 'DELIVERY'] as const).map((mode) => {
              const Icon = modeIcons[mode];
              return (
                <button
                  key={mode}
                  onClick={() => setOrderMode(mode)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-medium transition-colors ${
                    orderMode === mode ? 'bg-[#4B1FA8] text-white' : 'text-[#9CA3AF] hover:text-white'
                  }`}
                >
                  <Icon size={14} />
                  {mode === 'DINE_IN' ? 'Dine-in' : mode === 'TAKEAWAY' ? 'Takeaway' : 'Delivery'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingCart size={40} className="text-[#2D1F50] mb-3" />
              <p className="text-sm text-[#9CA3AF]">No items in cart</p>
              <p className="text-xs text-[#4B5563] mt-1">Tap items to add them</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-[#0F0A1E] rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{item.name}</p>
                  <p className="text-xs text-[#F97316]">Rs {item.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 flex items-center justify-center rounded-md bg-[#2D1F50] text-white hover:bg-[#4B1FA8] transition-colors">
                    <Minus size={12} />
                  </button>
                  <span className="text-sm font-medium text-white w-6 text-center">{item.quantity}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 flex items-center justify-center rounded-md bg-[#2D1F50] text-white hover:bg-[#4B1FA8] transition-colors">
                    <Plus size={12} />
                  </button>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-white">Rs {(item.price * item.quantity).toLocaleString()}</p>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-[#9CA3AF] hover:text-red-400 transition-colors">
                  <X size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Totals & Pay */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-[#2D1F50] space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Discount (e.g., 10% or 100)"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="flex-1 px-3 py-2 bg-[#0F0A1E] border border-[#2D1F50] rounded-lg text-xs text-white placeholder-[#4B5563] focus:outline-none focus:border-[#4B1FA8]"
              />
            </div>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-[#9CA3AF]">
                <span>Subtotal</span><span>Rs {subtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount</span><span>-Rs {discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-[#9CA3AF]">
                <span>GST (16%)</span><span>Rs {tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-[#2D1F50]">
                <span>Total</span><span>Rs {total.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setCart([]); setDiscount(''); }}
                className="flex-1 py-2.5 border border-[#2D1F50] text-[#9CA3AF] hover:text-white hover:bg-[#2D1F50] rounded-lg text-sm transition-colors"
              >
                Clear
              </button>
              <button
                onClick={() => setShowPayment(true)}
                className="flex-[2] py-2.5 bg-[#4B1FA8] hover:bg-[#5B2FC8] text-white rounded-lg text-sm font-semibold transition-colors"
              >
                Charge Rs {total.toLocaleString()}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1A1030] border border-[#2D1F50] rounded-2xl w-full max-w-md p-6 mx-4">
            {orderComplete ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Check size={32} className="text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold font-[Syne] text-white mb-2">Order Complete!</h3>
                <p className="text-sm text-[#9CA3AF]">Order #1085 has been placed</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold font-[Syne] text-white">Payment</h3>
                  <button onClick={() => { setShowPayment(false); setPaymentMethod(null); }} className="text-[#9CA3AF] hover:text-white">
                    <X size={20} />
                  </button>
                </div>

                <div className="text-center mb-6">
                  <p className="text-sm text-[#9CA3AF]">Total Amount</p>
                  <p className="text-3xl font-bold font-[Syne] text-white">Rs {total.toLocaleString()}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { id: 'CASH', label: 'Cash', icon: Banknote, color: 'emerald' },
                    { id: 'CARD', label: 'Card', icon: CreditCard, color: 'blue' },
                    { id: 'JAZZCASH', label: 'JazzCash', icon: Smartphone, color: 'red' },
                    { id: 'EASYPAISA', label: 'Easypaisa', icon: Smartphone, color: 'green' },
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                        paymentMethod === method.id
                          ? 'border-[#4B1FA8] bg-[#4B1FA8]/10 text-white'
                          : 'border-[#2D1F50] text-[#9CA3AF] hover:border-[#4B1FA8]/50 hover:text-white'
                      }`}
                    >
                      <method.icon size={20} />
                      <span className="text-sm font-medium">{method.label}</span>
                    </button>
                  ))}
                </div>

                {paymentMethod === 'CASH' && (
                  <div className="mb-6 space-y-3">
                    <div>
                      <label className="text-xs text-[#9CA3AF] mb-1 block">Amount Received</label>
                      <input
                        type="number"
                        value={cashReceived}
                        onChange={(e) => setCashReceived(e.target.value)}
                        placeholder={`Rs ${total.toLocaleString()}`}
                        className="w-full px-4 py-3 bg-[#0F0A1E] border border-[#2D1F50] rounded-lg text-lg text-white text-center font-bold focus:outline-none focus:border-[#4B1FA8]"
                        autoFocus
                      />
                    </div>
                    <div className="flex gap-2">
                      {[total, Math.ceil(total / 500) * 500, Math.ceil(total / 1000) * 1000, 5000].filter((v, i, a) => a.indexOf(v) === i).map((amount) => (
                        <button
                          key={amount}
                          onClick={() => setCashReceived(String(amount))}
                          className="flex-1 py-2 bg-[#0F0A1E] border border-[#2D1F50] rounded-lg text-xs text-[#9CA3AF] hover:text-white hover:border-[#4B1FA8] transition-colors"
                        >
                          Rs {amount.toLocaleString()}
                        </button>
                      ))}
                    </div>
                    {change > 0 && (
                      <div className="text-center p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                        <p className="text-xs text-emerald-400">Change</p>
                        <p className="text-xl font-bold text-emerald-400">Rs {change.toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={handleCompleteOrder}
                  disabled={!paymentMethod || (paymentMethod === 'CASH' && parseFloat(cashReceived) < total)}
                  className="w-full py-3 bg-[#4B1FA8] hover:bg-[#5B2FC8] text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Complete Order
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
