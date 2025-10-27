import { prisma } from '../libs/prismaClient';
import { AttendanceType, AttendanceStatus, Prisma } from '@prisma/client';

export type AttendanceFilterType = {
	shiftAssignmentId: number | null;
	category: AttendanceType | null;
	status: AttendanceStatus | null;
	dateStart: Date | null;
	dateEnd: Date | null;
	employeeName: string | null;
};

type AttendanceLogType = {
	shiftAssignmentId: number;
	record: Date;
	category: AttendanceType;
	status: AttendanceStatus;
};

type AttendanceLogUpdate = {
	id: number;
	record: Date;
	category: AttendanceType;
	status: AttendanceStatus;
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
		const where: Prisma.AttendanceLogWhereInput = {};

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

		if (filter.employeeName) {
			where.shift_assignment = {
				user: {
					name: {
						contains: filter.employeeName,
					},
				},
			};
		}

		return prisma.attendanceLog.findMany({
			select: attendanceData,
			where: where,
			orderBy: {
				record: 'desc',
			},
		});
	}

	async createAttendanceLog(data: AttendanceLogType) {
		const { shiftAssignmentId, record, category, status } = data;

		return prisma.attendanceLog.create({
			data: {
				shift_assignment_id: shiftAssignmentId,
				record: record,
				category: category,
				status: status,
			},
		});
	}

	async updateArbitraryLog(data: AttendanceLogUpdate) {
		const { id, record, category, status } = data;

		return prisma.attendanceLog.update({
			where: { id: id },
			data: {
				record: record,
				category: category,
				status: status,
			},
		});
	}
}

