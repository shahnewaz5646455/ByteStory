"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import {
  MoreHorizontal,
  User,
  Mail,
  Calendar,
  Shield,
  Phone,
  MapPin,
  Image,
  Edit,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  Download,
  Eye,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ChevronDown,
  Users,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    role: "user",
    phone: "",
    address: "",
    isEmailVerified: false,
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // New state for enhanced features
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Format date without date-fns
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

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

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log("Fetching users...");
      const response = await fetch("/api/admin/users");
      const data = await response.json();
      console.log("API Response:", data);
      if (data.success) {
        setUsers(data.users);
        setFilteredUsers(data.users);
      } else {
        setError(data.error || "Failed to fetch users");
      }
    } catch (err) {
      setError("Failed to fetch users");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter and sort users
  useEffect(() => {
    let result = [...users];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (user) =>
          user.name?.toLowerCase().includes(term) ||
          user.email?.toLowerCase().includes(term) ||
          user.phone?.includes(term) ||
          user.address?.toLowerCase().includes(term)
      );
    }

    // Apply role filter
    if (roleFilter !== "all") {
      result = result.filter((user) => user.role === roleFilter);
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((user) =>
        statusFilter === "verified"
          ? user.isEmailVerified
          : !user.isEmailVerified
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "name":
          return (a.name || "").localeCompare(b.name || "");
        case "email":
          return (a.email || "").localeCompare(b.email || "");
        default:
          return 0;
      }
    });

    setFilteredUsers(result);
  }, [users, searchTerm, roleFilter, statusFilter, sortBy]);

  const getRoleBadge = (role) => {
    const variants = {
      admin: "destructive",
      user: "default",
      moderator: "secondary",
    };

    const colors = {
      admin:
        "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
      user: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
      moderator:
        "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    };

    const icons = {
      admin: <Shield className="h-3 w-3" />,
      user: <User className="h-3 w-3" />,
      moderator: <Shield className="h-3 w-3" />,
    };

    return (
      <Badge
        className={`flex items-center gap-1 capitalize border ${colors[role]}`}
      >
        {icons[role]}
        {role}
      </Badge>
    );
  };

  const getStatusBadge = (isVerified) => {
    return isVerified ? (
      <Badge className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
        <CheckCircle2 className="h-3 w-3" />
        Verified
      </Badge>
    ) : (
      <Badge
        variant="secondary"
        className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
      >
        <XCircle className="h-3 w-3" />
        Not Verified
      </Badge>
    );
  };

  const getProviderBadge = (provider) => {
    const colors = {
      credentials:
        "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300",
      google:
        "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800",
      github: "bg-gray-800 text-white dark:bg-gray-700",
    };

    return (
      <Badge className={`capitalize ${colors[provider] || colors.credentials}`}>
        {provider}
      </Badge>
    );
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleEdit = (user) => {
    setEditForm({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "user",
      phone: user.phone || "",
      address: user.address || "",
      isEmailVerified: user.isEmailVerified || false,
    });
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedUser) return;

    try {
      setSaving(true);
      const response = await fetch(`/api/admin/users?id=${selectedUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("User updated successfully");
        setIsEditDialogOpen(false);
        fetchUsers();
      } else {
        toast.error(data.error || "Failed to update user");
      }
    } catch (err) {
      toast.error("Failed to update user");
      console.error("Error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      setDeleting(true);
      console.log("Deleting user:", userToDelete._id);

      const response = await fetch(`/api/admin/users?id=${userToDelete._id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast.success("User deleted successfully");
        setIsDeleteDialogOpen(false);
        setUserToDelete(null);
        fetchUsers();
      } else {
        toast.error(data.error || "Failed to delete user");
      }
    } catch (err) {
      toast.error("Failed to delete user");
      console.error("Error:", err);
    } finally {
      setDeleting(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setRoleFilter("all");
    setStatusFilter("all");
    setSortBy("newest");
  };

  // Stats calculation
  const stats = {
    total: users.length,
    admins: users.filter((user) => user.role === "admin").length,
    verified: users.filter((user) => user.isEmailVerified).length,
    recent: users.filter((user) => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(user.createdAt) > weekAgo;
    }).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900/20 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Skeleton */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-xl w-48 animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 animate-pulse"></div>
            </div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl w-32 animate-pulse"></div>
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-12 animate-pulse"></div>
                  </div>
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Table Skeleton */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 py-4 border-b border-gray-200 dark:border-gray-700"
                >
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                  </div>
                  <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900/20 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center max-w-md">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <p className="text-lg font-medium text-red-600 mb-2">{error}</p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                There was a problem loading the users data.
              </p>
              <Button
                onClick={fetchUsers}
                className="flex items-center gap-2 mx-auto bg-gradient-to-r from-indigo-600 to-purple-600"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Users Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage all {users.length} users in ByteStory
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={fetchUsers}
            className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Users
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.total}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Admins
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.admins}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Verified
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.verified}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  New This Week
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.recent}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters Section */}
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600"
              />
            </div>

            {/* Role Filter */}
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="not-verified">Not Verified</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="name">By Name</SelectItem>
                <SelectItem value="email">By Email</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters & Results */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>
                Showing {filteredUsers.length} of {users.length} users
              </span>
              {(searchTerm ||
                roleFilter !== "all" ||
                statusFilter !== "all") && (
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600"
                  onClick={clearFilters}
                >
                  Clear Filters
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Users List
            <Badge
              variant="secondary"
              className="ml-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
            >
              {filteredUsers.length}
            </Badge>
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Manage user accounts, roles, and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
                  <TableRow className="border-gray-200 dark:border-gray-700">
                    <TableHead className="w-[300px] font-semibold text-gray-900 dark:text-white">
                      User Info
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900 dark:text-white">
                      Role
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900 dark:text-white">
                      Status
                    </TableHead>
                    <TableHead className="hidden lg:table-cell font-semibold text-gray-900 dark:text-white">
                      Contact
                    </TableHead>
                    <TableHead className="hidden md:table-cell font-semibold text-gray-900 dark:text-white">
                      Joined
                    </TableHead>
                    <TableHead className="w-[80px] font-semibold text-gray-900 dark:text-white">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <div className="flex flex-col items-center gap-3">
                          <User className="h-12 w-12 text-gray-300 dark:text-gray-600" />
                          <div>
                            <p className="font-medium text-gray-500 dark:text-gray-400">
                              No users found
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {searchTerm ||
                              roleFilter !== "all" ||
                              statusFilter !== "all"
                                ? "Try adjusting your filters"
                                : "No users in the system"}
                            </p>
                          </div>
                          {(searchTerm ||
                            roleFilter !== "all" ||
                            statusFilter !== "all") && (
                            <Button
                              variant="outline"
                              onClick={clearFilters}
                              className="border-gray-200 dark:border-gray-600"
                            >
                              Clear Filters
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow
                        key={user._id}
                        className="group hover:bg-gray-50 dark:hover:bg-gray-700/50 border-gray-200 dark:border-gray-700"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {user.avatar?.url ? (
                              <img
                                src={user.avatar.url}
                                alt={user.name}
                                className="h-10 w-10 rounded-full object-cover border-2 border-white dark:border-gray-800 group-hover:border-gray-100 dark:group-hover:border-gray-600 transition-colors"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center border-2 border-white dark:border-gray-800 group-hover:border-gray-100 dark:group-hover:border-gray-600 transition-colors">
                                <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                              </div>
                            )}
                            <div className="flex flex-col min-w-0">
                              <span className="font-medium text-gray-900 dark:text-white truncate">
                                {user.name}
                              </span>
                              <span className="text-sm text-gray-600 dark:text-gray-400 truncate flex items-center gap-1">
                                <Mail className="h-3 w-3 flex-shrink-0" />
                                {user.email}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell>
                          {getStatusBadge(user.isEmailVerified)}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex flex-col gap-1 text-sm">
                            {user.phone ? (
                              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                <Phone className="h-3 w-3" />
                                <span className="truncate">{user.phone}</span>
                              </div>
                            ) : (
                              <span className="text-gray-500 dark:text-gray-500 text-xs">
                                No phone
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Calendar className="h-3 w-3" />
                            {formatDate(user.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 opacity-70 group-hover:opacity-100 transition-opacity hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-48 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700"
                            >
                              <DropdownMenuItem
                                onClick={() => handleViewDetails(user)}
                                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleEdit(user)}
                                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteClick(user)}
                                className="cursor-pointer text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 focus:text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
          {selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  User Details
                </DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-400">
                  Complete information about {selectedUser.name}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-6 py-4">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                  {selectedUser.avatar?.url ? (
                    <img
                      src={selectedUser.avatar.url}
                      alt={selectedUser.name}
                      className="h-16 w-16 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-sm"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-sm">
                      <User className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white truncate">
                      {selectedUser.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2 truncate">
                      <Mail className="h-4 w-4 flex-shrink-0" />
                      {selectedUser.email}
                    </p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {getRoleBadge(selectedUser.role)}
                      {getStatusBadge(selectedUser.isEmailVerified)}
                      {getProviderBadge(selectedUser.provider)}
                    </div>
                  </div>
                </div>

                {/* Grid Layout for Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Email Verified
                        </span>
                        {selectedUser.isEmailVerified ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Joined
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {formatFullDate(selectedUser.createdAt)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Last Updated
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDateTime(selectedUser.updatedAt)}
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
                          <span className="text-sm font-medium block text-gray-700 dark:text-gray-300">
                            Phone
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {selectedUser.phone || "Not provided"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 py-2">
                        <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div className="flex-1">
                          <span className="text-sm font-medium block text-gray-700 dark:text-gray-300">
                            Address
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {selectedUser.address || "Not provided"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Avatar Information */}
                {selectedUser.avatar?.public_id && (
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
                          <span className="text-sm font-medium block text-gray-700 dark:text-gray-300">
                            Public ID
                          </span>
                          <code className="text-xs text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded border border-gray-200 dark:border-gray-700">
                            {selectedUser.avatar.public_id}
                          </code>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
          {selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Edit className="h-5 w-5" />
                  Edit User Role
                </DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-400">
                  You can only change the role for {selectedUser.name}. Other
                  information is read-only.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={editForm.name}
                      readOnly
                      className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 cursor-not-allowed text-gray-600 dark:text-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={editForm.email}
                      readOnly
                      className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 cursor-not-allowed text-gray-600 dark:text-gray-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="role"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      Role *
                    </Label>
                    <Select
                      value={editForm.role}
                      onValueChange={(value) =>
                        setEditForm({ ...editForm, role: value })
                      }
                    >
                      <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="moderator">Moderator</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      You can change the user's role
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      value={editForm.phone || "Not provided"}
                      readOnly
                      className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 cursor-not-allowed text-gray-600 dark:text-gray-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="address"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    Address
                  </Label>
                  <Input
                    id="address"
                    value={editForm.address || "Not provided"}
                    readOnly
                    className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 cursor-not-allowed text-gray-600 dark:text-gray-400"
                  />
                </div>

                <div className="flex items-center space-x-2 p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <Switch
                    id="email-verified"
                    checked={editForm.isEmailVerified}
                    disabled
                    className="cursor-not-allowed data-[state=checked]:bg-gray-400"
                  />
                  <Label
                    htmlFor="email-verified"
                    className="cursor-not-allowed text-gray-700 dark:text-gray-300"
                  >
                    Email Verified: {editForm.isEmailVerified ? "Yes" : "No"}
                  </Label>
                </div>

                <div className="p-3 border border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <p className="text-sm text-blue-700 dark:text-blue-300 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Note:</strong> Only the Role field can be
                      modified. Other user information is read-only for security
                      reasons.
                    </span>
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  className="border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveEdit}
                  disabled={saving}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Role Changes"
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
          <AlertDialogHeader>
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <AlertDialogTitle className="text-gray-900 dark:text-white">
                Are you sure?
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
              This action will permanently delete the user account for{" "}
              <strong>{userToDelete?.name}</strong> ({userToDelete?.email}).
              This action cannot be undone and may affect related data in the
              system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleting}
              className="border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {deleting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete User"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
