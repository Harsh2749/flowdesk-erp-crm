import { Router } from 'express';
import authRoutes from './auth.routes';
import dashboardRoutes from './dashboard.routes';
import customerRoutes from './customer.routes';
import followupRoutes from './followup.routes';
import productRoutes from './product.routes';
import inventoryRoutes from './inventory.routes';
import challanRoutes from './challan.routes';

const router = Router();

router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Mini ERP + CRM API is running',
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/customers', customerRoutes);
router.use('/followups', followupRoutes);
router.use('/products', productRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/challans', challanRoutes);

export default router;
