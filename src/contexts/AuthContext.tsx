import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential
} from 'firebase/auth';
import { doc, getDoc, setDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

// Interface for UID mapping
interface UidMapping {
  authUid: string;      // Firebase Auth UID
  manualUid: string;    // Manual UID from query parameter
  createdAt: number;    // Timestamp when mapping was created
}

// Interface for user data
interface UserData {
  uid?: string;
  email: string;
  createdAt: number;
  displayName?: string;
  photoURL?: string;
  authUid?: string;     // Firebase Auth UID
  manualUid?: string;   // Manual UID from query parameter
  isMappedAccount?: boolean; // Whether this account is mapped to a manual UID
}

interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  signUp: (email: string, password: string, manualUid?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signInWithGoogle: () => Promise<UserCredential>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  isManualUidMapped: (manualUid: string) => Promise<boolean>;
  getManualUidFromAuthUid: (authUid: string) => Promise<string | null>;
  getUserData: () => Promise<UserData | null>;
  getEffectiveUid: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Store mapping between Auth UID and Manual UID
  async function storeUidMapping(authUid: string, manualUid: string) {
    try {
      console.log(`STORING UID MAPPING: Auth UID ${authUid} -> Manual UID ${manualUid}`);
      const mappingRef = doc(db, 'userstouid', authUid);

      const mapping: UidMapping = {
        authUid,
        manualUid,
        createdAt: Date.now()
      };

      console.log('About to save UID mapping to Firestore:', mapping);

      // Try/catch specifically for the setDoc operation to pinpoint any issues
      try {
        await setDoc(mappingRef, mapping);
        console.log('✅ SUCCESS: UID mapping stored successfully in userstouid collection');

        // Verify the mapping was stored by reading it back
        const verifyDoc = await getDoc(mappingRef);
        if (verifyDoc.exists()) {
          console.log('✅ VERIFICATION: UID mapping confirmed in Firestore:', verifyDoc.data());
        } else {
          console.error('❌ VERIFICATION FAILED: UID mapping not found after saving');
        }

        return true;
      } catch (setDocError) {
        console.error('❌ FIRESTORE ERROR in setDoc operation:', setDocError);
        throw setDocError;
      }
    } catch (error) {
      console.error('❌ ERROR storing UID mapping:', error);
      return false;
    }
  }

  // Get manual UID from Auth UID
  async function getManualUidFromAuthUid(authUid: string): Promise<string | null> {
    try {
      console.log(`🔎 Looking up manual UID for Auth UID: ${authUid}`);
      const mappingRef = doc(db, 'userstouid', authUid);
      console.log(`Reading document from ${db.type}/${mappingRef.path}`);

      const mappingSnap = await getDoc(mappingRef);

      if (mappingSnap.exists()) {
        const mapping = mappingSnap.data() as UidMapping;
        console.log(`✅ Found mapping: Auth UID ${authUid} -> Manual UID ${mapping.manualUid}`);
        return mapping.manualUid;
      } else {
        console.log(`⚠️ No mapping found for Auth UID: ${authUid}`);
        return null;
      }
    } catch (error) {
      console.error('❌ Error getting manual UID:', error);
      return null;
    }
  }

  // Check if manual UID is already mapped to an Auth account
  async function isManualUidMapped(manualUid: string): Promise<boolean> {
    try {
      console.log(`Checking if Manual UID ${manualUid} is already mapped`);
      const mappingsRef = collection(db, 'userstouid');
      const q = query(mappingsRef, where('manualUid', '==', manualUid));
      const querySnapshot = await getDocs(q);

      const isMapped = !querySnapshot.empty;
      console.log(`Manual UID ${manualUid} is ${isMapped ? 'already' : 'not'} mapped`);
      return isMapped;
    } catch (error) {
      console.error('Error checking if manual UID is mapped:', error);
      return false;
    }
  }

  // Sign up with email and password
  async function signUp(email: string, password: string, manualUid?: string) {
    try {
      console.log(`Creating user with email: ${email}`);

      if (manualUid) {
        console.log(`Manual UID provided: ${manualUid}`);
        // Check if manual UID is already mapped
        const isMapped = await isManualUidMapped(manualUid);
        if (isMapped) {
          throw new Error('This Omi ID is already linked to another account.');
        }
      }

      // Create the user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log(`User created with Auth UID: ${user.uid}`);

      // Create the mapping entry
      if (manualUid) {
        console.log(`⭐ CREATING MAPPING: Auth UID ${user.uid} -> Manual UID ${manualUid}`);
        const mappingResult = await storeUidMapping(user.uid, manualUid);
        console.log(`Mapping creation result:`, mappingResult ? 'Success' : 'Failed');
      } else {
        console.log(`⚠️ No manual UID provided, no mapping created`);
      }
    } catch (error) {
      console.error('❌ ERROR in signUp function:', error);
      throw error;
    }
  }

  // Sign in with email and password
  async function signIn(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Sign in with Google
  async function signInWithGoogle(): Promise<UserCredential> {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log(`Google sign-in successful for user: ${user.email} with UID: ${user.uid}`);

      // We don't create a user document here anymore - just return the result
      console.log(`Google user signed in: ${user.email}`);
      return result;
    } catch (error) {
      console.error('Error in Google sign-in:', error);
      throw error;
    }
  }

  // Logout
  function logout() {
    setUserData(null);
    return signOut(auth);
  }

  // Reset password
  function resetPassword(email: string) {
    return sendPasswordResetEmail(auth, email);
  }

  // Get user data from Firestore
  async function getUserData(): Promise<UserData | null> {
    if (!currentUser) {
      console.log('No current user, cannot get user data');
      return null;
    }

    try {
      // Create a basic user data object from the auth user
      const userData: UserData = {
        email: currentUser.email || '',
        createdAt: Date.now(),
        displayName: currentUser.displayName || '',
        photoURL: currentUser.photoURL || '',
        uid: currentUser.uid,
        authUid: currentUser.uid
      };

      // Check if there's a UID mapping for this Auth UID
      const manualUid = await getManualUidFromAuthUid(currentUser.uid);

      // Add manual UID if found
      if (manualUid) {
        userData.manualUid = manualUid;
        userData.isMappedAccount = true;
        console.log(`Added manual UID ${manualUid} to user data`);
      }

      console.log('User data retrieved:', userData);
      return userData;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  // Get the effective UID to use (manual UID if mapped, Auth UID otherwise)
  async function getEffectiveUid(): Promise<string | null> {
    if (!currentUser) {
      console.log('❌ No current user, cannot determine effective UID');
      return null;
    }

    console.log(`🔍 Getting effective UID for user ${currentUser.email} (${currentUser.uid})`);

    // Check if there's a mapping for this Auth UID
    const manualUid = await getManualUidFromAuthUid(currentUser.uid);

    if (manualUid) {
      console.log(`✅ Using mapped Manual UID: ${manualUid}`);
      return manualUid;
    } else {
      console.log(`ℹ️ No mapping found, using Auth UID: ${currentUser.uid}`);
      return currentUser.uid;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        const data = await getUserData();
        setUserData(data);
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    userData,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
    resetPassword,
    isManualUidMapped,
    getManualUidFromAuthUid,
    getUserData,
    getEffectiveUid
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthContext; 