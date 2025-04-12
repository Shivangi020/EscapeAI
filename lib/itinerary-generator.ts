import { addDays } from "date-fns"

interface ItineraryDay {
  day: number
  date: Date
  title: string
  location: string
  time?: string
  description: string
  image: string
}

// Mock function to simulate Gemini API for generating itineraries
export async function generateItinerary(
  destination: string,
  placeId: string,
  fromDate: Date,
  toDate: Date,
): Promise<ItineraryDay[]> {
  // In a real app, this would call the Gemini API
  return new Promise((resolve) => {
    setTimeout(() => {
      const days = []
      const totalDays = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

      // Generate mock itinerary based on destination
      const activities: Record<string, { title: string; location: string; time?: string; description: string }[]> = {
        "Paris, France": [
          {
            title: "Eiffel Tower Visit",
            location: "Paris / France",
            time: "9 AM",
            description: "Start your day with a visit to the iconic Eiffel Tower. Arrive early to avoid crowds.",
          },
          {
            title: "Notre-Dame Cathedral",
            location: "Paris / France",
            time: "2 PM",
            description: "Explore the charming streets of Le Marais district and stop for lunch.",
          },
          {
            title: "Palace of Versailles",
            location: "Versailles / France",
            time: "10 AM",
            description: "Take a day trip to the Palace of Versailles to see the magnificent château and gardens.",
          },
        ],
        "New York, NY, USA": [
          {
            title: "Statue of Liberty",
            location: "New York / USA",
            time: "10 AM",
            description: "Start with a morning visit to the Statue of Liberty and Ellis Island.",
          },
          {
            title: "Metropolitan Museum",
            location: "New York / USA",
            time: "1 PM",
            description: "Spend the morning at the Metropolitan Museum of Art and explore its vast collections.",
          },
          {
            title: "Brooklyn Bridge",
            location: "New York / USA",
            time: "9 AM",
            description: "Explore Brooklyn Bridge and DUMBO neighborhood in the morning.",
          },
        ],
        "Bali, Indonesia": [
          {
            title: "Tirta Empul Temple",
            location: "Ubud / Bali",
            time: "8 AM",
            description: "Start your day with a visit to the sacred Tirta Empul Temple.",
          },
          {
            title: "Beach Day",
            location: "Kuta / Bali",
            time: "10 AM",
            description: "Spend the day at one of Bali's beautiful beaches like Kuta or Seminyak.",
          },
          {
            title: "Uluwatu Temple",
            location: "Uluwatu / Bali",
            time: "4 PM",
            description: "Take a day trip to the Uluwatu Temple perched on a cliff.",
          },
        ],
        "Gazipur National Park": [
          {
            title: "Safari Adventure",
            location: "Gazipur / Bangladesh",
            time: "7 AM",
            description: "Early morning safari to spot wildlife in their natural habitat.",
          },
          {
            title: "Nature Hike",
            location: "Gazipur / Bangladesh",
            time: "10 AM",
            description: "Guided nature hike through the lush forests and scenic trails.",
          },
          {
            title: "Sunset Viewing",
            location: "Gazipur / Bangladesh",
            time: "5 PM",
            description: "Enjoy breathtaking sunset views from the park's observation deck.",
          },
        ],
      }

      // Default activities if destination not found
      const defaultActivities = [
        {
          title: "City Exploration",
          location: "City Center",
          time: "9 AM",
          description: "Visit the main tourist attractions in the morning.",
        },
        {
          title: "Guided Tour",
          location: "Various Locations",
          time: "10 AM",
          description: "Take a guided city tour to see the highlights.",
        },
        {
          title: "Historical Sites",
          location: "Old Town",
          time: "11 AM",
          description: "Visit historical landmarks and monuments.",
        },
      ]

      // Get activities for the destination or use default
      const destinationActivities = activities[destination] || defaultActivities

      // Create itinerary days
      for (let i = 0; i < totalDays; i++) {
        const activity = destinationActivities[i % destinationActivities.length]
        days.push({
          day: i + 1,
          date: addDays(new Date(fromDate), i),
          title: activity.title,
          location: activity.location,
          time: activity.time,
          description: activity.description,
          image: "/placeholder.svg?height=80&width=80",
        })
      }

      resolve(days)
    }, 1000)
  })
}
