import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SensitivityAnalysis = () => {
  return (
    <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
            <CardTitle>Sensitivity Analysis</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-gray-500">
            🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀
            </p>
        </CardContent>
    </Card>
  );
};

export default SensitivityAnalysis;