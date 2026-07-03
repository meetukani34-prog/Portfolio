/**
 * One-time seed script to push all hardcoded data to Firestore.
 * 
 * Usage: Import and call seedAllData() from browser console or a temp component.
 * After running once, all data will live in Firestore and the admin panel can manage it.
 */
import { collection, doc, setDoc, writeBatch } from "firebase/firestore";
import { db } from "../firebase";

import {
  services as defaultServices,
  experiences as defaultExperiences,
  testimonials as defaultTestimonials,
  projects as defaultProjects,
} from "../constants";

async function seedCollection(collectionName, items) {
  const batch = writeBatch(db);

  items.forEach((item, index) => {
    const docRef = doc(collection(db, collectionName));
    // Clean item: remove non-serializable fields and add order
    const cleanItem = JSON.parse(JSON.stringify(item));
    cleanItem.order = index;
    batch.set(docRef, cleanItem);
  });

  await batch.commit();
  console.log(`✅ Seeded ${items.length} items to "${collectionName}"`);
}

async function seedSiteConfig() {
  // Hero data
  await setDoc(doc(db, "siteConfig", "hero"), {
    greeting: "Hello! I'm",
    name: "MEET UKANI",
    roleOutline: "AI ENGINEER",
    roleSolid: "FULL-STACK DEVELOPER",
    mobileGreeting: "Hello! I'm MEET UKANI",
  });
  console.log("✅ Seeded hero config");

  // About data
  await setDoc(doc(db, "siteConfig", "about"), {
    heading: "A B O U T   M E",
    text: "I am a self-taught AI & Full-Stack Developer from Gujarat, India. I build intelligent systems, chatbots, and modern web applications. My expertise includes Machine Learning, Deep Learning, NLP, and Full-Stack Web Development with React, Node.js, and Python. Currently building next-gen AI Agents and JARVIS-like Personal Assistants. I have a competitive programming mindset and a deep passion for automation. Code is poetry, AI is the canvas.",
  });
  console.log("✅ Seeded about config");

  // Social links
  await setDoc(doc(db, "siteConfig", "socialLinks"), {
    github: "https://github.com/meetukani34-prog",
    linkedin: "https://www.linkedin.com/in/meet-ukani-0146a7383/",
    twitter: "https://x.com/MeetUkani",
    instagram: "https://www.instagram.com/meet_ukani_34/",
    email: "meet.ukani01@gmail.com",
  });
  console.log("✅ Seeded social links");

  // Nav links
  const navLinks = [
    { id: "about", title: "About", order: 0 },
    { id: "work", title: "Chronicles", order: 1 },
    { id: "contact", title: "Contact", order: 2 },
  ];
  const navBatch = writeBatch(db);
  navLinks.forEach((link) => {
    const docRef = doc(db, "navLinks", link.id);
    navBatch.set(docRef, link);
  });
  await navBatch.commit();
  console.log("✅ Seeded nav links");
}

export async function seedAllData() {
  console.log("🌱 Starting Firestore seed...");

  try {
    // Seed collections (strip non-serializable fields like imported image objects)
    const cleanProjects = defaultProjects.map((p) => ({
      ...p,
      image: typeof p.image === "string" ? p.image : "",
    }));

    const cleanServices = defaultServices.map((s) => ({
      ...s,
      icon: typeof s.icon === "string" ? s.icon : "",
    }));

    const cleanExperiences = defaultExperiences.map((e) => ({
      ...e,
      icon: typeof e.icon === "string" ? e.icon : "",
    }));

    await seedCollection("projects", cleanProjects);
    await seedCollection("services", cleanServices);
    await seedCollection("experiences", cleanExperiences);
    await seedCollection("testimonials", defaultTestimonials);
    await seedSiteConfig();

    console.log("🎉 All data seeded successfully!");
    return true;
  } catch (error) {
    console.error("❌ Seed failed:", error);
    throw error;
  }
}
