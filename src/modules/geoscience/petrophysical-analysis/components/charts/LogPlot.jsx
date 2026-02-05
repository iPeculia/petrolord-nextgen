import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const LogPlot = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Plot</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96 flex items-center justify-center text-muted-foreground bg-slate-100 rounded-md">
          Log Plot Area
        </div>
      </CardContent>
    </Card>
  );
};

export default LogPlot;