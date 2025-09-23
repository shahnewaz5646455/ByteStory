import PrivateRoute from "@/components/PrivateRoute";
import AppSidebar from "@/components/ui/Application/Admin/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

const Layout = ({ children }) => {
  return (
    <PrivateRoute>
      <SidebarProvider>
        <AppSidebar />
        <main>{children}</main>
      </SidebarProvider>
    </PrivateRoute>
  );
};

export default Layout;
