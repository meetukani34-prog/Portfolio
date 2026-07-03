import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useServices, addItem, updateItem, deleteItem } from "../../hooks/useFirestoreData";

const emptyService = {
  title: "",
  icon: "",
  order: 0,
};

const ServicesEditor = () => {
  const { data: services, loading } = useServices();
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...emptyService });
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const resetForm = () => {
    setForm({ ...emptyService, order: services.length });
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (item) => {
    setForm({ ...item });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) return alert("Title is required");
    setSaving(true);
    try {
      const { id, ...data } = form;
      if (editingId) {
        await updateItem("services", editingId, data);
      } else {
        await addItem("services", data);
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
      await deleteItem("services", id);
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
          <h1 className="text-3xl font-bold text-white tracking-wider">Services</h1>
          <p className="text-[#aaa6c3] text-sm mt-1">Manage service cards</p>
        </div>
        <button
          onClick={() => { setForm({ ...emptyService, order: services.length }); setEditingId(null); setShowForm(true); }}
          className="px-5 py-2.5 bg-gradient-to-r from-[#915eff] to-[#a48afb] text-white font-semibold rounded-lg text-sm tracking-wider uppercase hover:shadow-lg hover:shadow-[#915eff]/25 transition-all"
        >
          + Add Service
        </button>
      </motion.div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {services.map((item, i) => (
          <motion.div
            key={item.id || i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-[#1d1836]/60 rounded-xl border border-white/5 p-5 hover:border-white/15 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              {item.icon && <img src={item.icon} alt={item.title} className="w-12 h-12 object-contain" />}
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => startEdit(item)} className="p-1.5 rounded hover:bg-white/10 text-[#aaa6c3] hover:text-white transition-all">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button onClick={() => setDeleteConfirm(item.id)} className="p-1.5 rounded hover:bg-red-500/10 text-[#aaa6c3] hover:text-red-400 transition-all">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
            <h3 className="text-white font-bold">{item.title}</h3>
          </motion.div>
        ))}
      </div>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200]" onClick={() => setDeleteConfirm(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-[#1d1836] border border-white/10 rounded-xl p-6 max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-white font-bold text-lg mb-2">Delete Service?</h3>
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
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-[#1d1836] border border-white/10 rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-white font-bold text-xl mb-5">{editingId ? "Edit" : "Add"} Service</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-[#aaa6c3] text-xs uppercase tracking-widest mb-2">Title *</label>
                  <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-3 bg-[#151030] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#915eff] transition-all" placeholder="Full-Stack Developer" />
                </div>

                <div>
                  <label className="block text-[#aaa6c3] text-xs uppercase tracking-widest mb-2">Icon URL</label>
                  <input type="url" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="w-full px-4 py-3 bg-[#151030] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#915eff] transition-all" placeholder="https://..." />
                </div>

                <div>
                  <label className="block text-[#aaa6c3] text-xs uppercase tracking-widest mb-2">Order</label>
                  <input type="number" value={form.order || 0} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} className="w-24 px-4 py-3 bg-[#151030] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#915eff] transition-all" />
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

export default ServicesEditor;
