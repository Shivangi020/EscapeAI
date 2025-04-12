"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Globe,
  Flag,
  Clock,
  DollarSign,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, differenceInDays } from "date-fns";
import Link from "next/link";
import { generateItineraryUsingGemini } from "@/lib/itinerary-generator";
import { fetchWeather } from "@/lib/weather-api";
import { fetchImages } from "@/lib/image-api";
import { getBudgetEstimates } from "@/lib/budget-api";
import WeatherDisplay from "@/components/weather-display";
import HotelCard from "@/components/hotel-card";
import ImageGallery from "@/components/image-gallery";
import BudgetPlanner from "@/components/budget-planner";
import Image from "next/image";

interface ItineraryItem {
  time: string;
  activity: string;
  typeOfActivity: string;
  attractionName: string;
}

interface Attraction {
  name: string;
  description: string;
  address: string;
}

interface DayPlan {
  day: number;
  attractions: Attraction[];
  schedule: ItineraryItem[];
}

interface TravelItinerary {
  destination: string;
  type: string;
  days: number;
  totalPlaces: number;
  itinerary: DayPlan[];
}

interface HotelData {
  id: string;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  price: string;
  duration: string;
  image: string;
}

interface WeatherData {
  date: Date;
  condition: string;
  temperature: number;
  icon: string;
}

interface ImageData {
  id: string;
  url: string;
  alt: string;
}

interface BudgetData {
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

export default function ItineraryPage() {
  const searchParams = useSearchParams();
  const [destination, setDestination] = useState("chakrata");
  const [fromDate, setFromDate] = useState<Date | null>(new Date());
  const [toDate, setToDate] = useState<Date | null>(new Date());
  const [itinerary, setItinerary] = useState<TravelItinerary>();

  const [hotels, setHotels] = useState<HotelData[]>([]);
  const [weather, setWeather] = useState<WeatherData[]>([]);
  const [images, setImages] = useState<ImageData[]>([]);
  const [budget, setBudget] = useState<BudgetData | null>(null);
  const [userBudget, setUserBudget] = useState<number>(2000);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const place = searchParams?.get("place");
    const fromDateParam = searchParams?.get("from");
    const toDateParam = searchParams?.get("to");

    if (place && fromDateParam && toDateParam) {
      setDestination(place);
      setFromDate(new Date(fromDateParam));
      setToDate(new Date(toDateParam));
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let days = 3;
        if (toDate && fromDate) {
          days = differenceInDays(toDate, fromDate) + 1;
        }
        // const itineraryData = await generateItineraryUsingGemini(
        //   destination,
        //   days
        // );
        // if (itineraryData) {
        //   setItinerary(itineraryData);
        // }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [destination, fromDate, toDate]);

  // Mock function to fetch hotels
  const fetchHotels = async (
    destination: string,
    placeId: string
  ): Promise<HotelData[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: "hotel1",
            name: "Royal Caribbean International",
            location: "Galveston / USA",
            startDate: "09 Feb 22",
            endDate: "14 Feb 22",
            price: "356€",
            duration: "5 days",
            image:
              "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%20from%202025-04-09%2000-23-07-GMn0lHmr8ZdZETuaCBv371wMJcJMjt.png",
          },
          {
            id: "hotel2",
            name: "Norwegian Cruise Line",
            location: "Miami / USA",
            startDate: "15 Feb 22",
            endDate: "22 Feb 22",
            price: "420€",
            duration: "7 days",
            image: "/placeholder.svg?height=200&width=200",
          },
          {
            id: "hotel3",
            name: "Carnival Cruise",
            location: "New Orleans / USA",
            startDate: "01 Mar 22",
            endDate: "08 Mar 22",
            price: "380€",
            duration: "7 days",
            image: "/placeholder.svg?height=200&width=200",
          },
        ]);
      }, 500);
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-sky-600 border-r-transparent"></div>
          <h2 className="mt-4 text-xl font-semibold">
            Planning your perfect trip to {destination}...
          </h2>
          <p className="mt-2 text-gray-600">This may take a moment</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <div
        className="text-white py-8"
        style={{
          backgroundImage: "url('/background.jpg')",
          backgroundPosition: "right",
        }}
      >
        <div className="container mx-auto px-4">
          <Link
            href="/"
            className="inline-flex items-center text-white hover:underline mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to search
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold flex items-center">
            <MapPin className="mr-2 h-6 w-6" />
            {destination}
          </h1>
          {fromDate && toDate && (
            <p className="text-lg mt-2 flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              {format(fromDate, "MMMM d, yyyy")} -{" "}
              {format(toDate, "MMMM d, yyyy")}
            </p>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-6">
        <Tabs defaultValue="itinerary" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-lg rounded-lg">
            <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
            <TabsTrigger value="hotels">Hotels</TabsTrigger>
            <TabsTrigger value="weather">Weather</TabsTrigger>
          </TabsList>

          <TabsContent value="itinerary" className="mt-6">
            <Card className="bg-white p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="grid grid-cols-3 gap-6 w-full">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <Globe className="h-6 w-6 mx-auto mb-1 text-gray-700" />
                    <div className="text-xs text-gray-500">Category:</div>
                    <div className="font-medium">{itinerary?.type}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <Flag className="h-6 w-6 mx-auto mb-1 text-gray-700" />
                    <div className="text-xs text-gray-500">Places:</div>
                    <div className="font-medium">{itinerary?.totalPlaces}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <Calendar className="h-6 w-6 mx-auto mb-1 text-gray-700" />
                    <div className="text-xs text-gray-500">Total days:</div>
                    <div className="font-medium">{itinerary?.days} days</div>
                  </div>
                </div>
              </div>

              {/* <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Cruise program</h2>
                <button className="text-blue-600 text-sm font-medium">
                  View All
                </button>
              </div> */}

              <div className="relative pl-8">
                {/* Timeline line */}
                <div className="absolute left-3 top-2 bottom-0 w-0.5 bg-gray-200"></div>

                {/* Departure */}
                <div className="mb-8 relative">
                  <div className="absolute left-[-30px] top-0 w-6 h-6 rounded-full bg-green-500 border-4 border-white"></div>
                  <div className="text-xs uppercase text-green-600 font-semibold mb-1">
                    DEPARTURE
                  </div>
                  <div className="font-bold text-lg mb-1">Galveston / USA</div>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>09 Feb 2022</span>
                    <Clock className="h-4 w-4 ml-4 mr-1" />
                    <span>4 PM</span>
                  </div>
                  <div className="mt-2">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%20from%202025-04-09%2000-22-35-8bofPsi1VsQgCfIMalMW2n8jJluS63.png"
                      alt="Galveston"
                      width={80}
                      height={60}
                      className="rounded-md object-cover"
                    />
                  </div>
                </div>

                {/* On the road */}
                <div className="mb-8 relative">
                  <div className="absolute left-[-30px] top-0 w-6 h-6 rounded-full bg-blue-500 border-4 border-white"></div>
                  <div className="text-xs uppercase text-blue-600 font-semibold mb-1">
                    ON THE ROAD
                  </div>
                  <div className="font-bold text-lg mb-1">A day at sea</div>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>10 Feb 2022</span>
                  </div>
                  <div className="mt-2">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%20from%202025-04-09%2000-22-35-8bofPsi1VsQgCfIMalMW2n8jJluS63.png"
                      alt="At sea"
                      width={80}
                      height={60}
                      className="rounded-md object-cover"
                    />
                  </div>
                </div>

                {/* Arrival */}
                <div className="relative">
                  <div className="absolute left-[-30px] top-0 w-6 h-6 rounded-full bg-red-500 border-4 border-white"></div>
                  <div className="text-xs uppercase text-red-600 font-semibold mb-1">
                    ARRIVAL
                  </div>
                  <div className="font-bold text-lg mb-1">
                    Costa Maya / Mexico
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>11 Feb 2022</span>
                    <Clock className="h-4 w-4 ml-4 mr-1" />
                    <span>12 AM</span>
                  </div>
                  <div className="mt-2">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%20from%202025-04-09%2000-22-35-8bofPsi1VsQgCfIMalMW2n8jJluS63.png"
                      alt="Costa Maya"
                      width={80}
                      height={60}
                      className="rounded-md object-cover"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="hotels" className="mt-6">
            <h2 className="text-2xl font-bold mb-4">Recommended Hotels</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="weather" className="mt-6">
            <h2 className="text-2xl font-bold mb-4">Weather Forecast</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {weather.map((day) => (
                    <WeatherDisplay
                      key={day.date.toISOString()}
                      weather={day}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gallery" className="mt-6">
            <h2 className="text-2xl font-bold mb-4">Gallery</h2>
            <ImageGallery images={images} />
          </TabsContent>

          <TabsContent value="budget" className="mt-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <DollarSign className="mr-2 h-6 w-6" />
              Budget Planner
            </h2>
            {budget && (
              <BudgetPlanner
                budget={budget}
                userBudget={userBudget}
                onBudgetChange={setUserBudget}
                destination={destination}
                duration={differenceInDays(toDate || "", fromDate || "") + 1}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
