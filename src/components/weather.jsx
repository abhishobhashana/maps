import React, { useEffect, useState } from "react";
import {
  Cloud,
  CloudSun,
  Night,
  Snow,
  Sun,
  ThunderStorm,
} from "../assets/icons";

const Weather = ({ isMobile, latitude, longitude }) => {
  const [weatherData, setWeatherData] = useState(null);
  const apiKey = process.env.OPEN_WEATHER_API_KEY;

  const getWeatherIcon = (iconCode) => {
    switch (iconCode) {
      case "01d":
        return <Sun />; // clear sky (day)
      case "01n":
        return <Night />; // clear sky (night)
      case "02d":
      case "02n":
        return <Cloud />; // few clouds
      case "03d":
      case "03n":
        return <CloudSun />; // scattered clouds
      case "04d":
      case "04n":
        return "☁️"; // broken clouds
      case "09d":
      case "09n":
        return "🌧️"; // shower rain
      case "10d":
      case "10n":
        return "🌦️"; // rain
      case "11d":
      case "11n":
        return <ThunderStorm />; // thunderstorm
      case "13d":
      case "13n":
        return <Snow />; // snow
      case "50d":
      case "50n":
        return <Night />; // mist
      default:
        return "";
    }
  };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
        );
        const data = await response.json();
        setWeatherData(data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeather();
  }, [apiKey, latitude, longitude]);

  return (
    <>
      {isMobile ? (
        <div className="absolute bottom-[15.5rem] right-2.5 flex items-center bg-light-white dark:bg-secondary shadow-md rounded-xl p-2">
          {getWeatherIcon(weatherData?.weather[0]?.icon)}
          <span className="text-[17px]  text-light-grey-second">
            {Math.trunc(weatherData?.main?.feels_like)}°
          </span>
        </div>
      ) : (
        <div className="lg:flex md:hidden sm:hidden flex md:flex w-fit items-center bg-light-white dark:bg-secondary shadow-md rounded-xl p-2 m-3 mr-0">
          {getWeatherIcon(weatherData?.weather[0]?.icon)}
          <span className="text-[17px]  text-light-grey-second">
            {Math.trunc(weatherData?.main?.feels_like)}°
          </span>
        </div>
      )}
    </>
  );
};

export default Weather;
