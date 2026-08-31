import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUnmatched, linkQuestion } from "../api/client";
import { Link2, AlertCircle } from "lucide-react";
import { clsx } from "clsx";
function UnmatchedPage() {
  const queryClient = useQueryClient();
  const { data: questions, isLoading } = useQuery({
    queryKey: ["unmatched"],
    queryFn: fetchUnmatched
  });
  const mutation = useMutation({
    mutationFn: linkQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unmatched"] });
      queryClient.invalidateQueries({ queryKey: ["topics"] });
      queryClient.invalidateQueries({ queryKey: ["progress"] });
    }
  });
  const [slugInputs, setSlugInputs] = useState({});
  const handleLink = (striverQuestionId) => {
    const slug = slugInputs[striverQuestionId]?.trim();
    if (!slug) return;
    let leetcodeSlug = slug;
    if (slug.includes("leetcode.com/problems/")) {
      const match = slug.match(/problems\/([^\/]+)/);
      if (match) leetcodeSlug = match[1];
    }
    mutation.mutate({ striverQuestionId, leetcodeSlug });
  };
  if (isLoading) return <div className="p-8 text-gray-500">Loading unmatched questions...</div>;
  if (questions?.length === 0) {
    return <div className="p-8 max-w-4xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 text-green-600 mb-2">
          <Link2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">All Caught Up!</h2>
        <p className="text-gray-500">
          Every Striver question is currently mapped to a LeetCode problem.
        </p>
      </div>;
  }
  return <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Unmatched Questions</h2>
          <p className="text-sm text-gray-500 mt-1">
            {questions?.length} questions missing a LeetCode mapping
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-xl p-4 flex gap-3 text-sm">
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <p>
          Some questions on Striver's A2Z sheet don't exist on LeetCode (e.g. GeeksForGeeks or CodingNinjas specific), or they have different names. You can paste the LeetCode slug (or full URL) below to manually link them.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm divide-y divide-gray-100">
        {questions?.map((q) => <div key={q.id} className="p-4 px-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
            
            <div>
              <p className="text-sm text-gray-500 mb-1">{q.topicTitle}</p>
              <a href={q.striverLink} target="_blank" rel="noreferrer" className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                {q.title}
              </a>
              <div className="flex gap-2 mt-2">
                <span className={clsx(
    "text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded",
    q.difficulty === "Easy" ? "bg-green-100 text-green-700" : q.difficulty === "Medium" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
  )}>
                  {q.difficulty}
                </span>
              </div>
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <input
    type="text"
    placeholder="LeetCode slug or URL..."
    value={slugInputs[q.id] || ""}
    onChange={(e) => setSlugInputs({ ...slugInputs, [q.id]: e.target.value })}
    className="flex-1 md:w-64 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
  />
              <button
    onClick={() => handleLink(q.id)}
    disabled={!slugInputs[q.id] || mutation.isPending}
    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
  >
                Link
              </button>
            </div>
            
          </div>)}
      </div>
    </div>;
}
export {
  UnmatchedPage
};
