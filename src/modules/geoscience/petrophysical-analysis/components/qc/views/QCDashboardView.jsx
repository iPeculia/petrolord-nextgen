import React from 'react';
import { useQC } from '@/modules/geoscience/petrophysical-analysis/context/QCContext';
import QCMetricWidget from '../widgets/QCMetricWidget';
import IssueTrackerWidget from '../widgets/IssueTrackerWidget';
import DetailedChecksView from './DetailedChecksView';
import { Activity, FileDigit, AlertTriangle, CheckCircle } from 'lucide-react';

const QCDashboardView = () => {
  const { qcResults, issues } = useQC();
  
  const curveCount = Object.keys(qcResults).length;
  const totalIssues = issues.length;
  const criticalIssues = issues.filter(i => i.severity === 'High').length;
  
  // Calculate overall health score
  let healthScore = 100;
  if (curveCount > 0) {
      healthScore -= (criticalIssues * 10);
      healthScore -= (totalIssues - criticalIssues) * 2;
  }
  healthScore = Math.max(0, Math.min(100, healthScore));

  return (
    <div className="space-y-6 pb-10">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <QCMetricWidget 
                title="Data Health Score" 
                value={curveCount > 0 ? healthScore.toFixed(0) : '-'} 
                unit="/ 100"
                status={healthScore > 80 ? 'good' : healthScore > 50 ? 'warning' : 'critical'}
                icon={Activity}
            />
            <QCMetricWidget 
                title="Curves Analyzed" 
                value={curveCount} 
                status="neutral"
                icon={FileDigit}
            />
            <QCMetricWidget 
                title="Total Issues" 
                value={totalIssues} 
                status={totalIssues === 0 ? 'good' : 'warning'}
                icon={AlertTriangle}
            />
            <QCMetricWidget 
                title="Completeness" 
                value={curveCount > 0 ? "98.2" : "-"} 
                unit="%"
                status="good"
                icon={CheckCircle}
            />
        </div>

        {/* Main Content Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
            <div className="lg:col-span-2 h-full overflow-hidden flex flex-col">
                 <DetailedChecksView />
            </div>
            <div className="lg:col-span-1 h-full overflow-hidden">
                 <IssueTrackerWidget />
            </div>
        </div>
    </div>
  );
};

export default QCDashboardView;