import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Activity, Clock, ChevronRight } from 'lucide-react';
import { useManualUid } from '../hooks/use-manual-uid';
import ReflectionTimeline from '../components/ReflectionTimeline';
import { format } from 'date-fns';
import { getMemories, Memory } from '../utils/api';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface Reflection {
  id: string;
  created_at: Date;
  hey: string;
  nice_job: string;
  between_us: string;
  did_you_catch_that: string;
  real_talk: string;
}

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { manualUid, loading: uidLoading, error: uidError } = useManualUid();
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!uidLoading && manualUid) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manualUid, uidLoading]);

  const fetchData = async () => {
    if (!manualUid) return;

    try {
      setLoading(true);

      // Fetch memories directly from Firebase
      const memoriesData = await getMemories(manualUid, 5);
      setMemories(memoriesData.memories);

      // Fetch reflections directly from Firebase with correct path
      const reflectionsRef = collection(db, 'users', manualUid, 'conversationReflections');
      const q = query(
        reflectionsRef,
        orderBy('created_at', 'desc'),
        limit(5)
      );

      const reflectionsSnapshot = await getDocs(q);
      const reflectionsData = reflectionsSnapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Raw reflection data:', data); // Debug log
        console.log('Created at field:', data.created_at); // Debug log
        return {
          id: doc.id,
          ...data,
          created_at: data.created_at instanceof Date ? data.created_at : new Date(data.created_at),
        } as Reflection;
      });

      console.log('Processed reflections:', reflectionsData); // Debug log
      setReflections(reflectionsData);
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (uidLoading || loading) {
    return (
      <div className="flex-1 space-y-8 p-8 pt-6">
        {/* Header Skeleton */}
        <div className="flex flex-col space-y-2">
          <div className="h-10 w-[300px] bg-gray-200 animate-pulse rounded-lg"></div>
          <div className="h-6 w-[400px] bg-gray-200 animate-pulse rounded-lg"></div>
        </div>

        {/* Top Grid: Recent Activity and Health Data */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Activity Card Skeleton */}
          <div className="rounded-xl border bg-card p-6 h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-full bg-gray-200 p-2 w-10 h-10 animate-pulse"></div>
              <div className="h-7 w-40 bg-gray-200 animate-pulse rounded-lg"></div>
            </div>
            <div className="mt-4 space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="h-6 w-56 bg-gray-200 animate-pulse rounded-lg"></div>
                    <div className="h-5 w-36 bg-gray-200 animate-pulse rounded-lg"></div>
                  </div>
                  <div className="h-7 w-24 bg-gray-200 animate-pulse rounded-full"></div>
                </div>
              ))}
              <div className="pt-4 mt-4 border-t border-zinc-100">
                <div className="h-6 w-40 bg-gray-200 animate-pulse rounded-lg"></div>
              </div>
            </div>
          </div>

          {/* Health Data Card Skeleton */}
          <div className="rounded-xl border bg-card p-6 h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-full bg-gray-200 p-2 w-10 h-10 animate-pulse"></div>
              <div className="h-7 w-40 bg-gray-200 animate-pulse rounded-lg"></div>
            </div>
            <div className="mt-4 space-y-6">
              <div>
                <div className="h-5 w-32 bg-gray-200 animate-pulse rounded-lg mb-2"></div>
                <div className="h-10 w-48 bg-gray-200 animate-pulse rounded-lg"></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="h-5 w-24 bg-gray-200 animate-pulse rounded-lg mb-2"></div>
                  <div className="h-8 w-20 bg-gray-200 animate-pulse rounded-lg"></div>
                </div>
                <div>
                  <div className="h-5 w-24 bg-gray-200 animate-pulse rounded-lg mb-2"></div>
                  <div className="h-8 w-20 bg-gray-200 animate-pulse rounded-lg"></div>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-zinc-100">
                <div className="h-6 w-48 bg-gray-200 animate-pulse rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Reflections Timeline Skeleton */}
        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="h-7 w-56 bg-gray-200 animate-pulse rounded-lg"></div>
            <div className="h-6 w-24 bg-gray-200 animate-pulse rounded-lg"></div>
          </div>
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="flex-1 space-y-4">
                  <div className="h-6 w-3/4 bg-gray-200 animate-pulse rounded-lg"></div>
                  <div className="space-y-3">
                    <div className="h-5 w-full bg-gray-200 animate-pulse rounded-lg"></div>
                    <div className="h-5 w-5/6 bg-gray-200 animate-pulse rounded-lg"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (uidError || error) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Error</h2>
        </div>
        <div className="rounded-lg border bg-destructive/10 text-destructive p-6">
          {uidError?.message || error?.message}
        </div>
      </div>
    );
  }

  // Get time of day for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Get user's first name
  const firstName = currentUser?.displayName
    ? currentUser.displayName.split(' ')[0]
    : 'there';

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-semibold tracking-tight">{getGreeting()}, {firstName}!</h2>
        <p className="text-muted-foreground">Here's what's happening with your account today.</p>
      </div>

      {/* Top Grid: Recent Activity and Health Data */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity Card */}
        <div className="rounded-xl border bg-card p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-full bg-zinc-100 p-2">
              <Clock className="h-5 w-5 text-zinc-900" />
            </div>
            <h3 className="text-lg font-semibold">Recent Activity</h3>
          </div>
          <div className="mt-4 space-y-4">
            {memories.slice(0, 3).map((memory) => (
              <div key={memory.id} className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-zinc-900">{memory.structured?.title || 'Untitled Memory'}</p>
                  <p className="text-sm text-zinc-500">
                    {format(new Date(memory.created_at), 'MMM d, h:mm a')}
                  </p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-zinc-100 text-zinc-900 font-medium">
                  {memory.structured?.category || 'General'}
                </span>
              </div>
            ))}
            <div className="pt-3 mt-3 border-t border-zinc-100">
              <a href="/memories" className="inline-flex items-center text-sm font-medium text-zinc-900 hover:text-zinc-700">
                View All Activities
                <ChevronRight className="ml-1 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Health Data Card */}
        <div className="rounded-xl border bg-card p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-full bg-zinc-100 p-2">
              <Activity className="h-5 w-5 text-zinc-900" />
            </div>
            <h3 className="text-lg font-semibold">Today's Health</h3>
          </div>
          <div className="mt-4 space-y-6">
            <div>
              <p className="text-sm font-medium text-zinc-500">Total Calories</p>
              <div className="mt-2 flex items-baseline">
                <p className="text-3xl font-bold text-zinc-900">2,345</p>
                <p className="ml-2 text-sm text-zinc-500">calories</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-zinc-500">Protein</p>
                <p className="mt-1 text-xl font-semibold text-zinc-900">120g</p>
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-500">Meals</p>
                <p className="mt-1 text-xl font-semibold text-zinc-900">3</p>
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-zinc-100">
              <a href="/health" className="inline-flex items-center text-sm font-medium text-zinc-900 hover:text-zinc-700">
                View Health Dashboard
                <ChevronRight className="ml-1 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Reflections Timeline */}
      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-neutral-900">Conversation Reflections</h3>
          <a href="/memories" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 inline-flex items-center">
            View All
            <ChevronRight className="ml-1 h-4 w-4" />
          </a>
        </div>
        <div className="space-y-8">
          {reflections.map((reflection) => (
            <div key={reflection.id} className="flex gap-4">
              <div className="h-12 w-12 rounded-full bg-neutral-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-neutral-600" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-neutral-900">
                    {format(new Date(reflection.created_at), 'MMMM d, yyyy')}
                  </p>
                  <span className="text-xs text-neutral-500">
                    {format(new Date(reflection.created_at), 'h:mm a')}
                  </span>
                </div>
                <div className="space-y-2">
                  {reflection.hey && (
                    <p className="text-sm leading-relaxed font-semibold text-neutral-600">{reflection.hey}</p>
                  )}
                  {reflection.nice_job && (
                    <p className="text-sm leading-relaxed text-neutral-600">{reflection.nice_job}</p>
                  )}
                  {reflection.between_us && (
                    <p className="text-sm leading-relaxed text-neutral-600">{reflection.between_us}</p>
                  )}
                  {reflection.did_you_catch_that && (
                    <p className="text-sm leading-relaxed text-neutral-600">{reflection.did_you_catch_that}</p>
                  )}
                  {reflection.real_talk && (
                    <p className="text-sm leading-relaxed text-neutral-600">{reflection.real_talk}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 