import React from "react";

// data: [{ label, value, color? }], height optional
const MiniBarChart = ({ data = [], height = 140, barColor = "bg-blue-600" }) => {
  const maxValue = Math.max(1, ...data.map((d) => Number(d.value) || 0));
  const barWidth = data.length > 0 ? Math.floor(100 / (data.length * 1.8)) : 10;

  return (
    <div className="w-full">
      <div
        className="flex items-end justify-center gap-4"
        style={{ height }}
      >
        {data.map((d, idx) => {
          const h = Math.round(
            ((Number(d.value) || 0) / maxValue) * (height - 30)
          );

          return (
            <div
              key={idx}
              className="flex flex-col items-center justify-end group"
              style={{ width: `${barWidth}%` }}
            >
              {/* Bar */}
              <div
                className={`w-full ${d.color || barColor} rounded-md shadow-sm transition-all duration-500 ease-out group-hover:opacity-80`}
                style={{ height: `${h}px` }}
                title={`${d.label}: ${d.value}`}
              />

              {/* Label */}
              <div
                className="mt-2 text-[11px] sm:text-xs text-gray-600 truncate max-w-full text-center"
                title={d.label}
              >
                {d.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MiniBarChart;
