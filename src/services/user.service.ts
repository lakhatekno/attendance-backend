import { prisma } from '../libs/prismaClient';
import { hashPassword } from '../libs/crypto';
import { Role } from '@prisma/client';

type userType = {
	email: string;
	username: string;
	password: string;
	name: string;
	role: Role;
};

interface updateUser extends userType {
	id: string;
}

interface createUser extends userType {
	id: string | undefined;
}

export class UserServices {
	async getAllUsers() {
		return prisma.user.findMany({
			select: {
				id: true,
				email: true,
				username: true,
				name: true,
				role: true,
			},
			where: {
				role: Role.user,
        active: true,
			},
		});
	}

	async createUser(data: createUser) {
		const hashed = await hashPassword(data.password);
		return prisma.user.create({
			data: {
        ...(data.id ? { id: data.id } : {}),
				email: data.email,
				username: data.username,
				password: hashed,
				name: data.name,
				role: data.role,
			},
		});
	}

	async createUsers(data: userType[]) {
		const hashedPassword = await Promise.all(
			data.map(async (user) => ({
				email: user.email,
				username: user.username,
				password: await hashPassword(user.password),
				name: user.name,
				role: user.role,
			}))
		);

		return prisma.user.createMany({
			data: hashedPassword,
			skipDuplicates: true,
		});
	}

	async updateUserInfo(data: updateUser) {
		return prisma.user.update({
			where: { id: data.id },
			data: {
				name: data.name,
				username: data.username,
				role: data.role,
				email: data.email,
			},
		});
	}

	async deleteUser(id: string) {
		return prisma.user.update({
			where: { id: id },
      data: {
        active: false,
      }
		});
	}
}
