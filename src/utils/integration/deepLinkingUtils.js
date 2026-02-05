import { useSearchParams } from 'react-router-dom';

/**
 * Parses URL search parameters for Petrolord context
 * specific to Casing Design module
 */
export const usePetrolordContext = () => {
  const [searchParams] = useSearchParams();
  
  const projectId = searchParams.get('project_id');
  const wellId = searchParams.get('well_id');
  const designId = searchParams.get('design_id');
  const assetId = searchParams.get('asset_id');

  return {
    projectId,
    wellId,
    designId,
    assetId,
    hasContext: !!(projectId || wellId)
  };
};

/**
 * Generates a deep link to the Casing Design module
 */
export const generateDeepLink = (baseUrl, { projectId, wellId, designId }) => {
  const params = new URLSearchParams();
  if (projectId) params.append('project_id', projectId);
  if (wellId) params.append('well_id', wellId);
  if (designId) params.append('design_id', designId);
  
  return `${baseUrl}?${params.toString()}`;
};