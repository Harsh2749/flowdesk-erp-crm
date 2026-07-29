import { Router } from 'express';
import { Role } from '@prisma/client';
import { customerController } from '../controllers/customer.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validation.middleware';
import {
  createCustomerSchema,
  customerIdSchema,
  listCustomersSchema,
  updateCustomerSchema,
} from '../validators/customer.validator';

const router = Router();

router.use(authenticate);

router.get('/', validate(listCustomersSchema), customerController.list);
router.get('/:id', validate(customerIdSchema), customerController.getById);

router.post(
  '/',
  authorize(Role.ADMIN, Role.SALES),
  validate(createCustomerSchema),
  customerController.create
);

router.put(
  '/:id',
  authorize(Role.ADMIN, Role.SALES),
  validate(updateCustomerSchema),
  customerController.update
);

router.delete('/:id', authorize(Role.ADMIN), validate(customerIdSchema), customerController.delete);

export default router;
