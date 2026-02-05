import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Medal, Zap, Target, BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const AchievementsPage = () => {
  const { user } = useAuth();
  
  // Mock data - replace with real DB fetch
  const stats = {
    totalXP: 2450,
    level: 5,
    nextLevelXP: 3000,
    streak: 7,
    badgesEarned: 12,
    totalBadges: 50
  };

  const categories = [
    {
      title: "Learning Milestones",
      badges: [
        { id: 1, name: "First Steps", description: "Complete your first lesson", icon: BookOpen, earned: true, date: "2023-10-15" },
        { id: 2, name: "Scholar", description: "Complete 5 courses", icon: GraduationCapIcon, earned: true, date: "2023-11-20" },
        { id: 3, name: "Master Mind", description: "Score 100% on a quiz", icon: BrainIcon, earned: true, date: "2023-12-05" },
        { id: 4, name: "Dedicated", description: "Study for 50 hours total", icon: ClockIcon, earned: false, progress: 35 },
      ]
    },
    {
      title: "Engagement",
      badges: [
        { id: 5, name: "Week Warrior", description: "7 day login streak", icon: Zap, earned: true, date: "2024-01-10" },
        { id: 6, name: "Monthly Master", description: "30 day login streak", icon: CalendarIcon, earned: false, progress: 12 },
        { id: 7, name: "Contributor", description: "Post 10 forum comments", icon: MessageSquareIcon, earned: false, progress: 2 },
      ]
    }
  ];

  function GraduationCapIcon(props) { return <BookOpen {...props} /> } // Placeholder
  function BrainIcon(props) { return <Zap {...props} /> } // Placeholder
  function ClockIcon(props) { return <Target {...props} /> } // Placeholder
  function CalendarIcon(props) { return <CalendarIcon {...props} /> } // Placeholder
  function MessageSquareIcon(props) { return <Medal {...props} /> } // Placeholder

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Achievements</h1>
        <p className="text-slate-400">Track your progress and earn badges.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6 flex flex-col items-center">
            <Trophy className="w-8 h-8 text-yellow-500 mb-2" />
            <span className="text-2xl font-bold text-white">{stats.level}</span>
            <span className="text-xs text-slate-400 uppercase tracking-wider">Current Level</span>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6 flex flex-col items-center">
            <Star className="w-8 h-8 text-blue-500 mb-2" />
            <span className="text-2xl font-bold text-white">{stats.totalXP}</span>
            <span className="text-xs text-slate-400 uppercase tracking-wider">Total XP</span>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6 flex flex-col items-center">
            <Zap className="w-8 h-8 text-orange-500 mb-2" />
            <span className="text-2xl font-bold text-white">{stats.streak} Days</span>
            <span className="text-xs text-slate-400 uppercase tracking-wider">Current Streak</span>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6 flex flex-col items-center">
            <Medal className="w-8 h-8 text-purple-500 mb-2" />
            <span className="text-2xl font-bold text-white">{stats.badgesEarned}/{stats.totalBadges}</span>
            <span className="text-xs text-slate-400 uppercase tracking-wider">Badges Earned</span>
          </CardContent>
        </Card>
      </div>

      {/* Level Progress */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6">
          <div className="flex justify-between mb-2 text-sm font-medium">
            <span className="text-white">Level {stats.level} Progress</span>
            <span className="text-slate-400">{stats.totalXP} / {stats.nextLevelXP} XP</span>
          </div>
          <Progress value={(stats.totalXP / stats.nextLevelXP) * 100} className="h-3" />
          <p className="text-xs text-slate-500 mt-2">
            Earn {stats.nextLevelXP - stats.totalXP} more XP to reach Level {stats.level + 1}
          </p>
        </CardContent>
      </Card>

      {/* Badges Grid */}
      <div className="space-y-6">
        {categories.map((category, idx) => (
          <div key={idx} className="space-y-4">
            <h3 className="text-xl font-semibold text-white">{category.title}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {category.badges.map((badge) => {
                const Icon = badge.icon;
                return (
                  <Card 
                    key={badge.id} 
                    className={`border-slate-700 transition-all ${
                      badge.earned 
                        ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600' 
                        : 'bg-slate-900/50 opacity-60 grayscale'
                    }`}
                  >
                    <CardContent className="p-6 flex flex-col items-center text-center h-full">
                      <div className={`p-3 rounded-full mb-4 ${
                        badge.earned ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-500'
                      }`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      
                      <h4 className="font-bold text-white mb-1">{badge.name}</h4>
                      <p className="text-xs text-slate-400 mb-4 flex-grow">{badge.description}</p>
                      
                      {badge.earned ? (
                        <Badge variant="outline" className="border-green-500/50 text-green-400 bg-green-500/10">
                          Earned {new Date(badge.date).toLocaleDateString()}
                        </Badge>
                      ) : (
                         <div className="w-full space-y-1">
                            <div className="flex justify-between text-[10px] text-slate-500">
                                <span>Progress</span>
                                <span>{badge.progress || 0}%</span>
                            </div>
                            <Progress value={badge.progress || 0} className="h-1.5" />
                         </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementsPage;