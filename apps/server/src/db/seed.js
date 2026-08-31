import { db } from "./db.js";
import * as schema from "./schema.js";
import fs from "fs";
import { eq } from "drizzle-orm";
const dataPath = "C:/Users/iamvi/.gemini/antigravity/brain/b0f6d472-2db1-4e45-a8bb-df5b1fc7c0bd/scratch/striver-a2z.json";
async function main() {
  console.log("Reading seed data from", dataPath);
  const dataRaw = fs.readFileSync(dataPath, "utf-8");
  const striverData = JSON.parse(dataRaw);
  console.log("Clearing database tables...");
  await db.delete(schema.solveRecords);
  await db.delete(schema.syncRuns);
  await db.delete(schema.striverQuestionMappings);
  await db.delete(schema.leetcodeQuestions);
  await db.delete(schema.striverQuestions);
  await db.delete(schema.topics);
  let lcQuestionsInserted = 0;
  let striverQuestionsInserted = 0;
  console.log("Seeding topics and questions...");
  const topicIdMap = /* @__PURE__ */ new Map();
  for (const topic of striverData.topics) {
    const topicId = topic.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + topic.id;
    topicIdMap.set(topic.id, topicId);
    await db.insert(schema.topics).values({
      id: topicId,
      title: topic.name,
      order: topic.order_index
    });
  }
  for (const q of striverData.questions) {
    let lcId = null;
    const mappedTopicId = topicIdMap.get(q.topic_id);
    if (!mappedTopicId) continue;
    if (q.leetcode_slug) {
      const existing = await db.select().from(schema.leetcodeQuestions).where(eq(schema.leetcodeQuestions.titleSlug, q.leetcode_slug));
      if (existing.length === 0) {
        const insertedLc = await db.insert(schema.leetcodeQuestions).values({
          titleSlug: q.leetcode_slug,
          title: q.title
        }).returning();
        lcId = insertedLc[0].id;
        lcQuestionsInserted++;
      } else {
        lcId = existing[0].id;
      }
    }
    const insertedStriver = await db.insert(schema.striverQuestions).values({
      topicId: mappedTopicId,
      title: q.title,
      striverSlug: q.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      difficulty: q.difficulty || "Medium",
      striverLink: q.striver_url || null
    }).returning();
    const stId = insertedStriver[0].id;
    striverQuestionsInserted++;
    if (lcId !== null) {
      await db.insert(schema.striverQuestionMappings).values({
        striverQuestionId: stId,
        leetcodeQuestionId: lcId,
        mappingType: "exact"
      });
    }
  }
  console.log("Seeding complete! Inserted " + striverQuestionsInserted + " Striver questions and " + lcQuestionsInserted + " LeetCode mappings.");
  process.exit(0);
}
main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
