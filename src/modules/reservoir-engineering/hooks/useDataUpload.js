import { useState } from 'react';
import { useMaterialBalanceStore } from '@/modules/reservoir-engineering/store/materialBalanceStore';
import { parseProductionData, parsePvtData } from '@/modules/reservoir-engineering/utils/csvParser';
import { useToast } from '@/components/ui/use-toast';

const useDataUpload = () => {
  const { loadSampleData, setValidationStatus, loadProductionData, loadPvtData } = useMaterialBalanceStore();
  const [loading, setLoading] = useState({ production: false, pvt: false, sample: false });
  const [error, setError] = useState({ production: null, pvt: null, sample: null });
  const { toast } = useToast();

  const uploadFile = async (file, type) => {
    setLoading(prev => ({ ...prev, [type]: true }));
    setError(prev => ({ ...prev, [type]: null }));

    try {
      const text = await file.text();
      let validationResult;

      if (type === 'production') {
        validationResult = await parseProductionData(text);
        loadProductionData(validationResult.data, { name: file.name, size: file.size });
      } else {
        validationResult = await parsePvtData(text);
        loadPvtData(validationResult.data, { name: file.name, size: file.size });
      }
      
      setValidationStatus(type, validationResult);

      if (validationResult.isValid) {
        toast({
          title: 'Success',
          description: `${type.charAt(0).toUpperCase() + type.slice(1)} data uploaded and validated successfully.`,
          variant: 'default',
        });
      } else {
        toast({
          title: 'Validation Issues',
          description: `Uploaded ${type} data has errors or warnings. Please review the feedback.`,
          variant: 'destructive',
        });
      }

    } catch (e) {
      const errorMessage = `Failed to parse ${type} data: ${e.message}`;
      setError(prev => ({ ...prev, [type]: errorMessage }));
      toast({
        title: 'Upload Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  const loadSample = (scenario) => {
    setLoading(prev => ({ ...prev, sample: true }));
    setError(prev => ({ ...prev, sample: null }));
    try {
      loadSampleData(scenario);
      toast({
        title: 'Sample Data Loaded',
        description: `Scenario '${scenario}' has been loaded successfully.`,
      });
    } catch (e) {
      const errorMessage = `Failed to load sample data: ${e.message}`;
      setError(prev => ({ ...prev, sample: errorMessage }));
       toast({
        title: 'Load Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(prev => ({ ...prev, sample: false }));
    }
  };

  return { uploadFile, loadSample, loading, error };
};

export default useDataUpload;