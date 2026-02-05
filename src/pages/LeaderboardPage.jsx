import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Crown, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const LeaderboardPage = () => {
  const { user, profile } = useAuth();
  
  // Mock Data
  const leaderboardData = [
    { rank: 1, name: "Sarah Chen", xp: 5200, level: 8, avatar: "SC", trend: "up" },
    { rank: 2, name: "Michael Ross", xp: 4950, level: 7, avatar: "MR", trend: "same" },
    { rank: 3, name: "David Kim", xp: 4800, level: 7, avatar: "DK", trend: "up" },
    { rank: 4, name: "Jessica Wei", xp: 4500, level: 6, avatar: "JW", trend: "down" },
    { rank: 5, name: profile?.display_name || "You", xp: 2450, level: 5, avatar: "YOU", isCurrentUser: true, trend: "up" },
    { rank: 6, name: "Tom Wilson", xp: 2100, level: 5, avatar: "TW", trend: "down" },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Global Leaderboard</h1>
           <p className="text-slate-400">See how you stack up against other learners.</p>
        </div>
        <div className="flex gap-2 bg-slate-800 p-1 rounded-lg">
            <button className="px-4 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium">Global</button>
            <button className="px-4 py-1.5 text-slate-400 hover:text-white rounded-md text-sm font-medium">Department</button>
            <button className="px-4 py-1.5 text-slate-400 hover:text-white rounded-md text-sm font-medium">Friends</button>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-8">
        {/* 2nd Place */}
        <Card className="bg-slate-800 border-slate-700 relative mt-8 md:mt-8 transform hover:scale-105 transition-transform">
           <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-700 text-slate-300 rounded-full p-2 border-4 border-[#0F172A]">
             <Medal className="w-6 h-6" />
           </div>
           <CardContent className="pt-12 pb-6 flex flex-col items-center text-center">
             <Avatar className="w-20 h-20 border-4 border-slate-400 mb-4">
               <AvatarFallback className="bg-slate-600 text-white text-xl">MR</AvatarFallback>
             </Avatar>
             <h3 className="text-xl font-bold text-white">Michael Ross</h3>
             <p className="text-slate-400 text-sm mb-2">Level 7</p>
             <Badge variant="secondary" className="bg-slate-700 text-white">4,950 XP</Badge>
           </CardContent>
        </Card>

        {/* 1st Place */}
        <Card className="bg-gradient-to-b from-yellow-900/40 to-slate-800 border-yellow-500/30 relative z-10 transform hover:scale-105 transition-transform shadow-xl shadow-yellow-900/20">
           <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-yellow-500 text-black rounded-full p-3 border-4 border-[#0F172A]">
             <Crown className="w-8 h-8" />
           </div>
           <CardContent className="pt-14 pb-8 flex flex-col items-center text-center">
             <Avatar className="w-24 h-24 border-4 border-yellow-500 mb-4 shadow-lg shadow-yellow-500/20">
               <AvatarFallback className="bg-yellow-600 text-white text-2xl">SC</AvatarFallback>
             </Avatar>
             <h3 className="text-2xl font-bold text-white">Sarah Chen</h3>
             <p className="text-yellow-400/80 text-sm mb-2 font-medium">Level 8</p>
             <Badge className="bg-yellow-500 text-black hover:bg-yellow-400 px-4 py-1 text-base">5,200 XP</Badge>
           </CardContent>
        </Card>

        {/* 3rd Place */}
        <Card className="bg-slate-800 border-slate-700 relative mt-8 md:mt-12 transform hover:scale-105 transition-transform">
           <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-700 text-amber-100 rounded-full p-2 border-4 border-[#0F172A]">
             <Medal className="w-6 h-6" />
           </div>
           <CardContent className="pt-12 pb-6 flex flex-col items-center text-center">
             <Avatar className="w-20 h-20 border-4 border-amber-700 mb-4">
               <AvatarFallback className="bg-slate-600 text-white text-xl">DK</AvatarFallback>
             </Avatar>
             <h3 className="text-xl font-bold text-white">David Kim</h3>
             <p className="text-slate-400 text-sm mb-2">Level 7</p>
             <Badge variant="secondary" className="bg-slate-700 text-white">4,800 XP</Badge>
           </CardContent>
        </Card>
      </div>

      {/* List */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
            <CardTitle className="text-lg text-white">Rankings</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
            <div className="divide-y divide-slate-700">
                {leaderboardData.slice(3).map((user) => (
                    <div 
                        key={user.rank} 
                        className={`flex items-center justify-between p-4 hover:bg-slate-700/50 transition-colors ${
                            user.isCurrentUser ? 'bg-blue-900/20 border-l-4 border-blue-500' : ''
                        }`}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-8 font-bold text-slate-400 text-center">#{user.rank}</div>
                            <Avatar className="h-10 w-10 border border-slate-600">
                                <AvatarFallback className="bg-slate-700 text-slate-200 text-xs">{user.avatar}</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="font-medium text-white flex items-center gap-2">
                                    {user.name}
                                    {user.isCurrentUser && <Badge variant="outline" className="text-[10px] h-5 border-blue-500 text-blue-400">YOU</Badge>}
                                </div>
                                <div className="text-xs text-slate-400">Level {user.level}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <div className="font-bold text-white">{user.xp.toLocaleString()} XP</div>
                            </div>
                            {user.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                            {user.trend === 'down' && <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />}
                            {user.trend === 'same' && <div className="w-4 h-0.5 bg-slate-500" />}
                        </div>
                    </div>
                ))}
            </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaderboardPage;