import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "lofty-snow-48gvj",
  appId: "1:775518939197:web:611dd36ba835ef85e4a254",
  apiKey: "AIzaSyASoilpBLU6jU9_bEvpkO-XAJ69SBqCfOM",
  authDomain: "lofty-snow-48gvj.firebaseapp.com",
  storageBucket: "lofty-snow-48gvj.firebasestorage.app",
  messagingSenderId: "775518939197",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "ai-studio-camelliaproperti-48d55499-b111-4819-b78d-9d7fb67c554e");

async function check() {
  try {
    const allDocs = await getDocs(collection(db, 'properties'));
    console.log(`Unfiltered Total Docs: ${allDocs.size}`);
    allDocs.forEach(d => {
      console.log(`- Title: "${d.data().title}", ID: ${d.id}, has createdAt: ${d.data().createdAt !== undefined}`);
    });

    const sortedQ = query(collection(db, 'properties'), orderBy('createdAt', 'desc'));
    const sortedDocs = await getDocs(sortedQ);
    console.log(`Ordered by createdAt Total Docs: ${sortedDocs.size}`);
    sortedDocs.forEach(d => {
      console.log(`- Title: "${d.data().title}", ID: ${d.id}`);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

check();
