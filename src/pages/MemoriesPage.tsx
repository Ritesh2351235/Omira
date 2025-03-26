import React, { useEffect, useState } from 'react';
import { getMemories, Memory } from '../utils/api';
import { format } from 'date-fns';
import { useManualUid } from '../hooks/use-manual-uid';
import {
  Clock, Calendar, Tag, ChevronRight, MessageSquare, Brain,
  Sparkles, ArrowRight, Lightbulb, Star, Activity, Utensils
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../components/ui/dialog';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
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

interface ConversationAnalysis {
  conversation_type: string;
  emotional_tone: string;
  key_points: string[];
  improvement_areas: string[];
  effectiveness: number;
  was_listening: boolean;
  dashboard_summary: string;
  feedback: string;
}

interface NutritionData {
  meal_type: string;
  total_calories: number;
  foods: Array<{
    name: string;
    calories: number;
    protein_g: number;
    quality: 'healthy' | 'neutral' | 'unhealthy';
  }>;
  dashboard_summary: string;
}

export default function MemoriesPage() {
  const { manualUid, loading: uidLoading, error: uidError } = useManualUid();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [reflection, setReflection] = useState<Reflection | null>(null);
  const [conversationAnalysis, setConversationAnalysis] = useState<ConversationAnalysis | null>(null);
  const [nutritionData, setNutritionData] = useState<NutritionData | null>(null);
  const pageSize = 20;

  useEffect(() => {
    if (!uidLoading && manualUid) {
      fetchMemories();
    }
  }, [page, manualUid, uidLoading]);

  const fetchMemories = async () => {
    if (!manualUid) return;

    try {
      setLoading(true);
      const result = await getMemories(manualUid, pageSize, page * pageSize);
      setMemories(result.memories);
      setError(null);
    } catch (err) {
      setError('Failed to fetch memories');
      console.error('Error fetching memories:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMemoryData = async (memory: Memory) => {
    if (!manualUid) return;

    try {
      // Fetch reflection
      const reflectionsRef = collection(db, 'users', manualUid, 'conversationReflections');
      const reflectionQuery = query(
        reflectionsRef,
        where('memory_id', '==', memory.id),
        orderBy('created_at', 'desc'),
        limit(1)
      );

      const reflectionSnapshot = await getDocs(reflectionQuery);
      if (!reflectionSnapshot.empty) {
        const data = reflectionSnapshot.docs[0].data();
        setReflection({
          id: reflectionSnapshot.docs[0].id,
          ...data,
          created_at: data.created_at?.toDate?.() || data.created_at,
        } as Reflection);
      } else {
        setReflection(null);
      }

      // Get memory metadata
      const memoryRef = collection(db, 'users', manualUid, 'memories');
      const memoryDoc = await getDocs(query(memoryRef, where('id', '==', memory.id), limit(1)));

      if (!memoryDoc.empty) {
        const memoryData = memoryDoc.docs[0].data();

        // Extract conversation analysis
        const conversationMeta = memoryData.metadata?.find(
          (m: any) => m.analysis_type === 'conversation'
        );
        if (conversationMeta) {
          setConversationAnalysis(conversationMeta.conversation_data);
        } else {
          setConversationAnalysis(null);
        }

        // Extract nutrition data
        const nutritionMeta = memoryData.metadata?.find(
          (m: any) => m.analysis_type === 'nutrition'
        );
        if (nutritionMeta) {
          setNutritionData(nutritionMeta.nutrition_data);
        } else {
          setNutritionData(null);
        }
      }
    } catch (err) {
      console.error('Error fetching memory data:', err);
      setReflection(null);
      setConversationAnalysis(null);
      setNutritionData(null);
    }
  };

  const handleMemoryClick = async (memory: Memory) => {
    setSelectedMemory(memory);
    await fetchMemoryData(memory);
  };

  const getMemoryDuration = (memory: Memory) => {
    const start = new Date(memory.started_at);
    const end = new Date(memory.finished_at);
    const durationMinutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
    return `${durationMinutes} minutes`;
  };

  if (uidLoading || loading) {
    return (
      <div className="flex-1 p-8 pt-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="h-8 w-48 bg-neutral-200 animate-pulse rounded-lg"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-lg border border-neutral-200 p-6 h-[240px] animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="h-6 w-3/4 bg-neutral-200 rounded-lg"></div>
                <div className="h-5 w-5 bg-neutral-200 rounded-full"></div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-4 w-4 bg-neutral-200 rounded-full"></div>
                    <div className="h-4 w-24 bg-neutral-200 rounded-lg"></div>
                  </div>
                  <div className="h-6 w-20 bg-neutral-200 rounded-full"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-16 bg-neutral-200 rounded-lg"></div>
                  <div className="flex gap-2">
                    {[1, 2].map((j) => (
                      <div key={j} className="h-5 w-16 bg-neutral-200 rounded-full"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (uidError || error) {
    return (
      <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
        <div className="flex-1 flex flex-col">
          <div className="px-8 pt-6">
            <h2 className="text-2xl font-semibold tracking-tight">Memories</h2>
          </div>

          <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-md">
              <div className="bg-white border border-neutral-200 rounded-lg p-6 space-y-4">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="rounded-full bg-red-50 p-3">
                    <MessageSquare className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-neutral-900">Unable to Load Memories</h3>
                    <p className="mt-1 text-sm text-neutral-600">{uidError?.message || error}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 pt-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold tracking-tight">Memories</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memories.map((memory) => (
          <div
            key={memory.id}
            onClick={() => handleMemoryClick(memory)}
            className="group bg-white rounded-lg border border-neutral-200 p-6 hover:border-neutral-300 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-medium text-neutral-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                {memory.structured?.title || 'Untitled Memory'}
              </h3>
              <ArrowRight className="h-4 w-4 text-neutral-400 group-hover:text-blue-600 transition-colors" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-neutral-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{format(new Date(memory.created_at), 'MMM d, yyyy')}</span>
                </div>
                {memory.structured?.category && (
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
                    {memory.structured.category}
                  </span>
                )}
              </div>

              <div className="pt-2">
                <p className="text-sm text-neutral-600 line-clamp-2 leading-relaxed">
                  {memory.transcript_segments.map(segment => segment.text).join(' ')}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {memories.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <MessageSquare className="h-8 w-8 text-neutral-400 mb-3" />
          <p className="text-sm text-neutral-600">No memories found</p>
        </div>
      )}

      <div className="flex justify-between items-center mt-8">
        <button
          onClick={() => setPage(p => Math.max(0, p - 1))}
          disabled={page === 0}
          className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors ${page === 0
            ? 'border-neutral-200 bg-neutral-50 text-neutral-400 cursor-not-allowed'
            : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50'
            }`}
        >
          Previous
        </button>
        <span className="text-sm text-neutral-600">Page {page + 1}</span>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={memories.length < pageSize}
          className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors ${memories.length < pageSize
            ? 'border-neutral-200 bg-neutral-50 text-neutral-400 cursor-not-allowed'
            : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50'
            }`}
        >
          Next
        </button>
      </div>

      <Dialog open={!!selectedMemory} onOpenChange={() => setSelectedMemory(null)}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-neutral-900">
              {selectedMemory?.structured?.title || 'Memory Details'}
            </DialogTitle>
            <DialogDescription>
              <div className="space-y-6 mt-6">
                {/* Memory Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm text-neutral-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        {selectedMemory && format(selectedMemory.created_at, 'MMMM d, yyyy')}
                      </span>
                    </div>
                    {selectedMemory?.structured?.category && (
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
                        {selectedMemory.structured.category}
                      </span>
                    )}
                  </div>
                </div>

                {/* Conversation Analysis */}
                {conversationAnalysis && (
                  <div className="rounded-lg border border-neutral-200 p-5 bg-white">
                    <div className="flex items-center gap-2 mb-4">
                      <MessageSquare className="h-4 w-4 text-neutral-600" />
                      <h4 className="font-medium text-neutral-900">Conversation Analysis</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="rounded-lg p-4 bg-neutral-50 border border-neutral-200">
                        <p className="text-sm font-medium text-neutral-900 mb-2">Overview</p>
                        <p className="text-sm text-neutral-600 leading-relaxed">{conversationAnalysis.dashboard_summary}</p>
                      </div>
                      <div className="rounded-lg p-4 bg-neutral-50 border border-neutral-200">
                        <p className="text-sm font-medium text-neutral-900 mb-2">Key Points</p>
                        <ul className="list-disc list-inside text-sm text-neutral-600 space-y-1">
                          {conversationAnalysis.key_points.map((point, index) => (
                            <li key={index}>{point}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-lg p-4 bg-neutral-50 border border-neutral-200">
                        <p className="text-sm font-medium text-neutral-900 mb-2">Conversation Details</p>
                        <div className="space-y-2 text-sm text-neutral-600">
                          <p>Type: <span className="capitalize">{conversationAnalysis.conversation_type}</span></p>
                          <p>Tone: <span className="capitalize">{conversationAnalysis.emotional_tone}</span></p>
                          <p>Effectiveness: {conversationAnalysis.effectiveness}/10</p>
                        </div>
                      </div>
                      <div className="rounded-lg p-4 bg-neutral-50 border border-neutral-200">
                        <p className="text-sm font-medium text-neutral-900 mb-2">Areas for Improvement</p>
                        <ul className="list-disc list-inside text-sm text-neutral-600 space-y-1">
                          {conversationAnalysis.improvement_areas.map((area, index) => (
                            <li key={index}>{area}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Nutrition Data */}
                {nutritionData && (
                  <div className="rounded-lg border border-neutral-200 p-5 bg-white">
                    <div className="flex items-center gap-2 mb-4">
                      <Utensils className="h-4 w-4 text-neutral-600" />
                      <h4 className="font-medium text-neutral-900">Nutrition Summary</h4>
                    </div>
                    <div className="space-y-4">
                      <div className="rounded-lg p-4 bg-neutral-50 border border-neutral-200">
                        <div className="flex justify-between items-center mb-3">
                          <p className="text-sm font-medium text-neutral-900 capitalize">{nutritionData.meal_type}</p>
                          <p className="text-sm font-medium text-neutral-900">{nutritionData.total_calories} calories</p>
                        </div>
                        <p className="text-sm text-neutral-600 leading-relaxed">{nutritionData.dashboard_summary}</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {nutritionData.foods.map((food, index) => (
                          <div
                            key={index}
                            className="rounded-lg p-3 bg-neutral-50 border border-neutral-200"
                          >
                            <div className="flex justify-between items-center">
                              <p className="text-sm font-medium text-neutral-900">{food.name}</p>
                              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700">
                                {food.calories} cal
                              </span>
                            </div>
                            <p className="text-xs text-neutral-600 mt-1">Protein: {food.protein_g}g</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* AI Reflection */}
                {reflection && (
                  <div className="rounded-lg border border-neutral-200 p-5 bg-white">
                    <div className="flex items-center gap-2 mb-4">
                      <Brain className="h-4 w-4 text-neutral-600" />
                      <h4 className="font-medium text-neutral-900">AI Insights</h4>
                    </div>
                    <div className="space-y-4">
                      <div className="rounded-lg p-4 bg-neutral-50 border border-neutral-200">
                        <p className="text-sm font-medium text-neutral-900 mb-2">Key Takeaway</p>
                        <p className="text-sm text-neutral-600 leading-relaxed">{reflection.hey}</p>
                      </div>
                      <div className="rounded-lg p-4 bg-neutral-50 border border-neutral-200">
                        <p className="text-sm font-medium text-neutral-900 mb-2">Strengths</p>
                        <p className="text-sm text-neutral-600 leading-relaxed">{reflection.nice_job}</p>
                      </div>
                      <div className="rounded-lg p-4 bg-neutral-50 border border-neutral-200">
                        <p className="text-sm font-medium text-neutral-900 mb-2">For Consideration</p>
                        <p className="text-sm text-neutral-600 leading-relaxed">{reflection.between_us}</p>
                      </div>
                      {reflection.did_you_catch_that && (
                        <div className="rounded-lg p-4 bg-neutral-50 border border-neutral-200">
                          <p className="text-sm font-medium text-neutral-900 mb-2">Notable Observation</p>
                          <p className="text-sm text-neutral-600 leading-relaxed">{reflection.did_you_catch_that}</p>
                        </div>
                      )}
                      <div className="rounded-lg p-4 bg-neutral-50 border border-neutral-200">
                        <p className="text-sm font-medium text-neutral-900 mb-2">Summary</p>
                        <p className="text-sm text-neutral-600 leading-relaxed">{reflection.real_talk}</p>
                      </div>
                    </div>
                  </div>
                )}

                {!reflection && !conversationAnalysis && !nutritionData && (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Brain className="h-8 w-8 text-neutral-400 mb-3" />
                    <p className="text-sm text-neutral-600">No analysis available for this memory</p>
                  </div>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
} 