"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelector } from "react-redux";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import { Shield, User } from "lucide-react";

const UserDropDown = () => {
  const auth = useSelector((store) => store.authStore.auth);

  // role-based logo
  const roleLogo =
    auth?.role === "admin"
      ? "https://i.ibb.co.com/9kMtXFKN/admin-3d-illustration-icon-png-removebg-preview.png"
      : "https://i.ibb.co.com/jvjJkzkX/user-photo-removebg-preview.png";

  // Role icon
  const roleIcon = (role) => {
    if (role === "admin")
      return <Shield size={20} className="text-blue-600 flex-shrink-0" />;
    return <User size={20} className="text-gray-500 flex-shrink-0" />;
  };

  // Show login button if not logged in
  if (!auth) {
    return (
      <Link
        href="/login"
        className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
      >
        Login
      </Link>
    );
  }

  return (
    <DropdownMenu>
      {/* Avatar Trigger */}
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer w-10 h-10 border shadow-sm">
          <AvatarImage src={auth?.photoURL || roleLogo} alt="User avatar" />
          <AvatarFallback>
            {auth?.name?.[0] || (auth?.role === "admin" ? "A" : "U")}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      {/* Dropdown Content */}
      <DropdownMenuContent
        align="end"
        className="w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2"
      >
        {/* Top Info: Avatar, Name, Role */}
        <div className="flex items-center gap-3 p-2 border-b border-gray-200 dark:border-gray-700">
          {roleIcon(auth?.role)}
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {auth?.name}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">
              {auth?.role}
            </span>
          </div>
        </div>

        {/* Menu Items */}
        <DropdownMenuItem asChild>
          <Link href="/profile" className="w-full block">
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/billing" className="w-full block">
            Billing
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/team" className="w-full block">
            Team
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem asChild>
          <LogoutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropDown;
