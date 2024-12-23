import React from "react";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import file from '/img/file.png';

const HeaderNav: React.FC = () => {
  return (
    <AppBar position="sticky" sx={{ backgroundColor: "#08143c", borderBottom: '1px solid #ccc', gap:4}} elevation={0}>
      <Toolbar>
        {/* Imagen alineada a la izquierda */}
        <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
          <img src={file} alt="Logo" style={{ height: "50px" }}/> 
          <Typography variant="h6" sx={{ color: "white", marginLeft: "1rem" }}>
            WeatherTech
          </Typography>
        </Box>

        {/* Navegación alineada a la derecha */}
        <Box sx={{ display: "flex" }}>
          <Button
            href="#inicio" // Identificador de la sección de inicio
            sx={{ color: "white", textTransform: "none" }}
          >
            🏠Home
          </Button>
          <Button
            href="#pronostico" // Identificador de la sección de pronóstico
            sx={{ color: "white", textTransform: "none" }}
          >
            📈Forecast
          </Button>
          <Button
            href="#estadistica" // Identificador de la sección de estadísticas
            sx={{ color: "white", textTransform: "none" }}
          >
            📆Statistics
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderNav;
