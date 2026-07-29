/**
 * Prisma seed script.
 *
 * Seeds one demo user per role (Admin, Sales, Warehouse, Accounts) plus a
 * handful of sample customers and products so the API and frontend have
 * something to work with locally. Safe to re-run: uses upsert/skipDuplicates
 * throughout, so it never errors out on a second run.
 *
 * Run with: npm run prisma:seed
 */
import bcrypt from 'bcrypt';
import { CustomerStatus, CustomerType, PrismaClient, Role } from '@prisma/client';
import { logger } from '../src/config/logger';

const prisma = new PrismaClient();

const DEMO_PASSWORD = 'Passw0rd!123';

async function seedUsers() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  const users = [
    { name: 'Admin User', email: 'admin@minierp.test', role: Role.ADMIN },
    { name: 'Sales User', email: 'sales@minierp.test', role: Role.SALES },
    { name: 'Warehouse User', email: 'warehouse@minierp.test', role: Role.WAREHOUSE },
    { name: 'Accounts User', email: 'accounts@minierp.test', role: Role.ACCOUNTS },
  ];

  const created = [];
  for (const u of users) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { ...u, passwordHash },
    });
    created.push(user);
  }

  logger.info(`Seeded ${created.length} users (password for all: ${DEMO_PASSWORD})`);
  return created;
}

async function seedCustomers(adminId: string) {
  const customers = [
    {
      name: 'Ramesh Gupta',
      phone: '9876543210',
      email: 'ramesh@gsupplies.example',
      businessName: 'Gupta Supplies',
      gstNumber: '27ABCDE1234F1Z5',
      customerType: CustomerType.WHOLESALE,
      address: 'MG Road, Patna, Bihar',
      status: CustomerStatus.ACTIVE,
      notes: 'Regular bulk buyer, prefers monthly billing.',
      createdById: adminId,
    },
    {
      name: 'Priya Traders',
      phone: '9123456780',
      email: 'contact@priyatraders.example',
      businessName: 'Priya Traders',
      customerType: CustomerType.DISTRIBUTOR,
      address: 'Boring Road, Patna, Bihar',
      status: CustomerStatus.LEAD,
      followUpDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      notes: 'Interested in distributorship for the northern region.',
      createdById: adminId,
    },
    {
      name: 'Anita Verma',
      phone: '9988776655',
      businessName: 'Verma General Store',
      customerType: CustomerType.RETAIL,
      status: CustomerStatus.INACTIVE,
      createdById: adminId,
    },
  ];

  for (const c of customers) {
    const existing = await prisma.customer.findFirst({ where: { phone: c.phone } });
    if (!existing) {
      await prisma.customer.create({ data: c });
    }
  }

  logger.info(`Seeded ${customers.length} sample customers`);
}

async function seedProducts() {
  const products = [
    {
      name: 'Steel Pipe 2-inch',
      sku: 'SKU-STEEL-PIPE-2IN',
      category: 'Pipes',
      unitPrice: 450.0,
      currentStock: 200,
      minStock: 50,
      warehouseLocation: 'Rack A1',
    },
    {
      name: 'PVC Fitting Elbow',
      sku: 'SKU-PVC-ELBOW',
      category: 'Fittings',
      unitPrice: 25.5,
      currentStock: 40,
      minStock: 50,
      warehouseLocation: 'Rack B3',
    },
    {
      name: 'Copper Wire 1.5mm',
      sku: 'SKU-COPPER-WIRE-1_5',
      category: 'Electrical',
      unitPrice: 1200.0,
      currentStock: 15,
      minStock: 20,
      warehouseLocation: 'Rack C2',
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { sku: p.sku },
      update: {},
      create: p,
    });
  }

  logger.info(`Seeded ${products.length} sample products (2 are intentionally below minStock to demo low-stock alerts)`);
}

async function main(): Promise<void> {
  const users = await seedUsers();
  const admin = users.find((u) => u.role === Role.ADMIN)!;

  await seedCustomers(admin.id);
  await seedProducts();

  logger.info('Seed completed successfully.');
}

main()
  .catch((error) => {
    logger.error(`Seed failed: ${error}`);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
