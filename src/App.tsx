import React, { useState, useCallback, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import SearchCityWeather from "./components/SearchCityWeather";
import WeatherCard from "./components/WeatherCard";
import ForecastTable from "./components/ForecastTable";
import DailySummaryWeather from "./components/DailySummaryWeather";
import ForecastSummary from "./components/ForecastSummary";
import ControlWeather from "./components/ControlWeather";
import WeatherChart from "./components/WeatherChart";
import HeaderNav from "./components/HeaderNav";
import "./App.css";


interface WeatherData {
  current: {
    time: Date;
    temperature: number;
    humidity: number;
    feelsLike: number;
    description: string;
    cloudCover: number;
    pressure: number;
    windSpeed: number;
    windDirection: number;
    rain?: number;
    visibility: number;
    tempMax?: number;
    tempMin?: number;
    precipitation?: number;
    icon?: string
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
  city: string;
  country: string;
  sunrise: Date;
  sunset: Date;
}

interface ForecastData {
  dt: number;
  dt_txt: string;
  main: {
    temp: number;
    humidity: number;
    temp_min: number;
    temp_max: number;
    precipitation: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
  };
}

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Determinar el color del texto según la hora
  const currentHour = time.getHours();
  const textColor = currentHour >= 18 || currentHour < 6 ? "white" : "black";

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "right",
        backgroundColor: "transparent",
        padding: "8px 16px",
        borderRadius: "12px",
        justifyContent: "right",
      }}
    >
      <Typography
        sx={{
          fontWeight: 600,
          fontSize: { xs: "1rem", sm: "1.25rem" },
          color: textColor, // Usar el color determinado
          fontFamily: "monospace",
          align: "right",
        }}
      >
        {time.toLocaleTimeString()}
      </Typography>
    </Box>
  );
};

const formatDate = (dateString: string): string => {
  const [day, month, year] = dateString.split("/").map(Number);
  const date = new Date(year, month - 1, day); 
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long", 
    day: "numeric", 
    month: "long", 
    year: "numeric", 
  }).format(date);

  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
};

const capitalizeWords = (phrase: string): string => {
  return phrase
    .split(" ") 
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) 
    .join(" "); 
};


const App: React.FC = () => {
  const [city, setCity] = useState<string>("Guayaquil");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [dailySummary, setDailySummary] = useState({
    thermalSensation: '',
    humidity: '',
    cloudCover: '',
    windSpeed: '',
  });

  const fetchWeatherData = useCallback(async (city: string) => {
    try {
      const API_KEY = "995db4d7a668dd46d50ca8fc16a700b0";

      // Fetch current weather
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      const currentData = await currentResponse.json();

      // Fetch forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
      );
      const forecastData = await forecastResponse.json();

      if (currentData) {
        const weatherData: WeatherData = {
          current: {
            time: new Date(currentData.dt * 1000),
            temperature: currentData.main.temp,
            humidity: currentData.main.humidity,
            feelsLike: currentData.main.feels_like,
            description: currentData.weather[0].description,
            cloudCover: currentData.clouds.all,
            pressure: currentData.main.pressure,
            windSpeed: currentData.wind.speed,
            windDirection: currentData.wind.deg,
            rain: currentData.rain ? currentData.rain["1h"] : 0,
            visibility: currentData.visibility,
            tempMax: currentData.main.temp_max,
            tempMin: currentData.main.temp_min,
            precipitation: currentData.main.precipitation,
            icon: currentData.weather[0].icon,
          },
          coordinates: {
            latitude: currentData.coord.lat,
            longitude: currentData.coord.lon,
          },
          city: currentData.name,
          sunrise: new Date(currentData.sys.sunrise * 1000),
          sunset: new Date(currentData.sys.sunset * 1000),
          country: currentData.sys.country,
        };

        setWeatherData(weatherData);
        setDailySummary({thermalSensation: `${weatherData.current.feelsLike}°C`, humidity: `${weatherData.current.humidity}%`, cloudCover: `${weatherData.current.cloudCover}mm`, windSpeed: `${weatherData.current.windSpeed}m/s`});
      }

      if (forecastData && forecastData.list) {
        setForecastData(forecastData.list);
      }
    } catch (error) {
      console.error("Error al realizar el fetch:", error);
    }
  }, []);

  useEffect(() => {
    if (city) {
      fetchWeatherData(city);
    }
  }, [city, fetchWeatherData]);

  return (
    <Box sx={{ backgroundColor: "#36477e", color: "white"}} >
    {/* Encabezado de Navegación */}
    <HeaderNav />
    {/* Sección Inicio */}
    <Box id="inicio" sx={{ p: 4 }}>
      <Grid container spacing={4} >
        {/* Columna Izquierda */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4, flexGrow: 1}}>
            <SearchCityWeather onSearch={(newCity) => setCity(newCity)} />
            {weatherData && (
              <WeatherCard
                city={weatherData.city}
                country={weatherData.country}
                latitude={weatherData.coordinates.latitude.toFixed(2)}
                longitude={weatherData.coordinates.longitude.toFixed(2)}
                temperature={`${weatherData.current.temperature}`}
                description={capitalizeWords(weatherData.current.description)}
                time={<Clock />}
                date={formatDate(weatherData.current.time.toLocaleDateString())}
                icon={weatherData.current.icon || ""}
                dt = {forecastData.length > 0 ? forecastData[0].dt : 0}
              />
            )}
          </Box>
        </Grid>

        {/* Columna Derecha */}
        <Grid item xs={12} md={6} alignContent={'center'}>
          <Typography variant="h6" align="center" sx={{ mb: 1 }}>
          Discover detailed weather forecasts for any city in the world. Get detailed information to better plan your day in WeatherTech!
          </Typography>
          <DailySummaryWeather
            thermalSensation={parseFloat(dailySummary.thermalSensation)}
            humidity={parseFloat(dailySummary.humidity)}
            cloudCover={parseFloat(dailySummary.cloudCover)}
            windSpeed={parseFloat(dailySummary.windSpeed)}
          />
        </Grid>
      </Grid>
    </Box>

    {/* Sección Pronóstico */}
    <Box id="pronostico" sx={{ p: 4 }}>
      <Typography variant="h4" align="center" sx={{ mb: 4 }}>
        Forecast
      </Typography>
      <Grid container spacing={4}>
        {/* Columna Izquierda */}
        <Grid item xs={12} md={6} alignContent={'center'}>
          <ControlWeather forecastData={forecastData} />
        </Grid>

        {/* Columna Derecha */}
        <Grid item xs={12} md={6}>
          <WeatherChart
            latitude={weatherData?.coordinates.latitude || -2.1962}
            longitude={weatherData?.coordinates.longitude || -79.8862}
          />
        </Grid>
      </Grid>
    </Box>

    {/* Sección Estadísticas */}
    <Box id="estadistica" sx={{ p: 4 }}>
      <Typography variant="h4" align="center" sx={{ mb: 2 }} justifyContent={'center'}>
        Statistics
      </Typography>
      <Typography variant="h6" align="center" sx={{ mb: 2 }}>
       ¡Check out the weather statistics for the next 5 days 📆!
      </Typography>
      <Box sx={{ mb: 2 }}>
        <ForecastSummary
          forecastData={forecastData}
          selectedDay={new Date().toLocaleDateString()}
          onDaySelect={(day) => console.log(day)}
        />
      </Box>
      <Box alignContent={'space-between'} justifyContent={'space-between'}>
        {forecastData.length > 0 && <ForecastTable forecastData={forecastData} />}
      </Box>
    </Box>

    {/* Footer */}
    <Box
      component="footer"
      sx={{
        backgroundColor: "#1d2b5a",
        color: "white",
        textAlign: "center",
        py: 2,
        mt: 4,
      }}
    >
      <Typography variant="body2">
        © 2024 WeatherTech. All rights reserved.
      </Typography>
    </Box>
  </Box>
  );

};

export default App;
