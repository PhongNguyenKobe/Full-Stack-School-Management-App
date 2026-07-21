import { z } from "zod";

export const subjectSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Vui lòng nhập tên môn học" }),
  teachers: z.array(z.string()), // id giáo viên
});

export type SubjectSchema = z.infer<typeof subjectSchema>;

export const classSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Vui lòng nhập tên lớp" }),
  capacity: z.coerce.number().min(1, { message: "Hãy nhập sĩ số của lớp" }),
  gradeId: z.coerce.number().min(1, { message: "Bạn cần chọn khối cho lớp" }),
  supervisorId: z.coerce.string().optional(),
});

export type ClassSchema = z.infer<typeof classSchema>;

export const teacherSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Tên đăng nhập cần ít nhất 3 ký tự" })
    .max(20, { message: "Tên đăng nhập không được quá 20 ký tự" }),
  password: z
    .string()
    .min(8, { message: "Mật khẩu cần ít nhất 8 ký tự" })
    .optional()
    .or(z.literal("")),
  name: z.string().min(1, { message: "Vui lòng nhập tên" }),
  surname: z.string().min(1, { message: "Vui lòng nhập họ" }),
  email: z
    .string()
    .email({ message: "Địa chỉ email chưa đúng định dạng" })
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  address: z.string(),
  img: z.string().optional(),
  bloodType: z.string().min(1, { message: "Bạn chưa chọn nhóm máu" }),
  birthday: z.coerce.date({ message: "Vui lòng chọn ngày sinh" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Bạn chưa chọn giới tính" }),
  subjects: z.array(z.string()).optional(), // id môn học
});

export type TeacherSchema = z.infer<typeof teacherSchema>;

export const studentSchema = z.object({
  id: z.string().optional(),
  studentCode: z.string().min(1, { message: "Mã số học sinh là bắt buộc!" }), 
  username: z
    .string()
    .min(3, { message: "Tên đăng nhập cần ít nhất 3 ký tự" })
    .max(20, { message: "Tên đăng nhập không được quá 20 ký tự" }),
  password: z
    .string()
    .min(8, { message: "Mật khẩu cần ít nhất 8 ký tự" })
    .optional()
    .or(z.literal("")),
  name: z.string().min(1, { message: "Vui lòng nhập tên" }),
  surname: z.string().min(1, { message: "Vui lòng nhập họ" }),
  email: z
    .string()
    .email({ message: "Địa chỉ email chưa đúng định dạng" })
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  address: z.string(),
  img: z.string().optional(),
  bloodType: z.string().min(1, { message: "Bạn chưa chọn nhóm máu" }),
  birthday: z.coerce.date({ message: "Vui lòng chọn ngày sinh" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Bạn chưa chọn giới tính" }),
  gradeId: z.coerce.number().min(1, { message: "Vui lòng chọn khối" }),
  classId: z.coerce.number().min(1, { message: "Vui lòng chọn lớp" }),
  parentId: z.string().min(1, { message: "Bạn cần nhập thông tin phụ huynh" }),
});

export type StudentSchema = z.infer<typeof studentSchema>;

export const examSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Vui lòng nhập tiêu đề kỳ thi" }),
  startTime: z.coerce.date({ message: "Hãy chọn thời gian bắt đầu" }),
  endTime: z.coerce.date({ message: "Hãy chọn thời gian kết thúc" }),
  lessonId: z.coerce.number({ message: "Bạn cần chọn bài học cho kỳ thi" }),
});

export type ExamSchema = z.infer<typeof examSchema>;
