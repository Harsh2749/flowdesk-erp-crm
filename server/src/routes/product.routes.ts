import { Router } from 'express';
import { Role } from '@prisma/client';
import { productController } from '../controllers/product.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validation.middleware';
import {
  createProductSchema,
  listProductsSchema,
  productIdSchema,
  updateProductSchema,
  updateProductStatusSchema,
} from '../validators/product.validator';

const router = Router();

router.use(authenticate);

router.get('/', validate(listProductsSchema), productController.list);
router.get('/:id', validate(productIdSchema), productController.getById);

router.post(
  '/',
  authorize(Role.ADMIN, Role.WAREHOUSE),
  validate(createProductSchema),
  productController.create
);

router.put(
  '/:id',
  authorize(Role.ADMIN, Role.WAREHOUSE),
  validate(updateProductSchema),
  productController.update
);

router.delete('/:id', authorize(Role.ADMIN), validate(productIdSchema), productController.delete);

router.patch(
  '/:id/status',
  authorize(Role.ADMIN),
  validate(updateProductStatusSchema),
  productController.setActive
);

export default router;