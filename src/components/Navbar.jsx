import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { styles } from "../styles";
import { navLinks } from "../constants";
import { menu, close } from "../assets";
import { motion } from "framer-motion";

const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`${
        styles.paddingX
      } w-full flex items-center py-6 fixed top-0 z-20 ${
        scrolled ? "bg-[#050816] shadow-md" : "bg-transparent"
      }`}
    >
      <div className='w-full flex justify-between items-center max-w-7xl mx-auto'>
        {/* Left: Logo */}
        <Link
          to='/'
          className='flex items-center gap-2'
          onClick={() => {
            setActive("");
            window.scrollTo(0, 0);
          }}
        >
          <p className='text-white text-[20px] font-bold cursor-pointer tracking-wider'>
            Meet Ukani
          </p>
        </Link>

        {/* Center: Email */}
        <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2">
          <p className="text-secondary text-[14px] tracking-wider font-medium hover:text-white transition-colors cursor-pointer">
          meet.ukani01@gmail.com
          </p>
        </div>

        {/* Right: Nav Links */}
        <ul className='list-none hidden sm:flex flex-row gap-2 items-center p-1 rounded-full bg-white/5 backdrop-blur-md border border-white/10'>
          {navLinks.map((nav) => {
            const isActive = active === nav.title;
            return (
              <li
                key={nav.id}
                className={`relative px-4 py-2 rounded-full cursor-pointer transition-colors duration-300 ${
                  isActive ? "text-white" : "text-secondary hover:text-white"
                } text-[13px] font-semibold tracking-widest uppercase`}
                onClick={() => setActive(nav.title)}
              >
                {isActive && (
                  <motion.div
                    layoutId="liquidBg"
                    className="absolute inset-0 bg-[#915eff] rounded-full"
                    style={{ zIndex: 0 }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <a href={`#${nav.id}`} className="relative z-10">{nav.title}</a>
              </li>
            );
          })}
        </ul>

        {/* Mobile Menu Toggle */}
        <div className='sm:hidden flex flex-1 justify-end items-center'>
          <img
            src={toggle ? close : menu}
            alt='menu'
            className='w-[28px] h-[28px] object-contain cursor-pointer'
            onClick={() => setToggle(!toggle)}
          />

          <div
            className={`${
              !toggle ? "hidden" : "flex"
            } p-6 black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] z-10 rounded-xl`}
          >
            <ul className='list-none flex justify-end items-start flex-1 flex-col gap-4'>
              {navLinks.map((nav) => (
                <li
                  key={nav.id}
                  className={`font-poppins font-medium cursor-pointer text-[16px] uppercase tracking-widest ${
                    active === nav.title ? "text-white" : "text-secondary"
                  }`}
                  onClick={() => {
                    setToggle(!toggle);
                    setActive(nav.title);
                  }}
                >
                  <a href={`#${nav.id}`}>{nav.title}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
