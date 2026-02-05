import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import WellCorrelationLayout from '@/components/wellCorrelation/WellCorrelationLayout';
import DataTab from '@/components/wellCorrelation/DataTab';
import CorrelationPanelTab from '@/components/wellCorrelation/CorrelationPanelTab';
import HorizonsMarkersTab from '@/components/wellCorrelation/HorizonsMarkersTab';
import ExportLinksTab from '@/components/wellCorrelation/ExportLinksTab';
import AdvancedCorrelationTab from '@/components/wellCorrelation/AdvancedCorrelationTab';
import QCCommentsTab from '@/components/wellCorrelation/QCCommentsTab';
import AdvancedExportTab from '@/components/wellCorrelation/AdvancedExportTab';
import { WellCorrelationProvider } from '@/contexts/WellCorrelationContext';
import { Toaster } from '@/components/ui/toaster';
import { useKeyboardShortcuts } from '@/utils/wellCorrelation/KeyboardShortcuts';
import WellCorrelationErrorBoundary from '@/components/wellCorrelation/WellCorrelationErrorBoundary';
import '@/styles/correlation.css'; 

const WellCorrelationApp = () => {
    const [activeTab, setActiveTab] = useState('data');
    const navigate = useNavigate();

    // Keyboard shortcuts handler
    useKeyboardShortcuts({
        undo: () => console.log("Undo triggered"),
        redo: () => console.log("Redo triggered"),
        save: () => console.log("Save triggered")
    });

    return (
        <div className="flex flex-col h-screen w-full bg-[#0F172A] text-slate-100 overflow-hidden font-sans">
            <WellCorrelationErrorBoundary>
                <WellCorrelationProvider>
                    {/* Petrolord Header - Consistent Styling */}
                    <div className="h-14 bg-[#0F172A] border-b border-slate-800 flex items-center px-4 shrink-0 justify-between">
                        <div className="flex items-center">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="mr-4 text-slate-400 hover:text-white hover:bg-slate-800"
                                onClick={() => navigate('/modules/geoscience')}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Geoscience
                            </Button>
                            <div className="h-6 w-px bg-slate-800 mr-4" />
                            <h1 className="text-sm font-bold text-white tracking-wide uppercase">Well Correlation Tool</h1>
                        </div>
                        <div className="text-xs text-slate-500 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
                             Active Project: <span className="text-[#CCFF00] font-medium ml-1">North Sea Exploration</span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-hidden bg-[#0F172A]">
                        <WellCorrelationLayout activeTab={activeTab} onTabChange={setActiveTab}>
                            {activeTab === 'data' && <DataTab />}
                            {activeTab === 'correlation' && <CorrelationPanelTab />}
                            {activeTab === 'horizons' && <HorizonsMarkersTab />}
                            {activeTab === 'advanced' && <AdvancedCorrelationTab />}
                            {activeTab === 'qc' && <QCCommentsTab />}
                            {activeTab === 'export' && <AdvancedExportTab />}
                        </WellCorrelationLayout>
                    </div>
                    <Toaster />
                </WellCorrelationProvider>
            </WellCorrelationErrorBoundary>
        </div>
    );
};

export default WellCorrelationApp;