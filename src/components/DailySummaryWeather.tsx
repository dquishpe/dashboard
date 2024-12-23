import React from "react";
import { Box, Grid, Typography } from "@mui/material";

// Props para los datos climáticos
interface WeatherSummaryProps {
  thermalSensation: number;
  humidity: number;
  cloudCover: number;
  windSpeed: number;
}

const DailySummaryWeather: React.FC<WeatherSummaryProps> = ({
  thermalSensation,
  humidity,
  cloudCover,
  windSpeed,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        padding: 2,
        backgroundColor: "#1e2a47",
        borderRadius: 2,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Cuadrícula 2x2 */}
      <Grid container spacing={2}>
        {/* Columna 1, Fila 1 - Feels Like */}
        <Grid item xs={6}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "#2a3d62",
              padding: 2,
              borderRadius: 1,
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            <Typography sx={{ fontSize: 24 }}>🌡️</Typography>
            <Typography sx={{ fontWeight: "bold", color: "white" }}>
              Feels like
            </Typography>
            <Typography sx={{ color: "white" }}>
              {thermalSensation.toFixed(2)}°
            </Typography>
          </Box>
        </Grid>

        {/* Columna 2, Fila 1 - Humidity */}
        <Grid item xs={6}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "#2a3d62",
              padding: 2,
              borderRadius: 1,
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            <Typography sx={{ fontSize: 24 }}>💧</Typography>
            <Typography sx={{ fontWeight: "bold", color: "white" }}>
              Humidity
            </Typography>
            <Typography sx={{ color: "white" }}>{humidity}%</Typography>
          </Box>
        </Grid>

        {/* Columna 1, Fila 2 - Cloud Cover */}
        <Grid item xs={6}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "#2a3d62",
              padding: 2,
              borderRadius: 1,
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            <Typography sx={{ fontSize: 24 }}>☁️</Typography>
            <Typography sx={{ fontWeight: "bold", color: "white" }}>
              Cloud Cover
            </Typography>
            <Typography sx={{ color: "white" }}>{cloudCover}%</Typography>
          </Box>
        </Grid>

        {/* Columna 2, Fila 2 - Wind */}
        <Grid item xs={6}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "#2a3d62",
              padding: 2,
              borderRadius: 1,
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            <Typography sx={{ fontSize: 24 }}>🌀</Typography>
            <Typography sx={{ fontWeight: "bold", color: "white" }}>
              Wind
            </Typography>
            <Typography sx={{ color: "white" }}>
              {windSpeed.toFixed(2)} m/s
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DailySummaryWeather;
