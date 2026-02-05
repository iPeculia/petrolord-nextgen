import React from 'react';
import ModuleAssignmentAdmin from '@/components/ModuleAssignmentAdmin';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const AdminDepartmentMappingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0F172A] p-6 lg:p-10 space-y-8">
            <div className="flex flex-col gap-4">
                <Button 
                    variant="ghost" 
                    className="w-fit pl-0 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                    onClick={() => navigate('/dashboard/admin/courses')}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Course Management
                </Button>
                
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Department Module Mappings</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-2xl">
                        Define which Petrolord modules are available to each university department. 
                        Changes here affect student access immediately.
                    </p>
                </div>
            </div>
            
            <div className="w-full max-w-6xl mx-auto">
                <ModuleAssignmentAdmin />
            </div>
        </div>
    );
};

export default AdminDepartmentMappingPage;