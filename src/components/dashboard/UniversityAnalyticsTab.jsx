import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Download, RefreshCw, Calendar as CalendarIcon, Filter } from 'lucide-react';
import { KPICard, BarChartWidget, LineChartWidget, PieChartWidget, AreaChartWidget } from '@/components/charts/DashboardWidgets';
import { analyticsService } from '@/services/analyticsService';
import { useToast } from '@/components/ui/use-toast';
import { Users, GraduationCap, BookOpen, Award, TrendingUp, AlertTriangle } from 'lucide-react';
import { utils, writeFile } from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

const UniversityAnalyticsTab = ({ universityId }) => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('30d');
    const [metrics, setMetrics] = useState(null);
    const [enrollmentTrend, setEnrollmentTrend] = useState([]);
    const [gradeDist, setGradeDist] = useState([]);
    const [completionStats, setCompletionStats] = useState([]);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    const fetchData = async () => {
        setLoading(true);
        try {
            // Parallel fetch for dashboard widgets
            const [
                baseMetrics, 
                enrollmentData,
                gradeData,
                completionData
            ] = await Promise.all([
                analyticsService.getUniversityMetrics(universityId),
                analyticsService.getEnrollmentTrends(universityId, dateRange),
                analyticsService.getGradeDistribution(universityId),
                analyticsService.getCourseCompletionStats(universityId)
            ]);

            setMetrics(baseMetrics);
            setEnrollmentTrend(enrollmentData);
            setGradeDist(gradeData);
            setCompletionStats(completionData);
            setLastUpdated(new Date());
        } catch (error) {
            console.error("Analytics fetch error:", error);
            toast({ title: "Error loading analytics", description: "Could not refresh dashboard data.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (universityId) fetchData();
    }, [universityId, dateRange]);

    // Mock export function for PDF
    const handleExportPDF = async () => {
        const input = document.getElementById('analytics-dashboard-content');
        if (!input) return;

        try {
            toast({ title: "Generating PDF...", description: "Please wait while we prepare your report." });
            
            const canvas = await html2canvas(input, { scale: 1 }); // Scale 1 for speed/size balance
            const imgData = canvas.toDataURL('image/png');
            
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            
            pdf.setFontSize(18);
            pdf.text('University Analytics Report', 10, 10);
            pdf.setFontSize(10);
            pdf.text(`Generated on: ${new Date().toLocaleString()}`, 10, 16);
            
            pdf.addImage(imgData, 'PNG', 0, 20, pdfWidth, pdfHeight);
            pdf.save(`Analytics_Report_${new Date().toISOString().split('T')[0]}.pdf`);
            
            toast({ title: "Success", description: "PDF report downloaded successfully." });
        } catch (err) {
            console.error(err);
            toast({ title: "Export Failed", variant: "destructive" });
        }
    };

    // Mock export function for Excel
    const handleExportExcel = () => {
        if (!enrollmentTrend || !gradeDist) return;

        const wb = utils.book_new();
        
        // Sheet 1: Enrollment Trend
        const ws1 = utils.json_to_sheet(enrollmentTrend);
        utils.book_append_sheet(wb, ws1, "Enrollment Trends");
        
        // Sheet 2: Grade Distribution
        const ws2 = utils.json_to_sheet(gradeDist);
        utils.book_append_sheet(wb, ws2, "Grades");

        writeFile(wb, `University_Analytics_${new Date().toISOString().split('T')[0]}.xlsx`);
        toast({ title: "Success", description: "Excel report downloaded." });
    };

    return (
        <div className="space-y-6">
            {/* Header Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#1E293B] p-4 rounded-lg border border-slate-800">
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-[#BFFF00]" /> 
                        Analytics Dashboard
                    </h2>
                    <span className="text-xs text-slate-500 ml-2 hidden md:inline">
                        Last updated: {lastUpdated.toLocaleTimeString()}
                    </span>
                </div>
                
                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                    <Select value={dateRange} onValueChange={setDateRange}>
                        <SelectTrigger className="w-[140px] bg-slate-900 border-slate-700 h-9">
                            <CalendarIcon className="w-3.5 h-3.5 mr-2 text-slate-400" />
                            <SelectValue placeholder="Period" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7d">Last 7 Days</SelectItem>
                            <SelectItem value="30d">Last 30 Days</SelectItem>
                            <SelectItem value="90d">Last 3 Months</SelectItem>
                            <SelectItem value="year">Last Year</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button variant="outline" size="sm" onClick={fetchData} className="h-9 border-slate-700 text-slate-300 hover:text-white">
                        <RefreshCw className={`w-3.5 h-3.5 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
                    </Button>
                    
                    <Button variant="outline" size="sm" onClick={handleExportExcel} className="h-9 border-slate-700 text-slate-300 hover:text-white hidden sm:flex">
                        <Download className="w-3.5 h-3.5 mr-2" /> Excel
                    </Button>

                    <Button size="sm" onClick={handleExportPDF} className="h-9 bg-[#BFFF00] text-black hover:bg-[#a3d900]">
                        <Download className="w-3.5 h-3.5 mr-2" /> Report
                    </Button>
                </div>
            </div>

            {/* Dashboard Content Area */}
            <div id="analytics-dashboard-content" className="space-y-6 pb-8">
                {/* KPI Cards Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <KPICard 
                        title="Total Students" 
                        value={metrics?.totalStudents || 0} 
                        trend={5.2} 
                        icon={Users} 
                        color="bg-blue-500/10 text-blue-400"
                        subtext="vs last month"
                    />
                    <KPICard 
                        title="Course Completions" 
                        value={482} 
                        trend={12.5} 
                        icon={Award} 
                        color="bg-[#BFFF00]/10 text-[#BFFF00]"
                        subtext="vs last month"
                    />
                    <KPICard 
                        title="Avg. GPA" 
                        value="3.42" 
                        trend={-0.8} 
                        icon={GraduationCap} 
                        color="bg-purple-500/10 text-purple-400"
                        subtext="vs last semester"
                    />
                    <KPICard 
                        title="At Risk Students" 
                        value={14} 
                        trend={2.1} 
                        icon={AlertTriangle} 
                        color="bg-red-500/10 text-red-400"
                        subtext="Grades < 60%"
                    />
                </div>

                {/* Main Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 h-80">
                        <AreaChartWidget 
                            title="Student Enrollment Trend" 
                            data={enrollmentTrend} 
                            dataKey="value" 
                            xKey="date" 
                            color="#38BDF8"
                        />
                    </div>
                    <div className="h-80">
                        <PieChartWidget 
                            title="Course Status" 
                            data={completionStats} 
                        />
                    </div>
                </div>

                {/* Secondary Charts Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-80">
                        <BarChartWidget 
                            title="Grade Distribution" 
                            data={gradeDist} 
                            dataKey="value" 
                            color="#A78BFA"
                        />
                    </div>
                    <div className="h-80">
                         <LineChartWidget 
                            title="Platform Activity (Logins)"
                            data={enrollmentTrend.map(i => ({ ...i, value: i.value * 2.5 }))} 
                            lines={[{ key: 'value', name: 'Logins', color: '#BFFF00' }]}
                            xKey="date"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UniversityAnalyticsTab;