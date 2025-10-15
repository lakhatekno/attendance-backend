import { prisma } from '../libs/prismaClient';
import { isTimeFormatValid, toUTCDate } from '../libs/validation';

type activeStatus = {
	id: number;
	active: boolean;
};

type shiftType = {
	name: string;
	shift_start: string;
	shift_end: string;
	cross_day: boolean;
	active: boolean;
};

interface updateShift extends shiftType {
	id: number;
}

export class ShiftServices {
	async getAllShifts() {
		return prisma.shift.findMany();
	}
	
	async getActiveShifts() {
		return prisma.shift.findMany({ where: { active: true } });
	}
	
	async getInactiveShifts() {
		return prisma.shift.findMany({ where: { active: false } });
	}

	async createShift(data: shiftType) {
		const shiftStartValidation = isTimeFormatValid(data.shift_start);
		const shiftEndValidation = isTimeFormatValid(data.shift_end);

		if (shiftStartValidation && shiftEndValidation) {
			return prisma.shift.create({
				data: {
					name: data.name,
					shift_start: toUTCDate(data.shift_start),
					shift_end: toUTCDate(data.shift_end),
					cross_day: data.cross_day,
					active: data.active,
				},
			});
		}
	}

	async updateShiftInfo(data: updateShift) {
		const shiftStartValidation = isTimeFormatValid(data.shift_start);
		const shiftEndValidation = isTimeFormatValid(data.shift_end);

		if (shiftStartValidation && shiftEndValidation) {
			return prisma.shift.update({
				where: { id: data.id },
				data: {
					name: data.name,
					shift_start: data.shift_start,
					shift_end: data.shift_end,
					cross_day: data.cross_day,
					active: data.active,
				},
			});
		}
	}

	async inactivateShift(id: number) {
		return prisma.shift.update({
			where: { id: id, active: true },
			data: {
				active: false,
			},
		});
	}

	async activateShift(id: number) {
		return prisma.shift.update({
			where: { id: id, active: false },
			data: {
				active: true,
			},
		});
	}
}
