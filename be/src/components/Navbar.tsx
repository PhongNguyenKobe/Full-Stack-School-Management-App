import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";

const roleMap: Record<string, string> = {
  admin: "Quản trị viên",
  teacher: "Giáo viên",
  student: "Học sinh",
  parent: "Phụ huynh",
};

const Navbar = async () => {
  const user = await currentUser();
  const role = user?.publicMetadata?.role as string;
  

  const fullName = user 
    ? `${user.lastName || ""} ${user.firstName || ""}`.trim() || user.username || "Người dùng"
    : "Khách";

  return (
    <div className="flex items-center justify-between p-4">
      {/* SEARCH BAR */}
      <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
        <Image src="/search.png" alt="" width={14} height={14} />
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="w-[200px] p-2 bg-transparent outline-none"
        />
      </div>

      {/* ICONS AND USER */}
      <div className="flex items-center gap-6 justify-end w-full">
        {/* Tin nhắn */}
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
          <Image src="/message.png" alt="" width={20} height={20} />
        </div>
        
        {/* Thông báo */}
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
          <Image src="/announcement.png" alt="" width={20} height={20} />
          <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">
            1
          </div>
        </div>

        {/* Thông tin tên và vai trò */}
        <div className="flex flex-col text-right">
          <span className="text-xs leading-3 font-medium text-gray-700">{fullName}</span>
          <span className="text-[10px] text-gray-500 mt-1">
            {roleMap[role] || "Khách"}
          </span>
        </div>

        <div className="flex items-center">
          <UserButton 
            appearance={{
              elements: {
                userButtonAvatarBox: "w-9 h-9", 
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;