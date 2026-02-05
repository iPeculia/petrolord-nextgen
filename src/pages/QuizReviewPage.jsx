import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizService } from '@/services/quizService';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/customSupabaseClient';

const QuizReviewPage = () => {
    const { attemptId, courseId } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                // Get Attempt
                const attempt = await quizService.getAttemptResults(attemptId);
                // Get Full Quiz Details (to see options)
                const quizDetails = await quizService.getQuizByLessonId(attempt.quiz.lesson_id);
                
                setData({ attempt, quiz: quizDetails });
                setQuestions(quizDetails.questions);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [attemptId]);

    if (loading) return <div className="h-screen flex items-center justify-center bg-[#0F172A]"><Loader2 className="w-10 h-10 text-[#BFFF00] animate-spin" /></div>;

    const { attempt } = data;
    const userAnswers = attempt.answers || []; // array of { question_id, selected_option_id, is_correct }

    return (
        <div className="min-h-screen bg-[#0F172A] text-white">
            <header className="bg-[#1E293B] border-b border-slate-800 p-4 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(`/courses/${courseId}/quiz/${attemptId}/results`)}>
                        <ArrowLeft className="w-5 h-5 text-slate-400" />
                    </Button>
                    <h1 className="font-bold text-lg">Review: {data.quiz.title}</h1>
                </div>
            </header>

            <div className="max-w-4xl mx-auto p-6 space-y-8 pb-20">
                {questions.map((q, idx) => {
                    const userAnswer = userAnswers.find(a => a.question_id === q.id);
                    const isCorrect = userAnswer?.is_correct;
                    
                    return (
                        <div key={q.id} className={cn("p-6 rounded-xl border-l-4 bg-[#1E293B]", isCorrect ? "border-l-emerald-500" : "border-l-red-500")}>
                            <div className="flex gap-4 mb-4">
                                <span className="font-mono text-slate-500">Q{idx + 1}</span>
                                <div className="flex-1">
                                    <h3 className="text-lg font-medium">{q.question_text}</h3>
                                </div>
                                <div className={cn("px-3 py-1 rounded text-xs font-bold uppercase h-fit", isCorrect ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400")}>
                                    {isCorrect ? 'Correct' : 'Incorrect'}
                                </div>
                            </div>

                            <div className="space-y-2">
                                {q.options.map(opt => {
                                    const isSelected = userAnswer?.selected_option_id === opt.id;
                                    const isTargetCorrect = opt.is_correct;
                                    
                                    let style = "border-slate-700 bg-slate-900/50";
                                    let icon = null;

                                    if (isSelected && isTargetCorrect) {
                                        style = "border-emerald-500 bg-emerald-500/10";
                                        icon = <Check className="w-4 h-4 text-emerald-500" />;
                                    } else if (isSelected && !isTargetCorrect) {
                                        style = "border-red-500 bg-red-500/10";
                                        icon = <X className="w-4 h-4 text-red-500" />;
                                    } else if (!isSelected && isTargetCorrect) {
                                        style = "border-emerald-500 border-dashed opacity-70";
                                        icon = <Check className="w-4 h-4 text-emerald-500" />;
                                    }

                                    return (
                                        <div key={opt.id} className={cn("p-3 rounded-lg border flex items-center justify-between", style)}>
                                            <span className={cn("text-sm", isSelected ? "font-semibold text-white" : "text-slate-400")}>
                                                {opt.option_text}
                                            </span>
                                            {icon}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default QuizReviewPage;