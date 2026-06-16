const DATABASE_URL = process.env.DATABASE_URL;
const CHECKPOINT_DISABLE = process.env.CHECKPOINT_DISABLE;
const FASTIFY_ADDRESS = process.env.FASTIFY_ADDRESS;
const FASTIFY_PORT = process.env.FASTIFY_PORT;
const FASTIFY_CLOSE_GRACE_DELAY = process.env.FASTIFY_CLOSE_GRACE_DELAY;

export const env = () => {
  if (!DATABASE_URL || DATABASE_URL === "") {
    throw new Error("DATABASE_URL is not defined");
  }

  if (!CHECKPOINT_DISABLE) {
    throw new Error("CHECKPOINT_DISABLE is not defined");
  }

  return {
    DATABASE_URL,
    CHECKPOINT_DISABLE,
    FASTIFY_ADDRESS: FASTIFY_ADDRESS || "0.0.0.0",
    FASTIFY_PORT: FASTIFY_PORT ? Number(FASTIFY_PORT) : 3000,
    FASTIFY_CLOSE_GRACE_DELAY: FASTIFY_CLOSE_GRACE_DELAY ? Number(FASTIFY_CLOSE_GRACE_DELAY) : 2000,
  };
};
