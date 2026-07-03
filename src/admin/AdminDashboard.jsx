import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useProjects, useExperiences, useTestimonials, useServices } from "../hooks/useFirestoreData";

const StatCard = ({ title, count, icon, color, link, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
  >
    <Link
      to={link}
      className="block p-6 rounded-xl bg-[#1d1836]/60 border border-white/5 hover:border-white/15 transition-all duration-300 hover:shadow-lg hover:shadow-[#915eff]/5 group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
          </svg>
        </div>
        <svg className="w-5 h-5 text-[#aaa6c3] group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
      <p className="text-3xl font-bold text-white mb-1">{count}</p>
      <p className="text-[#aaa6c3] text-sm tracking-wider uppercase">{title}</p>
    </Link>
  </motion.div>
);

const AdminDashboard = () => {
  const { data: projects } = useProjects();
  const { data: experiences } = useExperiences();
  const { data: testimonials } = useTestimonials();
  const { data: services } = useServices();

  const stats = [
    { title: "Projects", count: projects.length, icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10", color: "bg-[#915eff]", link: "/admin/projects" },
    { title: "Experiences", count: experiences.length, icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", color: "bg-emerald-600", link: "/admin/experiences" },
    { title: "Testimonials", count: testimonials.length, icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", color: "bg-amber-600", link: "/admin/testimonials" },
    { title: "Services", count: services.length, icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", color: "bg-blue-600", link: "/admin/services" },
  ];

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white tracking-wider">Dashboard</h1>
        <p className="text-[#aaa6c3] text-sm mt-1 tracking-wide">Overview of your portfolio content</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {stats.map((stat, i) => (
          <StatCard key={stat.title} {...stat} delay={i * 0.1} />
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-xl font-bold text-white mb-4 tracking-wider">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: "Edit Hero Section", path: "/admin/hero", desc: "Update name, roles, greeting" },
            { label: "Edit About Me", path: "/admin/about", desc: "Update your bio paragraph" },
            { label: "Manage Social Links", path: "/admin/social", desc: "Update GitHub, LinkedIn, etc." },
          ].map((action) => (
            <Link
              key={action.path}
              to={action.path}
              className="p-5 rounded-xl bg-[#1d1836]/40 border border-white/5 hover:border-[#915eff]/30 transition-all duration-300 group"
            >
              <p className="text-white font-medium tracking-wide group-hover:text-[#a48afb] transition-colors">{action.label}</p>
              <p className="text-[#aaa6c3] text-xs mt-1">{action.desc}</p>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
