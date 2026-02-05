import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const SensitivityIndicators = () => {
    return (
        <Card className="bg-slate-950 border-slate-800">
            <CardContent className="p-4">
                <div className="text-xs text-slate-500 text-center">Sensitivity Indicators loaded.</div>
            </CardContent>
        </Card>
    );
};

export default SensitivityIndicators;