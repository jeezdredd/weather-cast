export function getTemperatureBackground(temp: number | null): string {
  if (temp === null) return "from-gray-400 to-gray-600";
  if (temp <= -20) return "from-blue-900 to-blue-700";
  if (temp <= -10) return "from-blue-700 to-blue-500";
  if (temp <= 0) return "from-blue-500 to-blue-300";
  if (temp <= 10) return "from-cyan-400 to-teal-400";
  if (temp <= 20) return "from-green-400 to-yellow-300";
  if (temp <= 30) return "from-yellow-300 to-orange-400";
  if (temp <= 40) return "from-orange-400 to-red-500";
  return "from-red-600 to-red-800";
}
