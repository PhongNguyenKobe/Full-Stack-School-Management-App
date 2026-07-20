import Image from "next/image";
import CountChart from "./CountChart";
import prisma from "@/lib/prisma";

const CountChartContainer = async () => {
  const data = await prisma.student.groupBy({
    by: ["sex"],
    _count: true,
  });

  const boys = data.find((d) => d.sex === "MALE")?._count || 0;
  const girls = data.find((d) => d.sex === "FEMALE")?._count || 0;

  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      {/* TIÊU ĐỀ */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Học sinh</h1>
        <Image src="/moreDark.png" alt="Thêm" width={20} height={20} />
      </div>
      {/* BIỂU ĐỒ */}
      <CountChart boys={boys} girls={girls} />
    </div>
  );
};

export default CountChartContainer;
