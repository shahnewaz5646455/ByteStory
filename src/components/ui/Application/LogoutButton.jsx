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
      className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-red-100 text-red-600 transition"
    >
      <LogOut size={20} />
      <span>Logout</span>
    </Button>
  );
};

export default LogoutButton;
