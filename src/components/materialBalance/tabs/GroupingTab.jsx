import React from 'react';
import { useMaterialBalance } from '@/hooks/useMaterialBalance';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Folder } from 'lucide-react';

const GroupingTab = () => {
    const { groups, tanks } = useMaterialBalance();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map(group => {
                const groupTanks = tanks.filter(t => group.tankIds.includes(t.id));
                return (
                    <Card key={group.id} className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle className="flex items-center text-white text-base">
                                <Folder className="w-4 h-4 mr-2 text-blue-400" />
                                {group.name}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <p className="text-xs text-slate-500 uppercase font-semibold mb-2">Members ({groupTanks.length})</p>
                                {groupTanks.map(tank => (
                                    <div key={tank.id} className="p-2 bg-slate-950 rounded border border-slate-800 text-sm text-slate-300">
                                        {tank.name}
                                    </div>
                                ))}
                                {groupTanks.length === 0 && <p className="text-sm text-slate-500 italic">No reservoirs assigned</p>}
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};

export default GroupingTab;