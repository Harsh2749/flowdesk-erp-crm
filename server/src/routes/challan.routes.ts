import { Router } from 'express';
import { Role } from '@prisma/client';
import { challanController } from '../controllers/challan.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validation.middleware';
import {
  challanIdSchema,
  changeChallanStatusSchema,
  createChallanSchema,
  listChallansSchema,
  updateChallanSchema,
} from '../validators/challan.validator';

const router = Router();

router.use(authenticate);

router.get('/', validate(listChallansSchema), challanController.list);
router.get('/:id', validate(challanIdSchema), challanController.getById);

router.post(
  '/',
  authorize(Role.ADMIN, Role.SALES),
  validate(createChallanSchema),
  challanController.create
);

router.put(
  '/:id',
  authorize(Role.ADMIN, Role.SALES),
  validate(updateChallanSchema),
  challanController.update
);

router.patch(
  '/:id/status',
  authorize(Role.ADMIN, Role.SALES, Role.WAREHOUSE),
  validate(changeChallanStatusSchema),
  challanController.changeStatus
);

export default router;
