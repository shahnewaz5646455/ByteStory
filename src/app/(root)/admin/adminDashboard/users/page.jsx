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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MoreHorizontal,
  User,
  Mail,
  Calendar,
  Shield,
  Phone,
  Edit,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  Eye,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Users,
  TrendingUp,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import UserDetailsDialog from "./(modals)/UserDetailsDialog/page";
import EditUserDialog from "./(modals)/EditUserDialog/page";
import DeleteUserDialog from "./(modals)/DeleteUserDialog/page";

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
  
  // New state for features
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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

  useEffect(() => {
    let result = [...users];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(user => 
        user.name?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.phone?.includes(term) ||
        user.address?.toLowerCase().includes(term)
      );
    }
    if (roleFilter !== "all") {
      result = result.filter(user => user.role === roleFilter);
    }
    if (statusFilter !== "all") {
      result = result.filter(user => 
        statusFilter === "verified" ? user.isEmailVerified : !user.isEmailVerified
      );
    }
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
    const colors = {
      admin: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
      user: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
      moderator: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    };

    const icons = {
      admin: <Shield className="h-3 w-3" />,
      user: <User className="h-3 w-3" />,
      moderator: <Shield className="h-3 w-3" />,
    };

    return (
      <Badge className={`flex items-center gap-1 capitalize border ${colors[role]} text-xs px-2 py-1`}>
        {icons[role]}
        {role}
      </Badge>
    );
  };

  const getStatusBadge = (isVerified) => {
    return isVerified ? (
      <Badge className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800 text-xs px-2 py-1">
        <CheckCircle2 className="h-3 w-3" />
        Verified
      </Badge>
    ) : (
      <Badge variant="secondary" className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs px-2 py-1">
        <XCircle className="h-3 w-3" />
        Not Verified
      </Badge>
    );
  };

  const getProviderBadge = (provider) => {
    const colors = {
      credentials: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300",
      google: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800",
      github: "bg-gray-800 text-white dark:bg-gray-700",
    };

    return (
      <Badge className={`capitalize ${colors[provider] || colors.credentials} text-xs px-2 py-1`}>
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

  const stats = {
    total: users.length,
    admins: users.filter(user => user.role === "admin").length,
    verified: users.filter(user => user.isEmailVerified).length,
    recent: users.filter(user => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(user.createdAt) > weekAgo;
    }).length,
  };

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6 px-4 sm:px-0">
        {/* Header Skeleton */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="h-7 sm:h-8 bg-gray-200 dark:bg-gray-700 rounded-xl w-36 sm:w-48 animate-pulse"></div>
            <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 sm:w-64 animate-pulse"></div>
          </div>
          <div className="h-9 sm:h-10 bg-gray-200 dark:bg-gray-700 rounded-xl w-24 sm:w-32 animate-pulse"></div>
        </div>
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded w-12 sm:w-16 animate-pulse"></div>
                  <div className="h-5 sm:h-6 bg-gray-200 dark:bg-gray-700 rounded w-8 sm:w-12 animate-pulse"></div>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
        {/* Content Skeleton */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="space-y-4">
            <div className="h-5 sm:h-6 bg-gray-200 dark:bg-gray-700 rounded w-24 sm:w-32 animate-pulse"></div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 sm:gap-4 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse flex-shrink-0"></div>
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-2 sm:h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                </div>
                <div className="w-12 sm:w-16 h-5 sm:h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse flex-shrink-0"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 sm:h-16 sm:w-16 text-red-500 mx-auto mb-4" />
          <p className="text-base sm:text-lg font-medium text-red-600 mb-2">{error}</p>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4">There was a problem loading the users data.</p>
          <Button onClick={fetchUsers} className="flex items-center gap-2 mx-auto bg-gradient-to-r from-indigo-600 to-purple-600 text-sm sm:text-base">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Section */}
      <div className="flex lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Users Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm sm:text-base">
            Manage all {users.length} users in ByteStory
          </p>
        </div>
        <div>
          <Button 
            onClick={fetchUsers} 
            className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-all duration-200 disabled:opacity-50 cursor-pointer">
            <RefreshCw className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Admins</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.admins}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Verified</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.verified}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">New This Week</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.recent}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters Section */}
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search */}
            <div className="relative sm:col-span-2 lg:col-span-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-sm"
              />
            </div>
            {/* Role Filter */}
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-sm">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className="cursor-pointer" value="all">All Roles</SelectItem>
                <SelectItem className="cursor-pointer" value="user">User</SelectItem>
                <SelectItem className="cursor-pointer" value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-sm">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className="cursor-pointer" value="all">All Status</SelectItem>
                <SelectItem className="cursor-pointer" value="verified">Verified</SelectItem>
                <SelectItem className="cursor-pointer" value="not-verified">Not Verified</SelectItem>
              </SelectContent>
            </Select>
            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-sm">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className="cursor-pointer" value="newest">Newest First</SelectItem>
                <SelectItem className="cursor-pointer" value="oldest">Oldest First</SelectItem>
                <SelectItem className="cursor-pointer" value="name">By Name</SelectItem>
                <SelectItem className="cursor-pointer" value="email">By Email</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Active Filters & Results */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <span>Showing {filteredUsers.length} of {users.length} users</span>
              {(searchTerm || roleFilter !== "all" || statusFilter !== "all") && (
                <Badge 
                  variant="outline" 
                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600 text-xs"
                  onClick={clearFilters}
                >
                  Clear Filters
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <User className="h-4 w-4 sm:h-5 sm:w-5" />
            Users List
            <Badge variant="secondary" className="ml-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs">
              {filteredUsers.length}
            </Badge>
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400 text-sm">
            Manage user accounts, roles, and permissions
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="flex flex-col items-center gap-3">
                <User className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300 dark:text-gray-600" />
                <div>
                  <p className="font-medium text-gray-500 dark:text-gray-400 text-sm sm:text-base">No users found</p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {searchTerm || roleFilter !== "all" || statusFilter !== "all" 
                      ? "Try adjusting your filters" 
                      : "No users in the system"}
                  </p>
                </div>
                {(searchTerm || roleFilter !== "all" || statusFilter !== "all") && (
                  <Button 
                    variant="outline" 
                    onClick={clearFilters}
                    className="border-gray-200 dark:border-gray-600 text-sm"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Desktop Table View - Hidden on mobile */}
              <div className="hidden lg:block rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                  {/* Table Header */}
                  <div className="bg-gray-50 dark:bg-gray-800/50 grid grid-cols-12 gap-4 px-6 py-3 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                    <div className="col-span-4">User Info</div>
                    <div className="col-span-2">Role</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Contact</div>
                    <div className="col-span-1">Joined</div>
                    <div className="col-span-1 text-right">Actions</div>
                  </div>
                  {/* Table Body */}
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredUsers.map((user) => (
                      <div key={user._id} className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        {/* User Info */}
                        <div className="col-span-4">
                          <div className="flex items-center gap-3">
                            {user.avatar?.url ? (
                              <img
                                src={user.avatar.url}
                                alt={user.name}
                                className="h-10 w-10 rounded-full object-cover border-2 border-white dark:border-gray-800 flex-shrink-0"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center border-2 border-white dark:border-gray-800 flex-shrink-0">
                                <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                              </div>
                            )}
                            <div className="flex flex-col min-w-0 flex-1">
                              <span className="font-medium text-gray-900 dark:text-white truncate text-sm">
                                {user.name}
                              </span>
                              <span className="text-gray-600 dark:text-gray-400 truncate text-xs flex items-center gap-1">
                                <Mail className="h-3 w-3 flex-shrink-0" />
                                {user.email}
                              </span>
                            </div>
                          </div>
                        </div>
                        {/* Role */}
                        <div className="col-span-2 flex items-center">
                          {getRoleBadge(user.role)}
                        </div>
                        {/* Status */}
                        <div className="col-span-2 flex items-center">
                          {getStatusBadge(user.isEmailVerified)}
                        </div>
                        {/* Contact */}
                        <div className="col-span-2 flex items-center">
                          <div className="flex flex-col gap-1 text-xs">
                            {user.phone ? (
                              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                <Phone className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">{user.phone}</span>
                              </div>
                            ) : (
                              <span className="text-gray-500 dark:text-gray-500">No phone</span>
                            )}
                          </div>
                        </div>
                        {/* Joined Date */}
                        <div className="col-span-1 flex items-center">
                          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                            <Calendar className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{formatDate(user.createdAt)}</span>
                          </div>
                        </div>
                        {/* Actions */}
                        <div className="col-span-1 flex justify-end items-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                className="h-8 w-8 p-0 opacity-70 hover:opacity-100 transition-opacity hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex-shrink-0"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
                              <DropdownMenuItem 
                                onClick={() => handleViewDetails(user)}
                                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleEdit(user)}
                                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteClick(user)}
                                className="cursor-pointer text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 focus:text-red-600 text-sm"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile Card View - Visible only on mobile */}
              <div className="lg:hidden space-y-3 px-4 sm:px-6 pb-4">
                {filteredUsers.map((user) => (
                  <Card key={user._id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      {/* User Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {user.avatar?.url ? (
                            <img
                              src={user.avatar.url}
                              alt={user.name}
                              className="h-12 w-12 rounded-full object-cover border-2 border-white dark:border-gray-700 flex-shrink-0"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center border-2 border-white dark:border-gray-700 flex-shrink-0">
                              <User className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                          )}
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="font-semibold text-gray-900 dark:text-white truncate text-sm">
                              {user.name}
                            </span>
                            <span className="text-gray-600 dark:text-gray-400 truncate text-xs">
                              {user.email}
                            </span>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              className="h-8 w-8 p-0 -mt-1 -mr-2 flex-shrink-0"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
                            <DropdownMenuItem 
                              onClick={() => handleViewDetails(user)}
                              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleEdit(user)}
                              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(user)}
                              className="cursor-pointer text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 focus:text-red-600 text-sm"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* User Details */}
                      <div className="space-y-2.5">
                        {/* Role & Status */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {getRoleBadge(user.role)}
                          {getStatusBadge(user.isEmailVerified)}
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-1.5 pt-2 border-t border-gray-100 dark:border-gray-700">
                          {user.phone && (
                            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                              <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                              <span>{user.phone}</span>
                            </div>
                          )}
                          {user.address && (
                            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                              <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                              <span className="truncate">{user.address}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                            <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                            <span>Joined {formatDate(user.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <UserDetailsDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        user={selectedUser}
        getRoleBadge={getRoleBadge}
        getStatusBadge={getStatusBadge}
        getProviderBadge={getProviderBadge}
      />

      <EditUserDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        user={selectedUser}
        editForm={editForm}
        setEditForm={setEditForm}
        saving={saving}
        onSave={handleSaveEdit}
      />

      <DeleteUserDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        user={userToDelete}
        deleting={deleting}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}