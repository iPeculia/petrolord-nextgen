import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Calendar, Plus, Trash2, Save, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useFacilityMasterPlanner } from '../../context/FacilityMasterPlannerContext';
import { useToast } from '@/components/ui/use-toast';

const ProductionScheduleForm = () => {
  const { currentProject, currentFacility, productionProfiles, addProductionProfile, updateProductionProfile } = useFacilityMasterPlanner();
  const { toast } = useToast();
  const [scheduleData, setScheduleData] = useState([]);
  
  // Filter and sort profiles for current project
  useEffect(() => {
    if (currentProject) {
      const profiles = productionProfiles
        .filter(p => p.project_id === currentProject.project_id)
        .sort((a, b) => a.year - b.year);
        
      if (profiles.length === 0) {
        // Init with current year if empty
        const currentYear = new Date().getFullYear();
        setScheduleData([{
          id: uuidv4(),
          year: currentYear,
          oil_rate_bpd: 0,
          gas_rate_mmscfd: 0,
          water_rate_bpd: 0
        }]);
      } else {
        setScheduleData(profiles.map(p => ({
          id: p.profile_id,
          year: p.year,
          oil_rate_bpd: p.oil_rate_bpd,
          gas_rate_mmscfd: p.gas_rate_mmscfd,
          water_rate_bpd: p.water_rate_bpd
        })));
      }
    }
  }, [currentProject, productionProfiles]);

  const handleValueChange = (id, field, value) => {
    setScheduleData(prev => prev.map(row => {
      if (row.id === id) {
        return { ...row, [field]: parseFloat(value) || 0 };
      }
      return row;
    }));
  };

  const addRow = () => {
    const lastYear = scheduleData.length > 0 ? Math.max(...scheduleData.map(d => d.year)) : new Date().getFullYear();
    setScheduleData(prev => [...prev, {
      id: uuidv4(),
      year: lastYear + 1,
      oil_rate_bpd: 0,
      gas_rate_mmscfd: 0,
      water_rate_bpd: 0
    }]);
  };

  const removeRow = (id) => {
    if (scheduleData.length <= 1) return;
    setScheduleData(prev => prev.filter(row => row.id !== id));
  };

  const handleSave = () => {
    if (!currentProject) return;

    // In a real app, we might do a batch update or diff. 
    // Here we'll just simulate saving by updating context state one by one or batch replacing if context supported it.
    // For simplicity, we assume context handles ID matching.
    
    let successCount = 0;
    scheduleData.forEach(row => {
        const existing = productionProfiles.find(p => p.profile_id === row.id);
        const facilityCap = currentFacility?.design_capacity_oil_bpd || 1;
        const utilization = (row.oil_rate_bpd / facilityCap) * 100;

        const payload = {
            profile_id: row.id,
            project_id: currentProject.project_id,
            year: row.year,
            month: 1, // Annual avg
            oil_rate_bpd: row.oil_rate_bpd,
            gas_rate_mmscfd: row.gas_rate_mmscfd,
            water_rate_bpd: row.water_rate_bpd,
            facility_utilization_percent: utilization,
            created_date: new Date().toISOString()
        };

        if (existing) {
            updateProductionProfile(row.id, payload);
        } else {
            addProductionProfile(payload);
        }
        successCount++;
    });
    
    toast({ title: "Schedule Saved", description: `Updated ${successCount} production years.` });
  };

  if (!currentProject) return <div className="p-8 text-center text-slate-500">Select a project to manage schedule.</div>;

  return (
    <div className="flex flex-col h-full bg-[#1a1a1a] p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                Production Forecast
            </h2>
            <p className="text-sm text-slate-400 mt-1">Manage annual production profiles for {currentProject.name}</p>
        </div>
        <div className="flex gap-2">
            <Button onClick={addRow} variant="outline" className="border-slate-700 hover:bg-slate-800 text-slate-200">
                <Plus className="w-4 h-4 mr-2" /> Add Year
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Save className="w-4 h-4 mr-2" /> Save Schedule
            </Button>
        </div>
      </div>

      <div className="border border-slate-800 rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-900">
            <TableRow className="border-slate-800 hover:bg-slate-900">
              <TableHead className="text-slate-400 w-[100px]">Year</TableHead>
              <TableHead className="text-slate-400">Oil Rate (bpd)</TableHead>
              <TableHead className="text-slate-400">Gas Rate (mmscfd)</TableHead>
              <TableHead className="text-slate-400">Water Rate (bpd)</TableHead>
              <TableHead className="text-slate-400">Utilization</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scheduleData.map((row) => {
                const util = currentFacility ? (row.oil_rate_bpd / currentFacility.design_capacity_oil_bpd) * 100 : 0;
                const isOverCapacity = util > 100;
                
                return (
                    <TableRow key={row.id} className="border-slate-800 hover:bg-slate-800/50">
                        <TableCell>
                            <Input 
                                type="number" 
                                value={row.year} 
                                onChange={(e) => handleValueChange(row.id, 'year', e.target.value)}
                                className="bg-transparent border-transparent hover:border-slate-700 focus:bg-slate-900 h-8 w-20 text-white font-medium"
                            />
                        </TableCell>
                        <TableCell>
                            <Input 
                                type="number" 
                                value={row.oil_rate_bpd} 
                                onChange={(e) => handleValueChange(row.id, 'oil_rate_bpd', e.target.value)}
                                className="bg-transparent border-transparent hover:border-slate-700 focus:bg-slate-900 h-8 text-white"
                            />
                        </TableCell>
                        <TableCell>
                            <Input 
                                type="number" 
                                value={row.gas_rate_mmscfd} 
                                onChange={(e) => handleValueChange(row.id, 'gas_rate_mmscfd', e.target.value)}
                                className="bg-transparent border-transparent hover:border-slate-700 focus:bg-slate-900 h-8 text-white"
                            />
                        </TableCell>
                        <TableCell>
                            <Input 
                                type="number" 
                                value={row.water_rate_bpd} 
                                onChange={(e) => handleValueChange(row.id, 'water_rate_bpd', e.target.value)}
                                className="bg-transparent border-transparent hover:border-slate-700 focus:bg-slate-900 h-8 text-white"
                            />
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                <span className={`text-sm font-medium ${isOverCapacity ? 'text-red-500' : 'text-emerald-500'}`}>
                                    {util.toFixed(1)}%
                                </span>
                                {isOverCapacity && <AlertTriangle className="w-4 h-4 text-red-500" />}
                            </div>
                        </TableCell>
                        <TableCell>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => removeRow(row.id)}
                                className="text-slate-500 hover:text-red-400 hover:bg-transparent h-8 w-8"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
                );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProductionScheduleForm;