import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
    MessageSquare, Pin, Check, X, Filter, Search, SortAsc, 
    User, Calendar, Trash2, Edit2, Plus, Loader2
} from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { logAuditAction } from '../../utils/auditLogger';
import AddCommentModal from '../modals/AddCommentModal';
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

const CommentsPanel = ({ 
    layoutId, 
    onCreateCommentMode, 
    activePinLocation, 
    onPinPlaced, 
    comments = [], // Received from parent
    refreshComments 
}) => {
    const { toast } = useToast();
    const [currentUser, setCurrentUser] = useState(null);

    // Filters & Sort State
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterPriority, setFilterPriority] = useState('All');
    const [sortBy, setSortBy] = useState('newest'); // newest, oldest, priority

    // Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [loadingAction, setLoadingAction] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setCurrentUser(data.user));
    }, []);

    // Open modal automatically if a pin is placed
    useEffect(() => {
        if (activePinLocation) {
            setIsAddModalOpen(true);
        }
    }, [activePinLocation]);

    const handleCreateComment = async (commentData) => {
        try {
            const { error } = await supabase.from('facility_layout_comments').insert({
                layout_id: layoutId,
                user_id: currentUser.id,
                content: commentData.content,
                lat: commentData.lat,
                lng: commentData.lng,
                priority: commentData.priority,
                assigned_to: commentData.assigned_to,
                status: 'Open'
            });

            if (error) throw error;
            
            await logAuditAction(layoutId, 'ADD_COMMENT', { priority: commentData.priority });
            
            toast({ title: 'Success', description: 'Comment added successfully.' });
            onPinPlaced(null); // Clear pin
            refreshComments(); // Trigger parent refresh
        } catch (error) {
            throw error;
        }
    };

    const handleDeleteClick = (id) => {
        setCommentToDelete(id);
    };

    const confirmDelete = async () => {
        if (!commentToDelete) return;
        
        setLoadingAction(true);
        const { error } = await supabase.from('facility_layout_comments').delete().eq('id', commentToDelete);
        if (error) {
            toast({ title: 'Error', description: 'Failed to delete comment', variant: 'destructive' });
        } else {
            toast({ title: 'Deleted', description: 'Comment removed.' });
            refreshComments();
        }
        setLoadingAction(false);
        setCommentToDelete(null);
    };

    const handleResolveToggle = async (id, currentStatus) => {
        const newStatus = currentStatus === 'Resolved' ? 'Open' : 'Resolved';
        const updates = {
            status: newStatus,
            resolved_by: newStatus === 'Resolved' ? currentUser.id : null,
            resolved_at: newStatus === 'Resolved' ? new Date().toISOString() : null
        };
        
        const { error } = await supabase.from('facility_layout_comments').update(updates).eq('id', id);
        
        if (error) {
             toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
        } else {
             refreshComments();
        }
    };

    // --- Filtering & Sorting ---
    const getFilteredComments = () => {
        let filtered = [...comments];

        // Search
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            filtered = filtered.filter(c => c.content.toLowerCase().includes(lower) || c.creator?.display_name?.toLowerCase().includes(lower));
        }

        // Status Filter
        if (filterStatus !== 'All') {
            filtered = filtered.filter(c => c.status === filterStatus);
        }

        // Priority Filter
        if (filterPriority !== 'All') {
            filtered = filtered.filter(c => c.priority === filterPriority);
        }

        // Sorting
        filtered.sort((a, b) => {
            if (sortBy === 'newest') return new Date(b.created_at) - new Date(a.created_at);
            if (sortBy === 'oldest') return new Date(a.created_at) - new Date(b.created_at);
            if (sortBy === 'priority') {
                const pMap = { High: 3, Medium: 2, Low: 1 };
                return (pMap[b.priority] || 0) - (pMap[a.priority] || 0);
            }
            return 0;
        });

        return filtered;
    };

    const displayComments = getFilteredComments();

    const getPriorityBadge = (p) => {
        const styles = {
            High: 'bg-red-900/40 text-red-400 border-red-700 hover:bg-red-900/60',
            Medium: 'bg-yellow-900/40 text-yellow-400 border-yellow-700 hover:bg-yellow-900/60',
            Low: 'bg-green-900/40 text-green-400 border-green-700 hover:bg-green-900/60'
        };
        return <Badge variant="outline" className={`${styles[p] || styles.Medium} text-[10px] px-1.5`}>{p}</Badge>;
    };

    return (
        <div className="flex flex-col h-full bg-[#1a1a1a] border-l border-[#333333]">
             {/* Header */}
             <div className="p-3 border-b border-[#333333] flex items-center justify-between shrink-0">
                <h3 className="font-semibold text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-400" />
                    Comments
                </h3>
                <div className="flex gap-2">
                    <Button 
                        size="sm" 
                        variant="default" 
                        className="h-7 text-xs bg-blue-600 hover:bg-blue-700 px-2"
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        <Plus className="w-3.5 h-3.5 mr-1" /> Add
                    </Button>
                </div>
            </div>

            {/* Filters Toolbar */}
            <div className="p-3 border-b border-[#333333] space-y-3 bg-[#161b22]">
                <div className="relative">
                    <Search className="absolute left-2 top-1.5 w-3.5 h-3.5 text-slate-500" />
                    <Input 
                        placeholder="Search comments..." 
                        className="h-7 text-xs pl-8 bg-slate-900 border-slate-700"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="flex gap-2">
                     <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="h-6 flex-1 text-[10px] bg-slate-900 border-slate-700">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700 text-white">
                            <SelectItem value="All">All Status</SelectItem>
                            <SelectItem value="Open">Open</SelectItem>
                            <SelectItem value="Resolved">Resolved</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={filterPriority} onValueChange={setFilterPriority}>
                        <SelectTrigger className="h-6 flex-1 text-[10px] bg-slate-900 border-slate-700">
                            <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700 text-white">
                            <SelectItem value="All">All Priorities</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Low">Low</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500">
                     <span className="flex items-center gap-1">
                        <Filter className="w-3 h-3" /> {displayComments.length} items
                     </span>
                     <div className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors select-none" onClick={() => {
                         const next = sortBy === 'newest' ? 'oldest' : sortBy === 'oldest' ? 'priority' : 'newest';
                         setSortBy(next);
                     }}>
                        <SortAsc className="w-3 h-3" /> {sortBy === 'newest' ? 'Newest' : sortBy === 'oldest' ? 'Oldest' : 'Priority'}
                     </div>
                </div>
            </div>

            {/* List */}
            <ScrollArea className="flex-1 p-3">
                <div className="space-y-3">
                    {displayComments.length === 0 && (
                        <div className="text-center text-slate-500 py-8 text-xs border border-dashed border-slate-800 rounded-lg">
                            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-20" />
                            No comments found.
                        </div>
                    )}

                    {displayComments.map(comment => (
                        <div key={comment.id} className={`p-3 rounded-lg border group transition-all hover:border-slate-600 ${
                            comment.status === 'Resolved' ? 'bg-slate-900/30 border-slate-800 opacity-60' : 'bg-[#1e2430] border-slate-700'
                        }`}>
                            {/* Card Header */}
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-300">
                                        {comment.creator?.display_name?.substring(0,2).toUpperCase() || 'U'}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-semibold text-slate-200 leading-none">
                                            {comment.creator?.display_name || 'Unknown User'}
                                        </span>
                                        <span className="text-[9px] text-slate-500">
                                            {formatDistanceToNow(new Date(comment.created_at))} ago
                                        </span>
                                    </div>
                                </div>
                                {getPriorityBadge(comment.priority)}
                            </div>

                            {/* Content */}
                            <p className="text-xs text-slate-300 mb-2 leading-relaxed whitespace-pre-wrap break-words">
                                {comment.content}
                            </p>

                            {/* Meta & Actions */}
                            <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-slate-700/50">
                                <div className="flex justify-between items-center text-[10px] text-slate-400">
                                     {comment.lat ? (
                                        <span className="flex items-center gap-1 text-blue-400 bg-blue-950/30 px-1.5 py-0.5 rounded cursor-help" title={`Lat: ${comment.lat.toFixed(4)}, Lng: ${comment.lng.toFixed(4)}`}>
                                            <Pin className="w-3 h-3" /> Location
                                        </span>
                                     ) : (
                                        <span></span>
                                     )}
                                     
                                     {comment.assignee && (
                                         <span className="flex items-center gap-1" title="Assigned To">
                                            <User className="w-3 h-3" /> {comment.assignee.display_name}
                                         </span>
                                     )}
                                </div>

                                <div className="flex justify-between items-center mt-1">
                                    <div className="flex items-center gap-2">
                                        <Checkbox 
                                            id={`resolved-${comment.id}`} 
                                            checked={comment.status === 'Resolved'}
                                            onCheckedChange={() => handleResolveToggle(comment.id, comment.status)}
                                            className="w-3.5 h-3.5 border-slate-500 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                                        />
                                        <label htmlFor={`resolved-${comment.id}`} className="text-[10px] text-slate-400 cursor-pointer select-none">
                                            Resolved
                                        </label>
                                    </div>

                                    {(currentUser?.id === comment.user_id) && (
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-5 w-5 hover:text-red-400 hover:bg-red-950/30" onClick={() => handleDeleteClick(comment.id)}>
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>

            {/* Quick Actions Footer */}
            <div className="p-3 border-t border-[#333333] bg-[#161b22]">
                {activePinLocation ? (
                    <Button 
                        variant="outline" 
                        className="w-full h-8 text-xs border-dashed border-yellow-600 text-yellow-500 bg-yellow-950/10 hover:bg-yellow-950/20"
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        <Pin className="w-3.5 h-3.5 mr-2" /> Complete Pinned Comment
                    </Button>
                ) : (
                    <Button 
                        variant="outline" 
                        className="w-full h-8 text-xs border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300"
                        onClick={onCreateCommentMode}
                    >
                        <Pin className="w-3.5 h-3.5 mr-2" /> Drop Pin on Map
                    </Button>
                )}
            </div>

            <AddCommentModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleCreateComment}
                initialLocation={activePinLocation}
                layoutId={layoutId}
            />

            <AlertDialog open={!!commentToDelete} onOpenChange={(open) => !open && setCommentToDelete(null)}>
                <AlertDialogContent className="bg-[#1a1a1a] border-slate-700 text-slate-100">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Comment?</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400">
                            This action cannot be undone. This will permanently delete the comment.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-slate-800 text-white hover:bg-slate-700 border-slate-600">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white border-none">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default CommentsPanel;