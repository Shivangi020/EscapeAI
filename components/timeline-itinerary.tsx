import { itineraryFakeData } from "@/fakeData";
import { getImageFromGoogle } from "@/lib/image-api";
import { TravelItinerary } from "@/types";
import {
  MapPin,
  Clock,
  Utensils,
  Landmark,
  Mountain,
  Palette,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const activityIcons = {
  food: <Utensils className="w-4 h-4 text-amber-500" />,
  "scenic viewpoint": <Mountain className="w-4 h-4 text-emerald-500" />,
  museum: <Landmark className="w-4 h-4 text-indigo-500" />,
  park: <Mountain className="w-4 h-4 text-green-500" />,
  "historical site": <Landmark className="w-4 h-4 text-rose-500" />,
  "urban exploration": <Mountain className="w-4 h-4 text-blue-500" />,
  "art gallery": <Palette className="w-4 h-4 text-purple-500" />,
  "religious site": <Landmark className="w-4 h-4 text-amber-600" />,
  shopping: <Utensils className="w-4 h-4 text-pink-500" />,
};

export function TimelineItinerary({
  itinerary,
}: {
  itinerary: TravelItinerary;
}) {
  const [expandedDays, setExpandedDays] = useState<number[]>([]);
  const [attractionImages, setAttractionImages] = useState({});

  const callfetchPlaceImage = async (
    dataOfDay: {
      name: string;
      description: string;
      address: string;
    }[]
  ) => {
    const temp = { ...attractionImages };

    for (const days of dataOfDay || []) {
      const { name } = days;

      // const url = await getImageFromGoogle(name);
      // temp[name] = url;
    }
    setAttractionImages(temp);
  };

  console.log(attractionImages);

  const toggleDay = async (day: number) => {
    setExpandedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
    const { itinerary } = itineraryFakeData;
    const { attractions } = itinerary[day - 1];

    await callfetchPlaceImage(attractions);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          {itineraryFakeData.destination}
        </h1>
        <p className="text-lg text-gray-600">
          {itineraryFakeData.type} • {itineraryFakeData.days} Days
        </p>
      </div>

      <div className="space-y-8">
        {itineraryFakeData.itinerary.map((day) => (
          <div key={day.day} className="relative group">
            <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-blue-400 to-indigo-400 rounded-full"></div>

            <div className="ml-8">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => toggleDay(day.day)}
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Day {day.day}
                    </h2>
                    <div
                      className={`transform transition-transform duration-300 ${
                        expandedDays.includes(day.day) ? "rotate-180" : ""
                      }`}
                    >
                      <ChevronDown className="w-6 h-6 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    expandedDays.includes(day.day)
                      ? "max-h-[2000px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 pb-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Attractions Section */}
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 flex items-center">
                          <MapPin className="w-5 h-5 text-blue-500 mr-2" />
                          Attractions
                        </h3>
                        <div className="space-y-6">
                          {day.attractions.map((attraction, index) => (
                            <div
                              key={index}
                              className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300"
                            >
                              <div className="relative h-48 w-full group">
                                <Image
                                  src={
                                    attractionImages[
                                      attraction.name as keyof typeof attractionImages
                                    ] || "/placeholder.jpg"
                                  }
                                  alt={attraction.name}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                  <h4 className="text-xl font-bold text-white">
                                    {attraction.name}
                                  </h4>
                                </div>
                              </div>
                              <div className="p-4">
                                <p className="text-sm text-gray-600">
                                  {attraction.description}
                                </p>
                                <p className="text-xs text-gray-500 mt-2">
                                  {attraction.address}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Schedule Section */}
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 flex items-center">
                          <Clock className="w-5 h-5 text-blue-500 mr-2" />
                          Daily Schedule
                        </h3>
                        <div className="space-y-4">
                          {day.schedule.map((activity, index) => (
                            <div
                              key={index}
                              className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow duration-300"
                            >
                              <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                  <div className="flex items-center space-x-2">
                                    <Clock className="w-4 h-4 text-blue-500" />
                                    <span className="text-sm font-medium text-blue-600">
                                      {activity.time}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2">
                                    {
                                      activityIcons[
                                        activity.typeOfActivity as keyof typeof activityIcons
                                      ]
                                    }
                                    <p className="font-medium text-gray-800">
                                      {activity.activity}
                                    </p>
                                  </div>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {activity.attractionName}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
