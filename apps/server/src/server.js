import Fastify from "fastify";
import cors from "@fastify/cors";
import { env } from "./config/env.js";
import { SyncService } from "./services/sync.service.js";
import { ProgressService } from "./services/progress.service.js";
import { MatchingService } from "./services/matching.service.js";
import { sqlite } from "./db/db.js";
const server = Fastify({
  logger: true
});
await server.register(cors, {
  origin: "*"
  // For local dev
});
const syncService = new SyncService();
const progressService = new ProgressService();
const matchingService = new MatchingService();
server.get("/api/health", async () => {
  return { status: "ok" };
});
server.post("/api/sync", async (request, reply) => {
  try {
    const { sessionCookie } = request.body || {};
    const result = await syncService.runSync(sessionCookie);
    return result;
  } catch (err) {
    server.log.error(err);
    reply.status(500).send({ error: "Sync failed", details: err.message });
  }
});
server.get("/api/progress", async () => {
  return await progressService.getTopicProgress();
});
server.get("/api/topics", async () => {
  const query = `
    SELECT 
      t.id as topicId,
      t.title as topicTitle,
      sq.id as questionId,
      sq.title as questionTitle,
      sq.difficulty as difficulty,
      sq.striver_link as striverLink,
      lq.title_slug as leetcodeSlug,
      CASE WHEN sr.id IS NOT NULL THEN 1 ELSE 0 END as isSolved
    FROM topics t
    JOIN striver_questions sq ON sq.topic_id = t.id
    LEFT JOIN striver_question_mappings sqm ON sqm.striver_question_id = sq.id
    LEFT JOIN leetcode_questions lq ON lq.id = sqm.leetcode_question_id
    LEFT JOIN solve_records sr ON sr.leetcode_question_id = lq.id
    ORDER BY t."order" ASC, sq.id ASC
  `;
  const result = await sqlite.execute(query);
  const topicsMap = /* @__PURE__ */ new Map();
  for (const row of result.rows) {
    const tId = row.topicId;
    if (!topicsMap.has(tId)) {
      topicsMap.set(tId, {
        id: tId,
        title: row.topicTitle,
        questions: []
      });
    }
    topicsMap.get(tId).questions.push({
      id: row.questionId,
      title: row.questionTitle,
      difficulty: row.difficulty,
      striverLink: row.striverLink,
      leetcodeSlug: row.leetcodeSlug,
      isSolved: Boolean(row.isSolved)
    });
  }
  return Array.from(topicsMap.values());
});
server.get("/api/unmatched", async () => {
  return await matchingService.getUnmatchedQuestions();
});
server.post("/api/link", async (request, reply) => {
  const { striverQuestionId, leetcodeSlug } = request.body;
  if (!striverQuestionId || !leetcodeSlug) {
    return reply.status(400).send({ error: "Missing parameters" });
  }
  return await matchingService.linkQuestion(striverQuestionId, leetcodeSlug);
});
const start = async () => {
  try {
    await server.listen({ port: parseInt(env.PORT, 10), host: "0.0.0.0" });
    console.log("Server listening on port " + env.PORT);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();
