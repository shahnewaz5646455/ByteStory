// components/PrivateRoute.jsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const PrivateRoute = ({ children, requiredRole }) => {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Call backend API to check auth instead of reading token
    fetch("/api/test/auth/me") // a route that returns user info if logged in
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) return router.push("/login");

        if (requiredRole && data.user.role !== requiredRole) {
          return router.push("/"); // redirect if role mismatch
        }

        setAuthorized(true);
      })
      .catch(() => router.push("/login"));
  }, [router, requiredRole]);

  if (!authorized) return null; // wait until auth check

  return <>{children}</>;
};

export default PrivateRoute;
