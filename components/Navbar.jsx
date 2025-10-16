"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Lightbulb, Menu, Moon, Search, Sun, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useTheme } from "next-themes";
import { useSelector } from "react-redux";

export default function Navbar() {
  const { setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const pathname = usePathname();
  const searchInputRef = useRef(null);
  const searchCardRef = useRef(null);
  const router = useRouter();
  const auth = useSelector((store) => store.authStore.auth);
  const profileLink =
    auth?.role === "admin" ? "/admin/adminDashboard/overview" : "/website/my-account";
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

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
    const searchTerm = query.trim().toLowerCase();
    
    if (searchTerm === "seo") {
      router.push("/seo-checker");
    } else if (searchTerm.includes("grammar") || searchTerm.includes("grammer")) {
      router.push("/grammar-checker");
    }
    
    setIsSearchOpen(false);
    setQuery("");
  }

  function ListItem({ title, children, href, ...props }) {
    return (
      <li>
        <NavigationMenuLink asChild>
          <Link href={href}>
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </Link>
        </NavigationMenuLink>
      </li>
    );
  }

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md dark:shadow-gray-800/20 sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link
            href="/"
            className="flex-shrink-0 font-bold text-2xl flex items-center gap-2 cursor-pointer transition-colors"
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center 
                  bg-gradient-to-r from-purple-500 to-indigo-500 shadow-md"
            >
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <p className="text-gray-800 dark:text-gray-100">ByteStory</p>
          </Link>

          {/* Desktop Menu - unchanged */}
          <div className="hidden lg:flex space-x-6 text-black dark:text-gray-200 font-medium">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/"
                    className={`hover:text-indigo-600 px-4 dark:hover:text-indigo-400 transition-colors ${
                      pathname === "/"
                        ? "text-indigo-600 dark:text-indigo-400 font-semibold bg-gray-100/80 dark:bg-gray-500/20"
                        : ""
                    }`}
                  >
                    Home
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="hover:text-indigo-600 dark:bg-gray-900 dark:hover:text-indigo-400 transition-colors">
                    AI Tools
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[300px] gap-2 p-4 md:w-[400px] md:grid-cols-2 lg:w-[500px]">
                      <ListItem href="/seo-checker" title="SEO Checker">
                        Analyze and optimize your website for search engines.
                      </ListItem>
                      <ListItem href="/grammar-checker" title="Grammar Checker">
                        Check for grammar, spelling, and punctuation errors.
                      </ListItem>
                      <ListItem
                        href="/blog-generator"
                        title="Blog Post Generator"
                      >
                        Generate a full blog post from a simple title.
                      </ListItem>
                      <ListItem href="/AIsummarizer" title="AI Summarizer">
                        Summarize long articles and texts quickly.
                      </ListItem>
                      <ListItem href="/pdf_summarizer" title="PDF Summarizer">
                        Quickly get the main points from any PDF document.
                      </ListItem>
                      <ListItem href="/pdf-converter" title="PDF Extractor">
                        Extract text from a PDF and generate a summarized
                        version instantly.
                      </ListItem>
                      <ListItem href="/hashtag" title="Hashtag Generator">
                        Get suggested hashtags for your blog posts and content.
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/features"
                    className={`hover:text-indigo-600 px-4 dark:hover:text-indigo-400 transition-colors ${
                      pathname === "/features"
                        ? "text-indigo-600 dark:text-indigo-400 font-semibold bg-gray-100/80 dark:bg-gray-500/20"
                        : ""
                    }`}
                  >
                    Features
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/learn"
                    className={`hover:text-indigo-600 px-4 dark:hover:text-indigo-400 transition-colors ${
                      pathname === "/learn"
                        ? "text-indigo-600 dark:text-indigo-400 font-semibold bg-gray-100/80 dark:bg-gray-500/20"
                        : ""
                    }`}
                  >
                    Learn
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/about"
                    className={`hover:text-indigo-600 px-4 dark:hover:text-indigo-400 transition-colors ${
                      pathname === "/about"
                        ? "text-indigo-600 dark:text-indigo-400 font-semibold bg-gray-100/80 dark:bg-gray-500/20"
                        : ""
                    }`}
                  >
                    About
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/contact"
                    className={`hover:text-indigo-600 px-4 dark:hover:text-indigo-400 transition-colors ${
                      pathname === "/contact"
                        ? "text-indigo-600 dark:text-indigo-400 font-semibold bg-gray-100/80 dark:bg-gray-500/20"
                        : ""
                    }`}
                  >
                    Contact
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex gap-3 items-center">
            {/* Desktop Search */}
            <Button
              variant="outline"
              size="icon"
              className="hidden md:flex border-gray-300 dark:border-gray-600 bg-transparent dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsSearchOpen((s) => !s)}
              aria-label="Open search"
            >
              <Search className="h-[1.2rem] w-[1.2rem]" />
            </Button>

            {/* Desktop Theme Toggle */}
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

            {/* Desktop Auth Section */}
            {auth ? (
              <Link href={profileLink} className="hidden md:flex">
                <div className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {auth?.photoURL ? (
                      <img
                        src={auth.photoURL}
                        alt="avatar"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      auth?.name?.charAt(0) || "U"
                    )}
                  </div>
                </div>
              </Link>
            ) : (
              <div className="hidden lg:flex">
                <Link
                  href="/login"
                  className="group/button relative inline-flex items-center justify-center overflow-hidden rounded-md bg-gray-800 px-6 py-2 text-base font-semibold text-white transition-all hover:shadow-lg border border-white/20 dark:border-indigo-400/20"
                >
                  <span>Sign In</span>
                  <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]">
                    <div className="relative h-full w-10 bg-white/20 dark:bg-indigo-300/20"></div>
                  </div>
                </Link>
              </div>
            )}

            {/* Mobile Section */}
            <div className="flex lg:hidden items-center gap-2">
             
              {/* Mobile Search */}
              <Button
                variant="outline"
                size="icon"
                className="md:hidden border-gray-300 dark:border-gray-600 bg-transparent dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsSearchOpen((s) => !s)}
                aria-label="Open search"
              >
                <Search className="h-[1.2rem] w-[1.2rem]" />
              </Button>

              {/* Mobile Theme Toggle */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="md:hidden border-gray-300 dark:border-gray-600 bg-transparent dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
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
               {auth && (
                <Link href={profileLink} className="flex md:hidden">
                  <div className="flex items-center p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {auth?.photoURL ? (
                        <img
                          src={auth.photoURL}
                          alt="avatar"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        auth?.name?.charAt(0) || "U"
                      )}
                    </div>
                  </div>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-black dark:text-white focus:outline-none transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Box */}
        {isSearchOpen && (
          <div className="absolute inset-x-0 top-16 z-[60] flex justify-center px-4">
            <div
              ref={searchCardRef}
              className="w-full max-w-2xl rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl"
            >
              <form
                onSubmit={onSubmitSearch}
                className="flex items-center gap-2 p-3"
              >
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
                  size="icon"
                  className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setIsSearchOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-black dark:bg-indigo-600 text-white hover:bg-gray-800 dark:hover:bg-indigo-700"
                >
                  Search
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* Mobile Menu Dropdown - Improved Design */}
        {isOpen && (
          <div className="lg:hidden absolute left-0 right-0 top-16 bg-white dark:bg-gray-800 shadow-xl border-t border-gray-200 dark:border-gray-700 transition-all duration-300 z-50">
            <div className="px-4 py-3 space-y-1 text-black dark:text-gray-200 font-medium">
              {/* Main Navigation Links */}
              <Link
                href="/"
                className={`flex items-center px-3 py-3 rounded-lg transition-colors ${
                  pathname === "/"
                    ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                onClick={() => setIsOpen(false)}
              >
                <span className="ml-2">Home</span>
              </Link>

              {/* AI Tools Section with Better Visual Hierarchy */}
              <div className="px-3 py-2">
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2 font-semibold">
                  AI Tools
                </p>
                <div className="grid grid-cols-1 gap-1">
                  {[
                    { href: "/seo-checker", label: "SEO Checker" },
                    { href: "/grammar-checker", label: "Grammar Checker" },
                    { href: "/blog-generator", label: "Blog Post Generator" },
                    { href: "/AIsummarizer", label: "AI Summarizer" },
                    { href: "/pdf_summarizer", label: "PDF Summarizer" },
                    { href: "/pdf-converter", label: "PDF Extractor" },
                    { href: "/hashtag", label: "Hashtag Generator" },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Other Navigation Links */}
              {[
                { href: "/features", label: "Features" },
                { href: "/learn", label: "Learn" },
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-3 py-3 rounded-lg transition-colors ${
                    pathname === item.href
                      ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="ml-2">{item.label}</span>
                </Link>
              ))}

              {/* Sign In Button for Mobile */}
              {!auth && (
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700 mt-3">
                  <Link
                    href="/login"
                    className="flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-3 py-3 rounded-lg shadow hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 font-semibold"
                    onClick={() => setIsOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}