"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

const PrivateRoute = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login"); // redirect if not logged in
    }
  }, [router]);

  return <>{children}</>;
};

export default PrivateRoute;
