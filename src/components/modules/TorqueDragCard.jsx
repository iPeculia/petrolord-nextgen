import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

const TorqueDragCard = () => {
  return (
    <Card className="bg-slate-900 border-slate-800 text-slate-200 hover:border-blue-600/50 transition-colors">
      <CardHeader>
        <div className="h-10 w-10 bg-blue-600/20 rounded-lg flex items-center justify-center mb-2">
            <Activity className="h-6 w-6 text-blue-500" />
        </div>
        <CardTitle className="text-lg text-white">Torque & Drag</CardTitle>
        <CardDescription className="text-slate-400">
            Advanced torque and drag analysis for deviated wells. Analyze forces, stresses, and drill string mechanics.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span>Available</span>
        </div>
      </CardContent>
      <CardFooter>
        <Link to="/dashboard/modules/drilling/torque-drag" className="w-full">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Launch Studio
            </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default TorqueDragCard;