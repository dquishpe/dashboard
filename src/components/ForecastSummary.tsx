import { Box, Button, Typography } from '@mui/material';

interface ForecastData {
  dt: number;
  dt_txt: string;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
}

interface ForecastSummaryProps {
  forecastData: ForecastData[];
  selectedDay: string;
  onDaySelect: (date: string) => void;
}

function ForecastSummary(props: ForecastSummaryProps): JSX.Element {
  const { forecastData, selectedDay, onDaySelect } = props;
  
  const dailyForecasts = forecastData.reduce((acc, forecast) => {
    const forecastDate = new Date(forecast.dt * 1000);
    const dateStr = forecastDate.toISOString().split('T')[0];
    
    if (!acc[dateStr]) {
      acc[dateStr] = {
        temps: [],
        icon: forecast.weather[0].icon,
        description: forecast.weather[0].description,
        dt: forecast.dt
      };
    }
    acc[dateStr].temps.push(forecast.main.temp);
    return acc;
  }, {} as Record<string, { temps: number[], icon: string, description: string, dt: number }>);

  return (
    <Box sx={{ 
      display: 'flex', 
      gap: 2, 
      overflowX: 'auto', 
      p: 2,
      '&::-webkit-scrollbar': { display: 'none' },
      justifyContent: "flex-start",
      flexWrap: 'nowrap',
    }}>
      {Object.entries(dailyForecasts).map(([date, data]) => {
        const avgTemp = data.temps.reduce((sum, temp) => sum + temp, 0) / data.temps.length;
        const displayDate = new Date(date + 'T00:00:00');
        
        return (
          <Button
            key={date}
            variant={selectedDay === date ? "contained" : "outlined"}
            onClick={() => onDaySelect(date)}
            sx={{
              flexGrow: 1,
              minWidth: '150px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 0.5,
              p: 2,
              whiteSpace: 'nowrap',
              backgroundColor: selectedDay === date ? '#48c3fc' : 'transparent',
              color: selectedDay === date ? 'white' : '#48c3fc',
              borderColor: '#48c3fc',
              borderRadius: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: selectedDay !== date ? '#08143c' : '#48c3fc',
                borderColor: '#08143c',
                color: 'white',
              }
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
              {displayDate.toLocaleDateString('en-US', { 
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                timeZone: 'UTC'
              })}
            </Typography>
            <img 
              src={`http://openweathermap.org/img/w/${data.icon}.png`}
              alt={data.description}
              style={{ width: 40, height: 40}}
            />
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {Math.round(avgTemp)}°C
            </Typography>
            <Typography variant="caption" sx={{ color: 'white' }}>
              {data.description}
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              gap: 0.5,
              mt: 1,
              fontSize: '0.75rem'
            }}>
              <Typography variant="caption">
                Mín: {Math.round(forecastData.find(f => f.dt === data.dt)?.main.temp_min || 0)}°C / Máx: {Math.round(forecastData.find(f => f.dt === data.dt)?.main.temp_max || 0)}°C
              </Typography>
            </Box>
          </Button>
        );
      })}
    </Box>
  );
}

export default ForecastSummary;
