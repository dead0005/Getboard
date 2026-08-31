import { db } from "../db/db.js";
import * as schema from "../db/schema.js";
import { LeetCodeClient } from "../external/leetcode.client.js";
import { eq, inArray } from "drizzle-orm";
class SyncService {
  client;
  constructor() {
    this.client = new LeetCodeClient();
  }
  async runSync() {
  async runSync(sessionCookie) {
    const [run] = await db.insert(schema.syncRuns).values({
      runAt: /* @__PURE__ */ new Date(),
      status: "running"
    }).returning();
    try {
      const solvedSlugs = await this.client.getSolvedQuestions();
      const solvedSlugs = await this.client.getSolvedQuestions(sessionCookie);
      let newSolvesCount = 0;
      if (solvedSlugs.length > 0) {
        const lcQuestions = await db.select().from(schema.leetcodeQuestions).where(inArray(schema.leetcodeQuestions.titleSlug, solvedSlugs));
        for (const q of lcQuestions) {
          const existing = await db.select().from(schema.solveRecords).where(eq(schema.solveRecords.leetcodeQuestionId, q.id));
          if (existing.length === 0) {
            await db.insert(schema.solveRecords).values({
              leetcodeQuestionId: q.id,
              solvedAt: /* @__PURE__ */ new Date()
            });
            newSolvesCount++;
          }
        }
      }
      await db.update(schema.syncRuns).set({ status: "success", problemsAdded: newSolvesCount }).where(eq(schema.syncRuns.id, run.id));
      return {
        success: true,
        problemsAdded: newSolvesCount,
        totalSolved: solvedSlugs.length
      };
    } catch (error) {
      await db.update(schema.syncRuns).set({ status: "failed" }).where(eq(schema.syncRuns.id, run.id));
      throw error;
    }
  }
}
export {
  SyncService
};
