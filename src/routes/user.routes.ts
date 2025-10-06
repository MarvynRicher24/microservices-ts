// src/routes/user.routes.ts
import { Router } from 'express';
import { container } from '../container';
import { userCreateValidation, userUpdateValidation } from '../middlewares/validation.middleware';

const router = Router();

// resolve controller from container
const userController = container.resolve<any>('userController');

router.post('/', userCreateValidation, userController.create);
router.get('/:id/with-accounts', userController.getUserWithAccounts);
router.get('/', userController.list);
router.get('/:id', userController.get);
router.put('/:id', userUpdateValidation, userController.update);
router.delete('/:id', userController.delete);

export default router;
