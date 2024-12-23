import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Paper, Typography, Box } from '@mui/material';
import { useState, useEffect } from 'react';
import { LineChart } from '@mui/x-charts';

interface WeatherData {
  time: string[];
  relative_humidity_2m: number[];
  apparent_temperature: number[];
  precipitation_probability: number[];
}

interface LineChartWeatherProps {
  latitude: number;
  longitude: number;
}

export default function LineChartWeather({ latitude, longitude }: LineChartWeatherProps) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [dataType, setDataType] = useState<string>('humidity');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=relative_humidity_2m,apparent_temperature,precipitation_probability&timezone=auto&forecast_days=1`
        );
        const data = await response.json();
        
        const hours = Array.from({ length: 24 }, (_, i) => i);
        
        setWeatherData({
          time: hours.map(String),
          relative_humidity_2m: data.hourly.relative_humidity_2m.slice(0, 24),
          apparent_temperature: data.hourly.apparent_temperature.slice(0, 24),
          precipitation_probability: data.hourly.precipitation_probability.slice(0, 24),
        });
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchData();
  }, [latitude, longitude]);

  const handleDataTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setDataType(event.target.value as string);
  };

  if (!weatherData) return null;

  const getDataConfig = () => {
    switch (dataType) {
      case 'temperature':
        return {
          data: weatherData.apparent_temperature,
          label: 'Temperature (°C)',
          color: '#f9a61e'
        };
      case 'humidity':
        return {
          data: weatherData.relative_humidity_2m,
          label: 'Humidity (%)',
          color: '#48c3fc'
        };
      case 'precipitation':
        return {
          data: weatherData.precipitation_probability,
          label: 'Precipitation Probability (%)',
          color: '#c669ff'
        };
      default:
        return {
          data: weatherData.apparent_temperature,
          label: 'Temperature (°C)',
          color: '#f9a61e'
        };
    }
  };

  const dataConfig = getDataConfig();
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <Paper sx={{  
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      gap: 2,
      width: '100%',
      maxWidth: '100%',
      backgroundColor: '#1111213d', // Azul oscuro
      paddingTop: '16px',
      paddingBottom: '16px',
    }}>
      <Typography variant="h6" color="white" align="center">
        Find out what the weather will be like at every hour of today 🌄
      </Typography>
      <select 
        value={dataType} 
        onChange={handleDataTypeChange} 
        style={{
          marginBottom: '16px', 
          padding: '10px 15px', 
          backgroundColor: '#08143c', // Fondo azul oscuro
          color: 'white', // Texto blanco
          border: '1px solid #08143c', // Borde azul oscuro
          borderRadius: '5px', // Bordes redondeados
          fontSize: '1rem',
          outline: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        }}
      >
        <option value="temperature">Temperature</option>
        <option value="humidity">Humidity</option>
        <option value="precipitation">Precipitation</option>
      </select>

      <Box sx={{ 
        width: '100%',
        height: isMobile ? 250 : 300,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      }}>
        <LineChart
          width={undefined}
          height={undefined}
          series={[{
            data: dataConfig.data,
            label: dataConfig.label,
            color: dataConfig.color,
            curve: 'linear',
          }]}
          xAxis={[{
            data: hours,
            label: 'Hour of Day',
            scaleType: 'linear',
          }]}
          margin={{ 
            left: 50,
            right: 20,
            top: 20,
            bottom: 40,
          }}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100% !important',
            height: '100% !important',
            '.MuiChartsAxis-bottom .MuiChartsAxis-tickLabel': {
              fontSize: isMobile ? '0.75rem' : '0.875rem',
              transform: 'translateY(-5px)',
              color: 'white',
            },
          }}
        />
      </Box>
    </Paper>
  );
}
