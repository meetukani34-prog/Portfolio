import {
  mobile,
  backend,
  creator,
  web,
  javascript,
  typescript,
  html,
  css,
  reactjs,
  redux,
  tailwind,
  nodejs,
  mongodb,
  git,
  figma,
  docker,
  meta,
  starbucks,
  tesla,
  shopify,
  carrent,
  jobit,
  tripguide,
  threejs,
} from "../assets";

import { SiPython, SiJavascript, SiTypescript, SiC, SiCplusplus, SiKotlin, SiHtml5, SiCss, SiGnubash, SiReact, SiNextdotjs, SiBootstrap, SiNodedotjs, SiDjango, SiFlask, SiFastapi, SiTensorflow, SiPytorch, SiScikitlearn, SiOpencv, SiNumpy, SiTailwindcss, SiPandas, SiMysql, SiPostgresql, SiMongodb, SiFirebase, SiRedis, SiDocker, SiGit, SiGithub, SiLinux, SiVercel, SiJupyter, SiFigma, SiPostman, SiHuggingface } from "react-icons/si";
import { VscAzure, VscVscode } from "react-icons/vsc";
import { FaAws, FaMicrosoft } from "react-icons/fa";
import { DiPhotoshop } from "react-icons/di";

export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "work",
    title: "Chronicles",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const services = [
  {
    title: "Full-Stack Developer",
    icon: web,
  },
  {
    title: "AI Enthusiast",
    icon: mobile,
  },
  {
    title: "Backend Engineer",
    icon: backend,
  },
  {
    title: "NLP Researcher",
    icon: creator,
  },
];

const technologies = [
  [
    { name: "Python", icon: SiPython, color: "#3776AB" },
    { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
    { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
    { name: "C", icon: SiC, color: "#A8B9CC" },
    { name: "C++", icon: SiCplusplus, color: "#00599C" },
    { name: "HTML", icon: SiHtml5, color: "#E34F26" },
    { name: "CSS", icon: SiCss, color: "#1572B6" },
    { name: "React", icon: SiReact, color: "#61DAFB" },
    { name: "Next.js", icon: SiNextdotjs, color: "#ffffff" },
  ],
  [
    { name: "Node.js", icon: SiNodedotjs, color: "#339939" },
    { name: "Flask", icon: SiFlask, color: "#ffffff" },
    { name: "FastAPI", icon: SiFastapi, color: "#009688" },
    { name: "PyTorch", icon: SiPytorch, color: "#EE4C2C" },
    { name: "Scikit-learn", icon: SiScikitlearn, color: "#F7931E" },
    { name: "OpenCV", icon: SiOpencv, color: "#5C3EE8" },
    { name: "NumPy", icon: SiNumpy, color: "#013243" },
    { name: "Tailwind", icon: SiTailwindcss, color: "#06B6D4" },
  ],
  [
    { name: "Pandas", icon: SiPandas, color: "#150458" },
    { name: "MySQL", icon: SiMysql, color: "#4479A1" },
    { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
    { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
    { name: "Firebase", icon: SiFirebase, color: "#FFCA28" },
    { name: "Docker", icon: SiDocker, color: "#2496ED" },
    { name: "Azure", icon: VscAzure, color: "#0089D6" },
  ],
  [
    { name: "Git", icon: SiGit, color: "#F05032" },
    { name: "GitHub", icon: SiGithub, color: "#ffffff" },
    { name: "Linux", icon: SiLinux, color: "#FCC624" },
    { name: "AWS", icon: FaAws, color: "#FF9900" },
    { name: "VS Code", icon: VscVscode, color: "#007ACC" },
    { name: "Vercel", icon: SiVercel, color: "#ffffff" },
  ],
  [
    { name: "Jupyter", icon: SiJupyter, color: "#F37626" },
    { name: "Figma", icon: SiFigma, color: "#F24E1E" },
    { name: "Postman", icon: SiPostman, color: "#FF6C37" },
    { name: "Photoshop", icon: DiPhotoshop, color: "#31A8FF" },
  ],
  [
    { name: "Hugging Face", icon: SiHuggingface, color: "#FFD21E" },
    { name: "MS Office", icon: FaMicrosoft, color: "#D83B01" },
  ],
];

const experiences = [
  {
    title: "Fundamentals & C/C++",
    company_name: "The Beginning",
    icon: starbucks,
    iconBg: "#383E56",
    date: "2023",
    points: [
      "Began the coding journey.",
      "Mastered core Data Structures, Algorithms, and low-level memory management with C and C++.",
    ],
  },
  {
    title: "Mastering React, Node.js & Hackathons",
    company_name: "Building the Foundation",
    icon: tesla,
    iconBg: "#E6DEDD",
    date: "2024",
    points: [
      "Built robust Full-Stack applications using the MERN stack.",
      "Participated and won multiple national-level hackathons.",
      "Refined rapid prototyping and teamwork skills under pressure.",
    ],
  },
  {
    title: "AI Integration & NLP Research",
    company_name: "The Intelligent Leap",
    icon: shopify,
    iconBg: "#383E56",
    date: "2025",
    points: [
      "Diving deep into Machine Learning and Natural Language Processing.",
      "Integrating Large Language Models into practical applications.",
      "Exploring conversational interfaces and intelligent agents.",
    ],
  },
  {
    title: "Engineering Degree at VTU",
    company_name: "Building Intelligent Systems",
    icon: meta,
    iconBg: "#E6DEDD",
    date: "2026",
    points: [
      "Graduating with a degree in Computer Science from VTU, Bangalore.",
      "Focusing on scalable architectures and high-availability systems.",
      "Pushing the boundaries of modern tech with Next-Gen platforms.",
    ],
  },
];

const testimonials = [
  {
    testimonial:
      "Meet has an incredible knack for blending robust backend systems with elegant, conversational interfaces.",
    name: "Rahul S.",
    designation: "Project Lead",
    company: "Hackathon Team",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    testimonial:
      "The AI Proctoring system in the Exam Portal completely changed how we evaluate students remotely.",
    name: "Prof. Sharma",
    designation: "Head of Dept",
    company: "VTU",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    testimonial:
      "Stitch's resume analyzer saves us countless hours in our recruitment pipeline. A true game-changer.",
    name: "Priya V.",
    designation: "HR Manager",
    company: "Tech Startups Inc",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
  },
];

const projects = [
  {
    name: "Sarvam",
    description:
      "A Universal Health QR system designed to unify patient records securely. Built with scalable architecture for high availability.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "python",
        color: "green-text-gradient",
      },
      {
        name: "supabase",
        color: "pink-text-gradient",
      },
    ],
    image: carrent,
    source_code_link: "https://github.com/",
  },
  {
    name: "Exam Portal",
    description:
      "A next-generation examination platform featuring advanced AI proctoring and real-time behavioral analysis.",
    tags: [
      {
        name: "nextjs",
        color: "blue-text-gradient",
      },
      {
        name: "fastapi",
        color: "green-text-gradient",
      },
      {
        name: "ai-proctoring",
        color: "pink-text-gradient",
      },
    ],
    image: jobit,
    source_code_link: "https://github.com/",
  },
  {
    name: "Stitch",
    description:
      "An intelligent AI Resume Analyzer that uses Natural Language Processing to match candidate profiles with job descriptions instantly.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "nlp",
        color: "green-text-gradient",
      },
      {
        name: "python",
        color: "pink-text-gradient",
      },
    ],
    image: tripguide,
    source_code_link: "https://github.com/",
  },
  {
    name: "RedxChess",
    description:
      "A high-performance custom chess engine featuring alpha-beta pruning, bitboards, and advanced move generation optimizations.",
    tags: [
      {
        name: "c++",
        color: "blue-text-gradient",
      },
      {
        name: "algorithms",
        color: "green-text-gradient",
      },
      {
        name: "ai-engine",
        color: "pink-text-gradient",
      },
    ],
    image: carrent,
    source_code_link: "https://github.com/",
  },
];

export { services, technologies, experiences, testimonials, projects };
