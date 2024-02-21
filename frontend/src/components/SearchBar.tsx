import React, { useState } from 'react';

interface SearchBarProps {
  onSearchQueryChange: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearchQueryChange }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value
    setSearchQuery(newQuery);
    onSearchQueryChange(newQuery);
  };

  return (
    <div className='search-bar-container break-line'>
      <input type="text" className="search-input" 
        value={searchQuery} onChange={handleChange} placeholder="Search..." />
    </div>
  );
};

export default SearchBar;
