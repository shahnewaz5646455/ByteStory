"use client";

import React, { useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/ui/Application/Admin/AdminSidebar";
import AdminRoute from "@/components/routes/AdminRoute";

const AdminLayout = ({ children }) => {
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
    <AdminRoute>
      <SidebarProvider>
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <AdminSidebar />

          {/* Main content */}
          <main className="flex-1 p-6">{children}</main>
        </div>
      </SidebarProvider>
    </AdminRoute>
  );
};

export default AdminLayout;
