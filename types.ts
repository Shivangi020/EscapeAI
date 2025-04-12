export interface ItineraryItem {
  time: string;
  activity: string;
  typeOfActivity: string;
  attractionName: string;
}

export interface Attraction {
  name: string;
  description: string;
  address: string;
}

export interface DayPlan {
  day: number;
  attractions: Attraction[];
  schedule: ItineraryItem[];
}

export interface TravelItinerary {
  destination: string;
  type: string;
  days: number;
  totalPlaces: number;
  itinerary: DayPlan[];
}

export interface HotelData {
  id: string;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  price: string;
  duration: string;
  image: string;
}

export interface WeatherData {
  date: Date;
  condition: string;
  temperature: number;
  icon: string;
}

export interface ImageData {
  id: string;
  url: string;
  alt: string;
}

export interface BudgetData {
  totalEstimate: number;
  categories: {
    accommodation: number;
    food: number;
    transportation: number;
    activities: number;
    other: number;
  };
  dailyBreakdown: {
    day: number;
    date: Date;
    accommodation: number;
    food: number;
    transportation: number;
    activities: number;
    other: number;
    total: number;
  }[];
}
