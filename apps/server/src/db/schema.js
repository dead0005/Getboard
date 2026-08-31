import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";
const topics = sqliteTable("topics", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  order: integer("order").notNull()
});
const striverQuestions = sqliteTable("striver_questions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  topicId: text("topic_id").notNull().references(() => topics.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  striverSlug: text("striver_slug").notNull(),
  difficulty: text("difficulty").notNull(),
  striverLink: text("striver_link")
});
const leetcodeQuestions = sqliteTable("leetcode_questions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  titleSlug: text("title_slug").notNull().unique(),
  title: text("title").notNull()
});
const striverQuestionMappings = sqliteTable("striver_question_mappings", {
  striverQuestionId: integer("striver_question_id").notNull().references(() => striverQuestions.id, { onDelete: "cascade" }),
  leetcodeQuestionId: integer("leetcode_question_id").notNull().references(() => leetcodeQuestions.id, { onDelete: "cascade" }),
  mappingType: text("mapping_type").notNull()
}, (t) => ({
  pk: primaryKey({ columns: [t.striverQuestionId, t.leetcodeQuestionId] })
}));
const syncRuns = sqliteTable("sync_runs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  runAt: integer("run_at", { mode: "timestamp" }).notNull(),
  status: text("status").notNull(),
  problemsAdded: integer("problems_added").default(0)
});
const solveRecords = sqliteTable("solve_records", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  leetcodeQuestionId: integer("leetcode_question_id").notNull().references(() => leetcodeQuestions.id, { onDelete: "cascade" }),
  solvedAt: integer("solved_at", { mode: "timestamp" }).notNull()
});
export {
  leetcodeQuestions,
  solveRecords,
  striverQuestionMappings,
  striverQuestions,
  syncRuns,
  topics
};
