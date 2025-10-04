"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RefreshCw, AlertCircle } from "lucide-react";

const DeleteUserDialog = ({
  isOpen,
  onOpenChange,
  user,
  deleting,
  onConfirm,
}) => {
  if (!user) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-[95%] sm:max-w-md md:max-w-lg lg:max-w-2xl max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
        <AlertDialogHeader>
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
            <AlertDialogTitle className="text-gray-900 dark:text-white text-base sm:text-lg">
              Are you sure?
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm px-0 text-start">
            This action will permanently delete the user account for{" "}
            <strong className="break-words">{user?.name}</strong> ({user?.email}). 
            This action cannot be undone and may affect related data in the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="px-4 sm:px-6 pb-4 sm:pb-6 gap-2 sm:gap-3">
          <AlertDialogCancel 
            disabled={deleting}
            className="border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm h-9 sm:h-10 flex-1 sm:flex-none order-2 sm:order-1 cursor-pointer"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={deleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600 text-sm h-9 sm:h-10 text-white flex-1 sm:flex-none order-1 sm:order-2 cursor-pointer"
          >
            {deleting ? (
              <>
                <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 animate-spin" />
                <span className="text-xs sm:text-sm">Deleting...</span>
              </>
            ) : (
              <span className="text-xs sm:text-sm">Delete User</span>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default DeleteUserDialog;