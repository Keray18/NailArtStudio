import React from "react";

export const Skeleton: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-ivory-subtle via-blush/40 to-ivory-subtle rounded ${className}`}
    />
  );
};

