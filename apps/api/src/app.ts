import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { env } from "./env";
import { bookings } from "./routes/bookings";
import { health } from "./routes/health";
import { physicians } from "./routes/physicians";

export const app = new Hono()
  .use("*", logger())
  .use(
    "/api/*",
    cors({
      origin: env.CORS_ORIGINS.split(",").map((origin) => origin.trim()),
      allowMethods: ["GET", "POST", "PATCH", "OPTIONS"],
      allowHeaders: ["Content-Type"]
    })
  )
  .route("/api", health)
  .route("/api/physicians", physicians)
  .route("/api/bookings", bookings);

export type AppType = typeof app;
