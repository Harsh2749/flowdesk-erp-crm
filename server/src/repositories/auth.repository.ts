import { Prisma, Role, User } from '@prisma/client';
import { prisma } from '../config/prisma';

export const authRepository = {
  findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  },

  findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  },

  create(data: { name: string; email: string; passwordHash: string; role: Role }): Promise<User> {
    return prisma.user.create({ data });
  },

  createMany(data: Prisma.UserCreateManyInput[]): Promise<Prisma.BatchPayload> {
    return prisma.user.createMany({ data, skipDuplicates: true });
  },
};
