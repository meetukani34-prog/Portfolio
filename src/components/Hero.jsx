import { useState } from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { FaRegFileAlt } from "react-icons/fa";

const Hero = () => {

  return (
    <>
      {/* Scrollable Hero Content */}
      <section className={`relative w-full h-screen mx-auto overflow-hidden`}>
        <div className="absolute inset-0 z-10 pointer-events-none max-w-[1800px] mx-auto w-full">

        {/* Left Intro Text (Matching reference CSS) */}
        <div className="hidden sm:block absolute left-20 md:left-24 lg:left-32 top-1/2 transform -translate-y-1/2 pointer-events-auto mt-[-50px]">
          <p className="text-[#a48afb] font-normal text-[18px] md:text-[22px] lg:text-[24px] tracking-wide mb-2">Hello! I'm</p>
          <h1 className="font-bold text-white text-[32px] md:text-[40px] lg:text-[45px] leading-[1.1] tracking-[0.05em] uppercase drop-shadow-md whitespace-nowrap">
            MEET UKANI
          </h1>
        </div>

        {/* Right Role Text (Matching reference CSS exactly) */}
        <div className="hidden sm:block absolute right-10 md:right-16 lg:right-20 top-[45%] transform -translate-y-1/2 pointer-events-auto text-left mt-[-50px]">
          <p className="text-[#a48afb] font-normal text-[16px] md:text-[18px] lg:text-[20px] tracking-widest mb-1">An</p>
          <div className="flex flex-col relative">
            <h1
              className="font-bold text-[32px] md:text-[45px] lg:text-[52px] leading-[0.9] tracking-[0.1em] uppercase"
              style={{ WebkitTextStroke: '1px #a48afb', color: 'transparent' }}
            >
              AI ENGINEER
            </h1>
            <h1 className="font-bold text-white text-[24px] md:text-[30px] lg:text-[34px] leading-[0.9] tracking-[0.1em] uppercase drop-shadow-md -mt-1">
              FULL-STACK DEVELOPER
            </h1>
          </div>
        </div>
      </div>

      {/* Bottom Right Resume Button */}
      <div className="absolute bottom-10 right-10 md:right-20 z-10 pointer-events-auto">
        <a
          href="/resume.pdf"
          target="_blank"
          className="flex items-center gap-3 text-secondary hover:text-white transition-colors tracking-widest text-[14px] font-semibold uppercase"
        >
          RESUME <FaRegFileAlt size={18} />
        </a>
      </div>

      {/* Mobile Text (Shows only on small screens) */}
      <div className="sm:hidden absolute top-32 left-0 w-full px-6 flex flex-col items-center justify-center text-center z-10 pointer-events-none">
        <p className="text-[#dfd9ff] font-medium text-[16px]">Hello! I'm MEET UKANI</p>
        <h1 className="font-black text-white text-[28px] leading-tight mt-2 drop-shadow-md">
          AI ENGINEER | <br />
          FULL-STACK DEVELOPER
        </h1>
      </div>

    </section>
    </>
  );
};

export default Hero;
