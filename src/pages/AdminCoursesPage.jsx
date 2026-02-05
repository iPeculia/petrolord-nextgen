import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
    Plus, 
    Search, 
    Filter, 
    BookOpen, 
    MoreVertical, 
    Edit, 
    Trash2, 
    Loader2,
    GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { courseService } from '@/services/courseService';

const AdminCoursesPage = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    
    // State
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [systemModules, setSystemModules] = useState([]);
    
    // Modal State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form Hook
    const { 
        register, 
        handleSubmit, 
        reset, 
        setValue, 
        watch, 
        formState: { errors } 
    } = useForm({
        defaultValues: {
            title: '',
            description: '',
            module_id: '',
            difficulty_level: 'intermediate',
            duration_weeks: 4,
            category: ''
        }
    });

    const selectedModuleId = watch('module_id');

    // --- Data Loading ---

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [fetchedCourses, fetchedModules] = await Promise.all([
                courseService.getAllCourses(),
                courseService.getSystemModules()
            ]);
            setCourses(fetchedCourses);
            setSystemModules(fetchedModules);
        } catch (error) {
            console.error("Error loading data:", error);
            toast({
                title: "Error",
                description: "Failed to load courses. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // --- Handlers ---

    const handleCreateCourse = async (data) => {
        setIsSubmitting(true);
        try {
            // Sync Category with Module Name if not explicitly set
            const selectedModule = systemModules.find(m => m.id === data.module_id);
            const categoryName = selectedModule ? selectedModule.name : (data.category || 'General');

            const payload = {
                title: data.title,
                description: data.description,
                module_id: data.module_id,
                category: categoryName,
                difficulty_level: data.difficulty_level,
                duration_weeks: parseInt(data.duration_weeks),
                is_published: false, // Default to draft
                has_certificate: true // Default to true
            };

            const newCourse = await courseService.createCourse(payload);

            toast({
                title: "Course Created",
                description: "The course has been successfully created.",
                className: "bg-emerald-600 text-white"
            });

            setIsCreateModalOpen(false);
            reset();
            loadData(); // Refresh list

            // Optional: Redirect to edit page immediately
            // navigate(`/dashboard/admin/courses/${newCourse.id}`);

        } catch (error) {
            console.error("Creation failed:", error);
            toast({
                title: "Creation Failed",
                description: error.message || "An error occurred while creating the course.",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteCourse = async (id) => {
        if (!confirm("Are you sure you want to delete this course? This action cannot be undone.")) return;
        
        try {
            await courseService.deleteCourse(id);
            toast({
                title: "Course Deleted",
                description: "Course removed successfully."
            });
            setCourses(courses.filter(c => c.id !== id));
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete course.",
                variant: "destructive"
            });
        }
    };

    // --- Render Helpers ---

    const filteredCourses = courses.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#0F172A] p-6 text-slate-100">
            <Helmet>
                <title>Course Management | Admin Dashboard</title>
            </Helmet>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                        <BookOpen className="w-8 h-8 text-[#BFFF00]" />
                        Course Management
                    </h1>
                    <p className="text-slate-400 mt-1">Create, edit, and manage educational content.</p>
                </div>
                <Button 
                    onClick={() => { reset(); setIsCreateModalOpen(true); }}
                    className="bg-[#BFFF00] text-black hover:bg-[#a3d900] font-semibold shadow-lg shadow-lime-500/10"
                >
                    <Plus className="w-5 h-5 mr-2" /> Add New Course
                </Button>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input 
                        placeholder="Search courses by title or category..." 
                        className="pl-10 bg-[#1E293B] border-slate-700 text-white focus:border-[#BFFF00]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="border-slate-700 text-slate-300">
                    <Filter className="w-4 h-4 mr-2" /> Filters
                </Button>
            </div>

            {/* Courses Grid */}
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-10 h-10 text-[#BFFF00] animate-spin" />
                </div>
            ) : filteredCourses.length === 0 ? (
                <div className="text-center py-20 bg-[#1E293B]/50 rounded-xl border border-dashed border-slate-700">
                    <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white">No courses found</h3>
                    <p className="text-slate-500 mt-2">Try adjusting your search or add a new course.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                        <Card key={course.id} className="bg-[#1E293B] border-slate-800 hover:border-slate-600 transition-colors group">
                            <CardHeader className="flex flex-row justify-between items-start pb-2">
                                <div className="space-y-1">
                                    <Badge variant="outline" className="bg-slate-900/50 border-slate-700 text-xs text-slate-400">
                                        {course.category || 'General'}
                                    </Badge>
                                    <CardTitle className="text-lg font-bold text-white line-clamp-1" title={course.title}>
                                        {course.title}
                                    </CardTitle>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white">
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="bg-[#0F172A] border-slate-700 text-slate-200">
                                        <DropdownMenuItem onClick={() => navigate(`/dashboard/admin/courses/${course.id}`)}>
                                            <Edit className="w-4 h-4 mr-2" /> Edit Details
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-red-400 focus:text-red-400" onClick={() => handleDeleteCourse(course.id)}>
                                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-slate-400 line-clamp-2 mb-4 min-h-[40px]">
                                    {course.description || "No description provided."}
                                </p>
                                <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-700/50">
                                    <div className="flex items-center gap-2">
                                        <GraduationCap className="w-3 h-3" />
                                        <span>{course.difficulty_level || 'N/A'}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Badge className={`${course.is_published ? 'bg-emerald-500/10 text-emerald-500' : 'bg-yellow-500/10 text-yellow-500'} border-0`}>
                                            {course.is_published ? 'Published' : 'Draft'}
                                        </Badge>
                                    </div>
                                </div>
                                <Button 
                                    className="w-full mt-4 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                                    onClick={() => navigate(`/dashboard/admin/courses/${course.id}`)}
                                >
                                    Manage Content
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* CREATE COURSE MODAL */}
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent className="bg-[#1E293B] border-slate-700 text-white sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-white">Add New Course</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Enter the basic details for the new course. You can add lessons and modules later.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit(handleCreateCourse)} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-white">Course Title <span className="text-red-400">*</span></Label>
                            <Input 
                                id="title"
                                placeholder="e.g. Advanced Drilling Mechanics"
                                className={`bg-[#0F172A] border-slate-600 text-white ${errors.title ? 'border-red-500' : ''}`}
                                {...register('title', { required: "Title is required" })}
                            />
                            {errors.title && <p className="text-xs text-red-400">{errors.title.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="module" className="text-white">Assigned Module <span className="text-red-400">*</span></Label>
                                <Select 
                                    onValueChange={(val) => setValue('module_id', val)}
                                    defaultValue={watch('module_id')}
                                >
                                    <SelectTrigger className={`bg-[#0F172A] border-slate-600 text-white ${errors.module_id ? 'border-red-500' : ''}`}>
                                        <SelectValue placeholder="Select Module" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#1E293B] border-slate-700 text-white">
                                        {systemModules.map((m) => (
                                            <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <input type="hidden" {...register('module_id', { required: "Module is required" })} />
                                {errors.module_id && <p className="text-xs text-red-400">{errors.module_id.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="difficulty" className="text-white">Difficulty</Label>
                                <Select 
                                    onValueChange={(val) => setValue('difficulty_level', val)} 
                                    defaultValue="intermediate"
                                >
                                    <SelectTrigger className="bg-[#0F172A] border-slate-600 text-white">
                                        <SelectValue placeholder="Select Level" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#1E293B] border-slate-700 text-white">
                                        <SelectItem value="beginner">Beginner</SelectItem>
                                        <SelectItem value="intermediate">Intermediate</SelectItem>
                                        <SelectItem value="advanced">Advanced</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="duration" className="text-white">Duration (Weeks)</Label>
                                <Input 
                                    type="number" 
                                    id="duration" 
                                    defaultValue={4}
                                    min={1}
                                    className="bg-[#0F172A] border-slate-600 text-white"
                                    {...register('duration_weeks')}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-white">Description <span className="text-red-400">*</span></Label>
                            <Textarea 
                                id="description" 
                                placeholder="Brief overview of the course content..."
                                className={`bg-[#0F172A] border-slate-600 text-white min-h-[100px] ${errors.description ? 'border-red-500' : ''}`}
                                {...register('description', { required: "Description is required" })}
                            />
                            {errors.description && <p className="text-xs text-red-400">{errors.description.message}</p>}
                        </div>

                        <DialogFooter className="gap-2 pt-2">
                            <Button type="button" variant="ghost" onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white hover:bg-slate-800">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting} className="bg-[#BFFF00] text-black hover:bg-[#a3d900]">
                                {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...</> : 'Create Course'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminCoursesPage;