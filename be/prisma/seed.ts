import "dotenv/config";
import { PrismaClient, Day, UserSex } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function main() {
  // ADMIN
  await prisma.admin.create({ data: { id: "admin1", userName: "admin1" } });
  await prisma.admin.create({ data: { id: "admin2", userName: "admin2" } });

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

  // TEACHER + CLASS (chủ nhiệm lớp 6A–9A)
  for (let i = 6; i <= 9; i++) {
    const teacherId = `teacher${i}`;
    const subjectId = (i % subjectData.length) + 1;

    await prisma.teacher.create({
      data: {
        id: teacherId,
        userName: teacherId,
        name: `GVName${i}`,
        surname: `HoName${i}`,
        email: `${teacherId}@truonghoc.vn`,
        phone: `090${i}12345`,
        address: `Quận ${(i % 8) + 1}, TP.HCM`,
        bloodType: "A+",
        sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
        dateOfBirth: new Date("1990-01-01"),
        subjects: { connect: [{ id: subjectId }] },
      },
    });

    await prisma.class.create({
      data: {
        name: `${i}A`,
        gradeId: i - 5,
        capacity: 40,
        supervisorId: teacherId,
      },
    });
  }

  // TEACHER bộ môn (không gắn lớp)
  for (let i = 10; i <= 20; i++) {
    const teacherId = `teacher${i}`;
    const subjectId = (i % subjectData.length) + 1;
    await prisma.teacher.create({
      data: {
        id: teacherId,
        userName: teacherId,
        name: `GVName${i}`,
        surname: `HoName${i}`,
        email: `${teacherId}@truonghoc.vn`,
        phone: `091${i}54321`,
        address: `Quận ${(i % 8) + 1}, TP.HCM`,
        bloodType: "O+",
        sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
        dateOfBirth: new Date("1992-01-01"),
        subjects: { connect: [{ id: subjectId }] },
      },
    });
  }

  // PARENT
  for (let i = 1; i <= 20; i++) {
    const parentId = `parent${i}`;
    await prisma.parent.create({
      data: {
        id: parentId,
        userName: parentId,
        name: `ParentName${i}`,
        surname: `ParentSurname${i}`,
        relation: i % 2 === 0 ? "Cha" : "Mẹ",
        email: `${parentId}@gmail.com`,
        phone: `098${i}67890`,
        address: `Quận ${(i % 8) + 1}, TP.HCM`,
        occupation: "Nhân viên văn phòng",
        dateOfBirth: new Date("1985-01-01"),
      },
    });
  }

  // STUDENT
  const parents = await prisma.parent.findMany();
  const classes = await prisma.class.findMany();
  for (let i = 1; i <= 40; i++) {
    const studentId = `student${i}`;
    await prisma.student.create({
      data: {
        id: studentId,
        studentCode: `HS${i}`,
        userName: studentId,
        name: `StudentName${i}`,
        surname: `StudentSurname${i}`,
        dateOfBirth: new Date("2012-01-01"),
        email: `${studentId}@truonghoc.vn`,
        phone: `093${i}12345`,
        address: `Quận ${(i % 8) + 1}, TP.HCM`,
        bloodType: "B+",
        sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
        parentId: parents[i % parents.length].id,
        gradeId: (i % 4) + 1,
        classId: classes[i % classes.length].id,
      },
    });
  }

  // LESSON
  const extraTeachers = await prisma.teacher.findMany();
  for (let i = 0; i < 20; i++) {
    const teacher = extraTeachers[i % extraTeachers.length];
    const subjectId = (i % subjectData.length) + 1;
    await prisma.lesson.create({
      data: {
        name: `Bài giảng ${i + 1}`,
        day: Day.MONDAY,
        startTime: new Date(),
        endTime: new Date(new Date().setHours(new Date().getHours() + 2)),
        subjectId,
        classId: classes[i % classes.length].id,
        teacherId: teacher.id,
      },
    });
  }

  // EXAM
  const lessons = await prisma.lesson.findMany();
  for (let i = 0; i < 5; i++) {
    await prisma.exam.create({
      data: {
        title: `Kiểm tra ${i + 1}`,
        startTime: new Date(),
        endTime: new Date(new Date().setHours(new Date().getHours() + 1)),
        lessonId: lessons[i].id,
      },
    });
  }

  // ASSIGNMENT
  for (let i = 0; i < 5; i++) {
    await prisma.assignment.create({
      data: {
        title: `Bài tập ${i + 1}`,
        startDate: new Date(),
        dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
        lessonId: lessons[i].id,
      },
    });
  }

  // RESULT cho exam
  const exams = await prisma.exam.findMany();
  const students = await prisma.student.findMany();
  for (let i = 0; i < exams.length; i++) {
    const exam = exams[i];
    for (let j = 0; j < 5; j++) {
      const student = students[(i * 5 + j) % students.length];
      await prisma.result.create({
        data: {
          score: Math.floor(Math.random() * 10) + 1,
          studentId: student.id,
          examId: exam.id,
        },
      });
    }
  }

  // RESULT cho assignment
  const assignments = await prisma.assignment.findMany();
  for (let i = 0; i < assignments.length; i++) {
    const assignment = assignments[i];
    for (let j = 0; j < 5; j++) {
      const student = students[(i * 5 + j) % students.length];
      await prisma.result.create({
        data: {
          score: Math.floor(Math.random() * 10) + 1,
          studentId: student.id,
          assignmentId: assignment.id,
        },
      });
    }
  }

  // ANNOUNCEMENT
  for (let i = 0; i < 3; i++) {
    await prisma.announcement.create({
      data: {
        title: `Thông báo ${i + 1}`,
        description: `Nội dung thông báo ${i + 1}`,
        date: new Date(),
        classId: classes[i].id,
      },
    });
  }

  // EVENT
  for (let i = 0; i < 3; i++) {
    await prisma.event.create({
      data: {
        title: `Sự kiện ${i + 1}`,
        description: `Mô tả sự kiện ${i + 1}`,
        startTime: new Date(),
        endTime: new Date(new Date().setHours(new Date().getHours() + 3)),
        classId: classes[i].id,
      },
    });
  }

  console.log("Seed dữ liệu hoàn tất.");
}
main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
