import { prisma } from '../libs/prismaClient';

export type assignmentType = {
	shiftId: number;
	userId: number;
	shiftStart: string;
	shiftEnd: string;
};

export interface updateAssignment extends assignmentType {
	id: number;
}

export class ShiftAssignmentServices {
	async getAllAssignments() {
		return prisma.shiftAssignment.findMany();
	}

	async getAllAssignmentsByUser(userId: number) {
		return prisma.shiftAssignment.findMany({
			where: { user_id: userId },
		});
	}

	async createAssignment(data: assignmentType) {
		const shiftStart = new Date(data.shiftStart);
		const shiftEnd = new Date(data.shiftEnd);

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
				this.createAssignment(assignment);
			})
		);
	}

	async updateAssignment(data: updateAssignment) {
		const shiftStart = new Date(data.shiftStart);
		const shiftEnd = new Date(data.shiftEnd);

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
				this.updateAssignment(assignment);
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
				this.softDeleteAssignment(id);
			})
		);
	}
}
