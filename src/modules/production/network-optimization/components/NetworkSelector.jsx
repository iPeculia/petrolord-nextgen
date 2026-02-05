import React, { useState } from 'react';
import { useNetworkOptimization } from '@/context/NetworkOptimizationContext';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Plus, Network } from 'lucide-react';
import CreateNetworkModal from './CreateNetworkModal';

const NetworkSelector = () => {
  const { networks, currentNetwork, setCurrentNetwork } = useNetworkOptimization();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-9 border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white px-3 min-w-[200px] justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
               <Network className="h-4 w-4 shrink-0 text-slate-400" />
               <span className="truncate text-sm font-medium">
                 {currentNetwork ? currentNetwork.name : "Select Network..."}
               </span>
            </div>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[240px] bg-slate-900 border-slate-800 text-slate-200">
          <DropdownMenuLabel className="text-xs text-slate-500 uppercase tracking-wider">Available Networks</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-slate-800" />
          {networks.length === 0 && (
             <div className="p-2 text-sm text-slate-500 text-center">No networks found</div>
          )}
          {networks.map(net => (
            <DropdownMenuItem 
              key={net.network_id}
              className="focus:bg-slate-800 focus:text-white cursor-pointer flex justify-between group"
              onClick={() => setCurrentNetwork(net)}
            >
              <span className="truncate max-w-[180px]">{net.name}</span>
              {currentNetwork?.network_id === net.network_id && (
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              )}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator className="bg-slate-800" />
          <DropdownMenuItem 
            className="focus:bg-slate-800 focus:text-emerald-400 cursor-pointer text-emerald-500 font-medium"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Network
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateNetworkModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
    </>
  );
};

export default NetworkSelector;