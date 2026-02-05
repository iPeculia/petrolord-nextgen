import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizService } from '@/services/quizService';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, Award, XCircle, RotateCcw, ChevronLeft, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import Confetti from 'react-confetti';

const QuizResultsPage = () => {
    const { attemptId, courseId } = useParams();
    const navigate = useNavigate();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await quizService.getAttemptResults(attemptId);
                setResult(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [attemptId]);

    if (loading) return <div className="h-screen flex items-center justify-center bg-[#0F172A]"><Loader2 className="w-10 h-10 text-[#BFFF00] animate-spin" /></div>;
    if (!result) return <div>Result not found</div>;

    const { score, passed, quiz } = result;

    return (
        <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
            {passed && <Confetti numberOfPieces={200} recycle={false} />}
            
            <Card className="max-w-md w-full bg-[#1E293B] border-slate-800 p-8 text-center space-y-6 shadow-2xl">
                <div className="flex justify-center">
                    {passed ? (
                        <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center border-4 border-emerald-500">
                            <Award className="w-12 h-12 text-emerald-500" />
                        </div>
                    ) : (
                        <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center border-4 border-red-500">
                            <XCircle className="w-12 h-12 text-red-500" />
                        </div>
                    )}
                </div>

                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{passed ? 'Congratulations!' : 'Keep Trying!'}</h1>
                    <p className="text-slate-400">
                        {passed ? 'You passed the assessment.' : 'You did not meet the passing score.'}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-700/50">
                    <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">Your Score</p>
                        <p className={cn("text-3xl font-bold", passed ? "text-emerald-400" : "text-red-400")}>{score}%</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">Required</p>
                        <p className="text-3xl font-bold text-slate-300">{quiz.passing_score}%</p>
                    </div>
                </div>

                <div className="space-y-3">
                    {quiz.show_correct_answers && (
                        <Button variant="outline" className="w-full border-slate-700 text-white hover:bg-slate-800" onClick={() => navigate(`/courses/${courseId}/quiz/${attemptId}/review`)}>
                            <Eye className="w-4 h-4 mr-2" /> Review Answers
                        </Button>
                    )}
                    
                    {!passed && (
                        <Button className="w-full bg-[#BFFF00] text-black hover:bg-[#a3d900]" onClick={() => navigate(-1)}>
                            <RotateCcw className="w-4 h-4 mr-2" /> Retake Quiz
                        </Button>
                    )}
                    
                    <Button variant="ghost" className="w-full text-slate-400 hover:text-white" onClick={() => navigate(`/courses/${courseId}`)}>
                        <ChevronLeft className="w-4 h-4 mr-2" /> Return to Course
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default QuizResultsPage;