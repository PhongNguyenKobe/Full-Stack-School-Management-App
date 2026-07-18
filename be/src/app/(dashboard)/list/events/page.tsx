import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Prisma } from "@prisma/client";
import Image from "next/image";

type EventList = {
  id: number;
  title: string;
  className: string | null;
  startTime: Date;
  endTime: Date;
  description: string | null;
};

const EventListPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const params = await searchParams;
  const { page, ...queryParams } = params;
  const p = page ? parseInt(page) : 1;

  const role = "admin"; // tạm thời cố định

  const columns = [
    { header: "Tiêu đề", accessor: "title" },
    { header: "Lớp", accessor: "class" },
    { header: "Ngày", accessor: "date", className: "hidden md:table-cell" },
    { header: "Bắt đầu", accessor: "startTime", className: "hidden md:table-cell" },
    { header: "Kết thúc", accessor: "endTime", className: "hidden md:table-cell" },
    ...(role === "admin"
      ? [{ header: "Thao tác", accessor: "action" }]
      : []),
  ];

  const renderRow = (item: EventList) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
      <td className="flex items-center gap-4 p-4">{item.title}</td>
      <td>{item.className || "-"}</td>
      <td className="hidden md:table-cell">
        {new Intl.DateTimeFormat("vi-VN").format(item.startTime)}
      </td>
      <td className="hidden md:table-cell">
        {item.startTime.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}
      </td>
      <td className="hidden md:table-cell">
        {item.endTime.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormModal table="event" type="update" data={item} />
              <FormModal table="event" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  // URL PARAMS CONDITION
  const query: Prisma.EventWhereInput = {};
  for (const [key, value] of Object.entries(queryParams)) {
    if (value !== undefined) {
      switch (key) {
        case "search": {
          const orConditions: Prisma.EventWhereInput[] = [
            { title: { contains: value, mode: "insensitive" } },
            { description: { contains: value, mode: "insensitive" } },
            { class: { name: { contains: value, mode: "insensitive" } } },
          ];

          // Nếu value parse được thành ngày hợp lệ thì thêm điều kiện date
          const parsedDate = new Date(value);
          if (!isNaN(parsedDate.getTime())) {
            orConditions.push({ startTime: { equals: parsedDate } });
            orConditions.push({ endTime: { equals: parsedDate } });
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
    prisma.event.findMany({
      where: query,
      include: { class: true },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.event.count({ where: query }),
  ]);

  const data = dataRes.map((item) => ({
    id: item.id,
    title: item.title,
    className: item.class?.name || null,
    startTime: item.startTime,
    endTime: item.endTime,
    description: item.description,
  }));

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Danh sách sự kiện</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="Lọc" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="Sắp xếp" width={14} height={14} />
            </button>
            {role === "admin" && <FormModal table="event" type="create" />}
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

export default EventListPage;
