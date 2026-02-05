import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Lightbulb, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AnalysisPanel = ({ analysisHook }) => {
  const {
    isAnalyzing,
    selectedAnalysis,
    analyzePanel,
    suggestLines,
  } = analysisHook;

  const renderQualityScore = (result) => (
    <div>
      <h4 className="font-semibold mb-2">Correlation Quality</h4>
      <div className="flex items-center justify-center gap-4 my-4">
        <div className={`text-4xl font-bold ${result.score > 75 ? 'text-green-400' : result.score > 50 ? 'text-yellow-400' : 'text-red-400'}`}>
          {result.score}
        </div>
        <div className="text-sm text-slate-400">
          <p>Depth Factor: {result.breakdown.depthPenalty}</p>
          <p>Name Similarity: {result.breakdown.nameSimilarity}</p>
        </div>
      </div>
      <p className="text-xs text-slate-500 mt-2">
        This score reflects the quality of the correlation based on available data.
      </p>
    </div>
  );
  
  const renderAnalysisResult = () => {
      if (isAnalyzing) {
          return <div className="flex items-center justify-center p-4"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing...</div>
      }
      if (!selectedAnalysis) {
          return (
              <div className="text-center text-sm text-slate-400 p-4">
                  <p>Select two tops to see a quality score, or run a full panel analysis.</p>
              </div>
          )
      }
      switch (selectedAnalysis.type) {
          case 'qualityScore':
              return renderQualityScore(selectedAnalysis.result);
          default:
              return <p>Analysis results will be shown here.</p>;
      }
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold mb-2 flex items-center">
            <Lightbulb className="w-4 h-4 mr-2 text-yellow-400"/>
            Analysis Engine
        </h3>
        <div className="space-y-2">
          <Button onClick={analyzePanel} disabled={isAnalyzing} className="w-full">
            {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Analyze Panel
          </Button>
          <Button onClick={suggestLines} disabled={isAnalyzing} className="w-full" variant="outline">
            Suggest Correlations
          </Button>
        </div>
      </div>
       <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
              {renderAnalysisResult()}
          </CardContent>
       </Card>
    </div>
  );
};

export default AnalysisPanel;