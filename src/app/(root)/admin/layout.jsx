"use client";

import React, { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/ui/Application/Admin/AdminSidebar";
import DashboardNavbar from "@/components/ui/Application/dashboard/DahboardNavbar";

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const navbar = document.querySelector("nav");
    if (navbar) navbar.style.display = "none";
    const footer = document.querySelector("footer");
    if (footer) footer.style.display = "none";

    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      if (navbar) navbar.style.display = "";
      if (footer) footer.style.display = "";
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar Overlay for Mobile */}
        {isMobile && isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-gray-300/70 backdrop-blur-md bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed md:static inset-y-0 left-0 z-50
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          w-64 md:w-64 lg:w-72
        `}>
          <AdminSidebar onClose={() => setIsSidebarOpen(false)} />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen w-full md:w-[calc(100%-16rem)] lg:w-[calc(100%-18rem)]">
          <DashboardNavbar onMenuClick={toggleSidebar} />
          
          {/* Main content area */}
          <main className="flex-1 p-4 md:p-6 lg:p-8 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white transition-colors duration-200 overflow-auto">
            <div>
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;