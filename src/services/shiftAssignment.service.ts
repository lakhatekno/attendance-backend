import { HttpError } from '../libs/httpError';
import { prisma } from '../libs/prismaClient';

export type assignmentType = {
	shiftId: number;
	userId: string;
	date: Date;
};

export interface updateAssignment extends assignmentType {
	id: number;
}

export type MonthlyWindow = {
	month: number;
	year: number;
}

export class ShiftAssignmentServices {
	async getAllAssignments() {
		return prisma.shiftAssignment.findMany();
	}
	
	async getMonthlyAssignments(data: MonthlyWindow) {
		const { start, end } = this.getMonthRange(data);
		const response = await prisma.shiftAssignment.findMany({
			where: {
				shift_start: {
					gte: start,
					lt: end,
				},
			},
			select: {
				id: true,
				user_id: true,
				shift_id: true,
				shift_start: true,
				shift: {
					select: { name: true },
				},
			},
		});

		let mapped: Record<string, any> = {};
		response.forEach((item) => {
			const cellId = `${item.user_id}-${item.shift_start.toISOString().slice(0, 10)}`;
			mapped[cellId] = {
				emp_id: item.user_id,
				shift_id: item.shift_id,
				shift_name: item.shift.name,
				date: item.shift_start.toISOString().split('T')[0]
			};
		});

		return mapped;
	}

	async getAllAssignmentsByUser(userId: string) {
		return prisma.shiftAssignment.findMany({
			where: { user_id: userId },
		});
	}

	async createAssignment(data: assignmentType) {
		const date = data.date;
		const shift = await prisma.shift.findUnique({ where: { id: data.shiftId, active: true }});
		if (!shift) {
			throw new HttpError(404, 'Shift Not Found. ID Mismatch or Shift Nonactive');
		}

		const shiftStart = new Date(
			date.getFullYear(), 
			date.getMonth(), 
			date.getDate(), 
			shift.shift_start.getHours(), 
			shift.shift_start.getMinutes(), 
			0
		);

		const shiftEnd = new Date(
			date.getFullYear(), 
			date.getMonth(), 
			date.getDate(), 
			shift.shift_end.getHours(), 
			shift.shift_end.getMinutes(), 
			0
		);

		return prisma.shiftAssignment.create({
			data: {
				shift_id: data.shiftId,
				user_id: data.userId,
				shift_start: shiftStart,
				shift_end: shiftEnd,
			},
		});
	}

	async createAssignments(data: assignmentType[]) {
		return Promise.all(
			data.map((assignment) => {
				return this.createAssignment(assignment);
			})
		);
	}

	async updateAssignment(data: updateAssignment) {
		// need changes
		const shiftStart = new Date(data.date);
		const shiftEnd = new Date(data.date);

		return prisma.shiftAssignment.update({
			where: { id: data.id },
			data: {
				shift_id: data.shiftId,
				shift_start: shiftStart,
				shift_end: shiftEnd,
			},
		});
	}

	async updateAssignments(data: updateAssignment[]) {
		return Promise.all(
			data.map((assignment) => {
				return this.updateAssignment(assignment);
			})
		);
	}

	async softDeleteAssignment(id: number) {
		const dailySummary = await prisma.dailySummary.findFirst({
			where: { shift_assignment_id: id },
		});

		if (dailySummary && dailySummary != null) {
			return prisma.shiftAssignment.update({
				where: { id: id },
				data: {
					deleted: true,
					deletedAt: new Date(),
				},
			});
		}
	}

	async softDeleteAssignments(ids: number[]) {
		return Promise.all(
			ids.map((id) => {
				return this.softDeleteAssignment(id);
			})
		);
	}

	private getMonthRange(range: MonthlyWindow) {
		const start = new Date(range.year, range.month - 1, 1);
		const end = new Date(range.year, range.month, 0, 23, 59, 59, 999);
		return { start, end };
	}
}
