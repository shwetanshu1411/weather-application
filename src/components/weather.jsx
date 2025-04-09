
  

const WeatherCard = ({ data }) => {
  const { name, main, weather, wind } = data;
  const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

  return (
    <div className="mt-4 bg-blue-50 dark:bg-gray-800 rounded-lg p-4 text-center shadow-md transition-all">
      <h2 className="text-xl font-semibold dark:text-white">{name}</h2>

      <img
        src={iconUrl}
        alt={weather[0].description}
        className="mx-auto w-20 h-20"
      />

      <p className="text-lg capitalize text-gray-700 dark:text-gray-300">
        {weather[0].description}
      </p>

      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        {main.temp}°C
      </p>

      <div className="mt-3 text-sm text-gray-700 dark:text-gray-300 space-y-1">
        <p>Humidity: {main.humidity}%</p>
        <p>Wind: {wind.speed} km/h</p>
      </div>
    </div>
  );
};

export default WeatherCard;
