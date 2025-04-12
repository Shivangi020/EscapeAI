"use client";

import { useState } from "react";

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
  const [inputValue, setInputValue] = useState(initialValue);

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  return (
    <input
      value={inputValue}
      onChange={(e) => handleInputChange(e.target.value)}
      className="border-none outline-none"
      placeholder="Enter any place name"
    ></input>
  );
}
