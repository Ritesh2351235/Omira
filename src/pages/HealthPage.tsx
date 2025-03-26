import React, { useEffect, useState } from 'react';
import { getNutritionMemories, NutritionMemory } from '../utils/api';
import { format, isSameDay } from 'date-fns';
import { useManualUid } from '../hooks/use-manual-uid';

interface NutritionSummary {
  totalCalories: number;
  averageCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  averageMacros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  mealCounts: {
    breakfast: number;
    lunch: number;
    dinner: number;
    snack: number;
  };
  qualityBreakdown: {
    healthy: number;
    neutral: number;
    unhealthy: number;
  };
}

export default function HealthPage() {
  const { manualUid, loading: uidLoading } = useManualUid();
  const [memories, setMemories] = useState<NutritionMemory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<NutritionSummary>({
    totalCalories: 0,
    averageCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFats: 0,
    averageMacros: { protein: 0, carbs: 0, fats: 0 },
    mealCounts: { breakfast: 0, lunch: 0, dinner: 0, snack: 0 },
    qualityBreakdown: { healthy: 0, neutral: 0, unhealthy: 0 }
  });

  useEffect(() => {
    if (!uidLoading && manualUid) {
      fetchNutritionData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manualUid, uidLoading]);

  const fetchNutritionData = async () => {
    if (!manualUid) return;

    try {
      setLoading(true);
      setError(null);
      const nutritionMemories = await getNutritionMemories(manualUid);

      if (nutritionMemories.length === 0) {
        setError('No nutrition data found. Try recording some meals first!');
        setMemories([]);
        setSummary({
          totalCalories: 0,
          averageCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
          totalFats: 0,
          averageMacros: { protein: 0, carbs: 0, fats: 0 },
          mealCounts: { breakfast: 0, lunch: 0, dinner: 0, snack: 0 },
          qualityBreakdown: { healthy: 0, neutral: 0, unhealthy: 0 }
        });
        return;
      }

      setMemories(nutritionMemories);
      calculateSummary(nutritionMemories);
    } catch (err) {
      console.error('Error fetching nutrition data:', err);
      setError(
        'Unable to load nutrition data. Please try again later or contact support if the problem persists.'
      );
      setMemories([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = (nutritionMemories: NutritionMemory[]) => {
    const summary: NutritionSummary = {
      totalCalories: 0,
      averageCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFats: 0,
      averageMacros: { protein: 0, carbs: 0, fats: 0 },
      mealCounts: { breakfast: 0, lunch: 0, dinner: 0, snack: 0 },
      qualityBreakdown: { healthy: 0, neutral: 0, unhealthy: 0 }
    };

    if (nutritionMemories.length === 0) {
      setError('No nutrition data found. Try recording some meals first!');
      setSummary(summary);
      return;
    }

    // Sort memories by date (newest first)
    const sortedMemories = [...nutritionMemories].sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return dateB.getTime() - dateA.getTime();
    });

    // Check if we have any memories from today
    const today = new Date();
    const todaysMemories = sortedMemories.filter(memory => {
      const memoryDate = new Date(memory.created_at);
      return isSameDay(memoryDate, today);
    });

    // If no memories for today, show message and return zeros
    if (todaysMemories.length === 0) {
      setError('No nutrition data recorded for today. Try recording your meals through Omi!');
      setSummary(summary);
      return;
    }

    // Process today's memories
    todaysMemories.forEach(memory => {
      const nutritionData = memory.metadata.find(m => m.analysis_type === 'nutrition')?.nutrition_data;
      if (nutritionData) {
        summary.totalCalories += nutritionData.total_calories;

        // Update meal counts
        summary.mealCounts[nutritionData.meal_type.toLowerCase() as keyof typeof summary.mealCounts]++;

        // Update macros
        nutritionData.foods.forEach(food => {
          summary.totalProtein += food.protein_g;
          summary.totalCarbs += food.carbs_g;
          summary.totalFats += food.fats_g;
          summary.qualityBreakdown[food.quality]++;
        });
      }
    });

    // Calculate averages for today
    if (todaysMemories.length > 0) {
      summary.averageCalories = Math.round(summary.totalCalories / todaysMemories.length);
      const totalMacros = summary.totalProtein + summary.totalCarbs + summary.totalFats;
      if (totalMacros > 0) {
        summary.averageMacros = {
          protein: Math.round((summary.totalProtein / totalMacros) * 100),
          carbs: Math.round((summary.totalCarbs / totalMacros) * 100),
          fats: Math.round((summary.totalFats / totalMacros) * 100)
        };
      }
    }

    setSummary(summary);
  };

  if (loading) {
    return (
      <div className="flex-1">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-2">
          <div className="h-10 w-64 bg-gray-200 animate-pulse rounded-lg"></div>
          <div className="h-6 w-40 bg-gray-200 animate-pulse rounded-lg"></div>
        </div>

        {/* Summary Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-md h-[140px]">
              <div className="h-6 w-48 bg-gray-200 animate-pulse rounded-lg mb-4"></div>
              <div className="h-10 w-32 bg-gray-200 animate-pulse rounded-lg mb-2"></div>
              <div className="h-5 w-40 bg-gray-200 animate-pulse rounded-lg"></div>
            </div>
          ))}
        </div>

        {/* Distribution Cards Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
          {/* Meal Distribution Skeleton */}
          <div className="bg-white p-6 rounded-lg shadow-md h-[300px]">
            <div className="h-7 w-48 bg-gray-200 animate-pulse rounded-lg mb-6"></div>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="h-5 w-24 bg-gray-200 animate-pulse rounded-lg"></div>
                  <div className="h-5 w-12 bg-gray-200 animate-pulse rounded-lg"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Meal Quality Skeleton */}
          <div className="bg-white p-6 rounded-lg shadow-md h-[300px]">
            <div className="h-7 w-40 bg-gray-200 animate-pulse rounded-lg mb-6"></div>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 rounded-lg bg-gray-50 flex flex-col items-center">
                  <div className="h-6 w-20 bg-gray-200 animate-pulse rounded-lg mb-4"></div>
                  <div className="h-10 w-10 bg-gray-200 animate-pulse rounded-lg"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Meals Skeleton */}
        <div className="p-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="h-7 w-40 bg-gray-200 animate-pulse rounded-lg mb-6"></div>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border-b pb-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-2">
                      <div className="h-6 w-40 bg-gray-200 animate-pulse rounded-lg"></div>
                      <div className="h-5 w-32 bg-gray-200 animate-pulse rounded-lg"></div>
                    </div>
                    <div className="h-6 w-32 bg-gray-200 animate-pulse rounded-lg"></div>
                  </div>
                  <div className="h-5 w-full bg-gray-200 animate-pulse rounded-lg mt-4"></div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="h-7 w-24 bg-gray-200 animate-pulse rounded-full"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">Health Dashboard</h2>
        </div>
        <div className="bg-red-50 p-6 rounded-lg">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-red-400 mr-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <h3 className="text-lg font-medium text-neutral-900">Error Loading Dashboard</h3>
          </div>
          <div className="mt-2">
            <p className="text-sm text-neutral-600 leading-relaxed">{error}</p>
          </div>
          <div className="mt-4">
            <button
              onClick={() => fetchNutritionData()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-2">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900">Health Dashboard</h2>
        <p className="text-sm text-neutral-600">
          {format(new Date(), 'MMMM d, yyyy')}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h3 className="text-base sm:text-lg font-semibold text-neutral-900">Today's Total Calories</h3>
          <p className="text-2xl sm:text-3xl font-bold text-neutral-900 mt-2">{summary.totalCalories.toLocaleString()}</p>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1">Avg: {summary.averageCalories.toLocaleString()} per meal</p>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h3 className="text-base sm:text-lg font-semibold text-neutral-900">Today's Protein</h3>
          <p className="text-2xl sm:text-3xl font-bold text-neutral-900 mt-2">{summary.totalProtein.toFixed(1)}g</p>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1">{summary.averageMacros.protein}% of total macros</p>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h3 className="text-base sm:text-lg font-semibold text-neutral-900">Today's Carbs</h3>
          <p className="text-2xl sm:text-3xl font-bold text-neutral-900 mt-2">{summary.totalCarbs.toFixed(1)}g</p>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1">{summary.averageMacros.carbs}% of total macros</p>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h3 className="text-base sm:text-lg font-semibold text-neutral-900">Today's Fats</h3>
          <p className="text-2xl sm:text-3xl font-bold text-neutral-900 mt-2">{summary.totalFats.toFixed(1)}g</p>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1">{summary.averageMacros.fats}% of total macros</p>
        </div>
      </div>

      {/* Meal Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h3 className="text-base sm:text-lg font-semibold text-neutral-900 mb-4">Meal Distribution</h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(summary.mealCounts).map(([meal, count]) => (
              <div key={meal} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="capitalize text-sm text-neutral-600">{meal}</span>
                <span className="font-semibold text-sm text-neutral-900">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h3 className="text-base sm:text-lg font-semibold text-neutral-900 mb-4">Meal Quality</h3>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(summary.qualityBreakdown).map(([quality, count]) => (
              <div
                key={quality}
                className={`p-3 rounded-lg text-center ${quality === 'healthy'
                  ? 'bg-green-100 text-green-800'
                  : quality === 'neutral'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                  }`}
              >
                <div className="font-semibold capitalize text-sm">{quality}</div>
                <div className="text-2xl font-bold">{count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Nutrition Entries */}
      <div className="p-4">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h3 className="text-base sm:text-lg font-semibold text-neutral-900 mb-4">Today's Meals</h3>
          <div className="space-y-4">
            {memories
              .filter(memory => {
                const memoryDate = new Date(memory.created_at);
                const latestDate = new Date(memories[0].created_at);
                return isSameDay(memoryDate, latestDate);
              })
              .map(memory => {
                const nutritionData = memory.metadata.find(m => m.analysis_type === 'nutrition')?.nutrition_data;
                if (!nutritionData) return null;

                return (
                  <div key={memory.id} className="border-b pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-semibold capitalize text-neutral-900">{nutritionData.meal_type}</span>
                        <span className="text-sm text-neutral-600 ml-2">
                          {format(new Date(memory.created_at), 'h:mm a')}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-neutral-900">
                        {nutritionData.total_calories} calories
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600 leading-relaxed">{nutritionData.dashboard_summary}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {nutritionData.foods.map((food, idx) => (
                        <span
                          key={idx}
                          className={`text-xs px-2 py-1 rounded ${food.quality === 'healthy'
                            ? 'bg-green-100 text-green-800'
                            : food.quality === 'neutral'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                            }`}
                        >
                          {food.name}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
} 