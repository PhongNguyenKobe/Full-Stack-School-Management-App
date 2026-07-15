import "dotenv/config";
import { PrismaClient, Day, UserSex } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function main() {
  // ADMIN
  await prisma.admin.create({ data: { userName: "admin1" } });
  await prisma.admin.create({ data: { userName: "admin2" } });

  // GRADE (Khối 6–9)
  for (let i = 6; i <= 9; i++) {
    await prisma.grade.create({ data: { level: i } });
  }

  // SUBJECT
  const subjectData = [
    { name: "Toán" },
    { name: "Ngữ văn" },
    { name: "Tiếng Anh" },
    { name: "Lịch sử" },
    { name: "Địa lý" },
    { name: "Vật lý" },
    { name: "Hóa học" },
    { name: "Sinh học" },
    { name: "Tin học" },
    { name: "Mỹ thuật" },
  ];
  for (const subject of subjectData) {
    await prisma.subject.create({ data: subject });
  }

  // CLASS + TEACHER (Lớp 6A–9A, mỗi lớp có 1 giáo viên chủ nhiệm)
  for (let i = 6; i <= 9; i++) {
    const teacher = await prisma.teacher.create({
      data: {
        userName: `gv${i}`,
        name: `GvName${i}`, 
        surname: `Chủ nhiệm ${i}A`, 
        email: `gv${i}@truonghoc.vn`,
        phone: `090${i}12345`,
        address: `Quận ${(i % 8) + 1}, TP.HCM`,
        bloodType: "A+",
        sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
        dateOfBirth: new Date(
        new Date().setFullYear(new Date().getFullYear() - (30 + i)) 
      ),
        subjects: {
          connect: [{ id: (i % subjectData.length) + 1 }], 
        },
      },
    });

    await prisma.class.create({
      data: {
        name: `${i}A`,
        gradeId: i - 5, // vì grade autoincrement từ 1
        capacity: Math.floor(Math.random() * (45 - 35 + 1)) + 35,
        supervisorId: teacher.id, // gán id của teacher vừa tạo
      },
    });
  }
  // TEACHER (thêm giáo viên khác)
  for (let i = 1; i <= 10; i++) {
    await prisma.teacher.create({
      data: {
        userName: `teacher${i}`,
        name: `GvName${i}`,
        surname: `Giáo viên ${i}`,
        email: `teacher${i}@truonghoc.vn`,
        phone: `091${i}54321`,
        address: `Quận ${(i % 8) + 1}, TP.HCM`,
        bloodType: "O+",
        sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
         dateOfBirth: new Date(
        new Date().setFullYear(new Date().getFullYear() - (28 + i)) // giáo viên ~28–38 tuổi
      ),
        subjects: {
          connect: [{ id: (i % subjectData.length) + 1 }],
        },
      },
    });
  }

  // PARENT
  for (let i = 1; i <= 20; i++) {
    await prisma.parent.create({
      data: {
        userName: `parent${i}`,
        name: `Phụ huynh`,
        surname: `PH${i}`,
        relation: i % 2 === 0 ? "Cha" : "Mẹ",
        email: `parent${i}@gmail.com`,
        phone: `098${i}67890`,
        address: `Quận ${(i % 8) + 1}, TP.HCM`,
        occupation: "Nhân viên văn phòng",
         dateOfBirth: new Date(
        new Date().setFullYear(new Date().getFullYear() - (29 + i)) // phụ huynh ~35–55 tuổi
      ),
      },
    });
  }

 // STUDENT
const parents = await prisma.parent.findMany();
for (let i = 1; i <= 40; i++) {
  await prisma.student.create({
    data: {
      studentCode: `HS${i}`,
      userName: `student${i}`,
      name: `Nguyễn ${i}`,
      surname: `HS${i}`,
      dateOfBirth: new Date(
        new Date().setFullYear(new Date().getFullYear() - 13),
      ),
      email: `student${i}@truonghoc.vn`,
      phone: `093${i}12345`,
      address: `Quận ${(i % 8) + 1}, TP.HCM`,
      bloodType: "B+",
      sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
      parentId: parents[i % parents.length].id,
      gradeId: (i % 4) + 1,
      classId: (i % 4) + 1,
    },
  });
}


  // LESSON
  for (let i = 1; i <= 20; i++) {
    const teacher = await prisma.teacher.findFirst({
      where: { userName: `teacher${(i % 10) + 1}` },
    });
    await prisma.lesson.create({
      data: {
        name: `Bài giảng ${i}`,
        day: Day.MONDAY,
        startTime: new Date(),
        endTime: new Date(new Date().setHours(new Date().getHours() + 2)),
        subjectId: (i % subjectData.length) + 1,
        classId: (i % 4) + 1,
        teacherId: teacher!.id,
      },
    });
  }

  // EXAM
  for (let i = 1; i <= 5; i++) {
    await prisma.exam.create({
      data: {
        title: `Kiểm tra ${i}`,
        startTime: new Date(),
        endTime: new Date(new Date().setHours(new Date().getHours() + 1)),
        lessonId: i,
      },
    });
  }

  // ASSIGNMENT
  for (let i = 1; i <= 5; i++) {
    await prisma.assignment.create({
      data: {
        title: `Bài tập ${i}`,
        startDate: new Date(),
        dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
        lessonId: i,
      },
    });
  }

  // ANNOUNCEMENT
  for (let i = 1; i <= 3; i++) {
    await prisma.announcement.create({
      data: {
        title: `Thông báo ${i}`,
        description: `Nội dung thông báo ${i}`,
        date: new Date(),
        classId: i,
      },
    });
  }

  // EVENT
  for (let i = 1; i <= 3; i++) {
    await prisma.event.create({
      data: {
        title: `Sự kiện ${i}`,
        description: `Mô tả sự kiện ${i}`,
        startTime: new Date(),
        endTime: new Date(new Date().setHours(new Date().getHours() + 3)),
        classId: i,
      },
    });
  }

  console.log("Seed dữ liệu khối 6–9 hoàn tất.");
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
