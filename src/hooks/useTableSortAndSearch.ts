import { useState, useEffect, useMemo } from 'react';

export function useTableSortAndSearch<T>(
  data: T[],
  searchFn: (item: T, query: string) => boolean,
  debounceMs: number = 300,
  initialSearch: string = ""
) {
  const [inputValue, setInputValue] = useState(initialSearch);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Debounce the input
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchQuery(inputValue);
    }, debounceMs);
    return () => clearTimeout(timeout);
  }, [inputValue, debounceMs]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else {
        setSortKey(null);
        setSortDirection('asc');
      }
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const processedData = useMemo(() => {
    let result = [...data];

    // Searching
    if (searchQuery.trim() !== "") {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(item => searchFn(item, lowerQuery));
    }

    // Sorting
    if (sortKey) {
      result.sort((a: any, b: any) => {
        // Handle nested keys e.g. "company.name"
        const getNestedVal = (obj: any, path: string) => {
          return path.split('.').reduce((acc, part) => acc && acc[part], obj);
        };
        
        const valA = getNestedVal(a, sortKey);
        const valB = getNestedVal(b, sortKey);

        if (valA == null && valB == null) return 0;
        if (valA == null) return sortDirection === 'asc' ? 1 : -1;
        if (valB == null) return sortDirection === 'asc' ? -1 : 1;

        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchQuery, sortKey, sortDirection, searchFn]);

  return {
    inputValue,
    setInputValue,
    sortKey,
    sortDirection,
    handleSort,
    processedData
  };
}
