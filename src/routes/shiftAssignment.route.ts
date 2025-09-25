import { Router } from 'express';
import { ShiftAssingmentController } from '../controllers/shiftAssignment.controller';

const router = Router();

router.get('/', ShiftAssingmentController.getAllAssignments);
router.post('/', ShiftAssingmentController.createAssignments);
router.put('/', ShiftAssingmentController.updateAssignments);
router.put('/delete-batch', ShiftAssingmentController.softDeleteAssignments);

router.get('/per-user', ShiftAssingmentController.getAllAssignmentsByUser);
router.post('/per-user', ShiftAssingmentController.createAssignment);
router.put('/per-user', ShiftAssingmentController.updateAssignment);
router.put('/delete-per-user', ShiftAssingmentController.softDeleteAssignment);

export default router;
