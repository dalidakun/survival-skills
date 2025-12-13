'use client';

import { useMemo, useState } from "react";
import Link from "next/link";
import type { SkillContent } from "@/lib/content";

type Props = {
  skills: SkillContent[];
  initialQuery?: string;
};

export default function SearchClient({ skills, initialQuery = "" }: Props) {
  const [query, setQuery] = useState(initialQuery);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return skills;
    return skills.filter((item) => {
      const haystack = [
        item.title,
        item.subtitle,
        item.intro,
        item.principle
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [query, skills]);

  // 获取今天的日期（年-月-日），用于显示"更新"标签
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <h1 className="font-display text-3xl text-slate-900">搜索技能</h1>
        <p className="text-slate-600 text-sm">
          输入关键词（标题、副标题或内容），实时筛选文章列表。
        </p>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="例如：火 / 净水 / 摩擦 / 煮沸"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-base outline-none ring-forest/20 focus:ring-2"
        />
      </div>

      <div className="space-y-2">
        {filtered.length > 0 ? (
          filtered.map((skill) => {
            // 判断是否是今天更新的
            let isToday = false;
            if (typeof skill.updatedAtMs === "number" && skill.updatedAtMs > 0) {
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
          })
        ) : (
          <div className="rounded-2xl bg-white p-6 text-slate-600 shadow-sm">
            没找到匹配的技能，换个关键词试试～
          </div>
        )}
      </div>
    </section>
  );
}

