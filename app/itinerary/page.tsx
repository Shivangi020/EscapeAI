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
  Train,
  Plane,
  Bus,
  Car,
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
import { generateItineraryUsingGemini } from "@/lib/itinerary-generator";

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
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
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
      const from = searchParams?.get("from");
      const to = searchParams?.get("to");
      const fromDateParam = searchParams?.get("fromDate");
      const toDateParam = searchParams?.get("toDate");

      if (!from || !to) return;
      if (!fromDateParam) return;
      if (!toDateParam) return;

      setFromLocation(from);
      setToLocation(to);
      setFromDate(new Date(fromDateParam));
      setToDate(new Date(toDateParam));

      setLoading(true);
      try {
        let days = 3;
        if (toDateParam && fromDateParam) {
          days =
            differenceInDays(new Date(toDateParam), new Date(fromDateParam)) +
            1;
        }
        const itineraryData = await generateItineraryUsingGemini(
          from,
          to,
          days
        );
        if (itineraryData) {
          setItinerary(itineraryData);
        }
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
            Planning your perfect trip from {fromLocation} to {toLocation}...
          </h2>
          <p className="mt-2 text-gray-600">This may take a moment</p>
        </div>
      </div>
    );
  }

  const getTransportIcon = (mode: string) => {
    switch (mode.toLowerCase()) {
      case "flight":
        return <Plane className="h-5 w-5" />;
      case "train":
        return <Train className="h-5 w-5" />;
      case "bus":
        return <Bus className="h-5 w-5" />;
      case "car":
        return <Car className="h-5 w-5" />;
      default:
        return <Plane className="h-5 w-5" />;
    }
  };

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
            {fromLocation} → {toLocation}
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
          <TabsList className="grid w-full grid-cols-2 bg-gray-50 shadow-sm rounded-lg p-1">
            <TabsTrigger
              value="itinerary"
              className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm hover:bg-gray-100 transition-all duration-200 rounded-md px-4 py-2 flex items-center gap-2 text-gray-600"
            >
              <Calendar className="h-4 w-4" />
              Itinerary
            </TabsTrigger>
            <TabsTrigger
              value="travel-info"
              className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm hover:bg-gray-100 transition-all duration-200 rounded-md px-4 py-2 flex items-center gap-2 text-gray-600"
            >
              <Plane className="h-4 w-4" />
              Travel Info
            </TabsTrigger>
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

              {itinerary && <TimelineItinerary itineraryData={itinerary} />}
            </Card>
          </TabsContent>
          <TabsContent value="travel-info" className="mt-6">
            <Card className="bg-white p-6 rounded-xl">
              {itinerary?.travelInfo && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4">Travel Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <MapPin className="h-5 w-5 text-blue-500" />
                        <span className="font-medium">Distance</span>
                      </div>
                      <p className="text-gray-600">
                        {itinerary.travelInfo.distance}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="h-5 w-5 text-blue-500" />
                        <span className="font-medium">Travel Time</span>
                      </div>
                      <p className="text-gray-600">
                        {itinerary.travelInfo.travelTime}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">
                      Transportation Options
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {itinerary.travelInfo.transportationOptions.map(
                        (option, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 p-4 rounded-lg"
                          >
                            <div className="flex items-center space-x-2 mb-2">
                              {getTransportIcon(option.mode)}
                              <span className="font-medium">{option.mode}</span>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Duration:</span>{" "}
                                {option.duration}
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Cost:</span>{" "}
                                {option.cost}
                              </p>
                              <p className="text-sm text-gray-600">
                                {option.description}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
