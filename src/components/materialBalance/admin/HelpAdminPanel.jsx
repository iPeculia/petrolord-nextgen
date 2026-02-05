import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getTopTopics } from '@/utils/helpAnalytics';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { helpTopics } from '@/data/materialBalanceHelpContent';

const HelpAdminPanel = () => {
  const topTopics = getTopTopics(5);
  const chartData = topTopics.map(t => {
     const topic = helpTopics.find(ht => ht.id === t.topicId);
     return {
        name: topic ? topic.title.substring(0, 15) + '...' : t.topicId,
        views: t.count
     };
  });

  return (
    <div className="space-y-6">
       <h2 className="text-2xl font-bold text-white mb-6">Help System Administration</h2>
       
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-slate-900 border-slate-800">
             <CardHeader>
                <CardTitle className="text-white">Most Viewed Topics</CardTitle>
             </CardHeader>
             <CardContent className="h-[300px]">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                       <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                       <YAxis stroke="#64748b" fontSize={12} />
                       <Tooltip 
                         contentStyle={{backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff'}}
                         itemStyle={{color: '#BFFF00'}}
                       />
                       <Bar dataKey="views" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-500">No analytics data yet.</div>
                )}
             </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
             <CardHeader>
                <CardTitle className="text-white">System Health</CardTitle>
             </CardHeader>
             <CardContent>
                <div className="space-y-4">
                   <div className="flex justify-between items-center p-3 bg-slate-950 rounded border border-slate-800">
                      <span className="text-slate-400">Total Topics</span>
                      <span className="text-white font-mono font-bold">{helpTopics.length}</span>
                   </div>
                   <div className="flex justify-between items-center p-3 bg-slate-950 rounded border border-slate-800">
                      <span className="text-slate-400">Search Index Status</span>
                      <span className="text-green-400 font-medium">Active</span>
                   </div>
                   <div className="flex justify-between items-center p-3 bg-slate-950 rounded border border-slate-800">
                      <span className="text-slate-400">Analytics Status</span>
                      <span className="text-green-400 font-medium">Recording</span>
                   </div>
                </div>
             </CardContent>
          </Card>
       </div>
    </div>
  );
};

export default HelpAdminPanel;