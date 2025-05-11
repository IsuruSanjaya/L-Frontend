import { useState } from "react";
import { BarChart, XAxis, YAxis, Bar, ResponsiveContainer } from "recharts";
import { Calendar } from "lucide-react";
import { ArrowUp } from "lucide-react";

const profileClicksData = [
  { name: "Sun", value: 100 },
  { name: "Mon", value: 150 },
  { name: "Tue", value: 80 },
  { name: "Wed", value: 200 },
  { name: "Thu", value: 90 },
  { name: "Fri", value: 120 },
  { name: "Sat", value: 220 },
];

export default function ProfileClick() {
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
            {/* Profile Clicks */}
            <div className="bg-white p-6  rounded-xl shadow border border-blue-600 w-130 h-100">
              <div className="mb-4">
                <h3 className="text-gray-500 text-sm mb-2">Profile Clicks</h3>
                <div className="flex items-center justify-between">
                  <p className="text-4xl font-bold text-gray-900">1000</p>
                  <div className="flex justify-between items-center">
                    <div className="bg-indigo-600 text-white text-xs font-medium px-3 py-1 rounded-full flex items-center">
                      <ArrowUp className="w-3 h-2 mr-1" />
                      23.5%
                    </div>
                    <div className="flex items-center ml-6 text-gray-500 text-xs">
                      Last 7 Days
                      <Calendar className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-58 mt-8">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={profileClicksData}
                    margin={{ top: 5, right: 10, bottom: 5, left: -20 }}
                  >
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#6B7280" }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#6B7280" }}
                      domain={[0, 250]}
                      ticks={[50, 100, 150, 200, 250]}
                    />
                    <Bar
                      dataKey="value"
                      fill="#6366F1"
                      radius={[4, 4, 0, 0]}
                      barSize={30}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
        </main>
      </div>
    </div>
  );
}

