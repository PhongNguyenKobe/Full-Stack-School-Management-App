"use client";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { useRouter } from "next/navigation";

const Pagination = ({ page, count }: { page: number; count: number }) => {
  const router = useRouter();
  const totalPages = Math.ceil(count / ITEM_PER_PAGE);

  const changePage = (newPage: number) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("page", newPage.toString());
    router.push(`${window.location.pathname}?${searchParams.toString()}`);
  };

  return (
    <div className="p-4 flex items-center justify-between text-gray-500">
      {/* Prev */}
      <button
        disabled={page <= 1}
        onClick={() => changePage(page - 1)}
        className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Prev
      </button>

      {/* Page numbers */}
      <div className="flex items-center gap-2 text-sm">
        {Array.from({ length: totalPages }, (_, index) => {
          const pageIndex = index + 1;
          return (
            <button
              key={pageIndex}
              onClick={() => changePage(pageIndex)}
              className={`px-2 rounded-sm ${
                page === pageIndex ? "bg-lamaSky text-black" : "bg-slate-200"
              }`}
            >
              {pageIndex}
            </button>
          );
        })}
      </div>

      {/* Next */}
      <button
        disabled={page >= totalPages}
        onClick={() => changePage(page + 1)}
        className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
