import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { AuthController } from "../controllers/auth.controller";

const router = Router();

router.post('/login', AuthController.login);
router.get('/logout', authenticate, authorize("admin", "user"), AuthController.logout);

export default router;