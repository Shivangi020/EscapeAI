"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
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
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");

  const [toDate, setToDate] = useState<Date>(() => {
    const date = new Date();
    date.setDate(date.getDate() + 2);
    return date;
  });
  const [fromDate, setFromDate] = useState<Date>(new Date());

  const handleGenerateItinerary = async () => {
    router.push(
      `/itinerary?from=${encodeURIComponent(
        fromLocation
      )}&to=${encodeURIComponent(toLocation)}&fromDate=${
        fromDate?.toISOString() || ""
      }&toDate=${toDate?.toISOString() || ""}`
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
          <div className="bg-white rounded-2xl p-6 flex flex-col md:flex-row items-center w-full max-w-4xl shadow-lg space-y-4 md:space-y-0 md:space-x-4">
            {/* From Location */}
            <div className="flex-1 w-full">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 mb-1">
                  From
                </span>
                <div className="flex items-center bg-gray-50 rounded-lg px-4 py-2 border border-gray-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                  <PlaceSearch
                    initialValue={fromLocation}
                    handleChange={setFromLocation}
                    placeholder="Enter departure location"
                  />
                </div>
              </div>
            </div>

            {/* Arrow Icon */}
            <div className="hidden md:flex items-center justify-center">
              <div className="bg-gray-100 rounded-full p-2">
                <ArrowRight className="h-5 w-5 text-gray-600" />
              </div>
            </div>

            {/* To Location */}
            <div className="flex-1 w-full">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 mb-1">
                  To
                </span>
                <div className="flex items-center bg-gray-50 rounded-lg px-4 py-2 border border-gray-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                  <PlaceSearch
                    initialValue={toLocation}
                    handleChange={setToLocation}
                    placeholder="Enter destination"
                  />
                </div>
              </div>
            </div>

            <div className="w-full md:w-px h-px md:h-10 bg-gray-200" />

            {/* Date Picker */}
            <div className="flex-1 w-full">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 mb-1">
                  When
                </span>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex items-center bg-gray-50 rounded-lg px-4 py-2 border border-gray-200 hover:border-blue-500 hover:ring-1 hover:ring-blue-500 transition-all text-left">
                      <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-gray-700">
                        {fromDate && toDate
                          ? `${format(fromDate, "d MMM")} - ${format(
                              toDate,
                              "d MMM"
                            )}`
                          : "Choose Date"}
                      </span>
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
                        if (range?.from) setFromDate(range.from);
                        if (range?.to) setToDate(range.to);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <Button
              onClick={handleGenerateItinerary}
              className="w-full md:w-auto rounded-lg px-8 py-6 bg-lime-400 hover:bg-lime-500 text-black font-medium transition-colors"
            >
              Generate Now
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
