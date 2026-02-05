import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useDebounce } from '@/hooks/useDebounce';
import { useToast } from '@/components/ui/use-toast';
import { fetchUsers, permanentlyDeleteUser } from '@/lib/userUtils';
import { useAuth } from '@/contexts/SupabaseAuthContext';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import UserDetailModal from '@/components/UserDetailModal';
import UserEditModal from '@/components/UserEditModal';
import { Users, MoreHorizontal, Eye, Edit, Trash2, CheckCircle, XCircle, ArrowUpDown, ChevronLeft, ChevronRight, Search, ShieldAlert, Loader2, AlertTriangle } from 'lucide-react';

const USERS_PER_PAGE = 10;

const AdminUsersPage = () => {
    const { user: currentUser, isSuperAdmin } = useAuth();
    const { toast } = useToast();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    // eslint-disable-next-line no-unused-vars
    const [error, setError] = useState(null);
    const [totalUsers, setTotalUsers] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const [filters, setFilters] = useState({ role: 'all', status: 'all' });
    const [sort, setSort] = useState({ by: 'created_at', ascending: false });

    const [selectedUser, setSelectedUser] = useState(null);
    const [isDetailModalOpen, setDetailModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const loadUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { users: fetchedUsers, count } = await fetchUsers({
                page: currentPage,
                searchTerm: debouncedSearchTerm,
                filters,
                sort,
            });
            setUsers(fetchedUsers);
            setTotalUsers(count);
        } catch (err) {
            setError('Failed to fetch users. Please try again.');
            toast({ variant: 'destructive', title: 'Error', description: err.message });
        } finally {
            setLoading(false);
        }
    }, [currentPage, debouncedSearchTerm, filters, sort, toast]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const handleSort = (column) => {
        if (sort.by === column) {
            setSort({ ...sort, ascending: !sort.ascending });
        } else {
            setSort({ by: column, ascending: true });
        }
    };

    const handleUserUpdate = (updatedUser) => {
        setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    };

    const handleDelete = async () => {
        if (!selectedUser || selectedUser.id === currentUser.id) {
            toast({ variant: 'destructive', title: 'Action not allowed', description: 'You cannot delete your own account.' });
            return;
        }

        if (!isSuperAdmin) {
            toast({ variant: 'destructive', title: 'Permission Denied', description: 'Only Super Admins can permanently delete users.' });
            return;
        }

        // Extra client-side validation
        if (!selectedUser.email || !selectedUser.id) {
            console.error('Data Error: Missing email or ID', selectedUser);
            toast({ 
                variant: 'destructive', 
                title: 'Data Error', 
                description: 'User data is incomplete. Missing email or ID. Check console for details.' 
            });
            return;
        }

        setIsDeleting(true);
        try {
            console.log('Attempting to delete user:', selectedUser.id, selectedUser.email);
            
            await permanentlyDeleteUser(selectedUser.id, selectedUser.email);
            
            toast({ 
                title: 'User Deleted', 
                description: 'The user and their associated data have been cleaned up.',
                className: "bg-emerald-600 text-white border-none"
            });
            
            // Refresh list
            loadUsers();
            setDeleteAlertOpen(false);
        } catch (err) {
            console.error('Delete error in component:', err);
            toast({ 
                title: 'Deletion Failed', 
                description: err.message || "An unexpected error occurred during deletion.",
                variant: "destructive" 
            });
        } finally {
            setIsDeleting(false);
            setSelectedUser(null);
        }
    };

    const totalPages = Math.ceil(totalUsers / USERS_PER_PAGE);

    const RoleBadge = ({ role }) => (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            role === 'super_admin' ? 'bg-purple-500/20 text-purple-300' : 
            role === 'university_admin' ? 'bg-orange-500/20 text-orange-300' :
            role === 'admin' ? 'bg-blue-500/20 text-blue-300' :
            'bg-slate-500/20 text-slate-300'
        }`}>
            {role ? role.replace(/_/g, ' ') : 'User'}
        </span>
    );

    const StatusBadge = ({ status }) => (
        <span className={`flex items-center text-sm ${status === 'active' ? 'text-green-400' : 'text-gray-400'}`}>
            {status === 'active' ? <CheckCircle className="w-4 h-4 mr-1" /> : <XCircle className="w-4 h-4 mr-1" />}
            {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
        </span>
    );
    
    // Helper to generate specific warning messages
    const getDeleteWarningMessage = (user) => {
        if (!user) return null;
        if (user.role === 'university_admin') {
            return (
                <div className="bg-orange-500/10 border border-orange-500/20 rounded p-3 text-sm text-orange-300 mb-3">
                    <p className="font-bold flex items-center mb-1">
                        <AlertTriangle className="w-3 h-3 mr-1" /> University Admin Detected
                    </p>
                    Deleting this user will <strong>unlink</strong> them from any University Applications they manage. The university application itself will be preserved but will have no assigned admin.
                </div>
            );
        }
        if (user.role === 'student' || user.role === 'lecturer') {
             return (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-3 text-sm text-yellow-300 mb-3">
                    <p className="font-bold flex items-center mb-1">
                        <AlertTriangle className="w-3 h-3 mr-1" /> Academic Records Warning
                    </p>
                    Deleting this user will permanently remove their course enrollments, progress, and assignments.
                </div>
            );
        }
        return null;
    };

    return (
        <>
            <Helmet><title>User Management - Petrolord</title></Helmet>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2 flex items-center"><Users className="w-8 h-8 mr-4" />User Management</h1>
                        <p className="text-xl text-gray-400">View, edit, and manage all users.</p>
                    </div>
                </div>

                <div className="bg-[#1E293B] rounded-lg p-4 mb-6 border border-gray-800 flex flex-col md:flex-row items-center gap-4">
                    <div className="relative w-full md:flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
                        <Input placeholder="Search by name or email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 w-full bg-[#0F172A] border-gray-700 text-white" />
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <Select value={filters.role} onValueChange={value => setFilters(f => ({ ...f, role: value }))}>
                            <SelectTrigger className="w-full md:w-[180px] bg-[#0F172A] border-gray-700 text-white"><SelectValue placeholder="Filter by role" /></SelectTrigger>
                            <SelectContent className="bg-[#1E293B] border-gray-700 text-white">
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="student">Student</SelectItem>
                                <SelectItem value="lecturer">Lecturer</SelectItem>
                                <SelectItem value="university_admin">University Admin</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="super_admin">Super Admin</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={filters.status} onValueChange={value => setFilters(f => ({ ...f, status: value }))}>
                            <SelectTrigger className="w-full md:w-[180px] bg-[#0F172A] border-gray-700 text-white"><SelectValue placeholder="Filter by status" /></SelectTrigger>
                            <SelectContent className="bg-[#1E293B] border-gray-700 text-white">
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="bg-[#1E293B] rounded-lg border border-gray-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-[#0F172A]">
                                <tr>
                                    {['display_name', 'email', 'role', 'status', 'created_at'].map(col => (
                                        <th key={col} className="px-6 py-3 text-left font-semibold text-gray-300">
                                            <button onClick={() => handleSort(col)} className="flex items-center gap-2 hover:text-white transition-colors">
                                                {col.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                <ArrowUpDown className="w-3 h-3 opacity-50" />
                                            </button>
                                        </th>
                                    ))}
                                    <th className="px-6 py-3 text-right font-semibold text-gray-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <tr key={i}><td colSpan="6" className="p-6"><div className="h-4 bg-slate-700 rounded animate-pulse w-full"></div></td></tr>
                                    ))
                                ) : users.length === 0 ? (
                                    <tr><td colSpan="6" className="text-center py-10 text-gray-400">No users found.</td></tr>
                                ) : (
                                    users.map(user => (
                                        <tr key={user.id} className="hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4 text-white font-medium">{user.display_name || 'Unknown'}</td>
                                            <td className="px-6 py-4 text-gray-300">{user.email}</td>
                                            <td className="px-6 py-4"><RoleBadge role={user.role} /></td>
                                            <td className="px-6 py-4"><StatusBadge status={user.status} /></td>
                                            <td className="px-6 py-4 text-gray-300">{new Date(user.created_at).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="hover:bg-slate-700 text-gray-400 hover:text-white">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="bg-[#1E293B] border-slate-700 text-white">
                                                        <DropdownMenuItem className="hover:bg-slate-700 focus:bg-slate-700 cursor-pointer" onClick={() => { setSelectedUser(user); setDetailModalOpen(true); }}>
                                                            <Eye className="mr-2 h-4 w-4" /> View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="hover:bg-slate-700 focus:bg-slate-700 cursor-pointer" onClick={() => { setSelectedUser(user); setEditModalOpen(true); }}>
                                                            <Edit className="mr-2 h-4 w-4" /> Edit User
                                                        </DropdownMenuItem>
                                                        {isSuperAdmin && (
                                                            <DropdownMenuItem 
                                                                onClick={() => { setSelectedUser(user); setDeleteAlertOpen(true); }} 
                                                                disabled={user.id === currentUser.id} 
                                                                className="text-red-400 hover:text-red-300 hover:bg-red-900/20 focus:bg-red-900/20 cursor-pointer"
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" /> Delete Permanently
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div className="flex items-center justify-between mt-6">
                    <span className="text-sm text-gray-400">
                        Page {currentPage} of {totalPages} ({totalUsers} users)
                    </span>
                    <div className="flex items-center gap-2">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                            disabled={currentPage === 1}
                            className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                            disabled={currentPage === totalPages}
                            className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                        >
                            Next <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                </div>

            </motion.div>

            <UserDetailModal 
                user={selectedUser} 
                isOpen={isDetailModalOpen} 
                onClose={() => setDetailModalOpen(false)}
                onEdit={(user) => { setDetailModalOpen(false); setSelectedUser(user); setEditModalOpen(true); }}
            />
            <UserEditModal 
                user={selectedUser} 
                isOpen={isEditModalOpen} 
                onClose={() => setEditModalOpen(false)}
                onSave={handleUserUpdate}
            />

            <AlertDialog open={isDeleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
                <AlertDialogContent className="bg-[#1E293B] border-slate-800 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-red-500 flex items-center">
                             <ShieldAlert className="w-5 h-5 mr-2" />
                             Permanently Delete User?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400">
                            <p className="mb-3">Are you sure you want to permanently delete <strong>{selectedUser?.display_name || selectedUser?.email}</strong>?</p>
                            
                            {getDeleteWarningMessage(selectedUser)}

                            <div className="bg-red-500/10 border border-red-500/20 rounded p-3 text-sm text-red-400">
                                <p className="font-bold flex items-center mb-1">
                                    <Trash2 className="w-3 h-3 mr-1" /> WARNING: Permanent Action
                                </p>
                                This user will be completely removed from the database, including:
                                <ul className="list-disc list-inside mt-1 ml-1 opacity-90">
                                    <li>Authentication credentials</li>
                                    <li>User profile</li>
                                    <li>All dependent records (assignments, logs, etc.)</li>
                                </ul>
                                <p className="mt-2 font-semibold">This action CANNOT be undone.</p>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-4">
                        <AlertDialogCancel className="bg-transparent border-slate-700 hover:bg-slate-800 text-white">Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleDelete} 
                            className="bg-red-600 hover:bg-red-700 text-white border-none"
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Deleting...
                                </>
                            ) : (
                                'Delete Permanently'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default AdminUsersPage;