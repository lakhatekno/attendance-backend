import { prisma } from '../libs/prismaClient';
import { verifyPassword } from '../libs/crypto';
import { generateAccessToken, generateRefreshToken } from '../libs/jwt';
import { HttpError } from '../libs/httpError';

export type LoginType = {
	username: string;
	password: string;
};

export class AuthServices {
	async login(data: LoginType) {
		const user = await prisma.user.findUnique({
			where: { username: data.username },
		});
		if (!user) {
			throw new HttpError(404, 'User not found');
		}

		const valid = await verifyPassword(data.password, user.password);
		if (!valid) {
			throw new HttpError(401, 'Password incorrect');
		}

		const accessToken = generateAccessToken({ id: user.id, role: user.role });
		const refreshToken = generateRefreshToken({ id: user.id });

		await prisma.refreshToken.create({
			data: {
				user_id: user.id,
				token: refreshToken,
				expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
			},
		});

		return {
			role: user.role,
			accessToken: accessToken,
			refreshToken: refreshToken,
		};
	}

	async logout(token: string) {
		const result = await prisma.refreshToken.updateMany({
			where: { token: token },
			data: {
				revoked: true,
			},
		});

		if (result.count === 0) {
			throw new HttpError(404, 'Token not found');
		}

		return { message: 'Logged Out' };
	}

	async refresh(refreshToken: string) {
		const stored = await prisma.refreshToken.findUnique({
			where: { token: refreshToken },
		});
		if (!stored || stored.revoked) {
			throw new HttpError(401, 'Invalid refresh token');
		}
		if (stored && stored.expires_at < new Date()) {
			throw new HttpError(401, 'Token expired');
		}

		const user = await prisma.user.findUnique({
			where: { id: stored.user_id },
		});
		if (!user) {
			throw new HttpError(404, 'User not found');
		}

		const accessToken = generateAccessToken({ id: user.id, role: user.role });

		return { accessToken };
	}
}

