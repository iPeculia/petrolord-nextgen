import { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import * as api from '@/lib/wellLogCorrelationApi';
import { useToast } from '@/components/ui/use-toast';

export const useTopEditing = (wellboreId) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingTopData, setEditingTopData] = useState(null);
  const [editMode, setEditMode] = useState(null); // 'add' or 'edit'
  const [editingWellId, setEditingWellId] = useState(null);

  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['project'] });
    queryClient.invalidateQueries({ queryKey: ['correlationPanel'] });
  };
  
  // --- MUTATIONS ---
  const createMutation = useMutation({
    mutationFn: api.createWellTop,
    onSuccess: () => {
      toast({ title: "Top created successfully!" });
      invalidateQueries();
      cancelEditing();
    },
    onError: (error) => toast({ title: "Error creating top", description: error.message, variant: 'destructive' }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ topId, updates }) => api.updateWellTop(topId, updates),
    onSuccess: () => {
      toast({ title: "Top updated successfully!" });
      invalidateQueries();
      cancelEditing();
    },
    onError: (error) => toast({ title: "Error updating top", description: error.message, variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteWellTop,
    onSuccess: () => {
      toast({ title: "Top deleted successfully!" });
      invalidateQueries();
    },
    onError: (error) => toast({ title: "Error deleting top", description: error.message, variant: 'destructive' }),
  });

  // --- ACTIONS ---
  const startAddingTop = (wbId, defaultDepth = 1000) => {
    setEditingWellId(wbId);
    setEditingTopData({
      wellbore_id: wbId,
      top_name: 'New Top',
      depth_md: defaultDepth,
      strat_unit_id: null,
      pick_quality: 'draft',
    });
    setEditMode('add');
    setIsEditing(true);
  };

  const startEditingTop = (top) => {
    setEditingWellId(top.wellbore_id);
    setEditingTopData(top);
    setEditMode('edit');
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditingTopData(null);
    setEditMode(null);
    setEditingWellId(null);
  };

  const saveTop = (formData) => {
    if (editMode === 'add') {
      createMutation.mutate(formData);
    } else if (editMode === 'edit') {
      const { id, ...updates } = formData;
      updateMutation.mutate({ topId: id, updates });
    }
  };

  const deleteTop = (topId) => {
    if (window.confirm('Are you sure you want to delete this top and any associated correlation lines?')) {
      deleteMutation.mutate(topId);
    }
  };

  return {
    isEditing: isEditing || createMutation.isLoading || updateMutation.isLoading,
    editingTopData,
    editingWellId,
    editMode,
    startAddingTop,
    startEditingTop,
    cancelEditing,
    saveTop,
    deleteTop,
  };
};