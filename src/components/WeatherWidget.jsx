import { useState } from "react";

const CONDITIONS = [
  { icon: "☀️", label: "Clear", min: 20, max: 32 },
  { icon: "🌤️", label: "Partly cloudy", min: 17, max: 28 },
  { icon: "☁️", label: "Cloudy", min: 14, max: 24 },
  { icon: "🌦️", label: "Light showers", min: 13, max: 23 },
  { icon: "🌧️", label: "Rain", min: 12, max: 21 },
];

function createSampleWeather() {
  const condition = CONDITIONS[Math.floor(Math.random() * CONDITIONS.length)];
  return {
    ...condition,
    temp: Math.floor(Math.random() * (condition.max - condition.min + 1)) + condition.min,
  };
}

export default function WeatherWidget({ theme }) {
  const [weather] = useState(createSampleWeather);

  return (
    <div
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs transition-colors duration-[2800ms]"
      style={{ backgroundColor: theme.widget, borderColor: theme.border, color: theme.text }}
      title={`${weather.label} (sample weather)`}
    >
      <span className="text-sm leading-none">{weather.icon}</span>
      <span className="font-mono">{weather.temp}°C</span>
    </div>
  );
}
