"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import PlaceSearch from "@/components/place-search";
import Navbar from "@/components/ui/navbar";

export default function Home() {
  const router = useRouter();
  const [destination, setDestination] = useState("Gazipur National Park");
  const [placeId, setPlaceId] = useState("");
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = () => {
    if (!destination || !placeId) return;

    setIsLoading(true);

    // In a real app, we would encode these parameters properly
    router.push(
      `/itinerary?place=${encodeURIComponent(
        destination
      )}&placeId=${placeId}&from=${fromDate?.toISOString() || ""}&to=${
        toDate?.toISOString() || ""
      }`
    );
  };

  return (
    <main className="flex min-h-screen flex-col items-center relative overflow-hidden rounded-3xl bg-white shadow-lg mx-auto my-4 max-w-6xl">
      <div
        className="w-full h-screen bg-cover bg-center relative"
        style={{
          backgroundImage: "url('/background2.jpg')",
        }}
      >
        <Navbar />

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 max-w-4xl">
            Explore famous global places
          </h1>
          <p className="text-xl text-white mb-12 max-w-2xl">
            Discover the world's most captivating destinations, from historic
            landmarks to hidden gems.
          </p>

          {/* Search Form */}
          <div className="bg-white rounded-full p-2 flex flex-col md:flex-row items-center w-full max-w-3xl shadow-lg">
            <div className="flex items-center flex-1 px-4 py-2">
              <MapPin className="h-5 w-5 text-gray-400 mr-2" />
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Location</span>
                <PlaceSearch
                  initialValue={destination}
                  onPlaceSelect={(place) => {
                    setDestination(place.description);
                    setPlaceId(place.place_id);
                  }}
                />
              </div>
            </div>

            <div className="w-px h-10 bg-gray-200 hidden md:block" />

            <div className="flex items-center flex-1 px-4 py-2">
              <Calendar className="h-5 w-5 text-gray-400 mr-2" />
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Date</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="text-left font-normal text-gray-700">
                      {fromDate && toDate
                        ? `${format(fromDate, "d MMM")} - ${format(
                            toDate,
                            "d MMM"
                          )}`
                        : "Choose Date"}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="range"
                      selected={{
                        from: fromDate || undefined,
                        to: toDate || undefined,
                      }}
                      onSelect={(range) => {
                        setFromDate(range?.from);
                        setToDate(range?.to);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <Button
              onClick={handleSearch}
              className="rounded-full px-8 py-6 bg-lime-400 hover:bg-lime-500 text-black font-medium"
            >
              Explore Now
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
