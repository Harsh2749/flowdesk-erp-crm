import { Router } from 'express';
import { Role } from '@prisma/client';
import { inventoryController } from '../controllers/inventory.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validation.middleware';
import { listMovementsSchema, stockMovementSchema } from '../validators/inventory.validator';

const router = Router();

router.use(authenticate);

router.get('/movements', validate(listMovementsSchema), inventoryController.listMovements);
router.get('/low-stock', inventoryController.lowStock);

router.post(
  '/stock-in',
  authorize(Role.ADMIN, Role.WAREHOUSE),
  validate(stockMovementSchema),
  inventoryController.stockIn
);

router.post(
  '/stock-out',
  authorize(Role.ADMIN, Role.WAREHOUSE),
  validate(stockMovementSchema),
  inventoryController.stockOut
);

export default router;
