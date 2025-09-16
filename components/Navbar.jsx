"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, PencilLine, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 text-black font-bold text-2xl flex items-center gap-2 cursor-pointer">
            <PencilLine />
            ByteStory
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 text-black font-medium">
            <Link 
              href="/" 
              className={`hover:text-indigo-600 transition-colors ${pathname === "/" ? "text-indigo-600 font-semibold" : ""}`}
            >
              Home
            </Link>
            <Link 
              href="/features" 
              className={`hover:text-indigo-600 transition-colors ${pathname === "/features" ? "text-indigo-600 font-semibold" : ""}`}
            >
              Features
            </Link>
            <Link 
              href="/blog" 
              className={`hover:text-indigo-600 transition-colors ${pathname === "/blog" ? "text-indigo-600 font-semibold" : ""}`}
            >
              Blogs
            </Link>
            <Link 
              href="/about" 
              className={`hover:text-indigo-600 transition-colors ${pathname === "/about" ? "text-indigo-600 font-semibold" : ""}`}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className={`hover:text-indigo-600 transition-colors ${pathname === "/contact" ? "text-indigo-600 font-semibold" : ""}`}
            >
              Contact
            </Link>
          </div>

          {/* Button */}
          <div className="hidden md:flex">
            <Link href="/login" className="group/button relative inline-flex items-center justify-center overflow-hidden rounded-md bg-gray-800 backdrop-blur-lg px-6 py-2 text-base font-semibold text-white transition-all duration-150 ease-in-out hover:shadow-lg hover:shadow-gray-600/50 border border-white/20 h-max">
            <span>Sign In</span>
            <div
              className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]"
            >
              <div className="relative h-full w-10 bg-white/20"></div>
            </div>
          </Link>
          </div>

          {/* menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-black focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute right-4 top-16 bg-white rounded-lg shadow-xl border border-gray-200 w-56">
          <div className="px-2 pt-2 pb-3 space-y-1 text-black font-medium">
            <Link 
              href="/" 
              className={`block px-3 py-2 rounded hover:bg-gray-100 ${pathname === "/" ? "bg-indigo-50 text-indigo-600 font-semibold" : ""}`}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/features" 
              className={`block px-3 py-2 rounded hover:bg-gray-100 ${pathname === "/features" ? "bg-indigo-50 text-indigo-600 font-semibold" : ""}`}
              onClick={() => setIsOpen(false)}
            >
              Features
            </Link>
            <Link 
              href="/blog" 
              className={`block px-3 py-2 rounded hover:bg-gray-100 ${pathname === "/blog" ? "bg-indigo-50 text-indigo-600 font-semibold" : ""}`}
              onClick={() => setIsOpen(false)}
            >
              Blogs
            </Link>
            <Link 
              href="/about" 
              className={`block px-3 py-2 rounded hover:bg-gray-100 ${pathname === "/about" ? "bg-indigo-50 text-indigo-600 font-semibold" : ""}`}
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className={`block px-3 py-2 rounded hover:bg-gray-100 ${pathname === "/contact" ? "bg-indigo-50 text-indigo-600 font-semibold" : ""}`}
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            <div className="pt-2 border-t border-gray-200">
              <Link 
                href="/login" 
                className="block bg-black text-white px-3 py-2 rounded shadow hover:bg-gray-800 transition-colors text-center"
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