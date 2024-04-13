import React, { useEffect, useState } from "react";
import {
  Cloud,
  CloudSun,
  Night,
  Rain,
  RainHeavy,
  Snow,
  Sun,
  ThunderStorm,
} from "../assets/icons";

const Weather = ({ isMobile, latitude, longitude, setName }) => {
  const [weatherData, setWeatherData] = useState(null);
  const apiKey = process.env.OPEN_WEATHER_API_KEY;

  const getWeatherIcon = (iconCode) => {
    switch (iconCode) {
      case "01d":
        return <Sun />;
      case "01n":
        return <Night />;
      case "02d":
      case "02n":
        return <CloudSun />;
      case "03d":
      case "03n":
        return <Cloud />;
      case "04d":
      case "04n":
        return <Cloud />;
      case "09d":
      case "09n":
        return <Rain />;
      case "10d":
      case "10n":
        return <RainHeavy />;
      case "11d":
      case "11n":
        return <ThunderStorm />;
      case "13d":
      case "13n":
        return <Snow />;
      case "50d":
        return <Cloud />;
      case "50n":
        return <Night />;
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
        setName(data?.name);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeather();
  }, [apiKey, latitude, longitude]);

  return (
    <>
      {isMobile ? (
        <div className="absolute bottom-[15.5rem] right-2.5 flex items-center bg-light-white dark:bg-secondary shadow-md rounded-xl p-2 gap-0.5">
          {getWeatherIcon(weatherData?.weather[0]?.icon)}
          <span className="text-[17px] text-light-grey-second">
            {Math.trunc(weatherData?.main?.temp)}°
          </span>
        </div>
      ) : (
        <div className="lg:flex md:hidden sm:hidden flex md:flex w-fit items-center bg-light-white dark:bg-secondary shadow-md rounded-xl p-2 gap-0.5 m-3 mr-0">
          {getWeatherIcon(weatherData?.weather[0]?.icon)}
          <span className="text-[17px] text-light-grey-second">
            {Math.trunc(weatherData?.main?.temp)}°
          </span>
        </div>
      )}
    </>
  );
};

export default Weather;
