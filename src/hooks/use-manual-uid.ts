import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export function useManualUid() {
  const { currentUser } = useAuth();
  const [manualUid, setManualUid] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchManualUid() {
      if (!currentUser?.uid) {
        console.log('No current user, clearing manual UID');
        setManualUid(null);
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching manual UID for auth UID:', currentUser.uid);
        const userToUidRef = doc(db, 'userstouid', currentUser.uid);
        const userToUidDoc = await getDoc(userToUidRef);

        if (userToUidDoc.exists()) {
          const data = userToUidDoc.data();
          console.log('Found mapping document:', data);
          // Check both uid and manualUid fields since we're not sure which one is used
          const mappedUid = data.uid || data.manualUid;
          if (mappedUid) {
            console.log('Setting manual UID to:', mappedUid);
            setManualUid(mappedUid);
          } else {
            console.log('Document exists but no uid/manualUid field found');
            setError(new Error('Invalid UID mapping format'));
          }
        } else {
          console.log('No mapping found for auth UID:', currentUser.uid);
          setError(new Error('Manual UID mapping not found'));
        }
      } catch (err) {
        console.error('Error fetching manual UID:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch manual UID'));
      } finally {
        setLoading(false);
      }
    }

    fetchManualUid();
  }, [currentUser?.uid]);

  return {
    manualUid,
    loading,
    error
  };
} 