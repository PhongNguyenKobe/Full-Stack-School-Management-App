import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role } from "@/lib/data";
import prisma from "@/lib/prisma";
import { Class, Subject, Teacher, Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { ITEM_PER_PAGE } from "@/lib/settings";

type TeacherList = Teacher & { subjects: Subject[] } & { classes: Class[] };

const sexMap: Record<string, string> = {
  MALE: "Nam",
  FEMALE: "Nữ",
};

const columns = [
  { header: "Thông tin", accessor: "info" },
  {
    header: "Mã giáo viên",
    accessor: "teacherId",
    className: "hidden md:table-cell",
  },
  {
    header: "Môn dạy",
    accessor: "subjects",
    className: "hidden md:table-cell",
  },
  {
    header: "Lớp phụ trách",
    accessor: "classes",
    className: "hidden md:table-cell",
  },
  {
    header: "Số điện thoại",
    accessor: "phone",
    className: "hidden lg:table-cell",
  },
  { header: "Địa chỉ", accessor: "address", className: "hidden lg:table-cell" },
  { header: "Giới tính", accessor: "sex", className: "hidden md:table-cell" },
  {
    header: "Ngày tạo",
    accessor: "createdAt",
    className: "hidden md:table-cell",
  },
  { header: "Thao tác", accessor: "action" },
];

const renderRow = (item: TeacherList) => (
  <tr
    key={item.id}
    className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
  >
    <td className="flex items-center gap-4 p-4">
      <Image
        src={item.img || "/noAvatar.png"}
        alt=""
        width={40}
        height={40}
        className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
      />
      <div className="flex flex-col">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-xs text-gray-500">{item?.email}</p>
      </div>
    </td>
    <td className="hidden md:table-cell">{item.userName}</td>
    <td className="hidden md:table-cell">
      {item.subjects.length > 0
        ? item.subjects.map((s) => s.name).join(", ")
        : "-"}
    </td>
    <td className="hidden md:table-cell">
      {item.classes.map((c) => c.name).join(", ")}
    </td>
    <td className="hidden md:table-cell">{item.phone}</td>
    <td className="hidden md:table-cell">{item.address}</td>
    <td className="hidden md:table-cell">{sexMap[item.sex]}</td>
    <td className="hidden md:table-cell">
      {new Date(item.createdAt).toLocaleDateString("vi-VN")}
    </td>
    <td>
      <div className="flex items-center gap-2">
        <Link href={`/list/teachers/${item.id}`}>
          <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
            <Image src="/view.png" alt="" width={16} height={16} />
          </button>
        </Link>
        {role === "admin" && (
          <FormModal table="teacher" type="delete" id={item.id} />
        )}
      </div>
    </td>
  </tr>
);

const TeacherListPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const params = await searchParams;
  const { page, ...queryParams } = params;
  const p = page ? parseInt(page) : 1;

  // Build điều kiện động từ URL params
  const query: Prisma.TeacherWhereInput = {};
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "classId": {
            const classId = parseInt(value);
            query.AND = [
              ...(Array.isArray(query.AND)
                ? query.AND
                : query.AND
                  ? [query.AND]
                  : []),
              {
                OR: [
                  { classes: { some: { id: classId } } },
                  { lessons: { some: { classId } } },
                ],
              },
            ];
            break;
          }
          // có thể thêm các case khác ở đây (vd: subjectId, sex, name)
          case "search":
            query.OR = [
              { name: { contains: value, mode: "insensitive" } },
              { userName: { contains: value, mode: "insensitive" } },
              { email: { contains: value, mode: "insensitive" } },
              { id: { contains: value, mode: "insensitive" } },
            ];
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.teacher.findMany({
      where: query,
      include: { subjects: true, classes: true },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.teacher.count({ where: query }),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          Danh sách giáo viên
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && <FormModal table="teacher" type="create" />}
          </div>
        </div>
      </div>
      <Table columns={columns} renderRow={renderRow} data={data} />
      <Pagination page={p} count={count} />
    </div>
  );
};

export default TeacherListPage;
