import { Router } from 'express';
import { ShiftController } from '../controllers/shift.controller';

const router = Router();

router.get('/', ShiftController.getShifts);
router.post('/', ShiftController.createShift);
router.put('/', ShiftController.updateShiftInfo);
router.put('/activate-shift', ShiftController.activateShift);
router.put('/inactivate-shift', ShiftController.inactivateShift);

export default router;
