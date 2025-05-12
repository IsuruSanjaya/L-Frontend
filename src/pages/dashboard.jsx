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
  IndentIncrease,
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
              <div className="bg-white rounded-2xl p-6 w-full max-w-[800px] h-[400px] relative border border-blue-600">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-500 text-sm">
                      Average Response Time
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <h2 className="text-2xl font-bold text-gray-900">
                        2h 15m
                      </h2>
                      <div className="flex items-center px-2 py-1 bg-indigo-600 text-white text-xs rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
                          />
                        </svg>
                        23.5%
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center ml-6 text-gray-800 text-xs border border-gray-200 px-2 py-2 rounded">
                    Last 7 Days
                    <Calendar className="w-4 h-4 ml-1 text-gray-500" />
                  </div>
                </div>

                <div className="w-full h-[280px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={responseTimeData}
                      margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid
                        vertical={false}
                        stroke="#f0f0f0"
                        strokeDasharray="6 6"
                      />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#9CA3AF", fontSize: 12 }}
                      />
                      <YAxis
                        domain={[0, 5]}
                        ticks={[1, 2, 3, 4, 5]}
                        tickFormatter={(value) => `${value}h`}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#9CA3AF", fontSize: 12 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#6366F1"
                        strokeWidth={3}
                        dot={false}
                        activeDot={{
                          r: 8,
                          fill: "#6366F1",
                          stroke: "white",
                          strokeWidth: 2,
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>

                  {/* Wednesday Highlight */}
                  <div
                    className="absolute"
                    style={{
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    {/* Dotted Line */}
                    <div
                      className="absolute w-0 border-l-2 border-dashed border-[#5D5FEF]"
                      style={{
                        height: "109px", // Same height as the bar
                        left: "50%",
                        top: "-10px",
                        transform: "translateX(-50%)",
                        borderColor: "#5D5FEF",
                      }}
                    />
                    {/* Bar Background */}
                    <div
                      className="absolute w-10 bg-indigo-600 bg-opacity-10"
                      style={{
                        height: "100px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        borderRadius: "5px",
                        background: "linear-gradient(to bottom,white, #5D5FEF)",
                        opacity: 0.3,
                      }}
                    />

                    {/* Highlighted Bar Section */}
                    {/* Highlighted Bar Section */}
                    <div
                      className="absolute w-10 bg-indigo-600 bg-opacity-20"
                      style={{
                        height: "100px",
                        bottom: "0",
                        left: "50%",
                        transform: "translateX(-50%)",
                        borderRadius: "5px",
                        background: "linear-gradient(to bottom, #5D5FEF)",
                        opacity: 0.8,
                      }}
                    />

                    {/* Overlay Tag */}
                    <div
                      className="bg-white rounded-lg px-4 py-2 width-  "
                      style={{
                        top: "-80px",
                        transform: "translateX(0%)",
                      }}
                    >
                      <div className="text-[#5D5FEF] text-base font-semibold">
                        2h 15m
                      </div>
                      <div className="text-gray-400 text-xs">Average</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Profile Clicks */}
              <div className="bg-white p-6 rounded-xl  border border-blue-600 w-[480px] h-[400px]">
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Profile Clicks</p>
                      <div className="flex items-center gap-2 mt-1">
                        <h2 className="text-2xl font-bold text-gray-900">
                          1000
                        </h2>
                        <div className="flex items-center px-2 py-1 bg-indigo-600 text-white text-xs rounded-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
                            />
                          </svg>
                          23.5%
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center ml-6 text-gray-800 text-xs border border-gray-200 px-2 py-2 rounded">
                        Last 7 Days
                        <Calendar className="w-4 h-4 ml-1 text-gray-500" />
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
              <div className="bg-white p-6 pt-8 mt-4 rounded-xl border border-blue-800 w-[480px] h-[400px]">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-gray-500 text-sm">Bounce Rate</p>
                    <div className="flex items-center gap-2 mt-1">
                      <h2 className="text-2xl font-bold text-gray-900">
                        2h 15m
                      </h2>
                      <div className="flex items-center px-2 py-1 bg-indigo-600 text-white text-xs rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
                          />
                        </svg>
                        23.5%
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center ml-6 text-gray-800 text-xs border border-gray-200 px-2 py-2 rounded">
                    Last 7 Days
                    <Calendar className="w-4 h-4 ml-1 text-gray-500" />
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
              <div className="bg-white rounded-2xl  p-6 mt-4 w-full max-w-[800px] h-[400px] relative border border-blue-600">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-500 text-sm">
                      Average Time from Lead Arrival to First Message
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <h2 className="text-2xl font-bold text-gray-900">
                        2h 15m
                      </h2>
                      <div className="flex items-center px-2 py-1 bg-indigo-600 text-white text-xs rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
                          />
                        </svg>
                        23.5%
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center ml-6 text-gray-800 text-xs border border-gray-200 px-2 py-2 rounded">
                    Last 7 Days
                    <Calendar className="w-4 h-4 ml-1 text-gray-500" />
                  </div>
                </div>

                <div className="w-full h-[280px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={responseTimeData}
                      margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid
                        vertical={false}
                        stroke="#f0f0f0"
                        strokeDasharray="6 6"
                      />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#9CA3AF", fontSize: 12 }}
                      />
                      <YAxis
                        domain={[0, 5]}
                        ticks={[1, 2, 3, 4, 5]}
                        tickFormatter={(value) => `${value}h`}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#9CA3AF", fontSize: 12 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#6366F1"
                        strokeWidth={3}
                        dot={false}
                        activeDot={{
                          r: 8,
                          fill: "#6366F1",
                          stroke: "white",
                          strokeWidth: 2,
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>

                  {/* Wednesday Highlight */}
                  <div
                    className="absolute"
                    style={{
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    {/* Dotted Line */}
                    <div
                      className="absolute w-0 border-l-2 border-dashed border-[#5D5FEF]"
                      style={{
                        height: "109px", // Same height as the bar
                        left: "50%",
                        top: "-10px",
                        transform: "translateX(-50%)",
                        borderColor: "#5D5FEF",
                      }}
                    />
                    {/* Bar Background */}
                    <div
                      className="absolute w-10 bg-indigo-600 bg-opacity-10"
                      style={{
                        height: "100px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        borderRadius: "5px",
                        background: "linear-gradient(to bottom,white, #5D5FEF)",
                        opacity: 0.3,
                      }}
                    />

                    {/* Highlighted Bar Section */}
                    {/* Highlighted Bar Section */}
                    <div
                      className="absolute w-10 bg-indigo-600 bg-opacity-20"
                      style={{
                        height: "100px",
                        bottom: "0",
                        left: "50%",
                        transform: "translateX(-50%)",
                        borderRadius: "5px",
                        background: "linear-gradient(to bottom, #5D5FEF)",
                        opacity: 0.8,
                      }}
                    />

                    {/* Overlay Tag */}
                    <div
                      className="bg-white rounded-lg px-4 py-2 width-  "
                      style={{
                        top: "-80px",
                        transform: "translateX(0%)",
                      }}
                    >
                      <div className="text-[#5D5FEF] text-base font-semibold">
                        2h 15m
                      </div>
                      <div className="text-gray-400 text-xs">Average</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-4 ">
              {/* Average Time by Day */}
              <div className="flex flex-col p-6 pt-8 mt-4 rounded-xl bg-white  border border-blue-800 w-[800px] h-[400px]">
                <div className="p-2">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-gray-500 text-sm font-small">
                        Average Time from Lead Arrival to First Message
                      </h3>
                      <div className="flex items-center mt-2">
                        <p className="text-[23px] font-bold text-gray-800">
                          2h 15m
                        </p>
                        <div className="flex items-center px-2 py-1 bg-indigo-600 text-white text-xs rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
                          />
                        </svg>
                        23.5%
                      </div>
                      </div>
                    </div>
                    <div className="flex items-center ml-6 text-gray-800 text-xs border border-gray-200 px-2 py-2 rounded">
                    Last 7 Days
                    <Calendar className="w-4 h-4 ml-1 text-gray-500" />
                  </div>
                  </div>

                  <div className="space-y-3 mt-5">
                    {weekdayLeadTimeData.map((day) => (
                      <div key={day.name} className="flex items-center gap-2">
                        <span className="w-8 text-sm font-medium text-gray-500">
                          {day.name}
                        </span>
                        <div className="flex-1 relative h-5">
                          <div
                            className="absolute h-5 bg-[#5D5FEF] rounded-md"
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

              <div className="bg-white p-6 pt-10 mt-4 rounded-lg  border border-blue-800 w-[480px] h-[400px]">
                <div>
                  <p className="text-gray-500 text-sm">
                    Profile View to Chat Conversion Rate
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <h2 className="text-[23px] font-bold text-gray-900">85%</h2>
                    <div className="flex items-center px-2 py-1 bg-indigo-600 text-white text-xs rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
                        />
                      </svg>
                      23.5%
                    </div>
                  </div>
                </div>

                <div className="relative w-full">
                  <svg width="420" height="250" viewBox="-100 -90 200 120">
                    {/* Background arc */}
                    {createArc(-90, 180, "#EBEAFF")}

                    {/* Colored segments - using the purple color from the image */}
                    {createArc(-90, 0, "#5D5FEF")}
                    {createArc(-90, 0, "#5D5FEF")}
                    {createArc(-120, angle, "#5D5FEF")}

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
            <div className="bg-white p-6 pt-10 mt-4 rounded-lg  border border-blue-800 w-[480px] h-[150px]">
              <div>
                <p className="text-gray-500 text-sm">Last Blog Published</p>
                <div className="flex items-center gap-2 mt-1">
                  <h2 className="text-2xl font-bold text-gray-900">
                    April 23,2025
                  </h2>
                  <div className="flex items-center px-2 py-1 bg-indigo-600 text-white text-xs rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
                      />
                    </svg>
                    23.5%
                  </div>
                </div>
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
