import React from "react";
import { Skeleton, CardSkeleton, MessageSkeleton } from "./Skeleton";

interface PageLoaderProps {
  variant?: "default" | "cards" | "chat" | "article";
}

const PageLoader: React.FC<PageLoaderProps> = ({ variant = "default" }) => {
  if (variant === "chat") {
    return (
      <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
        <MessageSkeleton />
        <MessageSkeleton />
      </div>
    );
  }

  if (variant === "cards") {
    return (
      <div className="max-w-5xl mx-auto p-6 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (variant === "article") {
    return (
      <div className="max-w-3xl mx-auto p-8 space-y-6 animate-fade-in">
        <Skeleton className="h-12 w-3/4 mb-8" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-64 w-full rounded-2xl my-8" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-8 animate-fade-in">
      <Skeleton className="h-10 w-1/2" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="pt-8 flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-24 rounded-lg" />
        ))}
      </div>
    </div>
  );
};

export default PageLoader;
