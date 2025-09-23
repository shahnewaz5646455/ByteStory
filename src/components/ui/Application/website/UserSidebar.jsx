"use client";

import React from "react";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
} from "@/components/ui/sidebar"; // ShadCN sidebar
import UserDropDown from "../UserDropDown";

const UserSidebar = () => {
  return (
    <Sidebar className="w-64 bg-white shadow-md">
      <SidebarHeader>
        <h2 className="text-lg font-bold text-gray-700 p-4">User Dashboard</h2>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <Link
            href="/dashboard/userProfile"
            className="block p-3 rounded hover:bg-gray-100"
          >
            Profile
          </Link>
          <Link
            href="/dashboard/orders"
            className="block p-3 rounded hover:bg-gray-100"
          >
            Orders
          </Link>
          <Link
            href="/dashboard/settings"
            className="block p-3 rounded hover:bg-gray-100"
          >
            Settings
          </Link>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <UserDropDown />
      </SidebarFooter>
    </Sidebar>
  );
};

export default UserSidebar;
