import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';

const router = Router();

router.get('/', authenticate, authorize('admin'), UserController.getUsers);
router.post('/', UserController.createUser);
router.post('/create-users', UserController.createUsers);

export default router;
