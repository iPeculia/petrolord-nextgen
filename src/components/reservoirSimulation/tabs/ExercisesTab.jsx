import React, { memo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen, CheckCircle, ArrowRight } from 'lucide-react';
import { useReservoirSimulation } from '@/context/ReservoirSimulationContext';

const ExercisesTab = memo(() => {
    const { state, dispatch } = useReservoirSimulation();
    const { exercises = [] } = state;

    const handleStartExercise = (exercise) => {
        dispatch({ type: 'SELECT_EXERCISE', payload: exercise });
        // Also load the associated model if linked
        if (exercise.baseModelId) {
             const model = state.models.find(m => m.id === exercise.baseModelId);
             if (model) {
                 dispatch({ type: 'LOAD_SAMPLE_MODEL', payload: model });
                 dispatch({ type: 'SET_ACTIVE_TAB', payload: 'lab' });
             }
        }
    };

    return (
        <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
                <div className="mb-4">
                    <h3 className="text-sm font-semibold text-slate-200">Learning Modules</h3>
                    <p className="text-xs text-slate-500">Structured exercises to master reservoir concepts.</p>
                </div>

                {exercises.map((ex) => (
                    <Card key={ex.id} className="bg-slate-900/50 border-slate-800 hover:border-emerald-500/30 transition-all">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-sm font-medium text-slate-200">{ex.title}</CardTitle>
                                <Badge variant="outline" className={`text-[10px] ${
                                    ex.difficulty === 'Easy' ? 'border-green-500/30 text-green-400' :
                                    ex.difficulty === 'Intermediate' ? 'border-yellow-500/30 text-yellow-400' :
                                    'border-red-500/30 text-red-400'
                                }`}>
                                    {ex.difficulty}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="text-xs text-slate-400 line-clamp-2">{ex.description}</p>
                            
                            <div className="space-y-1">
                                {ex.objectives.slice(0, 2).map((obj, i) => (
                                    <div key={i} className="flex items-center text-[10px] text-slate-500">
                                        <CheckCircle className="w-3 h-3 mr-1.5 text-emerald-500/50" />
                                        {obj}
                                    </div>
                                ))}
                            </div>

                            <Button 
                                size="sm" 
                                className="w-full h-8 text-xs bg-slate-800 hover:bg-emerald-600 hover:text-white transition-colors"
                                onClick={() => handleStartExercise(ex)}
                            >
                                <BookOpen className="w-3 h-3 mr-1.5" /> Start Exercise
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </ScrollArea>
    );
});

export default ExercisesTab;