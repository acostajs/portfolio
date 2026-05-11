import React from "react";

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div
      className={`animate-pulse bg-white/5 border border-border rounded-lg ${className}`}
    />
  );
};

export const MessageSkeleton: React.FC = () => {
  return (
    <div className="flex items-start max-w-3xl animate-fade-in">
      <Skeleton className="w-10 h-10 rounded-full mr-4 mt-1 shrink-0" />
      <div className="flex-1 bg-white/5 border border-border p-6 rounded-2xl rounded-tl-none shadow-xl backdrop-blur-sm space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white/5 border border-border p-8 rounded-3xl space-y-4">
      <div className="flex justify-between">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-20 w-full" />
    </div>
  );
};
