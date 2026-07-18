"use client";

import { SignIn } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const LoginPage = () => {
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    if (isSignedIn && user) {
      const role = user.publicMetadata.role;
      if (role) router.push(`/${role}`);
    }
  }, [isSignedIn, user, router]);

  return (
    <div className="h-screen flex flex-col md:flex-row bg-[#f8fafc]">
      {/* Left side: Branding */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-700 text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>

        <div className="flex items-center gap-3 z-10">
          <svg className="w-10 h-10 text-white fill-current" viewBox="0 0 24 24">
            <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
            <path d="M4.18 12.87l7.82 4.27 7.82-4.27v3.29c0 .76-.44 1.45-1.14 1.77L12 21.5l-6.86-3.34A2.003 2.003 0 014 16.39v-3.52h.18z" />
          </svg>
          <span className="text-2xl font-bold tracking-wider">SchoolP</span>
        </div>

        <div className="my-auto max-w-lg z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
            Hệ Thống Quản Lý <br />
            <span className="text-blue-200">SchoolP</span>
          </h1>
          <p className="text-lg text-blue-100 leading-relaxed">
            Chào mừng bạn đến với SchoolP. Nền tảng kết nối toàn diện giữa Nhà trường, Giáo viên, Học sinh và Phụ huynh, giúp tối ưu hóa quy trình quản lý và nâng cao hiệu quả giảng dạy.
          </p>
        </div>

        <div className="text-sm text-blue-200/80 z-10 flex items-center justify-between">
          <span>© 2026 PhongNguyen Dev</span>
          <span className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Điều khoản</a>
            <a href="#" className="hover:text-white transition-colors">Bảo mật</a>
          </span>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-100 relative">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Đăng Nhập</h2>
            <p className="text-slate-500 text-sm">Vui lòng nhập tài khoản để truy cập hệ thống</p>
          </div>
          
          <div className="flex justify-center w-full">
            <SignIn
              appearance={{
                elements: {
                  rootBox: "w-full flex justify-center",
                  cardBox: "shadow-none border-none p-0 m-0 w-full bg-transparent max-w-full overflow-visible",
                  card: "shadow-none border-none p-0 m-0 w-full bg-transparent overflow-visible",
                  header: "hidden",
                  formFieldLabel: "text-slate-700 font-medium text-sm mb-1.5 block w-full text-left",
                  formFieldInput:
                    "w-full border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg py-2 px-3 text-slate-800 bg-white block transition-colors",
                  formButtonPrimary:
                    "bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg py-2.5 transition-colors shadow-lg shadow-indigo-100 w-full",
                  footer: "hidden",
                  formFieldAction: "hidden",
                },
              }}
            />
          </div>

          {/* Forgot password link */}
          <div className="text-right mt-3">
            <button
              onClick={() => setShowHelp(true)}
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
            >
              Quên mật khẩu?
            </button>
          </div>

          {/* Popup hướng dẫn */}
          {showHelp && (
            <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-lg text-sm text-slate-700 animate-fadeIn">
              Nếu bạn quên mật khẩu, vui lòng liên hệ giáo viên hoặc quản trị viên để được cấp lại tài khoản.
              <button
                onClick={() => setShowHelp(false)}
                className="block mt-2 text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Đóng
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
