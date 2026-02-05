import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, UserPlus, MessageSquare, Clock, Share2, Shield, Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const CollaborationPanel = () => {
    // Mock Data for Demo
    const [members, setMembers] = useState([
        { id: 1, name: 'Alex Chen', role: 'Owner', initials: 'AC', avatar: null, status: 'online' },
        { id: 2, name: 'Sarah Miller', role: 'Editor', initials: 'SM', avatar: null, status: 'offline' },
        { id: 3, name: 'James Wilson', role: 'Viewer', initials: 'JW', avatar: null, status: 'online' }
    ]);
    
    const [activities, setActivities] = useState([
        { id: 1, user: 'Alex Chen', action: 'updated decline model', target: 'Well A-101', time: '10m ago' },
        { id: 2, user: 'Sarah Miller', action: 'added comment', target: 'Scenario 2', time: '1h ago' },
        { id: 3, user: 'James Wilson', action: 'viewed report', target: 'Q3 Forecast', time: '2h ago' },
        { id: 4, user: 'Alex Chen', action: 'imported data', target: 'Production.csv', time: '1d ago' }
    ]);

    const [comments, setComments] = useState([
        { id: 1, user: 'Sarah Miller', text: 'The b-factor looks too high on this hyperbolic fit. Should we constrain it to 1.2?', time: '1h ago', initials: 'SM' }
    ]);
    const [newComment, setNewComment] = useState("");

    const handleSendComment = () => {
        if (!newComment.trim()) return;
        setComments([...comments, {
            id: Date.now(),
            user: 'You',
            text: newComment,
            time: 'Just now',
            initials: 'ME'
        }]);
        setNewComment("");
    };

    return (
        <div className="h-full grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-4">
                {/* Team Members */}
                <Card className="bg-slate-900 border-slate-800 flex-1">
                    <CardHeader className="py-3 px-4 border-b border-slate-800 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                            <Users className="w-4 h-4 text-blue-400" /> Project Team
                        </CardTitle>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-white">
                            <UserPlus className="w-4 h-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-slate-800">
                            {members.map(member => (
                                <div key={member.id} className="p-3 flex items-center justify-between hover:bg-slate-800/50">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <Avatar className="h-8 w-8 bg-slate-700">
                                                <AvatarFallback className="text-xs bg-slate-700 text-slate-300">{member.initials}</AvatarFallback>
                                            </Avatar>
                                            {member.status === 'online' && (
                                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-slate-900 rounded-full"></span>
                                            )}
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-slate-200">{member.name}</div>
                                            <div className="text-xs text-slate-500">{member.role}</div>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-400">
                                        {member.role}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                        <div className="p-3 border-t border-slate-800">
                            <Button variant="outline" size="sm" className="w-full text-xs border-slate-700 bg-slate-900 hover:bg-slate-800">
                                <Share2 className="w-3 h-3 mr-2" /> Share Project Link
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Activity Feed */}
                <Card className="bg-slate-900 border-slate-800 flex-1">
                    <CardHeader className="py-3 px-4 border-b border-slate-800">
                        <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-emerald-400" /> Recent Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <ScrollArea className="h-[250px]">
                            <div className="divide-y divide-slate-800">
                                {activities.map(act => (
                                    <div key={act.id} className="p-3 flex gap-3 text-xs">
                                        <div className="min-w-[40px] text-slate-500 text-[10px] pt-0.5">{act.time}</div>
                                        <div>
                                            <span className="font-semibold text-slate-300">{act.user}</span>
                                            <span className="text-slate-400"> {act.action} </span>
                                            <span className="text-blue-400">{act.target}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>

            {/* Comments & Discussion */}
            <Card className="bg-slate-900 border-slate-800 flex flex-col h-full">
                <CardHeader className="py-3 px-4 border-b border-slate-800">
                    <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-amber-400" /> Discussion
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0 flex-1 flex flex-col min-h-0">
                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                            {comments.map(comment => (
                                <div key={comment.id} className="flex gap-3">
                                    <Avatar className="h-8 w-8 mt-1">
                                        <AvatarFallback className="text-xs bg-slate-700 text-slate-300">{comment.initials}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-baseline justify-between mb-1">
                                            <span className="text-sm font-semibold text-slate-200">{comment.user}</span>
                                            <span className="text-[10px] text-slate-500">{comment.time}</span>
                                        </div>
                                        <div className="bg-slate-800/50 rounded-lg p-3 text-sm text-slate-300">
                                            {comment.text}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                    <div className="p-3 border-t border-slate-800 bg-slate-950 flex gap-2">
                        <Input 
                            placeholder="Type a comment..." 
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
                            className="bg-slate-900 border-slate-700 text-sm"
                        />
                        <Button size="icon" className="bg-blue-600 hover:bg-blue-700" onClick={handleSendComment}>
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default CollaborationPanel;