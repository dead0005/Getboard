import { useQuery } from "@tanstack/react-query";
import { fetchTopics } from "../api/client";
import { CheckCircle2, Circle, ExternalLink } from "lucide-react";
import { clsx } from "clsx";
import { useState } from "react";
function QuestionsPage() {
  const { data: topics, isLoading } = useQuery({
    queryKey: ["topics"],
    queryFn: fetchTopics
  });
  const [expandedTopic, setExpandedTopic] = useState(null);
  if (isLoading) return <div className="p-8 text-gray-500">Loading questions...</div>;
  return <div className="p-8 max-w-5xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Striver A2Z Sheet</h2>

      <div className="space-y-4">
        {topics?.map((topic) => {
    const isExpanded = expandedTopic === topic.id;
    const solvedCount = topic.questions.filter((q) => q.isSolved).length;
    const totalCount = topic.questions.length;
    return <div key={topic.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <button
      onClick={() => setExpandedTopic(isExpanded ? null : topic.id)}
      className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
    >
                <div className="flex items-center gap-4">
                  <h3 className="font-semibold text-gray-900">{topic.title}</h3>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
                    {solvedCount} / {totalCount} Solved
                  </span>
                </div>
              </button>

              {isExpanded && <div className="border-t border-gray-200 divide-y divide-gray-100">
                  {topic.questions.map((q) => <div key={q.id} className="p-4 px-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        {q.isSolved ? <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" /> : <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />}
                        <div>
                          <p className={clsx("font-medium", q.isSolved ? "text-gray-900 line-through opacity-70" : "text-gray-900")}>
                            {q.title}
                          </p>
                          <div className="flex gap-2 mt-1">
                            <span className={clsx(
      "text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded",
      q.difficulty === "Easy" ? "bg-green-100 text-green-700" : q.difficulty === "Medium" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
    )}>
                              {q.difficulty}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {q.striverLink && <a href={q.striverLink} target="_blank" rel="noreferrer" className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Article/Video">
                            <ExternalLink className="w-4 h-4" />
                          </a>}
                        {q.leetcodeSlug && <a href={`https://leetcode.com/problems/${q.leetcodeSlug}`} target="_blank" rel="noreferrer" className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                            LeetCode
                          </a>}
                      </div>
                    </div>)}
                </div>}
            </div>;
  })}
      </div>
    </div>;
}
export {
  QuestionsPage
};
