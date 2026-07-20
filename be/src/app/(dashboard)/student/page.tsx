import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import EventCalendar from "@/components/EventCalendar";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

const StudentPage = async () => {
  const { userId } = await auth();

  // Find the student and their class
  const student = await prisma.student.findUnique({
    where: { id: userId! },
    include: { class: true },
  });

  const className = student?.class?.name || "Lớp học";

  return (
    <div className="p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Lịch học ({className})</h1>
          {student ? (
            <BigCalendarContainer type="classId" id={student.classId} />
          ) : (
            <div className="p-4 text-gray-500">Không tìm thấy thông tin học sinh</div>
          )}
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  );
};

export default StudentPage;
