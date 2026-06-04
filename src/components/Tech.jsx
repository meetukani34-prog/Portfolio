import React from "react";
import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";
import { TechGlobeCanvas } from "./canvas";

const deviconMap = {
  "Python": "python/python-original.svg",
  "JavaScript": "javascript/javascript-original.svg",
  "TypeScript": "typescript/typescript-original.svg",
  "C": "c/c-original.svg",
  "C++": "cplusplus/cplusplus-original.svg",
  "HTML": "html5/html5-original.svg",
  "CSS": "css3/css3-original.svg",
  "React": "react/react-original.svg",
  "Next.js": "nextjs/nextjs-original.svg",
  "Node.js": "nodejs/nodejs-original.svg",
  "Flask": "flask/flask-original.svg",
  "FastAPI": "fastapi/fastapi-original.svg",
  "PyTorch": "pytorch/pytorch-original.svg",
  "Scikit-learn": "scikitlearn/scikitlearn-original.svg",
  "OpenCV": "opencv/opencv-original.svg",
  "NumPy": "numpy/numpy-original.svg",
  "Tailwind": "tailwindcss/tailwindcss-original.svg",
  "Pandas": "pandas/pandas-original.svg",
  "MySQL": "mysql/mysql-original.svg",
  "PostgreSQL": "postgresql/postgresql-original.svg",
  "MongoDB": "mongodb/mongodb-original.svg",
  "Firebase": "firebase/firebase-original.svg",
  "Docker": "docker/docker-original.svg",
  "Azure": "azure/azure-original.svg",
  "Git": "git/git-original.svg",
  "GitHub": "github/github-original.svg",
  "Linux": "linux/linux-original.svg",
  "AWS": "amazonwebservices/amazonwebservices-original-wordmark.svg",
  "VS Code": "vscode/vscode-original.svg",
  "Vercel": "vercel/vercel-original.svg",
  "Jupyter": "jupyter/jupyter-original.svg",
  "Figma": "figma/figma-original.svg",
  "Postman": "postman/postman-original.svg",
  "Photoshop": "photoshop/photoshop-original.svg"
};

const getDeviconUrl = (techName) => {
  const path = deviconMap[techName];
  if (!path) return null;
  if (techName === "AWS") {
    return `https://raw.githubusercontent.com/devicons/devicon/master/icons/${path}`;
  }
  return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${path}`;
};

const Tech = () => {
  return (
    <div className="relative w-full flex flex-col items-center justify-center min-h-[800px]">
      {/* 3D Wireframe Tech Globe Background */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <TechGlobeCanvas />
      </div>

      <div className="relative z-10 w-full flex flex-col items-center justify-center">
        <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-16 tracking-widest text-center uppercase drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
          Tech Stack
        </h2>
        
        <div className="flex flex-col items-center justify-center gap-2 sm:gap-3 w-full max-w-[1200px] mx-auto">
        {technologies.map((row, rowIndex) => (
          <div 
            key={rowIndex} 
            className="flex flex-row flex-wrap justify-center gap-2 sm:gap-3"
          >
            {row.map((tech) => {
              const Icon = tech.icon;
              const imgUrl = getDeviconUrl(tech.name);
              
              return (
                <div 
                  key={tech.name}
                  data-cursor="tooltip"
                  data-tooltip-text={tech.name}
                  data-tooltip-color={tech.color || "#a855f7"}
                  style={{ "--hover-color": tech.color || "#a855f7" }}
                  className="group relative flex flex-col items-center justify-center w-[56px] h-[56px] sm:w-[68px] sm:h-[68px] bg-[#151030]/30 backdrop-blur-sm border border-white/10 rounded-2xl cursor-pointer transition-all duration-300 hover:border-[var(--hover-color)] hover:bg-[#151030]/80 hover:shadow-[0_0_15px_var(--hover-color)] hover:-translate-y-2 z-0 hover:z-10"
                >
                  {/* Monochrome Icon (Visible by default, hidden on hover if colored image exists) */}
                  <Icon className={`absolute text-2xl sm:text-3xl text-gray-400 transition-all duration-300 ${imgUrl ? 'group-hover:opacity-0 group-hover:scale-75' : 'group-hover:text-[var(--hover-color)]'}`} />
                  
                  {/* Original Colored Image (Hidden by default, visible on hover) */}
                  {imgUrl && (
                    <img 
                      src={imgUrl} 
                      alt={tech.name} 
                      className="absolute w-8 h-8 sm:w-10 sm:h-10 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300"
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}
        </div>
      </div>
    </div>
  );
};

export default SectionWrapper(Tech, "tech");
