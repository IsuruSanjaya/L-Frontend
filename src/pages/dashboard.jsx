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
import {
  Clock,
  Calendar,
  MessageSquare,
  FileText,
  Award,
  Settings,
  Edit,
  UserPlus,
  LogOut,
  ChevronDown,
  Bell,
  Info,
} from "lucide-react";
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
const profileClicksData = [
  { name: "Sun", value: 100 },
  { name: "Mon", value: 150 },
  { name: "Tue", value: 80 },
  { name: "Wed", value: 200 },
  { name: "Thu", value: 90 },
  { name: "Fri", value: 120 },
  { name: "Sat", value: 220 },
];

const weekdayLeadTimeData = [
  { name: "Sun", value: 285, time: "1h 45m" },
  { name: "Mon", value: 465, time: "3h 10m" },
  { name: "Tue", value: 220, time: "1h 20m" },
  { name: "Wed", value: 420, time: "2h 45m" },
  { name: "Thu", value: 335, time: "2h 05m" },
  { name: "Fri", value: 270, time: "1h 50m" },
  { name: "Sat", value: 480, time: "3h 15m" },
];

export default function LawyerStatsDashboard() {
  const [value, setValue] = useState(80);
  const [totalViews, setTotalViews] = useState(400);
  const [timeframe, setTimeframe] = useState("Last 7 Days");
  const maxValue = 500;

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

  // SVG paths for gauge segments
  const createArc = (startAngle, endAngle, color) => {
    const start = polarToCartesian(radius, startAngle);
    const end = polarToCartesian(radius, endAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

    return (
      <path
        d={`M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`}
        stroke={color}
        strokeWidth="12"
        fill="none"
      />
    );
  };

  const polarToCartesian = (radius, angle) => {
    const angleRad = ((angle - 90) * Math.PI) / 180;
    return {
      x: radius * Math.cos(angleRad),
      y: radius * Math.sin(angleRad),
    };
  };

  // Growth indicator
  const growthPercentage = 23.5;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}

      {/* Main Content */}
      <div className="wrap">
        <main className="p-6">
          <div className="ml-20">
            <div className="flex space-x-4">
              {/* Average Response Time */}
              <div className="flex flex-col p-6 rounded-xl bg-white shadow border border-blue-800 w-[800px] h-[400px]">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-gray-500 text-sm font-small">
                      Average Response Time
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
                        dataKey={(data) =>
                          data.name === "Wed" ? data.value : 0
                        }
                        barSize={38}
                        fill="#6366F1"
                        fillOpacity={0.2}
                        isAnimationActive={false}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
              {/* Profile Clicks */}
              <div className="bg-white p-6 rounded-xl shadow border border-blue-600 w-[480px] h-[400px]">
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
            </div>

            <div className="flex space-x-4">
              {/* Bounce Rate */}
              <div className="bg-white p-6 pt-8 mt-4 rounded-xl shadow-sm border border-blue-800 w-[480px] h-[400px]">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-gray-500 text-m font-small">
                      Bounce Rate
                    </h3>
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

              {/* Average Time from Lead Arrival to First Message */}
              <div className="flex flex-col p-6 pt-8 mt-4 rounded-xl bg-white shadow border border-blue-800 w-[800px] h-[400px]">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-gray-500 text-m font-small">
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
                        dataKey={(data) =>
                          data.name === "Wed" ? data.value : 0
                        }
                        barSize={38}
                        fill="#6366F1"
                        fillOpacity={0.2}
                        isAnimationActive={false}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="flex space-x-4 ">
              {/* Average Time by Day */}
              <div className="flex flex-col p-6 pt-8 mt-4 rounded-xl bg-white shadow border border-blue-800 w-[800px] h-[400px]">
                  <div className="p-2">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-gray-500 text-sm font-medium">
                          Average Time from Lead Arrival to First Message
                        </h3>
                        <div className="flex items-center mt-2">
                          <p className="text-3xl font-bold text-gray-800">
                            2h 15m
                          </p>
                          <div className="ml-3 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-md font-medium">
                            23%
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center ml-6 text-gray-500 text-xs">
                        Last 7 Days
                        <Calendar className="w-4 h-4 ml-1" />
                      </div>
                    </div>

                    <div className="space-y-2 mt-4">
                      {weekdayLeadTimeData.map((day) => (
                        <div key={day.name} className="flex items-center gap-2">
                          <span className="w-8 text-sm font-medium text-gray-600">
                            {day.name}
                          </span>
                          <div className="flex-1 relative h-5">
                            <div
                              className="absolute h-4 bg-blue-700 rounded-md"
                              style={{
                                width: `${(day.value / maxValue) * 100}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between mt-4 text-xs text-gray-500 px-8">
                      <span>0</span>
                      <span>100</span>
                      <span>200</span>
                      <span>300</span>
                      <span>400</span>
                      <span>500</span>
                    </div>
                  </div>
              </div>

              <div className="flex flex-col items-center p-6 pt-8 mt-4 rounded-xl bg-white shadow w-[480px] h-[400px] border border-blue-800">
                <div className="flex w-full justify-between mb-1 font-switzer">
                  <h3 className="text-gray-500 text-m font-small">
                    Profile View to Chat Conversion Rate
                  </h3>
                </div>

                <div className="flex w-full items-center justify-between">
                  <span className="text-3xl font-bold">{value}%</span>
                  <span className="text-sm font-medium text-blue-600">
                    {growthPercentage}%
                  </span>
                </div>

                <div className="relative w-full">
                  <svg width="420" height="250" viewBox="-100 -90 200 120">
                    {/* Background arc */}
                    {createArc(-90, 180, "#EBEAFF")}

                    {/* Colored segments - using the purple color from the image */}
                    {createArc(-90, 0, "#C5BAFF")}
                    {createArc(-90, 0, "#C5BAFF")}
                    {createArc(-120, angle, "#C5BAFF")}

                    {/* Needle */}
                    <line
                      x1="0"
                      y1="0"
                      x2={x * 0.8}
                      y2={y * 0.8}
                      stroke="#1F2937"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <circle cx="0" cy="0" r="4" fill="#1F2937" />

                    {/* Central value */}
                    <text
                      x="0"
                      y="20"
                      fontSize="18"
                      fontWeight="bold"
                      textAnchor="middle"
                      fill="#1F2937"
                    >
                      {totalViews}
                    </text>
                    <text
                      x="0"
                      y="30"
                      fontSize="11"
                      textAnchor="middle"
                      fill="#1F2937"
                    >
                      Views
                    </text>
                  </svg>
                </div>

                {/* Stats display */}
                {/* <div className="flex w-full justify-between mt-6 text-center">
                <div>
                  <p className="text-lg font-bold">{totalViews}</p>
                  <p className="text-xs text-gray-500">Profile Views</p>
                </div>
                <div>
                  <p className="text-lg font-bold">{chatsStarted}</p>
                  <p className="text-xs text-gray-500">Chats Started</p>
                </div>
              </div> */}
              </div>
            </div>

            {/* Last Post Published */}
            <div className="bg-white p-6 pt-10 mt-4 rounded-lg shadow-sm border border-blue-800 w-[480px] h-[150px]">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-gray-500 text-m font-small">
                    Last Post Published
                  </h3>
                  <p className="text-xl font-semibold mt-2">April 23, 2025</p>
                </div>
                <span className="px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded">
                  Blawg
                </span>
              </div>
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
