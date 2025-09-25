import { PrismaClient, Role, AttendaceType, AttendanceStatus, CheckStatus, SummaryStatus } from '@prisma/client';
import { hashPassword } from '../src/libs/crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('seeding database ⌛');

  // --- USERS ---
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      username: 'admin',
      password: await hashPassword('password123'),
      name: 'Admin 1',
      role: Role.admin,
    },
  });

  const user1 = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      username: 'alice',
      password: await hashPassword('password123'),
      name: 'Alice Johnson',
      role: Role.user,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      username: 'bob',
      password: await hashPassword('password123'),
      name: 'Bob Smith',
      role: Role.user,
    },
  });

  // --- SHIFTS ---
  const morningShift = await prisma.shift.create({
    data: {
      name: 'Morning Shift',
      shift_start: new Date('2025-09-13T08:00:00'),
      shift_end: new Date('2025-09-13T16:00:00'),
      cross_day: false,
    },
  });

  const eveningShift = await prisma.shift.create({
    data: {
      name: 'Evening Shift',
      shift_start: new Date('2025-09-13T13:00:00'),
      shift_end: new Date('2025-09-13T21:00:00'),
      cross_day: false,
    },
  });

  // --- SHIFT ASSIGNMENTS ---
  const assign1 = await prisma.shiftAssignment.create({
    data: {
      user_id: user1.id,
      shift_id: morningShift.id,
      shift_start: new Date('2025-09-13T08:00:00'),
      shift_end: new Date('2025-09-13T16:00:00'),
    },
  });

  const assign2 = await prisma.shiftAssignment.create({
    data: {
      user_id: user2.id,
      shift_id: eveningShift.id,
      shift_start: new Date('2025-09-13T13:00:00'),
      shift_end: new Date('2025-09-13T21:00:00'),
    },
  });

  // --- ATTENDANCE LOGS ---
  await prisma.attendanceLog.createMany({
    data: [
      {
        shift_assignment_id: assign1.id,
        category: AttendaceType.checkin,
        status: AttendanceStatus.ontime,
        record: new Date('2025-09-13T08:01:00'),
      },
      {
        shift_assignment_id: assign1.id,
        category: AttendaceType.checkout,
        status: AttendanceStatus.ontime,
        record: new Date('2025-09-13T16:02:00'),
      },
      {
        shift_assignment_id: assign2.id,
        category: AttendaceType.checkin,
        status: AttendanceStatus.late,
        record: new Date('2025-09-13T13:15:00'),
      },
      {
        shift_assignment_id: assign2.id,
        category: AttendaceType.checkout,
        status: AttendanceStatus.early_leave,
        record: new Date('2025-09-13T20:30:00'),
      },
    ],
  });

  // --- DAILY SUMMARY ---
  await prisma.dailySummary.createMany({
    data: [
      {
        shift_assignment_id: assign1.id,
        checkin_time: new Date('2025-09-13T08:01:00'),
        checkout_time: new Date('2025-09-13T16:02:00'),
        checkin_status: CheckStatus.ontime,
        checkout_status: CheckStatus.ontime,
        summary_status: SummaryStatus.present,
        work_duration: 8 * 60, // minutes
        late_duration: 0,
        overtime_duration: 2,
        early_leave_duration: 0,
      },
      {
        shift_assignment_id: assign2.id,
        checkin_time: new Date('2025-09-13T13:15:00'),
        checkout_time: new Date('2025-09-13T20:30:00'),
        checkin_status: CheckStatus.late,
        checkout_status: CheckStatus.early_leave,
        summary_status: SummaryStatus.half_day,
        work_duration: 7 * 60 + 15,
        late_duration: 15,
        overtime_duration: 0,
        early_leave_duration: 30,
      },
    ],
  });

  // --- REFRESH TOKENS ---
  await prisma.refreshToken.createMany({
    data: [
      {
        user_id: admin.id,
        token: 'refresh_token_admin',
        expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      },
      {
        user_id: user1.id,
        token: 'refresh_token_user1',
        expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      },
      {
        user_id: user2.id,
        token: 'refresh_token_user2',
        expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      },
    ],
  });

  console.log('Seeding finished 🙏');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
