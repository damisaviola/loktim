'use client';

import { useState, useEffect } from 'react';

export function useBookmarks() {
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('saved_jobs');
      if (stored) {
        setBookmarkedIds(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error reading bookmarks', error);
    }
    setIsLoaded(true);

    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem('saved_jobs');
        if (stored) setBookmarkedIds(JSON.parse(stored));
      } catch (e) {}
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('bookmarksUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('bookmarksUpdated', handleStorageChange);
    };
  }, []);

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const newBookmarks = prev.includes(id)
        ? prev.filter((b) => b !== id)
        : [...prev, id];
      
      try {
        localStorage.setItem('saved_jobs', JSON.stringify(newBookmarks));
        setTimeout(() => {
          window.dispatchEvent(new Event('bookmarksUpdated'));
        }, 0);
      } catch (e) {
        console.error('Failed to save bookmark', e);
      }
      
      return newBookmarks;
    });
  };

  const isBookmarked = (id: string) => bookmarkedIds.includes(id);

  return { bookmarkedIds, toggleBookmark, isBookmarked, isLoaded };
}
