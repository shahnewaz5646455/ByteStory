"use client";

import { useEffect, useState } from "react";
import socket from "@/lib/socket";
import { Users } from "lucide-react";

export default function ActiveUsersCard() {
  const [activeUsers, setActiveUsers] = useState(0);

  useEffect(() => {
    socket.on("userCount", (count) => {
      setActiveUsers(count);
    });

    return () => {
      socket.off("userCount");
    };
  }, []);

  return (
    <div className="p-6 bg-gradient-to-br from-green-100 to-green-50 border border-green-200 rounded-2xl shadow-md hover:shadow-lg transition">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-700">Active Users</h2>
        <Users className="w-6 h-6 text-green-600" />
      </div>
      <p className="text-4xl font-bold text-green-700 mt-3">{activeUsers}</p>
      <span className="text-sm text-gray-500">currently online</span>
    </div>
  );
}
