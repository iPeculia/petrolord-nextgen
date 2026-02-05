import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductionProfileManager from './ProductionProfileManager';
import PriceDeckManager from './PriceDeckManager';
import EconomicParameters from './EconomicParameters';
import FiscalTerms from './FiscalTerms';
import HybridMiniPreview from './HybridMiniPreview';
import { EconomicMetricsCalculator } from '@/services/volumetrics/EconomicMetricsCalculator';
import { useVolumetrics } from '@/hooks/useVolumetrics';

const HybridInput = () => {
    const { actions } = useVolumetrics();
    
    // Initialize State with Sample Data
    const [activeTab, setActiveTab] = useState('production');
    
    const [profile, setProfile] = useState([
        { year: 2024, oil_rate: 1000, cumulative_oil: 0.365 },
        { year: 2025, oil_rate: 5000, cumulative_oil: 2.19 },
        { year: 2026, oil_rate: 8000, cumulative_oil: 5.11 },
        { year: 2027, oil_rate: 7000, cumulative_oil: 7.66 },
        { year: 2028, oil_rate: 6000, cumulative_oil: 9.85 },
        { year: 2029, oil_rate: 5000, cumulative_oil: 11.67 },
    ]);

    const [priceDeck, setPriceDeck] = useState([
        { year: 2024, oil_price: 75, gas_price: 3.5 },
        { year: 2025, oil_price: 72, gas_price: 3.5 },
        { year: 2026, oil_price: 70, gas_price: 3.5 },
        { year: 2027, oil_price: 70, gas_price: 3.5 },
        { year: 2028, oil_price: 70, gas_price: 3.5 },
        { year: 2029, oil_price: 70, gas_price: 3.5 },
    ]);

    const [econParams, setEconParams] = useState({
        capex: 150,
        capex_drilling: 80,
        capex_facilities: 70,
        opex_fixed: 5,
        opex_variable: 8,
        abex: 20,
        discount_rate: 10,
        tax_rate: 30,
        inflation_rate: 2
    });

    const [fiscalTerms, setFiscalTerms] = useState({
        royalty_rate: 12.5,
        govt_share: 0,
        cost_recovery_limit: 60
    });

    const [metrics, setMetrics] = useState(null);
    const [chartData, setChartData] = useState(null);

    // Real-time calculation
    useEffect(() => {
        const res = EconomicMetricsCalculator.calculateMetrics(profile, priceDeck, econParams, fiscalTerms);
        if (res) {
            setMetrics(res);
            // Update global context so other tabs can see this if needed
            actions.updateData({ 
                economicResults: res,
                // Store input state too
                hybridInputs: { profile, priceDeck, econParams, fiscalTerms } 
            });

            setChartData({
                net: res.npv, // Simplification for pie chart visualization
                govt: res.totalGovtTake,
                opex: res.totalOpex,
                capex: res.totalCapex
            });
        }
    }, [profile, priceDeck, econParams, fiscalTerms]);

    return (
        <div className="h-full flex flex-col bg-slate-900/20">
            <div className="flex-1 overflow-hidden flex flex-col">
                 <div className="px-4 py-2 border-b border-slate-800 bg-slate-900/50">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="bg-slate-950 border border-slate-800 h-9">
                            <TabsTrigger value="production" className="text-xs">Production</TabsTrigger>
                            <TabsTrigger value="prices" className="text-xs">Prices</TabsTrigger>
                            <TabsTrigger value="economics" className="text-xs">Economics</TabsTrigger>
                            <TabsTrigger value="fiscal" className="text-xs">Fiscal</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
                
                <div className="flex-1 p-4 overflow-y-auto">
                    {activeTab === 'production' && (
                        <ProductionProfileManager profile={profile} onChange={setProfile} />
                    )}
                    {activeTab === 'prices' && (
                        <PriceDeckManager deck={priceDeck} onChange={setPriceDeck} />
                    )}
                    {activeTab === 'economics' && (
                        <EconomicParameters params={econParams} onChange={setEconParams} />
                    )}
                    {activeTab === 'fiscal' && (
                        <FiscalTerms terms={fiscalTerms} onChange={setFiscalTerms} chartData={chartData} />
                    )}
                </div>
            </div>

            {/* Mini Preview Footer */}
            <div className="shrink-0">
                <HybridMiniPreview metrics={metrics} />
            </div>
        </div>
    );
};

export default HybridInput;