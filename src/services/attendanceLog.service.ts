import { prisma } from '../libs/prismaClient';
import { AttendanceType, AttendanceStatus } from '@prisma/client';

export type AttendanceFilterType = {
	shiftAssignmentId: number | null;
	category: AttendanceType | null;
	status: AttendanceStatus | null;
	dateStart: Date | null;
	dateEnd: Date | null;
	employeeName: string | null;
};

const attendanceData: any = {
	id: true,
	record: true,
	category: true,
	status: true,
	shift_assignment: {
		select: {
			user: {
				select: {
					id: true,
					name: true,
				},
			},
		},
	},
};

export class AttendanceLogServices {
	async getAllLogs() {
		return prisma.attendanceLog.findMany({
			select: attendanceData,
		});
	}

	async getFilteredLogs(filter: AttendanceFilterType) {
		const where: any = {};

		if (filter.shiftAssignmentId) {
			where.shift_assignment_id = filter.shiftAssignmentId;
		}

		if (filter.category) {
			where.category = filter.category;
		}

		if (filter.status) {
			where.status = filter.status;
		}

		if (filter.dateStart || filter.dateEnd) {
			where.record = {};
			if (filter.dateStart) {
				where.record.gte = filter.dateStart;
			}
			if (filter.dateEnd) {
				where.record.lte = filter.dateEnd;
			}
		}

		const relationFilter: any = {};
		if (filter.employeeName) {
			relationFilter.shift_assignment = {
				user: {
					name: {
						contains: filter.employeeName,
						mode: 'insensitive',
					},
				},
			};
		}

		return prisma.attendanceLog.findMany({
			select: attendanceData,
			where: {
				...where,
				...relationFilter,
			},
			orderBy: {
				record: 'desc',
			},
		});
	}
}
