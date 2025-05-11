import { useState } from "react";

export default function LastBlog() {
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
          {/* Last Post Published */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-800">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg text-gray-600">Last Post Published</h3>
                <p className="text-xl font-semibold mt-2">April 23, 2025</p>
              </div>
              <span className="px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded">
                Blawg
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
