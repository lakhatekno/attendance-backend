import bcrypt from 'bcrypt';

const saltRound = 20;

export async function hashPassword(password: string): Promise<string> {
	return bcrypt.hash(password, saltRound);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
	return bcrypt.compare(password, hash);
}
