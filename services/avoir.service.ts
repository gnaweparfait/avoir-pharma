import { prisma } from "@/lib/prisma";

export const AvoirService = {
  findAll: () => prisma.avoir.findMany(),

  create: (data: any) =>
    prisma.avoir.create({ data }),

  findById: (id: number) =>
    prisma.avoir.findUnique({ where: { id } }),

  update: (id: number, data: any) =>
    prisma.avoir.update({ where: { id }, data }),

  delete: (id: number) =>
    prisma.avoir.delete({ where: { id } }),
};