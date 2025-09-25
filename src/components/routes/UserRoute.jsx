"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "../ui/Application/Loading";

const UserRoute = ({ children }) => {
  const { auth } = useSelector((state) => state.authStore);
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!auth || !auth.token) {
      router.replace("/login");
    } else if (auth.role !== "user") {
      router.replace("/admin/adminDashboard"); // redirect admin
    } else {
      setChecking(false);
    }
  }, [auth, router]);

  if (checking) return <Loading />;

  return <>{children}</>;
};

export default UserRoute;
