import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '../atoms';

export const SearchBar = ({
  initialValue = '',
  onSearch,
  placeholder = 'Search by property title, style, or keyword...',
  className = '',
}) => {
  const [term, setTerm] = useState(initialValue);

  useEffect(() => {
    setTerm(initialValue);
  }, [initialValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(term.trim());
  };

  const handleClear = () => {
    setTerm('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className={`relative flex items-center w-full ${className}`}>
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
        <input
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-11 pr-10 py-3 rounded-2xl border border-surface-200 bg-white text-sm text-surface-900 placeholder:text-surface-400 shadow-soft focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
        />
        {term && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-surface-400 hover:text-surface-700 hover:bg-surface-100 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <Button type="submit" variant="primary" size="md" className="ml-2 !rounded-2xl shadow-soft">
        Search
      </Button>
    </form>
  );
};

export default SearchBar;
