"use client";

import React, { useState, useEffect } from "react";

const GridBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      const { clientX, clientY } = event;
      const x = clientX - window.innerWidth / 2;
      const y = clientY - window.innerHeight / 2;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden transition-transform duration-300 ease-out"
      style={{
        transform: `translate(${mousePosition.x / 30}px, ${mousePosition.y / 30}px)`,
      }}
    >
      {/* Light Mode Grid */}
      <div
        className="absolute inset-0 dark:hidden"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 0, 0, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          animation: "moveGrid 20s linear infinite",
          maskImage:
            "radial-gradient(circle at center, rgba(255,255,255,1) 35%, rgba(255,255,255,0) 100%)",
          WebkitMaskImage:
            "radial-gradient(circle at center, rgba(255,255,255,1) 35%, rgba(255,255,255,0) 100%)",
        }}
      />

      {/* Dark Mode Grid */}
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.18) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.18) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          animation: "moveGrid 20s linear infinite",
          maskImage:
            "radial-gradient(circle at center, rgba(255,255,255,1) 35%, rgba(255,255,255,0) 100%)",
          WebkitMaskImage:
            "radial-gradient(circle at center, rgba(255,255,255,1) 35%, rgba(255,255,255,0) 100%)",
          backgroundColor: "#0a0a0a", // Optional: dark mode base color
        }}
      />

      {/* Center Glow */}
      <div className="absolute top-1/2 left-1/2 w-[60vmin] h-[60vmin] dark:bg-purple-600/20 bg-purple-400/10 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2" />

      <style>
        {`
          @keyframes moveGrid {
            0% { background-position: 0 0; }
            100% { background-position: 80px 80px; }
          }
        `}
      </style>
    </div>
  );
};

export default function GridBackgroundView() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <GridBackground />
    </div>
  );
}
