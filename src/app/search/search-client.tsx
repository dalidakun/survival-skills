'use client';

import { useMemo, useState } from "react";
import { SkillCard } from "@/components/SkillCard";
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

  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <h1 className="font-display text-3xl text-slate-900">搜索技能</h1>
        <p className="text-slate-600 text-sm">
          输入关键词（标题、副标题或内容），实时筛选下方卡片。
        </p>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="例如：火 / 净水 / 摩擦 / 煮沸"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-base outline-none ring-forest/20 focus:ring-2"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((skill) => (
          <SkillCard key={skill.slug} skill={skill} />
        ))}
        {filtered.length === 0 && (
          <div className="rounded-2xl bg-white p-6 text-slate-600 shadow-sm">
            没找到匹配的技能，换个关键词试试～
          </div>
        )}
      </div>
    </section>
  );
}

