const ForecastCard = ({ forecast }) => {
    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3 text-center dark:text-white">5-Day Forecast</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {forecast.map((item, idx) => {
            const date = new Date(item.dt_txt);
            const day = date.toLocaleDateString("en-US", { weekday: "short" });
            const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
  
            return (
              <div
                key={idx}
                className="bg-blue-100 dark:bg-gray-700 p-3 rounded-lg text-center shadow"
              >
                <p className="text-sm font-medium dark:text-white">{day}</p>
                <img
                  src={iconUrl}
                  alt={item.weather[0].description}
                  className="mx-auto w-12 h-12"
                />
                <p className="capitalize text-sm text-gray-700 dark:text-gray-300">
                  {item.weather[0].description}
                </p>
                <p className="font-bold text-gray-800 dark:text-white">
                  {item.main.temp}°C
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  export default ForecastCard;
  