import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, FileBox } from 'lucide-react';
import { STANDARD_TEMPLATES } from '@/utils/templates/standardTemplates';

const TemplateLibraryModal = ({ isOpen, onClose, onSelectTemplate }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#0F172A] border-slate-700 text-white sm:max-w-[900px] h-[70vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Template Library</DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {STANDARD_TEMPLATES.map(template => (
                            <Card key={template.id} className="bg-[#1E293B] border-slate-700 hover:border-slate-500 transition-colors">
                                <CardHeader>
                                    <div className="flex justify-between items-start mb-2">
                                        <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                                            {template.type}
                                        </Badge>
                                        <span className="text-xs font-mono text-slate-500">{template.od}" OD</span>
                                    </div>
                                    <CardTitle className="text-lg text-white">{template.name}</CardTitle>
                                    <CardDescription className="line-clamp-2">{template.description}</CardDescription>
                                </CardHeader>
                                <CardFooter>
                                    <Button 
                                        className="w-full bg-slate-800 hover:bg-slate-700 text-white"
                                        onClick={() => onSelectTemplate(template)}
                                    >
                                        <Copy className="w-4 h-4 mr-2" /> Use Template
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default TemplateLibraryModal;