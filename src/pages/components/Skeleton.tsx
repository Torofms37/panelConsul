import React from "react";
import "../../styles/skeleton.css";

interface SkeletonProps {
  variant?: "text" | "circular" | "rectangular" | "card" | "table-row";
  width?: string | number;
  height?: string | number;
  count?: number;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = "text",
  width,
  height,
  count = 1,
  className = "",
}) => {
  const getSkeletonClass = () => {
    switch (variant) {
      case "circular":
        return "skeleton skeleton-circular";
      case "rectangular":
        return "skeleton skeleton-rectangular";
      case "card":
        return "skeleton skeleton-card";
      case "table-row":
        return "skeleton skeleton-table-row";
      default:
        return "skeleton skeleton-text";
    }
  };

  const style: React.CSSProperties = {
    width: width || "100%",
    height: height || (variant === "text" ? "1rem" : "100%"),
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`${getSkeletonClass()} ${className}`}
          style={style}
        />
      ))}
    </>
  );
};

// Componentes específicos de skeleton para casos comunes
export const SkeletonCard: React.FC = () => {
  return (
    <div className="skeleton-card-wrapper">
      <Skeleton variant="rectangular" height="200px" />
      <div className="skeleton-card-content">
        <Skeleton variant="text" width="60%" height="1.5rem" />
        <Skeleton variant="text" width="90%" />
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="70%" />
      </div>
    </div>
  );
};

export const SkeletonTable: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 4,
}) => {
  return (
    <div className="skeleton-table">
      {/* Header */}
      <div className="skeleton-table-header">
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} variant="text" height="1.2rem" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="skeleton-table-row">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} variant="text" height="1rem" />
          ))}
        </div>
      ))}
    </div>
  );
};

export const SkeletonGroup: React.FC = () => {
  return (
    <div className="skeleton-group-card">
      <Skeleton variant="text" width="70%" height="1.5rem" />
      <Skeleton variant="text" width="50%" />
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="55%" />
      <div className="skeleton-group-actions">
        <Skeleton variant="rectangular" width="80px" height="36px" />
        <Skeleton variant="rectangular" width="80px" height="36px" />
      </div>
    </div>
  );
};
