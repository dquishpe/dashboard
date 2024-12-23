import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { Grid } from "@mui/material";

interface ForecastData {
  dt: number;
  main: {
    temp: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
}

interface ControlWeatherProps {
  forecastData: ForecastData[];
}

const ControlWeather: React.FC<ControlWeatherProps> = ({ forecastData }) => {
  const [selectedVariable, setSelectedVariable] = useState<string | null>("Temperatura");

  // Calcular promedios por secciones del día
  const calculateDailyAverages = (variable: "temp" | "humidity" | "wind") => {
    const sections = {
      "Morning ☀️": { sum: 0, count: 0 },
      "Afternoon 🌤️": { sum: 0, count: 0 },
      "Night 🌙": { sum: 0, count: 0 },
    };

    forecastData.forEach((forecast) => {
      const hour = new Date(forecast.dt * 1000).getHours();
      let value = 0;
      if (variable === "temp" || variable === "humidity") {
        value = forecast.main[variable];
      } else if (variable === "wind") {
        value = forecast.wind.speed;
      }

      if (hour >= 0 && hour < 12) {
        sections["Morning ☀️"].sum += value;
        sections["Morning ☀️"].count++;
      } else if (hour >= 12 && hour < 18) {
        sections["Afternoon 🌤️"].sum += value;
        sections["Afternoon 🌤️"].count++;
      } else {
        sections["Night 🌙"].sum += value;
        sections["Night 🌙"].count++;
      }
    });

    return Object.entries(sections).map(([section, data]) => ({
      section,
      average: data.count > 0 ? (data.sum / data.count).toFixed(2) : "N/A",
    }));
  };

  const variableMap: Record<string, "temp" | "humidity" | "wind"> = {
    Temperatura: "temp",
    Humedad: "humidity",
    Viento: "wind",
  };

  const averages =
    selectedVariable && variableMap[selectedVariable]
      ? calculateDailyAverages(variableMap[selectedVariable])
      : [];

  const handleVariableChange = (_event: React.MouseEvent<HTMLElement>, newVariable: string) => {
    setSelectedVariable(newVariable);
  };

  return (
    <Paper
      sx={{
        p: 3,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#1e2a47", // Fondo oscuro
        color: "white",
        borderRadius: 2,
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Sombra suave
      }}
    >
      <Typography mb={2} component="h3" variant="h6" color="white" align="center">
        Meteorological Variables
      </Typography>

      <ToggleButtonGroup
        value={selectedVariable}
        exclusive
        onChange={handleVariableChange}
        aria-label="weather variables"
        sx={{
          mb: 2,
          backgroundColor: "#2a3d62", // Fondo más claro para el grupo de botones
          borderRadius: 1,
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          display: "flex",
          justifyContent: "space-between", // Centra los botones
          width: "100%", // Ocupa todo el espacio disponible
        }}
      >
        <ToggleButton value="Temperatura" sx={{ color: "white", "&.Mui-selected": { backgroundColor: "#f9a61e", color: "white" }, flexGrow: 1, textAlign: "center" }}>
          Temperature
        </ToggleButton>
        <ToggleButton value="Humedad" sx={{ color: "white", "&.Mui-selected": { backgroundColor: "#f9a61e", color: "white" } , flexGrow: 1, textAlign: "center" }}>
          Humidity
        </ToggleButton>
        <ToggleButton value="Viento" sx={{ color: "white", "&.Mui-selected": { backgroundColor: "#f9a61e", color: "white" } , flexGrow: 1, textAlign: "center" }}>
          Wind Speed
        </ToggleButton>
      </ToggleButtonGroup>

      {averages.length > 0 && (
        <Grid container spacing={2} mt={2}>
          <Grid item xs={12}>
            {averages.map((average) => (
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  backgroundColor: "#2a3d62", // Fondo oscuro de la tarjeta
                  color: "white",
                  borderRadius: 2,
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Sombra suave
                  mb: 2, // Espaciado entre tarjetas
                }}
                key={average.section}
              >
                <Typography variant="body1" fontWeight="bold">
                  {average.section}
                </Typography>
                <Typography variant="body1">
                  {average.average}{" "}
                  {selectedVariable === "Temperatura"
                    ? "°C"
                    : selectedVariable === "Viento"
                    ? "m/s"
                    : "%"}
                </Typography>
              </Paper>
            ))}
          </Grid>
        </Grid>
      )}
    </Paper>
  );
};

export default ControlWeather;
