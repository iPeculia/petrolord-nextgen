import { SAMPLE_DATASETS } from '@/data/wellTestAnalysis/sampleDataDescriptions';

export const loadSampleDataset = (datasetId) => {
    const dataset = SAMPLE_DATASETS.find(d => d.id === datasetId);
    return dataset ? { data: dataset.data, meta: dataset } : { data: [], meta: {} };
};

export const getSampleDatasetList = () => SAMPLE_DATASETS;

export const convertToCSVFormat = (data) => {
    if (!data || data.length === 0) return '';
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(','));
    return [headers, ...rows].join('\n');
};