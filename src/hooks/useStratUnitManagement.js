import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/lib/wellLogCorrelationApi';
import { useToast } from '@/components/ui/use-toast';

export function useStratUnitManagement(projectId) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editingUnitData, setEditingUnitData] = useState(null);
  const [editMode, setEditMode] = useState(null); // 'add', 'edit'

  const { mutate: deleteMutation, isLoading: isDeleting } = useMutation({
    mutationFn: api.deleteStratUnit,
    onSuccess: () => {
      toast({ title: 'Stratigraphic Unit Deleted' });
      queryClient.invalidateQueries({ queryKey: ['stratUnits', projectId] });
    },
    onError: (error) => {
      toast({ variant: 'destructive', title: 'Deletion Failed', description: error.message });
    },
  });
  
  const { mutate: saveMutation, isLoading: isSaving } = useMutation({
    mutationFn: (unitData) => {
        if (editMode === 'add') {
            const { id, ...insertData } = unitData;
            return api.createStratUnit(insertData);
        }
        const { id, ...updateData } = unitData;
        return api.updateStratUnit(id, updateData);
    },
    onSuccess: () => {
      toast({ title: 'Success', description: `Stratigraphic Unit has been ${editMode === 'add' ? 'created' : 'updated'}.` });
      queryClient.invalidateQueries({ queryKey: ['stratUnits', projectId] });
      cancelEditing();
    },
    onError: (error) => {
      toast({ variant: 'destructive', title: 'Save Failed', description: error.message });
    },
  });

  const startAddingUnit = () => {
    setEditMode('add');
    setEditingUnitData({
        project_id: projectId,
        name: '',
        code: '',
        color: '#FFFFFF',
        description: ''
    });
    setIsEditing(true);
  };
  
  const startEditingUnit = (unit) => {
    setEditMode('edit');
    setEditingUnitData(unit);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditingUnitData(null);
    setEditMode(null);
  };
  
  const saveUnit = (unitData) => {
    saveMutation(unitData);
  };
  
  const deleteUnit = (unitId) => {
    if (window.confirm('Are you sure you want to delete this stratigraphic unit? This action cannot be undone.')) {
      deleteMutation(unitId);
    }
  };

  return {
    isEditing: isEditing || isSaving || isDeleting,
    editingUnitData,
    editMode,
    startAddingUnit,
    startEditingUnit,
    cancelEditing,
    saveUnit,
    deleteUnit,
  };
}