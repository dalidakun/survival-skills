import { SkillCard } from "@/components/SkillCard";
import { getAllSkills } from "@/lib/content";

export const metadata = {
  title: "技能列表 | 生存冒险课堂"
};

export default function SkillsPage() {
  const skills = getAllSkills();

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="badge bg-dusk/10 text-dusk">技能地图</p>
        <h1 className="font-display text-3xl text-slate-900">全部技能</h1>
        <p className="text-slate-600">
          选择一个卡片进入详细步骤与科学原理，随时返回列表。
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {skills.map((skill) => (
          <SkillCard key={skill.slug} skill={skill} />
        ))}
      </div>
    </section>
  );
}

