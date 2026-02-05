/**
 * Simple analytics tracker for Help System usage
 */

const STORAGE_KEY = 'mb_help_analytics';

const getAnalytics = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
      views: {},
      searches: {},
      feedback: []
    };
  } catch {
    return { views: {}, searches: {}, feedback: [] };
  }
};

const saveAnalytics = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const trackHelpView = (topicId) => {
  const data = getAnalytics();
  data.views[topicId] = (data.views[topicId] || 0) + 1;
  saveAnalytics(data);
};

export const trackHelpSearch = (query) => {
  const data = getAnalytics();
  data.searches[query] = (data.searches[query] || 0) + 1;
  saveAnalytics(data);
};

export const submitHelpFeedback = (feedback) => {
  const data = getAnalytics();
  data.feedback.push({
    ...feedback,
    timestamp: new Date().toISOString()
  });
  saveAnalytics(data);
};

export const getTopTopics = (limit = 5) => {
  const data = getAnalytics();
  return Object.entries(data.views)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([topicId, count]) => ({ topicId, count }));
};