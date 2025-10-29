"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  Lightbulb,
  ChevronRight,
  X,
  SparklesIcon,
  Recycle,
  MessagesSquareIcon,
  ShieldQuestionMarkIcon,
  MessagesSquare,
  Share,
  LucideBluetoothConnected,
  Share2Icon,
} from "lucide-react";
import LogoutButton from "../LogoutButton";

const menuItems = [
  { name: "Dashboard", href: "/website/my-account", icon: LayoutDashboard, badge: null },
  { name: "My Posts", href: "/website/my-posts", icon: SparklesIcon, badge: null },
  {
    name: "Recycle Bin",
    href: "/website/recycle-bin",
    icon: Recycle,
    badge: null,
  },
  {
    name: "Shared with Others",
    href: "/website/shared",
    icon: Share2Icon,
    badge: null,
  },
  {
    name: "QnA-ByteStory",
    href: "/website/QnA",
    icon: MessagesSquare,
    badge: null,
  },
  {
    name: "Profile",
    href: "/website/update-profile",
    icon: Settings,
    badge: null,
  },
];

export default function UserSidebar({ onClose }) {
  const pathname = usePathname();

  const isActiveLink = (href) => {
    if (href === "/website") {
      return pathname === "/website";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside className="h-screen w-full bg-white/95 dark:bg-gray-900/95 border-r border-gray-200/50 dark:border-gray-600/50 backdrop-blur-md flex flex-col shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between h-20 px-4 md:px-6 border-b border-gray-200/80 dark:border-gray-600/50">
        <Link
          href="/"
          className="group flex items-center gap-2 cursor-pointer transition-all duration-300"
          onClick={onClose}
        >
          <div className="relative">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center 
                  bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300"
            >
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex flex-col">
            <p className="dark:text-gray-100 font-bold text-2xl">ByteStory</p>
          </div>
        </Link>

        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X size={20} />
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-2 md:px-4 py-4 md:py-8 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = isActiveLink(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={`group flex items-center justify-between gap-3 px-3 md:px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden ${
                isActive
                  ? "bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 text-purple-700 dark:text-purple-300 shadow-md shadow-purple-500/10 border-l-4 border-purple-500"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50/80 dark:hover:bg-gray-800/80 hover:text-gray-900 dark:hover:text-gray-100 hover:shadow-md md:hover:translate-x-1"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md"
                      : "bg-gray-100/50 dark:bg-gray-800/50 group-hover:bg-gradient-to-r group-hover:from-purple-500/10 group-hover:to-indigo-500/10 text-gray-500 dark:text-gray-400"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span className="font-medium text-sm">{item.name}</span>
              </div>

              <div className="flex items-center gap-2">
                {item.badge && (
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      isActive
                        ? "bg-white/80 text-purple-600"
                        : "bg-gradient-to-r from-purple-500/10 to-indigo-500/10 text-purple-600 dark:text-purple-400"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {isActive && (
                  <ChevronRight
                    className="h-3 w-3 animate-pulse text-purple-500"
                  />
                )}
              </div>

              <div
                className={`absolute inset-0 transition-opacity duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-purple-500 to-indigo-500 opacity-10"
                    : "opacity-0 group-hover:opacity-5"
                } bg-gradient-to-r from-purple-500 to-indigo-500`}
              ></div>
            </Link>
          );
        })}
      </nav>

      {/* Footer Section */}
      <div className="px-2 md:px-4 py-4 md:py-6 border-t border-gray-100/50 dark:border-gray-800/50">
        {/* Logout */}
        <div className="border-t border-gray-100/50 dark:border-gray-800/50 pt-4">
          <LogoutButton />
        </div>
      </div>
    </aside>
  );
}