import { useEffect, useState } from "react";

// Falls back to a neutral location if the browser denies geolocation —
// Open-Meteo needs no API key and is CORS-friendly for client-side calls.
const FALLBACK_COORDS = { lat: 13.0827, lon: 80.2707 }; // Chennai
const REFRESH_MS = 15 * 60 * 1000;

const WEATHER_ICON = (code) => {
  if (code === 0) return "☀️";
  if ([1, 2].includes(code)) return "🌤️";
  if (code === 3) return "☁️";
  if ([45, 48].includes(code)) return "🌫️";
  if ([51, 53, 55, 56, 57].includes(code)) return "🌦️";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "🌧️";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "🌨️";
  if ([95, 96, 99].includes(code)) return "⛈️";
  return "🌡️";
};

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchWeather = async (lat, lon) => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&temperature_unit=celsius`
        );
        const data = await res.json();
        if (cancelled) return;
        if (data?.current) {
          setWeather({
            temp: Math.round(data.current.temperature_2m),
            code: data.current.weather_code,
          });
        } else {
          setFailed(true);
        }
      } catch {
        if (!cancelled) setFailed(true);
      }
    };

    const start = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
          () => fetchWeather(FALLBACK_COORDS.lat, FALLBACK_COORDS.lon),
          { timeout: 4000 }
        );
      } else {
        fetchWeather(FALLBACK_COORDS.lat, FALLBACK_COORDS.lon);
      }
    };

    start();
    const t = setInterval(start, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, []);

  if (failed) return null;

  return (
    <div
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#E8F3FC] border border-[#CFE3F2] text-[#24384A] text-xs"
      title="Local weather"
    >
      {weather ? (
        <>
          <span className="text-sm leading-none">{WEATHER_ICON(weather.code)}</span>
          <span className="font-mono">{weather.temp}°C</span>
        </>
      ) : (
        <span className="text-[10px] text-[#7E97AC] font-mono animate-pulse">weather…</span>
      )}
    </div>
  );
}
