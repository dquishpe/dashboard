import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from "@mui/material";

interface ForecastData {
  dt: number;
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    icon: string;
  }>;
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
  };
}

interface ForecastTableProps {
  forecastData: ForecastData[];
}

const ForecastTable: React.FC<ForecastTableProps> = ({ forecastData }) => {
  if (!forecastData || !Array.isArray(forecastData) || forecastData.length === 0) {
    return (
      <Box sx={{ p: 2, color: "white", backgroundColor: "#1b1b1b" }}>
        No hay datos disponibles
      </Box>
    );
  }

  // Agrupar los datos por día
  const dailyData = forecastData.reduce((acc, forecast) => {
    const forecastDate = new Date(forecast.dt * 1000).toISOString().split("T")[0];
    if (!acc[forecastDate]) {
      acc[forecastDate] = {
        temps: [],
        humidities: [],
        clouds: [],
        winds: [],
        icon: forecast.weather[0].icon,
      };
    }
    acc[forecastDate].temps.push(forecast.main.temp);
    acc[forecastDate].humidities.push(forecast.main.humidity);
    acc[forecastDate].clouds.push(forecast.clouds.all);
    acc[forecastDate].winds.push(forecast.wind.speed);
    return acc;
  }, {} as Record<string, { temps: number[]; humidities: number[]; clouds: number[]; winds: number[]; icon: string }>);

  // Calcular promedios por día
  const dailyAverages = Object.entries(dailyData).map(([date, data]) => ({
    date,
    avgTemp: data.temps.reduce((sum, temp) => sum + temp, 0) / data.temps.length,
    avgHumidity: data.humidities.reduce((sum, hum) => sum + hum, 0) / data.humidities.length,
    avgClouds: data.clouds.reduce((sum, cloud) => sum + cloud, 0) / data.clouds.length,
    avgWind: data.winds.reduce((sum, wind) => sum + wind, 0) / data.winds.length,
    icon: data.icon,
  }));

  return (
    <TableContainer
      component={Paper}
      sx={{
        backgroundColor: "transparent",
        borderRadius: 2,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
        overflow: "hidden",
        width: "66.3rem",
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: 2,
        align: "space-between",
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{ color: "white", fontWeight: "bold", backgroundColor: "#08143c", textAlign: "center" } }
            >
              DAY
            </TableCell>
            <TableCell
              sx={{ color: "white", fontWeight: "bold", backgroundColor: "#08143c", textAlign: "center" } }
              align="right"
            >
              AVERAGE TEMPERATURE
            </TableCell>
            <TableCell
              sx={{ color: "white", fontWeight: "bold", backgroundColor: "#08143c", textAlign: "center" } }
              align="right"
            >
              HUMIDITY
            </TableCell>
            <TableCell
              sx={{ color: "white", fontWeight: "bold", backgroundColor: "#08143c", textAlign: "center"}}
              align="right"
            >
              CLOUDINESS
            </TableCell>
            <TableCell
              sx={{ color: "white", fontWeight: "bold", backgroundColor: "#08143c", textAlign: "center" }}
              align="right"
            >
              WIND
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dailyAverages.map((day) => (
            <TableRow
              key={day.date}
              sx={{
                backgroundColor: "transparent",
                "&:hover": { backgroundColor: "#48c3fc" },
              }}
            >
              <TableCell sx={{ color: "white" }} align="center">
                {new Date(day.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                }).toUpperCase()}
              </TableCell>
                <TableCell sx={{ color: "white", display: "flex", justifyContent: "center", alignItems: "center" }} align="center">
                <img
                  src={`http://openweathermap.org/img/w/${day.icon}.png`}
                  alt="Clima"
                  style={{ width: 25, height: 25, marginRight: 8 }}
                />
                {Math.round(day.avgTemp)}°C
                </TableCell>
              <TableCell sx={{ color: "white" }} align="center">
                {Math.round(day.avgHumidity)}%
              </TableCell>
              <TableCell sx={{ color: "white" }} align="center">
                {Math.round(day.avgClouds)}%
              </TableCell>
              <TableCell sx={{ color: "white" }} align="center">
                {Math.round(day.avgWind)} m/s
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ForecastTable;
