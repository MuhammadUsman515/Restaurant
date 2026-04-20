// ============ ENUMS ============

export enum Role {
  OWNER = 'OWNER',
  BRANCH_MANAGER = 'BRANCH_MANAGER',
  CASHIER = 'CASHIER',
  KITCHEN_STAFF = 'KITCHEN_STAFF',
  RIDER = 'RIDER',
}

export enum Plan {
  STARTER = 'STARTER',
  GROWTH = 'GROWTH',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE',
}

export enum TenantStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  TRIAL = 'TRIAL',
}

export enum OrderType {
  DELIVERY = 'DELIVERY',
  TAKEAWAY = 'TAKEAWAY',
  DINE_IN = 'DINE_IN',
  POS = 'POS',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  JAZZCASH = 'JAZZCASH',
  EASYPAISA = 'EASYPAISA',
  SPLIT = 'SPLIT',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
  FAILED = 'FAILED',
}

export enum ProductionOrderStatus {
  DRAFT = 'DRAFT',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum PurchaseOrderStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  RECEIVED = 'RECEIVED',
  PARTIAL = 'PARTIAL',
  CANCELLED = 'CANCELLED',
}

export enum StockAdjustmentType {
  ADDITION = 'ADDITION',
  SUBTRACTION = 'SUBTRACTION',
  DAMAGE = 'DAMAGE',
  WASTAGE = 'WASTAGE',
  AUDIT = 'AUDIT',
}

export enum CustomerSegment {
  NEW = 'NEW',
  REGULAR = 'REGULAR',
  VIP = 'VIP',
  CHURNED = 'CHURNED',
}

export enum LoyaltyTier {
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
}

// ============ MODELS ============

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: Plan;
  status: TenantStatus;
  trialEndsAt: string | null;
  createdAt: string;
}

export interface Branch {
  id: string;
  tenantId: string;
  name: string;
  address: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  tenantId: string;
  branchId: string | null;
  isActive: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  tenantId: string;
  name: string;
  nameUrdu: string | null;
  sortOrder: number;
  image: string | null;
  itemCount: number;
}

export interface MenuItem {
  id: string;
  tenantId: string;
  categoryId: string;
  category?: Category;
  name: string;
  nameUrdu: string | null;
  description: string | null;
  price: number;
  images: string[];
  isAvailable: boolean;
  tags: string[];
  variants: MenuVariant[];
  modifierGroups: ModifierGroup[];
  recipeId: string | null;
  createdAt: string;
}

export interface MenuVariant {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
}

export interface ModifierGroup {
  id: string;
  tenantId: string;
  name: string;
  isRequired: boolean;
  min: number;
  max: number;
  modifiers: Modifier[];
}

export interface Modifier {
  id: string;
  groupId: string;
  name: string;
  price: number;
}

export interface Order {
  id: string;
  tenantId: string;
  branchId: string;
  branch?: Branch;
  orderNumber: string;
  type: OrderType;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  customerId: string | null;
  customer?: Customer;
  riderId: string | null;
  rider?: Rider;
  items: OrderItem[];
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  notes: string | null;
  deliveryAddress: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  modifiers: string[];
  variant: string | null;
}

export interface Customer {
  id: string;
  tenantId: string;
  name: string;
  phone: string;
  email: string | null;
  addresses: string[];
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints: number;
  segment: CustomerSegment;
  loyaltyTier: LoyaltyTier;
  birthday: string | null;
  lastOrderAt: string | null;
  createdAt: string;
}

export interface LoyaltyTransaction {
  id: string;
  customerId: string;
  type: 'EARNED' | 'REDEEMED' | 'EXPIRED' | 'BONUS';
  points: number;
  orderId: string | null;
  description: string;
  createdAt: string;
}

export interface Rider {
  id: string;
  tenantId: string;
  branchId: string;
  name: string;
  phone: string;
  vehicleType: string;
  photo: string | null;
  isOnline: boolean;
  currentLat: number | null;
  currentLng: number | null;
  deliveriesToday: number;
  avgDeliveryTime: number;
  cashCollected: number;
}

export interface DeliveryZone {
  id: string;
  branchId: string;
  name: string;
  polygon: Array<{ lat: number; lng: number }>;
  deliveryCharge: number;
  minOrder: number;
  isActive: boolean;
}

export interface RawMaterial {
  id: string;
  tenantId: string;
  name: string;
  category: string;
  unit: string;
  currentStock: number;
  reorderLevel: number;
  reorderQty: number;
  avgCost: number;
  totalValue: number;
  lastUpdated: string;
}

export interface Recipe {
  id: string;
  tenantId: string;
  name: string;
  category: string;
  description: string | null;
  yield: number;
  yieldUnit: string;
  costPerUnit: number;
  sellingPrice: number;
  marginPercent: number;
  ingredients: RecipeIngredient[];
  method: string | null;
  image: string | null;
  linkedMenuItemId: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface RecipeIngredient {
  id: string;
  recipeId: string;
  rawMaterialId: string;
  rawMaterial?: RawMaterial;
  quantity: number;
  unit: string;
  wastePercent: number;
  netQuantity: number;
  costPerUnit: number;
  totalCost: number;
}

export interface ProductionOrder {
  id: string;
  tenantId: string;
  recipeId: string;
  recipe?: Recipe;
  orderNumber: string;
  quantity: number;
  status: ProductionOrderStatus;
  scheduledAt: string;
  completedAt: string | null;
  assignedTo: string | null;
  actualYield: number | null;
  actualCost: number | null;
  notes: string | null;
  createdAt: string;
}

export interface Supplier {
  id: string;
  tenantId: string;
  name: string;
  category: string;
  phone: string;
  email: string | null;
  city: string;
  address: string | null;
  rating: number;
  outstandingBalance: number;
}

export interface PurchaseOrder {
  id: string;
  tenantId: string;
  supplierId: string;
  supplier?: Supplier;
  orderNumber: string;
  status: PurchaseOrderStatus;
  items: PurchaseOrderItem[];
  totalAmount: number;
  deliveryDate: string | null;
  notes: string | null;
  createdAt: string;
}

export interface PurchaseOrderItem {
  id: string;
  purchaseOrderId: string;
  rawMaterialId: string;
  rawMaterial?: RawMaterial;
  name: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalPrice: number;
}

export interface GoodsReceiptNote {
  id: string;
  purchaseOrderId: string | null;
  tenantId: string;
  items: GRNItem[];
  receivedAt: string;
  receivedBy: string;
  notes: string | null;
}

export interface GRNItem {
  id: string;
  grnId: string;
  rawMaterialId: string;
  rawMaterial?: RawMaterial;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  batchNumber: string | null;
  expiryDate: string | null;
}

export interface SupplyRequest {
  id: string;
  branchId: string;
  branch?: Branch;
  status: 'PENDING' | 'APPROVED' | 'PARTIAL' | 'REJECTED' | 'DISPATCHED' | 'RECEIVED';
  items: SupplyRequestItem[];
  requestedAt: string;
  fulfilledAt: string | null;
}

export interface SupplyRequestItem {
  id: string;
  requestId: string;
  rawMaterialId: string | null;
  menuItemId: string | null;
  name: string;
  quantity: number;
  unit: string;
  dispatchedQty: number | null;
  receivedQty: number | null;
}

export interface StaffMember {
  id: string;
  tenantId: string;
  branchId: string | null;
  branch?: Branch;
  name: string;
  email: string;
  phone: string;
  role: Role;
  isActive: boolean;
  lastLogin: string | null;
  ordersProcessed: number;
  createdAt: string;
}

export interface Notification {
  id: string;
  tenantId: string;
  userId: string;
  title: string;
  message: string;
  type: 'ORDER' | 'STOCK' | 'DELIVERY' | 'SYSTEM';
  isRead: boolean;
  link: string | null;
  createdAt: string;
}

// ============ API RESPONSES ============

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AuthResponse {
  user: User;
  token: string;
  tenant: Tenant;
  branches: Branch[];
}

// ============ DASHBOARD TYPES ============

export interface DashboardStats {
  todayRevenue: number;
  revenueChange: number;
  todayOrders: number;
  ordersBreakdown: {
    online: number;
    pos: number;
    dineIn: number;
  };
  activeDeliveries: number;
  lowStockAlerts: number;
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
  avgOrderValue: number;
}

export interface TopSellingItem {
  name: string;
  revenue: number;
  quantity: number;
}

export interface HourlyOrderData {
  day: string;
  hour: number;
  orders: number;
}

// ============ ANALYTICS TYPES ============

export interface SalesAnalytics {
  revenueOverTime: RevenueDataPoint[];
  revenueByBranch: Array<{ branch: string; revenue: number }>;
  revenueByOrderType: Array<{ type: OrderType; revenue: number }>;
  revenueByPaymentMethod: Array<{ method: PaymentMethod; revenue: number }>;
  aovTrend: Array<{ date: string; aov: number }>;
}

export interface MenuAnalytics {
  topItemsByRevenue: TopSellingItem[];
  topItemsByQuantity: TopSellingItem[];
  menuMix: Array<{
    name: string;
    popularity: number;
    margin: number;
    quadrant: 'STAR' | 'PLOWHORSE' | 'PUZZLE' | 'DOG';
  }>;
}

export interface DeliveryAnalytics {
  avgDeliveryTimeTrend: Array<{ date: string; avgTime: number }>;
  onTimeRate: number;
  riderPerformance: Array<{
    name: string;
    deliveries: number;
    avgTime: number;
    rating: number;
  }>;
}
