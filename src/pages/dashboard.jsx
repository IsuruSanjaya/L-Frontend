import { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, ResponsiveContainer } from 'recharts';
import { Clock, Calendar, MessageSquare, FileText, Award, Settings, Edit, UserPlus, LogOut, ChevronDown, Bell, Info } from 'lucide-react';

const responseTimeData = [
  { name: 'Sun', value: 2.7 },
  { name: 'Mon', value: 3.0 },
  { name: 'Tue', value: 2.5 },
  { name: 'Wed', value: 3.3 },
  { name: 'Thu', value: 2.4 },
  { name: 'Fri', value: 2.8 },
  { name: 'Sat', value: 3.2 },
];

const profileClicksData = [
  { name: 'Sun', value: 100 },
  { name: 'Mon', value: 150 },
  { name: 'Tue', value: 80 },
  { name: 'Wed', value: 200 },
  { name: 'Thu', value: 90 },
  { name: 'Fri', value: 120 },
  { name: 'Sat', value: 220 },
];

const weekdayLeadTimeData = [
  { name: 'Sun', value: 280 },
  { name: 'Mon', value: 450 },
  { name: 'Tue', value: 250 },
  { name: 'Wed', value: 380 },
  { name: 'Thu', value: 320 },
  { name: 'Fri', value: 290 },
  { name: 'Sat', value: 430 },
];

// Custom Gauge Chart Component
const GaugeChart = ({ value, totalViews }) => {
  // Calculate the coordinates for the needle
  const percentage = value / 100;
  const radius = 80;
  const startAngle = -90;
  const endAngle = 90;
  const angle = startAngle + (endAngle - startAngle) * percentage;
  const angleRad = (angle * Math.PI) / 180;
  const x = radius * Math.cos(angleRad);
  const y = radius * Math.sin(angleRad);
  
  return (
    <div className="relative flex flex-col items-center mt-4">
      {/* Gauge */}
      <svg width="180" height="100" viewBox="-100 -10 200 110">
        {/* Background arc */}
        <path 
          d="M -80 0 A 80 80 0 0 1 80 0" 
          stroke="#E5E7EB" 
          strokeWidth="12" 
          fill="none" 
        />
        
        {/* Value arc */}
        <path 
          d={`M -80 0 A 80 80 0 ${percentage > 0.5 ? 1 : 0} 1 ${x} ${y}`} 
          stroke="#4F46E5" 
          strokeWidth="12" 
          fill="none" 
        />
        
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
        
        {/* Center point */}
        <circle cx="0" cy="0" r="6" fill="#1F2937" />
        
        {/* Percentage text */}
        <text 
          x="0" 
          y="30" 
          fontSize="24" 
          fontWeight="bold" 
          textAnchor="middle" 
          fill="#1F2937"
        >
          {value}%
        </text>
        
        {/* Min and max labels */}
        <text x="-85" y="20" fontSize="12" textAnchor="middle" fill="#6B7280">0%</text>
        <text x="85" y="20" fontSize="12" textAnchor="middle" fill="#6B7280">100%</text>
      </svg>
      
      {/* Stats below gauge */}
      <div className="flex w-full justify-around mt-4">
        <div className="text-center">
          <p className="text-lg font-bold">{totalViews}</p>
          <p className="text-xs text-gray-500">Profile Views</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold">{Math.round(totalViews * (value/100))}</p>
          <p className="text-xs text-gray-500">Chats Started</p>
        </div>
      </div>
    </div>
  );
};

export default function LawyerStatsDashboard() {
  const [activeTab, setActiveTab] = useState('My Statistics');
  
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
                  <h3 className="text-sm font-normal text-gray-500">Average Response Time</h3>
                  <div className="flex items-center mt-1">
                    <p className="text-2xl font-semibold">2h 15m</p>
                    <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded">+2%</span>
                  </div>
                </div>
                <button className="text-xs text-gray-400 hover:text-gray-600">Last 7 Days</button>
              </div>
              
              <div className="h-40 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={responseTimeData}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                    <Line type="monotone" dataKey="value" stroke="#4F46E5" strokeWidth={2} dot={false} activeDot={{ r: 6, fill: "#4F46E5" }} />
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
                  <h3 className="text-sm font-normal text-gray-500">Profile Clicks</h3>
                  <div className="flex items-center mt-1">
                    <p className="text-2xl font-semibold">1000</p>
                    <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded">+1%</span>
                  </div>
                </div>
                <button className="text-xs text-gray-400 hover:text-gray-600">Last 7 Days</button>
              </div>
              
              <div className="h-40 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={profileClicksData}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                    <Bar dataKey="value" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Bounce Rate */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-sm font-normal text-gray-500">Bounce Rate</h3>
                  <div className="flex items-center mt-1">
                    <p className="text-2xl font-semibold">25%</p>
                    <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded">+1%</span>
                  </div>
                </div>
                <button className="text-xs text-gray-400 hover:text-gray-600">Last 7 Days</button>
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
                  <h3 className="text-sm font-normal text-gray-500">Average Time From Lead Arrival to First Message</h3>
                  <div className="flex items-center mt-1">
                    <p className="text-2xl font-semibold">2h 15m</p>
                    <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded">+3%</span>
                  </div>
                </div>
                <button className="text-xs text-gray-400 hover:text-gray-600">Last 7 Days</button>
              </div>
              
              <div className="h-40 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={responseTimeData}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                    <Line type="monotone" dataKey="value" stroke="#4F46E5" strokeWidth={2} dot={false} activeDot={{ r: 6, fill: "#4F46E5" }} />
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
                  <h3 className="text-sm font-normal text-gray-500">Average Time From Lead Arrival to First Message</h3>
                  <div className="flex items-center mt-1">
                    <p className="text-2xl font-semibold">2h 15m</p>
                    <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded">+2%</span>
                  </div>
                </div>
                <button className="text-xs text-gray-400 hover:text-gray-600">Last 7 Days</button>
              </div>
              
              <div className="space-y-3 mt-4">
                {weekdayLeadTimeData.map((day) => (
                  <div key={day.name} className="flex items-center">
                    <span className="w-12 text-xs text-gray-600">{day.name}</span>
                    <div className="flex-1 ml-4">
                      <div className="h-4 bg-indigo-500 rounded" style={{ width: `${(day.value / 500) * 100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Profile View to Chat Conversion Rate - UPDATED with Gauge Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="text-sm font-normal text-gray-500">Profile View to Chat Conversion Rate</h3>
                  <div className="flex items-center mt-1">
                    <p className="text-2xl font-semibold">85%</p>
                    <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded">+2%</span>
                  </div>
                </div>
                <button className="text-xs text-gray-400 hover:text-gray-600">Last 7 Days</button>
              </div>
              
              {/* Custom Gauge Chart */}
              <GaugeChart value={85} totalViews={400} />
              
              {/* Indicators */}
              <div className="flex justify-center gap-6 mt-2">
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></span>
                  <span className="text-xs text-gray-600">Converted</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-gray-300 mr-2"></span>
                  <span className="text-xs text-gray-600">Not Converted</span>
                </div>
              </div>
            </div>
            
            {/* Last Post Published */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-sm font-normal text-gray-500">Last Post Published</h3>
                  <p className="text-xl font-semibold mt-2">April 23, 2025</p>
                </div>
                <span className="px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded">Blawg</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}