import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.notification.deleteMany();
  await prisma.stockAdjustment.deleteMany();
  await prisma.supplyRequestItem.deleteMany();
  await prisma.supplyRequest.deleteMany();
  await prisma.gRNItem.deleteMany();
  await prisma.goodsReceiptNote.deleteMany();
  await prisma.purchaseOrderItem.deleteMany();
  await prisma.purchaseOrder.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.productionOrder.deleteMany();
  await prisma.recipeIngredient.deleteMany();
  await prisma.recipe.deleteMany();
  await prisma.rawMaterial.deleteMany();
  await prisma.deliveryZone.deleteMany();
  await prisma.rider.deleteMany();
  await prisma.loyaltyTransaction.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.menuItemModifierGroup.deleteMany();
  await prisma.modifier.deleteMany();
  await prisma.modifierGroup.deleteMany();
  await prisma.menuVariant.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.branch.deleteMany();
  await prisma.tenant.deleteMany();

  // 1. Tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Burger Palace',
      slug: 'burger-palace',
      plan: 'PRO',
      status: 'ACTIVE',
      currency: 'PKR',
    },
  });
  console.log('✅ Tenant created:', tenant.name);

  // 2. Branches
  const mainBranch = await prisma.branch.create({
    data: { tenantId: tenant.id, name: 'Main Branch', address: 'Block 5, Clifton, Karachi', phone: '021-34567890' },
  });
  const cliftonBranch = await prisma.branch.create({
    data: { tenantId: tenant.id, name: 'Clifton Branch', address: 'Sea View Avenue, Clifton, Karachi', phone: '021-35678901' },
  });
  console.log('✅ 2 Branches created');

  // 3. Users
  const passwordHash = await bcrypt.hash('demo1234', 10);
  const admin = await prisma.user.create({
    data: { tenantId: tenant.id, email: 'admin@burgerpalace.com', passwordHash, name: 'Muhammad Usman', phone: '0300-1111111', role: 'OWNER' },
  });
  await prisma.user.createMany({
    data: [
      { tenantId: tenant.id, branchId: mainBranch.id, email: 'ali@burgerpalace.com', passwordHash, name: 'Ali Hassan', phone: '0321-2222222', role: 'BRANCH_MANAGER' },
      { tenantId: tenant.id, branchId: cliftonBranch.id, email: 'kashif@burgerpalace.com', passwordHash, name: 'Kashif Rizwan', phone: '0333-3333333', role: 'BRANCH_MANAGER' },
      { tenantId: tenant.id, branchId: mainBranch.id, email: 'hamza@burgerpalace.com', passwordHash, name: 'Hamza Khan', phone: '0345-4444444', role: 'CASHIER' },
      { tenantId: tenant.id, branchId: mainBranch.id, email: 'raza@burgerpalace.com', passwordHash, name: 'Raza Ahmed', phone: '0300-6666666', role: 'KITCHEN_STAFF' },
    ],
  });
  console.log('✅ Users created');

  // 4. Categories
  const cats = await Promise.all([
    prisma.category.create({ data: { tenantId: tenant.id, name: 'Burgers', sortOrder: 1 } }),
    prisma.category.create({ data: { tenantId: tenant.id, name: 'Sides', sortOrder: 2 } }),
    prisma.category.create({ data: { tenantId: tenant.id, name: 'Drinks', sortOrder: 3 } }),
    prisma.category.create({ data: { tenantId: tenant.id, name: 'Desserts', sortOrder: 4 } }),
    prisma.category.create({ data: { tenantId: tenant.id, name: 'Deals', sortOrder: 5 } }),
  ]);
  const [burgers, sides, drinks, desserts, deals] = cats;
  console.log('✅ 5 Categories created');

  // 5. Menu Items
  const items = await Promise.all([
    prisma.menuItem.create({ data: { tenantId: tenant.id, categoryId: burgers.id, name: 'Classic Burger', price: 550, tags: '["Bestseller"]', description: 'Our signature beef burger with lettuce, tomato, and special sauce' } }),
    prisma.menuItem.create({ data: { tenantId: tenant.id, categoryId: burgers.id, name: 'Zinger Burger', price: 650, tags: '["Bestseller","Spicy"]', description: 'Crispy fried chicken with spicy mayo and fresh salad' } }),
    prisma.menuItem.create({ data: { tenantId: tenant.id, categoryId: burgers.id, name: 'Double Patty', price: 850, tags: '[]' } }),
    prisma.menuItem.create({ data: { tenantId: tenant.id, categoryId: burgers.id, name: 'Chicken Shawarma', price: 450, tags: '["New"]' } }),
    prisma.menuItem.create({ data: { tenantId: tenant.id, categoryId: burgers.id, name: 'BBQ Burger', price: 750, tags: '["Spicy"]' } }),
    prisma.menuItem.create({ data: { tenantId: tenant.id, categoryId: burgers.id, name: 'Smash Burger', price: 600, tags: '[]' } }),
    prisma.menuItem.create({ data: { tenantId: tenant.id, categoryId: burgers.id, name: 'Mushroom Swiss', price: 700, tags: '[]' } }),
    prisma.menuItem.create({ data: { tenantId: tenant.id, categoryId: burgers.id, name: 'Spicy Crunch', price: 620, tags: '["Spicy"]' } }),
    prisma.menuItem.create({ data: { tenantId: tenant.id, categoryId: sides.id, name: 'Regular Fries', price: 200, tags: '[]' } }),
    prisma.menuItem.create({ data: { tenantId: tenant.id, categoryId: sides.id, name: 'Loaded Fries', price: 350, tags: '["Bestseller"]' } }),
    prisma.menuItem.create({ data: { tenantId: tenant.id, categoryId: sides.id, name: 'Coleslaw', price: 150, tags: '[]' } }),
    prisma.menuItem.create({ data: { tenantId: tenant.id, categoryId: sides.id, name: 'Onion Rings', price: 250, tags: '[]' } }),
    prisma.menuItem.create({ data: { tenantId: tenant.id, categoryId: drinks.id, name: 'Pepsi', price: 100, tags: '[]' } }),
    prisma.menuItem.create({ data: { tenantId: tenant.id, categoryId: drinks.id, name: '7UP', price: 100, tags: '[]' } }),
    prisma.menuItem.create({ data: { tenantId: tenant.id, categoryId: drinks.id, name: 'Fresh Lime', price: 150, tags: '[]' } }),
    prisma.menuItem.create({ data: { tenantId: tenant.id, categoryId: drinks.id, name: 'Mango Shake', price: 250, tags: '["New"]' } }),
    prisma.menuItem.create({ data: { tenantId: tenant.id, categoryId: desserts.id, name: 'Chocolate Brownie', price: 300, tags: '[]' } }),
    prisma.menuItem.create({ data: { tenantId: tenant.id, categoryId: desserts.id, name: 'Ice Cream Sundae', price: 350, tags: '[]', isAvailable: false } }),
    prisma.menuItem.create({ data: { tenantId: tenant.id, categoryId: deals.id, name: 'Family Deal', price: 2500, tags: '["Bestseller"]', description: '4 Burgers + 2 Fries + 4 Drinks' } }),
    prisma.menuItem.create({ data: { tenantId: tenant.id, categoryId: deals.id, name: 'Buddy Deal', price: 1200, tags: '[]', description: '2 Burgers + 1 Fries + 2 Drinks' } }),
  ]);
  console.log('✅ 20 Menu items created');

  // 6. Raw Materials
  const materials = await Promise.all([
    prisma.rawMaterial.create({ data: { tenantId: tenant.id, name: 'Chicken Breast', category: 'Meat', unit: 'kg', currentStock: 12, reorderLevel: 15, reorderQty: 30, avgCost: 850 } }),
    prisma.rawMaterial.create({ data: { tenantId: tenant.id, name: 'Beef Patties', category: 'Meat', unit: 'pcs', currentStock: 45, reorderLevel: 50, reorderQty: 100, avgCost: 120 } }),
    prisma.rawMaterial.create({ data: { tenantId: tenant.id, name: 'Burger Buns', category: 'Bakery', unit: 'pcs', currentStock: 80, reorderLevel: 100, reorderQty: 200, avgCost: 30 } }),
    prisma.rawMaterial.create({ data: { tenantId: tenant.id, name: 'Lettuce', category: 'Produce', unit: 'kg', currentStock: 8, reorderLevel: 5, reorderQty: 15, avgCost: 200 } }),
    prisma.rawMaterial.create({ data: { tenantId: tenant.id, name: 'Tomatoes', category: 'Produce', unit: 'kg', currentStock: 6, reorderLevel: 8, reorderQty: 20, avgCost: 150 } }),
    prisma.rawMaterial.create({ data: { tenantId: tenant.id, name: 'Cheese Slices', category: 'Dairy', unit: 'pcs', currentStock: 150, reorderLevel: 100, reorderQty: 300, avgCost: 45 } }),
    prisma.rawMaterial.create({ data: { tenantId: tenant.id, name: 'BBQ Sauce', category: 'Condiments', unit: 'L', currentStock: 3, reorderLevel: 5, reorderQty: 10, avgCost: 450 } }),
    prisma.rawMaterial.create({ data: { tenantId: tenant.id, name: 'Cooking Oil', category: 'Oils', unit: 'L', currentStock: 15, reorderLevel: 10, reorderQty: 20, avgCost: 380 } }),
    prisma.rawMaterial.create({ data: { tenantId: tenant.id, name: 'French Fries (Frozen)', category: 'Frozen', unit: 'kg', currentStock: 20, reorderLevel: 15, reorderQty: 40, avgCost: 320 } }),
    prisma.rawMaterial.create({ data: { tenantId: tenant.id, name: 'Onion Rings', category: 'Frozen', unit: 'kg', currentStock: 5, reorderLevel: 8, reorderQty: 15, avgCost: 400 } }),
  ]);
  console.log('✅ 10 Raw materials created');

  // 7. Recipes
  const classicBurgerRecipe = await prisma.recipe.create({
    data: {
      tenantId: tenant.id, name: 'Classic Burger', category: 'Burgers',
      yield: 1, yieldUnit: 'portion', costPerUnit: 195, sellingPrice: 550, marginPercent: 64.5,
      method: '1. Season and grill the beef patty for 4 minutes each side.\n2. Toast the bun lightly.\n3. Layer lettuce, tomato, patty, cheese.\n4. Drizzle BBQ sauce.',
      linkedMenuItemId: items[0].id, isActive: true,
    },
  });
  await prisma.recipeIngredient.createMany({
    data: [
      { recipeId: classicBurgerRecipe.id, rawMaterialId: materials[1].id, quantity: 1, unit: 'pcs', wastePercent: 5, netQuantity: 1.05, costPerUnit: 120, totalCost: 126 },
      { recipeId: classicBurgerRecipe.id, rawMaterialId: materials[2].id, quantity: 1, unit: 'pcs', wastePercent: 2, netQuantity: 1.02, costPerUnit: 30, totalCost: 30.6 },
      { recipeId: classicBurgerRecipe.id, rawMaterialId: materials[3].id, quantity: 0.03, unit: 'kg', wastePercent: 10, netQuantity: 0.033, costPerUnit: 200, totalCost: 6.6 },
      { recipeId: classicBurgerRecipe.id, rawMaterialId: materials[5].id, quantity: 1, unit: 'pcs', wastePercent: 0, netQuantity: 1, costPerUnit: 45, totalCost: 45 },
      { recipeId: classicBurgerRecipe.id, rawMaterialId: materials[6].id, quantity: 0.015, unit: 'L', wastePercent: 0, netQuantity: 0.015, costPerUnit: 450, totalCost: 6.75 },
    ],
  });

  // Create 4 more recipes
  for (const r of [
    { name: 'Zinger Burger', category: 'Burgers', cost: 210, price: 650, margin: 67.7, itemId: items[1].id },
    { name: 'Loaded Fries', category: 'Sides', cost: 85, price: 350, margin: 75.7, itemId: items[9].id },
    { name: 'BBQ Sauce (House)', category: 'Sauces', cost: 120, price: 0, margin: 0, itemId: null },
    { name: 'Chicken Shawarma', category: 'Burgers', cost: 150, price: 450, margin: 66.7, itemId: items[3].id },
  ]) {
    await prisma.recipe.create({
      data: {
        tenantId: tenant.id, name: r.name, category: r.category,
        yield: 1, yieldUnit: 'portion', costPerUnit: r.cost, sellingPrice: r.price, marginPercent: r.margin,
        linkedMenuItemId: r.itemId, isActive: true,
      },
    });
  }
  console.log('✅ 5 Recipes created');

  // 8. Customers
  const customerNames = [
    'Saad Ahmed', 'Fatima Khan', 'Ahmed Raza', 'Sara Malik', 'Usman Ali',
    'Ayesha Butt', 'Bilal Khan', 'Nadia Hussain', 'Hassan Raza', 'Tariq Jameel',
    'Waqar Ahmed', 'Kamran Shah', 'Zara Iqbal', 'Imran Siddiqui', 'Sana Malik',
    'Ali Raza', 'Amna Shah', 'Danish Khan', 'Hira Fatima', 'Junaid Ahmed',
    'Kiran Batool', 'Laiba Noor', 'Mohsin Ali', 'Noman Khan', 'Omair Raza',
    'Palwasha Gul', 'Qasim Shah', 'Rabia Tanveer', 'Shahzad Butt', 'Tuba Hashmi',
  ];
  const customers = await Promise.all(
    customerNames.map((name, i) => {
      const orders = i < 2 ? 30 + Math.floor(Math.random() * 20) : i < 7 ? 8 + Math.floor(Math.random() * 15) : i < 20 ? 1 + Math.floor(Math.random() * 5) : Math.floor(Math.random() * 3);
      const spent = orders * (400 + Math.floor(Math.random() * 600));
      const segment = i < 2 ? 'VIP' : i < 10 ? 'REGULAR' : i < 25 ? 'NEW' : 'CHURNED';
      const tier = spent > 30000 ? 'PLATINUM' : spent > 10000 ? 'GOLD' : 'SILVER';
      return prisma.customer.create({
        data: {
          tenantId: tenant.id, name, phone: `03${String(i).padStart(2, '0')}-${String(1000000 + Math.floor(Math.random() * 9000000))}`,
          email: i % 3 === 0 ? `${name.split(' ')[0].toLowerCase()}@gmail.com` : null,
          totalOrders: orders, totalSpent: spent, loyaltyPoints: Math.floor(spent / 10),
          segment, loyaltyTier: tier,
          lastOrderAt: new Date(Date.now() - (i < 10 ? i : i * 5) * 86400000),
        },
      });
    })
  );
  console.log('✅ 30 Customers created');

  // 9. Riders
  const riderData = [
    { name: 'Ahmed Raza', phone: '0300-1234567', online: true, deliveries: 12, avgTime: 25, cash: 8400 },
    { name: 'Bilal Khan', phone: '0321-9876543', online: true, deliveries: 9, avgTime: 28, cash: 6200 },
    { name: 'Faisal Mehmood', phone: '0333-5551234', online: true, deliveries: 7, avgTime: 22, cash: 5100 },
  ];
  const riders = await Promise.all(
    riderData.map((r) =>
      prisma.rider.create({
        data: {
          tenantId: tenant.id, branchId: mainBranch.id, name: r.name, phone: r.phone,
          vehicleType: 'MOTORCYCLE', isOnline: r.online, deliveriesToday: r.deliveries,
          avgDeliveryTime: r.avgTime, cashCollected: r.cash,
        },
      })
    )
  );
  console.log('✅ 3 Riders created');

  // 10. Orders (50 orders over last 7 days)
  const statuses = ['PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'COMPLETED', 'CANCELLED'];
  const types = ['DELIVERY', 'TAKEAWAY', 'DINE_IN', 'POS'];
  const payments = ['CASH', 'CARD', 'JAZZCASH', 'EASYPAISA'];

  for (let i = 0; i < 50; i++) {
    const orderItems = [];
    const itemCount = 1 + Math.floor(Math.random() * 4);
    let subtotal = 0;
    for (let j = 0; j < itemCount; j++) {
      const item = items[Math.floor(Math.random() * items.length)];
      const qty = 1 + Math.floor(Math.random() * 3);
      subtotal += item.price * qty;
      orderItems.push({ menuItemId: item.id, name: item.name, price: item.price, quantity: qty });
    }
    const tax = Math.round(subtotal * 0.16);
    const discount = Math.random() > 0.8 ? Math.round(subtotal * 0.1) : 0;
    const total = subtotal + tax - discount;
    const type = types[Math.floor(Math.random() * types.length)];
    const status = i < 5 ? statuses[Math.floor(Math.random() * 3)] : statuses[Math.floor(Math.random() * statuses.length)];

    await prisma.order.create({
      data: {
        tenantId: tenant.id,
        branchId: Math.random() > 0.4 ? mainBranch.id : cliftonBranch.id,
        orderNumber: `#${1000 + i}`,
        type,
        status,
        subtotal,
        discount,
        tax,
        total,
        customerId: customers[Math.floor(Math.random() * customers.length)].id,
        riderId: type === 'DELIVERY' ? riders[Math.floor(Math.random() * riders.length)].id : null,
        paymentMethod: payments[Math.floor(Math.random() * payments.length)],
        paymentStatus: status === 'COMPLETED' || status === 'DELIVERED' ? 'PAID' : 'PENDING',
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 86400000)),
        items: { create: orderItems },
      },
    });
  }
  console.log('✅ 50 Orders created');

  // 11. Suppliers
  await prisma.supplier.createMany({
    data: [
      { tenantId: tenant.id, name: 'Karachi Meats', category: 'Meat', phone: '021-34567890', email: 'orders@karachimeats.pk', city: 'Karachi', rating: 4.5, outstandingBalance: 45000 },
      { tenantId: tenant.id, name: 'Fresh Farms Dairy', category: 'Dairy', phone: '021-34561234', email: 'supply@freshfarms.pk', city: 'Karachi', rating: 4.8, outstandingBalance: 12000 },
      { tenantId: tenant.id, name: 'Ali Grocery', category: 'Dry Goods', phone: '021-35678901', email: 'ali@aligrocery.pk', city: 'Karachi', rating: 4.0, outstandingBalance: 8500 },
      { tenantId: tenant.id, name: 'PakFry Foods', category: 'Frozen', phone: '042-35671234', email: 'sales@pakfry.pk', city: 'Lahore', rating: 4.3, outstandingBalance: 22000 },
      { tenantId: tenant.id, name: 'Supreme Packaging', category: 'Packaging', phone: '021-34569876', email: 'orders@supremepack.pk', city: 'Karachi', rating: 4.6, outstandingBalance: 5000 },
    ],
  });
  console.log('✅ 5 Suppliers created');

  // 12. Production Orders
  const recipes = await prisma.recipe.findMany({ where: { tenantId: tenant.id } });
  for (let i = 0; i < 5; i++) {
    const recipe = recipes[i % recipes.length];
    await prisma.productionOrder.create({
      data: {
        tenantId: tenant.id, recipeId: recipe.id, orderNumber: `PO-${String(i + 1).padStart(3, '0')}`,
        quantity: 20 + Math.floor(Math.random() * 40),
        status: ['COMPLETED', 'IN_PROGRESS', 'CONFIRMED', 'DRAFT', 'CANCELLED'][i],
        scheduledAt: new Date(Date.now() + (i - 2) * 86400000),
        completedAt: i === 0 ? new Date() : null,
        actualYield: i === 0 ? 48 : null,
      },
    });
  }
  console.log('✅ 5 Production orders created');

  // 13. Notifications
  await prisma.notification.createMany({
    data: [
      { tenantId: tenant.id, userId: admin.id, title: 'New Order', message: 'Order #1049 received from Fatima Khan', type: 'ORDER', link: '/orders' },
      { tenantId: tenant.id, userId: admin.id, title: 'Low Stock Alert', message: 'Chicken Breast is below reorder level', type: 'STOCK', link: '/production/inventory' },
      { tenantId: tenant.id, userId: admin.id, title: 'Delivery Completed', message: 'Order #1045 delivered by Ahmed Raza', type: 'DELIVERY', link: '/orders' },
      { tenantId: tenant.id, userId: admin.id, title: 'Welcome to RestroFlow!', message: 'Your restaurant management platform is ready', type: 'SYSTEM' },
    ],
  });
  console.log('✅ Notifications created');

  console.log('\n🎉 Seed completed successfully!');
  console.log('📧 Login: admin@burgerpalace.com');
  console.log('🔑 Password: demo1234');
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
