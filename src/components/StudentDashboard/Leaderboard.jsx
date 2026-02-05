import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

// Mock data for visual demonstration as backend aggregation might be heavy initially
const MOCK_LEADERS = [
    { id: 1, name: "Sarah Chen", xp: 12500, avatar: "", rank: 1 },
    { id: 2, name: "Mike Ross", xp: 11200, avatar: "", rank: 2 },
    { id: 3, name: "Jessica P.", xp: 10850, avatar: "", rank: 3 },
    { id: 4, name: "Harvey S.", xp: 9500, avatar: "", rank: 4 },
    { id: 5, name: "Louis Litt", xp: 9200, avatar: "", rank: 5 },
];

const RankBadge = ({ rank }) => {
    if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-slate-300" />;
    if (rank === 3) return <Medal className="h-6 w-6 text-amber-700" />;
    return <span className="text-lg font-bold text-slate-500">#{rank}</span>;
};

const Leaderboard = () => {
  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12 text-white">
      <div className="mx-auto max-w-4xl">
         <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold text-white">Top Learners</h1>
            <p className="text-slate-400">See who's leading the pack this month.</p>
         </div>

         <div className="space-y-4">
            {MOCK_LEADERS.map((leader, index) => (
               <motion.div
                  key={leader.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                     "flex items-center justify-between rounded-xl p-4 shadow-lg transition-all hover:scale-[1.02]",
                     index < 3 
                       ? "bg-gradient-to-r from-slate-800 to-slate-900 border border-white/10" 
                       : "bg-slate-900 border border-slate-800"
                  )}
               >
                  <div className="flex items-center gap-4">
                     <div className="flex h-12 w-12 items-center justify-center">
                        <RankBadge rank={leader.rank} />
                     </div>
                     <Avatar className="h-10 w-10 ring-2 ring-white/10">
                        <AvatarImage src={leader.avatar} />
                        <AvatarFallback className="bg-slate-700"><User className="h-5 w-5"/></AvatarFallback>
                     </Avatar>
                     <div>
                        <h3 className={cn("font-bold", index < 3 ? "text-white" : "text-slate-300")}>
                            {leader.name}
                        </h3>
                        <p className="text-xs text-slate-500">Level {Math.floor(leader.xp / 1000) + 1} Student</p>
                     </div>
                  </div>
                  
                  <div className="text-right">
                     <span className="text-lg font-bold text-[#BFFF00]">{leader.xp.toLocaleString()}</span>
                     <span className="ml-1 text-xs text-slate-500">XP</span>
                  </div>
               </motion.div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default Leaderboard;