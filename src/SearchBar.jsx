import { useState } from "react";
function SearchBar({ onSearch }) {
  const [city, setCity] = useState("");


  function handleSearch() {
    onSearch(city);
  }
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search for a city..."
        value={city}
        onChange={(event) => setCity(event.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

    </div>
  );
}
export default SearchBar;
