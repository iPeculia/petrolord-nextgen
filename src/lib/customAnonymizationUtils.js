import { supabase } from '@/lib/customSupabaseClient';

// Rule Management
export const getAnonymizationRules = async () => {
    const { data, error } = await supabase.from('anonymization_rules').select('*');
    if (error) throw new Error('Failed to fetch anonymization rules.');
    return data;
};

export const createAnonymizationRule = async (ruleData, adminId) => {
    const { data, error } = await supabase.from('anonymization_rules').insert([{
        ...ruleData,
        admin_id: adminId,
        created_by: adminId,
    }]).select().single();
    if (error) throw new Error('Failed to create anonymization rule.');
    return data;
};

export const updateAnonymizationRule = async (id, ruleData) => {
    const { data, error } = await supabase.from('anonymization_rules').update({
        ...ruleData,
        updated_at: new Date().toISOString()
    }).eq('id', id).select().single();
    if (error) throw new Error('Failed to update anonymization rule.');
    return data;
};

export const deleteAnonymizationRule = async (id) => {
    const { error } = await supabase.from('anonymization_rules').delete().eq('id', id);
    if (error) throw new Error('Failed to delete anonymization rule.');
};

// Rule Set Management
export const getAnonymizationRuleSets = async () => {
    const { data, error } = await supabase.from('anonymization_rule_sets').select('*');
    if (error) throw new Error('Failed to fetch rule sets.');
    return data;
};

export const createAnonymizationRuleSet = async (ruleSetData, adminId) => {
    const { data, error } = await supabase.from('anonymization_rule_sets').insert([{
        ...ruleSetData,
        admin_id: adminId,
        created_by: adminId,
    }]).select().single();
    if (error) throw new Error('Failed to create rule set.');
    return data;
};

export const updateAnonymizationRuleSet = async (id, ruleSetData) => {
    const { data, error } = await supabase.from('anonymization_rule_sets').update({
        ...ruleSetData,
        updated_at: new Date().toISOString()
    }).eq('id', id).select().single();
    if (error) throw new Error('Failed to update rule set.');
    return data;
};

export const deleteAnonymizationRuleSet = async (id) => {
    const { error } = await supabase.from('anonymization_rule_sets').delete().eq('id', id);
    if (error) throw new Error('Failed to delete rule set.');
};