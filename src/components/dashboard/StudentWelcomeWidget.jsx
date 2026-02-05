import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, GraduationCap, Play, AlertCircle, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import AlumniTranscript from '@/components/dashboard/AlumniTranscript';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { useStudentModules } from '@/hooks/useStudentModules';

const StudentWelcomeWidget = ({ user, profile, licenseInfo, stats }) => {
  const { assignedModule } = useStudentModules();
  
  const isExpiring = licenseInfo?.status === 'warning';
  const isGracePeriod = licenseInfo?.status === 'grace_period_active';
  const isExpired = licenseInfo?.status === 'expired' || licenseInfo?.status === 'grace_period_expired';
  const isAlumni = licenseInfo?.isAlumni;

  return (
    <Card className="bg-gradient-to-r from-[#1E293B] to-[#0F172A] border-slate-800 overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#BFFF00]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <CardContent className="p-6 relative z-10">
        <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
          <div className="space-y-2">
             <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                  Welcome back, {profile?.display_name?.split(' ')[0] || 'Student'}!
                  {isAlumni && <GraduationCap className="w-6 h-6 text-[#BFFF00]" />}
                </h2>
                {isExpiring && (
                   <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-xs font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> License Expiring
                   </span>
                )}
             </div>
             
             <p className="text-slate-400 max-w-lg">
                {isAlumni ? (
                    isExpired ? (
                        <span className="text-red-400">Your alumni grace period has ended. Access is limited to transcripts and past results.</span>
                    ) : (
                        <span>Congratulations on your graduation! You are in your <span className="text-yellow-400 font-medium">Grace Period</span>.</span>
                    )
                ) : (
                    <span>
                        You are assigned to the <span className="text-[#BFFF00] font-medium">{assignedModule?.name || 'General'}</span> module.
                        <br/>
                        <span className="text-xs text-slate-500">Access to other modules is restricted based on your assignment.</span>
                    </span>
                )}
                {stats?.lastLogin && (
                    <span className="block text-xs text-slate-500 mt-1">
                        Last login: {format(new Date(stats.lastLogin), 'MMM d, h:mm a')}
                    </span>
                )}
             </p>
          </div>

          <div className="flex gap-3 w-full md:w-auto flex-wrap">
             {!isExpired ? (
                 <Button className="bg-[#BFFF00] text-black hover:bg-[#a3d900] font-bold flex-1 md:flex-none shadow-lg shadow-[#BFFF00]/10" asChild>
                    <Link to="/courses">
                       <Play className="w-4 h-4 mr-2 fill-current" /> Resume Learning
                    </Link>
                 </Button>
             ) : (
                 <Button variant="destructive" className="flex-1 md:flex-none opacity-90 cursor-not-allowed">
                    <AlertCircle className="w-4 h-4 mr-2" /> Course Access Restricted
                 </Button>
             )}
             
             <Button variant="outline" className="border-slate-700 text-slate-200 hover:text-white hover:bg-slate-800 flex-1 md:flex-none" asChild>
                <Link to="/grades">
                   <GraduationCap className="w-4 h-4 mr-2" /> View Grades
                </Link>
             </Button>

             {isAlumni && (
                 <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="border-slate-700 text-[#BFFF00] hover:bg-slate-800 hover:text-[#BFFF00] flex-1 md:flex-none">
                            <Download className="w-4 h-4 mr-2" /> Transcript
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl bg-[#0F172A] border-slate-800">
                        <AlumniTranscript user={user} profile={profile} licenseInfo={licenseInfo} stats={stats} />
                    </DialogContent>
                 </Dialog>
             )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-800/50">
           <div className="space-y-1">
              <p className="text-xs text-slate-500 uppercase font-medium">Enrolled</p>
              <p className="text-2xl font-bold text-white">{stats?.enrolled || 0}</p>
           </div>
           <div className="space-y-1 border-l border-slate-800/50 pl-4">
              <p className="text-xs text-slate-500 uppercase font-medium">In Progress</p>
              <p className="text-2xl font-bold text-blue-400">{stats?.inProgress || 0}</p>
           </div>
           <div className="space-y-1 border-l border-slate-800/50 pl-4">
              <p className="text-xs text-slate-500 uppercase font-medium">Completed</p>
              <p className="text-2xl font-bold text-[#BFFF00]">{stats?.completed || 0}</p>
           </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentWelcomeWidget;