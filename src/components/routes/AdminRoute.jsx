"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "../ui/Application/Loading";

const AdminRoute = ({ children }) => {
  const { auth } = useSelector((state) => state.authStore);
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!auth || !auth.token) {
      router.replace("/login");
    } else if (auth.role !== "admin") {
      router.replace("/website/my-account"); // redirect normal users
    } else {
      setChecking(false);
    }
  }, [auth, router]);

  if (checking) return <Loading />;

  return <>{children}</>;
};

export default AdminRoute;
