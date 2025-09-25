"use client";

import React, { useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import UserSidebar from "@/components/ui/Application/website/UserSidebar";
import UserRoute from "@/components/routes/UserRoute";

const WebsiteLayout = ({ children }) => {
  useEffect(() => {
    const navbar = document.querySelector("nav");
    const footer = document.querySelector("footer");

    if (navbar) navbar.style.display = "none";
    if (footer) footer.style.display = "none";

    return () => {
      if (navbar) navbar.style.display = "";
      if (footer) footer.style.display = "";
    };
  }, []);

  return (
    <UserRoute>
      <SidebarProvider>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <UserSidebar />
          <main className="flex-1 p-6">{children}</main>

          {/* ShadCN UI toaster for notifications */}
        </div>
      </SidebarProvider>
    </UserRoute>
  );
};

export default WebsiteLayout;
