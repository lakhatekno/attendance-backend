import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';

const router = Router();

router.get('/', authenticate, authorize('admin'), UserController.getUsers);
router.post('/', authenticate, authorize('admin'), UserController.createUser);
router.post('/create-users', authenticate, authorize('admin'), UserController.createUsers);
router.put('/', authenticate, authorize('admin'), UserController.updateUser);
router.put('/inactivate', authenticate, authorize('admin'), UserController.deleteUser);

export default router;
