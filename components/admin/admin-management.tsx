"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Plus, Edit, Trash2, Shield, Mail, User, Key, DollarSign } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const adminSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string().min(8, { message: "Confirm password is required." }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

const editAdminSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
}).refine((data) => !data.password || data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type AdminFormValues = z.infer<typeof adminSchema>
type EditAdminFormValues = z.infer<typeof editAdminSchema>

interface Admin {
  id: string
  name: string
  email: string
  username: string
  currency: string
  account_status: string
  active: boolean
  created_at: string
  updated_at: string
}

export function AdminManagement() {
  const { toast } = useToast()
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null)

  const addForm = useForm<AdminFormValues>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const editForm = useForm<EditAdminFormValues>({
    resolver: zodResolver(editAdminSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  // Fetch admins
  const fetchAdmins = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/settings/admins")
      
      if (response.ok) {
        const data = await response.json()
        setAdmins(data.admins)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch admin users",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching admins:", error)
      toast({
        title: "Error",
        description: "Failed to fetch admin users",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdmins()
  }, [])

  // Add admin
  const onAddSubmit = async (data: AdminFormValues) => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/settings/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Admin user created successfully",
        })
        setIsAddDialogOpen(false)
        addForm.reset()
        fetchAdmins()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create admin user",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating admin:", error)
      toast({
        title: "Error",
        description: "Failed to create admin user",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Edit admin
  const onEditSubmit = async (data: EditAdminFormValues) => {
    if (!selectedAdmin) return

    try {
      setLoading(true)
      const updateData = {
        ...data,
        password: data.password || undefined, // Only send password if provided
      }

      const response = await fetch(`/api/admin/settings/admins/${selectedAdmin.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      })

      const result = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Admin user updated successfully",
        })
        setIsEditDialogOpen(false)
        setSelectedAdmin(null)
        editForm.reset()
        fetchAdmins()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update admin user",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating admin:", error)
      toast({
        title: "Error",
        description: "Failed to update admin user",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Delete admin
  const onDeleteConfirm = async () => {
    if (!selectedAdmin) return

    try {
      setLoading(true)
      const response = await fetch(`/api/admin/settings/admins/${selectedAdmin.id}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Admin user deleted successfully",
        })
        setIsDeleteDialogOpen(false)
        setSelectedAdmin(null)
        fetchAdmins()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete admin user",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting admin:", error)
      toast({
        title: "Error",
        description: "Failed to delete admin user",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Open edit dialog
  const handleEdit = (admin: Admin) => {
    setSelectedAdmin(admin)
    editForm.reset({
      email: admin.email,
      password: "",
      confirmPassword: "",
    })
    setIsEditDialogOpen(true)
  }

  // Open delete dialog
  const handleDelete = (admin: Admin) => {
    setSelectedAdmin(admin)
    setIsDeleteDialogOpen(true)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Admin Users Management
            </CardTitle>
            <CardDescription>
              Manage admin users who have full access to the system
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Admin
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Admin User</DialogTitle>
                <DialogDescription>
                  Create a new admin user with full system access
                </DialogDescription>
              </DialogHeader>
              <Form {...addForm}>
                <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-4">
                  <FormField
                    control={addForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input type="email" placeholder="admin@example.com" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input type="password" placeholder="••••••••" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Minimum 8 characters
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input type="password" placeholder="••••••••" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Creating..." : "Create Admin"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading && admins.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading admin users...
          </div>
        ) : admins.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No admin users found
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell className="font-medium">{admin.name}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{admin.username}</TableCell>
                  <TableCell>{admin.currency}</TableCell>
                  <TableCell>
                    <Badge variant={admin.active ? "default" : "secondary"}>
                      {admin.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(admin.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(admin)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(admin)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Admin User</DialogTitle>
              <DialogDescription>
                Update admin user credentials and information
              </DialogDescription>
            </DialogHeader>
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                <FormField
                  control={editForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input type="email" placeholder="admin@example.com" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password (Optional)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input type="password" placeholder="Leave empty to keep current" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Leave empty to keep current password
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input type="password" placeholder="Leave empty to keep current" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Update Admin"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the admin user <strong>{selectedAdmin?.name}</strong>.
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDeleteConfirm}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {loading ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}
