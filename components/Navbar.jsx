"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Lightbulb, Menu, Moon, Search, Sun, X } from "lucide-react";
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
// import { useRouter } from "next/router";
export default function Navbar() {
  const { setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false); // mobile menu
  const [isSearchOpen, setIsSearchOpen] = useState(false); // search box
  const [query, setQuery] = useState("");
  const pathname = usePathname();
  const searchInputRef = useRef(null);
  const searchCardRef = useRef(null);
  const router = useRouter();  // ✅ call the hook inside your component

  // Focus the input when opening
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Close search when clicking outside
  useEffect(() => {
    function onClickOutside(e) {
      if (
        isSearchOpen &&
        searchCardRef.current &&
        !searchCardRef.current.contains(e.target)
      ) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [isSearchOpen]);

  function onSubmitSearch(e) {
    
     e.preventDefault();
     const searchTerm = e.value
   if(searchTerm === "seo" || "SEO" || "se"){
    router.push("/seo-checker")
   }
   if(searchTerm === "grammar" || "GRAMMAR" || "grammer" || "gramar" ||" grammer" ){
   document.getElementById("grammerChecker").scrollIntoView({ behavior: "smooth" });
  } 
   
 
    // TODO: route to your search page or handle query
    // e.g., router.push(`/search?q=${encodeURIComponent(query)}`)
    setIsSearchOpen(false);
  }

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md dark:shadow-gray-800/20 sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link
            href="/"
            className="flex-shrink-0 font-bold text-2xl flex items-center gap-2 cursor-pointer transition-colors"
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center 
                  bg-gradient-to-r from-purple-500 to-indigo-500 shadow-md">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <p className="text-gray-800 dark:text-gray-100">ByteStory</p>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 text-black dark:text-gray-200 font-medium">
            <Link
              href="/"
              className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${pathname === "/"
                ? "text-indigo-600 dark:text-indigo-400 font-semibold"
                : ""
                }`}
            >
              Home
            </Link>
            <Link
              href="/features"
              className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${pathname === "/features"
                ? "text-indigo-600 dark:text-indigo-400 font-semibold"
                : ""
                }`}
            >
              Features
            </Link>
            <Link
              href="/blogs"
              className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${pathname === "/blogs" ? "text-indigo-600 dark:text-indigo-400 font-semibold" : ""}`}
            >
              Blogs
            </Link>
            <Link
              href="/about"
              className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${pathname === "/about"
                ? "text-indigo-600 dark:text-indigo-400 font-semibold"
                : ""
                }`}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${pathname === "/contact"
                ? "text-indigo-600 dark:text-indigo-400 font-semibold"
                : ""
                }`}
            >
              Contact
            </Link>
          </div>

          <div className="flex gap-3 items-center">
            {/* Search trigger (desktop) */}
            <Button
              variant="outline"
              size="icon"
              className="hidden md:flex border-gray-300 dark:border-gray-600 bg-transparent dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsSearchOpen((s) => !s)}
              aria-label="Open search"
            >
              <Search onClick={onSubmitSearch} className="h-[1.2rem] w-[1.2rem]" />
            </Button>

            {/* theme toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="hidden md:flex border-gray-300 dark:border-gray-600 bg-transparent dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <DropdownMenuItem
                  onClick={() => setTheme("light")}
                  className="cursor-pointer focus:bg-gray-100 dark:focus:bg-gray-700"
                >
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme("dark")}
                  className="cursor-pointer focus:bg-gray-100 dark:focus:bg-gray-700"
                >
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme("system")}
                  className="cursor-pointer focus:bg-gray-100 dark:focus:bg-gray-700"
                >
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Button */}
            <div className="hidden md:flex">
              <Link
                href="/login"
                className="group/button relative inline-flex items-center justify-center overflow-hidden rounded-md bg-gray-800 backdrop-blur-lg px-6 py-2 text-base font-semibold text-white transition-all duration-150 ease-in-out hover:shadow-lg hover:shadow-gray-600/50 dark:hover:shadow-indigo-600/30 border border-white/20 dark:border-indigo-400/20 h-max"
              >
                <span>Sign In</span>
                <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]">
                  <div className="relative h-full w-10 bg-white/20 dark:bg-indigo-300/20"></div>
                </div>
              </Link>
            </div>

            {/* menu button */}
            <div className="md:hidden flex items-center">
              {/* Mobile: search + theme + menu */}
              <div className="md:hidden flex items-center">
                {/* mobile search trigger */}
                <Button
                  variant="outline"
                  size="icon"
                  className="mr-3 border-gray-300 dark:border-gray-600 bg-transparent dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setIsSearchOpen((s) => !s)}
                  aria-label="Open search"
                >
                  <Search className="h-[1.2rem] w-[1.2rem]" />
                </Button>

                {/* mobile theme toggle */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="mr-3 border-gray-300 dark:border-gray-600 bg-transparent dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                      <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                      <span className="sr-only">Toggle theme</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  >
                    <DropdownMenuItem
                      onClick={() => setTheme("light")}
                      className="cursor-pointer focus:bg-gray-100 dark:focus:bg-gray-700"
                    >
                      Light
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setTheme("dark")}
                      className="cursor-pointer focus:bg-gray-100 dark:focus:bg-gray-700"
                    >
                      Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setTheme("system")}
                      className="cursor-pointer focus:bg-gray-100 dark:focus:bg-gray-700"
                    >
                      System
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-black dark:text-white focus:outline-none transition-colors"
                  aria-label="Toggle menu"
                >
                  {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search box (overlay card) */}
        {isSearchOpen && (
          <div className="absolute inset-x-0 top-16 z-[60] flex justify-center px-4">
            <div
              ref={searchCardRef}
              className="w-full max-w-2xl rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl"
            >
              <form onSubmit={onSubmitSearch} className="flex items-center gap-2 p-3">
                <Search className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search ByteStory..."
                  className="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setIsSearchOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
                <Button type="submit" className="bg-black dark:bg-indigo-600 text-white hover:bg-gray-800">
                  Search
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="md:hidden absolute right-4 top-16 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 w-56 transition-colors z-50">
            <div className="px-2 pt-2 pb-3 space-y-1 text-black dark:text-gray-200 font-medium">
              <Link
                href="/"
                className={`block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${pathname === "/"
                  ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold"
                  : ""
                  }`}
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/features"
                className={`block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${pathname === "/features"
                  ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold"
                  : ""
                  }`}
                onClick={() => setIsOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/blog"
                className={`block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${pathname === "/blog"
                  ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold"
                  : ""
                  }`}
                onClick={() => setIsOpen(false)}
              >
                Blogs
              </Link>
              <Link
                href="/about"
                className={`block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${pathname === "/about"
                  ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold"
                  : ""
                  }`}
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className={`block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${pathname === "/contact"
                  ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold"
                  : ""
                  }`}
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <Link
                  href="/login"
                  className="block bg-black dark:bg-indigo-600 text-white px-3 py-2 rounded shadow hover:bg-gray-800 transition-colors text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
