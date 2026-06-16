import { fastifyAutoload } from "@fastify/autoload";
import "dotenv/config";
import Fastify from "fastify";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { env } from "./utils/env.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fastify = Fastify({
  forceCloseConnections: true,
  logger:
    process.env.NODE_ENV === "production" ?
      {
        transport: {
          target: "@fastify/one-line-logger",
        },
      }
    : {
        transport: {
          target: "pino-pretty",
          options: {
            translateTime: "SYS:dd-mm-yyyy - hh:MM:ss TT",
          },
        },
      },
});

// This loads all plugins defined in plugins
fastify.register(fastifyAutoload, {
  dir: join(__dirname, "plugins"),
});

// This loads all plugins defined in routes
fastify.register(fastifyAutoload, {
  dir: join(__dirname, "routes"),
});

const closeGracefully = async (signal: string) => {
  fastify.log.info(`Received signal: ${signal}, shutting down gracefully`);

  const timeout = setTimeout(() => {
    fastify.log.error("Forced shutdown after timeout");
    process.exit(1);
  }, env().FASTIFY_CLOSE_GRACE_DELAY);

  try {
    await fastify.close();
  } catch (err) {
    fastify.log.error(err, "Error during shutdown");
    process.exit(1);
  }

  clearTimeout(timeout);
  process.exit(0);
};

process.on("SIGINT", closeGracefully);
process.on("SIGTERM", closeGracefully);

/**
 * Run the server!
 */
const start = async () => {
  try {
    const { FASTIFY_ADDRESS, FASTIFY_PORT } = env();
    await fastify.listen({ host: FASTIFY_ADDRESS, port: FASTIFY_PORT });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
