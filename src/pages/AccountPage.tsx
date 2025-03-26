import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useManualUid } from '../hooks/use-manual-uid';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { User } from 'lucide-react';
import { CalendarClock } from 'lucide-react';

interface UserPreferences {
  height: number;
  weight: number;
  proteinGoal: number;
  dietPreferences: string[];
  units: 'metric' | 'imperial';
}

const DEFAULT_PREFERENCES: UserPreferences = {
  height: 170,
  weight: 70,
  proteinGoal: 150,
  dietPreferences: [],
  units: 'metric'
};

const DIET_OPTIONS = [
  'Vegetarian',
  'Vegan',
  'Pescatarian',
  'Keto',
  'Paleo',
  'Mediterranean',
  'Low-carb',
  'Gluten-free',
  'Dairy-free'
];

export default function AccountPage() {
  const { currentUser } = useAuth();
  const { manualUid } = useManualUid();
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchUserPreferences();
  }, [manualUid]);

  const fetchUserPreferences = async () => {
    if (!manualUid) return;

    try {
      setLoading(true);
      const prefsDoc = await getDoc(doc(db, 'users', manualUid, 'preferences', 'health'));
      if (prefsDoc.exists()) {
        setPreferences(prefsDoc.data() as UserPreferences);
      }
    } catch (err) {
      console.error('Error fetching preferences:', err);
      setError('Failed to load preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUid) return;

    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      await setDoc(doc(db, 'users', manualUid, 'preferences', 'health'), preferences);
      setSuccessMessage('Preferences saved successfully!');

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error saving preferences:', err);
      setError('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const handleDietPreferenceToggle = (diet: string) => {
    setPreferences(prev => ({
      ...prev,
      dietPreferences: prev.dietPreferences.includes(diet)
        ? prev.dietPreferences.filter(d => d !== diet)
        : [...prev.dietPreferences, diet]
    }));
  };

  if (loading) {
    return (
      <div className="flex-1 space-y-6 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">Account</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Section Skeleton */}
          <div className="rounded-lg border bg-card p-6">
            <div className="space-y-6">
              <div>
                <div className="h-7 w-24 bg-neutral-200 animate-pulse rounded-lg mb-4"></div>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i}>
                      <div className="h-5 w-20 bg-neutral-200 animate-pulse rounded-lg mb-1"></div>
                      <div className="h-6 w-48 bg-neutral-200 animate-pulse rounded-lg"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Health Preferences Form Skeleton */}
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <div className="h-7 w-40 bg-neutral-200 animate-pulse rounded-lg mb-4"></div>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-5 w-24 bg-neutral-200 animate-pulse rounded-lg"></div>
                    <div className="h-10 w-full bg-neutral-200 animate-pulse rounded-lg"></div>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <div className="h-5 w-32 bg-neutral-200 animate-pulse rounded-lg"></div>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-8 w-24 bg-neutral-200 animate-pulse rounded-full"></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="h-10 w-full bg-neutral-200 animate-pulse rounded-lg mt-6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">Account</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Section */}
        <div className="rounded-lg border bg-card p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Profile</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-neutral-600">Name</label>
                  <p className="text-sm text-neutral-900 mt-1">{currentUser?.displayName || 'User'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-600">Email</label>
                  <p className="text-sm text-neutral-900 mt-1">{currentUser?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-600">Account ID</label>
                  <p className="text-sm text-neutral-900 mt-1">{manualUid || 'Not mapped'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-600">Last Active</label>
                  <p className="text-sm text-neutral-900 mt-1">Just now</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Health Preferences Form */}
        <form onSubmit={handleSave} className="rounded-lg border bg-card p-6 space-y-4">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Health Preferences</h3>

          {error && (
            <div className="border border-neutral-200 bg-neutral-50 text-neutral-800 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <CalendarClock className="h-4 w-4" />
                <h4 className="text-neutral-800 font-medium text-sm">Coming Soon</h4>
              </div>
              <p className="text-sm text-neutral-600 mt-1 leading-relaxed">
                Health preferences will be available in our next release. Stay tuned for announcements!
              </p>
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 text-green-800 p-3 rounded-md mb-4 text-sm">
              {successMessage}
            </div>
          )}

          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Units Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-600">Units</label>
                <select
                  value={preferences.units}
                  onChange={e => setPreferences(prev => ({ ...prev, units: e.target.value as 'metric' | 'imperial' }))}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-neutral-900"
                >
                  <option value="metric">Metric (cm/kg)</option>
                  <option value="imperial">Imperial (ft/lbs)</option>
                </select>
              </div>

              {/* Height */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-600">
                  Height ({preferences.units === 'metric' ? 'cm' : 'inches'})
                </label>
                <input
                  type="number"
                  value={preferences.height}
                  onChange={e => setPreferences(prev => ({ ...prev, height: Number(e.target.value) }))}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-neutral-900"
                />
              </div>

              {/* Weight */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-600">
                  Weight ({preferences.units === 'metric' ? 'kg' : 'lbs'})
                </label>
                <input
                  type="number"
                  value={preferences.weight}
                  onChange={e => setPreferences(prev => ({ ...prev, weight: Number(e.target.value) }))}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-neutral-900"
                />
              </div>

              {/* Protein Goal */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-600">Daily Protein Goal (g)</label>
                <input
                  type="number"
                  value={preferences.proteinGoal}
                  onChange={e => setPreferences(prev => ({ ...prev, proteinGoal: Number(e.target.value) }))}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-neutral-900"
                />
              </div>
            </div>

            {/* Diet Preferences */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-600">Diet Preferences</label>
              <div className="flex flex-wrap gap-2">
                {DIET_OPTIONS.map(diet => (
                  <button
                    key={diet}
                    type="button"
                    onClick={() => handleDietPreferenceToggle(diet)}
                    className={`px-3 py-1 rounded-full text-sm ${preferences.dietPreferences.includes(diet)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      }`}
                  >
                    {diet}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </form>
      </div>
    </div>
  );
} 