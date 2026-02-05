import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Layers } from "lucide-react";
import { templates, applyTemplate } from '@/lib/trackTemplates';
import { useCorrelationPanelStore } from '@/store/correlationPanelStore';
import { useToast } from '@/components/ui/use-toast';

const CurveTrackTemplate = () => {
  const { selectedWellId, setWellCurves } = useCorrelationPanelStore();
  const { toast } = useToast();

  const handleApplyTemplate = (templateKey) => {
    if (!selectedWellId) {
      toast({
        variant: "destructive",
        title: "No Well Selected",
        description: "Please select a well from the list before applying a template.",
      });
      return;
    }
    applyTemplate(templateKey, selectedWellId, setWellCurves);
    toast({
      title: "Template Applied",
      description: `"${templates[templateKey].name}" template has been applied to the selected well.`,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" title="Apply Track Template">
          <Layers className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Apply Track Template</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {Object.entries(templates).map(([key, template]) => (
          <DropdownMenuItem key={key} onClick={() => handleApplyTemplate(key)}>
            {template.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CurveTrackTemplate;