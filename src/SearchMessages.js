import React, { useState } from 'react';

const SearchMessages = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div>
      <h2>Search Messages</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter search query"
          value={searchQuery}
          onChange={handleInputChange}
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
};

export default SearchMessages;