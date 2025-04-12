import { MapPin } from "lucide-react"
import Image from "next/image"

interface Hotel {
  id: string
  name: string
  location: string
  startDate: string
  endDate: string
  price: string
  duration: string
  image: string
}

interface HotelCardProps {
  hotel: Hotel
}

export default function HotelCard({ hotel }: HotelCardProps) {
  return (
    <div className="flex bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="relative h-24 w-24 rounded-lg overflow-hidden">
        <Image src={hotel.image || "/placeholder.svg"} alt={hotel.name} fill className="object-cover" />
      </div>
      <div className="flex flex-col justify-between p-3 flex-1">
        <div>
          <div className="flex items-center text-sm text-gray-600 mb-1">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            <span>{hotel.location}</span>
          </div>
          <h3 className="font-semibold text-gray-900">{hotel.name}</h3>
        </div>
        <div className="flex justify-between items-center mt-1">
          <div className="text-xs text-gray-500">
            {hotel.startDate} → {hotel.endDate}
          </div>
          <div className="text-sm">
            <span className="font-semibold text-blue-600">{hotel.price}</span>
            <span className="text-gray-500">/{hotel.duration}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
