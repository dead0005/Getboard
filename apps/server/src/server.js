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
  const result = await progressService.getTopicProgress();
  return result;
});

server.get("/api/topics", async () => {
  const topics = await progressService.getTopics();
  return topics;
});

server.get("/api/unmatched", async () => {
  const unmatched = await matchingService.getUnmatchedStriverQuestions();
  return unmatched;
});

server.post("/api/link", async (request, reply) => {
  try {
    const { striverQuestionId, leetcodeSlug } = request.body;
    await matchingService.linkQuestion(striverQuestionId, leetcodeSlug);
    return { success: true };
  } catch (err) {
    server.log.error(err);
    reply.status(500).send({ error: "Failed to link question" });
  }
});

const start = async () => {
  try {
    await server.listen({ port: parseInt(env.PORT), host: "0.0.0.0" });
    console.log(`Server listening on port ${env.PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
