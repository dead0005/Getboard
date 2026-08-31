import { env } from "../config/env.js";
const LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql";
class LeetCodeClient {
  getHeaders() {
    const headers = {
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      "Referer": "https://leetcode.com/problemset/all/"
    };
    if (env.LEETCODE_SESSION) {
      headers["Cookie"] = `LEETCODE_SESSION=${env.LEETCODE_SESSION};`;
      if (env.LEETCODE_CSRF_TOKEN) {
        headers["Cookie"] += ` csrftoken=${env.LEETCODE_CSRF_TOKEN};`;
        headers["x-csrftoken"] = env.LEETCODE_CSRF_TOKEN;
      }
    }
    return headers;
  }
  async getSolvedQuestions() {
    const query = `
      query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
        problemsetQuestionList: questionList(
          categorySlug: $categorySlug
          limit: $limit
          skip: $skip
          filters: $filters
        ) {
          total: totalNum
          questions: data {
            titleSlug
            status
          }
        }
      }
    `;
    const variables = {
      categorySlug: "",
      skip: 0,
      limit: 1e4,
      filters: {}
    };
    const response = await fetch(LEETCODE_GRAPHQL_URL, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({
        query,
        variables
      })
    });
    if (!response.ok) {
      throw new Error(`LeetCode API error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    if (data.errors) {
      console.error(data.errors);
      throw new Error("LeetCode GraphQL returned errors");
    }
    const questions = data.data?.problemsetQuestionList?.questions || [];
    const solvedSlugs = questions.filter((q) => q.status === "ac").map((q) => q.titleSlug);
    return solvedSlugs;
  }
}
export {
  LeetCodeClient
};
