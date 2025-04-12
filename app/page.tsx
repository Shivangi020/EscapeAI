"use client";

import { useEffect, useState } from "react";
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
import Hero from "@/components/ui/hero";

export default function Home() {
  const router = useRouter();
  const [destination, setDestination] = useState("Paris");

  const [toDate, setToDate] = useState<Date>(() => {
    const date = new Date();
    date.setDate(date.getDate() + 2);
    return date;
  });
  const [fromDate, setFromDate] = useState<Date>(new Date());

  const handleGenerateItinerary = async () => {
    router.push(
      `/itinerary?place=${encodeURIComponent(destination)}&from=${
        fromDate?.toISOString() || ""
      }&to=${toDate?.toISOString() || ""}`
    );
  };

  return (
    <main className="flex h-[95vh] flex-col items-center relative overflow-hidden rounded-3xl bg-white shadow-lg mx-auto my-4 max-w-6xl">
      <div
        className="w-full h-screen bg-cover bg-center relative"
        style={{
          backgroundImage: "url('/background2.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30" />
        <Navbar />

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <Hero />

          {/* Search Form */}
          <div className="bg-white rounded-full p-2 flex flex-col md:flex-row items-center w-full max-w-3xl shadow-lg">
            <div className="flex items-center flex-1 px-4 py-2">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Location</span>
                <div className="flex">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                  <PlaceSearch initialValue={destination} />
                </div>
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
                        // setFromDate(range?.from);
                        // setToDate(range?.to);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <Button
              onClick={handleGenerateItinerary}
              className="rounded-full px-8 py-6 bg-lime-400 hover:bg-lime-500 text-black font-medium"
            >
              Generate Now
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
