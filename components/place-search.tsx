"use client";

import { useState } from "react";

interface PlaceSearchProps {
  initialValue?: string;
  handleChange: (value: string) => void;
}

export default function PlaceSearch({
  initialValue = "",
  handleChange,
}: PlaceSearchProps) {
  const [inputValue, setInputValue] = useState(initialValue);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    handleChange(value);
  };

  return (
    <input
      value={inputValue}
      onChange={(e) => handleInputChange(e.target.value)}
      className="border-none outline-none"
      placeholder="Enter any place name"
    />
  );
}
