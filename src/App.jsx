import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";

import { About, Contact, Experience, Feedbacks, Hero, Navbar, Tech, Works, Services, StarsCanvas, Preloader, AvatarCanvas, DeskAvatarCanvas } from "./components";
import Cursor from "./components/Cursor";

import { FaLinkedinIn, FaRegFileAlt, FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FiInstagram } from "react-icons/fi";

import { AuthProvider } from "./context/AuthContext";
import { useSocialLinks } from "./hooks/useFirestoreData";
import AdminLogin from "./admin/AdminLogin";
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import HeroEditor from "./admin/editors/HeroEditor";
import AboutEditor from "./admin/editors/AboutEditor";
import ProjectsEditor from "./admin/editors/ProjectsEditor";
import ExperiencesEditor from "./admin/editors/ExperiencesEditor";
import TestimonialsEditor from "./admin/editors/TestimonialsEditor";
import ServicesEditor from "./admin/editors/ServicesEditor";
import SocialLinksEditor from "./admin/editors/SocialLinksEditor";

const SocialSidebar = () => {
  const { data: social } = useSocialLinks();

  return (
    <div className="fixed left-6 md:left-10 top-[70%] transform -translate-y-1/2 z-[100] pointer-events-auto">
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1, y: 0 }}
        transition={{ 
          x: { type: "spring", stiffness: 100, damping: 20, delay: 0.5 },
          opacity: { duration: 0.8, delay: 0.5 }
        }}
        className="flex flex-col items-center gap-5 py-5 px-2 rounded-full transition-all duration-300 ease-in-out bg-transparent group"
        data-cursor="icons"
      >
        <a href={social.github || "https://github.com/"} target="_blank" rel="noreferrer" className="flex items-center justify-center p-1.5 text-white hover:text-black hover:scale-125 transition-colors duration-300 relative z-50 pointer-events-auto cursor-pointer"><FaGithub size={30} /></a>
        <a href={social.linkedin || "#"} target="_blank" rel="noreferrer" className="flex items-center justify-center p-1.5 text-white hover:text-black hover:scale-125 transition-colors duration-300 relative z-50 pointer-events-auto cursor-pointer"><FaLinkedinIn size={30} /></a>
        <a href={social.twitter || "#"} target="_blank" rel="noreferrer" className="flex items-center justify-center p-1.5 text-white hover:text-black hover:scale-125 transition-colors duration-300 relative z-50 pointer-events-auto cursor-pointer"><FaXTwitter size={30} /></a>
        <a href={social.instagram || "#"} target="_blank" rel="noreferrer" className="flex items-center justify-center p-1.5 text-white hover:text-black hover:scale-125 transition-colors duration-300 relative z-50 pointer-events-auto cursor-pointer"><FiInstagram size={30} /></a>
      </motion.div>
    </div>
  );
};

const Portfolio = () => {
  return (
    <>
      <div className='relative z-0 bg-primary'>
        
        {/* Wrapper for Hero, About, Works, Services with Sticky Avatar Background */}
        <div className="relative">
          
          {/* Sticky Layer: Avatar stays pinned while content scrolls over it */}
          <div className="sticky top-0 h-screen w-full z-0 overflow-hidden pointer-events-none">
             <div className="absolute inset-0 bg-[#050816]" />
             <div className="absolute inset-0 z-[5] mt-20 pointer-events-auto">
               <AvatarCanvas />
             </div>
          </div>
          
          {/* Scrollable Content (Hero, About, Works) */}
          <div className="relative z-10 -mt-[100vh]">
            <Navbar />
            <Hero />
            <About />
            <Works />
          </div>
        </div>

        <div className='relative z-0'>
          <Services />
        </div>

        <Experience />
        <Tech />
        <Feedbacks />
        <div className='relative z-0'>
          <Contact />
          <StarsCanvas />
        </div>
      </div>

      {/* Global Cursor */}
      <Cursor />

      {/* Global Fixed Social Sidebar */}
      <SocialSidebar />
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Portfolio (main site) */}
          <Route path="/" element={<Portfolio />} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/hero" element={<HeroEditor />} />
            <Route path="/admin/about" element={<AboutEditor />} />
            <Route path="/admin/projects" element={<ProjectsEditor />} />
            <Route path="/admin/experiences" element={<ExperiencesEditor />} />
            <Route path="/admin/testimonials" element={<TestimonialsEditor />} />
            <Route path="/admin/services" element={<ServicesEditor />} />
            <Route path="/admin/social" element={<SocialLinksEditor />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
