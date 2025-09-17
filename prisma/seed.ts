import { PrismaClient, Role, Category, Status } from '@prisma/client';
import { hashPassword } from '../src/libs/crypto';

const prisma = new PrismaClient();

async function main() {
	console.log('seeding database ⌛');

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

	// Attendance Logs
	await prisma.attendanceLog.createMany({
		data: [
			{
				user_id: user1.id,
				category: Category.checkin,
				status: Status.ontime,
			},
			{
				user_id: user1.id,
				category: Category.checkout,
				status: Status.early,
			},
			{
				user_id: user2.id,
				category: Category.checkin,
				status: Status.late,
			},
		],
	});

	// Refresh Tokens
	await prisma.refreshToken.createMany({
		data: [
			{
				user_id: admin.id,
				refresh: 'refresh_token_admin',
				expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
			},
			{
				user_id: user1.id,
				refresh: 'refresh_token_user1',
				expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
			},
			{
				user_id: user2.id,
				refresh: 'refresh_token_user2',
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
