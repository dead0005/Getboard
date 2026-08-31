import { sqlite } from "../db/db.js";
class ProgressService {
  async getTopicProgress() {
    const query = `
      SELECT 
        t.id as topicId,
        t.title as topicTitle,
        COUNT(DISTINCT sq.id) as totalQuestions,
        COUNT(DISTINCT CASE WHEN sr.id IS NOT NULL THEN sq.id END) as solvedQuestions
      FROM topics t
      LEFT JOIN striver_questions sq ON sq.topic_id = t.id
      LEFT JOIN striver_question_mappings sqm ON sqm.striver_question_id = sq.id
      LEFT JOIN solve_records sr ON sr.leetcode_question_id = sqm.leetcode_question_id
      GROUP BY t.id, t.title, t."order"
      ORDER BY t."order" ASC
    `;
    const result = await sqlite.execute(query);
    let totalQuestions = 0;
    let totalSolved = 0;
    const topics = result.rows.map((row) => {
      const total = Number(row.totalQuestions);
      const solved = Number(row.solvedQuestions);
      totalQuestions += total;
      totalSolved += solved;
      return {
        topicId: row.topicId,
        topicTitle: row.topicTitle,
        totalQuestions: total,
        solvedQuestions: solved
      };
    });
    return {
      overall: {
        totalQuestions,
        totalSolved,
        percentage: totalQuestions === 0 ? 0 : Math.round(totalSolved / totalQuestions * 100)
      },
      topics
    };
  }
  async getQuestionsByTopic() {
    const query = `
      SELECT 
        t.id as topicId,
        t.title as topicTitle,
        t."order" as topicOrder,
        sq.id as questionId,
        sq.title as questionTitle,
        sq.difficulty,
        sq.striver_link as striverLink,
        lq.title_slug as leetcodeSlug,
        CASE WHEN sr.id IS NOT NULL THEN 1 ELSE 0 END as isSolved
      FROM topics t
      LEFT JOIN striver_questions sq ON sq.topic_id = t.id
      LEFT JOIN striver_question_mappings sqm ON sqm.striver_question_id = sq.id
      LEFT JOIN leetcode_questions lq ON lq.id = sqm.leetcode_question_id
      LEFT JOIN solve_records sr ON sr.leetcode_question_id = sqm.leetcode_question_id
      ORDER BY t."order" ASC, sq.id ASC
    `;
    const result = await sqlite.execute(query);
    const topicsMap = /* @__PURE__ */ new Map();
    for (const row of result.rows) {
      if (!topicsMap.has(row.topicId)) {
        topicsMap.set(row.topicId, {
          id: row.topicId,
          title: row.topicTitle,
          questions: []
        });
      }
      if (row.questionId) {
        topicsMap.get(row.topicId).questions.push({
          id: row.questionId,
          title: row.questionTitle,
          difficulty: row.difficulty,
          striverLink: row.striverLink,
          leetcodeSlug: row.leetcodeSlug,
          isSolved: Boolean(row.isSolved)
        });
      }
    }
    return Array.from(topicsMap.values());
  }
}
export {
  ProgressService
};
