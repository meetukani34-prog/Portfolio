import React from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

const About = () => {
  return (
    <div className="w-full md:w-1/2 ml-auto md:pr-10 lg:pr-20 pointer-events-auto pb-40">
      <motion.div variants={textVariant()}>
        <h2 className="text-[#a48afb] font-normal text-[18px] md:text-[22px] tracking-[0.4em] uppercase mb-4">
          A B O U T &nbsp;&nbsp; M E
        </h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className='mt-4 text-[#dfd9ff] text-[17px] md:text-[20px] font-medium leading-[32px] tracking-wide'
      >
        I am a self-taught AI & Full-Stack Developer from Gujarat, India. I build intelligent systems, 
        chatbots, and modern web applications. My expertise includes Machine Learning, Deep 
        Learning, NLP, and Full-Stack Web Development with React, Node.js, and Python. 
        Currently building next-gen AI Agents and JARVIS-like Personal Assistants. I have 
        a competitive programming mindset and a deep passion for automation. Code is poetry, 
        AI is the canvas.
      </motion.p>
    </div>
  );
};

export default SectionWrapper(About, "about");
