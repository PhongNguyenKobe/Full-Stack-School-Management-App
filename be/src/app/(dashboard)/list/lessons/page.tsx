import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role } from "@/lib/data";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import Image from "next/image";
import { Lesson, Class, Teacher, Subject, Prisma } from "@prisma/client";

type LessonList = Lesson & { subject: Subject; class: Class; teacher: Teacher };

const columns = [
  { header: "Tên bài học", accessor: "name" },
  { header: "Môn học", accessor: "subject" },
  { header: "Lớp", accessor: "class" },
  { header: "Giáo viên", accessor: "teacher", className: "hidden md:table-cell" },
  { header: "Thao tác", accessor: "action" },
];

const LessonListPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const params = await searchParams;
  const { page, teacherId, classId, search } = params;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.LessonWhereInput = {};

  // lọc theo giáo viên
  if (teacherId) {
    query.teacherId = { equals: teacherId }; // nếu teacherId là String (UUID)
    // hoặc: query.teacherId = { equals: parseInt(teacherId) }; // nếu teacherId là Int
  }

  // lọc theo lớp
  if (classId) {
    query.classId = { equals: parseInt(classId) }; // nếu classId là Int
    // hoặc: query.classId = { equals: classId };   // nếu classId là String
  }

  // lọc thêm theo tên bài, môn học, lớp hoặc giáo viên nếu có search
  if (search) {
    query.OR = [
      { name: { contains: search, mode: "insensitive" } }, // tên bài giảng
      { subject: { name: { contains: search, mode: "insensitive" } } }, // tên môn học
      { class: { name: { contains: search, mode: "insensitive" } } }, // tên lớp
      { teacher: { name: { contains: search, mode: "insensitive" } } }, // tên giáo viên
    ];
  }

  const [data, count] = await prisma.$transaction([
    prisma.lesson.findMany({
      where: query,
      include: {
        subject: { select: { name: true } },
        class: true,
        teacher: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.lesson.count({ where: query }),
  ]);

  const renderRow = (item: LessonList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.name}</td>
      <td>{item.subject?.name}</td>
      <td>{item.class?.name}</td>
      <td className="hidden md:table-cell">{item.teacher?.name}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormModal table="lesson" type="update" data={item} />
              <FormModal table="lesson" type="delete" id={item.id} />
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
        <h1 className="hidden md:block text-lg font-semibold">Danh sách bài học</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="Lọc" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="Sắp xếp" width={14} height={14} />
            </button>
            {role === "admin" && <FormModal table="lesson" type="create" />}
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

export default LessonListPage;
