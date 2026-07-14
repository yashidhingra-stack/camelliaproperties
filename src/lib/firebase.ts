import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "lofty-snow-48gvj",
  appId: "1:775518939197:web:611dd36ba835ef85e4a254",
  apiKey: "AIzaSyASoilpBLU6jU9_bEvpkO-XAJ69SBqCfOM",
  authDomain: "lofty-snow-48gvj.firebaseapp.com",
  storageBucket: "lofty-snow-48gvj.firebasestorage.app",
  messagingSenderId: "775518939197",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "ai-studio-camelliaproperti-48d55499-b111-4819-b78d-9d7fb67c554e");
