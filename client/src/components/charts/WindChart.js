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

const WindChart = ({ forecast }) => {
  if (!forecast || !forecast.list || forecast.list.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            No wind data available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const data = forecast.list.slice(0, 24).map(item => ({
    time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
    speed: item.wind?.speed || 0,
    gust: item.wind?.gust || 0,
    direction: item.wind?.deg || 0
  }));

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Wind Speed & Direction (24 Hours)
        </Typography>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis label={{ value: 'm/s', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="speed" stroke="#1976d2" strokeWidth={2} name="Wind Speed (m/s)" />
            <Line type="monotone" dataKey="gust" stroke="#dc004e" strokeWidth={2} name="Wind Gust (m/s)" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default WindChart;
