import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { triggerSync } from '../api/client';
import { RefreshCw, CheckCircle } from 'lucide-react';
import { clsx } from 'clsx';

export function SyncPage() {
  const queryClient = useQueryClient();
  const [lastSync, setLastSync] = useState<{ added: number, total: number } | null>(null);

  const mutation = useMutation({
    mutationFn: triggerSync,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['progress'] });
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      setLastSync({ added: data.problemsAdded, total: data.totalSolved });
    }
  });

  return (
    <div className="p-8 max-w-2xl mx-auto mt-10">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-600 mb-6">
          <RefreshCw className={clsx("w-8 h-8", mutation.isPending && "animate-spin")} />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Sync with LeetCode</h2>
        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
          Pull your latest accepted submissions from LeetCode to update your local progress.
        </p>

        <button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {mutation.isPending ? 'Syncing...' : 'Sync Now'}
        </button>

        {mutation.isError && (
          <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm">
            {(mutation.error as Error).message}
          </div>
        )}

        {mutation.isSuccess && lastSync && (
          <div className="mt-6 p-4 bg-green-50 text-green-700 rounded-xl flex items-center justify-center gap-3">
            <CheckCircle className="w-5 h-5" />
            <span>
              Sync complete! Found <strong>{lastSync.total}</strong> total solved problems. 
              {lastSync.added > 0 ? ` Added ${lastSync.added} new solve(s) to cache.` : ' No new solves added.'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
