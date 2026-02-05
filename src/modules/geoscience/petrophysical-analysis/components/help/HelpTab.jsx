import React, { useState } from 'react';
import { useDocumentationStore } from '@/store/documentationStore';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
    Book, HelpCircle, PlayCircle, MessageCircle, Search, 
    FileText, ThumbsUp, Send, Video
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const HelpTab = () => {
    const { docs, faqs, tutorials, tickets, addTicket, voteFaq } = useDocumentationStore();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState('docs');
    const [searchQuery, setSearchQuery] = useState('');
    const [ticketForm, setTicketForm] = useState({ subject: '', message: '', priority: 'Medium' });

    // Search Logic
    const filteredDocs = docs.filter(d => d.title.toLowerCase().includes(searchQuery.toLowerCase()));
    const filteredFaqs = faqs.filter(f => f.question.toLowerCase().includes(searchQuery.toLowerCase()));

    const handleTicketSubmit = () => {
        if(!ticketForm.subject || !ticketForm.message) return;
        addTicket(ticketForm);
        setTicketForm({ subject: '', message: '', priority: 'Medium' });
        toast({ title: "Ticket Submitted", description: "Support team will review your request." });
    };

    return (
        <div className="flex flex-col h-full bg-[#0B101B] text-slate-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg"><HelpCircle className="w-6 h-6 text-purple-400" /></div>
                    <div><h2 className="text-lg font-semibold text-white">Help Center</h2><p className="text-xs text-slate-400">Documentation & Support</p></div>
                </div>
                <div className="relative w-64">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <Input className="pl-9 bg-slate-900 border-slate-800" placeholder="Search help..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </div>
            </div>

            <div className="flex-1 p-6 overflow-hidden">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
                    <TabsList className="bg-slate-900 border border-slate-800 w-fit mb-6">
                        <TabsTrigger value="docs" className="flex items-center gap-2"><Book className="w-4 h-4"/> Docs</TabsTrigger>
                        <TabsTrigger value="faq" className="flex items-center gap-2"><HelpCircle className="w-4 h-4"/> FAQ</TabsTrigger>
                        <TabsTrigger value="tutorials" className="flex items-center gap-2"><PlayCircle className="w-4 h-4"/> Tutorials</TabsTrigger>
                        <TabsTrigger value="support" className="flex items-center gap-2"><MessageCircle className="w-4 h-4"/> Support</TabsTrigger>
                    </TabsList>

                    <div className="flex-1 overflow-y-auto pb-20">
                        {/* DOCUMENTATION TAB */}
                        <TabsContent value="docs" className="mt-0">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-1 space-y-2">
                                    <h3 className="font-semibold text-white mb-4 px-2">Categories</h3>
                                    {['General', 'Data Management', 'Workflows', 'Analysis', 'Reporting'].map(cat => (
                                        <Button key={cat} variant="ghost" className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800">
                                            <FileText className="w-4 h-4 mr-2"/> {cat}
                                        </Button>
                                    ))}
                                </div>
                                <div className="md:col-span-2 space-y-4">
                                    {filteredDocs.map(doc => (
                                        <Card key={doc.id} className="bg-slate-900 border-slate-800 hover:border-slate-700 cursor-pointer transition-colors">
                                            <CardHeader>
                                                <div className="flex justify-between items-start"><CardTitle className="text-white text-lg">{doc.title}</CardTitle><Badge variant="secondary" className="bg-slate-800 text-slate-400">{doc.category}</Badge></div>
                                                <CardDescription className="line-clamp-2 mt-2">{doc.content}</CardDescription>
                                            </CardHeader>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>

                        {/* FAQ TAB */}
                        <TabsContent value="faq" className="mt-0">
                             <Card className="bg-slate-900 border-slate-800">
                                <CardContent className="p-6">
                                    <Accordion type="single" collapsible className="w-full">
                                        {filteredFaqs.map(faq => (
                                            <AccordionItem key={faq.id} value={faq.id} className="border-slate-800">
                                                <AccordionTrigger className="text-white hover:text-indigo-400 text-left">{faq.question}</AccordionTrigger>
                                                <AccordionContent className="text-slate-400">
                                                    <p className="mb-4">{faq.answer}</p>
                                                    <div className="flex items-center gap-4 text-xs">
                                                        <span className="bg-slate-800 px-2 py-1 rounded text-slate-500">{faq.category}</span>
                                                        <button onClick={() => { voteFaq(faq.id); toast({title: "Thanks for feedback!"}); }} className="flex items-center gap-1 text-slate-500 hover:text-emerald-400"><ThumbsUp className="w-3 h-3" /> Helpful ({faq.votes})</button>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* TUTORIALS TAB */}
                        <TabsContent value="tutorials" className="mt-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {tutorials.map(t => (
                                    <Card key={t.id} className="bg-slate-900 border-slate-800 overflow-hidden group">
                                        <div className="h-40 bg-slate-950 flex items-center justify-center relative group-hover:bg-slate-800 transition-colors">
                                            <Video className="w-12 h-12 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                                            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">{t.duration}</div>
                                        </div>
                                        <CardHeader className="p-4">
                                            <CardTitle className="text-white text-base">{t.title}</CardTitle>
                                            <div className="flex items-center gap-2 mt-2"><Badge variant="outline" className="text-xs border-slate-700 text-slate-400">{t.level}</Badge><span className="text-xs text-slate-500">{t.views} views</span></div>
                                        </CardHeader>
                                        <CardFooter className="p-4 pt-0"><Button variant="secondary" className="w-full bg-slate-800 hover:bg-slate-700 text-white"><PlayCircle className="w-4 h-4 mr-2"/> Watch Now</Button></CardFooter>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        {/* SUPPORT TAB */}
                        <TabsContent value="support" className="mt-0">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 space-y-6">
                                    <Card className="bg-slate-900 border-slate-800">
                                        <CardHeader><CardTitle className="text-white">Submit a Ticket</CardTitle><CardDescription>Describe your issue and our team will assist you.</CardDescription></CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2"><Label>Subject</Label><Input value={ticketForm.subject} onChange={e => setTicketForm({...ticketForm, subject: e.target.value})} className="bg-slate-950 border-slate-700" placeholder="Brief summary..."/></div>
                                                <div className="space-y-2"><Label>Priority</Label><Select value={ticketForm.priority} onValueChange={v => setTicketForm({...ticketForm, priority: v})}><SelectTrigger className="bg-slate-950 border-slate-700"><SelectValue /></SelectTrigger><SelectContent className="bg-slate-900 border-slate-800"><SelectItem value="Low">Low</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="High">High</SelectItem></SelectContent></Select></div>
                                            </div>
                                            <div className="space-y-2"><Label>Message</Label><Textarea value={ticketForm.message} onChange={e => setTicketForm({...ticketForm, message: e.target.value})} className="bg-slate-950 border-slate-700 min-h-[150px]" placeholder="Detailed description..."/></div>
                                            <Button onClick={handleTicketSubmit} className="bg-indigo-600 hover:bg-indigo-500 text-white"><Send className="w-4 h-4 mr-2"/> Submit Ticket</Button>
                                        </CardContent>
                                    </Card>
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-white">Recent Tickets</h3>
                                        {tickets.length === 0 && <div className="text-slate-500 text-sm">No tickets submitted yet.</div>}
                                        {tickets.map(ticket => (
                                            <div key={ticket.id} className="p-4 bg-slate-900 border border-slate-800 rounded-lg flex justify-between items-center">
                                                <div><h4 className="text-white font-medium">{ticket.subject}</h4><div className="text-xs text-slate-500 mt-1">Created: {ticket.created} • ID: #{ticket.id.slice(0,8)}</div></div>
                                                <div className="text-right"><Badge className={`${ticket.status === 'open' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>{ticket.status.toUpperCase()}</Badge><div className="text-xs text-slate-500 mt-1">Priority: {ticket.priority}</div></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <Card className="bg-slate-900 border-slate-800">
                                        <CardHeader><CardTitle className="text-white text-base">Contact Info</CardTitle></CardHeader>
                                        <CardContent className="space-y-4 text-sm text-slate-400">
                                            <div><strong className="text-white block mb-1">Email Support</strong>support@petrolord.com</div>
                                            <div><strong className="text-white block mb-1">Phone</strong>+1 (555) 123-4567</div>
                                            <div><strong className="text-white block mb-1">Hours</strong>Mon-Fri, 9am - 6pm CST</div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
};

export default HelpTab;