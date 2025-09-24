"use client";

import React, { useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/ui/Application/Admin/AdminSidebar";
import DashboardNavbar from "@/components/ui/Application/dashboard/DahboardNavbar";

const AdminLayout = ({ children }) => {
  useEffect(() => {
    const navbar = document.querySelector("nav");
    if (navbar) navbar.style.display = "none";
    const footer = document.querySelector("footer");
    if (footer) footer.style.display = "none";

    return () => {
      if (navbar) navbar.style.display = "";
      if (footer) footer.style.display = "";
    };
  }, []);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        {/* Sidebar - fixed full height */}
        <div className="h-screen sticky top-0">
          <AdminSidebar />
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Navbar only in main content width */}
          <DashboardNavbar />

          {/* Page content */}
          <main className="flex-1 p-6 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
