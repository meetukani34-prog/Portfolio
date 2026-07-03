import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTestimonials, addItem, updateItem, deleteItem } from "../../hooks/useFirestoreData";

const emptyTestimonial = {
  testimonial: "",
  name: "",
  designation: "",
  company: "",
  image: "",
  order: 0,
};

const TestimonialsEditor = () => {
  const { data: testimonials, loading } = useTestimonials();
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...emptyTestimonial });
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const resetForm = () => {
    setForm({ ...emptyTestimonial, order: testimonials.length });
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (item) => {
    setForm({ ...item });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.testimonial.trim()) return alert("Name and testimonial are required");
    setSaving(true);
    try {
      const { id, ...data } = form;
      if (editingId) {
        await updateItem("testimonials", editingId, data);
      } else {
        await addItem("testimonials", data);
      }
      resetForm();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteItem("testimonials", id);
      setDeleteConfirm(null);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-wider">Testimonials</h1>
          <p className="text-[#aaa6c3] text-sm mt-1">Manage feedback and testimonials</p>
        </div>
        <button
          onClick={() => { setForm({ ...emptyTestimonial, order: testimonials.length }); setEditingId(null); setShowForm(true); }}
          className="px-5 py-2.5 bg-gradient-to-r from-[#915eff] to-[#a48afb] text-white font-semibold rounded-lg text-sm tracking-wider uppercase hover:shadow-lg hover:shadow-[#915eff]/25 transition-all"
        >
          + Add Testimonial
        </button>
      </motion.div>

      {/* Testimonials List */}
      <div className="space-y-3 mb-6">
        {testimonials.map((item, i) => (
          <motion.div
            key={item.id || i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-[#1d1836]/60 rounded-xl border border-white/5 p-5 flex items-start justify-between hover:border-white/15 transition-all"
          >
            <div className="flex-1">
              <p className="text-white text-sm italic">"{item.testimonial}"</p>
              <div className="flex items-center gap-2 mt-3">
                {item.image && <img src={item.image} alt={item.name} className="w-8 h-8 rounded-full object-cover" />}
                <div>
                  <p className="text-white text-sm font-medium">@{item.name}</p>
                  <p className="text-[#aaa6c3] text-xs">{item.designation} of {item.company}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              <button onClick={() => startEdit(item)} className="p-2 rounded-lg hover:bg-white/10 text-[#aaa6c3] hover:text-white transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </button>
              <button onClick={() => setDeleteConfirm(item.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-[#aaa6c3] hover:text-red-400 transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200]" onClick={() => setDeleteConfirm(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-[#1d1836] border border-white/10 rounded-xl p-6 max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-white font-bold text-lg mb-2">Delete Testimonial?</h3>
              <p className="text-[#aaa6c3] text-sm mb-5">This action cannot be undone.</p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-sm text-[#aaa6c3] hover:text-white transition-colors">Cancel</button>
                <button onClick={() => handleDelete(deleteConfirm)} className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4" onClick={resetForm}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-[#1d1836] border border-white/10 rounded-xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-white font-bold text-xl mb-5">{editingId ? "Edit" : "Add"} Testimonial</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-[#aaa6c3] text-xs uppercase tracking-widest mb-2">Testimonial Text *</label>
                  <textarea value={form.testimonial} onChange={(e) => setForm({ ...form, testimonial: e.target.value })} rows={4} className="w-full px-4 py-3 bg-[#151030] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#915eff] transition-all resize-y" placeholder="What they said about you..." />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#aaa6c3] text-xs uppercase tracking-widest mb-2">Name *</label>
                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 bg-[#151030] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#915eff] transition-all" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-[#aaa6c3] text-xs uppercase tracking-widest mb-2">Designation</label>
                    <input type="text" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} className="w-full px-4 py-3 bg-[#151030] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#915eff] transition-all" placeholder="CTO" />
                  </div>
                </div>

                <div>
                  <label className="block text-[#aaa6c3] text-xs uppercase tracking-widest mb-2">Company</label>
                  <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full px-4 py-3 bg-[#151030] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#915eff] transition-all" placeholder="Company Name" />
                </div>

                <div>
                  <label className="block text-[#aaa6c3] text-xs uppercase tracking-widest mb-2">Image URL</label>
                  <input type="url" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full px-4 py-3 bg-[#151030] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#915eff] transition-all" placeholder="https://..." />
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <button onClick={resetForm} className="px-5 py-2.5 text-sm text-[#aaa6c3] hover:text-white transition-colors">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 bg-gradient-to-r from-[#915eff] to-[#a48afb] text-white font-semibold rounded-lg text-sm tracking-wider uppercase hover:shadow-lg transition-all disabled:opacity-50">
                  {saving ? "Saving..." : editingId ? "Update" : "Create"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TestimonialsEditor;
