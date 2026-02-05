import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Helmet } from 'react-helmet';
import { 
    ChevronLeft, 
    Save, 
    Loader2, 
    LayoutTemplate, 
    ListTree, 
    Eye,
    AlertTriangle,
    CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { courseService } from '@/services/courseService';
import CourseStructureBuilder from '@/components/CourseManager/CourseStructureBuilder';
import CoursePreview from '@/components/CourseManager/CoursePreview';
import CourseProgressTracker from '@/components/CourseManager/CourseProgressTracker';

const CourseManagementPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    
    // Logic: If id is 'new', we are in create mode.
    const isCreateMode = id === 'new';
    
    const [isLoading, setIsLoading] = useState(!isCreateMode);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('details');
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [systemModules, setSystemModules] = useState([]);
    
    // React Hook Form
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            title: '',
            description: '',
            category: '',
            difficulty_level: 'intermediate',
            duration_weeks: 4,
            phase_requirement: 1,
            is_published: false,
            module_id: '', // Corresponds to the system module ID
            has_certificate: true
        }
    });

    const isPublished = watch('is_published');
    const hasCertificate = watch('has_certificate');
    const selectedModuleId = watch('module_id');

    // 1. Fetch System Modules for Dropdown
    useEffect(() => {
        const fetchModules = async () => {
            try {
                const modules = await courseService.getSystemModules();
                setSystemModules(modules);
            } catch (err) {
                console.error("Failed to fetch system modules", err);
                toast({ title: "Warning", description: "Could not load system modules list.", variant: "destructive" });
            }
        };
        fetchModules();
    }, []);

    // 2. Fetch Course Data if Edit Mode
    useEffect(() => {
        const fetchCourse = async () => {
            if (isCreateMode) return;
            
            try {
                setIsLoading(true);
                const course = await courseService.getCourseById(id);
                if (course) {
                    setValue('title', course.title);
                    setValue('description', course.description || '');
                    setValue('category', course.category || '');
                    setValue('difficulty_level', course.difficulty_level || 'intermediate');
                    setValue('duration_weeks', course.duration_weeks || 4);
                    setValue('phase_requirement', course.phase_requirement || 1);
                    setValue('is_published', course.is_published || false);
                    setValue('module_id', course.module_id || '');
                    setValue('has_certificate', course.has_certificate !== false);
                }
            } catch (error) {
                console.error(error);
                toast({ 
                    title: "Error", 
                    description: "Failed to load course details. It may not exist.", 
                    variant: "destructive" 
                });
                navigate('/dashboard/admin/courses');
            } finally {
                setIsLoading(false);
            }
        };
        fetchCourse();
    }, [id, isCreateMode, setValue, navigate]);

    // 3. Handle Form Submission
    const onSubmit = async (data) => {
        setIsSaving(true);
        try {
            // Find selected module name to auto-fill category if empty
            const selectedModule = systemModules.find(m => m.id === data.module_id);
            const payload = {
                ...data,
                // Ensure critical fields are typed correctly
                duration_weeks: parseInt(data.duration_weeks),
                phase_requirement: parseInt(data.phase_requirement),
                category: selectedModule ? selectedModule.name : (data.category || 'General'), // Fallback or sync category
            };

            if (isCreateMode) {
                // Create
                const newCourse = await courseService.createCourse(payload);
                toast({ 
                    title: "Success", 
                    description: "Course created successfully!", 
                    className: "bg-emerald-600 text-white" 
                });
                // Redirect to edit mode for this new course
                navigate(`/dashboard/admin/courses/${newCourse.id}`, { replace: true });
            } else {
                // Update
                await courseService.updateCourse(id, payload);
                toast({ 
                    title: "Success", 
                    description: "Course updated successfully.", 
                    className: "bg-emerald-600 text-white" 
                });
            }
        } catch (error) {
            console.error("Save failed:", error);
            toast({ 
                title: "Save Failed", 
                description: error.message || "An unexpected error occurred.", 
                variant: "destructive" 
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#0F172A]">
                <Loader2 className="w-12 h-12 text-[#BFFF00] animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0F172A] pb-20">
            <Helmet>
                <title>{isCreateMode ? 'Create New Course' : 'Edit Course'} | Petrolord Admin</title>
            </Helmet>

            {/* Header */}
            <div className="sticky top-0 z-30 bg-[#0F172A]/80 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/admin/courses')} className="text-slate-400 hover:text-white">
                            <ChevronLeft className="w-6 h-6" />
                        </Button>
                        <div>
                            <h1 className="text-xl font-bold text-white flex items-center gap-2">
                                {isCreateMode ? 'Create New Course' : 'Edit Course'}
                                {!isCreateMode && (
                                    <span className={`text-xs px-2 py-0.5 rounded-full border ${isPublished ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' : 'bg-slate-700 text-slate-400 border-slate-600'}`}>
                                        {isPublished ? 'Published' : 'Draft'}
                                    </span>
                                )}
                            </h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {!isCreateMode && (
                            <Button variant="outline" onClick={() => setIsPreviewOpen(true)} className="hidden sm:flex border-slate-600 text-slate-300">
                                <Eye className="w-4 h-4 mr-2" /> Preview
                            </Button>
                        )}
                        <Button onClick={handleSubmit(onSubmit)} disabled={isSaving} className="bg-[#BFFF00] text-black hover:bg-[#a3d900] min-w-[120px]">
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                            {isCreateMode ? 'Create Course' : 'Save Changes'}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="bg-[#1E293B] border-slate-700">
                        <TabsTrigger value="details" className="data-[state=active]:bg-[#BFFF00] data-[state=active]:text-black">
                            <LayoutTemplate className="w-4 h-4 mr-2" /> Details
                        </TabsTrigger>
                        <TabsTrigger value="structure" disabled={isCreateMode} className="data-[state=active]:bg-[#BFFF00] data-[state=active]:text-black">
                            <ListTree className="w-4 h-4 mr-2" /> Curriculum
                        </TabsTrigger>
                        <TabsTrigger value="students" disabled={isCreateMode} className="data-[state=active]:bg-[#BFFF00] data-[state=active]:text-black">
                            <CheckCircle2 className="w-4 h-4 mr-2" /> Student Progress
                        </TabsTrigger>
                    </TabsList>

                    {/* DETAILS TAB */}
                    <TabsContent value="details">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Info */}
                            <div className="lg:col-span-2 space-y-6">
                                <Card className="bg-[#1E293B] border-slate-700">
                                    <CardHeader>
                                        <CardTitle className="text-white">Basic Information</CardTitle>
                                        <CardDescription className="text-slate-400">Core details about the course.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="title" className="text-white">Course Title <span className="text-red-400">*</span></Label>
                                            <Input 
                                                id="title" 
                                                {...register('title', { required: "Title is required" })}
                                                className={`bg-[#0F172A] border-slate-600 text-white ${errors.title ? 'border-red-500' : ''}`}
                                                placeholder="e.g. Advanced Reservoir Engineering" 
                                            />
                                            {errors.title && <p className="text-xs text-red-400">{errors.title.message}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="description" className="text-white">Description</Label>
                                            <Textarea 
                                                id="description" 
                                                {...register('description')}
                                                className="bg-[#0F172A] border-slate-600 text-white min-h-[150px]"
                                                placeholder="Detailed description of what students will learn..." 
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-[#1E293B] border-slate-700">
                                    <CardHeader>
                                        <CardTitle className="text-white">Classification & Requirements</CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-white">Assigned Module <span className="text-red-400">*</span></Label>
                                            <Select 
                                                onValueChange={(val) => setValue('module_id', val)}
                                                value={selectedModuleId}
                                            >
                                                <SelectTrigger className="bg-[#0F172A] border-slate-600 text-white">
                                                    <SelectValue placeholder="Select Module" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-[#1E293B] border-slate-700 text-white">
                                                    {systemModules.map(m => (
                                                        <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                                                    ))}
                                                    <SelectItem value="general">General / Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <input type="hidden" {...register('module_id', { required: "Module selection is required" })} />
                                            {errors.module_id && <p className="text-xs text-red-400">{errors.module_id.message}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-white">Difficulty Level</Label>
                                            <Select 
                                                onValueChange={(val) => setValue('difficulty_level', val)}
                                                defaultValue={watch('difficulty_level')}
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

                                        <div className="space-y-2">
                                            <Label htmlFor="phase" className="text-white">Phase Requirement (1-4)</Label>
                                            <Input 
                                                id="phase" 
                                                type="number"
                                                min="1" max="4"
                                                {...register('phase_requirement')}
                                                className="bg-[#0F172A] border-slate-600 text-white"
                                            />
                                            <p className="text-xs text-slate-500">Academic year/phase required to access.</p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="duration" className="text-white">Duration (Weeks)</Label>
                                            <Input 
                                                id="duration" 
                                                type="number"
                                                {...register('duration_weeks')}
                                                className="bg-[#0F172A] border-slate-600 text-white"
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Sidebar Settings */}
                            <div className="space-y-6">
                                <Card className="bg-[#1E293B] border-slate-700">
                                    <CardHeader>
                                        <CardTitle className="text-white">Settings</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label className="text-base text-white">Publish Course</Label>
                                                <p className="text-xs text-slate-400">Visible to students</p>
                                            </div>
                                            <Switch 
                                                checked={isPublished}
                                                onCheckedChange={(val) => setValue('is_published', val)}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label className="text-base text-white">Certificate</Label>
                                                <p className="text-xs text-slate-400">Award on completion</p>
                                            </div>
                                            <Switch 
                                                checked={hasCertificate}
                                                onCheckedChange={(val) => setValue('has_certificate', val)}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                                
                                {isCreateMode && (
                                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-3">
                                        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                        <p className="text-sm text-amber-200">
                                            You must save the basic details before adding modules and lessons.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    {/* STRUCTURE TAB */}
                    <TabsContent value="structure">
                         <CourseStructureBuilder courseId={id} />
                    </TabsContent>
                    
                    {/* STUDENTS TAB */}
                    <TabsContent value="students">
                        <CourseProgressTracker courseId={id} />
                    </TabsContent>
                </Tabs>
            </div>

            {isPreviewOpen && (
                <CoursePreview courseId={id} onClose={() => setIsPreviewOpen(false)} />
            )}
        </div>
    );
};

export default CourseManagementPage;