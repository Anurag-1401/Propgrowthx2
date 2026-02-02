const DashboardSkeleton = () => {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-24 rounded-xl bg-gray-200"
          />
        ))}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left section */}
        <div className="md:col-span-2 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-xl bg-gray-200"
            />
          ))}
        </div>

        {/* Right section */}
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="h-32 rounded-xl bg-gray-200"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
