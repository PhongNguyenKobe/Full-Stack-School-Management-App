import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role } from "@/lib/data";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import Image from "next/image";
import { Class, Teacher, Grade, Prisma } from "@prisma/client";

type ClassList = Class & { supervisor: Teacher; grade: Grade };

const columns = [
  { header: "Tên lớp", accessor: "name" },
  { header: "Sĩ số", accessor: "capacity", className: "hidden md:table-cell" },
  { header: "Khối", accessor: "grade", className: "hidden md:table-cell" },
  {
    header: "Giáo viên CN",
    accessor: "supervisor",
    className: "hidden md:table-cell",
  },
  { header: "Thao tác", accessor: "action" },
];

const ClassListPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const params = await searchParams;
  const { page, supervisorId, search } = params;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.ClassWhereInput = {};

  // lọc theo giáo viên chủ nhiệm
  if (supervisorId) {
    query.supervisorId = { equals: supervisorId };
  }

  // lọc thêm theo tên lớp hoặc giáo viên nếu có search
  if (search) {
    query.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { supervisor: { name: { contains: search, mode: "insensitive" } } },
      { supervisor: { surname: { contains: search, mode: "insensitive" } } },
    ];
  }

  const [data, count] = await prisma.$transaction([
    prisma.class.findMany({
      where: query,
      include: { grade: true, supervisor: true },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.class.count({ where: query }),
  ]);

  const renderRow = (item: ClassList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.name}</td>
      <td className="hidden md:table-cell">{item.capacity}</td>
      <td className="hidden md:table-cell">{item.grade?.level}</td>
      <td className="hidden md:table-cell">
        {item.supervisor ? item.supervisor.name : "-"}
      </td>

      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormModal table="class" type="update" data={item} />
              <FormModal table="class" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          Danh sách lớp học
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
            {role === "admin" && <FormModal table="class" type="create" />}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default ClassListPage;
