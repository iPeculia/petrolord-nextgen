import React from 'react';
import { useWorkflowStore } from '@/store/workflowStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Download, User, Calendar, LayoutTemplate } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const TemplatesView = ({ onCreateFromTemplate }) => {
    const { templates } = useWorkflowStore();
    const { toast } = useToast();

    const handleUseTemplate = (template) => {
        onCreateFromTemplate(template);
        toast({ title: "Template Selected", description: `Started new workflow from "${template.name}".` });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
            {templates.map(template => (
                <Card key={template.id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-all flex flex-col">
                    <CardHeader>
                        <div className="flex justify-between items-start mb-2">
                            <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">{template.category}</Badge>
                            <div className="flex items-center gap-1 text-amber-400 text-xs font-medium">
                                <Star className="w-3 h-3 fill-amber-400" />
                                {template.rating}
                            </div>
                        </div>
                        <CardTitle className="text-lg text-white">{template.name}</CardTitle>
                        <CardDescription className="line-clamp-2 h-10">{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <div className="space-y-2 text-xs text-slate-400 bg-slate-950 p-3 rounded border border-slate-800">
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-1"><User className="w-3 h-3" /> Author</span>
                                <span className="text-slate-300">{template.author}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-1"><Download className="w-3 h-3" /> Usage</span>
                                <span className="text-slate-300">{template.usageCount} projects</span>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white" onClick={() => handleUseTemplate(template)}>
                            <LayoutTemplate className="w-4 h-4 mr-2" /> Use Template
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
};

export default TemplatesView;