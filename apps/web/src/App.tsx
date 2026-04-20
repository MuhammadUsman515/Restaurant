import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/app-layout';

// Lazy-loaded pages
const Login = React.lazy(() => import('./pages/auth/login'));
const Register = React.lazy(() => import('./pages/auth/register'));
const ForgotPassword = React.lazy(() => import('./pages/auth/forgot-password'));
const Dashboard = React.lazy(() => import('./pages/dashboard/index'));
const Orders = React.lazy(() => import('./pages/orders/index'));
const OrderDetail = React.lazy(() => import('./pages/orders/detail'));
const POS = React.lazy(() => import('./pages/pos/index'));
const KDS = React.lazy(() => import('./pages/kds/index'));
const Delivery = React.lazy(() => import('./pages/delivery/index'));
const DeliveryRiders = React.lazy(() => import('./pages/delivery/riders'));
const DeliveryZones = React.lazy(() => import('./pages/delivery/zones'));
const Recipes = React.lazy(() => import('./pages/production/recipes'));
const RecipeDetail = React.lazy(() => import('./pages/production/recipe-detail'));
const Inventory = React.lazy(() => import('./pages/production/inventory'));
const ProductionOrders = React.lazy(() => import('./pages/production/production-orders'));
const CentralKitchen = React.lazy(() => import('./pages/production/central-kitchen'));
const Suppliers = React.lazy(() => import('./pages/production/suppliers'));
const PurchaseOrders = React.lazy(() => import('./pages/production/purchase-orders'));
const Menu = React.lazy(() => import('./pages/menu/index'));
const Customers = React.lazy(() => import('./pages/customers/index'));
const Campaigns = React.lazy(() => import('./pages/customers/campaigns'));
const Loyalty = React.lazy(() => import('./pages/loyalty/index'));
const Analytics = React.lazy(() => import('./pages/analytics/index'));
const Staff = React.lazy(() => import('./pages/staff/index'));
const Settings = React.lazy(() => import('./pages/settings/index'));
const RiderApp = React.lazy(() => import('./pages/rider/index'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-3 border-[#4B1FA8] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#9CA3AF] text-sm">Loading...</p>
      </div>
    </div>
  );
}

export function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/rider" element={<RiderApp />} />

        {/* Full-screen routes (no sidebar) */}
        <Route path="/pos" element={<POS />} />
        <Route path="/kds" element={<KDS />} />

        {/* App routes with layout */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/delivery/riders" element={<DeliveryRiders />} />
          <Route path="/delivery/zones" element={<DeliveryZones />} />
          <Route path="/production/recipes" element={<Recipes />} />
          <Route path="/production/recipes/:id" element={<RecipeDetail />} />
          <Route path="/production/inventory" element={<Inventory />} />
          <Route path="/production/orders" element={<ProductionOrders />} />
          <Route path="/production/central-kitchen" element={<CentralKitchen />} />
          <Route path="/production/suppliers" element={<Suppliers />} />
          <Route path="/production/purchase-orders" element={<PurchaseOrders />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/campaigns" element={<Campaigns />} />
          <Route path="/loyalty" element={<Loyalty />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}
