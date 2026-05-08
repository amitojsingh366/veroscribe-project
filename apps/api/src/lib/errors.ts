import type { Context } from "hono";

export function validationError(c: Context, issues: unknown) {
  return c.json({ error: "ValidationError", issues }, 400);
}
