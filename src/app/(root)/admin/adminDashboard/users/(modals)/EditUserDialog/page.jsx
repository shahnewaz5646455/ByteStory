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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RefreshCw, Edit, AlertCircle } from "lucide-react";

const EditUserDialog = ({
  isOpen,
  onOpenChange,
  user,
  editForm,
  setEditForm,
  saving,
  onSave,
}) => {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95%] sm:max-w-md md:max-w-lg lg:max-w-2xl max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-white text-lg sm:text-xl">
            <Edit className="h-4 w-4 sm:h-5 sm:w-5" />
            Edit User Role
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400 text-sm">
            You can only change the role for {user.name}. Other information is read-only.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-3 sm:gap-6 py-4">
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="name" className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm">Name</Label>
              <Input
                id="name"
                value={editForm.name}
                readOnly
                className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 cursor-not-allowed text-gray-600 dark:text-gray-400 text-sm h-9 sm:h-10"
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm">Email</Label>
              <Input
                id="email"
                type="email"
                value={editForm.email}
                readOnly
                className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 cursor-not-allowed text-gray-600 dark:text-gray-400 text-sm h-9 sm:h-10"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="role" className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm">Role *</Label>
              <Select
                value={editForm.role}
                onValueChange={(value) =>
                  setEditForm({ ...editForm, role: value })
                }
              >
                <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-sm h-9 sm:h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
                  <SelectItem value="user" className="text-sm">User</SelectItem>
                  <SelectItem value="admin" className="text-sm">Admin</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                You can change the user's role
              </p>
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm">Phone</Label>
              <Input
                id="phone"
                value={editForm.phone || "Not provided"}
                readOnly
                className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 cursor-not-allowed text-gray-600 dark:text-gray-400 text-sm h-9 sm:h-10"
              />
            </div>
          </div>
          
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="address" className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm">Address</Label>
            <Input
              id="address"
              value={editForm.address || "Not provided"}
              readOnly
              className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 cursor-not-allowed text-gray-600 dark:text-gray-400 text-sm h-9 sm:h-10"
            />
          </div>
          
          <div className="flex items-center space-x-2 p-2.5 sm:p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <Switch
              id="email-verified"
              checked={editForm.isEmailVerified}
              disabled
              className="cursor-not-allowed data-[state=checked]:bg-gray-400 h-4 w-7 sm:h-5 sm:w-9"
            />
            <Label
              htmlFor="email-verified"
              className="cursor-not-allowed text-gray-700 dark:text-gray-300 text-xs sm:text-sm"
            >
              Email Verified: {editForm.isEmailVerified ? "Yes" : "No"}
            </Label>
          </div>
          
          <div className="p-2.5 sm:p-3 border border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 flex items-start gap-2">
              <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Note:</strong> Only the Role field can be modified.
                Other user information is read-only for security reasons.
              </span>
            </p>
          </div>
        </div>
        
        <DialogFooter className="px-4 sm:px-6 pb-4 sm:pb-6 gap-2 sm:gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
            className="border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm h-9 sm:h-10 flex-1 sm:flex-none cursor-pointer"
          >
            Cancel
          </Button>
          <Button 
            onClick={onSave} 
            disabled={saving}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-sm h-9 sm:h-10 flex-1 sm:flex-none text-white cursor-pointer"
          >
            {saving ? (
              <>
                <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 animate-spin" />
                <span className="text-xs sm:text-sm">Saving...</span>
              </>
            ) : (
              <span className="text-xs sm:text-sm">Save Role Changes</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default EditUserDialog;