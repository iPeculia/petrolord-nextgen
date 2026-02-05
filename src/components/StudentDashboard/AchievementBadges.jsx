import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const AchievementBadges = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [userAchievements, setUserAchievements] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(user) fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch all possible achievements
      const { data: allAchievs } = await supabase.from('achievements').select('*');
      
      // Fetch user's earned achievements
      const { data: userAchievs } = await supabase.from('user_achievements').select('achievement_id').eq('user_id', user.id);
      
      if(allAchievs) setAchievements(allAchievs);
      if(userAchievs) setUserAchievements(new Set(userAchievs.map(ua => ua.achievement_id)));
      
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if(loading) return <div className="text-center p-12 text-slate-500">Loading achievements...</div>;

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12 text-white">
      <div className="mx-auto max-w-7xl">
         <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                Achievements
            </h1>
            <p className="mt-2 text-slate-400">Unlock badges by completing courses and maintaining streaks.</p>
         </div>

         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {achievements.length > 0 ? achievements.map((achievement, index) => {
               const isUnlocked = userAchievements.has(achievement.id);
               
               return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                        "relative flex flex-col items-center justify-center rounded-2xl border p-6 text-center shadow-xl transition-all",
                        isUnlocked 
                          ? "border-yellow-500/50 bg-gradient-to-b from-slate-800 to-slate-900" 
                          : "border-slate-800 bg-slate-900/50 opacity-60 grayscale"
                    )}
                  >
                     {/* Glow effect for unlocked */}
                     {isUnlocked && <div className="absolute inset-0 rounded-2xl bg-yellow-500/5 blur-xl" />}

                     <div className={cn(
                        "mb-4 flex h-20 w-20 items-center justify-center rounded-full border-4 shadow-lg",
                        isUnlocked 
                          ? "border-yellow-500 bg-gradient-to-br from-yellow-400 to-orange-600" 
                          : "border-slate-700 bg-slate-800"
                     )}>
                        {isUnlocked ? (
                            <Trophy className="h-10 w-10 text-white" />
                        ) : (
                            <Lock className="h-8 w-8 text-slate-500" />
                        )}
                     </div>

                     <h3 className="text-lg font-bold text-white">{achievement.title}</h3>
                     <p className="mt-1 text-sm text-slate-400">{achievement.description}</p>
                     
                     {isUnlocked && (
                        <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-bold text-yellow-400">
                           <Star className="h-3 w-3 fill-current" />
                           {achievement.xp_reward} XP
                        </div>
                     )}
                  </motion.div>
               );
            }) : (
                <div className="col-span-full text-center text-slate-500 py-12">
                    <p>No achievements defined yet. Check back soon!</p>
                </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default AchievementBadges;