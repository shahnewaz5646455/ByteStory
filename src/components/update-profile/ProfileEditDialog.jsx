"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  RefreshCw,
  Edit,
  AlertCircle,
  Upload,
  User,
  X,
  Mail,
  Shield,
} from "lucide-react";
import { useState, useRef } from "react";

const ProfileEditDialog = ({
  isOpen,
  onOpenChange,
  user,
  editForm,
  setEditForm,
  onSave,
  saving,
}) => {
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const fileInputRef = useRef(null);

  if (!user) return null;

  const handleAvatarSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("Please select an image smaller than 5MB");
        return;
      }

      setAvatarFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    setAvatarFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = () => {
    onSave(avatarFile);
  };

  const handleOpenChange = (open) => {
    if (!open) {
      setAvatarPreview(null);
      setAvatarFile(null);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[95%] sm:max-w-md md:max-w-lg max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-white text-lg sm:text-xl">
            <Edit className="h-4 w-4 sm:h-5 sm:w-5" />
            Edit Your Profile
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400 text-sm">
            Update your personal information and profile photo
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:gap-6 py-4">
          {/* Avatar Upload Section */}
          <div className="space-y-3">
            <Label className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm">
              Profile Photo
            </Label>
            <div className="flex items-center gap-4">
              <div className="relative">
                {/* Avatar Preview */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 overflow-hidden bg-gray-100 dark:bg-gray-700">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : user.avatar?.url ? (
                    <img
                      src={user.avatar.url}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-600">
                      <User className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Remove button */}
                {(avatarPreview || user.avatar?.url) && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>

              {/* Upload Button */}
              <div className="flex-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarSelect}
                  accept="image/*"
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {avatarPreview ? "Change Photo" : "Upload Photo"}
                </Button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  JPG, PNG, WebP (Max 5MB)
                </p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 gap-4">
            {/* Name */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-gray-700 dark:text-gray-300 text-sm"
              >
                Full Name *
              </Label>
              <Input
                id="name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-500 text-gray-900 dark:text-white text-sm h-10"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email - Read Only */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-gray-700 dark:text-gray-300 text-sm flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={editForm.email}
                readOnly
                className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 cursor-not-allowed text-gray-600 dark:text-gray-400 text-sm h-10"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Email address cannot be changed for security reasons
              </p>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="text-gray-700 dark:text-gray-300 text-sm"
              >
                Phone Number
              </Label>
              <Input
                id="phone"
                value={editForm.phone || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, phone: e.target.value })
                }
                placeholder="Enter your phone number"
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-500 text-gray-900 dark:text-white text-sm h-10"
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label
                htmlFor="address"
                className="text-gray-700 dark:text-gray-300 text-sm"
              >
                Address
              </Label>
              <Input
                id="address"
                value={editForm.address || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, address: e.target.value })
                }
                placeholder="Enter your address"
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-500 text-gray-900 dark:text-white text-sm h-10"
              />
            </div>
          </div>

          {/* Read-only Fields */}
          <div className="space-y-3">
            {/* Role - Read Only */}
            <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Account Role
                </span>
              </div>
              <Badge variant="secondary" className="capitalize">
                {editForm.role}
              </Badge>
            </div>

            {/* Email Verification Status */}
            <div className="flex items-center space-x-2 p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <Switch
                id="email-verified"
                checked={editForm.isEmailVerified}
                disabled
                className="cursor-not-allowed data-[state=checked]:bg-gray-400 h-4 w-7"
              />
              <Label
                htmlFor="email-verified"
                className="cursor-not-allowed text-gray-700 dark:text-gray-300 text-sm"
              >
                Email Verified: {editForm.isEmailVerified ? "Yes" : "No"}
              </Label>
            </div>
          </div>

          {/* Security Note */}
          <div className="p-3 border border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 flex items-start gap-2">
              <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Security Note:</strong> You can only update your
                personal information. Email and role changes require
                administrative approval for security reasons.
              </span>
            </p>
          </div>
        </div>

        <DialogFooter className="px-4 sm:px-6 pb-4 sm:pb-6 gap-2 sm:gap-3">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={saving}
            className="border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm h-10 flex-1 sm:flex-none"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-sm h-10 flex-1 sm:flex-none text-white"
          >
            {saving ? (
              <>
                <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 animate-spin" />
                <span className="text-xs sm:text-sm">Saving...</span>
              </>
            ) : (
              <span className="text-xs sm:text-sm">Save Changes</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Badge component if not available
const Badge = ({ variant = "default", className = "", children }) => {
  const baseStyles =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  const variants = {
    default: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    secondary:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default ProfileEditDialog;
