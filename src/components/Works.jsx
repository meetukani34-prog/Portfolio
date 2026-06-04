import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { projects } from "../constants";
import { DeskAvatarCanvas } from "./canvas";

const AccordionItem = ({ project, isOpen, onClick }) => {
  return (
    <div 
      className={`relative w-full border border-secondary/30 rounded-lg p-6 mb-4 cursor-pointer transition-all duration-300 ${isOpen ? 'bg-tertiary/50 border-secondary' : 'hover:bg-tertiary/20'}`}
      onClick={onClick}
    >
      {/* Corner Bracket decorations (optional, matching the screenshot vibe) */}
      {isOpen && (
        <>
          <div className="absolute top-[-1px] left-[-1px] w-4 h-4 border-t-2 border-l-2 border-white rounded-tl-md" />
          <div className="absolute top-[-1px] right-[-1px] w-4 h-4 border-t-2 border-r-2 border-white rounded-tr-md" />
          <div className="absolute bottom-[-1px] left-[-1px] w-4 h-4 border-b-2 border-l-2 border-white rounded-bl-md" />
          <div className="absolute bottom-[-1px] right-[-1px] w-4 h-4 border-b-2 border-r-2 border-white rounded-br-md" />
        </>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-white font-bold text-[24px] uppercase tracking-wider">{project.name}</h3>
        </div>
        <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 9L12 15L18 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="mt-4 text-secondary text-[14px] leading-relaxed">
              {project.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={`${project.name}-${tag.name}`}
                  className="px-3 py-1 text-[12px] rounded-full border border-secondary/50 text-white bg-black/20"
                >
                  {tag.name}
                </span>
              ))}
            </div>
            {/* Optional Source Code Link */}
            <div className="mt-4">
              <a 
                href={project.source_code_link} 
                target="_blank" 
                rel="noreferrer"
                className="text-[#915eff] text-[12px] uppercase tracking-wider hover:underline"
                onClick={(e) => e.stopPropagation()} // Prevent accordion toggle when clicking link
              >
                View Source
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Works = () => {
  const [openIndex, setOpenIndex] = useState(0); // First item open by default

  return (
    <div className="w-full flex flex-col md:flex-row gap-10 mt-10 min-h-[80vh]">
      {/* Left Column: Title & Desk Avatar (Sticky) */}
      <div className="w-full md:w-1/2 flex flex-col relative h-[50vh] md:h-screen md:sticky md:top-0">
        <h2 className="font-bold text-white text-[40px] md:text-[60px] lg:text-[80px] leading-[1] tracking-widest uppercase absolute top-20 left-0 z-10 drop-shadow-lg">
          WHAT I DO
        </h2>
        
        {/* Desk Avatar Canvas removed to avoid duplication with continuous global avatar */}
        <div className="absolute inset-0 z-0">
          {/* Avatar is now handled globally in App.jsx */}
        </div>
      </div>

      {/* Right Column: Projects Accordion */}
      <div className="w-full md:w-1/2 flex flex-col justify-center z-10 md:py-[20vh]">
        {projects.map((project, index) => (
          <AccordionItem 
            key={`project-${index}`} 
            project={project} 
            isOpen={openIndex === index}
            onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
          />
        ))}
      </div>
    </div>
  );
};

export default SectionWrapper(Works, "work");
