"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Lightbulb, Menu, Moon, Search, Sun, X, ArrowUpRight } from "lucide-react";
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
  const [activeIndex, setActiveIndex] = useState(-1);
  const pathname = usePathname();
  const searchInputRef = useRef(null);
  const searchCardRef = useRef(null);
  const router = useRouter();
  const auth = useSelector((store) => store.authStore.auth);

  const profileLink =
    auth?.role === "admin"
      ? "/admin/adminDashboard/overview"
      : "/website/my-account";

  // --- Smart search config ---
  const BASE_SUGGESTIONS = [
    {
      label: "Profile",
      path: "/website/update-profile",
      keywords: ["profile", "update profile", "account", "my profile"],
      requireAuth: true,
    },
    {
      label: "Blog Post Generator",
      path: "/blog-generator",
      keywords: ["blog", "blog generator", "blog post generator"],
    },
    {
      label: "SEO Checker",
      path: "/seo-checker",
      keywords: ["seo", "seo checker"],
    },
    {
      label: "Grammar Checker",
      path: "/grammar-checker",
      keywords: ["grammar", "grammer", "grammar checker", "grammer checker"],
    },
    {
      label: "Summarizer",
      path: "/AIsummarizer",
      keywords: ["summarizer", "ai summarizer", "summary"],
    },
    {
      label: "PDF Extractor",
      path: "/pdf-converter",
      keywords: ["pdf extractor", "pdf", "pdf converter"],
    },
    {
      label: "Email Writer",
      path: "/email-writer",
      keywords: ["email", "email writer"],
    },
    {
      label: "Hashtag Generator",
      path: "/hashtag",
      keywords: ["hashtag", "hashtag generator"],
    },
    {
      label: "Recycle Bin",
      path: "/website/recycle-bin",
      keywords: ["recycle bin", "recycle", "bin", "trash"],
      requireAuth: true,
    },
  ];

  const SUGGESTIONS = useMemo(() => {
    if (!auth) return BASE_SUGGESTIONS.filter((s) => !s.requireAuth);
    return BASE_SUGGESTIONS;
  }, [auth]);

  const preferredSuggestions = SUGGESTIONS;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return preferredSuggestions;
    return SUGGESTIONS.filter(
      (s) =>
        s.keywords.some((k) => k.toLowerCase().includes(q)) ||
        s.label.toLowerCase().includes(q)
    );
  }, [query, SUGGESTIONS]);

  // --- Focus handling ---
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
      setActiveIndex(filtered.length ? 0 : -1);
    }
  }, [isSearchOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    function onClickOutside(e) {
      if (
        isSearchOpen &&
        searchCardRef.current &&
        e.target instanceof Node &&
        !searchCardRef.current.contains(e.target)
      ) {
        setIsSearchOpen(false);
        setQuery("");
        setActiveIndex(-1);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [isSearchOpen]);

  // --- Navigation helpers ---
  function go(path) {
    const absolute =
      typeof window !== "undefined" ? `${window.location.origin}${path}` : path;
    router.push(absolute);
    setIsSearchOpen(false);
    setQuery("");
    setActiveIndex(-1);
  }

  function resolvePathFromQuery(q) {
    const t = q.trim().toLowerCase();
    if (!t) return null;
    const hit = SUGGESTIONS.find(
      (s) =>
        s.keywords.some((k) => k.toLowerCase() === t) ||
        s.label.toLowerCase() === t
    );
    if (hit) return hit.path;
    const partial = SUGGESTIONS.find(
      (s) =>
        s.keywords.some((k) => k.toLowerCase().includes(t)) ||
        s.label.toLowerCase().includes(t)
    );
    return partial ? partial.path : null;
  }

  function onSubmitSearch(e) {
    e.preventDefault();
    const path = resolvePathFromQuery(query);
    if (path) {
      go(path);
    } else if (filtered.length) {
      go(filtered[0].path);
    } else {
      setIsSearchOpen(false);
      setQuery("");
    }
  }

  function onKeyDown(e) {
    if (!filtered.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && activeIndex < filtered.length) {
        e.preventDefault();
        go(filtered[activeIndex].path);
      }
    } else if (e.key === "Escape") {
      setIsSearchOpen(false);
    }
  }

  function ListItem({ title, children, href, ...props }) {
    return (
      <li>
        <NavigationMenuLink asChild>
          <Link href={href} {...props}>
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
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-500 shadow-md">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <p className="text-gray-800 dark:text-gray-100">ByteStory</p>
          </Link>

          {/* Desktop Menu */}
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
                    Ai Tools
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[300px] gap-2 p-4 md:w-[400px] md:grid-cols-2 lg:w-[500px]">
                      <ListItem href="/seo-checker" title="SEO Checker">
                        Analyze and optimize your website for search engines.
                      </ListItem>
                      <ListItem href="/grammar-checker" title="Grammar Checker">
                        Check for grammar, spelling, and punctuation errors.
                      </ListItem>
                      <ListItem href="/blog-generator" title="Blog Post Generator">
                        Generate a full blog post from a simple title.
                      </ListItem>
                      <ListItem href="/AIsummarizer" title="AI Summarizer">
                        Summarize long articles and texts quickly.
                      </ListItem>
                      <ListItem href="/pdf-converter" title="PDF Summarizer">
                        Extract text from a PDF and generate a summarized version instantly.
                      </ListItem>
                      <ListItem href="/hashtag" title="Hashtag Generator">
                        Get suggested hashtags for your blog posts and content.
                      </ListItem>
                      <ListItem href="/email-writer" title="Email Writer">
                        Create professional emails with AI assistance.
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/feed"
                    className={`hover:text-indigo-600 px-4 dark:hover:text-indigo-400 transition-colors ${
                      pathname === "/feed"
                        ? "text-indigo-600 dark:text-indigo-400 font-semibold bg-gray-100/80 dark:bg-gray-500/20"
                        : ""
                    }`}
                  >
                   Story Feed
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
              <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer focus:bg-gray-100 dark:focus:bg-gray-700">Light</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer focus:bg-gray-100 dark:focus:bg-gray-700">Dark</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer focus:bg-gray-100 dark:focus:bg-gray-700">System</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Desktop Auth Section */}
            {auth ? (
              <Link href={profileLink} className="hidden md:flex">
                <div className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {auth?.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={auth.avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
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
                <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer focus:bg-gray-100 dark:focus:bg-gray-700">Light</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer focus:bg-gray-100 dark:focus:bg-gray-700">Dark</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer focus:bg-gray-100 dark:focus:bg-gray-700">System</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {auth && (
                <Link href={profileLink} className="flex md:hidden">
                  <div className="flex items-center p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {auth?.avatar ? (
                        <img src={auth.avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
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
              <form onSubmit={onSubmitSearch} className="flex items-center gap-2 p-3" role="search">
                <Search className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActiveIndex(0);
                  }}
                  onKeyDown={onKeyDown}
                  placeholder="Search ByteStory…"
                  className="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                  aria-activedescendant={activeIndex >= 0 ? `search-opt-${activeIndex}` : undefined}
                  aria-autocomplete="list"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => {
                    setIsSearchOpen(false);
                    setQuery("");
                    setActiveIndex(-1);
                  }}
                  aria-label="Close search"
                >
                  <X className="h-5 w-5" />
                </Button>
                <Button type="submit" size="sm" className="bg-black dark:bg-indigo-600 text-white hover:bg-gray-800 dark:hover:bg-indigo-700">
                  Search
                </Button>
              </form>

              {/* Suggestions */}
              <div role="listbox" aria-label="Search suggestions" className="px-2 pb-2">
                {filtered.length ? (
                  <ul className="max-h-72 overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700">
                    {filtered.map((s, idx) => (
                      <li key={s.label} id={`search-opt-${idx}`}>
                        <button
                          type="button"
                          onMouseEnter={() => setActiveIndex(idx)}
                          onClick={() => go(s.path)}
                          className={`w-full flex items-center justify-between gap-3 text-left px-3 py-2 rounded-md transition-colors ${
                            idx === activeIndex
                              ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                              : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                          }`}
                          aria-selected={idx === activeIndex}
                          role="option"
                        >
                          <span className="text-sm font-medium">{s.label}</span>
                          {/* removed route path display */}
                          <ArrowUpRight className="h-4 w-4 shrink-0" />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">No matches. Try a different keyword.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Menu Dropdown */}
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

  {/* AI Tools Section */}
  <div className="px-3 py-2">
    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2 font-semibold">AI Tools</p>
    <div className="grid grid-cols-1 gap-1">
      {[
        { href: "/seo-checker", label: "SEO Checker" },
        { href: "/grammar-checker", label: "Grammar Checker" },
        { href: "/blog-generator", label: "Blog Post Generator" },
        { href: "/AIsummarizer", label: "AI Summarizer" },
        { href: "/pdf-converter", label: "PDF Summarizer" },
        { href: "/hashtag", label: "Hashtag Generator" },
        { href: "/email-writer", label: "Email Writer" },
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
    { href: "/feed", label: "Story Feed" },
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
