import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent, Typography } from '@mui/material';

const PrecipitationChart = ({ forecast }) => {
  if (!forecast || !forecast.list || forecast.list.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            No precipitation data available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const data = forecast.list.slice(0, 24).map(item => ({
    time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
    rain: item.rain ? (item.rain['3h'] || 0) : 0,
    snow: item.snow ? (item.snow['3h'] || 0) : 0,
    humidity: item.main?.humidity || 0
  }));

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Precipitation & Humidity (24 Hours)
        </Typography>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis yAxisId="left" label={{ value: 'mm', angle: -90, position: 'insideLeft' }} />
            <YAxis yAxisId="right" orientation="right" label={{ value: '%', angle: -90, position: 'insideRight' }} />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="rain" fill="#1976d2" name="Rain (mm)" />
            <Bar yAxisId="left" dataKey="snow" fill="#90caf9" name="Snow (mm)" />
            <Bar yAxisId="right" dataKey="humidity" fill="#ff9800" name="Humidity (%)" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PrecipitationChart;
