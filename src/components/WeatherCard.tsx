import React from "react";
import { Box, Typography } from "@mui/material";
import clouds from "/img/clouds.jpeg"; // Imagen para el día
import cloudsnight from "/img/cloudsnight.jpg"; // Imagen para la noche

interface WeatherCardProps {
  city: string;
  country: string;
  latitude: string;
  longitude: string;
  temperature: string;
  time: JSX.Element; 
  date: string;
  description: string; 
  icon: string; 
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  city,
  country,
  latitude,
  longitude,
  temperature,
  time,
  date,
  description,
  icon,
}) => {
  // Determinar si es de día o de noche 
  const isDaytime = () => {
    const now = Math.floor(Date.now() / 1000); // Timestamp actual en segundos
    const date = new Date(now * 1000); // Fecha desde el timestamp actual
    const localHour = date.getHours(); // Hora local actual
    console.log("Fecha actual:", date, "LocalHour:", localHour);
    return localHour >= 6 && localHour < 19; // Día entre 6 AM y 7 PM
  };

  const backgroundImage = isDaytime() ? clouds : cloudsnight; // Selección de fondo

  return (
    <Box
      sx={{
        backgroundImage: `url(${backgroundImage})`, // Fondo dinámico según la hora
        backgroundSize: "cover", 
        backgroundPosition: "center", 
        backgroundRepeat: "no-repeat", 
        color: isDaytime() ? "black" : "white", // Ajusta el color del texto
        padding: 2,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column", 
        alignItems: "center",
        gap: 3, 
      }}
    >
      {/* Información de la ciudad y coordenadas */}
      <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
        <Box sx={{ flex: 1, paddingRight: 2, fontWeight: "bold" }}>
          <Typography variant="h6">{`${city}, ${country}`}</Typography>
          <Typography variant="body2">{`Latitude: ${latitude} / Longitude: ${longitude}`}</Typography>
        </Box>

        {/* Información de la hora y fecha */}
        <Box sx={{ flex: 1, paddingLeft: 2, textAlign: "right" }}>
          {time && <Typography variant="body2">{time}</Typography>}
          <Typography variant="body2">{date}</Typography>
        </Box>
      </Box>

      {/* Información de la temperatura, icono y descripción */}
      <Box sx={{ textAlign: "center", fontWeight: "bold" }}>
        <Typography variant="h4">{`${temperature}°C`}</Typography>
        <img
          src={`http://openweathermap.org/img/wn/${icon}@2x.png`}
          alt={description}
          style={{ width: 75, height: 75 }}
        />
        <Typography variant="body2">{description}</Typography>
      </Box>
    </Box>
  );
};

export default WeatherCard;
