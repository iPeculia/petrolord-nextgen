import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2, Plus, Trash2, GripVertical } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { quizService } from '@/services/quizService';
import QuestionEditor from './QuestionEditor';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const QuizEditorModal = ({ isOpen, onClose, lessonId, courseId, lessonTitle }) => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [editingQuestion, setEditingQuestion] = useState(null); // id or 'new'
    
    // Form for Quiz Settings
    const { register, handleSubmit, setValue, watch } = useForm({
        defaultValues: {
            passing_score: 80,
            duration_minutes: 30,
            shuffle_questions: false,
            show_correct_answers: true,
            is_published: false
        }
    });

    const loadQuiz = async () => {
        setIsLoading(true);
        try {
            const data = await quizService.getQuizByLessonId(lessonId);
            if (data) {
                setQuiz(data);
                setQuestions(data.questions || []);
                setValue('passing_score', data.passing_score);
                setValue('duration_minutes', data.duration_minutes);
                setValue('shuffle_questions', data.shuffle_questions);
                setValue('show_correct_answers', data.show_correct_answers);
                setValue('is_published', data.is_published);
            } else {
                // Initialize default quiz if none exists
                const newQuiz = await quizService.createOrUpdateQuiz({
                    lesson_id: lessonId,
                    course_id: courseId,
                    title: `${lessonTitle} Quiz`,
                    description: `Assessment for ${lessonTitle}`,
                    passing_score: 80,
                    duration_minutes: 30,
                    is_published: false
                });
                setQuiz(newQuiz);
            }
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to load quiz data", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && lessonId) {
            loadQuiz();
        }
    }, [isOpen, lessonId]);

    const onSettingsSubmit = async (data) => {
        if (!quiz) return;
        try {
            await quizService.createOrUpdateQuiz({
                id: quiz.id,
                lesson_id: lessonId,
                course_id: courseId,
                ...data
            });
            toast({ title: "Success", description: "Quiz settings updated." });
        } catch (error) {
            toast({ title: "Error", description: "Failed to save settings.", variant: "destructive" });
        }
    };

    const handleQuestionSave = async (questionData, options) => {
        try {
            await quizService.saveQuestion({
                ...questionData,
                quiz_id: quiz.id,
                order_index: questionData.order_index ?? questions.length
            }, options);
            
            await loadQuiz(); // Refresh
            setEditingQuestion(null);
            toast({ title: "Saved", description: "Question saved successfully." });
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to save question.", variant: "destructive" });
        }
    };

    const deleteQuestion = async (id) => {
        try {
            await quizService.deleteQuestion(id);
            setQuestions(prev => prev.filter(q => q.id !== id));
            toast({ title: "Deleted", description: "Question removed." });
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete question.", variant: "destructive" });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#0F172A] border-slate-700 text-white sm:max-w-[900px] h-[90vh] flex flex-col p-0 overflow-hidden">
                <div className="p-6 border-b border-slate-800">
                    <DialogHeader>
                        <DialogTitle>Quiz Editor: {lessonTitle}</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Configure quiz settings and manage questions.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                {isLoading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-[#BFFF00]" />
                    </div>
                ) : (
                    <div className="flex-1 flex overflow-hidden">
                        {/* Sidebar: Settings */}
                        <div className="w-1/3 border-r border-slate-800 p-6 overflow-y-auto bg-[#1E293B]/30">
                            <h3 className="font-semibold text-lg mb-4 text-[#BFFF00]">Settings</h3>
                            <form className="space-y-6">
                                <div className="space-y-2">
                                    <Label>Passing Score (%)</Label>
                                    <Input 
                                        type="number" 
                                        {...register('passing_score')} 
                                        className="bg-[#0F172A] border-slate-600"
                                        onBlur={handleSubmit(onSettingsSubmit)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Duration (minutes)</Label>
                                    <Input 
                                        type="number" 
                                        {...register('duration_minutes')} 
                                        className="bg-[#0F172A] border-slate-600"
                                        onBlur={handleSubmit(onSettingsSubmit)}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label>Shuffle Questions</Label>
                                    <Switch 
                                        checked={watch('shuffle_questions')}
                                        onCheckedChange={(v) => { setValue('shuffle_questions', v); handleSubmit(onSettingsSubmit)(); }}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label>Show Correct Answers</Label>
                                    <Switch 
                                        checked={watch('show_correct_answers')}
                                        onCheckedChange={(v) => { setValue('show_correct_answers', v); handleSubmit(onSettingsSubmit)(); }}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label>Published</Label>
                                    <Switch 
                                        checked={watch('is_published')}
                                        onCheckedChange={(v) => { setValue('is_published', v); handleSubmit(onSettingsSubmit)(); }}
                                    />
                                </div>
                            </form>
                        </div>

                        {/* Main: Questions */}
                        <div className="flex-1 flex flex-col bg-[#0F172A]">
                            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-[#1E293B]/50">
                                <h3 className="font-semibold">Questions ({questions.length})</h3>
                                <Button size="sm" onClick={() => setEditingQuestion('new')} className="bg-[#BFFF00] text-black hover:bg-[#a3d900]">
                                    <Plus className="w-4 h-4 mr-2" /> Add Question
                                </Button>
                            </div>
                            
                            <ScrollArea className="flex-1 p-4">
                                {editingQuestion ? (
                                    <QuestionEditor 
                                        question={editingQuestion === 'new' ? null : questions.find(q => q.id === editingQuestion)}
                                        onSave={handleQuestionSave}
                                        onCancel={() => setEditingQuestion(null)}
                                    />
                                ) : (
                                    <div className="space-y-3">
                                        {questions.length === 0 ? (
                                            <div className="text-center py-10 text-slate-500 border border-dashed border-slate-800 rounded-lg">
                                                No questions yet. Click "Add Question" to begin.
                                            </div>
                                        ) : (
                                            questions.map((q, index) => (
                                                <div key={q.id} className="bg-[#1E293B] p-4 rounded-lg border border-slate-800 flex items-start gap-3 group">
                                                    <div className="mt-1 text-slate-500 cursor-move">
                                                        <GripVertical className="w-4 h-4" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start">
                                                            <p className="font-medium text-slate-200 line-clamp-2">{index + 1}. {q.question_text}</p>
                                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <Button size="xs" variant="ghost" onClick={() => setEditingQuestion(q.id)}>Edit</Button>
                                                                <Button size="xs" variant="ghost" className="text-red-400 hover:text-red-300" onClick={() => deleteQuestion(q.id)}>
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        <div className="mt-2 text-xs text-slate-500 flex gap-4">
                                                            <span>Points: {q.points || 1}</span>
                                                            <span>Options: {q.options?.length || 0}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </ScrollArea>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default QuizEditorModal;