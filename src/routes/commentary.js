import { Router } from "express";
import { db } from "../db/db.js";
import { commentary } from "../db/schema.js";
import { desc, eq } from "drizzle-orm";
import { matchIdParamsSchema } from "../validation/matches.js";
import { listCommentaryQuerySchema } from "../validation/commentary.js";

export const commentaryRouter = Router({ mergeParams: true });

const MAX_LIMIT = 100;

commentaryRouter.get("/", async (req, res) => {
  try {
    const paramResult = matchIdParamsSchema.safeParse(req.params);
    const queryResult = listCommentaryQuerySchema.safeParse(req.query);

    if (!paramResult.success || !queryResult.success) {
      return res.status(400).json({
        error: "Invalid request data",
        details: {
          params: paramResult.success ? null : paramResult.error.flatten(),
          query: queryResult.success ? null : queryResult.error.flatten(),
        },
      });
    }

    const { id: matchId } = paramResult.data;
    const limit = Math.min(queryResult.data.limit ?? 100, MAX_LIMIT);

    const data = await db
      .select()
      .from(commentary)
      .where(eq(commentary.matchId, matchId))
      .orderBy(desc(commentary.createdAt))
      .limit(limit);

    res.json({ data });
  } catch (error) {
    console.error("Error fetching commentary:", error);
    res.status(500).json({ error: "Failed to fetch commentary" });
  }
});
