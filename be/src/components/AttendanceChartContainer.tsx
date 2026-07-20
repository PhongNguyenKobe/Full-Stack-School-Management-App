import Image from "next/image";
import AttendanceChart from "./AttendanceChart";
import prisma from "@/lib/prisma";

const AttendanceChartContainer = async () => {
  const today = new Date(); 
  // Lấy ngày hiện tại (ví dụ: xx/xx/2026)

  const dayOfWeek = today.getDay(); 
  // Lấy thứ trong tuần (0 = Chủ Nhật, 1 = Thứ Hai, ... 6 = Thứ Bảy)

  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  // Tính số ngày đã trôi qua kể từ thứ Hai gần nhất
  // Nếu hôm nay là Chủ Nhật (0) thì coi như đã qua 6 ngày từ thứ Hai
  // Nếu hôm nay là Thứ Ba (2) thì đã qua 1 ngày từ thứ Hai

  const lastMonday = new Date(today);
  lastMonday.setDate(today.getDate() - daysSinceMonday);
  // Tạo biến lastMonday = ngày thứ Hai gần nhất
  // Ví dụ hôm nay là Thứ Tư 22/07 thì lastMonday sẽ là 20/07 (Thứ Hai)

  const resData = await prisma.attendance.findMany({
    where: {
      date: {
        gte: lastMonday, 
        // Lọc dữ liệu attendance có ngày >= thứ Hai gần nhất
        // Tức là chỉ lấy dữ liệu từ đầu tuần đến hôm nay
      },
    },
    select: {
      date: true,    // Lấy cột ngày
      present: true, // Lấy cột có mặt/vắng mặt
    },
  });
  // Truy vấn dữ liệu điểm danh từ database bằng Prisma
  // Kết quả là mảng các bản ghi có {date, present}

//   console.log("Dữ liệu điểm danh tuần này:", resData);
  const daysOfWeek = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6"];

  const attendanceMap: { [key: string]: { present: number; absent: number } } =
    {
      "Thứ 2": { present: 0, absent: 0 },
      "Thứ 3": { present: 0, absent: 0 },
      "Thứ 4": { present: 0, absent: 0 },
      "Thứ 5": { present: 0, absent: 0 },
      "Thứ 6": { present: 0, absent: 0 },
    };

  resData.forEach((item) => {
    const itemDate = new Date(item.date);
    const dow = itemDate.getDay();
    if (dow >= 1 && dow <= 5) {
      const dayName = daysOfWeek[dow - 1];
      if (item.present) {
        attendanceMap[dayName].present += 1;
      } else {
        attendanceMap[dayName].absent += 1;
      }
    }
  });

  const data = daysOfWeek.map((day) => ({
    name: day,
    present: attendanceMap[day].present,
    absent: attendanceMap[day].absent,
  }));

  return (
    <div className="bg-white rounded-lg p-4 h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Điểm danh</h1>
        <Image src="/moreDark.png" alt="Thêm" width={20} height={20} />
      </div>
      <AttendanceChart data={data} />
    </div>
  );
};

export default AttendanceChartContainer;
