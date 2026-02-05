import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Trash2, Plus, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const QuestionEditor = ({ question, onSave, onCancel }) => {
    const [text, setText] = useState('');
    const [points, setPoints] = useState(1);
    const [options, setOptions] = useState([
        { option_text: '', is_correct: false },
        { option_text: '', is_correct: false },
        { option_text: '', is_correct: false },
        { option_text: '', is_correct: false }
    ]);

    useEffect(() => {
        if (question) {
            setText(question.question_text);
            setPoints(question.points || 1);
            if (question.options && question.options.length > 0) {
                setOptions(question.options.map(o => ({
                    option_text: o.option_text,
                    is_correct: o.is_correct
                })));
            }
        }
    }, [question]);

    const handleOptionChange = (idx, val) => {
        const newOpts = [...options];
        newOpts[idx].option_text = val;
        setOptions(newOpts);
    };

    const setCorrectOption = (idx) => {
        const newOpts = options.map((opt, i) => ({
            ...opt,
            is_correct: i === idx
        }));
        setOptions(newOpts);
    };

    const addOption = () => {
        setOptions([...options, { option_text: '', is_correct: false }]);
    };

    const removeOption = (idx) => {
        if (options.length <= 2) return;
        setOptions(options.filter((_, i) => i !== idx));
    };

    const handleSave = () => {
        if (!text.trim()) return;
        // Validate at least one correct answer
        if (!options.some(o => o.is_correct)) {
            alert("Please mark one option as correct.");
            return;
        }
        
        onSave({
            id: question?.id,
            question_text: text,
            points: parseInt(points)
        }, options);
    };

    return (
        <div className="bg-[#1E293B] p-6 rounded-lg border border-slate-700 space-y-6">
            <h4 className="text-lg font-semibold text-white mb-4">
                {question ? 'Edit Question' : 'New Question'}
            </h4>
            
            <div className="space-y-2">
                <Label>Question Text</Label>
                <Textarea 
                    value={text} 
                    onChange={(e) => setText(e.target.value)}
                    placeholder="e.g., What is the primary function of casing?"
                    className="bg-[#0F172A] border-slate-600 min-h-[80px]"
                />
            </div>

            <div className="space-y-2">
                <Label>Points</Label>
                <Input 
                    type="number" 
                    value={points} 
                    onChange={(e) => setPoints(e.target.value)}
                    className="bg-[#0F172A] border-slate-600 w-32"
                    min={1}
                />
            </div>

            <div className="space-y-3">
                <Label>Answer Options</Label>
                <div className="space-y-3">
                    {options.map((opt, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                            <div 
                                onClick={() => setCorrectOption(idx)}
                                className={cn(
                                    "w-6 h-6 rounded-full border flex items-center justify-center cursor-pointer transition-colors",
                                    opt.is_correct ? "bg-emerald-500 border-emerald-500" : "border-slate-500 hover:border-slate-300"
                                )}
                            >
                                {opt.is_correct && <CheckCircle2 className="w-4 h-4 text-white" />}
                            </div>
                            <Input 
                                value={opt.option_text}
                                onChange={(e) => handleOptionChange(idx, e.target.value)}
                                placeholder={`Option ${idx + 1}`}
                                className={cn(
                                    "flex-1 bg-[#0F172A]",
                                    opt.is_correct ? "border-emerald-500 ring-1 ring-emerald-500/50" : "border-slate-600"
                                )}
                            />
                            <Button 
                                type="button" 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => removeOption(idx)}
                                disabled={options.length <= 2}
                                className="text-slate-500 hover:text-red-400"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addOption} className="mt-2 border-slate-700">
                    <Plus className="w-4 h-4 mr-2" /> Add Option
                </Button>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                <Button variant="ghost" onClick={onCancel}>Cancel</Button>
                <Button onClick={handleSave} className="bg-[#BFFF00] text-black hover:bg-[#a3d900]">Save Question</Button>
            </div>
        </div>
    );
};

export default QuestionEditor;