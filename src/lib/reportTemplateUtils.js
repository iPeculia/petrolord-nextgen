import { supabase } from '@/lib/customSupabaseClient';
import { logAction } from '@/lib/auditLogger';

const TEMPLATES_PER_PAGE = 10;

export const getReportTemplates = async ({ page = 1, searchTerm = '', sort = { by: 'created_at', ascending: false } }) => {
    // Step 1: Fetch report templates without the join
    let query = supabase
        .from('report_templates')
        .select('*', { count: 'exact' });

    if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    }
    
    query = query.order(sort.by, { ascending: sort.ascending });
    
    const from = (page - 1) * TEMPLATES_PER_PAGE;
    const to = from + TEMPLATES_PER_PAGE - 1;
    query = query.range(from, to);

    const { data: templatesData, error: templatesError, count } = await query;

    if (templatesError) {
        console.error('Error fetching report templates:', templatesError);
        throw new Error('Failed to fetch report templates.');
    }

    if (!templatesData || templatesData.length === 0) {
        return { templates: [], count: 0 };
    }

    // Step 2: Get unique creator IDs
    const creatorIds = [...new Set(templatesData.map(t => t.created_by).filter(id => id))];

    if (creatorIds.length === 0) {
        return { templates: templatesData.map(t => ({ ...t, creator_display_name: 'N/A' })), count };
    }

    // Step 3: Fetch profiles for the creator IDs
    const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, display_name')
        .in('id', creatorIds);

    if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        // Return templates without creator names if profiles fetch fails
        return { templates: templatesData.map(t => ({ ...t, creator_display_name: 'Error' })), count };
    }

    // Step 4: Map display names to templates
    const profilesMap = new Map(profilesData.map(p => [p.id, p.display_name]));

    const templatesWithCreators = templatesData.map(template => ({
        ...template,
        creator_display_name: profilesMap.get(template.created_by) || 'N/A'
    }));

    return { templates: templatesWithCreators, count };
};

export const createReportTemplate = async (templateData) => {
    // This is a placeholder function
    console.log('Creating report template:', templateData);
    await logAction({
        action: 'CREATE',
        resource_type: 'REPORT_TEMPLATE',
        status: 'success',
        description: `Created new report template: ${templateData.name}`
    });
    return { ...templateData, id: 'new-id', created_at: new Date().toISOString() };
};

export const updateReportTemplate = async (templateId, updates) => {
    // This is a placeholder function
    console.log(`Updating report template ${templateId}:`, updates);
    await logAction({
        action: 'UPDATE',
        resource_type: 'REPORT_TEMPLATE',
        resource_id: templateId,
        status: 'success',
        new_value: updates,
        description: `Updated report template: ${updates.name || 'N/A'}`
    });
    return { id: templateId, ...updates };
};

export const deleteReportTemplate = async (templateId) => {
    // This is a placeholder function
    console.log(`Deleting report template ${templateId}`);
    await logAction({
        action: 'DELETE',
        resource_type: 'REPORT_TEMPLATE',
        resource_id: templateId,
        status: 'success',
        description: `Deleted report template ID: ${templateId}`
    });
    return { id: templateId };
};