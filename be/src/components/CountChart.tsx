"use client";
import Image from "next/image";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
} from "recharts";

type CountChartProps = {
  boys: number;
  girls: number;
};

const CountChart = ({ boys, girls }: CountChartProps) => {
  const tong = boys + girls;
  const data = [
    { name: "Tổng", count: tong, fill: "white" },
    { name: "Nữ", count: girls, fill: "#F7C8D0" },
    { name: "Nam", count: boys, fill: "#A7C7E7" },
  ];

  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
     
      {/* BIỂU ĐỒ */}
      <div className="relative w-full h-[75%]">
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={32}
            data={data}
          >
            <RadialBar background dataKey="count" />
          </RadialBarChart>
        </ResponsiveContainer>
        <Image
          src="/maleFemale2.png"
          alt="Nam Nữ"
          width={50}
          height={50}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>
      {/* THỐNG KÊ */}
      <div className="flex justify-center gap-16">
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 rounded-full" style={{ backgroundColor: "#A7C7E7" }} />
          <h1 className="font-bold">{boys}</h1>
          <h2 className="text-xs text-gray-300">
            Nam ({tong ? Math.round((boys / tong) * 100) : 0}%)
          </h2>
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 rounded-full" style={{ backgroundColor: "#F7C8D0" }} />
          <h1 className="font-bold">{girls}</h1>
          <h2 className="text-xs text-gray-300">
            Nữ ({tong ? Math.round((girls / tong) * 100) : 0}%)
          </h2>
        </div>
      </div>
    </div>
  );
};

export default CountChart;
