import { AttendanceType, CheckStatus, SummaryStatus } from '@prisma/client';
import { prisma } from '../libs/prismaClient';
import { AttendanceLogServices } from './attendanceLog.service';

type CheckinType = {
	shiftAssignmentId: number;
};

type CheckinStatusType = {
	checkinStatus: CheckStatus;
	lateDuration: number;
};

type CheckoutStatusType = {
	checkoutStatus: CheckStatus;
	lateCheckoutDuration: number;
	earlyLeaveDuration: number;
	workDuration: number;
};

interface CheckinDataInterface extends CheckinType, CheckinStatusType {
	checkinTime: Date;
	summaryStatus: SummaryStatus;
}

interface CheckoutDataInterface extends CheckinType, CheckoutStatusType {
	checkoutTime: Date;
}

const logService = new AttendanceLogServices();

export class AttendanceRecordServices {
	private async getUserTodayShift(shiftAssignmentId: number) {
		return prisma.shiftAssignment.findFirst({
			where: { id: shiftAssignmentId },
		});
	}

	private async getUserDailySummaryById(shiftAssignmentId: number) {
		return prisma.dailySummary.findFirst({
			where: { shift_assignment_id: shiftAssignmentId },
		});
	}

	private getTimeDifference(bigger: Date, smaller: Date): number {
		const diffMs = Math.abs(bigger.getTime() - smaller.getTime());
		const minutes = diffMs / (1000 * 60);
		return Math.round(minutes);
	}

	private getCheckinStatus(time: Date, shiftStart: Date): CheckinStatusType {
		let checkinStatus: CheckStatus;
		let lateDuration: number;
		if (time <= shiftStart) {
			checkinStatus = 'ontime';
			lateDuration = 0;
		} else {
			checkinStatus = 'late';
			lateDuration = this.getTimeDifference(time, shiftStart);
		}

		return {
			checkinStatus: checkinStatus,
			lateDuration: lateDuration,
		};
	}

	private getCheckoutStatus(time: Date, shiftEnd: Date, checkin: Date): CheckoutStatusType {
		const tolerance = shiftEnd;
		tolerance.setHours(tolerance.getHours() + 1);

		let checkoutStatus: CheckStatus;
		let earlyLeaveDuration = 0;
		let lateCheckoutDuration = 0;

		if (time < shiftEnd) {
			checkoutStatus = 'early_leave';
			earlyLeaveDuration = this.getTimeDifference(shiftEnd, time);
		} else if (shiftEnd <= time && time <= tolerance) {
			checkoutStatus = 'ontime';
		} else {
			checkoutStatus = 'late_checkout';
			lateCheckoutDuration = this.getTimeDifference(tolerance, time);
		}

		const workDuration = this.getTimeDifference(time, checkin);

		return {
			checkoutStatus: checkoutStatus,
			earlyLeaveDuration: earlyLeaveDuration,
			lateCheckoutDuration: lateCheckoutDuration,
			workDuration: workDuration,
		};
	}

	private updateCheckinDailySummary(data: CheckinDataInterface) {
		const { shiftAssignmentId, checkinTime, checkinStatus, lateDuration, summaryStatus } = data;

		return prisma.dailySummary.create({
			data: {
				shift_assignment_id: shiftAssignmentId,
				checkin_time: checkinTime,
				checkin_status: checkinStatus,
				late_duration: lateDuration,
				summary_status: summaryStatus,
			},
		});
	}

	private updateCheckoutDailySummary(data: CheckoutDataInterface) {
		const { shiftAssignmentId, checkoutTime, checkoutStatus, workDuration, lateCheckoutDuration, earlyLeaveDuration } = data;

		return prisma.dailySummary.update({
			where: { shift_assignment_id: shiftAssignmentId },
			data: {
				checkout_time: checkoutTime,
				checkout_status: checkoutStatus,
				work_duration: workDuration,
				overtime_duration: lateCheckoutDuration,
				early_leave_duration: earlyLeaveDuration,
			},
		});
	}

	async userTap(data: CheckinType) {
		let category: AttendanceType;
		const shiftAssignmentId = data.shiftAssignmentId;
		const userTodayShift = await this.getUserTodayShift(shiftAssignmentId);
		if (userTodayShift) {
			const currentTime = new Date();
			const dailySummary = await this.getUserDailySummaryById(shiftAssignmentId);

			if (!dailySummary) {
				category = 'checkin';
				const status = this.getCheckinStatus(currentTime, userTodayShift.shift_start);

				const updateDailySummary = await this.updateCheckinDailySummary({
					...status,
					shiftAssignmentId: shiftAssignmentId,
					checkinTime: currentTime,
					summaryStatus: 'present',
				});

				const log = await logService.createAttendanceLog({
					shiftAssignmentId: shiftAssignmentId,
					record: currentTime,
					category: category,
					status: status.checkinStatus,
				});

				return {
					dailySummary,
					log,
				};
			} else if (dailySummary && !dailySummary.checkout_time) {
				category = 'checkout';
				const status = this.getCheckoutStatus(currentTime, userTodayShift.shift_end, dailySummary.checkin_time);

				const updateDailySummary = await this.updateCheckoutDailySummary({
					...status,
					shiftAssignmentId: shiftAssignmentId,
					checkoutTime: currentTime,
				});

        const log = await logService.createAttendanceLog({
					shiftAssignmentId: shiftAssignmentId,
					record: currentTime,
					category: category,
					status: status.checkoutStatus,
				});

				return {
					updateDailySummary,
					log,
				};
			} else {
				return 'Allready Checkout';
			}
		} else {
			return 'User has no shift';
		}
	}
}
