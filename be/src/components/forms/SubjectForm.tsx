"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { subjectSchema, SubjectSchema } from "@/lib/formValidationSchemas";
import { createSubject, updateSubject } from "@/lib/actions";
import { startTransition, useActionState } from "react";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const SubjectForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubjectSchema>({
    resolver: zodResolver(subjectSchema),
  });

  // Dùng useActionState để React tự truyền currentState
  const [state, formAction] = useActionState(
    type === "create" ? createSubject : updateSubject,
    {
      success: false,
      error: false,
    },
  );

  const onSubmit = handleSubmit((formData) => {
  startTransition(() => {
    formAction(formData);
  });
});


  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(
        `Môn học đã được ${type === "create" ? "tạo" : "cập nhật"} thành công!`,
      );
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { teachers = [] } = relatedData || {};

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Thêm môn học mới" : "Cập nhật môn học"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Tên môn học"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
        />
        {data && (
          <InputField
            label="Id"
            name="id"
            defaultValue={data?.id}
            register={register}
            error={errors?.id}
            className="hidden"
          />
        )}
       <div className="flex flex-col gap-2 w-full md:w-1/2">
  <label className="text-sm font-medium text-gray-700">Giáo viên</label>
  <select
    multiple
    className="border border-gray-300 rounded-lg p-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-400 hover:border-blue-400 transition"
    {...register("teachers")}
    defaultValue={data?.teachers}
  >
    {teachers.map(
      (teacher: { id: string; name: string; surname: string }) => (
        <option
          value={teacher.id}
          key={teacher.id}
          className="py-1 px-2 hover:bg-blue-100"
        >
          {teacher.surname} {teacher.name}
        </option>
      ),
    )}
  </select>
  {errors.teachers?.message && (
    <p className="text-xs text-red-500">{errors.teachers.message.toString()}</p>
  )}
  <p className="text-xs text-gray-400">
    Giữ Ctrl (Windows) hoặc Command (Mac) để chọn nhiều giáo viên
  </p>
</div>

      </div>

      {state.error && (
        <span className="text-red-500">Có lỗi xảy ra, vui lòng thử lại!</span>
      )}

      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Tạo" : "Cập nhật"}
      </button>
    </form>
  );
};

export default SubjectForm;
