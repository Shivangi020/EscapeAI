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

import WeatherDisplay from "@/components/weather-display";
import HotelCard from "@/components/hotel-card";
import ImageGallery from "@/components/image-gallery";
import BudgetPlanner from "@/components/budget-planner";
import { TimelineItinerary } from "@/components/timeline-itinerary";
import { TravelItinerary } from "@/types";
import { itineraryFakeData } from "@/fakeData";

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
  const [destination, setDestination] = useState("");
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
    const fetchData = async () => {
      const place = searchParams?.get("place");
      const fromDateParam = searchParams?.get("from");
      const toDateParam = searchParams?.get("to");

      if (!place) return;
      if (!fromDateParam) return;
      if (!toDateParam) return;

      setDestination(place);
      setFromDate(new Date(fromDateParam));
      setToDate(new Date(toDateParam));

      setLoading(true);
      try {
        let days = 3;
        if (toDateParam && fromDateParam) {
          days = differenceInDays(toDateParam, fromDateParam) + 1;
        }
        // const itineraryData = await generateItineraryUsingGemini(place, days);
        // if (itineraryData) {
        setItinerary(itineraryFakeData);
        // }
        // console.log(destination);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

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
            {itinerary?.destination || destination}
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
                    <div className="text-xs text-gray-500">Total places:</div>
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

              {itinerary && <TimelineItinerary itinerary={itinerary} />}
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
