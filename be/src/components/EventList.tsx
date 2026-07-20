import prisma from "@/lib/prisma";

const EventList = async ({ dateParam }: { dateParam: string | undefined }) => {
  const date = dateParam ? new Date(dateParam) : new Date();

  const data = await prisma.event.findMany({
    where: {
      startTime: {
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lte: new Date(date.setHours(23, 59, 59, 999)),
      },
    },
  });

  return (
    <div className="flex flex-col gap-4">
      {data.map((event) => (
        <div
          className="relative pl-5 pr-5 py-4 rounded-2xl border-2 border-slate-100 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.01)] transition-all hover:shadow-[0_6px_16px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 active:scale-[0.99] overflow-hidden group"
          key={event.id}
        >
          <div className="absolute left-0 top-0 bottom-0 w-2 rounded-r-full odd:bg-lamaSky even:bg-lamaPurple bg-lamaSky group-odd:bg-lamaSky group-even:bg-lamaPurple" />
          
          <div className="flex items-center justify-between gap-4">
            <h1 className="font-bold text-slate-700 text-base group-hover:text-slate-900 transition-colors">
              {event.title}
            </h1>
            
            <span className="shrink-0 font-bold text-xs bg-slate-50 text-slate-500 border border-slate-100 px-2.5 py-1 rounded-xl flex items-center gap-1">
               {event.startTime.toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </span>
          </div>
          
          <p className="mt-2 text-slate-400 text-sm font-medium leading-relaxed line-clamp-2">
            {event.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default EventList;