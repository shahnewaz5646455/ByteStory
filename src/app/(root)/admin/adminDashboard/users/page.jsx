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
} from "lucide-react";
import { toast } from "sonner";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
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

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/users");
      const data = await response.json();

      if (data.success) {
        setUsers(data.users);
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

  const getRoleBadge = (role) => {
    const variants = {
      admin: "destructive",
      user: "default",
    };

    return <Badge variant={variants[role]}>{role}</Badge>;
  };

  const getProviderBadge = (provider) => {
    const variants = {
      credentials: "secondary",
      google: "outline",
    };

    return (
      <Badge variant={variants[provider] || "default"} className="capitalize">
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

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchUsers}>Retry</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Users Management
          </h1>
          <p className="text-muted-foreground">
            Manage all users in your ByteStore application
          </p>
        </div>
        <Button onClick={fetchUsers}>Refresh</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            All Users ({users.length})
          </CardTitle>
          <CardDescription>
            View and manage user accounts and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User Info</TableHead>
                <TableHead>Role</TableHead>
                {/* <TableHead>Email Status</TableHead> */}
                {/* <TableHead>Provider</TableHead> */}
                <TableHead>Contact</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {user.avatar?.url ? (
                          <img
                            src={user.avatar.url}
                            alt={user.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                            <User className="h-5 w-5" />
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="font-medium">{user.name}</span>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        {getRoleBadge(user.role)}
                      </div>
                    </TableCell>
                    {/* <TableCell>
                      <Badge
                        variant={user.isEmailVerified ? "default" : "secondary"}
                      >
                        {user.isEmailVerified ? "Verified" : "Not Verified"}
                      </Badge>
                    </TableCell> */}
                    {/* <TableCell>{getProviderBadge(user.provider)}</TableCell> */}
                    <TableCell>
                      <div className="flex flex-col gap-1 text-sm">
                        {user.phone && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {user.phone}
                          </div>
                        )}
                        {user.address && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate max-w-[120px]">
                              {user.address}
                            </span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(user.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleViewDetails(user)}
                          >
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(user)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(user)}
                            className="text-red-600"
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
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          {selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle>User Details</DialogTitle>
                <DialogDescription>
                  Complete information about {selectedUser.name}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-6 py-4">
                <div className="flex items-center gap-4">
                  {selectedUser.avatar?.url ? (
                    <img
                      src={selectedUser.avatar.url}
                      alt={selectedUser.name}
                      className="h-20 w-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-8 w-8" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-semibold">
                      {selectedUser.name}
                    </h3>
                    <p className="text-muted-foreground flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {selectedUser.email}
                    </p>
                    <div className="flex gap-2 mt-2">
                      {getRoleBadge(selectedUser.role)}
                      {getProviderBadge(selectedUser.provider)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Account Information</h4>
                    <div className="text-sm">
                      <p>
                        <strong>Email Verified:</strong>{" "}
                        {selectedUser.isEmailVerified ? "Yes" : "No"}
                      </p>
                      <p>
                        <strong>Joined:</strong>{" "}
                        {formatFullDate(selectedUser.createdAt)}
                      </p>
                      <p>
                        <strong>Last Updated:</strong>{" "}
                        {formatFullDate(selectedUser.updatedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Contact Information</h4>
                    <div className="text-sm">
                      {selectedUser.phone ? (
                        <p className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <strong>Phone:</strong> {selectedUser.phone}
                        </p>
                      ) : (
                        <p className="text-muted-foreground">No phone number</p>
                      )}
                      {selectedUser.address ? (
                        <p className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <strong>Address:</strong> {selectedUser.address}
                        </p>
                      ) : (
                        <p className="text-muted-foreground">No address</p>
                      )}
                    </div>
                  </div>
                </div>

                {selectedUser.avatar?.public_id && (
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <Image className="h-4 w-4" />
                      Avatar Information
                    </h4>
                    <div className="text-sm">
                      <p>
                        <strong>Public ID:</strong>{" "}
                        {selectedUser.avatar.public_id}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          {selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle>Edit User Role</DialogTitle>
                <DialogDescription>
                  You can only change the role for {selectedUser.name}. Other
                  information is read-only.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={editForm.name}
                      readOnly
                      className="bg-muted cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editForm.email}
                      readOnly
                      className="bg-muted cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role *</Label>
                    <Select
                      value={editForm.role}
                      onValueChange={(value) =>
                        setEditForm({ ...editForm, role: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      You can change the user's role
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={editForm.phone || "Not provided"}
                      readOnly
                      className="bg-muted cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={editForm.address || "Not provided"}
                    readOnly
                    className="bg-muted cursor-not-allowed"
                  />
                </div>

                <div className="flex items-center space-x-2 p-3 border rounded-lg bg-muted">
                  <Switch
                    id="email-verified"
                    checked={editForm.isEmailVerified}
                    disabled
                    className="cursor-not-allowed"
                  />
                  <Label
                    htmlFor="email-verified"
                    className="cursor-not-allowed"
                  >
                    Email Verified: {editForm.isEmailVerified ? "Yes" : "No"}
                  </Label>
                </div>

                <div className="p-3 border rounded-lg bg-blue-50">
                  <p className="text-sm text-blue-700">
                    <strong>Note:</strong> Only the Role field can be modified.
                    Other user information is read-only for security reasons.
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit} disabled={saving}>
                  {saving ? "Saving..." : "Save Role Changes"}
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will delete the user account for{" "}
              <strong>{userToDelete?.name}</strong> ({userToDelete?.email}).
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? "Deleting..." : "Delete User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
