import { useState, useEffect, useRef } from "react";
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
import { getStatistics, getConversations } from "../services/api/api"; // Adjust path as needed
import { useLawyerId } from "../hooks/useLawyerId";

export default function LawyerStatsDashboard() {
  const [value, setValue] = useState(80);
  const [data, setData] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [responseTimeData, setResponseTimeData] = useState([]);
  // const lawyerId = "f8e94d08-a968-4987-a840-2e97bef9c803";
  const [chartData, setChartData] = useState([]); // Fixed: using chartData instead of chartDataa
  const [delayChartData, setDelayChartData] = useState([]); // New state for delay chart data
  const [delayTimeData, setDelayTimeData] = useState([]); // New state for delay data
  const [weekdayLeadTimeData, setWeekdayLeadTimeData] = useState([]);
  const [maxValues, setMaxValue] = useState(1);
  // const lawyerId = useLawyerId();
  const [lawyerId, setLawyerId] = useState(null);

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
  // Added states for overlay positioning fix
  const [chartDimensions, setChartDimensions] = useState({
    width: 0,
    height: 0,
  });
  const chartRef = useRef(null);
  const baseMaxViews = 100; // Base scale
  const maxViews = Math.ceil(views / 100) * 100 || baseMaxViews;
  const radiusprofile = 80;

  const minAngle = -120; // start angle of gauge
  const maxAngle = 115; // end angle of gauge
  const angles = minAngle + (views / maxViews) * (maxAngle - minAngle);
  const radians = ((angles - 90) * Math.PI) / 180;
  const xprofile = Math.cos(radians) * radiusprofile;
  const yprofile = Math.sin(radians) * radiusprofile;

  // Added useEffect for tracking chart dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (chartRef.current) {
        const rect = chartRef.current.getBoundingClientRect();
        setChartDimensions({ width: rect.width, height: rect.height });
      }
    };

    // Initial measurement
    setTimeout(updateDimensions, 100); // Small delay to ensure chart is rendered

    // Update on resize
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [chartData]); // Added chartData dependency to update when data changes

  useEffect(() => {
    function receiveMessage(event) {
      // IMPORTANT: check origin for security
      if (
        event.origin !==
        "https://lawggle-b065c1-7854620dcb65bd8d14aa462e.webflow.io"
      )
        return;

      const data = event.data;
      if (data.lawyerId) {
        setLawyerId(data.lawyerId);
        console.log("✅ Received lawyerId from parent:", data.lawyerId);
      }
    }

    window.addEventListener("message", receiveMessage);

    return () => window.removeEventListener("message", receiveMessage);
  }, []);

  useEffect(() => {
    if (!lawyerId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const statsData = await getStatistics(lawyerId);
        const convData = await getConversations(lawyerId);

        setData(statsData);
        setConversations(convData);
        const searchStats = statsData.searchresultdailyStats || [];

        const dailyStats = convData.conversations?.daily_response_stats || [];
        const delayStats = convData.conversations?.average_delay_stats || [];

        console.log("Daily Response Stats:", dailyStats);
        console.log("Delay Stats:", delayStats);

        const daysOfWeek = [
          { key: "Sunday", short: "Sun" },
          { key: "Monday", short: "Mon" },
          { key: "Tuesday", short: "Tue" },
          { key: "Wednesday", short: "Wed" },
          { key: "Thursday", short: "Thu" },
          { key: "Friday", short: "Fri" },
          { key: "Saturday", short: "Sat" },
        ];

        const formattedLeadTimeData = daysOfWeek.map((dayObj) => {
          const matching = searchStats.find((item) => {
            const date = new Date(item.date);
            const weekday = date.toLocaleDateString("en-US", {
              weekday: "long",
            });
            return weekday === dayObj.key;
          });

          return {
            name: dayObj.short,
            value: matching ? matching.count : 0,
          };
        });

        // Format response time data
        const formattedResponseData = daysOfWeek.map((dayInfo, index) => {
          const matchingDay = dailyStats.find(
            (item) => item.day === dayInfo.key
          );

          if (matchingDay) {
            const minutes = matchingDay.average_response_minutes;
            const hours = minutes / 60;

            return {
              name: dayInfo.short,
              value: Math.max(hours, 0.01),
              actualMinutes: minutes,
              time: formatMinutesToHourMinute(minutes),
              hasData: true,
              dayIndex: index,
            };
          }

          return {
            name: dayInfo.short,
            value: 0.01,
            actualMinutes: 0,
            time: "0h 0m",
            hasData: false,
            dayIndex: index,
          };
        });

        // Format delay time data
        const formattedDelayData = daysOfWeek.map((dayInfo, index) => {
          const matchingDelay = delayStats.find(
            (item) => item.day === dayInfo.key
          );

          if (matchingDelay) {
            const minutes = matchingDelay.average_delay_minutes;
            const hours = minutes / 60;

            return {
              name: dayInfo.short,
              value: Math.max(hours, 0.01),
              actualMinutes: minutes,
              time: formatMinutesToHourMinute(minutes),
              hasData: true,
              dayIndex: index,
              totalConversations: matchingDelay.total_conversations,
            };
          }

          return {
            name: dayInfo.short,
            value: 0.01,
            actualMinutes: 0,
            time: "0h 0m",
            hasData: false,
            dayIndex: index,
            totalConversations: 0,
          };
        });

        setChartData(formattedResponseData);
        setDelayChartData(formattedDelayData);
        setResponseTimeData(formattedResponseData);
        setDelayTimeData(formattedDelayData);
        setWeekdayLeadTimeData(formattedLeadTimeData);
        const rawMax = Math.max(
          ...formattedLeadTimeData.map((d) => d.value),
          1
        );

        // Smart scaling based on data range
        let roundedMax;
        if (rawMax <= 5) {
          roundedMax = Math.ceil(rawMax);
        } else if (rawMax <= 20) {
          roundedMax = Math.ceil(rawMax / 2) * 2;
        } else if (rawMax <= 50) {
          roundedMax = Math.ceil(rawMax / 5) * 5;
        } else if (rawMax <= 100) {
          roundedMax = Math.ceil(rawMax / 10) * 10;
        } else {
          roundedMax = Math.ceil(rawMax / 100) * 100;
        }

        setMaxValue(roundedMax);

        setLoading(false);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [lawyerId]);

  const formatMinutesToHourMinute = (minutes) => {
    if (!minutes || minutes === 0) return "0m";

    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = Math.round(minutes % 60);

      if (remainingMinutes === 0) {
        return `${hours}h`;
      } else {
        return `${hours}h ${remainingMinutes}m`;
      }
    } else {
      return `${Math.round(minutes)}m`;
    }
  };

  // Calculate dynamic Y-axis domain based on actual data
  const getYAxisDomain = () => {
    if (!chartData || chartData.length === 0) return [0, 5];

    const maxValue = Math.max(...chartData.map((item) => item.value));

    // Always start from 0, minimum scale is 5 hours
    const minScale = 5;

    if (maxValue <= minScale) {
      return [0, minScale];
    } else {
      // If data exceeds 5 hours, round up to next hour
      const roundedMax = Math.ceil(maxValue);
      return [0, roundedMax];
    }
  };

  // Generate Y-axis ticks based on domain
  const getYAxisTicks = () => {
    const [min, max] = getYAxisDomain();

    // Always use 1 hour increments, starting from 1h
    const ticks = [];
    for (let i = 1; i <= max; i++) {
      ticks.push(i);
    }

    // If we have a lot of ticks (more than 10), show every 2 hours
    if (ticks.length > 10) {
      return ticks.filter((tick, index) => index % 2 === 0 || tick === max);
    }

    return ticks;
  };

  // Custom bar component with hover functionality
  const CustomBar = (props) => {
    const { fill, x, y, width, height, payload, index } = props;

    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={payload.hasData ? fill : "#f3f4f6"}
        rx={4}
        ry={4}
        style={{ cursor: "pointer" }}
      />
    );
  };
  // Calculate overlay positions for bars
  const calculateBarOverlayPosition = (index, totalBars = 7) => {
    const leftMargin = 50;
    const rightMargin = 50;
    const chartWidth = chartDimensions.width || 600;

    const availableWidth = chartWidth - leftMargin - rightMargin;
    const barSpacing = availableWidth / totalBars;
    const barCenter = leftMargin + barSpacing * index + barSpacing / 2;
    const leftPercentage = (barCenter / chartWidth) * 100;

    return {
      left: `${leftPercentage}%`,
      transform: "translateX(-50%)",
    };
  };

  // Calculate dotted line height based on bar value
  const calculateDottedLineHeight = (value, maxValue, chartHeight = 200) => {
    const yAxisDomain = getYAxisDomain(delayTimeData);
    const maxDomainValue = yAxisDomain[1];
    const percentage = value / maxDomainValue;
    return Math.max(percentage * chartHeight * 0.75, 2); // 75% of chart height for bar area
  };

  // // Calculate dotted line position from bottom
  // const calculateDottedLineBottom = (chartHeight = 200) => {
  //   return chartHeight * 0.15; // Start from 15% from bottom (accounting for axis)
  // };

  // Improved function to calculate overlay positions
  const calculateOverlayPosition = (index, totalBars = 7) => {
    // Chart margins from your ResponsiveContainer
    const leftMargin = 30; // Account for negative left margin
    const rightMargin = 30;
    const chartWidth = chartDimensions.width;

    if (chartWidth === 0) {
      // Fallback positions if dimensions not ready
      const fallbackPositions = [9.2, 23.1, 37.2, 48.7, 60.2, 71.7, 83.2];
      return {
        left: `${fallbackPositions[index]}%`,
        transform: "translateX(-50%)",
      };
    }

    // Calculate available space for bars
    const availableWidth = chartWidth - leftMargin - rightMargin;

    // Calculate bar spacing and position
    const barSpacing = availableWidth / totalBars;
    const barCenter = leftMargin + barSpacing * index + barSpacing / 2;

    // Convert to percentage of total chart width
    const leftPercentage = (barCenter / chartWidth) * 100;

    return {
      left: `${leftPercentage}%`,
      transform: "translateX(-50%)",
    };
  };

  // Updated formatMinutesToDisplay function - handles conversion to hours when >= 60 minutes
  const formatMinutesToDisplay = (minutes) => {
    if (!minutes || minutes === 0) return "0.00m";

    // If 60 minutes or more, convert to hours and minutes
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;

      if (remainingMinutes === 0) {
        return `${hours}h`;
      } else if (remainingMinutes < 1) {
        return `${hours}h ${remainingMinutes.toFixed(1)}m`;
      } else {
        return `${hours}h ${Math.round(remainingMinutes)}m`;
      }
    }

    // For values less than 60 minutes, show in minutes
    if (minutes < 0.01) {
      return `${minutes.toFixed(3)}m`; // 3 decimal places for very small values
    } else if (minutes < 1) {
      return `${minutes.toFixed(2)}m`; // 2 decimal places for small values
    } else {
      return `${minutes.toFixed(1)}m`; // 1 decimal place for moderate values
    }
  };

  const formatOverlayTime = (minutes) => {
    if (!minutes || minutes === 0) return "0m";

    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;

      if (remainingMinutes < 0.1) {
        return `${hours}h`;
      } else if (remainingMinutes < 1) {
        return `${hours}h ${remainingMinutes.toFixed(1)}m`;
      } else {
        return `${hours}h ${Math.round(remainingMinutes)}m`;
      }
    } else if (minutes < 1) {
      return `${minutes.toFixed(1)}m`;
    } else {
      return `${minutes.toFixed(1)}m`;
    }
  };
  // Add this custom component for rendering dotted lines
  const DottedLines = ({ data, chartWidth, chartHeight, margin }) => {
    if (!data || data.length === 0) return null;

    const barCount = data.length;
    const availableWidth = chartWidth - margin.left - margin.right;
    const barSpacing = availableWidth / barCount;

    return (
      <g>
        {data.map((item, index) => {
          if (!item.hasData) return null;

          // Calculate the center position of each bar
          const barCenterX = margin.left + barSpacing * index + barSpacing / 2;

          return (
            <line
              key={`dotted-line-${index}`}
              x1={barCenterX}
              y1={margin.top}
              x2={barCenterX}
              y2={chartHeight - margin.bottom}
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeDasharray="4,4"
              opacity="0.8"
            />
          );
        })}
      </g>
    );
  };

  //averag lead message
  // Calculate dynamic Y-axis domain
  const getYAxisDomaindelay = (data) => {
    if (!data || data.length === 0) return [0, 5];

    const maxValue = Math.max(...data.map((item) => item.value));
    const minScale = 5;

    if (maxValue <= minScale) {
      return [0, minScale];
    } else {
      const roundedMax = Math.ceil(maxValue);
      return [0, roundedMax];
    }
  };

  // Generate Y-axis ticks
  const getYAxisTicksdelay = (data) => {
    const [min, max] = getYAxisDomain(data);
    const ticks = [];
    for (let i = 1; i <= max; i++) {
      ticks.push(i);
    }

    if (ticks.length > 10) {
      return ticks.filter((tick, index) => index % 2 === 0 || tick === max);
    }

    return ticks;
  };

  // Custom bar component
  const CustomBardelay = (props) => {
    const { fill, x, y, width, height, payload } = props;

    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={payload.hasData ? fill : "#f3f4f6"}
        rx={4}
        ry={4}
        style={{ cursor: "pointer" }}
      />
    );
  };

  // Get average delay for display
  const getAverageDelayMinutes = () => {
    if (!delayTimeData || delayTimeData.length === 0) return 0;

    const validDelays = delayTimeData.filter((day) => day.hasData);
    if (validDelays.length === 0) return 0;

    const totalMinutes = validDelays.reduce(
      (sum, day) => sum + day.actualMinutes,
      0
    );
    return totalMinutes / validDelays.length;
  };

  // Calculate overall average response time
  const getAverageResponseTime = () => {
    if (!responseTimeData || responseTimeData.length === 0) return 0;

    const validResponses = responseTimeData.filter((day) => day.hasData);
    if (validResponses.length === 0) return 0;

    const totalMinutes = validResponses.reduce(
      (sum, day) => sum + day.actualMinutes,
      0
    );
    return totalMinutes / validResponses.length;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const avgResponseTime7Days = data?.avgResponseTime7Days || {};

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
    if (!data || !data.bounceRate) return "No Data";
    return data.bounceRate;
  };

  // Extract bounce rate percentage
  const getSearchCount = () => {
    if (!data || !data.searchResultCount) return "No Data";
    return data.searchResultCount;
  };

  console.log(data.searchResultCount);

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

  <defs>
    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#5D5FEF" />
      <stop offset="100%" stopColor="#FFFFFF" />
    </linearGradient>
  </defs>;

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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Average Response Time */}
            <div className="lg:col-span-8 bg-white rounded-2xl p-4 md:p-6 h-auto md:h-[386px] relative border border-blue-600">
              <div className="grid grid-cols-1 sm:grid-cols-2 sm:justify-between sm:items-start mb-6">
                <div>
                  <p className="text-[#718096] text-[13.66px]">
                    Average Response Time
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <h2 className="text-[23px] font-bold text-gray-900">
                      {formatMinutesToDisplay(getAverageResponseTime())}
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
                <div className="flex justify-end items-end mt-4 sm:mt-4">
                  <div className="flex items-center ml-0 sm:ml-6 text-[#111827] text-[11px] border border-gray-200 px-2 py-2 rounded">
                    Last 7 Days
                    <Calendar className="w-4 h-4 ml-1 text-gray-400" />
                  </div>
                </div>
              </div>

              <div
                ref={chartRef}
                className="w-full h-[200px] md:h-[283px] relative"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={chartData}
                    margin={{ top: 30, right: 30, left: -30, bottom: 20 }}
                  >
                    <defs>
                      <linearGradient
                        id="barGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#5D5FEF" />
                        <stop offset="100%" stopColor="#FFFFFF" />
                      </linearGradient>
                    </defs>
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
                      domain={getYAxisDomain()}
                      ticks={getYAxisTicks()}
                      tickFormatter={(value) => `${value}h`}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#718096", fontSize: 13.66 }}
                    />
                    {/* Add dotted lines in the center of bars */}
                    <DottedLines
                      data={chartData}
                      chartWidth={400} // Adjust based on your chart size
                      chartHeight={283} // Adjust based on your chart size
                      margin={{ top: 30, right: 30, left: -30, bottom: 20 }}
                    />
                    {/* Bar Chart with custom bars */}
                    <Bar
                      dataKey="value"
                      fill="url(#barGradient)"
                      radius={[4, 4, 0, 0]}
                      barSize={40}
                      shape={<CustomBar />}
                    />
                    {/* Line Chart */}
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
                    <ReferenceLine
                      x="Wed" // or whatever day you want the line on
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      strokeDasharray="4,4"
                      opacity="0.8"
                    />
                  </ComposedChart>
                </ResponsiveContainer>

                {/* Fixed Overlay Tags positioned dynamically */}
                <div className="absolute inset-0 pointer-events-none">
                  {chartData.map((item, index) => {
                    if (!item.hasData || item.actualMinutes === 0) return null;

                    const position = calculateOverlayPosition(index);

                    return (
                      <div
                        key={`overlay-${index}`}
                        className="absolute bg-white rounded-lg px-3 py-2 shadow-lg border border-gray-200 transition-all duration-200"
                        style={{
                          top: "35%",
                          ...position,
                          zIndex: 20,
                          minWidth: "60px",
                          textAlign: "center",
                        }}
                      >
                        <div className="text-[#5D5FEF] text-[13.66px] font-semibold">
                          {formatOverlayTime(item.actualMinutes)}{" "}
                          {/* Use formatOverlayTime instead */}
                        </div>
                        <div className="text-gray-500 text-[9.76px]">
                          Average
                        </div>
                      </div>
                    );
                  })}
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
                    <div className="flex items-center ml-0 sm:ml-8 text-[#111827] text-[11px] border border-gray-200 px-2 py-2 rounded">
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
            {/* Fully responsive Bounce Rate Card with mobile-first approach */}
            <div className="lg:col-span-4 bg-white p-5 md:p-5 rounded-xl border border-blue-800 h-auto md:h-[386px] font-sans">
              {/* Header Section */}
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <p className="text-[#718096] text-[13.66px]">Bounce Rate</p>
                  <div className="flex items-center gap-1 sm:gap-2 mt-1">
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

              {/* Chart and Legend Container - Mobile First Approach */}
              <div className="grid grid-rows-2 h-auto">
                {/* Chart Area - Constrained size on mobile */}
                <div className="flex justify-center mt-9 items-center h-[120px] sm:h-[150px] md:h-[180px] w-full">
                  {renderDonutChart()}
                </div>

                {/* Legend - Always positioned below chart */}
                <div className="flex flex-wrap justify-center items-start gap-4 mt-10 pt-5 pb-2 h-auto">
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-[#5D5FEF] mr-2 flex-shrink-0"></span>
                    <span className="text-xs text-gray-600 whitespace-nowrap">
                      Engaged ({getBounceRateValue()})
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-[#FD4E4E] mr-2 flex-shrink-0"></span>
                    <span className="text-xs text-gray-600 whitespace-nowrap">
                      No Action ({getEngagementRate()})
                    </span>
                  </div>
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
                      {formatMinutesToHourMinute(getAverageDelayMinutes())}
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
                <div className="flex justify-end items-end mt-2 sm:mt-6">
                  <div className="flex items-center ml-8 sm:ml-6 text-[#111827] text-[11px] border border-gray-200 px-2 py-2 rounded">
                    Last 7 Days
                    <Calendar className="w-4 h-4 ml-1 text-gray-400" />
                  </div>
                </div>
              </div>

              <div
                ref={chartRef}
                className="w-full h-[200px] md:h-[283px] relative"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={delayChartData}
                    margin={{ top: 30, right: 30, left: -30, bottom: 20 }}
                  >
                    <defs>
                      <linearGradient
                        id="barGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#5D5FEF" />
                        <stop offset="100%" stopColor="#FFFFFF" />
                      </linearGradient>
                    </defs>
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
                      domain={getYAxisDomaindelay(delayChartData)}
                      ticks={getYAxisTicksdelay(delayChartData)}
                      tickFormatter={(value) => `${value}h`}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#718096", fontSize: 13.66 }}
                    />
                    {/* Add dotted lines in the center of bars */}
                    <DottedLines
                      data={delayChartData}
                      chartWidth={400} // Adjust based on your chart size
                      chartHeight={283} // Adjust based on your chart size
                      margin={{ top: 30, right: 30, left: -30, bottom: 20 }}
                      tick={{ fill: "#FFFFFF", fontSize: 13.66 }}
                    />
                    {/* Bar Chart with custom bars */}
                    <Bar
                      dataKey="value"
                      fill="url(#barGradient)"
                      radius={[4, 4, 0, 0]}
                      barSize={40}
                      shape={<CustomBardelay />}
                    />
                    {/* Line Chart */}
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
                    <ReferenceLine
                      x="Wed" // or whatever day you want the line on
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      strokeDasharray="4,4"
                      opacity="0.8"
                    />
                  </ComposedChart>
                </ResponsiveContainer>

                {/* Fixed Overlay Tags positioned dynamically */}
                <div className="absolute inset-0 pointer-events-none">
                  {delayChartData.map((item, index) => {
                    if (!item.hasData || item.actualMinutes === 0) return null;

                    const position = calculateOverlayPosition(index);

                    return (
                      <div
                        key={`overlay-${index}`}
                        className="absolute bg-white rounded-lg px-3 py-2 shadow-lg border border-gray-200 transition-all duration-200"
                        style={{
                          top: "35%",
                          ...position,
                          zIndex: 20,
                          minWidth: "60px",
                          textAlign: "center",
                        }}
                      >
                        <div className="text-[#5D5FEF] text-[13.66px] font-semibold">
                          {formatOverlayTime(item.actualMinutes)}{" "}
                          {/* Use formatOverlayTime instead */}
                        </div>
                        <div className="text-gray-500 text-[9.76px]">
                          Average
                        </div>
                      </div>
                    );
                  })}
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
                        {getSearchCount()}
                      </p>
                      <div className="flex items-center m-2 px-2 py-1 bg-[#5D5FEF] text-white text-xs rounded-full">
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
                            // Fixed: use maxValues (the actual max) instead of maxValues
                            width: `${Math.max(
                              (day.value / maxValues) * 100,
                              0
                            )}%`,
                            minWidth: day.value > 0 ? "2px" : "0px", // Show minimum bar for non-zero values
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4 text-xs text-gray-600 px-2 md:px-8">
                  {(() => {
                    const steps =
                      maxValues <= 10
                        ? maxValues
                        : maxValues <= 50
                        ? 5
                        : maxValues <= 100
                        ? 4
                        : 5;
                    const stepSize = maxValues / steps;

                    return Array.from({ length: steps + 1 }, (_, i) => (
                      <span key={i} className="hidden sm:inline">
                        {Math.round(i * stepSize)}
                      </span>
                    ));
                  })()}
                </div>
              </div>
            </div>

            {/* Profile View to Chat Conversion Rate */}
            <div className="lg:col-span-4 bg-white p-4 md:p-6 pt-5 rounded-xl border border-blue-800 h-auto md:h-[386px] font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-1 sm:justify-between sm:items-center mb-2">
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
