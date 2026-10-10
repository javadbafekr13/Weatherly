function getWeatherDescription(code) {
    if (code === 0) {
      return "Clear sky";
    }
  
    if (code >= 1 && code <= 3) {
      return "Cloudy";
    }
  
    if (code >= 45 && code <= 48) {
      return "Foggy";
    }
  
    if (code >= 51 && code <= 67) {
      return "Rainy";
    }
  
    if (code >= 71 && code <= 77) {
      return "Snowy";
    }
  
    if (code >= 80 && code <= 82) {
      return "Rain showers";
    }
  
    if (code >= 95) {
      return "Thunderstorm";
    }
  
    return "Unknown";
  }
  
  
  function WeatherCard({ weather }) {
    const description = getWeatherDescription(
      weather.current.weather_code
    );
  
    return (
        <div className="weather-card">
          <h2>Current Weather</h2>
      
          <div className="weather-main">
            <div>
              <h3>{description}</h3>
      
              <p className="temperature">
                {weather.current.temperature_2m}°C
              </p>
            </div>
          </div>
      
          <div className="weather-details">
            <div>
              <span>💧</span>
              <p>Humidity</p>
              <strong>
                {weather.current.relative_humidity_2m}%
              </strong>
            </div>
      
            <div>
              <span>💨</span>
              <p>Wind</p>
              <strong>
                {weather.current.wind_speed_10m} km/h
              </strong>
            </div>
          </div>
        </div>
      );
  }
  
  
  export default WeatherCard;