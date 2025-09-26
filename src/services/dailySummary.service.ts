import { Prisma } from '@prisma/client';
import { prisma } from '../libs/prismaClient';

export type filterType = {
	dateStart: Date | null;
	dateEnd: Date | null;
	name: string | null;
};

const simpleField: Prisma.DailySummarySelect = {
	id: true,
	checkin_time: true,
	checkin_status: true,
	checkout_time: true,
	checkout_status: true,
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

const detailField: Prisma.DailySummarySelect = {
	...simpleField,
	work_duration: true,
	late_duration: true,
	overtime_duration: true,
	early_leave_duration: true,
};

export class DailySummaryServices {
	private buildDailySummaryFilter(filter: filterType): Prisma.DailySummaryWhereInput {
		const whereQuery: Prisma.DailySummaryWhereInput = {};

		if (filter.dateStart || filter.dateEnd) {
			whereQuery.checkin_time = {};
			if (filter.dateStart) {
				whereQuery.checkin_time.gte = filter.dateStart;
			}
			if (filter.dateEnd) {
				whereQuery.checkin_time.lte = filter.dateEnd;
			}
		}

		if (filter.name) {
			whereQuery.shift_assignment = {
				user: {
					name: {
						contains: filter.name,
					},
				},
			};
		}

		return whereQuery;
	}

	async getSimpleAllSummary() {
		return prisma.dailySummary.findMany({
			select: simpleField,
		});
	}

	async getDetailAllSummary() {
		return prisma.dailySummary.findMany({
			select: detailField,
		});
	}

	async getSimpleFilteredSummary(filter: filterType) {
		return prisma.dailySummary.findMany({
			select: simpleField,
			where: this.buildDailySummaryFilter(filter),
		});
	}

	async getDetailFilteredSummary(filter: filterType) {
		return prisma.dailySummary.findMany({
			select: detailField,
			where: this.buildDailySummaryFilter(filter),
		});
	}
}
