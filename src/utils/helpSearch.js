import { helpTopics, faqItems, glossaryTerms } from '@/data/materialBalanceHelpContent';

/**
 * Advanced search utility for the Help System
 */
export const searchHelpContent = (query, options = {}) => {
  if (!query || query.length < 2) return [];
  
  const lowerQuery = query.toLowerCase();
  const results = [];

  // 1. Search Guides & Topics
  helpTopics.forEach(topic => {
    let score = 0;
    if (topic.title.toLowerCase().includes(lowerQuery)) score += 10;
    if (topic.content.toLowerCase().includes(lowerQuery)) score += 5;
    
    if (score > 0) {
      results.push({
        id: topic.id,
        type: 'guide',
        title: topic.title,
        preview: getPreview(topic.content, lowerQuery),
        category: topic.category,
        score
      });
    }
  });

  // 2. Search FAQs
  faqItems.forEach((item, idx) => {
    let score = 0;
    if (item.question.toLowerCase().includes(lowerQuery)) score += 8;
    if (item.answer.toLowerCase().includes(lowerQuery)) score += 4;

    if (score > 0) {
      results.push({
        id: `faq-${idx}`,
        type: 'faq',
        title: item.question,
        preview: getPreview(item.answer, lowerQuery),
        category: 'faq',
        score
      });
    }
  });

  // 3. Search Glossary
  glossaryTerms.forEach((term, idx) => {
    let score = 0;
    if (term.term.toLowerCase().includes(lowerQuery)) score += 10;
    if (term.definition.toLowerCase().includes(lowerQuery)) score += 4;

    if (score > 0) {
      results.push({
        id: `glossary-${idx}`,
        type: 'glossary',
        title: term.term,
        preview: term.definition,
        category: 'glossary',
        score
      });
    }
  });

  // Sort by score (relevance)
  return results.sort((a, b) => b.score - a.score);
};

const getPreview = (text, query) => {
  const index = text.toLowerCase().indexOf(query);
  if (index === -1) return text.substring(0, 100) + '...';
  
  const start = Math.max(0, index - 40);
  const end = Math.min(text.length, index + query.length + 60);
  return (start > 0 ? '...' : '') + text.substring(start, end) + (end < text.length ? '...' : '');
};

export const getSearchSuggestions = (query) => {
  if (!query) return [];
  const results = searchHelpContent(query);
  return results.slice(0, 5).map(r => r.title);
};