import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

export default function SalonFunnel() {
  const salonData = [
    { stage: 'Page Views', value: 8000, color: '#f0e9ff' },
    { stage: 'Bookings', value: 1200, color: '#c5a3ff' },
    { stage: 'Completed', value: 850, color: '#8e44ff' }
  ];

  const getConversionRates = () => {
    const rates = [];
    for (let i = 1; i < salonData.length; i++) {
      const prev = salonData[i - 1];
      const curr = salonData[i];
      const rate = ((curr.value / prev.value) * 100).toFixed(1);
      rates.push({
        from: prev.stage,
        to: curr.stage,
        rate: `${rate}%`
      });
    }
    return rates;
  };

  const conversionRates = getConversionRates();

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { stage, value } = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 shadow rounded text-sm">
          <p className="font-semibold text-gray-800">{stage}</p>
          <p className="text-purple-600 font-bold">{value.toLocaleString()} users</p>
          {stage !== 'Page Views' && (
            <p className="text-gray-500">
              {conversionRates.find(r => r.to === stage)?.rate} from previous
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Salon Booking Funnel</h2>
        <span className="text-sm text-gray-500">May 2025</span>
      </div>

      {/* Stat Summary */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        {salonData.map(item => (
          <div key={item.stage} className="text-center">
            <div className="text-sm text-gray-600">{item.stage}</div>
            <div className="text-2xl font-bold text-gray-900">{item.value.toLocaleString()}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={salonData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorFunnel" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8e44ff" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#c5a3ff" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <XAxis dataKey="stage" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#8e44ff"
              fill="url(#colorFunnel)"
              fillOpacity={1}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Conversion Rate Cards */}
      {/* <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Conversion Rates</h3>
        <div className="grid grid-cols-2 gap-4">
          {conversionRates.map((rate, idx) => (
            <div key={idx} className="bg-purple-50 text-center p-4 rounded">
              <div className="text-xs text-gray-600 mb-1">
                {rate.from} → {rate.to}
              </div>
              <div className="text-purple-700 text-lg font-semibold">{rate.rate}</div>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
}
