import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Home, Users, Package, Settings, LogOut } from "lucide-react"; // icons
import Link from "next/link";
import LogoutButton from "../LogoutButton";
import UserDropDown from "../UserDropDown";

const AdminSidebar = () => {
  return (
    <Sidebar>
      {/* Header */}
      <SidebarHeader className="p-4 text-xl font-bold tracking-wide border-b">
        Admin Panel + logo
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent className="flex flex-col justify-between h-full">
        {/* Main Navigation */}
        <div>
          <SidebarGroup>
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition"
            >
              <Home size={20} />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/admin/users"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition"
            >
              <Users size={20} />
              <span>Users</span>
            </Link>

            <Link
              href="/admin/products"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition"
            >
              <Package size={20} />
              <span>Products</span>
            </Link>

            <Link
              href="/admin/settings"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition"
            >
              <Settings size={20} />
              <span>Settings</span>
            </Link>
          </SidebarGroup>
        </div>

        {/* Footer */}
        <SidebarFooter className="p-4 border-t">
          <UserDropDown />
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;
