import { addDays } from "date-fns"

interface WeatherData {
  date: Date
  condition: string
  temperature: number
  icon: string
}

// Mock function to simulate weather API
export async function fetchWeather(
  destination: string,
  placeId: string,
  fromDate: Date,
  toDate: Date,
): Promise<WeatherData[]> {
  // In a real app, this would call a weather API
  return new Promise((resolve) => {
    setTimeout(() => {
      const days = []
      const totalDays = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

      // Weather conditions based on destination
      const weatherByDestination: Record<string, { conditions: string[]; tempRange: [number, number] }> = {
        "Paris, France": {
          conditions: ["Partly Cloudy", "Cloudy", "Rainy", "Sunny"],
          tempRange: [15, 25],
        },
        "New York, NY, USA": {
          conditions: ["Sunny", "Partly Cloudy", "Cloudy", "Rainy"],
          tempRange: [18, 30],
        },
        "Bali, Indonesia": {
          conditions: ["Sunny", "Partly Cloudy", "Rainy", "Stormy"],
          tempRange: [25, 32],
        },
        "Sydney, NSW, Australia": {
          conditions: ["Sunny", "Partly Cloudy", "Cloudy", "Rainy"],
          tempRange: [20, 28],
        },
        "Rome, Italy": {
          conditions: ["Sunny", "Partly Cloudy", "Cloudy"],
          tempRange: [22, 32],
        },
        "Gazipur National Park": {
          conditions: ["Sunny", "Partly Cloudy", "Cloudy", "Rainy"],
          tempRange: [22, 35],
        },
      }

      // Default weather if destination not found
      const defaultWeather = {
        conditions: ["Sunny", "Partly Cloudy", "Cloudy", "Rainy"],
        tempRange: [20, 30],
      }

      // Get weather for the destination or use default
      const destinationWeather = weatherByDestination[destination] || defaultWeather

      // Generate random weather for each day
      for (let i = 0; i < totalDays; i++) {
        const randomConditionIndex = Math.floor(Math.random() * destinationWeather.conditions.length)
        const condition = destinationWeather.conditions[randomConditionIndex]

        const minTemp = destinationWeather.tempRange[0]
        const maxTemp = destinationWeather.tempRange[1]
        const temperature = Math.floor(Math.random() * (maxTemp - minTemp + 1)) + minTemp

        days.push({
          date: addDays(new Date(fromDate), i),
          condition,
          temperature,
          icon: condition.toLowerCase().replace(" ", "-"),
        })
      }

      resolve(days)
    }, 800)
  })
}
