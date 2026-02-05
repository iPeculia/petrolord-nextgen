import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Save, Trash, Upload, Check } from 'lucide-react';
import { getTemplates, saveTemplate, deleteTemplate } from '@/utils/declineCurve/TemplateEngine';
import { useDeclineCurve } from '@/context/DeclineCurveContext';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const TemplateManager = () => {
    const { fitConfig, forecastConfig, setFitConfig, setForecastConfig } = useDeclineCurve();
    const [templates, setTemplates] = useState(getTemplates());
    const [newTemplateName, setNewTemplateName] = useState("");
    const [isSaveOpen, setIsSaveOpen] = useState(false);

    const handleLoad = (template) => {
        if (template.config.fit) setFitConfig(template.config.fit);
        if (template.config.forecast) setForecastConfig(template.config.forecast);
        toast({ title: "Template Applied", description: `Loaded settings from ${template.name}` });
    };

    const handleDelete = (id) => {
        deleteTemplate(id);
        setTemplates(getTemplates());
        toast({ title: "Template Deleted" });
    };

    const handleSaveCurrent = () => {
        if (!newTemplateName.trim()) return;
        saveTemplate({
            name: newTemplateName,
            type: 'Analysis',
            description: 'User saved configuration',
            config: { fit: fitConfig, forecast: forecastConfig }
        });
        setTemplates(getTemplates());
        setNewTemplateName("");
        setIsSaveOpen(false);
        toast({ title: "Template Saved" });
    };

    return (
        <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
            <CardHeader className="py-3 px-4 border-b border-slate-800 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-400" /> Analysis Templates
                </CardTitle>
                <Dialog open={isSaveOpen} onOpenChange={setIsSaveOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="h-8 border-slate-700 bg-slate-900">
                            <Save className="w-3 h-3 mr-2" /> Save Current
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-900 border-slate-800 text-white">
                        <DialogHeader><DialogTitle>Save Template</DialogTitle></DialogHeader>
                        <div className="py-4 space-y-4">
                            <Input 
                                placeholder="Template Name" 
                                value={newTemplateName}
                                onChange={(e) => setNewTemplateName(e.target.value)}
                                className="bg-slate-950 border-slate-700"
                            />
                            <Button onClick={handleSaveCurrent} className="w-full bg-blue-600">Save</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent className="p-0 flex-1 min-h-0">
                <ScrollArea className="h-full">
                    <div className="p-4 grid grid-cols-1 gap-3">
                        {templates.map(t => (
                            <div key={t.id} className="bg-slate-950 border border-slate-800 rounded p-3 flex justify-between items-center group hover:border-slate-700">
                                <div>
                                    <div className="font-medium text-slate-200 text-sm">{t.name}</div>
                                    <div className="text-xs text-slate-500">{t.description}</div>
                                    <div className="text-[10px] text-slate-600 mt-1">
                                        Fit: {t.config.fit?.modelType} | Limit: {t.config.forecast?.economicLimit}
                                    </div>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button size="sm" variant="secondary" className="h-7 text-xs" onClick={() => handleLoad(t)}>
                                        <Upload className="w-3 h-3 mr-1" /> Load
                                    </Button>
                                    <Button size="icon" variant="ghost" className="h-7 w-7 hover:text-red-400" onClick={() => handleDelete(t.id)}>
                                        <Trash className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
};

export default TemplateManager;