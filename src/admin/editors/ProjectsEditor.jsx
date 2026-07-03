import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProjects, addItem, updateItem, deleteItem } from "../../hooks/useFirestoreData";

const emptyProject = {
  name: "",
  description: "",
  tags: [],
  source_code_link: "",
  image: "",
  order: 0,
};

const ProjectsEditor = () => {
  const { data: projects, loading } = useProjects();
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...emptyProject });
  const [tagInput, setTagInput] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const resetForm = () => {
    setForm({ ...emptyProject, order: projects.length });
    setEditingId(null);
    setTagInput("");
    setShowForm(false);
  };

  const startEdit = (project) => {
    setForm({ ...project });
    setEditingId(project.id);
    setShowForm(true);
  };

  const addTag = () => {
    if (tagInput.trim() && !form.tags.find((t) => t.name === tagInput.trim())) {
      setForm({
        ...form,
        tags: [...form.tags, { name: tagInput.trim(), color: "blue-text-gradient" }],
      });
      setTagInput("");
    }
  };

  const removeTag = (tagName) => {
    setForm({ ...form, tags: form.tags.filter((t) => t.name !== tagName) });
  };

  const handleSave = async () => {
    if (!form.name.trim()) return alert("Project name is required");
    setSaving(true);
    try {
      const { id, ...data } = form;
      if (editingId) {
        await updateItem("projects", editingId, data);
      } else {
        await addItem("projects", data);
      }
      resetForm();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (projectId) => {
    try {
      await deleteItem("projects", projectId);
      setDeleteConfirm(null);
    } catch (err) {
      alert("Error deleting: " + err.message);
    }
  };

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-wider">Projects</h1>
          <p className="text-[#aaa6c3] text-sm mt-1">Manage your "What I Do" projects</p>
        </div>
        <button
          onClick={() => { setForm({ ...emptyProject, order: projects.length }); setEditingId(null); setShowForm(true); }}
          className="px-5 py-2.5 bg-gradient-to-r from-[#915eff] to-[#a48afb] text-white font-semibold rounded-lg text-sm tracking-wider uppercase hover:shadow-lg hover:shadow-[#915eff]/25 transition-all"
        >
          + Add Project
        </button>
      </motion.div>

      {/* Projects List */}
      <div className="space-y-3 mb-6">
        {projects.map((project, i) => (
          <motion.div
            key={project.id || i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-[#1d1836]/60 rounded-xl border border-white/5 p-5 flex items-center justify-between group hover:border-white/15 transition-all"
          >
            <div className="flex-1">
              <h3 className="text-white font-bold text-lg">{project.name}</h3>
              <p className="text-[#aaa6c3] text-sm mt-1 line-clamp-1">{project.description}</p>
              <div className="flex gap-2 mt-2">
                {(project.tags || []).map((tag) => (
                  <span key={tag.name} className="px-2 py-0.5 text-xs rounded-full border border-white/20 text-[#aaa6c3]">
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => startEdit(project)}
                className="p-2 rounded-lg hover:bg-white/10 text-[#aaa6c3] hover:text-white transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => setDeleteConfirm(project.id)}
                className="p-2 rounded-lg hover:bg-red-500/10 text-[#aaa6c3] hover:text-red-400 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </motion.div>
        ))}

        {projects.length === 0 && (
          <div className="text-center py-12 text-[#aaa6c3]">
            <p className="text-lg">No projects yet</p>
            <p className="text-sm mt-1">Click "Add Project" to create your first one</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200]"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1d1836] border border-white/10 rounded-xl p-6 max-w-sm mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-white font-bold text-lg mb-2">Delete Project?</h3>
              <p className="text-[#aaa6c3] text-sm mb-5">This action cannot be undone.</p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-sm text-[#aaa6c3] hover:text-white transition-colors">
                  Cancel
                </button>
                <button onClick={() => handleDelete(deleteConfirm)} className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4"
            onClick={resetForm}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1d1836] border border-white/10 rounded-xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-white font-bold text-xl mb-5">{editingId ? "Edit" : "Add"} Project</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-[#aaa6c3] text-xs uppercase tracking-widest mb-2">Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 bg-[#151030] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#915eff] transition-all"
                    placeholder="Project Name"
                  />
                </div>

                <div>
                  <label className="block text-[#aaa6c3] text-xs uppercase tracking-widest mb-2">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-[#151030] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#915eff] transition-all resize-y"
                    placeholder="Project description..."
                  />
                </div>

                <div>
                  <label className="block text-[#aaa6c3] text-xs uppercase tracking-widest mb-2">Source Code Link</label>
                  <input
                    type="url"
                    value={form.source_code_link}
                    onChange={(e) => setForm({ ...form, source_code_link: e.target.value })}
                    className="w-full px-4 py-3 bg-[#151030] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#915eff] transition-all"
                    placeholder="https://github.com/..."
                  />
                </div>

                <div>
                  <label className="block text-[#aaa6c3] text-xs uppercase tracking-widest mb-2">Image URL</label>
                  <input
                    type="url"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    className="w-full px-4 py-3 bg-[#151030] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#915eff] transition-all"
                    placeholder="https://... or leave empty"
                  />
                </div>

                <div>
                  <label className="block text-[#aaa6c3] text-xs uppercase tracking-widest mb-2">Tags</label>
                  <div className="flex gap-2 flex-wrap mb-2">
                    {(form.tags || []).map((tag) => (
                      <span key={tag.name} className="px-3 py-1 text-xs rounded-full border border-[#915eff]/30 text-white bg-[#915eff]/10 flex items-center gap-1">
                        {tag.name}
                        <button onClick={() => removeTag(tag.name)} className="hover:text-red-400 ml-1">×</button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                      className="flex-1 px-4 py-2 bg-[#151030] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#915eff] transition-all"
                      placeholder="Add tag..."
                    />
                    <button onClick={addTag} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm transition-colors">
                      Add
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[#aaa6c3] text-xs uppercase tracking-widest mb-2">Order</label>
                  <input
                    type="number"
                    value={form.order || 0}
                    onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                    className="w-24 px-4 py-3 bg-[#151030] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#915eff] transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <button onClick={resetForm} className="px-5 py-2.5 text-sm text-[#aaa6c3] hover:text-white transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#915eff] to-[#a48afb] text-white font-semibold rounded-lg text-sm tracking-wider uppercase hover:shadow-lg hover:shadow-[#915eff]/25 transition-all disabled:opacity-50"
                >
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

export default ProjectsEditor;
