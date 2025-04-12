import { itineraryFakeData } from "@/fakeData";
import {
  MapPin,
  Clock,
  Utensils,
  Landmark,
  Mountain,
  Palette,
} from "lucide-react";

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

export function TimelineItinerary() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {itineraryFakeData.destination}
        </h1>
        <p className="text-gray-600">
          {itineraryFakeData.type} • {itineraryFakeData.days} Days
        </p>
      </div>

      <div className="space-y-8">
        {itineraryFakeData.itinerary.map((day) => (
          <div key={day.day} className="relative">
            <div className="absolute left-0 top-0 w-1 h-full bg-blue-200 rounded-full"></div>

            <div className="ml-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Day {day.day}</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-700">Attractions</h3>
                    {day.attractions.map((attraction, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <MapPin className="w-5 h-5 text-blue-500 mt-1" />
                        <div>
                          <p className="font-medium">{attraction.name}</p>
                          <p className="text-sm text-gray-600">
                            {attraction.description}
                          </p>
                          <p className="text-xs text-gray-500">
                            {attraction.address}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-700">Schedule</h3>
                    {day.schedule.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium">
                            {activity.time}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            {
                              activityIcons[
                                activity.typeOfActivity as keyof typeof activityIcons
                              ]
                            }
                            <p className="font-medium">{activity.activity}</p>
                          </div>
                          <p className="text-sm text-gray-600">
                            {activity.attractionName}
                          </p>
                        </div>
                      </div>
                    ))}
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
