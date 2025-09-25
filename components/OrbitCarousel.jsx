"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Briefcase, ChevronLeft, ChevronRight, Linkedin } from "lucide-react";

const people = [
  {
    id: 1,
    name: "Mirajul Islam Miraz",
    role: "Frontend Developer",
    email: "minhajulmiraz28@gmail.com",
    profile: "https://i.postimg.cc/dtgmX6v5/1748150704812.jpg",
    connect: "https://www.linkedin.com/in/minhajul-islam-miraz/"
  },
  {
    id: 2,
    name: "Sohanur Rahman",
    role: "Backend Developer",
    email: "sohanuractive007@gmail.com",
    profile: "https://i.postimg.cc/4y6hnDmd/155247604.jpg",
    connect: "https://www.linkedin.com/in/sohanurrahman007/"
  },
  {
    id: 3,
    name: "Shah Newaz",
    role: "Full-Stack Developer",
    email: "shahnewaz794@gmail.com",
    profile: "https://i.postimg.cc/3xvQp33n/1754633887935.jpg",
    connect: "https://www.linkedin.com/in/md-shah-newaz001/"
  },
  {
    id: 4,
    name: "Rubaid Islam",
    role: "UI/UX Designer",
    email: "mohammadrubaid07@gmail.com",
    profile: "https://i.postimg.cc/KvcnRYDh/1755966330626.jpg",
    connect: "https://www.linkedin.com/in/rubaid07/"
  },
  {
    id: 5,
    name: "Moinul Islam Umair",
    role: "Founder & Project Lead",
    email: "moinuli359@gmail.com",
    profile: "https://i.postimg.cc/bwrY3wrN/photo-2025-08-12-23-30-26.jpg",
    connect: "https://www.linkedin.com/in/moinul505/"
  },
  {
    id: 6,
    name: "Team Member",
    role: "Developer",
    email: "member1@example.com",
    profile: "https://i.postimg.cc/fyRSxwNX/photo-1568602471122-7832951cc4c5.jpg",
    connect: "#"
  },
  {
    id: 7,
    name: "Team Member",
    role: "Designer",
    email: "member2@example.com",
    profile: "https://i.postimg.cc/3x4pSJDF/young-bearded-man-with-striped-shirt.jpg",
    connect: "#"
  }
];

const safeImage = (e) => {
  const target = e.target;
  target.src = "https://placehold.co/100x100/E0E7FF/4338CA?text=Error";
};

const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const checkScreenSize = () => setIsMobile(window.innerWidth < breakpoint);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [breakpoint]);
  return isMobile;
};

export default function OrbitCarousel() {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const isMobile = useIsMobile();
  const containerRadius = isMobile ? 130 : 200;
  const profileSize = isMobile ? 60 : 80;
  const containerSize = containerRadius * 2 + 100;

  const getRotation = React.useCallback(
    (index) => (index - activeIndex) * (360 / people.length),
    [activeIndex]
  );

  const next = () => setActiveIndex((i) => (i + 1) % people.length);
  const prev = () => setActiveIndex((i) => (i - 1 + people.length) % people.length);

  const handleProfileClick = React.useCallback(
    (index) => {
      if (index === activeIndex) return;
      setActiveIndex(index);
    },
    [activeIndex]
  );

  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") prev();
      else if (event.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col mt-10 rounded-2xl items-center p-6 relative min-h-[500px]">
      {/* Title + Paragraph */}
      <div className="text-center mb-8 max-w-2xl">
        <h1 className="text-2xl md:text-3xl font-bold text-indigo-700 dark:text-indigo-400">
          Meet Our Team
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm md:text-base">
          We are a passionate group of developers, designers, and innovators working 
          together to build AI-powered tools and web solutions. Each member brings 
          unique expertise and creativity to shape the future of our platform.
        </p>
      </div>

      {/* Orbit Carousel */}
      <div
        className="relative flex items-center justify-center"
        style={{ width: containerSize, height: containerSize }}
      >
        {/* Circular Orbit */}
        <div
          className="absolute rounded-full border border-gray-300 dark:border-gray-700"
          style={{
            width: containerRadius * 2,
            height: containerRadius * 2,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)"
          }}
        />

        {/* Active Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={people[activeIndex].id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="z-10 bg-white dark:bg-gray-950 backdrop-blur-sm shadow-xl rounded-xl p-4 w-56 text-center border border-gray-100 dark:border-gray-800"
          >
            <motion.img
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              src={people[activeIndex].profile}
              alt={people[activeIndex].name}
              onError={safeImage}
              className="w-20 h-20 rounded-full mx-auto -mt-12 border-4 border-white dark:border-black object-cover shadow-md"
            />
            <h2 className="mt-2 text-lg font-bold text-gray-800 dark:text-white">
              {people[activeIndex].name}
            </h2>
            <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400 mt-1">
              <Briefcase size={14} className="mr-1" />
              <span>{people[activeIndex].role}</span>
            </div>
            <div className="flex items-center justify-center text-xs text-gray-500 dark:text-gray-500 mt-0.5">
              <Mail size={12} className="mr-1" />
              <span>{people[activeIndex].email}</span>
            </div>
            <div className="flex justify-center items-center mt-3 space-x-2">
              <button
                onClick={prev}
                className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              >
                <ChevronLeft size={16} className="text-gray-700 dark:text-gray-300" />
              </button>
              <a
                href={people[activeIndex].connect}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-1 text-sm rounded-full flex items-center gap-1 bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors"
              >
                <Linkedin size={14} /> Connect
              </a>
              <button
                onClick={next}
                className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              >
                <ChevronRight size={16} className="text-gray-700 dark:text-gray-300" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Orbiting Profiles */}
        {people.map((p, i) => {
          const rotation = getRotation(i);
          return (
            <motion.div
              key={p.id}
              animate={{
                transform: `rotate(${rotation}deg) translateY(-${containerRadius}px)`
              }}
              transition={{
                duration: 0.8,
                ease: [0.34, 1.56, 0.64, 1]
              }}
              style={{
                width: profileSize,
                height: profileSize,
                position: "absolute",
                top: `calc(50% - ${profileSize / 2}px)`,
                left: `calc(50% - ${profileSize / 2}px)`
              }}
            >
              <motion.div
                animate={{ rotate: -rotation }}
                transition={{
                  duration: 0.8,
                  ease: [0.34, 1.56, 0.64, 1]
                }}
                className="w-full h-full"
              >
                <motion.img
                  src={p.profile}
                  alt={p.name}
                  onError={safeImage}
                  onClick={() => handleProfileClick(i)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full h-full object-cover rounded-full cursor-pointer transition-all duration-300 ${
                    i === activeIndex
                      ? "border-4 border-indigo-500 dark:border-indigo-400 shadow-lg"
                      : "border-2 border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500"
                  }`}
                />
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
