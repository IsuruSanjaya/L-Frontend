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
  { name: "Sun", value: 280 },
  { name: "Mon", value: 450 },
  { name: "Tue", value: 250 },
  { name: "Wed", value: 380 },
  { name: "Thu", value: 320 },
  { name: "Fri", value: 290 },
  { name: "Sat", value: 430 },
];

export default function ProfileView() {
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

            <div className="flex flex-col items-center p-6 rounded-xl bg-white shadow w-full max-w-md border border-blue-800">
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
            </div>
        </main>
      </div>
    </div>
  );
}

