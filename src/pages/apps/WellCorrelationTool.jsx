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

// Wrapper component to inject context and handle shortcuts
const WellCorrelationApp = () => {
    const [activeTab, setActiveTab] = useState('data');
    const navigate = useNavigate();

    // Keyboard shortcuts mock actions - in real app would connect to context actions
    useKeyboardShortcuts({
        undo: () => console.log("Undo triggered"),
        redo: () => console.log("Redo triggered"),
        save: () => console.log("Save triggered")
    });

    return (
        <div className="flex flex-col h-screen w-full bg-[#0F172A] text-slate-100 overflow-hidden">
            <WellCorrelationErrorBoundary>
                <WellCorrelationProvider>
                    {/* Header Navigation */}
                    <div className="h-14 bg-slate-950 border-b border-slate-800 flex items-center px-4 shrink-0">
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
                        <h1 className="text-sm font-bold text-white">Well Correlation Tool</h1>
                    </div>

                    <div className="flex-1 overflow-hidden">
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