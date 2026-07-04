import { useState, useEffect } from "react";
import {
  collection,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";

// Hardcoded fallback data from constants
import {
  services as defaultServices,
  experiences as defaultExperiences,
  testimonials as defaultTestimonials,
  projects as defaultProjects,
} from "../constants";

/**
 * Hook to subscribe to a Firestore collection with real-time updates.
 * Falls back to hardcoded data if Firestore is empty or unavailable.
 */
export function useCollection(collectionName, fallbackData = []) {
  const [data, setData] = useState(fallbackData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = collection(db, collectionName);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          setData(fallbackData);
        } else {
          let items = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }));
          
          // Sort items locally by 'order' to avoid Firestore index errors
          items.sort((a, b) => (a.order || 0) - (b.order || 0));
          
          setData(items);
        }
        setLoading(false);
      },
      (err) => {
        console.warn(`Firestore error for ${collectionName}:`, err);
        setError(err);
        setData(fallbackData);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [collectionName]);

  return { data, loading, error };
}

/**
 * Hook to subscribe to a single Firestore document.
 * Falls back to defaultData if document doesn't exist.
 */
export function useDocument(collectionName, docId, defaultData = {}) {
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const docRef = doc(db, collectionName, docId);

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setData({ id: snapshot.id, ...snapshot.data() });
        } else {
          setData(defaultData);
        }
        setLoading(false);
      },
      (err) => {
        console.warn(`Firestore error for ${collectionName}/${docId}:`, err);
        setError(err);
        setData(defaultData);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [collectionName, docId]);

  return { data, loading, error };
}

// ─── CRUD helpers ───

export async function addItem(collectionName, data) {
  const ref = collection(db, collectionName);
  return addDoc(ref, data);
}

export async function updateItem(collectionName, docId, data) {
  const ref = doc(db, collectionName, docId);
  return updateDoc(ref, data);
}

export async function deleteItem(collectionName, docId) {
  const ref = doc(db, collectionName, docId);
  return deleteDoc(ref);
}

export async function setItem(collectionName, docId, data) {
  const ref = doc(db, collectionName, docId);
  return setDoc(ref, data, { merge: true });
}

// ─── Pre-configured hooks for each section ───

export function useProjects() {
  return useCollection("projects", defaultProjects);
}

export function useExperiences() {
  return useCollection("experiences", defaultExperiences);
}

export function useTestimonials() {
  return useCollection("testimonials", defaultTestimonials);
}

export function useServices() {
  return useCollection("services", defaultServices);
}

export function useHeroData() {
  return useDocument("siteConfig", "hero", {
    greeting: "Hello! I'm",
    name: "MEET UKANI",
    roleOutline: "AI ENGINEER",
    roleSolid: "FULL-STACK DEVELOPER",
    mobileGreeting: "Hello! I'm MEET UKANI",
  });
}

export function useAboutData() {
  return useDocument("siteConfig", "about", {
    heading: "A B O U T   M E",
    text: "I am a self-taught AI & Full-Stack Developer from Gujarat, India. I build intelligent systems, chatbots, and modern web applications. My expertise includes Machine Learning, Deep Learning, NLP, and Full-Stack Web Development with React, Node.js, and Python. Currently building next-gen AI Agents and JARVIS-like Personal Assistants. I have a competitive programming mindset and a deep passion for automation. Code is poetry, AI is the canvas.",
  });
}

export function useSocialLinks() {
  return useDocument("siteConfig", "socialLinks", {
    github: "https://github.com/meetukani34-prog",
    linkedin: "https://www.linkedin.com/in/meet-ukani-0146a7383/",
    twitter: "https://x.com/MeetUkani",
    instagram: "https://www.instagram.com/meet_ukani_34/",
    email: "meet.ukani01@gmail.com",
  });
}

export function useNavLinks() {
  return useCollection("navLinks", [
    { id: "about", title: "About" },
    { id: "work", title: "Chronicles" },
    { id: "contact", title: "Contact" },
  ]);
}
