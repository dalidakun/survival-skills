import Link from "next/link";
import { getAllSkills } from "@/lib/content";

const PAGE_SIZE = 50;

export default function HomePage({
  searchParams
}: {
  searchParams?: { page?: string };
}) {
  const skills = getAllSkills();

  const total = skills.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(
    totalPages,
    Math.max(1, Number(searchParams?.page) || 1)
  );
  const start = (currentPage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const visible = skills.slice(start, end);

  // 获取今天的日期（年-月-日），用于比较
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  return (
    <section className="space-y-2">
      {visible.map((skill) => {
        // 判断是否是今天更新的（比较日期部分，避免时区问题）
        let isToday = false;
        if (typeof skill.updatedAtMs === "number") {
          const updatedDate = new Date(skill.updatedAtMs);
          const updatedStr = `${updatedDate.getFullYear()}-${String(updatedDate.getMonth() + 1).padStart(2, '0')}-${String(updatedDate.getDate()).padStart(2, '0')}`;
          isToday = updatedStr === todayStr;
        }
        
        return (
          <Link
            key={skill.slug}
            href={skill.link || `/skills/${skill.slug}`}
            target={skill.link ? "_blank" : undefined}
            className="flex items-center gap-2 text-sm font-medium text-slate-700 transition hover:text-forest"
          >
            <span>{skill.title}</span>
            {isToday && (
              <span className="rounded-full bg-forest/10 px-2 py-0.5 text-[11px] font-semibold text-forest">
                更新
              </span>
            )}
          </Link>
        );
      })}

      {totalPages > 1 && (
        <div className="mt-4 flex flex-wrap gap-2 text-sm font-medium text-slate-700">
          {Array.from({ length: totalPages }, (_, idx) => {
            const page = idx + 1;
            const isActive = page === currentPage;
            return (
              <Link
                key={page}
                href={page === 1 ? "/" : `/?page=${page}`}
                className={`rounded-full px-3 py-1 ${
                  isActive
                    ? "bg-forest text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-forest/10 hover:text-forest"
                }`}
              >
                {page}
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}

