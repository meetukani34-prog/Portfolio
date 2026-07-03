import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useHeroData, setItem } from "../../hooks/useFirestoreData";

const HeroEditor = () => {
  const { data: hero, loading } = useHeroData();
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (hero) setForm({ ...hero });
  }, [hero]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { id, ...data } = form;
      await setItem("siteConfig", "hero", data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      alert("Error saving: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-wider">Hero Section</h1>
        <p className="text-[#aaa6c3] text-sm mt-1">Edit your name, greeting, and role titles</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#1d1836]/60 rounded-xl border border-white/5 p-6 space-y-5 max-w-2xl"
      >
        {[
          { label: "Greeting", field: "greeting", placeholder: "Hello! I'm" },
          { label: "Name", field: "name", placeholder: "MEET UKANI" },
          { label: "Role (Outline)", field: "roleOutline", placeholder: "AI ENGINEER" },
          { label: "Role (Solid)", field: "roleSolid", placeholder: "FULL-STACK DEVELOPER" },
          { label: "Mobile Greeting", field: "mobileGreeting", placeholder: "Hello! I'm MEET UKANI" },
        ].map(({ label, field, placeholder }) => (
          <div key={field}>
            <label className="block text-[#aaa6c3] text-xs uppercase tracking-widest mb-2">{label}</label>
            <input
              type="text"
              value={form[field] || ""}
              onChange={(e) => handleChange(field, e.target.value)}
              placeholder={placeholder}
              className="w-full px-4 py-3 bg-[#151030] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#915eff] transition-all"
            />
          </div>
        ))}

        <button
          onClick={handleSave}
          disabled={saving}
          className={`px-6 py-3 rounded-lg font-semibold text-sm tracking-wider uppercase transition-all duration-300 ${
            saved
              ? "bg-emerald-600 text-white"
              : "bg-gradient-to-r from-[#915eff] to-[#a48afb] text-white hover:shadow-lg hover:shadow-[#915eff]/25"
          } disabled:opacity-50`}
        >
          {saving ? "Saving..." : saved ? "✓ Saved!" : "Save Changes"}
        </button>
      </motion.div>
    </div>
  );
};

export default HeroEditor;
