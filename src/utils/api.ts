import { collection, getDocs, query, where, orderBy, limit, startAt } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface TranscriptSegment {
  text: string;
  start: number;
  end: number;
}

export interface Memory {
  id: string;
  created_at: Date;
  started_at: Date;
  finished_at: Date;
  transcript_segments: TranscriptSegment[];
  structured?: {
    title?: string;
    category?: string;
    overview?: string;
  };
  status: string;
  deleted: boolean;
  discarded: boolean;
}

export interface NutritionFood {
  name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fats_g: number;
  estimatedPortion: string;
  quality: 'healthy' | 'neutral' | 'unhealthy';
}

export interface NutritionData {
  meal_type: string;
  time_of_day: string;
  foods: NutritionFood[];
  total_calories: number;
  macro_breakdown: {
    protein_pct: number;
    carbs_pct: number;
    fats_pct: number;
  };
  quality_assessment: string;
  is_balanced: boolean;
  dashboard_summary: string;
  feedback: string;
  visual_data: {
    protein: number;
    carbs: number;
    fats: number;
  };
}

export interface NutritionMemory extends Memory {
  metadata: Array<{
    analysis_type: string;
    nutrition_data: NutritionData;
  }>;
}

export const getMemories = async (
  uid: string,
  pageSize: number = 20,
  pageOffset: number = 0,
  includeDiscarded: boolean = false
): Promise<{ memories: Memory[]; count: number }> => {
  try {
    // Create reference to the user's memories collection
    const memoriesRef = collection(db, 'users', uid, 'memories');

    // Build the query with filters
    let q = query(
      memoriesRef,
      where('deleted', '==', false),
      orderBy('created_at', 'desc'),
      limit(pageSize)
    );

    if (!includeDiscarded) {
      q = query(q, where('discarded', '==', false));
    }

    if (pageOffset > 0) {
      q = query(q, startAt(pageOffset));
    }

    // Get the documents
    const memoriesSnapshot = await getDocs(q);

    const memories = memoriesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        created_at: data.created_at?.toDate() || new Date(),
        started_at: data.started_at?.toDate() || new Date(),
        finished_at: data.finished_at?.toDate() || new Date(),
      } as Memory;
    });

    return {
      memories,
      count: memories.length
    };
  } catch (error) {
    console.error('Error fetching memories:', error);
    throw error;
  }
};

export const getNutritionMemories = async (
  uid: string,
  pageSize: number = 100
): Promise<NutritionMemory[]> => {
  try {
    const memoriesRef = collection(db, 'users', uid, 'memories');

    // Simplified query that only sorts by created_at
    const q = query(
      memoriesRef,
      orderBy('created_at', 'desc'),
      limit(pageSize)
    );

    const snapshot = await getDocs(q);

    // Filter the results in memory instead
    return snapshot.docs
      .map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          created_at: data.created_at?.toDate() || new Date(),
          started_at: data.started_at?.toDate() || new Date(),
          finished_at: data.finished_at?.toDate() || new Date(),
        } as NutritionMemory;
      })
      .filter(memory =>
        !memory.deleted &&
        !memory.discarded &&
        memory.metadata?.some(m => m.analysis_type === 'nutrition')
      );
  } catch (error) {
    console.error('Error fetching nutrition memories:', error);
    throw error;
  }
}; 