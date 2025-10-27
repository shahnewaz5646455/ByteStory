"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Camera,
  Loader,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import ProfileEditDialog from "@/components/update-profile/ProfileEditDialog";

const ProfilePage = () => {
  const auth = useSelector((store) => store.authStore.auth);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  // Fetch user data
  const fetchUserData = async () => {
    try {
      setLoading(true);

      if (!auth?._id) {
        // console.error("❌ No user ID found in Redux store");
        toast.error("Please log in again");
        return;
      }

      console.log("🔍 Fetching profile for user ID:", auth._id);

      const response = await fetch("/api/dashboard/update-profile", {
        headers: {
          "x-user-id": auth._id,
        },
      });

      console.log("🔍 API Response status:", response.status);

      const data = await response.json();
      console.log("🔍 API Response data:", data);

      if (data.success && data.user) {
        setUserData(data.user);
        setEditForm({
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone || "",
          address: data.user.address || "",
          role: data.user.role,
          isEmailVerified: data.user.isEmailVerified,
        });
        console.log("✅ User's own profile data loaded successfully");
      } else {
        console.error("❌ API Error:", data.error);
        toast.error(data.error || "Failed to load your profile data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Error loading your profile");
    } finally {
      setLoading(false);
    }
  };

  // Update profile
  const handleSaveProfile = async (avatarFile) => {
    try {
      setSaving(true);

      if (!auth?._id) {
        toast.error("Please log in again");
        return;
      }

      const formData = new FormData();
      formData.append("name", editForm.name);
      formData.append("phone", editForm.phone);
      formData.append("address", editForm.address);

      if (avatarFile) formData.append("avatar", avatarFile);

      console.log("🔍 Updating profile for user ID:", auth._id);

      const headers = new Headers();
      headers.append("x-user-id", auth._id);

      const response = await fetch("/api/dashboard/update-profile", {
        method: "PUT",
        body: formData,
        headers: headers,
      });

      const result = await response.json();
      console.log("🔍 Update response:", result);

      if (result.success) {
        toast.success("Your profile updated successfully");
        setUserData(result.user);
        setEditDialogOpen(false);

        setEditForm({
          name: result.user.name,
          email: result.user.email,
          phone: result.user.phone || "",
          address: result.user.address || "",
          role: result.user.role,
          isEmailVerified: result.user.isEmailVerified,
        });
      } else {
        toast.error(result.error || "Failed to update your profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("An error occurred while updating your profile");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    console.log("🔍 Auth from Redux:", auth);
    console.log("🔍 Logged-in user ID:", auth?._id);

    if (auth && auth._id) {
      fetchUserData();
    } else {
      // console.error("❌ No auth data or user ID found");
      setLoading(false);
    }
  }, [auth]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/30 dark:bg-gray-900/30">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-500" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/30 dark:bg-gray-900/30">
        <div className="text-center">
          <User className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 dark:text-gray-400">
            Failed to load your profile
          </p>
          <Button onClick={fetchUserData} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              My Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your personal information and account settings
            </p>
          </div>
          <Button
            onClick={() => setEditDialogOpen(true)}
            className="mt-4 sm:mt-0 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
          >
            <Camera className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        {/* Main Grid - Centered content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-sm h-full flex flex-col">
              <CardHeader className="text-center pb-4 flex-shrink-0">
                <div className="relative mx-auto mb-4">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900">
                    {userData.avatar?.url ? (
                      <img
                        src={userData.avatar.url}
                        alt={userData.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="h-12 w-12 sm:h-16 sm:w-16 text-purple-500" />
                      </div>
                    )}
                  </div>
                </div>
                <CardTitle className="text-xl sm:text-2xl text-gray-900 dark:text-white">
                  {userData.name}
                </CardTitle>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Badge
                    variant={
                      userData.role === "admin" ? "default" : "secondary"
                    }
                    className={
                      userData.role === "admin"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                    }
                  >
                    {userData.role === "admin" ? (
                      <>
                        <Shield className="h-3 w-3 mr-1" />
                        Administrator
                      </>
                    ) : (
                      "User Account"
                    )}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div
                  className={`p-3 rounded-lg border ${
                    userData.isEmailVerified
                      ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                      : "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800"
                  }`}
                >
                  <div className="flex items-center gap-2 text-sm">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        userData.isEmailVerified
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }`}
                    />
                    <span
                      className={
                        userData.isEmailVerified
                          ? "text-green-700 dark:text-green-400"
                          : "text-yellow-700 dark:text-yellow-400"
                      }
                    >
                      {userData.isEmailVerified
                        ? "Email Verified"
                        : "Email Not Verified"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Member since
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {userData.createdAt
                        ? new Date(userData.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                            }
                          )
                        : "Unknown"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Personal Information */}
          <div className="lg:col-span-2">
            <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-sm h-full">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Your account details and contact information
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                        <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Full Name
                        </label>
                        <p className="text-gray-900 dark:text-white mt-1 font-medium">
                          {userData.name}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                        <Mail className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Email Address
                        </label>
                        <p className="text-gray-900 dark:text-white mt-1 font-medium">
                          {userData.email}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Cannot be changed
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                        <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Phone Number
                        </label>
                        <p className="text-gray-900 dark:text-white mt-1 font-medium">
                          {userData.phone || "Not provided"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Role */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg">
                        <Shield className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Account Role
                        </label>
                        <p className="text-gray-900 dark:text-white mt-1 font-medium">
                          {userData.role === "admin"
                            ? "Administrator"
                            : "Standard User"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg mt-1">
                      <MapPin className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Address
                      </label>
                      <p className="text-gray-900 dark:text-white mt-1 font-medium">
                        {userData.address || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Security Note */}
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Account Security
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        Your email and role cannot be changed for security
                        reasons. Contact support if you need to update these
                        details.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ProfileEditDialog
        isOpen={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        user={userData}
        editForm={editForm}
        setEditForm={setEditForm}
        onSave={handleSaveProfile}
        saving={saving}
      />
    </div>
  );
};

export default ProfilePage;
