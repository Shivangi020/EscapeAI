import { itineraryFakeData } from "@/fakeData";
import { TravelItinerary } from "@/types";
import {
  MapPin,
  Clock,
  Utensils,
  Landmark,
  Mountain,
  Palette,
} from "lucide-react";
import Image from "next/image";

const activityIcons = {
  food: <Utensils className="w-4 h-4" />,
  "scenic viewpoint": <Mountain className="w-4 h-4" />,
  museum: <Landmark className="w-4 h-4" />,
  park: <Mountain className="w-4 h-4" />,
  "historical site": <Landmark className="w-4 h-4" />,
  "urban exploration": <Mountain className="w-4 h-4" />,
  "art gallery": <Palette className="w-4 h-4" />,
  "religious site": <Landmark className="w-4 h-4" />,
  shopping: <Utensils className="w-4 h-4" />,
};

// Mock image URLs for attractions (you can replace these with actual image URLs)
const attractionImages = {
  "Eiffel Tower": "/attractions/eiffel-tower.jpg",
  "Louvre Museum": "/attractions/louvre.jpg",
  "Tuileries Garden": "/attractions/tuileries.jpg",
  "Notre-Dame Cathedral": "/attractions/notre-dame.jpg",
  "Sainte-Chapelle": "/attractions/sainte-chapelle.jpg",
  "Latin Quarter": "/attractions/latin-quarter.jpg",
  Montmartre: "/attractions/montmartre.jpg",
  "Sacré-Cœur Basilica": "/attractions/sacre-coeur.jpg",
  "Place du Tertre": "/attractions/place-du-tertre.jpg",
  "Musée d'Orsay": "/attractions/musee-dorsay.jpg",
  "Champs-Élysées": "/attractions/champs-elysees.jpg",
  "Arc de Triomphe": "/attractions/arc-de-triomphe.jpg",
};

export function TimelineItinerary({
  itinerary,
}: {
  itinerary: TravelItinerary;
}) {
  console.log(itinerary, "check this");
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="space-y-12">
        {itinerary.itinerary.map((day) => (
          <div key={day.day} className="relative">
            <div className="absolute left-0 top-0 w-1 h-full bg-blue-200 rounded-full"></div>

            <div className="ml-8">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h2 className="text-2xl font-semibold mb-6">Day {day.day}</h2>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Attractions Section */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-gray-700 border-b pb-2">
                        Attractions
                      </h3>
                      <div className="space-y-6">
                        {day.attractions.map((attraction, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 rounded-lg overflow-hidden"
                          >
                            <div className="relative h-48 w-full">
                              <Image
                                src={
                                  attractionImages[
                                    attraction.name as keyof typeof attractionImages
                                  ] || "/placeholder.jpg"
                                }
                                alt={attraction.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="p-4">
                              <div className="flex items-start space-x-3">
                                <MapPin className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                                <div>
                                  <p className="font-medium text-lg">
                                    {attraction.name}
                                  </p>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {attraction.description}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-2">
                                    {attraction.address}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Schedule Section */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-gray-700 border-b pb-2">
                        Daily Schedule
                      </h3>
                      <div className="space-y-4">
                        {day.schedule.map((activity, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 rounded-lg p-4"
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
                                  <p className="font-medium">
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
        ))}
      </div>
    </div>
  );
}
