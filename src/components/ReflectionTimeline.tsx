import React from 'react';
import { MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

interface Reflection {
  id: string;
  created_at: Date;
  hey: string;
  nice_job: string;
  between_us: string;
  did_you_catch_that: string;
  real_talk: string;
}

interface ReflectionTimelineProps {
  reflections: Reflection[];
  isLoading: boolean;
}

const ReflectionTimeline: React.FC<ReflectionTimelineProps> = ({ reflections, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4 animate-pulse">
            <div className="h-12 w-12 rounded-full bg-zinc-100"></div>
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-zinc-100 rounded w-1/4"></div>
              <div className="h-3 bg-zinc-100 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!reflections.length) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="h-12 w-12 mx-auto text-zinc-400 mb-4" />
        <p className="text-zinc-500 font-medium">No reflections yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {reflections.map((reflection, index) => (
        <div
          key={reflection.id}
          className={`relative pl-8 ${index !== reflections.length - 1 ? 'pb-8 border-l border-zinc-200' : ''
            }`}
        >
          <div className="absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full bg-zinc-900 border-2 border-white" />
          <div className="bg-zinc-50 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <p className="text-sm font-medium text-zinc-500">
                  {format(new Date(reflection.created_at), 'MMM d, yyyy h:mm a')}
                </p>
              </div>
              <div className="space-y-4">
                <p className="text-lg font-semibold text-zinc-900">{reflection.hey}</p>
                <div className="space-y-3">
                  <p className="text-base font-medium text-zinc-900">{reflection.nice_job}</p>
                  <p className="text-base font-medium text-zinc-900">{reflection.between_us}</p>
                  {reflection.did_you_catch_that && (
                    <p className="text-base font-medium text-zinc-900">{reflection.did_you_catch_that}</p>
                  )}
                  <p className="text-base font-bold text-zinc-900 mt-4 pt-4 border-t border-zinc-200">
                    {reflection.real_talk}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReflectionTimeline; 