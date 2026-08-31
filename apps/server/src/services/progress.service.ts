import { sqlite } from '../db/db.js';

export interface TopicProgress {
  topicId: string;
  topicTitle: string;
  totalQuestions: number;
  solvedQuestions: number;
}

export class ProgressService {
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
    
    const topics: TopicProgress[] = result.rows.map(row => {
      const total = Number(row.totalQuestions);
      const solved = Number(row.solvedQuestions);
      totalQuestions += total;
      totalSolved += solved;
      
      return {
        topicId: row.topicId as string,
        topicTitle: row.topicTitle as string,
        totalQuestions: total,
        solvedQuestions: solved,
      };
    });

    return {
      overall: {
        totalQuestions,
        totalSolved,
        percentage: totalQuestions === 0 ? 0 : Math.round((totalSolved / totalQuestions) * 100)
      },
      topics
    };
  }
}

