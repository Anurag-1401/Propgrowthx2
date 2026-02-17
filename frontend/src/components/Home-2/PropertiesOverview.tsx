import React from "react";
import { useNavigate } from "react-router-dom";

type Property = {
  id: string;
  name: string;
  address: string;
  city: string;
  rent: number;
  status: "Available" | "Occupied" | "Vacant";
  image?: string;
};

const BRAND = "#DC2626";

const SAMPLE_PROPERTIES: Property[] = [
  {
    id: "1",
    name: "Sunset Villa",
    address: "8819 Ohio St",
    city: "Mumbai",
    rent: 120000,
    status: "Available",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "2", 
    name: "Maple Apartments",
    address: "12 Maple Ave",
    city: "Bangalore",
    rent: 80000,
    status: "Occupied",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "3",
    name: "Orchard House", 
    address: "45 Orchard Lane",
    city: "Delhi",
    rent: 84000,
    status: "Vacant",
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=400&auto=format&fit=crop"
  }
];

export default function PropertiesOverview({ className = "" }: { className?: string }) {
  const navigate = useNavigate();

  const statusColors = {
    Available: "bg-green-100 text-green-700 border-green-200",
    Occupied: "bg-blue-100 text-blue-700 border-blue-200", 
    Vacant: "bg-orange-100 text-orange-700 border-orange-200",
  };

  return (
    <section className={`w-full ${className}`}>
      <div className="bg-white rounded-2xl border border-gray-200 p-3 md:p-8 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-8 gap-3 md:gap-4">
          <div>
            <h3 className="text-lg md:text-3xl font-bold text-gray-900">Recent Properties</h3>
            <p className="text-sm md:text-lg text-gray-600 mt-1 md:mt-2">Your latest property additions</p>
          </div>
          <button 
            onClick={() => navigate("/all-properties")}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium transition-colors duration-200 group self-start md:self-auto"
          >
            View All Properties 
            <i className="fas fa-arrow-right text-sm group-hover:translate-x-1 transition-transform duration-200"></i>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6">
          {SAMPLE_PROPERTIES.map((property) => (
            <div 
              key={property.id}
              className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-3 md:p-6 hover:shadow-lg border border-gray-100 hover:border-gray-200 transition-all duration-300 cursor-pointer hover:-translate-y-1"
              onClick={() => navigate("/all-properties")}
            >
              <div className="space-y-2 md:space-y-4">
                <div className="relative w-full h-24 md:h-32 rounded-xl overflow-hidden bg-gray-200">
                  {property.image ? (
                    <img 
                      src={property.image} 
                      alt={property.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <i className="fas fa-building text-xl md:text-3xl text-gray-400"></i>
                    </div>
                  )}
                  <div className="absolute top-1 md:top-3 right-1 md:right-3">
                    <span className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs font-semibold border ${statusColors[property.status]}`}>
                      {property.status}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-1 md:space-y-3">
                  <div>
                    <h4 className="font-bold text-base md:text-xl text-gray-900 group-hover:text-red-600 transition-colors duration-200 mb-1">
                      {property.name}
                    </h4>
                    <p className="text-gray-600 text-xs md:text-base flex items-center gap-1">
                      <i className="fas fa-map-marker-alt text-xs text-gray-400"></i>
                      {property.address}, {property.city}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-1 md:pt-2">
                    <div className="text-lg md:text-3xl font-bold text-gray-900">
                      ₹{property.rent.toLocaleString()}
                      <span className="text-xs md:text-base font-normal text-gray-500 ml-1">/month</span>
                    </div>
                    <i className="fas fa-chevron-right text-gray-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all duration-200"></i>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 md:mt-8 pt-3 md:pt-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-6">
              <div className="text-gray-600 text-sm md:text-base">
                <span className="font-semibold text-gray-900">{SAMPLE_PROPERTIES.length}</span> properties
              </div>
              <div className="text-gray-600 text-sm md:text-base">
                Total value: <span className="font-semibold text-gray-900">₹{SAMPLE_PROPERTIES.reduce((sum, p) => sum + p.rent, 0).toLocaleString()}</span>/month
              </div>
            </div>
            <button 
              onClick={() => navigate("/properties-manage")}
              className="px-3 md:px-6 py-2 md:py-3 rounded-xl text-white font-semibold transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 self-start md:self-auto text-sm md:text-base"
              style={{ background: BRAND }}
            >
              <i className="fas fa-cog text-sm"></i>
              Manage Properties
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}