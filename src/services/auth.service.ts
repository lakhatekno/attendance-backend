import { prisma } from "../libs/prismaClient";

type LoginType = {
  username: string;
  password: string;
}

export class AuthServices {
  async login(data: LoginType) {

  }

  async logout(token: string) {

  }

  async refresh(data: LoginType) {
    
  }
}