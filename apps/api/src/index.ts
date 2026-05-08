import { env } from "./env";
import { app } from "./app";

export default {
  port: env.API_PORT,
  fetch: app.fetch
};

console.log(`Hono on Bun -> http://localhost:${env.API_PORT}`);
