"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Menu,
  Bell,
  User,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
  Home,
  Users,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  Shield,
  X,
} from "lucide-react";
import { useSelector } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { toast } from "sonner";

const DashboardNavbar = ({ onMenuClick }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setTheme } = useTheme();
  const auth = useSelector((store) => store.authStore.auth);

  // Refs for dropdowns
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  // Check if user is admin
  const isAdmin = auth?.role === "admin";

  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/notifications");
      const data = await response.json();

      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter notifications based on user role
  const getFilteredNotifications = () => {
    if (isAdmin) {
      // Admin sees all notifications
      return notifications;
    } else {
      // Regular users see only non-user-registration notifications
      return notifications.filter(
        (notification) => notification.type !== "user_registered"
      );
    }
  };

  // Mark notifications as read
  const markAsRead = async (notificationIds = []) => {
    try {
      const response = await fetch("/api/admin/notifications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notificationIds }),
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setNotifications((prev) =>
          prev.map((notif) =>
            notificationIds.includes(notif._id) || notificationIds.length === 0
              ? { ...notif, isRead: true, readAt: new Date() }
              : notif
          )
        );
      }
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  // Mark all as read
  const markAllAsRead = () => {
    markAsRead(); // Empty array means mark all
    toast.success("All notifications marked as read");
  };

  // Format time (e.g., "5m ago")
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "user_registered":
        return <Users className="h-4 w-4 text-blue-500" />;
      case "content_created":
        return <FileText className="h-4 w-4 text-green-500" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "system":
        return <AlertCircle className="h-4 w-4 text-purple-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Auto-refresh notifications every 30 seconds
  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, []);

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = filteredNotifications.filter((n) => !n.isRead).length;

  return (
    <>
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-600/50 sticky top-0 z-40 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Left Section - Mobile Menu Button */}
            <div className="flex items-center">
              <button
                onClick={onMenuClick}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors lg:hidden"
              >
                <Menu size={24} />
              </button>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="md:flex border-gray-300 dark:border-gray-600 bg-transparent dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                >
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Notifications - Visible to all users */}
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => {
                    setIsNotificationOpen(!isNotificationOpen);
                    if (!isNotificationOpen && unreadCount > 0) {
                      markAllAsRead();
                    }
                  }}
                  className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-105 relative cursor-pointer"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 md:h-5 md:w-5 flex items-center justify-center font-medium border-2 border-white dark:border-gray-900 text-[10px] md:text-xs animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {isNotificationOpen && (
                  <div className="absolute -right-13 mt-2 w-80 sm:w-96 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 z-50 max-h-[45vh] overflow-hidden">
  {/* Header */}
  <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 bg-white/95 dark:bg-gray-800/95">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Notifications
        </h3>
        {/* Mobile close button */}
        <button
          onClick={() => setIsNotificationOpen(false)}
          className="sm:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <X size={16} />
        </button>
      </div>
      <div className="flex items-center gap-2">
        {unreadCount > 0 && (
          <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs px-2 py-1 rounded-full">
            {unreadCount} new
          </span>
        )}
        {filteredNotifications.length > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium hidden sm:block"
          >
            Mark all read
          </button>
        )}
      </div>
    </div>
    {isAdmin && (
      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
        <Shield className="h-3 w-3 text-green-500" />
        Admin View - All notifications
      </p>
    )}
  </div>

  {/* Notifications List - Scrollable */}
  <div className="overflow-y-auto" style={{ maxHeight: "calc(40vh - 120px)" }}>
    {loading ? (
      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
        <Clock className="h-6 w-6 animate-spin mx-auto mb-2" />
        Loading notifications...
      </div>
    ) : filteredNotifications.length === 0 ? (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
        <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No notifications yet</p>
        <p className="text-sm mt-1">
          {isAdmin
            ? "You'll be notified when new users register"
            : "You'll be notified about important updates"}
        </p>
      </div>
    ) : (
      filteredNotifications.map((notification) => (
        <div
          key={notification._id}
          className={`p-4 pb-8 border-b border-gray-100/50 dark:border-gray-700/50 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 cursor-pointer transition-all duration-200 ${
            !notification.isRead
              ? "bg-blue-50/80 dark:bg-blue-900/20 border-l-4 border-blue-500"
              : "bg-transparent"
          }`}
          onClick={() => markAsRead([notification._id])}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white break-words">
                {notification.title}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 break-words">
                {notification.message}
              </p>

              {/* Show user data for user registrations - Only for admin */}
              {notification.type === "user_registered" &&
                notification.data &&
                isAdmin && (
                  <div className="mt-2 p-2 bg-white/50 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400 break-words">
                      <strong>Name:</strong> {notification.data.userName}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 break-words">
                      <strong>Email:</strong> {notification.data.userEmail}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      <strong>Role:</strong> {notification.data.userRole}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      <strong>Provider:</strong> {notification.data.provider}
                    </p>
                  </div>
                )}

              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatTime(notification.createdAt)}
                </p>
                {!notification.isRead && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse flex-shrink-0 ml-2"></div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))
    )}
  </div>

  {/* Footer */}
  {filteredNotifications.length > 0 && (
    <div className="p-3 border-t border-gray-200/50 dark:border-gray-700/50 sticky bottom-0 bg-white/95 dark:bg-gray-800/95">
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Mobile mark all read button */}
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="sm:hidden text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium py-2"
          >
            Mark all as read
          </button>
        )}
        <Link
          href="/admin/notifications"
          className="text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium py-2"
          onClick={() => setIsNotificationOpen(false)}
        >
          View all notifications
        </Link>
      </div>
    </div>
  )}
</div>
                )}
              </div>

              {/* User Profile */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 md:space-x-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {auth?.photoURL ? (
                      <img
                        src={auth.photoURL}
                        alt="User Avatar"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      auth?.name?.charAt(0) || "U"
                    )}
                  </div>

                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {auth?.name || "Guest User"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      {isAdmin ? (
                        <>
                          <Shield className="h-3 w-3 text-green-500" />
                          Administrator
                        </>
                      ) : (
                        "User"
                      )}
                    </p>
                  </div>

                  <ChevronDown
                    size={16}
                    className="text-gray-400 hidden md:block"
                  />
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 z-50">
                    {/* Mobile close button */}
                    <button
                      onClick={() => setIsProfileOpen(false)}
                      className="sm:hidden absolute top-2 right-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <X size={16} />
                    </button>

                    <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50">
                      <p className="text-sm font-medium text-gray-900 dark:text-white break-words">
                        {auth?.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {auth?.email}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                        {isAdmin ? (
                          <>
                            <Shield className="h-3 w-3 text-green-500" />
                            Administrator
                          </>
                        ) : (
                          "User"
                        )}
                      </p>
                    </div>

                    <div className="p-2">
                      <Link
                        href="/"
                        className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Home size={16} />
                        <span>Go To Home</span>
                      </Link>
                      <Link
                        href="/dashboard/profile"
                        className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <User size={16} />
                        <span>Profile</span>
                      </Link>
                    </div>

                    <div className="p-2 border-t border-gray-200/50 dark:border-gray-700/50">
                      <button className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                        <LogOut size={16} />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardNavbar;