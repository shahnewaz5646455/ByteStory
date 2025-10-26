"use client";

import React, { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardNavbar from "@/components/ui/Application/dashboard/DahboardNavbar";
import UserSidebar from "@/components/ui/Application/user/UserSidebar";
import UserRoute from "@/components/routes/UserRoute";

const WebsiteLayout = ({ children }) => {
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
    window.addEventListener("resize", checkMobile);

    return () => {
      if (navbar) navbar.style.display = "";
      if (footer) footer.style.display = "";
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <UserRoute>
      <SidebarProvider>
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
          {/* Sidebar Overlay for Mobile */}
          {isMobile && isSidebarOpen && (
            <div
              className="fixed inset-0 bg-gray-300/70 backdrop-blur-md bg-opacity-50 z-40 md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Sidebar - Fixed position */}
          <div
            className={`
          fixed md:fixed inset-y-0 left-0 z-50
          transform transition-transform duration-300 ease-in-out
          ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
          w-64 md:w-64 lg:w-72
        `}
          >
            <UserSidebar onClose={() => setIsSidebarOpen(false)} />
          </div>

          {/* Main Content Area */}
          <div 
            className="flex-1 flex flex-col min-h-screen ml-0 md:ml-64 lg:ml-72 transition-all duration-300"
            style={{ 
              width: 'calc(100vw)',
              marginLeft: isSidebarOpen ? '0' : '0'
            }}
          >
            <DashboardNavbar onMenuClick={toggleSidebar} />

            {/* Main content area - Scrollable */}
            <main 
              className="flex-1 p-4 md:p-6 lg:p-8 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white transition-colors duration-200 overflow-auto"
              style={{
                marginLeft: isSidebarOpen && isMobile ? '0' : '0'
              }}
            >
              <div>{children}</div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </UserRoute>
  );
};

export default WebsiteLayout;