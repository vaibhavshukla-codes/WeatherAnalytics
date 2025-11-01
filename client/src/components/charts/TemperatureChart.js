import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent, Typography } from '@mui/material';
import { formatTemperature } from '../../utils/conversions';

const TemperatureChart = ({ forecast, temperatureUnit }) => {
  if (!forecast || !forecast.list || forecast.list.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            No temperature data available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const data = forecast.list.slice(0, 24).map(item => ({
    time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
    temp: formatTemperature(item.main?.temp || 0, temperatureUnit),
    feelsLike: formatTemperature(item.main?.feels_like || 0, temperatureUnit),
    min: formatTemperature(item.main?.temp_min || 0, temperatureUnit),
    max: formatTemperature(item.main?.temp_max || 0, temperatureUnit)
  }));

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Temperature Trend (24 Hours)
        </Typography>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis label={{ value: 'Temperature', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="temp" stroke="#1976d2" strokeWidth={2} name="Temperature" />
            <Line type="monotone" dataKey="feelsLike" stroke="#dc004e" strokeWidth={2} name="Feels Like" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TemperatureChart;
