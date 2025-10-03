"use client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Image,
    CheckCircle2,
    XCircle,
} from "lucide-react";

const UserDetailsDialog = ({
    isOpen,
    onOpenChange,
    user,
    getRoleBadge,
    getStatusBadge,
    getProviderBadge,
}) => {
    if (!user) return null;

    const formatFullDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long",
        });
    };

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95%] sm:max-w-md md:max-w-lg lg:max-w-2xl max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-white text-lg sm:text-xl">
                        User Details
                    </DialogTitle>
                    <DialogDescription className="text-gray-600 dark:text-gray-400 text-sm text-start">
                        Complete information about {user.name}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 sm:gap-6 py-4">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                        {user.avatar?.url ? (
                            <img
                                src={user.avatar.url}
                                alt={user.name}
                                className="h-14 w-14 sm:h-16 sm:w-16 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-sm"
                            />
                        ) : (
                            <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-sm">
                                <User className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600 dark:text-indigo-400" />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate">
                                {user.name}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2 truncate text-sm sm:text-base">
                                <Mail className="h-4 w-4 flex-shrink-0" />
                                {user.email}
                            </p>
                            <div className="flex gap-2 mt-2 flex-wrap">
                                {getRoleBadge(user.role)}
                                {getStatusBadge(user.isEmailVerified)}
                                {getProviderBadge(user.provider)}
                            </div>
                        </div>
                    </div>

                    {/* Grid Layout for Details */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        {/* Account Information */}
                        <Card className="bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-900 dark:text-white">
                                    <User className="h-4 w-4" />
                                    Account Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Verified</span>
                                    {user.isEmailVerified ? (
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    ) : (
                                        <XCircle className="h-4 w-4 text-red-600" />
                                    )}
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Joined</span>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {formatFullDate(user.createdAt)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Updated</span>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {formatDateTime(user.updatedAt)}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contact Information */}
                        <Card className="bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-900 dark:text-white">
                                    <Phone className="h-4 w-4" />
                                    Contact Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center gap-3 py-2 border-b border-gray-200 dark:border-gray-700">
                                    <Phone className="h-4 w-4 text-gray-500" />
                                    <div className="flex-1">
                                        <span className="text-sm font-medium block text-gray-700 dark:text-gray-300">Phone</span>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {user.phone || "Not provided"}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 py-2">
                                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                                    <div className="flex-1">
                                        <span className="text-sm font-medium block text-gray-700 dark:text-gray-300">Address</span>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {user.address || "Not provided"}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Avatar Information */}
                    {user.avatar?.public_id && (
                        <Card className="bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-900 dark:text-white">
                                    <Image className="h-4 w-4" />
                                    Avatar Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <Image className="h-4 w-4 text-gray-500" />
                                    <div className="flex-1">
                                        <span className="text-sm font-medium block text-gray-700 dark:text-gray-300">Public ID</span>
                                        <code className="text-xs text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded border border-gray-200 dark:border-gray-700 break-all">
                                            {user.avatar.public_id}
                                        </code>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default UserDetailsDialog;