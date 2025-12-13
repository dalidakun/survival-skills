import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RichText } from "@/components/RichText";
import { SkillCard } from "@/components/SkillCard";
import { getAllSkills, getRelatedSkills, getSkill } from "@/lib/content";

type Props = {
  params: { slug: string };
};

// 改为动态生成，确保新文章能立即访问
export const dynamic = 'force-dynamic';

// 不再使用静态生成，改为动态路由
// export function generateStaticParams() {
//   return getAllSkills().map((skill) => ({ slug: skill.slug }));
// }

export function generateMetadata({ params }: Props) {
  const skill = getSkill(params.slug);
  return {
    title: skill ? `${skill.title} | 生存冒险课堂` : "技能详情"
  };
}

export default function SkillDetailPage({ params }: Props) {
  const skill = getSkill(params.slug);
  if (!skill) return notFound();

  const related = getRelatedSkills(skill.related);

  return (
    <article className="space-y-10">
      <div className="relative overflow-hidden rounded-3xl bg-white/80 shadow-lg ring-1 ring-white/50">
        <div className="relative h-72 w-full">
          <Image
            src={skill.image}
            alt={skill.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-3 rounded-2xl bg-white/90 p-4 backdrop-blur">
            <p className="badge w-fit bg-forest/10 text-forest">冒险技能</p>
            <h1 className="font-display text-3xl text-slate-900">
              {skill.title}
            </h1>
            <p className="text-lg text-slate-700">{skill.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-5">
        <div className="md:col-span-3 space-y-6">
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-white/60">
            <h2 className="font-display text-2xl text-forest">介绍</h2>
            <RichText>{skill.intro}</RichText>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-white/60">
            <h2 className="font-display text-2xl text-ocean">原理</h2>
            <RichText>{skill.principle}</RichText>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-white/60">
            <h2 className="font-display text-2xl text-dusk">步骤指南</h2>
            <ol className="space-y-3 text-slate-800">
              {skill.steps.map((step, idx) => (
                <li key={idx} className="flex gap-3 rounded-xl bg-slate-50 p-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-forest/10 font-bold text-forest">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="font-semibold">动手做：</p>
                    <p>{step}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-white/60">
            <h2 className="font-display text-2xl text-forest">安全提示</h2>
            <div className="rounded-2xl border border-forest/20 bg-forest/10 p-4 text-forest">
              {skill.safety}
            </div>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-white/60">
            <h2 className="font-display text-2xl text-ocean">小贴士 & 变体</h2>
            <ul className="grid gap-3 md:grid-cols-2">
              {skill.tips.map((tip, idx) => (
                <li key={idx} className="rounded-2xl bg-slate-50 p-4">
                  {tip}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="md:col-span-2 space-y-4">
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-white/60">
            <h3 className="font-display text-xl text-slate-900">快速信息</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li>⏱️ 预计时间：20-40 分钟</li>
              <li>👀 适合年龄：12-18 岁</li>
              <li>🤝 建议搭档：1-2 位伙伴</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-forest text-white p-5 shadow-sm">
            <h3 className="font-display text-xl">准备物品</h3>
            <p className="mt-2 text-sm opacity-90">
              提前列好工具，再开始动手，效率翻倍也更安全。
            </p>
          </div>
          <Link
            href="/skills"
            className="inline-flex w-full items-center justify-center rounded-full bg-ocean px-4 py-3 font-semibold text-white shadow-md transition hover:-translate-y-0.5"
          >
            ← 返回技能列表
          </Link>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="space-y-4">
          <h3 className="font-display text-2xl text-slate-900">相关技能</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {related.map((item) => (
              <SkillCard key={item.slug} skill={item} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

