import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { ClientStrategyBrief } from '../types';

export const saveBriefToFirestore = async (brief: ClientStrategyBrief) => {
  try {
    const briefRef = doc(collection(db, 'briefs'), brief.id);
    await setDoc(briefRef, brief);
  } catch (error) {
    console.error("Error saving brief to Firestore:", error);
  }
};
