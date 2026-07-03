import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSocialLinks, setItem } from "../../hooks/useFirestoreData";

const SocialLinksEditor = () => {
  const { data: social, loading } = useSocialLinks();
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (social) setForm({ ...social });
  }, [social]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { id, ...data } = form;
      await setItem("siteConfig", "socialLinks", data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      alert("Error saving: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-white">Loading...</div>;

  const fields = [
    { label: "Email", field: "email", placeholder: "meet.ukani01@gmail.com", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
    { label: "GitHub", field: "github", placeholder: "https://github.com/...", icon: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" },
    { label: "LinkedIn", field: "linkedin", placeholder: "https://linkedin.com/in/...", icon: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" },
    { label: "X (Twitter)", field: "twitter", placeholder: "https://x.com/...", icon: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" },
    { label: "Instagram", field: "instagram", placeholder: "https://instagram.com/...", icon: "M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M6.5 2h11A4.5 4.5 0 0122 6.5v11a4.5 4.5 0 01-4.5 4.5h-11A4.5 4.5 0 012 17.5v-11A4.5 4.5 0 016.5 2z" },
  ];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-wider">Social Links</h1>
        <p className="text-[#aaa6c3] text-sm mt-1">Update your social media links and email</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#1d1836]/60 rounded-xl border border-white/5 p-6 space-y-5 max-w-2xl"
      >
        {fields.map(({ label, field, placeholder, icon }) => (
          <div key={field}>
            <label className="flex items-center gap-2 text-[#aaa6c3] text-xs uppercase tracking-widest mb-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
              </svg>
              {label}
            </label>
            <input
              type={field === "email" ? "email" : "url"}
              value={form[field] || ""}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
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

export default SocialLinksEditor;
