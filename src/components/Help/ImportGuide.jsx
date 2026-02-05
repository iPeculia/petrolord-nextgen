import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

const ImportGuide = () => {
    return (
        <div className="space-y-6">
            <Card className="bg-[#1E293B] border-slate-800">
                <CardHeader>
                    <CardTitle>Bulk Import Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-slate-300">
                    <p>
                        The bulk import tool allows administrators to onboard hundreds of students and lecturers at once using a standardized CSV file.
                    </p>
                    <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg flex gap-3 text-sm text-blue-200">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <div>
                            <strong>Pro Tip:</strong> Always run a small test import (1-5 rows) before uploading a large file to ensure your data mapping is correct.
                        </div>
                    </div>
                </CardContent>
            </Card>
            
            <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-[#1E293B] border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-lg">1. Prepare Data</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-slate-400">
                        Download the template CSV. Ensure all required fields (Email, First Name, Last Name, Role) are filled. Do not modify the header row.
                    </CardContent>
                </Card>
                <Card className="bg-[#1E293B] border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-lg">2. Upload & Validate</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-slate-400">
                        Upload your file. The system will auto-validate for duplicates and formatting errors. Fix any errors directly in the preview or re-upload.
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ImportGuide;