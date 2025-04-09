import React, { useState } from 'react';
import axios from 'axios';
import WeatherCard from './components/weather';
import ForecastCard from './components/forecast';
import { motion } from 'framer-motion';
import weather from './assets/weather1.jpeg'; // ✅ make sure this path is correct

const MAX_SEARCH_HISTORY = 5;
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

function WeatherApp() {
 
  const [inputvalue, setinputvalue] = useState('');

  const [currentweather, setcurrentweather] = useState(null);

  const [upcomingforecast, setupcomingforecast] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [errormessage, seterrormessage] = useState('');

  
  const [pastSearches, setPastSearches] = useState(() => {
    const saved = localStorage.getItem('weatherSearchHistory');
    return saved ? JSON.parse(saved) : [];
  });

  
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

 
  const fetchWeatherData = async (location) => {
    const cleanLocation = location
    if (!cleanLocation) return;

    setisLoading(true);
    seterrormessage('');
    setcurrentweather(null);
    setupcomingforecast([]);

    try {
    
      const [currentResponse, forecastResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/weather?q=${encodeURIComponent(cleanLocation)}&appid=${apiKey}&units=metric`),
        
        axios.get(`${API_BASE_URL}/forecast?q=${encodeURIComponent(cleanLocation)}&appid=${apiKey}&units=metric`)

      ]);

  
      setcurrentweather(currentResponse.data);

     
      const forecasts = [];
const seenDays = new Set();

console.log('Processing forecast data...'); 

forecastResponse.data.list.forEach(f => {
  const date = new Date(f.dt * 1000);
  const dayStr = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  

  if (!seenDays.has(dayStr) && date.getHours() >= 11) {
    forecasts.push(f);
    seenDays.add(dayStr);
  }
});


if (forecasts.length < 5) {
  forecasts.push(...forecastResponse.data.list.slice(0, 5 - forecasts.length));
}

setupcomingforecast(forecasts);

      
      addToSearchHistory(cleanLocation);

    } catch {
      console.error('Weather fetch error:');
      seterrormessage('Failed to get weather data. Check the city name or try again.');
    } finally {
      setisLoading(false);
    }
  };

  const addToSearchHistory = (newSearch) => {
    const updatedHistory = [
      newSearch,
      ...pastSearches.filter(item => item !== newSearch)
    ].slice(0, MAX_SEARCH_HISTORY);

    setPastSearches(updatedHistory);
    localStorage.setItem('weatherSearchHistory', JSON.stringify(updatedHistory));
  };

  // Event handlers
  const handleSearch = () => {
    fetchWeatherData(inputvalue);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleHistoryItemClick = (previousSearch) => {
    setinputvalue(previousSearch);
    fetchWeatherData(previousSearch);
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${weather})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <div className="transition-all duration-300 bg-white/80 dark:bg-gray-900/80 p-6 rounded-lg shadow-lg max-w-md w-full backdrop-blur-sm">
        <header className="mb-4 text-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Know Your City Weather</h1>
        </header>

        <div className="mb-4">
          <input
            type="text"
            value={inputvalue}
            onChange={(e) => setinputvalue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for a city..."
            className=" text-white border-gray-700 dark:border-gray-600 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
          />
          <button
            onClick={handleSearch}
            className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Search
          </button>
        </div>

        {pastSearches.length > 0 && (
          <div className="mb-4">
        
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recent searches:</p>
            <div className="flex flex-wrap gap-2">
              {pastSearches.map((city, i) => (
                <button
                  key={`${city}-${i}`}
                  onClick={() => handleHistoryItemClick(city)}
                  className="bg-gray-200 dark:bg-gray-700 text-sm px-3 py-1 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center my-4">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {errormessage && (
          <p className="text-center text-red-600 font-medium mt-2">City is not found</p>
        )}

        {currentweather && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <WeatherCard data={currentweather} />
            <button 
              onClick={() => fetchWeatherData(inputvalue)}
              className="mt-3 text-sm text-blue-600 hover:underline"
            >
              🔄 Refresh Data
            </button>
          </motion.div>
        )}

        {upcomingforecast.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6"
          >
            <ForecastCard forecast={upcomingforecast} />
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default WeatherApp;
