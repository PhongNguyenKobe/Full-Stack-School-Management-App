import prisma from "@/lib/prisma";
import Image from "next/image";

const colorMap: Record<string, string> = {
  admin: "bg-lamaYellow",   // Màu vàng nhạt đồng bộ phong cách pastel
  student: "bg-lamaPurple", // Giữ nguyên
  teacher: "bg-lamaOrange", // Giữ nguyên
  parent: "bg-lamaBlue",   // Giữ nguyên
};

const labelMap: Record<string, string> = {
  admin: "Quản trị viên",
  teacher: "Giáo viên",
  student: "Học sinh",
  parent: "Phụ huynh",
};

const UserCard = async ({
  type,
}: {
  type: "admin" | "teacher" | "student" | "parent";
}) => {
  const modelMap: Record<typeof type, any> = {
    admin: prisma.admin,
    teacher: prisma.teacher,
    student: prisma.student,
    parent: prisma.parent,
  };

  const data = await modelMap[type].count();

  return (
    <div className={`rounded-2xl ${colorMap[type]} p-4 flex-1 min-w-[130px]`}>
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
          2026/27
        </span>
        <Image src="/more.png" alt="" width={20} height={20} />
      </div>
      <h1 className="text-2xl font-semibold my-4">{data}</h1>
      <h2 className="text-sm font-medium text-gray-500">{labelMap[type]}</h2>
    </div>
  );
};

export default UserCard;