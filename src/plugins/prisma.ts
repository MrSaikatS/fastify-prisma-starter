import { PrismaLibSql } from "@prisma/adapter-libsql";
import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { PrismaClient } from "../generated/prisma/client.js";
import { env } from "../utils/env.js";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

const prisma: FastifyPluginAsync = fp(async (fastify) => {
  const adapter = new PrismaLibSql({
    url: env().DATABASE_URL,
  });

  const prisma = new PrismaClient({
    log: ["error", "warn"],
    adapter,
  });

  await prisma.$connect();

  fastify.decorate("prisma", prisma);

  fastify.addHook("onClose", async (fastify) => {
    await fastify.prisma.$disconnect();
  });
});

export default prisma;
