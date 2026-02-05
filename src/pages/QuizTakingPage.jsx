import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { quizService } from '@/services/quizService';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const QuizTakingPage = () => {
    const { courseId, lessonId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [quiz, setQuiz] = useState(null);
    const [attempt, setAttempt] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({}); // { questionId: optionId }
    const [timeLeft, setTimeLeft] = useState(null);
    const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

    // Initialize Quiz
    useEffect(() => {
        const init = async () => {
            if (!lessonId || !user) return;
            try {
                // Get Quiz Def
                const quizData = await quizService.getQuizByLessonId(lessonId);
                if (!quizData) {
                    toast({ title: "Error", description: "Quiz not found", variant: "destructive" });
                    navigate(`/courses/${courseId}`);
                    return;
                }
                
                // Shuffle if needed
                let qs = quizData.questions || [];
                if (quizData.shuffle_questions) {
                     qs = [...qs].sort(() => Math.random() - 0.5);
                }
                
                setQuiz(quizData);
                setQuestions(qs);

                // Start/Resume Attempt
                const attemptData = await quizService.startAttempt(quizData.id, user.id);
                setAttempt(attemptData);

                // Load existing answers if resuming? 
                // (Omitted for brevity, assuming new attempts mostly or clean start in MVP)
                
                // Calc Time Left
                if (quizData.duration_minutes) {
                    const start = new Date(attemptData.start_time).getTime();
                    const now = new Date().getTime();
                    const elapsedSec = (now - start) / 1000;
                    const totalSec = quizData.duration_minutes * 60;
                    const remaining = Math.max(0, totalSec - elapsedSec);
                    setTimeLeft(remaining);
                }

            } catch (error) {
                console.error(error);
                toast({ title: "Error", description: "Failed to load quiz." });
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [lessonId, user, courseId, toast, navigate]);

    // Timer Logic
    useEffect(() => {
        if (timeLeft === null) return;
        if (timeLeft <= 0) {
            handleSubmit();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                const updated = prev - 1;
                if (updated === 300) { // 5 mins warning
                    toast({ title: "Time Warning", description: "5 minutes remaining!", variant: "destructive" });
                }
                if (updated === 60) { // 1 min warning
                    toast({ title: "Time Warning", description: "1 minute remaining!", variant: "destructive" });
                }
                if (updated <= 0) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return updated;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleAnswerSelect = async (questionId, optionId) => {
        setAnswers(prev => ({ ...prev, [questionId]: optionId }));
        
        // Autosave
        try {
            await quizService.saveAnswer(attempt.id, questionId, optionId);
        } catch (e) {
            console.error("Autosave failed", e);
        }
    };

    const handleSubmit = async () => {
        if (submitting) return;
        setSubmitting(true);
        setShowSubmitConfirm(false);

        try {
            const result = await quizService.submitAttempt(attempt.id);
            navigate(`/courses/${courseId}/quiz/${attempt.id}/results`);
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to submit quiz.", variant: "destructive" });
            setSubmitting(false);
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center bg-[#0F172A]"><Loader2 className="w-10 h-10 text-[#BFFF00] animate-spin" /></div>;

    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
        <div className="min-h-screen bg-[#0F172A] text-white flex flex-col">
            {/* Header */}
            <div className="bg-[#1E293B] border-b border-slate-800 p-4 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="font-bold text-lg">{quiz.title}</h1>
                        <p className="text-sm text-slate-400">Question {currentQuestionIndex + 1} of {questions.length}</p>
                    </div>
                    {timeLeft !== null && (
                        <div className={cn("flex items-center gap-2 font-mono text-xl font-bold px-4 py-2 rounded bg-slate-900", timeLeft < 60 ? "text-red-500 animate-pulse" : "text-[#BFFF00]")}>
                            <Clock className="w-5 h-5" />
                            {formatTime(timeLeft)}
                        </div>
                    )}
                </div>
                <div className="max-w-4xl mx-auto mt-4">
                    <Progress value={progress} className="h-2" />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 max-w-3xl mx-auto w-full p-6 flex flex-col justify-center">
                {currentQuestion && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <div className="space-y-4">
                            <h2 className="text-2xl font-medium leading-relaxed">{currentQuestion.question_text}</h2>
                            {currentQuestion.points > 1 && <span className="text-sm text-slate-500 uppercase tracking-wider">{currentQuestion.points} Points</span>}
                        </div>

                        <div className="grid gap-3">
                            {currentQuestion.options?.map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => handleAnswerSelect(currentQuestion.id, opt.id)}
                                    className={cn(
                                        "w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between group",
                                        answers[currentQuestion.id] === opt.id 
                                            ? "border-[#BFFF00] bg-[#BFFF00]/5 shadow-[0_0_15px_rgba(191,255,0,0.1)]" 
                                            : "border-slate-700 bg-[#1E293B] hover:border-slate-500"
                                    )}
                                >
                                    <span className={cn("text-lg", answers[currentQuestion.id] === opt.id ? "text-white" : "text-slate-300")}>{opt.option_text}</span>
                                    {answers[currentQuestion.id] === opt.id && <CheckCircle2 className="w-6 h-6 text-[#BFFF00]" />}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="bg-[#1E293B] border-t border-slate-800 p-6">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <Button 
                        variant="ghost" 
                        onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentQuestionIndex === 0}
                        className="text-slate-400 hover:text-white"
                    >
                        Previous
                    </Button>

                    {currentQuestionIndex < questions.length - 1 ? (
                        <Button 
                            onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                            className="bg-white text-black hover:bg-slate-200 min-w-[120px]"
                        >
                            Next Question
                        </Button>
                    ) : (
                        <Button 
                            onClick={() => setShowSubmitConfirm(true)}
                            className="bg-[#BFFF00] text-black hover:bg-[#a3d900] min-w-[120px] font-bold"
                        >
                            Submit Quiz
                        </Button>
                    )}
                </div>
            </div>

            <AlertDialog open={showSubmitConfirm} onOpenChange={setShowSubmitConfirm}>
                <AlertDialogContent className="bg-[#1E293B] border-slate-700 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Submit Quiz?</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400">
                            Are you sure you want to finish? You cannot change your answers after submission.
                            {Object.keys(answers).length < questions.length && (
                                <div className="mt-2 text-yellow-500 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4" />
                                    You have unanswered questions.
                                </div>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-transparent border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white">Review</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSubmit} className="bg-[#BFFF00] text-black hover:bg-[#a3d900]">Submit</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default QuizTakingPage;