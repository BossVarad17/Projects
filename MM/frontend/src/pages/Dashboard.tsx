import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts'; // Removed unused imports
import { Gauge, Thermometer, Battery, Fuel, Zap, AlertCircle } from 'lucide-react';

// Define types for liveData and chartData
interface VehicleData {
  rpm: number;
  speed: number;
  coolantTemp: number;
  batteryVoltage: number;
  fuelLevel: number;
  engineLoad: number;
  timestamp: number; // Assuming timestamp is a number
}

interface ChartDataItem {
  time: string;
  rpm: number;
  temp: number;
}

// Function to fetch data from the backend
const fetchVehicleData = async (): Promise<VehicleData | null> => { // Added return type
  try {
    const response = await fetch('http://localhost:8000/vehicle-data'); // Corrected endpoint
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: VehicleData = await response.json(); // Cast to VehicleData type
    return data;
  } catch (error) {
    console.error("Error fetching vehicle data:", error);
    return null;
  }
};

export function Dashboard() {
  const [liveData, setLiveData] = useState<VehicleData | {}>({}); // Added type
  const [chartData, setChartData] = useState<ChartDataItem[]>([]); // Added type

  useEffect(() => {
    const interval = setInterval(async () => {
      const newData = await fetchVehicleData();
      if (newData) {
        setLiveData(newData);

        setChartData(prev => {
          const updated = [...prev, {
            time: new Date().toLocaleTimeString(),
            rpm: newData.rpm,
            temp: newData.coolantTemp
          }];
          return updated.slice(-20); // Keep last 20 points
        });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Added type assertion to liveData to access properties safely after initial empty state
  const currentLiveData = liveData as VehicleData;

  const gaugeData = [
    { icon: Gauge, label: 'RPM', value: currentLiveData.rpm || 0, unit: '', color: 'text-blue-400', max: 6000 },
    { icon: Zap, label: 'Speed', value: currentLiveData.speed || 0, unit: 'mph', color: 'text-green-400', max: 120 },
    { icon: Thermometer, label: 'Coolant', value: currentLiveData.coolantTemp || 0, unit: '°F', color: 'text-orange-400', max: 220 },
    { icon: Battery, label: 'Battery', value: currentLiveData.batteryVoltage || 0, unit: 'V', color: 'text-purple-400', max: 15 },
    { icon: Fuel, label: 'Fuel', value: currentLiveData.fuelLevel || 0, unit: '%', color: 'text-yellow-400', max: 100 },
    { icon: AlertCircle, label: 'Engine Load', value: currentLiveData.engineLoad || 0, unit: '%', color: 'text-red-400', max: 100 },
  ];

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Live Dashboard</h1>
          <p className="text-gray-400">Real-time vehicle sensor data and performance metrics</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-lg border border-gray-700">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-sm font-medium">Live Data</span>
        </div>
      </div>

      {/* Real-time Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gaugeData.map((gauge, index) => (
          <motion.div
            key={gauge.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <gauge.icon className={`w-6 h-6 ${gauge.color}`} />
                <span className="text-gray-300 font-medium">{gauge.label}</span>
              </div>
              <span className={`text-2xl font-bold ${gauge.color}`}>
                {gauge.value}{gauge.unit}
              </span>
            </div>

            <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r ${
                  gauge.color.includes('blue') ? 'from-blue-500 to-blue-400' :
                  gauge.color.includes('green') ? 'from-green-500 to-green-400' :
                  gauge.color.includes('orange') ? 'from-orange-500 to-orange-400' :
                  gauge.color.includes('purple') ? 'from-purple-500 to-purple-400' :
                  gauge.color.includes('yellow') ? 'from-yellow-500 to-yellow-400' :
                  'from-red-500 to-red-400'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${(gauge.value / gauge.max) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-900 p-6 rounded-xl border border-gray-800"
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Gauge className="w-5 h-5 text-blue-400" />
            Performance Trends
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Line
                  type="monotone"
                  dataKey="rpm"
                  stroke="#60a5fa"
                  strokeWidth={2}
                  dot={false}
                  name="RPM"
                />
                <Line
                  type="monotone"
                  dataKey="temp"
                  stroke="#fb923c"
                  strokeWidth={2}
                  dot={false}
                  name="Temperature"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-900 p-6 rounded-xl border border-gray-800"
        >
          <h3 className="text-xl font-semibold text-white mb-4">System Status</h3>
          <div className="space-y-4">
            {[
              { system: 'Engine', status: 'Optimal', color: 'text-green-400' },
              { system: 'Brake', status: 'Good', color: 'text-blue-400' },
              { system: 'Battery', status: 'Normal', color: 'text-yellow-400' },
              { system: 'Cooling', status: 'Optimal', color: 'text-green-400' },
            ].map((item, index) => (
              <motion.div
                key={item.system}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700"
              >
                <span className="text-gray-300 font-medium">{item.system}</span>
                <span className={`font-semibold ${item.color}`}>{item.status}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
