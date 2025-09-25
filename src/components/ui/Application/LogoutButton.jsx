"use client";

import { showToast } from "@/lib/showToast";
import { logout } from "@/store/reducer/authReducer";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import { useDispatch } from "react-redux";
import { Button } from "../button";
import { LogOut } from "lucide-react";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogoutButton = async () => {
    try {
      const { data: logoutResponse } = await axios.post(
        "/api/test/auth/logout",
        {},
        { withCredentials: true } // clear cookie
      );

      if (!logoutResponse.success) {
        throw new Error(logoutResponse.error || "Logout failed");
      }

      dispatch(logout());
      showToast("success", logoutResponse.message || "Logged out successfully");
      router.push("/login");
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    }
  };

  return (
    <Button
      onClick={handleLogoutButton}
      className="group/button relative inline-flex items-center justify-center overflow-hidden rounded-md hover:bg-gray-800 bg-gray-800 backdrop-blur-lg px-6 py-2 text-base font-semibold text-white transition-all duration-150 ease-in-out hover:shadow-lg hover:shadow-gray-600/50 dark:hover:shadow-indigo-600/30 border border-white/20 dark:border-indigo-400/20 w-full cursor-pointer"
    >
      <LogOut size={20} />
      <span>Logout</span>
      <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]">
        <div className="relative h-full w-10 bg-white/20 dark:bg-indigo-300/20"></div>
      </div>
    </Button>
  );
};

export default LogoutButton;
