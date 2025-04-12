"use client";

import { useState, useRef } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface PlaceResult {
  place_id: string;
  description: string;
  structured_formatting?: {
    main_text: string;
    secondary_text: string;
  };
}

interface PlaceSearchProps {
  onPlaceSelect: (place: PlaceResult) => void;
  initialValue?: string;
}

export default function PlaceSearch({
  onPlaceSelect,
  initialValue = "",
}: PlaceSearchProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(initialValue);
  const [predictions, setPredictions] = useState<PlaceResult[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Mock Google Places API response
  const mockPlacesSearch = (input: string): Promise<PlaceResult[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!input.trim()) {
          resolve([]);
          return;
        }

        const mockData: PlaceResult[] = [
          {
            place_id: "ChIJD7fiBh9u5kcRYJSMaMOCCwQ",
            description: "Paris, France",
            structured_formatting: {
              main_text: "Paris",
              secondary_text: "France",
            },
          },
          {
            place_id: "ChIJOwg_06VPwokRYv534QaPC8g",
            description: "New York, NY, USA",
            structured_formatting: {
              main_text: "New York",
              secondary_text: "NY, USA",
            },
          },
          {
            place_id: "ChIJtcaxrqlJzDERKFeE5-Ht6j0",
            description: "Bali, Indonesia",
            structured_formatting: {
              main_text: "Bali",
              secondary_text: "Indonesia",
            },
          },
          {
            place_id: "ChIJP3Sa8ziYEmsRUKgyFmh9AQM",
            description: "Sydney, NSW, Australia",
            structured_formatting: {
              main_text: "Sydney",
              secondary_text: "NSW, Australia",
            },
          },
          {
            place_id: "ChIJdd4hrwug2EcRmSrV3Vo6llI",
            description: "Rome, Italy",
            structured_formatting: {
              main_text: "Rome",
              secondary_text: "Italy",
            },
          },
          {
            place_id: "ChIJdd4hrwug2EcRmSrV3Vo6llJ",
            description: "Gazipur National Park",
            structured_formatting: {
              main_text: "Gazipur National Park",
              secondary_text: "Bangladesh",
            },
          },
        ].filter((place) =>
          place.description.toLowerCase().includes(input.toLowerCase())
        );

        resolve(mockData);
      }, 300);
    });
  };

  const searchPlaces = async (input: string) => {
    if (!input.trim()) {
      setPredictions([]);
      return;
    }

    setLoading(true);
    try {
      // In a real app, this would call the Google Places API
      const results = await mockPlacesSearch(input);
      setPredictions(results);
    } catch (error) {
      console.error("Error fetching place predictions:", error);
      setPredictions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);

    // Debounce API calls
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      searchPlaces(value);
    }, 300);
  };

  const handleSelectPlace = (place: PlaceResult) => {
    setInputValue(place.description);
    onPlaceSelect(place);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="text-left font-normal text-gray-700">
          {inputValue || "Search destinations..."}
        </button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[300px]" align="start">
        <Command>
          <CommandInput value={inputValue} onValueChange={handleInputChange} />
          <CommandList>
            {loading ? (
              <CommandEmpty>Loading suggestions...</CommandEmpty>
            ) : predictions.length === 0 ? (
              <CommandEmpty>No places found</CommandEmpty>
            ) : (
              <CommandGroup heading="Suggestions">
                {predictions.map((place) => (
                  <CommandItem
                    key={place.place_id}
                    onSelect={() => handleSelectPlace(place)}
                    className="cursor-pointer"
                  >
                    <div>
                      {place.structured_formatting ? (
                        <>
                          <div className="font-medium">
                            {place.structured_formatting.main_text}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {place.structured_formatting.secondary_text}
                          </div>
                        </>
                      ) : (
                        <div>{place.description}</div>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
