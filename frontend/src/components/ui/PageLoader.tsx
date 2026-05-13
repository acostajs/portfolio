import React from "react";

const PageLoader: React.FC = () => {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[200px] w-full p-12 animate-fade-in">
      <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );
};

export default PageLoader;
