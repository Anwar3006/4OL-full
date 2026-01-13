"use client";

import React from "react";

interface MapToggleButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const MapToggleButton: React.FC<MapToggleButtonProps> = ({
  label,
  isActive,
  onClick,
}) => {
  const baseClasses = "px-4 py-2 rounded transition-colors duration-200";
  const activeClasses = "bg-blue-500 text-white";
  const inactiveClasses = "bg-gray-200 text-gray-700 hover:bg-gray-300";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      {label}
    </button>
  );
};

export default MapToggleButton;
