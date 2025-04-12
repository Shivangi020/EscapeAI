import { Card, CardContent } from "@/components/ui/card"
import { format } from "date-fns"

interface WeatherData {
  date: Date
  condition: string
  temperature: number
  icon: string
}

interface WeatherDisplayProps {
  weather: WeatherData
}

export default function WeatherDisplay({ weather }: WeatherDisplayProps) {
  // Map weather conditions to icons
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "sunny":
        return "☀️"
      case "partly cloudy":
        return "⛅"
      case "cloudy":
        return "☁️"
      case "rainy":
        return "🌧️"
      case "stormy":
        return "⛈️"
      default:
        return "🌤️"
    }
  }

  return (
    <Card className="text-center transition-all duration-300 hover:shadow-md">
      <CardContent className="pt-6">
        <p className="font-medium">{format(weather.date, "EEE, MMM d")}</p>
        <div className="text-4xl my-2">{getWeatherIcon(weather.condition)}</div>
        <p className="text-2xl font-bold">{weather.temperature}°C</p>
        <p className="text-gray-600 mt-1">{weather.condition}</p>
      </CardContent>
    </Card>
  )
}
