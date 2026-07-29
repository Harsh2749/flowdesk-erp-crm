import { Router } from 'express';
import { Role } from '@prisma/client';
import { followupController } from '../controllers/followup.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validation.middleware';
import {
  createFollowupSchema,
  listFollowupsByCustomerSchema,
  updateFollowupSchema,
} from '../validators/followup.validator';

const router = Router();

router.use(authenticate);

router.get(
  '/customer/:customerId',
  validate(listFollowupsByCustomerSchema),
  followupController.listByCustomer
);

router.post(
  '/',
  authorize(Role.ADMIN, Role.SALES),
  validate(createFollowupSchema),
  followupController.create
);

router.put(
  '/:id',
  authorize(Role.ADMIN, Role.SALES),
  validate(updateFollowupSchema),
  followupController.update
);

export default router;
