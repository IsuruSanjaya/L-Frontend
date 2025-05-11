import { useState } from "react";
import { Calendar } from "lucide-react";

export default function BounceRate() {
  const [value, setValue] = useState(80);
  const [totalViews, setTotalViews] = useState(400);

  // Calculate stats
  const percentage = value / 100;
  const chatsStarted = Math.round(totalViews * percentage);
  const radius = 80;
  const startAngle = -180;
  const endAngle = 0;
  const angle = startAngle + (endAngle - startAngle) * percentage;
  const angleRad = (angle * Math.PI) / 180;
  const x = radius * Math.cos(angleRad);
  const y = radius * Math.sin(angleRad);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}

      {/* Main Content */}
      <div className="wrap">
        <main className="p-6">
            {/* Bounce Rate */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-800 w-120 h-100">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg text-gray-600">Bounce Rate</h3>
                  <div className="flex items-center mt-1">
                    <p className="text-2xl font-semibold">25%</p>
                    <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                      +1%
                    </span>
                  </div>
                </div>
                <div className="flex items-center ml-6 text-gray-500 text-xs">
                  Last 7 Days
                  <Calendar className="w-4 h-4 ml-1" />
                </div>
              </div>

              <div className="relative h-60 w-60 mx-auto">
                <div className="absolute inset-0 rounded-full border-[24px] border-indigo-500 opacity-75"></div>
                <div className="absolute inset-0 rounded-full border-[24px] border-t-red-500 border-r-red-500 border-b-transparent border-l-transparent transform rotate-45"></div>
              </div>

              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></span>
                  <span className="text-xs text-gray-600">Engaged</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                  <span className="text-xs text-gray-600">No Action</span>
                </div>
              </div>
            </div>
        </main>
      </div>
    </div>
  );
}
