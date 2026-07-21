"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import Image from "next/image";

const schema = z.object({
  username: z
    .string()
    .min(3, { message: "Tên đăng nhập phải có ít nhất 3 ký tự!" })
    .max(20, { message: "Tên đăng nhập tối đa 20 ký tự!" }),
  email: z.string().email({ message: "Email không hợp lệ!" }),
  password: z
    .string()
    .min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự!" }),
  firstName: z.string().min(1, { message: "Họ là bắt buộc!" }),
  lastName: z.string().min(1, { message: "Tên là bắt buộc!" }),
  phone: z.string().min(1, { message: "Số điện thoại là bắt buộc!" }),
  address: z.string().min(1, { message: "Địa chỉ là bắt buộc!" }),
  bloodType: z.string().min(1, { message: "Nhóm máu là bắt buộc!" }),
  // birthday: dùng string, sau đó có thể parse sang Date nếu cần
  birthday: z.string().min(1, { message: "Ngày sinh là bắt buộc!" }),
  sex: z.enum(["male", "female"], { message: "Giới tính là bắt buộc!" }),
  // img optional
  img: z
    .any()
    .optional(),
});


type Inputs = z.infer<typeof schema>;

const StudentForm = ({
  type,
  data,
}: {
  type: "create" | "update";
  data?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Thêm học sinh mới" : "Cập nhật thông tin học sinh"}
      </h1>

      <span className="text-xs text-gray-400 font-medium">
        Thông tin đăng nhập
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Tên đăng nhập"
          name="username"
          defaultValue={data?.username}
          register={register}
          error={errors?.username}
        />
        <InputField
          label="Email"
          name="email"
          defaultValue={data?.email}
          register={register}
          error={errors?.email}
        />
        <InputField
          label="Mật khẩu"
          name="password"
          type="password"
          defaultValue={data?.password}
          register={register}
          error={errors?.password}
        />
      </div>

      <span className="text-xs text-gray-400 font-medium">
        Thông tin cá nhân
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Họ"
          name="firstName"
          defaultValue={data?.firstName}
          register={register}
          error={errors.firstName}
        />
        <InputField
          label="Tên"
          name="lastName"
          defaultValue={data?.lastName}
          register={register}
          error={errors.lastName}
        />
        <InputField
          label="Số điện thoại"
          name="phone"
          defaultValue={data?.phone}
          register={register}
          error={errors.phone}
        />
        <InputField
          label="Địa chỉ"
          name="address"
          defaultValue={data?.address}
          register={register}
          error={errors.address}
        />
        <InputField
          label="Nhóm máu"
          name="bloodType"
          defaultValue={data?.bloodType}
          register={register}
          error={errors.bloodType}
        />
        <InputField
          label="Ngày sinh"
          name="birthday"
          defaultValue={data?.birthday}
          register={register}
          error={errors.birthday}
          type="date"
        />

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Giới tính</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("sex")}
            defaultValue={data?.sex}
          >
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
          </select>
          {errors.sex?.message && (
            <p className="text-xs text-red-400">
              {errors.sex.message.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4 justify-center">
          <label
            className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
            htmlFor="img"
          >
            <Image src="/upload.png" alt="" width={28} height={28} />
            <span>Tải ảnh lên</span>
          </label>
          <input type="file" id="img" {...register("img")} className="hidden" />
          {errors.img?.message && (
            <p className="text-xs text-red-400">
              {errors.img.message.toString()}
            </p>
          )}
        </div>
      </div>

      <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition">
        {type === "create" ? "Tạo mới" : "Cập nhật"}
      </button>
    </form>
  );
};

export default StudentForm;
