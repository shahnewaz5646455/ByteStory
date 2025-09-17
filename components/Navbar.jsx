"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Moon, PencilLine, Sun, X } from "lucide-react";

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes";

export default function Navbar() {
  const { setTheme, theme } = useTheme()
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md dark:shadow-gray-800/20 sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 text-black dark:text-white font-bold text-2xl flex items-center gap-2 cursor-pointer transition-colors">
            <PencilLine className="dark:text-indigo-400" />
            <span className="dark:text-white">ByteStory</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 text-black dark:text-gray-200 font-medium">
            <Link
              href="/"
              className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${pathname === "/" ? "text-indigo-600 dark:text-indigo-400 font-semibold" : ""}`}
            >
              Home
            </Link>
            <Link
              href="/features"
              className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${pathname === "/features" ? "text-indigo-600 dark:text-indigo-400 font-semibold" : ""}`}
            >
              Features
            </Link>
            <Link
              href="/blogs"
              className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${pathname === "/blog" ? "text-indigo-600 dark:text-indigo-400 font-semibold" : ""}`}
            >
              Blogs
            </Link>
            <Link
              href="/about"
              className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${pathname === "/about" ? "text-indigo-600 dark:text-indigo-400 font-semibold" : ""}`}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${pathname === "/contact" ? "text-indigo-600 dark:text-indigo-400 font-semibold" : ""}`}
            >
              Contact
            </Link>
          </div>

          <div className="flex gap-4 items-center">
            {/* theme toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="hidden md:flex border-gray-300 dark:border-gray-600 bg-transparent dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
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
              <Link href="/login" className="group/button relative inline-flex items-center justify-center overflow-hidden rounded-md bg-gray-800 backdrop-blur-lg px-6 py-2 text-base font-semibold text-white transition-all duration-150 ease-in-out hover:shadow-lg hover:shadow-gray-600/50 dark:hover:shadow-indigo-600/30 border border-white/20 dark:border-indigo-400/20 h-max">
                <span>Sign In</span>
                <div
                  className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]"
                >
                  <div className="relative h-full w-10 bg-white/20 dark:bg-indigo-300/20"></div>
                </div>
              </Link>
            </div>
          </div>

          {/* menu button */}
          <div className="md:hidden flex items-center">
            {/* mobile theme toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="mr-5 border-gray-300 dark:border-gray-600 bg-transparent dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
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

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-black dark:text-white focus:outline-none transition-colors"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute right-4 top-16 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 w-56 transition-colors">
          <div className="px-2 pt-2 pb-3 space-y-1 text-black dark:text-gray-200 font-medium">
            <Link
              href="/"
              className={`block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${pathname === "/" ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold" : ""}`}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/features"
              className={`block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${pathname === "/features" ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold" : ""}`}
              onClick={() => setIsOpen(false)}
            >
              Features
            </Link>
            <Link
              href="/blog"
              className={`block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${pathname === "/blog" ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold" : ""}`}
              onClick={() => setIsOpen(false)}
            >
              Blogs
            </Link>
            <Link
              href="/about"
              className={`block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${pathname === "/about" ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold" : ""}`}
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${pathname === "/contact" ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold" : ""}`}
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <Link
                href="/login"
                className="block bg-black dark:bg-indigo-600 text-white px-3 py-2 rounded shadow hover:bg-gray-800  transition-colors text-center"
                onClick={() => setIsOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}