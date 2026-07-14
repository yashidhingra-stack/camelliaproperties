import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { initialProperties } from './mockProperties';

export async function migratePropertiesToFirestore() {
  console.log(`Starting migration of ${initialProperties.length} properties...`);

  // Insert in reverse order so prop-1 ends up with the newest timestamp,
  // preserving your original display order (since the app sorts by createdAt desc)
  const reversedList = [...initialProperties].reverse();

  for (const property of reversedList) {
    const { id, ...propertyData } = property; // strip the old hardcoded id

    try {
      await addDoc(collection(db, 'properties'), {
        ...propertyData,
        createdAt: serverTimestamp()
      });
      console.log(`✅ Migrated: ${property.title}`);
      // Small delay ensures each doc gets a distinct timestamp, preserving order
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error(`❌ Failed to migrate ${property.title}:`, error);
    }
  }

  console.log('Migration complete! Refresh the page to see properties loaded from Firestore.');
}