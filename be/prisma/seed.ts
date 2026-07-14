import { Day, PrismaClient, UserSex } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // ADMIN
  await prisma.admin.create({
    data: {
      userName: "admin1",
    },
  });
  await prisma.admin.create({
    data: {
      userName: "admin2",
    },
  });

  // GRADE (Khối 6–9)
  for (let i = 6; i <= 9; i++) {
    await prisma.grade.create({
      data: {
        level: i,
      },
    });
  }

  // CLASS (Lớp 6A–9A)
  for (let i = 6; i <= 9; i++) {
    await prisma.class.create({
      data: {
        name: `${i}A`,
        gradeId: i - 5, // vì grade autoincrement từ 1
        capacity: Math.floor(Math.random() * (45 - 35 + 1)) + 35,
        supervisor: {
          create: {
            userName: `gv${i}`,
            name: `Nguyễn Văn`,
            surname: `Giáo viên ${i}`,
            email: `gv${i}@truonghoc.vn`,
            phone: `090${i}12345`,
            address: `Quận ${i}, TP.HCM`,
            bloodType: "A+",
            sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
          },
        },
      },
    });
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

  // TEACHER
  for (let i = 1; i <= 10; i++) {
    await prisma.teacher.create({
      data: {
        userName: `teacher${i}`,
        name: `Trần Văn`,
        surname: `GV${i}`,
        email: `teacher${i}@truonghoc.vn`,
        phone: `091${i}54321`,
        address: `Quận ${i}, TP.HCM`,
        bloodType: "O+",
        sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
        majorSubject: subjectData[i % subjectData.length].name,
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
        address: `Quận ${i}, TP.HCM`,
        occupation: "Nhân viên văn phòng",
      },
    });
  }

  // STUDENT
  for (let i = 1; i <= 40; i++) {
    await prisma.student.create({
      data: {
        studentCode: `HS${i}`,
        userName: `student${i}`,
        name: `Nguyễn`,
        surname: `HS${i}`,
        dateOfBirth: new Date(new Date().setFullYear(new Date().getFullYear() - 13)),
        email: `student${i}@truonghoc.vn`,
        phone: `093${i}12345`,
        address: `Quận ${i}, TP.HCM`,
        bloodType: "B+",
        sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
        parentId: (i % 20 + 1).toString(),
        gradeId: (i % 4) + 1, // chỉ khối 6–9
        classId: (i % 4) + 1,
      },
    });
  }

  // LESSON
  for (let i = 1; i <= 20; i++) {
    await prisma.lesson.create({
      data: {
        name: `Bài giảng ${i}`,
        day: Day.MONDAY,
        startTime: new Date(),
        endTime: new Date(new Date().setHours(new Date().getHours() + 2)),
        subjectId: (i % subjectData.length) + 1,
        classId: (i % 4) + 1,
        teacherId: (await prisma.teacher.findFirst({ where: { userName: `teacher${(i % 10) + 1}` } }))!.id,
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
