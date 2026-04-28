export async function getWeather() {
  const apiKey = process.env.WEATHER_API_KEY;
  const city = process.env.WEATHER_CITY || 'Miami';
  const country = process.env.WEATHER_COUNTRY || 'US';

  if (!apiKey) {
    return {
      source: 'mock',
      location: `${city},${country}`,
      temperature: 22,
      description: 'clear sky',
      condition: 'clear'
    };
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(`${city},${country}`)}&appid=${apiKey}&units=metric`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('No se pudo obtener clima');
  }

  const data = await response.json();

  return {
    source: 'openweathermap',
    location: data.name,
    temperature: data.main?.temp,
    description: data.weather?.[0]?.description,
    condition: data.weather?.[0]?.main?.toLowerCase()
  };
}
