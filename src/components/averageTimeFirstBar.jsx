import { useState } from "react";

import { Calendar } from "lucide-react";

const weekdayLeadTimeData = [
  { name: "Sun", value: 280 },
  { name: "Mon", value: 450 },
  { name: "Tue", value: 250 },
  { name: "Wed", value: 380 },
  { name: "Thu", value: 320 },
  { name: "Fri", value: 290 },
  { name: "Sat", value: 430 },
];

export default function AverageTimeFirstbar() {
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

  const polarToCartesian = (radius, angle) => {
    const angleRad = ((angle - 90) * Math.PI) / 180;
    return {
      x: radius * Math.cos(angleRad),
      y: radius * Math.sin(angleRad),
    };
  };

  // Growth indicator

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}

      {/* Main Content */}
      <div className="wrap">
        <main className="p-6">
          {/* Average Time by Day */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-800 w-220 h-100">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg text-gray-600">
                  Average Time From Lead Arrival to First Message
                </h3>
                <div className="flex items-center mt-7">
                  <p className="text-2xl font-semibold">2h 15m</p>
                  <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                    +2%
                  </span>
                </div>
              </div>
              <div className="flex items-center ml-6 text-gray-500 text-xs">
                Last 7 Days
                <Calendar className="w-4 h-4 ml-1" />
              </div>
            </div>

            <div className="space-y-4 mt-4">
              {weekdayLeadTimeData.map((day) => (
                <div key={day.name} className="flex items-center">
                  <span className="w-10 text-m text-gray-600">{day.name}</span>
                  <div className="flex-1 ml-1">
                    <div
                      className="h-5 bg-indigo-500 rounded"
                      style={{ width: `${(day.value / 500) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>{" "}
        </main>
      </div>
    </div>
  );
}
// Helper component for the dot at specific point
const ReferenceDot = ({ x, y, r, fill, stroke, strokeWidth }) => {
  return (
    <svg>
      <circle
        cx={x}
        cy={y}
        r={r}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};
