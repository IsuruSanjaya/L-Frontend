import { useState, useEffect } from "react";
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
import { Clock, Calendar } from "lucide-react";
import { ArrowUp } from "lucide-react";
import axios from "axios";

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
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

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
  const views = data?.profileViews || 0;

  const baseMaxViews = 100; // Base scale
  const maxViews = Math.ceil(views / 100) * 100 || baseMaxViews;
  const radiusprofile = 80;

  const minAngle = -120; // start angle of gauge
  const maxAngle = 115; // end angle of gauge
  const angles = minAngle + (views / maxViews) * (maxAngle - minAngle);
  const radians = ((angles - 90) * Math.PI) / 180;
  const xprofile = Math.cos(radians) * radiusprofile;
  const yprofile = Math.sin(radians) * radiusprofile;

  // Fetch data on component mount
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/statistics/L002")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching statistics:", error);
      });
  }, []);

  const ConversationRate = data?.conversionRate || 0;

  const getProfileClicksChartData = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const stats = data?.last7DaysStats || [];

    return days.map((day) => {
      const match = stats.find((item) => item.day === day);
      return {
        day,
        profileClicks: match?.profileClick || 0,
      };
    });
  };

  // Extract bounce rate percentage
  const getBounceRateValue = () => {
    if (!data || !data.bounceRate) return "N/A";
    return data.bounceRate;
  };

  // Get the numeric value (56.67) from "56.67%"
  const getBounceRateNumeric = () => {
    if (!data || !data.bounceRate) return 0;
    return parseFloat(data.bounceRate.replace("%", ""));
  };

  // Calculate the conversion/engagement rate (100% - bounce rate)
  const getEngagementRate = () => {
    if (!data || !data.bounceRate) return "N/A";
    const bounceRateValue = parseFloat(data.bounceRate.replace("%", ""));
    return (100 - bounceRateValue).toFixed(2) + "%";
  };
  // Create the donut chart using SVG
  const renderDonutChart = () => {
    const size = 229;
    const strokeWidth = 40;
    const radius = (size - strokeWidth) / 2;
    const center = size / 2;

    // Calculate the circumference
    const circumference = 2 * Math.PI * radius;

    // The bounce rate from API is shown in BLUE (not red)
    const bluePercent = getBounceRateNumeric() / 100;
    const blueArcLength = circumference * bluePercent;

    // Calculate the remaining (complementary) portion for red
    const redPercent = (100 - getBounceRateNumeric()) / 100;
    const redArcLength = circumference * redPercent;

    // Calculate start point for the red arc (after the blue one)
    const redArcOffset = blueArcLength;

    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Blue arc (Bounce Rate from API) - starts at the top (0 degrees) */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="#5D5FEF"
          strokeWidth={strokeWidth}
          strokeDasharray={`${blueArcLength} ${circumference}`}
          strokeDashoffset="0"
          transform={`rotate(-90 ${center} ${center})`}
        />

        {/* Red arc (No Action) - starts after the blue arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="#FD4E4E"
          strokeWidth={strokeWidth}
          strokeDasharray={`${redArcLength} ${circumference}`}
          strokeDashoffset={-blueArcLength}
          transform={`rotate(-90 ${center} ${center})`}
        />

        {/* White center */}
        <circle
          cx={center}
          cy={center}
          r={radius - strokeWidth / 2}
          fill="white"
        />

        {/* Display the bounce rate in the center with blue color to match */}
        {/* <text
          x={center}
          y={center}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="20"
          fontWeight="bold"
          fill="#5D5FEF"  // Blue color to match the API bounce rate section
        >
          {getBounceRateValue()}
        </text> */}
      </svg>
    );
  };

  // SVG arc drawing function
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
  return (
    <div className="w-full">
      {/* Main Content */}
      <main className="p-2 md:p-5">
        <div className="w-full">
          {/* First Row */}
          <div className="grid grid-cols-2 lg:grid-cols-12 gap-10">
            {/* Average Response Time */}
            <div className="lg:col-span-8 bg-white rounded-2xl p-4 md:p-6 h-auto md:h-[386px] relative border border-blue-600">
              <div className="grid grid-cols-10 sm:grid-cols-2 sm:justify-between sm:items-start mb-2">
                <div>
                  <p className="text-[#718096] text-[13.66px]">
                    Average Response Time
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <h2 className="text-[23px] font-bold text-gray-900">
                      2h 15m
                    </h2>
                    <div className="flex items-center px-2 py-1 bg-[#5D5FEF] text-white text-xs rounded-full">
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
                <div className="flex justify-end items-end mt-2 sm:mt-0">
                  <div className="flex items-center ml-0 sm:ml-6 text-[#111827] text-[11px] border border-gray-200 px-2 py-2 rounded">
                    Last 7 Days
                    <Calendar className="w-4 h-4 ml-1 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="w-full h-[200px] md:h-[283px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={responseTimeData}
                    margin={{ top: 20, right: 30, left: -30, bottom: 20 }}
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
                      tick={{ fill: "#718096", fontSize: 13.66 }}
                    />
                    <YAxis
                      domain={[0, 5]}
                      ticks={[1, 2, 3, 4, 5]}
                      tickFormatter={(value) => `${value}h`}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#718096", fontSize: 13.66 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#5D5FEF"
                      strokeWidth={2.44}
                      dot={false}
                      activeDot={{
                        r: 8,
                        fill: "#5D5FEF",
                        stroke: "white",
                        strokeWidth: 2.44,
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>

                {/* Wednesday Highlight */}
                <div
                  className="absolute hidden md:block"
                  style={{
                    top: "45%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {/* Dotted Line */}
                  <div
                    className="absolute w-0 border-l-2 border-dashed z-10"
                    style={{
                      height: "145px", // Same height as the bar
                      width: "42px",
                      left: "73%",
                      top: "-9px",
                      transform: "translateX(-50%)",
                      borderColor: "#FFFFFF", // light version ofrgb(255, 255, 255)
                    }}
                  />
                  {/* Bar Background */}
                  <div
                    className="absolute w-10 bg-opacity-10"
                    style={{
                      height: "135px",
                      width: "43px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      borderRadius: "5px",
                      background: "linear-gradient(to bottom,white, #5D5FEF)",
                      opacity: 0.3,
                    }}
                  />

                  {/* Highlighted Bar Section */}
                  <div
                    className="absolute w-10 bg-opacity-20"
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
                    className="bg-white rounded-lg px-4 py-2 z-50"
                    style={{
                      top: "50px",
                      transform: "translateX(0%)",
                      zIndex: 20, // Ensures it's on top
                    }}
                  >
                    <div className="text-[#5D5FEF] text-[13.66px] font-semibold">
                      2h 15m
                    </div>
                    <div className="text-gray-500 text-[9.76px]">Average</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Profile Clicks */}
            <div className="lg:col-span-4 bg-white p-4 md:p-6 rounded-xl border border-blue-600 h-auto md:h-[386px]">
              <div className="mb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[#718096] text-[13.66px]">
                      Profile Clicks
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <h2 className="text-[23px] font-bold text-gray-900">
                        {data?.profileClicks || 0}
                      </h2>
                      <div className="flex items-center px-2 py-1 bg-[#5D5FEF] text-white text-xs rounded-full">
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
                  <div className="flex justify-end items-end mt-2 sm:mt-0">
                    <div className="flex items-center ml-0 sm:ml-6 text-[#111827] text-[11px] border border-gray-200 px-2 py-2 rounded">
                      Last 7 Days
                      <Calendar className="w-4 h-4 ml-1 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-48 md:h-58 mt-8">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={getProfileClicksChartData()}
                    margin={{ top: 5, right: 10, bottom: 5, left: -20 }}
                  >
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 13.66, fill: "#718096" }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 13.66, fill: "#718096" }}
                      domain={["auto", "auto"]}
                    />
                    <Bar
                      dataKey="profileClicks"
                      fill="#5D5FEF"
                      radius={[4, 4, 0, 0]}
                      barSize={22}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4">
            {/* Bounce Rate - 4 columns */}
            <div className="lg:col-span-4 bg-white p-4 md:p-6 pt-5 rounded-xl border border-blue-800 h-auto md:h-[386px] font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 sm:justify-between sm:items-center mb-6">
                <div>
                  <p className="text-[#718096] text-[13.66px]">Bounce Rate</p>
                  <div className="flex items-center gap-2 mt-1">
                    <h2 className="text-[23px] font-bold text-gray-900">
                      {getBounceRateValue()}
                    </h2>
                    <div className="flex items-center px-2 py-1 bg-[#5D5FEF] text-white text-xs rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
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
                <div className="flex justify-end items-end mt-2 sm:mt-0">
                  <div className="flex items-center ml-0 sm:ml-6 text-[#111827] text-[11px] border border-gray-200 px-2 py-2 rounded">
                    Last 7 Days
                    <Calendar className="w-4 h-4 ml-1 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Chart Area */}
              <div className="relative h-[180px] md:h-[229px] w-full flex justify-center">
                {renderDonutChart()}
              </div>

              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-[#5D5FEF] mr-2"></span>
                  <span className="text-xs text-gray-600">
                    Engaged ({getBounceRateValue()})
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-[#FD4E4E] mr-2"></span>
                  <span className="text-xs text-gray-600">
                    No Action ({getEngagementRate()})
                  </span>
                </div>
              </div>
            </div>

            {/* Average Time from Lead Arrival to First Message */}
            <div className="lg:col-span-8 bg-white rounded-2xl p-4 md:p-6 h-auto md:h-[386px] relative border border-blue-600">
              <div className="grid grid-cols-1 sm:grid-cols-2 sm:justify-between sm:items-start mb-4">
                <div>
                  <p className="text-[#718096] text-[13.66px]">
                    Average Time from Lead Arrival to First Message
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <h2 className="text-[23px] font-bold text-gray-900">
                      2h 15m
                    </h2>
                    <div className="flex items-center px-2 py-1 bg-[#5D5FEF] text-white text-xs rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-4 text-[9px]"
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
                <div className="flex justify-end items-end mt-2 sm:mt-0">
                  <div className="flex items-center ml-0 sm:ml-6 text-[#111827] text-[11px] border border-gray-200 px-2 py-2 rounded">
                    Last 7 Days
                    <Calendar className="w-4 h-4 ml-1 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="w-full h-[200px] md:h-[283px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={responseTimeData}
                    margin={{ top: 20, right: 20, left: -20, bottom: 20 }}
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
                      tick={{ fill: "#718096", fontSize: 13.66 }}
                    />
                    <YAxis
                      domain={[0, 5]}
                      ticks={[1, 2, 3, 4, 5]}
                      tickFormatter={(value) => `${value}h`}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#718096", fontSize: 13.66 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#5D5FEF"
                      strokeWidth={2.44}
                      dot={false}
                      activeDot={{
                        r: 8,
                        fill: "#5D5FEF",
                        stroke: "white",
                        strokeWidth: 2.44,
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>

                {/* Wednesday Highlight - hidden on small screens */}
                <div
                  className="absolute hidden md:block"
                  style={{
                    top: "25%",
                    left: "55%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {/* Dotted Line */}
                  <div
                    className="absolute w-0 border-l-2 border-dashed z-50"
                    style={{
                      height: "195px",
                      width: "42px",
                      left: "49%",
                      top: "-9px",
                      transform: "translateX(-50%)",
                      borderColor: "#FFFFFF",
                    }}
                  />

                  {/* Bar Background */}
                  <div
                    className="absolute w-10 bg-[#5D5FEF] bg-opacity-10"
                    style={{
                      height: "189px",
                      width: "42px",
                      left: "25%",
                      transform: "translateX(-50%)",
                      borderRadius: "5px",
                      background: "linear-gradient(to top,white, #5D5FEF)",
                      opacity: 0.9,
                    }}
                  />

                  <div
                    className="absolute w-10 bg-[#5D5FEF] bg-opacity-10"
                    style={{
                      height: "100px",
                      bottom: "0",
                      left: "25%",
                      transform: "translateX(-50%)",
                      borderRadius: "5px",
                      background: "linear-gradient(to bottom,white #5D5FEF)",
                      opacity: 0.9,
                    }}
                  />

                  {/* Overlay Tag */}
                  <div
                    className="bg-white rounded-lg px-4 py-2 z-20"
                    style={{
                      top: "40px",
                      transform: "translateX(-20%)",
                      zIndex: 20, // Ensures it's on top
                      left: "40px",
                    }}
                  >
                    <div className="text-[#5D5FEF] text-[13.66px] font-semibold z-20">
                      2h 15m
                    </div>
                    <div className="text-gray-500 text-[9.76px]">Average</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Third Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4">
            {/* Average Time by Day - 8 columns */}
            <div className="lg:col-span-8 p-4 md:p-6 pt-4 rounded-xl bg-white border border-blue-800 h-auto md:h-[386px]">
              <div className="p-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 sm:justify-between sm:items-center mb-4">
                  <div>
                    <h3 className="text-[#718096] text-[13.66px] font-small">
                      Average Time from Lead Arrival to First Message
                    </h3>
                    <div className="flex items-center mt-2">
                      <p className="text-[23px] font-bold text-gray-800">
                        2h 15m
                      </p>
                      <div className="flex items-center px-2 py-1 bg-[#5D5FEF] text-white text-xs rounded-full">
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
                  <div className="flex justify-end items-end mt-2 sm:mt-0">
                  <div className="flex items-center ml-0 sm:ml-6 text-[#111827] text-[11px] border border-gray-200 px-2 py-2 rounded">
                    Last 7 Days
                    <Calendar className="w-4 h-4 ml-1 text-gray-400" />
                  </div>
                </div>
                </div>

                <div className="space-y-3 mt-5">
                  {weekdayLeadTimeData.map((day) => (
                    <div key={day.name} className="flex items-center gap-2">
                      <span className="w-8 text-sm font-medium text-gray-600">
                        {day.name}
                      </span>
                      <div className="flex-1 relative h-5">
                        <div
                          className="absolute h-[21px] bg-[#5D5FEF] rounded-md"
                          style={{
                            width: `${(day.value / maxValue) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between mt-4 text-xs text-gray-600 px-2 md:px-8">
                  <span>0</span>
                  <span className="hidden sm:inline">100</span>
                  <span>200</span>
                  <span className="hidden sm:inline">300</span>
                  <span>400</span>
                  <span>500</span>
                </div>
              </div>
            </div>

            {/* Profile View to Chat Conversion Rate */}
            <div className="lg:col-span-4 bg-white p-4 md:p-6 pt-5 rounded-xl border border-blue-800 h-auto md:h-[386px] font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 sm:justify-between sm:items-center mb-6">
                <p className="text-[#718096] text-[13.66px]">
                  Profile View to Chat Conversion Rate
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <h2 className="text-[23px] font-bold text-gray-900">
                    {data?.conversionRate || 0}
                  </h2>
                  <div className="flex items-center px-2 py-1 bg-[#5D5FEF] text-white text-xs rounded-full">
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
                <svg
                  width="100%"
                  height="255px"
                  viewBox="-100 -90 200 120"
                  className="mx-auto"
                >
                  {/* Background arc in light color */}
                  {createArc(minAngle, maxAngle, "#EBEAFF")}

                  {/* Colored arc showing progress (single color) */}
                  {createArc(minAngle, angles, "#5D5FEF")}

                  {/* Needle */}
                  <line
                    x1="0"
                    y1="0"
                    x2={xprofile * 0.8}
                    y2={yprofile * 0.8}
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
                    {views}
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
            </div>
          </div>

          {/* Last Blog Published - Responsive width */}
          <div className="bg-white p-4 md:p-6 mt-4 rounded-lg border border-blue-800 w-full md:w-[377px] h-auto md:h-[106px]">
            <div>
              <p className="text-[#718096] text-[13.66px]">
                Last Blog Published
              </p>
              <div className="flex items-center gap-2 mt-1">
                <h2 className="text-[23px] font-bold text-[#111827]">
                  April 23,2025
                </h2>
                <div className="flex items-center px-2 py-1 bg-[#5D5FEF] text-white text-xs rounded-full">
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
