import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./Cursor.css";

const Cursor = () => {
  const cursorRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    let hover = false;
    const cursor = cursorRef.current;
    if (!cursor) return;

    const mousePos = { x: 0, y: 0 };
    const cursorPos = { x: 0, y: 0 };

    const onMouseMove = (e) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
    };
    document.addEventListener("mousemove", onMouseMove);

    let rafId;
    const loop = () => {
      if (!hover) {
        const delay = 6;
        cursorPos.x += (mousePos.x - cursorPos.x) / delay;
        cursorPos.y += (mousePos.y - cursorPos.y) / delay;
        gsap.to(cursor, { x: cursorPos.x, y: cursorPos.y, duration: 0.1 });
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    const onMouseOver = (e) => {
      const item = e.target.closest("[data-cursor]");
      if (item) {
        const rect = item.getBoundingClientRect();

        if (item.dataset.cursor === "icons") {
          cursor.classList.add("cursor-icons");
          gsap.to(cursor, { x: rect.left, y: rect.top, duration: 0.1 });
          cursor.style.setProperty("--cursorW", `${rect.width}px`);
          cursor.style.setProperty("--cursorH", `${rect.height}px`);
          hover = true;
        }
        if (item.dataset.cursor === "disable") {
          cursor.classList.add("cursor-disable");
        }
        if (item.dataset.cursor === "tooltip") {
          cursor.classList.add("cursor-tooltip");
          if (textRef.current) {
            textRef.current.innerText = item.dataset.tooltipText || "";
            textRef.current.classList.remove("hidden");
          }
          const tooltipColor = item.dataset.tooltipColor || "#a855f7";
          cursor.style.setProperty("--tooltip-color", tooltipColor);
        }
      }
    };

    const onMouseOut = (e) => {
      const item = e.target.closest("[data-cursor]");
      if (item) {
        cursor.classList.remove("cursor-disable", "cursor-icons", "cursor-tooltip");
        if (textRef.current) {
          textRef.current.classList.add("hidden");
          textRef.current.innerText = "";
        }
        hover = false;
      }
    };

    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="cursor-main" ref={cursorRef}>
      <span className="cursor-text hidden" ref={textRef}></span>
    </div>
  );
};

export default Cursor;
