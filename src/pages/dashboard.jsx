import { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  ResponsiveContainer,
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

const responseTimeData = [
  { name: "Sun", value: 2.7 },
  { name: "Mon", value: 3.0 },
  { name: "Tue", value: 2.5 },
  { name: "Wed", value: 3.3 },
  { name: "Thu", value: 2.4 },
  { name: "Fri", value: 2.8 },
  { name: "Sat", value: 3.2 },
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
  { name: "Sun", value: 280 },
  { name: "Mon", value: 450 },
  { name: "Tue", value: 250 },
  { name: "Wed", value: 380 },
  { name: "Thu", value: 320 },
  { name: "Fri", value: 290 },
  { name: "Sat", value: 430 },
];


export default function LawyerStatsDashboard() {
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
      y: radius * Math.sin(angleRad)
    };
  };
  
  // Growth indicator
  const growthPercentage = 23.5;
  const [activeTab, setActiveTab] = useState("My Statistics");

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}

      {/* Main Content */}
      <div className="flex-1">
        <main className="p-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Average Response Time */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <div>
                <h3 className="text-lg text-gray-600">
                    Average Response Time
                  </h3>
                  <div className="flex items-center mt-1">
                    <p className="text-2xl font-semibold">2h 15m</p>
                    <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                      +2%
                    </span>
                  </div>
                </div>
                <button className="text-xs text-gray-400 hover:text-gray-600">
                  Last 7 Days
                </button>
              </div>

              <div className="h-40 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={responseTimeData}>
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#9CA3AF" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#4F46E5"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6, fill: "#4F46E5" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="flex justify-between items-center mt-2">
                <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                  <span className="text-white text-xs">2</span>
                </div>
                <p className="text-xs font-medium text-indigo-600">3h 5m</p>
              </div>
            </div>

            {/* Profile Clicks */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <div>
                <h3 className="text-lg text-gray-600">
                    Profile Clicks
                  </h3>
                  <div className="flex items-center mt-1">
                    <p className="text-2xl font-semibold">1000</p>
                    <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                      +1%
                    </span>
                  </div>
                </div>
                <button className="text-xs text-gray-400 hover:text-gray-600">
                  Last 7 Days
                </button>
              </div>

              <div className="h-40 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={profileClicksData}>
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#9CA3AF" }}
                    />
                    <Bar dataKey="value" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bounce Rate */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <div>
                <h3 className="text-lg text-gray-600">
                    Bounce Rate
                  </h3>
                  <div className="flex items-center mt-1">
                    <p className="text-2xl font-semibold">25%</p>
                    <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                      +1%
                    </span>
                  </div>
                </div>
                <button className="text-xs text-gray-400 hover:text-gray-600">
                  Last 7 Days
                </button>
              </div>

              <div className="relative h-48 w-48 mx-auto">
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
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <div>
                <h3 className="text-lg text-gray-600">
                    Average Time From Lead Arrival to First Message
                  </h3>
                  <div className="flex items-center mt-1">
                    <p className="text-2xl font-semibold">2h 15m</p>
                    <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                      +3%
                    </span>
                  </div>
                </div>
                <button className="text-xs text-gray-400 hover:text-gray-600">
                  Last 7 Days
                </button>
              </div>

              <div className="h-40 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={responseTimeData}>
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#9CA3AF" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#4F46E5"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6, fill: "#4F46E5" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="flex justify-between items-center mt-2">
                <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                  <span className="text-white text-xs">5</span>
                </div>
                <p className="text-xs font-medium text-indigo-600">2h 15m</p>
                <p className="text-xs font-medium text-gray-500">Current</p>
              </div>
            </div>

            {/* Average Time by Day */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <div>
                <h3 className="text-lg text-gray-600">
                    Average Time From Lead Arrival to First Message
                  </h3>
                  <div className="flex items-center mt-1">
                    <p className="text-2xl font-semibold">2h 15m</p>
                    <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                      +2%
                    </span>
                  </div>
                </div>
                <button className="text-xs text-gray-400 hover:text-gray-600">
                  Last 7 Days
                </button>
              </div>

              <div className="space-y-3 mt-4">
                {weekdayLeadTimeData.map((day) => (
                  <div key={day.name} className="flex items-center">
                    <span className="w-12 text-xs text-gray-600">
                      {day.name}
                    </span>
                    <div className="flex-1 ml-4">
                      <div
                        className="h-4 bg-indigo-500 rounded"
                        style={{ width: `${(day.value / 500) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center p-6 rounded-xl bg-white shadow w-full max-w-md">
              <div className="flex w-full justify-between mb-1 font-switzer">
                <h3 className="text-lg text-gray-600">
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
                <svg width="100%" height="150" viewBox="-100 -90 200 120">
                  {/* Background arc */}
                  {createArc(-180, 0, "#EBEAFF")}

                  {/* Colored segments - using the purple color from the image */}
                  {createArc(-180, -120, "#C5BAFF")}
                  {createArc(-120, -60, "#C5BAFF")}
                  {createArc(-60, angle, "#C5BAFF")}

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

            {/* Last Post Published */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <div>
                <h3 className="text-lg text-gray-600">
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
