import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { helpTopics, faqItems, glossaryTerms } from '@/data/materialBalanceHelpContent';
import { searchHelpContent } from '@/utils/helpSearch';
import { trackHelpView, trackHelpSearch } from '@/utils/helpAnalytics';

const HelpContext = createContext(null);

export const HelpProvider = ({ children }) => {
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Persistence States
  const [bookmarks, setBookmarks] = useState(() => JSON.parse(localStorage.getItem('mb_help_bookmarks') || '[]'));
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('mb_help_history') || '[]'));
  const [preferences, setPreferences] = useState(() => JSON.parse(localStorage.getItem('mb_help_prefs') || '{"tooltips": true, "notifications": true}'));
  
  const [trainingProgress, setTrainingProgress] = useState(() => {
    const saved = localStorage.getItem('mb_training_progress');
    return saved ? JSON.parse(saved) : {
      tutorials: [],
      videos: [],
      caseStudies: []
    };
  });

  // Effects for Persistence
  useEffect(() => localStorage.setItem('mb_help_bookmarks', JSON.stringify(bookmarks)), [bookmarks]);
  useEffect(() => localStorage.setItem('mb_help_history', JSON.stringify(history)), [history]);
  useEffect(() => localStorage.setItem('mb_help_prefs', JSON.stringify(preferences)), [preferences]);

  // Actions
  const toggleBookmark = (topicId) => {
    setBookmarks(prev => {
      if (prev.includes(topicId)) return prev.filter(id => id !== topicId);
      return [...prev, topicId];
    });
  };

  const addToHistory = (topicId) => {
    trackHelpView(topicId);
    setHistory(prev => {
      const newHistory = [topicId, ...prev.filter(id => id !== topicId)];
      return newHistory.slice(0, 20); // Keep last 20
    });
  };

  const updateTrainingProgress = (type, id) => {
    setTrainingProgress(prev => {
      const current = prev[type] || [];
      if (current.includes(id)) return prev;
      const updated = { ...prev, [type]: [...current, id] };
      localStorage.setItem('mb_training_progress', JSON.stringify(updated));
      return updated;
    });
  };

  const performSearch = (query) => {
    setSearchQuery(query);
    if(query.length > 2) trackHelpSearch(query);
  };

  const searchResults = useMemo(() => searchHelpContent(searchQuery), [searchQuery]);

  return (
    <HelpContext.Provider value={{
      activeCategory,
      setActiveCategory,
      searchQuery,
      setSearchQuery: performSearch,
      searchResults,
      trainingProgress,
      updateTrainingProgress,
      bookmarks,
      toggleBookmark,
      history,
      addToHistory,
      preferences,
      setPreferences,
      isHelpModalOpen,
      setIsHelpModalOpen,
      isSidebarOpen,
      setIsSidebarOpen
    }}>
      {children}
    </HelpContext.Provider>
  );
};

export const useHelp = () => {
  const context = useContext(HelpContext);
  if (!context) throw new Error('useHelp must be used within a HelpProvider');
  return context;
};