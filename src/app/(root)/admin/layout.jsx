import AppSidebar from "@/components/ui/Application/Admin/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

const Layout = ({ children }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>{children}</main>
    </SidebarProvider>
  );
};

export default Layout;
