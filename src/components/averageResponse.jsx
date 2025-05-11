import { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  XAxis,
  YAxis,
  Bar,
  ComposedChart,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
  CartesianGrid,
} from "recharts";
import { Calendar } from "lucide-react";
import { ArrowUp } from "lucide-react";

const responseTimeData = [
  { name: "Sun", value: 2.2 },
  { name: "Mon", value: 2.8 },
  { name: "Tue", value: 2.4 },
  { name: "Wed", value: 3.25 },
  { name: "Thu", value: 2.6 },
  { name: "Fri", value: 3.0 },
  { name: "Sat", value: 3.8 },
];

export default function AverageResponse() {
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}

      {/* Main Content */}
      <div className="wrap">
        <main className="p-6">
            {/* Average Response Time */}
            <div className="flex flex-col p-6 rounded-xl bg-white shadow border border-blue-800 w-200 h-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">
                    Average Time from Lead Arrival to First Message
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-2xl font-bold text-gray-900">2h 15m</p>
                    <div className="flex items-center px-2 py-1 text-xs font-medium bg-indigo-600 text-white rounded-full">
                      <ArrowUp className="w-3 h-3 mr-1" />
                      23.5%
                    </div>
                  </div>
                </div>
                <div className="flex items-center ml-6 text-gray-500 text-xs">
                  Last 7 Days
                  <Calendar className="w-4 h-4 ml-1" />
                </div>
              </div>

              <div className="flex-1 mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={responseTimeData}
                    margin={{ top: 10, right: 20, bottom: 20, left: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorGradient2"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#6366F1"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#6366F1"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      vertical={false}
                      strokeDasharray="6 6"
                      stroke="#f0f0f0"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#9CA3AF" }}
                      dy={10}
                    />
                    <YAxis
                      domain={[0, 5]}
                      ticks={[1, 2, 3, 4, 5]}
                      tickFormatter={(value) => `${value}h`}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#9CA3AF" }}
                    />

                    {/* Highlight Wednesday */}
                    <ReferenceArea
                      x1="Wed"
                      x2="Wed"
                      y1={0}
                      y2={5}
                      fill="#EEF2FF"
                    />

                    {/* Line connecting all points */}
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#6366F1"
                      strokeWidth={3}
                      dot={{
                        r: 0,
                      }}
                      activeDot={{
                        r: 6,
                        fill: "#6366F1",
                        stroke: "#ffffff",
                        strokeWidth: 2,
                      }}
                    />

                    {/* Reference for Wednesday showing 2h 15m */}
                    <ReferenceLine
                      x="Wed"
                      y={3.25}
                      stroke="#6366F1"
                      strokeDasharray="3 3"
                      label={{
                        value: "2h 15m",
                        position: "top",
                        fill: "#6366F1",
                        fontSize: 12,
                        dy: -10,
                      }}
                    />

                    {/* Dot for Wednesday - specifically visible */}
                    <ReferenceDot
                      x="Wed"
                      y={3.25}
                      r={4}
                      fill="#6366F1"
                      stroke="#FFFFFF"
                      strokeWidth={2}
                    />

                    {/* Bar only for Wednesday */}
                    <Bar
                      dataKey={(data) => (data.name === "Wed" ? data.value : 0)}
                      barSize={38}
                      fill="#6366F1"
                      fillOpacity={0.2}
                      isAnimationActive={false}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
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
