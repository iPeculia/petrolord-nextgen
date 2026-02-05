import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, BookOpen, FileText, Video, LifeBuoy } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ImportGuide from '@/components/Help/ImportGuide';

const HelpCenter = () => {
    return (
        <div className="p-6 md:p-12 space-y-8 max-w-6xl mx-auto">
             <Helmet><title>Help Center | Petrolord</title></Helmet>

             <div className="text-center space-y-4 mb-12">
                <h1 className="text-4xl font-bold text-white">How can we help you?</h1>
                <div className="max-w-xl mx-auto relative">
                    <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                    <Input 
                        placeholder="Search for guides, errors, or articles..." 
                        className="pl-12 h-12 bg-[#1E293B] border-slate-700 text-lg"
                    />
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-[#1E293B] border-slate-800 hover:border-[#BFFF00] transition-colors cursor-pointer group">
                    <CardHeader>
                        <BookOpen className="w-8 h-8 text-[#BFFF00] mb-2 group-hover:scale-110 transition-transform" />
                        <CardTitle>User Guides</CardTitle>
                        <CardDescription>Step-by-step tutorials for all modules.</CardDescription>
                    </CardHeader>
                </Card>
                <Card className="bg-[#1E293B] border-slate-800 hover:border-[#BFFF00] transition-colors cursor-pointer group">
                    <CardHeader>
                        <Video className="w-8 h-8 text-[#BFFF00] mb-2 group-hover:scale-110 transition-transform" />
                        <CardTitle>Video Training</CardTitle>
                        <CardDescription>Watch detailed walkthroughs and demos.</CardDescription>
                    </CardHeader>
                </Card>
                <Card className="bg-[#1E293B] border-slate-800 hover:border-[#BFFF00] transition-colors cursor-pointer group">
                    <CardHeader>
                        <LifeBuoy className="w-8 h-8 text-[#BFFF00] mb-2 group-hover:scale-110 transition-transform" />
                        <CardTitle>Support</CardTitle>
                        <CardDescription>Contact our technical support team.</CardDescription>
                    </CardHeader>
                </Card>
             </div>

             <Tabs defaultValue="import" className="space-y-6">
                <TabsList className="bg-[#1E293B] border border-slate-700">
                    <TabsTrigger value="import">Import Guide</TabsTrigger>
                    <TabsTrigger value="csv">CSV Specifications</TabsTrigger>
                    <TabsTrigger value="faq">FAQ</TabsTrigger>
                </TabsList>
                
                <TabsContent value="import">
                    <ImportGuide />
                </TabsContent>
                
                <TabsContent value="csv">
                    <div className="p-8 bg-[#1E293B] rounded-lg border border-slate-800 text-center text-slate-500">
                        CSV Specification Guide Content
                    </div>
                </TabsContent>

                <TabsContent value="faq">
                    <div className="p-8 bg-[#1E293B] rounded-lg border border-slate-800 text-center text-slate-500">
                        Frequently Asked Questions Content
                    </div>
                </TabsContent>
             </Tabs>
        </div>
    );
};

export default HelpCenter;