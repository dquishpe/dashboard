import React, { useState } from 'react';
import { TextField, Button, Grid } from '@mui/material';

interface SearchCityWeatherProps {
  onSearch: (city: string) => void; // Función que recibe la ciudad buscada
}

const SearchCityWeather: React.FC<SearchCityWeatherProps> = ({ onSearch }) => {
  const [city, setCity] = useState<string>('');

  const handleSearch = () => {
    const trimmedCity = city.trim();
    if (trimmedCity === '') {
      alert('Please, enter a city name'); 
      return;
    }
    onSearch(trimmedCity); // Enviar la ciudad al componente padre
    setCity('');
  };

  return (
    <Grid container alignItems="center" spacing={2} justifyContent={'center'}>
      {/* Campo de texto para la búsqueda de ciudad */}
      <Grid item xs={8} >
        <TextField
          label="Search city"
          variant="outlined"
          fullWidth
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Insert city from anywhere in the world"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px", 
              backgroundColor: "transparent", 
              borderColor: "white", 
            },
            "& .MuiInputLabel-root": {
              color: "rgba(255, 255, 255, 0.7)",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "white", 
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#08143c", 
            },
            "& .MuiInputBase-input": {
              color: "white", 
            },
            "&::placeholder": {
              color: "rgba(255, 255, 255, 0.7)", 
            },
          }}
        />
      </Grid>

      {/* Botón de búsqueda */}
      <Grid item xs={4}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#08143c", 
            "&:hover": {
              backgroundColor: "#08143c", 
            },
            color: "white", 
            padding: "12px", 
            borderRadius: "10px", 
          }}
          fullWidth
          onClick={handleSearch}
        >
          Search
        </Button>
      </Grid>
    </Grid>
  );
};

export default SearchCityWeather;
