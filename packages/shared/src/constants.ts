export const APP_NAME = 'RestroFlow';
export const APP_TAGLINE = 'From Kitchen to Customer — All in One';

export const BRAND_COLORS = {
  primary: '#4B1FA8',
  primaryHover: '#5B2FC8',
  secondary: '#F97316',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  darkBg: '#0F0A1E',
  cardBg: '#1A1030',
  cardBgAlt: '#1E1440',
  border: '#2D1F50',
  textMuted: '#9CA3AF',
  textLight: '#D1D5DB',
} as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending',
  ACCEPTED: 'Accepted',
  PREPARING: 'Preparing',
  READY: 'Ready',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export const ORDER_TYPE_LABELS: Record<string, string> = {
  DELIVERY: 'Delivery',
  TAKEAWAY: 'Takeaway',
  DINE_IN: 'Dine-in',
  POS: 'POS',
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  CASH: 'Cash',
  CARD: 'Card',
  JAZZCASH: 'JazzCash',
  EASYPAISA: 'Easypaisa',
  SPLIT: 'Split Payment',
};

export const ROLES_LABELS: Record<string, string> = {
  OWNER: 'Owner',
  BRANCH_MANAGER: 'Branch Manager',
  CASHIER: 'Cashier',
  KITCHEN_STAFF: 'Kitchen Staff',
  RIDER: 'Rider',
};

export const CURRENCY = 'Rs';
export const CURRENCY_SYMBOL = '₨';

export const PAGINATION_DEFAULT = {
  page: 1,
  limit: 20,
};
