import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Prisma } from "@prisma/client";
import Image from "next/image";

type ResultList = {
  id: number;
  title: string;
  subjectName: string;
  studentName: string;
  studentSurname: string;
  teacherName: string;
  teacherSurname: string;
  score: number;
  className: string;
  startTime: Date;
  type: "exam" | "assignment";
};

const ResultListPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const params = await searchParams;
  const { page, ...queryParams } = params;
  const p = page ? parseInt(page) : 1;

  const role = "admin";

  const columns = [
    { header: "Tiêu đề", accessor: "title" },
    { header: "Loại", accessor: "type" },
    { header: "Môn học", accessor: "subject" },
    { header: "Học sinh", accessor: "student" },
    { header: "Điểm số", accessor: "score", className: "hidden md:table-cell" },
    { header: "Giáo viên", accessor: "teacher", className: "hidden md:table-cell" },
    { header: "Lớp", accessor: "class", className: "hidden md:table-cell" },
    { header: "Ngày", accessor: "date", className: "hidden md:table-cell" },
    ...(role === "admin" || role === "teacher"
      ? [{ header: "Thao tác", accessor: "action" }]
      : []),
  ];

  const renderRow = (item: ResultList) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
      <td className="flex items-center gap-4 p-4">{item.title}</td>
      <td>{item.type === "exam" ? "Exam" : "Assignment"}</td>
      <td>{item.subjectName}</td>
      <td>{item.studentSurname} {item.studentName}</td>
      <td className="hidden md:table-cell">{item.score}</td>
      <td className="hidden md:table-cell">{item.teacherSurname} {item.teacherName}</td>
      <td className="hidden md:table-cell">{item.className}</td>
      <td className="hidden md:table-cell">
        {new Intl.DateTimeFormat("vi-VN").format(item.startTime)}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {(role === "admin" || role === "teacher") && (
            <>
              <FormModal table="result" type="update" data={item} />
              <FormModal table="result" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  // URL PARAMS CONDITION
  const query: Prisma.ResultWhereInput = {};
  for (const [key, value] of Object.entries(queryParams)) {
    if (value !== undefined) {
      switch (key) {
        case "studentId":
          query.studentId = value;
          break;
        case "search": {
          const orConditions: Prisma.ResultWhereInput[] = [
            { exam: { title: { contains: value, mode: "insensitive" } } },
            { assignment: { title: { contains: value, mode: "insensitive" } } },
            { exam: { lesson: { subject: { name: { contains: value, mode: "insensitive" } } } } },
            { assignment: { lesson: { subject: { name: { contains: value, mode: "insensitive" } } } } },
            { student: { name: { contains: value, mode: "insensitive" } } },
            { student: { surname: { contains: value, mode: "insensitive" } } },
            { exam: { lesson: { teacher: { name: { contains: value, mode: "insensitive" } } } } },
            { exam: { lesson: { teacher: { surname: { contains: value, mode: "insensitive" } } } } },
            { assignment: { lesson: { teacher: { name: { contains: value, mode: "insensitive" } } } } },
            { assignment: { lesson: { teacher: { surname: { contains: value, mode: "insensitive" } } } } },
            { exam: { lesson: { class: { name: { contains: value, mode: "insensitive" } } } } },
            { assignment: { lesson: { class: { name: { contains: value, mode: "insensitive" } } } } },
          ];

          // Nếu value parse được thành số thì thêm điều kiện score
          const parsedScore = Number(value);
          if (!isNaN(parsedScore)) {
            orConditions.push({ score: { equals: parsedScore } });
          }

          // Nếu value parse được thành ngày hợp lệ thì thêm điều kiện date
          const parsedDate = new Date(value);
          if (!isNaN(parsedDate.getTime())) {
            orConditions.push({ exam: { startTime: { equals: parsedDate } } });
            orConditions.push({ assignment: { startDate: { equals: parsedDate } } });
          }

          query.OR = orConditions;
          break;
        }
        default:
          break;
      }
    }
  }

  const [dataRes, count] = await prisma.$transaction([
    prisma.result.findMany({
      where: query,
      include: {
        student: { select: { name: true, surname: true } },
        exam: {
          include: {
            lesson: {
              select: {
                subject: { select: { name: true } },
                class: { select: { name: true } },
                teacher: { select: { name: true, surname: true } },
              },
            },
          },
        },
        assignment: {
          include: {
            lesson: {
              select: {
                subject: { select: { name: true } },
                class: { select: { name: true } },
                teacher: { select: { name: true, surname: true } },
              },
            },
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.result.count({ where: query }),
  ]);

  const data = dataRes.map((item) => {
    const assessment = item.exam || item.assignment;
    if (!assessment) return null;

    const isExam = "startTime" in assessment;

    return {
      id: item.id,
      title: assessment.title,
      subjectName: assessment.lesson.subject.name,
      studentName: item.student.name,
      studentSurname: item.student.surname,
      teacherName: assessment.lesson.teacher.name,
      teacherSurname: assessment.lesson.teacher.surname,
      score: item.score,
      className: assessment.lesson.class.name,
      startTime: isExam ? assessment.startTime : assessment.startDate,
      type: isExam ? "exam" : "assignment",
    };
  }).filter(Boolean) as ResultList[];

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Danh sách kết quả</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="Lọc" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="Sắp xếp" width={14} height={14} />
            </button>
            {(role === "admin" || role === "teacher") && (
              <FormModal table="result" type="create" />
            )}
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

export default ResultListPage;
