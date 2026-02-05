import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { performSearch, getPopularSearches } from '@/utils/searchUtils';

const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [filters, setFilters] = useState({
    module: 'All',
    type: 'All',
    status: 'All'
  });
  
  // LocalStorage Persisted Data
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('petrolord_search_history');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [savedSearches, setSavedSearches] = useState(() => {
    const saved = localStorage.getItem('petrolord_saved_searches');
    return saved ? JSON.parse(saved) : [];
  });

  const [analytics, setAnalytics] = useState(() => {
    const saved = localStorage.getItem('petrolord_search_analytics');
    return saved ? JSON.parse(saved) : { totalSearches: 0, topTerms: {} };
  });

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        setIsSearching(true);
        const searchResults = performSearch(query, filters);
        setResults(searchResults);
        setIsSearching(false);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, filters]);

  // Save History & Analytics on Valid Search
  const addToHistory = useCallback((term) => {
    if (!term.trim()) return;
    
    setHistory(prev => {
      const newHistory = [term, ...prev.filter(h => h !== term)].slice(0, 10);
      localStorage.setItem('petrolord_search_history', JSON.stringify(newHistory));
      return newHistory;
    });

    setAnalytics(prev => {
      const newAnalytics = {
        totalSearches: prev.totalSearches + 1,
        topTerms: {
          ...prev.topTerms,
          [term]: (prev.topTerms[term] || 0) + 1
        }
      };
      localStorage.setItem('petrolord_search_analytics', JSON.stringify(newAnalytics));
      return newAnalytics;
    });
  }, []);

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('petrolord_search_history');
  };

  const removeHistoryItem = (term) => {
    setHistory(prev => {
      const newHistory = prev.filter(item => item !== term);
      localStorage.setItem('petrolord_search_history', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const saveSearch = (name, searchQuery, searchFilters) => {
    const newSaved = [...savedSearches, { id: Date.now(), name, query: searchQuery, filters: searchFilters }];
    setSavedSearches(newSaved);
    localStorage.setItem('petrolord_saved_searches', JSON.stringify(newSaved));
  };

  const deleteSavedSearch = (id) => {
    const newSaved = savedSearches.filter(s => s.id !== id);
    setSavedSearches(newSaved);
    localStorage.setItem('petrolord_saved_searches', JSON.stringify(newSaved));
  };

  const loadSavedSearch = (savedSearch) => {
    setQuery(savedSearch.query);
    setFilters(savedSearch.filters);
  };

  // Global Key Handler for Search (Cmd/Ctrl + K)
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const value = {
    query,
    setQuery,
    results,
    isSearching,
    filters,
    setFilters,
    history,
    addToHistory,
    clearHistory,
    removeHistoryItem,
    savedSearches,
    saveSearch,
    deleteSavedSearch,
    loadSavedSearch,
    analytics,
    popularSearches: getPopularSearches(),
    isGlobalSearchOpen,
    setIsGlobalSearchOpen
  };

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};