"use client";

import React, { useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import UserSidebar from "@/components/ui/Application/website/UserSidebar";

const WebsiteLayout = ({ children }) => {
  useEffect(() => {
    // Hide Navbar on dashboard/user pages
    const navbar = document.querySelector("nav");
    if (navbar) navbar.style.display = "none";

    // Restore Navbar when leaving dashboard
    return () => {
      if (navbar) navbar.style.display = "";
    };
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <UserSidebar />
        <main className="flex-1 p-6">{children}</main>

        {/* ShadCN UI toaster for notifications */}
      </div>
    </SidebarProvider>
  );
};

export default WebsiteLayout;
