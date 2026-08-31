import { useQuery } from '@tanstack/react-query';
import { fetchProgress } from '../api/client';
import { CheckCircle2, Target, TrendingUp } from 'lucide-react';

export function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['progress'],
    queryFn: fetchProgress
  });

  if (isLoading) return <div className="p-8 text-gray-500">Loading dashboard...</div>;
  if (error) return <div className="p-8 text-red-500">Error loading dashboard</div>;

  const { overall, topics } = data;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Your Progress</h2>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Completion Rate</p>
            <p className="text-2xl font-bold text-gray-900">{overall.percentage}%</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Problems Solved</p>
            <p className="text-2xl font-bold text-gray-900">{overall.totalSolved}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Questions</p>
            <p className="text-2xl font-bold text-gray-900">{overall.totalQuestions}</p>
          </div>
        </div>
      </div>

      {/* Topic Breakdown */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Topic Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map((topic: any) => {
            const pct = topic.totalQuestions === 0 ? 0 : Math.round((topic.solvedQuestions / topic.totalQuestions) * 100);
            return (
              <div key={topic.topicId} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900 line-clamp-1" title={topic.topicTitle}>{topic.topicTitle}</h4>
                  <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                    {pct}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">{topic.solvedQuestions} of {topic.totalQuestions} solved</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}
