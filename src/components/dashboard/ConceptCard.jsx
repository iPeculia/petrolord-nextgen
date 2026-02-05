import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Droplets, Layers, Wind, Gauge, Activity, Box, Zap, Scale, ChevronRight, Waves, ArrowRight } from 'lucide-react';

const iconMap = {
  Droplets, Layers, Wind, Gauge, Activity, Box, Zap, Scale, ChevronRight, Waves
};

const ConceptCard = ({ concept }) => {
  const IconComponent = iconMap[concept.icon] || Box;

  const getDifficultyColor = (level) => {
    switch(level) {
      case 'Beginner': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Intermediate': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Advanced': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default: return 'bg-slate-500/10 text-slate-400';
    }
  };

  return (
    <Card className="bg-slate-900/40 border-slate-800 hover:bg-slate-900/60 hover:border-slate-700 transition-all group flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <div className="p-2 rounded-lg bg-slate-800 text-slate-300 group-hover:text-white group-hover:bg-blue-600 transition-colors">
            <IconComponent className="w-5 h-5" />
          </div>
          <Badge variant="outline" className={`${getDifficultyColor(concept.difficulty)} border`}>
            {concept.difficulty}
          </Badge>
        </div>
        <CardTitle className="text-lg text-slate-100">{concept.title}</CardTitle>
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{concept.category}</p>
      </CardHeader>
      
      <CardContent className="flex-1 space-y-4">
        <p className="text-sm text-slate-400 line-clamp-3">
          {concept.description}
        </p>
        
        {concept.formula && concept.formula !== 'N/A' && (
          <div className="bg-slate-950/50 rounded p-2 border border-slate-800">
            <p className="text-xs text-slate-500 mb-1 font-mono">Formula:</p>
            <p className="text-sm font-mono text-emerald-400">{concept.formula}</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-2">
        <Button variant="ghost" className="w-full justify-between text-slate-400 hover:text-white hover:bg-slate-800 group-hover:bg-slate-800/50">
          <span className="text-xs">Learn Concept</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ConceptCard;