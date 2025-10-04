"use client";

import React, { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/ui/Application/Admin/AdminSidebar";
import DashboardNavbar from "@/components/ui/Application/dashboard/DahboardNavbar";
import AdminRoute from "@/components/routes/AdminRoute";
import { SessionProvider } from "next-auth/react";
import { VisitorTracking } from "@/components/VisitorTracking";

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const navbar = document.querySelector("nav");
    if (navbar) navbar.style.display = "none";
    const footer = document.querySelector("footer");
    if (footer) footer.style.display = "none";

    // Check screen size - lg breakpoint (1024px)
    const checkScreenSize = () => {
      const large = window.innerWidth >= 1024;
      setIsLargeScreen(large);
      
      // Auto-open sidebar on large screens, close on small screens
      if (large) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      if (navbar) navbar.style.display = "";
      if (footer) footer.style.display = "";
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar when clicking on overlay (mobile)
  const closeSidebar = () => {
    if (!isLargeScreen) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <SessionProvider>
      <AdminRoute>
        <SidebarProvider>
          <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Sidebar Overlay for Mobile/Tablet */}
            {!isLargeScreen && isSidebarOpen && (
              <div
                className="fixed inset-0 backdrop-blur-xs bg-black/20 z-40"
                onClick={closeSidebar}
              />
            )}

            {/* Sidebar - Only visible on lg screens or when manually opened */}
            <div
              className={`
                ${!isLargeScreen ? "fixed" : "sticky top-0 self-start"}
                inset-y-0 left-0 z-50
                transform transition-transform duration-300 ease-in-out
                ${
                  isSidebarOpen 
                    ? "translate-x-0" 
                    : "-translate-x-full lg:translate-x-0"
                }
                w-64 lg:w-72
                h-screen overflow-y-auto
                bg-white dark:bg-gray-900 shadow-lg
                border-r border-gray-200 dark:border-gray-700
              `}
            >
              <AdminSidebar onClose={closeSidebar} />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-screen min-w-0">
              {/* Navbar - with conditional z-index */}
               <div className={`
                sticky top-0
                ${isSidebarOpen && !isLargeScreen ? 'z-30' : 'z-40'}
                bg-white/95 dark:bg-gray-900/95 backdrop-blur-md
              `}>
                <DashboardNavbar 
                  onMenuClick={toggleSidebar} 
                  showMenuButton={!isLargeScreen}
                />
              </div>

              <main
                className={`
                  flex-1 p-4 md:p-6 lg:p-8 
                  bg-gradient-to-br from-indigo-50 via-white to-purple-50 
                  dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 
                  text-gray-900 dark:text-white transition-colors duration-200 
                  overflow-y-auto
                  ${isSidebarOpen && !isLargeScreen ? 'z-20' : 'z-10'}
                  relative
                `}
              >
                <div>{children}</div>
                <VisitorTracking />
              </main>
            </div>
          </div>
        </SidebarProvider>
      </AdminRoute>
    </SessionProvider>
  );
};

export default AdminLayout;