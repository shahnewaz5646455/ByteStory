'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Play, X, ChevronLeft, ChevronRight, Expand, Minimize, Share2, Search, XCircle } from 'lucide-react';
import projects from '@/data/projects';


// Writing tutorial categories and content
const categories = [
  { id: 1, name: 'Writing Tips' },
  { id: 2, name: 'Research Papers' },
  { id: 3, name: 'Journal Articles' },
  { id: 4, name: 'Blog Posts' },
  { id: 5, name: 'SEO Content' }
];

const useScrollAnimation = () => {
  const containerAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };
  
  const itemAnimation = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };
  
  return { containerAnimation, itemAnimation };
};

const VideoGallery = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [category, setCategory] = useState('all');
  const [imageError, setImageError] = useState({});
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  
  const ref = useRef(null);
  const modalRef = useRef(null);
  const searchInputRef = useRef(null);
  
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const { containerAnimation, itemAnimation } = useScrollAnimation();
  
  // Map category names to URL-friendly format
  const categoryMap = {
    'all': 'all',
    'writing-tips': 'Writing Tips',
    'research-papers': 'Research Papers',
    'journal-articles': 'Journal Articles',
    'blog-posts': 'Blog Posts',
    'seo-content': 'SEO Content'
  };

  const categoryOptions = ['all', ...categories.map(cat => cat.name.toLowerCase().replace(/\s+/g, '-'))];

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const categoryName = categoryMap[category] || category;
      const matchesCategory = category === 'all' || project.category === categoryName;
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.instructor.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [category, searchTerm, categoryMap]);

  const openProject = useCallback((project) => {
    const projectIndex = filteredProjects.findIndex(p => p.id === project.id);
    setCurrentProjectIndex(projectIndex);
    setSelectedProject(project);
    setIsPlaying(false);
    document.body.style.overflow = 'hidden';
  }, [filteredProjects]);

  const closeProject = useCallback(() => {
    setSelectedProject(null);
    setIsPlaying(false);
    setIsFullscreen(false);
    document.body.style.overflow = 'auto';
  }, []);

  const navigateProject = useCallback((direction) => {
    const newIndex = direction === 'next' ? 
      (currentProjectIndex + 1) % filteredProjects.length : 
      (currentProjectIndex - 1 + filteredProjects.length) % filteredProjects.length;
    setCurrentProjectIndex(newIndex);
    setSelectedProject(filteredProjects[newIndex]);
    setIsPlaying(false);
  }, [currentProjectIndex, filteredProjects]);

  const handlePlayClick = (e) => {
    e.stopPropagation();
    setIsPlaying(true);
  };

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  const handleShare = useCallback(async () => {
    if (navigator.share && selectedProject) {
      try {
        await navigator.share({
          title: selectedProject.title,
          text: selectedProject.description,
          url: window.location.href
        });
      } catch {
        navigator.clipboard.writeText(window.location.href);
      }
    }
  }, [selectedProject]);

  const getEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('youtube')) {
      return url + '?autoplay=1&rel=0';
    } else if (url.includes('vimeo')) {
      return url + '?autoplay=1';
    }
    return url;
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedProject) {
        if (e.key === '/' && !isSearchActive) {
          e.preventDefault();
          setIsSearchActive(true);
          setTimeout(() => searchInputRef.current?.focus(), 100);
        }
        return;
      }
      
      switch (e.key) {
        case 'Escape':
          closeProject();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          navigateProject('prev');
          break;
        case 'ArrowRight':
          e.preventDefault();
          navigateProject('next');
          break;
        case ' ':
          e.preventDefault();
          if (!isPlaying) {
            setIsPlaying(true);
          }
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 's':
        case 'S':
          e.preventDefault();
          handleShare();
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject, isPlaying, navigateProject, closeProject, handleShare, toggleFullscreen, isSearchActive]);

  // Cleanup scroll lock on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleImageError = (id) => {
    setImageError(prev => ({ ...prev, [id]: true }));
  };

  const toggleSearch = () => {
    setIsSearchActive(!isSearchActive);
    if (!isSearchActive) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchTerm('');
    }
  };

  const searchVariants = {
    hidden: { width: 0, opacity: 0 },
    visible: { 
      width: "100%", 
      opacity: 1,
      transition: { stiffness: 300, damping: 25 }
    }
  };

  const buttonHoverAnimation = {
    scale: 1.05,
    transition: { stiffness: 400, damping: 10 }
  };

  const cardHoverAnimation = {
    scale: 1.03,
    y: -8,
    transition: { stiffness: 300, damping: 20 }
  };

  return (
    <section id="tutorials" className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 via-white to-purple-50 min-h-screen relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          ref={ref} 
          variants={containerAnimation} 
          initial="hidden" 
          animate={isInView ? "visible" : "hidden"} 
          className="text-center mb-12 sm:mb-16"
        >
          <motion.h2 
            variants={itemAnimation} 
            className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white tracking-tight"
          >
            Writing Tutorials & <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Resources</span> 
          </motion.h2>
          <motion.p 
            variants={itemAnimation} 
            className="text-gray-700 dark:text-gray-300 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed"
          >
            Explore our curated collection of writing tutorials, research paper guides, and content creation resources.
          
          </motion.p>
        </motion.div>

        <motion.div 
          variants={containerAnimation} 
          initial="hidden" 
          animate={isInView ? "visible" : "hidden"} 
          className="mb-12 sm:mb-16"
        >
          <div className="mb-8 flex justify-start">
            <motion.div className="relative w-full max-w-md">
              <div className="relative flex items-center">
                <motion.button 
                  onClick={toggleSearch} 
                  className={`flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-indigo-200 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 transition-all duration-300 ${isSearchActive ? 'w-full' : 'w-auto'}`} 
                  whileHover={buttonHoverAnimation} 
                  whileTap={{ scale: 0.95 }}
                >
                  <Search size={20} />
                  {!isSearchActive && <span>Search Tutorials</span>}
                </motion.button>
                <AnimatePresence>
                  {isSearchActive && (
                    <motion.div 
                      variants={searchVariants} 
                      initial="hidden" 
                      animate="visible" 
                      exit="hidden" 
                      className="absolute inset-0 flex items-center"
                    >
                      <input 
                        ref={searchInputRef} 
                        type="text" 
                        value={searchTerm} 
                        onChange={e => setSearchTerm(e.target.value)} 
                        onBlur={() => !searchTerm && setIsSearchActive(false)} 
                        placeholder="Search tutorials..." 
                        className="w-full px-4 py-2 pl-10 bg-white dark:bg-gray-800 border border-indigo-200 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400" 
                        aria-label="Search tutorials"
                      />
                      <Search size={20} className="absolute left-3 text-gray-500 dark:text-gray-400" />
                      {searchTerm && (
                        <motion.button 
                          whileHover={{ scale: 1.1 }} 
                          whileTap={{ scale: 0.9 }} 
                          onClick={() => {
                            setSearchTerm('');
                            searchInputRef.current?.focus();
                          }} 
                          className="absolute right-3 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                        >
                          <XCircle size={20} />
                        </motion.button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {categoryOptions.map(cat => (
              <motion.button 
                key={cat} 
                variants={itemAnimation} 
                className={`px-6 py-3 rounded uppercase tracking-widest text-sm font-semibold transition-all duration-300 ${category === cat ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-indigo-200 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-gray-400'} focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400`} 
                onClick={() => setCategory(cat)} 
                whileHover={buttonHoverAnimation} 
                whileTap={{ scale: 0.95 }}
              >
                {cat === 'all' ? 'All' : categoryMap[cat] || cat}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div 
          layout 
          variants={containerAnimation} 
          initial="hidden" 
          animate={isInView ? "visible" : "hidden"} 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map(project => (
              <motion.div 
                layout 
                key={project.id} 
                variants={itemAnimation} 
                className="relative group cursor-pointer rounded-lg overflow-hidden h-72 sm:h-80 bg-white dark:bg-gray-800 border border-indigo-100 dark:border-gray-700 shadow-md hover:shadow-xl transition-all duration-300" 
                onClick={() => openProject(project)} 
                whileHover={cardHoverAnimation} 
                initial={{ opacity: 0, scale: 0.8 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.8 }} 
                transition={{ duration: 0.4 }}
              >
                {!imageError[project.id] ? (
                  <img 
                    src={project.thumbnailUrl} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    onError={(e) => {
                      if (!imageError[project.id]) {
                        handleImageError(project.id);
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iI0VFRUVGRiIvPjx0ZXh0IHg9IjQwMCIgeT0iMzAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzk5OTk5OSI+SW1hZ2UgTm90IEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';
                      }
                    }} 
                    loading="lazy" 
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">Image unavailable</span>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                  <motion.h3 
                    className="text-lg sm:text-xl font-bold text-white mb-1" 
                    initial={{ y: 20, opacity: 0 }} 
                    whileInView={{ y: 0, opacity: 1 }} 
                    transition={{ delay: 0.1 }}
                  >
                    {project.title}
                  </motion.h3>
                  <motion.p 
                    className="text-indigo-200 text-sm uppercase tracking-wider mb-3" 
                    initial={{ y: 20, opacity: 0 }} 
                    whileInView={{ y: 0, opacity: 1 }} 
                    transition={{ delay: 0.2 }}
                  >
                    {project.category}
                  </motion.p>
                  <motion.div 
                    className="flex items-center space-x-3" 
                    initial={{ y: 20, opacity: 0 }} 
                    whileInView={{ y: 0, opacity: 1 }} 
                    transition={{ delay: 0.3 }}
                  >
                    <div className="w-12 h-12 rounded bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
                      <Play className="text-white ml-1" size={16} />
                    </div>
                    <span className="text-white text-sm font-medium">Watch Tutorial</span>
                  </motion.div>
                </div>
                
                <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded text-xs text-white uppercase tracking-wider font-semibold">
                  {project.category}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProjects.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-center py-12"
          >
            <p className="text-gray-500 dark:text-gray-400 text-lg">No tutorials found matching your criteria.</p>
            <button 
              onClick={() => {
                setCategory('all');
                setSearchTerm('');
              }} 
              className="mt-4 px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded hover:from-indigo-700 hover:to-purple-700 transition-colors"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 sm:p-6 ${isFullscreen ? 'p-0' : ''}`} 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={closeProject}
          >
            <motion.div 
              ref={modalRef} 
              className={`relative bg-white dark:bg-gray-900 w-full overflow-y-auto rounded-lg shadow-xl border border-indigo-200 dark:border-gray-700 ${isFullscreen ? 'max-w-none max-h-none h-full rounded-none' : 'max-w-6xl max-h-[90vh]'}`} 
              initial={{ scale: 0.9, opacity: 0, y: 50 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 50 }} 
              transition={{ damping: 25, stiffness: 300 }} 
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-4 bg-gradient-to-b from-white/90 dark:from-gray-900/90 to-transparent">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700 dark:text-gray-300 text-sm">
                    {currentProjectIndex + 1} / {filteredProjects.length}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">Use ← → to navigate</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={handleShare} 
                    className="w-10 h-10 rounded bg-indigo-100 dark:bg-gray-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-gray-700 transition-colors duration-300" 
                    title="Share (S)"
                  >
                    <Share2 size={16} />
                  </button>
                  <button 
                    onClick={toggleFullscreen} 
                    className="w-10 h-10 rounded bg-indigo-100 dark:bg-gray-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-gray-700 transition-colors duration-300" 
                    title="Fullscreen (F)"
                  >
                    {isFullscreen ? <Minimize size={16} /> : <Expand size={16} />}
                  </button>
                  <button 
                    onClick={closeProject} 
                    className="w-10 h-10 rounded bg-indigo-100 dark:bg-gray-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-gray-700 transition-colors duration-300" 
                    title="Close (Esc)"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {filteredProjects.length > 1 && (
                <>
                  <button 
                    onClick={() => navigateProject('prev')} 
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 rounded bg-white/90 dark:bg-gray-800/90 flex items-center justify-center text-indigo-600 dark:text-indigo-400 hover:bg-white dark:hover:bg-gray-700 transition-colors duration-300 shadow-md" 
                    title="Previous (←)"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={() => navigateProject('next')} 
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 rounded bg-white/90 dark:bg-gray-800/90 flex items-center justify-center text-indigo-600 dark:text-indigo-400 hover:bg-white dark:hover:bg-gray-700 transition-colors duration-300 shadow-md" 
                    title="Next (→)"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              <div className={`relative bg-black ${isFullscreen ? 'h-full' : 'aspect-video'}`}>
                {isPlaying ? (
                  <iframe 
                    src={getEmbedUrl(selectedProject.videoUrl)} 
                    className="w-full h-full" 
                    title={selectedProject.title} 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen 
                  />
                ) : (
                  <>
                    <img 
                      src={selectedProject.thumbnailUrl} 
                      alt={selectedProject.title} 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.button 
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg" 
                        whileHover={{ scale: 1.1 }} 
                        whileTap={{ scale: 0.9 }} 
                        onClick={handlePlayClick} 
                        title="Play (Space)"
                      >
                        <Play className="text-white ml-1" size={24} />
                      </motion.button>
                    </div>
                  </>
                )}
              </div>

              {!isFullscreen && (
                <motion.div 
                  className="p-6 sm:p-8 md:p-10" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-gray-900 dark:text-white">
                    {selectedProject.title}
                  </h2>
                  <p className="text-indigo-600 dark:text-indigo-400 text-sm uppercase tracking-widest mb-4">
                    {selectedProject.category}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mb-8 text-base sm:text-lg leading-relaxed">
                    {selectedProject.description}
                  </p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-gray-900 dark:text-white font-semibold mb-4 text-lg">Tutorial Details</h3>
                      <ul className="text-gray-700 dark:text-gray-300 space-y-3">
                        <li><span className="font-semibold">Instructor:</span> {selectedProject.instructor}</li>
                        <li><span className="font-semibold">Duration:</span> {selectedProject.duration}</li>
                        <li><span className="font-semibold">Level:</span> {selectedProject.level}</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-gray-900 dark:text-white font-semibold mb-4 text-lg">Skills Covered</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.skills.map((skill, index) => (
                          <span 
                            key={index} 
                            className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default VideoGallery;