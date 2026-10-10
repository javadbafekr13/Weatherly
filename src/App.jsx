import { useState, useRef } from "react";
import SearchBar from "./SearchBar";
import WeatherCard from "./WeatherCard";

function App() {
  const [searchedCity, setSearchedCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [status, setStatus] = useState("idle");
  const [darkMode, setDarkMode] = useState(false);
  const searchId = useRef(0);

  function handleCitySearch(city) {
    searchId.current += 1;

    const currentSearchId = searchId.current;

    setSearchedCity(city);
    setWeather(null);
    setStatus("loading");

    getCoordinates(city, currentSearchId);
  }

  async function getCoordinates(city, currentSearchId) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => {
        controller.abort();
      }, 10000);
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`,
        {
          signal: controller.signal,
        }
      );
      clearTimeout(timeout);
      if (!response.ok) {
        throw new Error("Could not connect to location service");
      }

      const data = await response.json();

      if (currentSearchId !== searchId.current) {
        return;
      }

      if (!data.results || data.results.length === 0) {
        throw new Error("City not found");
      }

      const latitude = data.results[0].latitude;
      const longitude = data.results[0].longitude;

      await getWeather(latitude, longitude, currentSearchId);
    } catch (error) {
      if (error.name === "AbortError") {
        setStatus("timeout");
      } else {
        console.log(error);
        setStatus("error");
      }
    }
  }

  async function getWeather(latitude, longitude, currentSearchId) {
    try {
      const controller = new AbortController();

      const timeout = setTimeout(() => {
        controller.abort();
      }, 10000);

      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`,
        {
          signal: controller.signal,
        }
      );

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error("Could not get weather data");
      }

      const data = await response.json();

      if (currentSearchId !== searchId.current) {
        return;
      }

      setWeather(data);
      setStatus("success");
    } catch (error) {
      if (error.name === "AbortError") {
        setStatus("timeout");
      } else {
        console.log(error);
        setStatus("error");
      }
    }
  }
  return (
    <div className={darkMode ? "app dark" : "app"}>
      <button className="theme-button" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "☀️ Light" : "🌙 Dark"}
      </button>
      <h1>Weatherly</h1>

      <SearchBar onSearch={handleCitySearch} />

      {status === "idle" && <p>Search for a city to see its weather.</p>}

      {status === "loading" && <p>Loading weather for {searchedCity}...</p>}

      {status === "error" && (
        <p>Something went wrong. Please check the city name and try again.</p>
      )}
      {status === "timeout" && <p>Request took too long. Please try again.</p>}
      {status === "success" && weather && <WeatherCard weather={weather} />}
    </div>
  );
}

export default App;
