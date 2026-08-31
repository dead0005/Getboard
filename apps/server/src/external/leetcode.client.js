import { env } from "../config/env.js";

const LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql";

export class LeetCodeClient {
  getHeaders(dynamicSessionCookie) {
    const headers = {
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      "Referer": "https://leetcode.com/problemset/all/"
    };
    
    const session = dynamicSessionCookie || env.LEETCODE_SESSION;
    
    if (session) {
      headers["Cookie"] = `LEETCODE_SESSION=${session};`;
      if (env.LEETCODE_CSRF_TOKEN) {
        headers["Cookie"] += ` csrftoken=${env.LEETCODE_CSRF_TOKEN};`;
        headers["x-csrftoken"] = env.LEETCODE_CSRF_TOKEN;
      }
    }
    return headers;
  }

  async getSolvedQuestions(dynamicSessionCookie) {
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
      limit: 10000,
      filters: {}
    };
    const response = await fetch(LEETCODE_GRAPHQL_URL, {
      method: "POST",
      headers: this.getHeaders(dynamicSessionCookie),
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
