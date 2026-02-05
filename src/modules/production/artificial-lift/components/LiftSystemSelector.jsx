import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Wind, Cog } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useArtificialLift } from '../context/ArtificialLiftContext';

const LiftSystemSelector = () => {
  const { currentWellId } = useArtificialLift();
  const [selectedSystem, setSelectedSystem] = React.useState(null);
  const [selectedSubOption, setSelectedSubOption] = React.useState(null);

  const systems = [
    {
      id: 'ESP',
      title: 'Electric Submersible Pump',
      description: 'Centrifugal pump powered by electric motor',
      icon: Activity,
      color: 'text-blue-500',
      options: ['Single Stage', 'Multi Stage']
    },
    {
      id: 'GasLift',
      title: 'Gas Lift',
      description: 'Inject gas to reduce fluid density',
      icon: Wind,
      color: 'text-emerald-500',
      options: ['Casing Valve', 'Tubing Valve']
    },
    {
      id: 'RodPump',
      title: 'Rod Pump',
      description: 'Positive displacement pump with sucker rods',
      icon: Cog,
      color: 'text-amber-500',
      options: ['Tubing Pump', 'Casing Pump']
    }
  ];

  if (!currentWellId) {
      return (
          <div className="p-8 text-center border border-dashed border-slate-700 rounded-lg bg-slate-900/50">
              <p className="text-slate-400">Please select or create a well first to configure lift systems.</p>
          </div>
      );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {systems.map((sys) => {
          const Icon = sys.icon;
          const isSelected = selectedSystem === sys.id;
          
          return (
            <Card 
              key={sys.id}
              className={cn(
                "cursor-pointer transition-all duration-200 bg-slate-800/50 border-slate-700 hover:border-slate-500",
                isSelected && "border-blue-500 bg-slate-800 ring-2 ring-blue-500/20"
              )}
              onClick={() => {
                setSelectedSystem(sys.id);
                setSelectedSubOption(null);
              }}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Icon className={`w-8 h-8 ${sys.color} mb-2`} />
                  {isSelected && <Badge variant="default" className="bg-blue-600">Selected</Badge>}
                </div>
                <CardTitle className="text-lg text-white">{sys.title}</CardTitle>
                <CardDescription className="text-slate-400">{sys.description}</CardDescription>
              </CardHeader>
              
              {isSelected && (
                <CardContent className="pt-0 animate-in slide-in-from-top-2">
                  <div className="space-y-2 mt-2 pt-4 border-t border-slate-700">
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Configuration</p>
                    <div className="grid grid-cols-1 gap-2">
                      {sys.options.map((opt) => (
                        <button
                          key={opt}
                          className={cn(
                            "text-sm text-left px-3 py-2 rounded-md transition-colors",
                            selectedSubOption === opt 
                              ? "bg-blue-600/20 text-blue-400 border border-blue-600/30" 
                              : "bg-slate-900/50 text-slate-300 hover:bg-slate-700"
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSubOption(opt);
                          }}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default LiftSystemSelector;