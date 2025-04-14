"use client";

import { useState } from "react";

interface PlaceSearchProps {
  initialValue?: string;
  handleChange: (value: string) => void;
  placeholder?: string;
}

export default function PlaceSearch({
  initialValue = "",
  handleChange,
  placeholder = "Enter location",
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
      className="border-none outline-none bg-transparent w-full"
      placeholder={placeholder}
    />
  );
}
