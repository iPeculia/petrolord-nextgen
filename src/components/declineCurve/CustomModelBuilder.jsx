import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FunctionSquare, Save, Play, Plus, Trash } from 'lucide-react';

const CustomModelBuilder = () => {
    const [modelName, setModelName] = useState("");
    const [equation, setEquation] = useState("q = qi * Math.exp(-Di * t)");
    const [params, setParams] = useState([{ name: 'qi', default: 100 }, { name: 'Di', default: 0.1 }]);
    const [testResult, setTestResult] = useState(null);

    const handleAddParam = () => setParams([...params, { name: '', default: 0 }]);
    const handleRemoveParam = (idx) => setParams(params.filter((_, i) => i !== idx));
    const handleParamChange = (idx, field, val) => {
        const newParams = [...params];
        newParams[idx][field] = val;
        setParams(newParams);
    };

    const handleTest = () => {
        try {
            // Unsafe eval for demo - in production use mathjs or restricted scope
            // Construct function
            const paramNames = params.map(p => p.name).join(',');
            const funcBody = `return ${equation.replace('q =', '')};`;
            const func = new Function('t', ...params.map(p => p.name), funcBody);
            
            // Test at t=10
            const t = 10;
            const paramValues = params.map(p => parseFloat(p.default));
            const result = func(t, ...paramValues);
            
            setTestResult(`Success! q(t=${t}) = ${result.toFixed(2)}`);
        } catch (err) {
            setTestResult(`Error: ${err.message}`);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="py-3 px-4 border-b border-slate-800">
                    <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <FunctionSquare className="w-4 h-4 text-purple-400" /> Equation Editor
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                    <div className="space-y-2">
                        <Label>Model Name</Label>
                        <Input value={modelName} onChange={(e) => setModelName(e.target.value)} placeholder="e.g. Modified Arps" className="bg-slate-950 border-slate-700"/>
                    </div>
                    <div className="space-y-2">
                        <Label>Equation (JS Syntax)</Label>
                        <Textarea 
                            value={equation} 
                            onChange={(e) => setEquation(e.target.value)} 
                            className="bg-slate-950 border-slate-700 font-mono text-sm h-32" 
                        />
                        <p className="text-[10px] text-slate-500">Available: Math.exp, Math.pow, Math.log, etc. Input variable: t</p>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800 flex flex-col">
                <CardHeader className="py-3 px-4 border-b border-slate-800 flex flex-row justify-between items-center">
                    <CardTitle className="text-sm font-medium text-slate-300">Parameters</CardTitle>
                    <Button size="sm" variant="ghost" onClick={handleAddParam}><Plus className="w-4 h-4"/></Button>
                </CardHeader>
                <CardContent className="p-4 flex-1 space-y-4">
                    <div className="space-y-2">
                        {params.map((p, i) => (
                            <div key={i} className="flex gap-2">
                                <Input value={p.name} onChange={(e) => handleParamChange(i, 'name', e.target.value)} placeholder="Name" className="bg-slate-950 border-slate-700 w-24"/>
                                <Input value={p.default} onChange={(e) => handleParamChange(i, 'default', e.target.value)} placeholder="Default" className="bg-slate-950 border-slate-700 flex-1"/>
                                <Button size="icon" variant="ghost" className="hover:text-red-400" onClick={() => handleRemoveParam(i)}><Trash className="w-4 h-4"/></Button>
                            </div>
                        ))}
                    </div>
                    
                    <div className="pt-4 border-t border-slate-800 space-y-2">
                        <div className="flex gap-2">
                             <Button className="flex-1 bg-slate-800 hover:bg-slate-700" onClick={handleTest}>
                                <Play className="w-4 h-4 mr-2" /> Test
                            </Button>
                             <Button className="flex-1 bg-blue-600 hover:bg-blue-500">
                                <Save className="w-4 h-4 mr-2" /> Save Model
                            </Button>
                        </div>
                        {testResult && (
                            <div className={`text-xs p-2 rounded ${testResult.startsWith('Error') ? 'bg-red-900/20 text-red-400' : 'bg-green-900/20 text-green-400'}`}>
                                {testResult}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default CustomModelBuilder;