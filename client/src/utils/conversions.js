/**
 * Convert Celsius to Fahrenheit
 */
export const celsiusToFahrenheit = (celsius) => {
  return (celsius * 9/5) + 32;
};

/**
 * Convert Fahrenheit to Celsius
 */
export const fahrenheitToCelsius = (fahrenheit) => {
  return (fahrenheit - 32) * 5/9;
};

/**
 * Format temperature based on unit
 */
export const formatTemperature = (temp, unit = 'celsius') => {
  const temperature = unit === 'fahrenheit' ? celsiusToFahrenheit(temp) : temp;
  return Math.round(temperature);
};

/**
 * Get temperature symbol
 */
export const getTemperatureSymbol = (unit = 'celsius') => {
  return unit === 'fahrenheit' ? '°F' : '°C';
};

/**
 * Convert meters per second to kilometers per hour
 */
export const msToKmh = (ms) => {
  return (ms * 3.6).toFixed(1);
};

/**
 * Convert meters per second to miles per hour
 */
export const msToMph = (ms) => {
  return (ms * 2.237).toFixed(1);
};

/**
 * Format wind speed
 */
export const formatWindSpeed = (speed, unit = 'celsius') => {
  if (unit === 'fahrenheit') {
    return `${msToMph(speed)} mph`;
  }
  return `${msToKmh(speed)} km/h`;
};

/**
 * Get wind direction
 */
export const getWindDirection = (degrees) => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
};
