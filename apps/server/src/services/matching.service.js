import { sqlite, db } from "../db/db.js";
import * as schema from "../db/schema.js";
import { eq } from "drizzle-orm";
class MatchingService {
  async getUnmatchedQuestions() {
    const query = `
      SELECT sq.id, sq.title, sq.difficulty, sq.striver_link as striverLink, t.title as topicTitle
      FROM striver_questions sq
      JOIN topics t ON t.id = sq.topic_id
      LEFT JOIN striver_question_mappings sqm ON sqm.striver_question_id = sq.id
      WHERE sqm.striver_question_id IS NULL
      ORDER BY t."order" ASC, sq.id ASC
    `;
    const result = await sqlite.execute(query);
    return result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      difficulty: row.difficulty,
      striverLink: row.striverLink,
      topicTitle: row.topicTitle
    }));
  }
  async linkQuestion(striverQuestionId, leetcodeSlug) {
    let lcQuestions = await db.select().from(schema.leetcodeQuestions).where(eq(schema.leetcodeQuestions.titleSlug, leetcodeSlug));
    let lcId;
    if (lcQuestions.length === 0) {
      const inserted = await db.insert(schema.leetcodeQuestions).values({
        titleSlug: leetcodeSlug,
        title: leetcodeSlug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
      }).returning();
      lcId = inserted[0].id;
    } else {
      lcId = lcQuestions[0].id;
    }
    await db.insert(schema.striverQuestionMappings).values({
      striverQuestionId,
      leetcodeQuestionId: lcId,
      mappingType: "manual"
    });
    return { success: true };
  }
}
export {
  MatchingService
};
