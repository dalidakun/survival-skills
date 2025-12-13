import Image from "next/image";
import Link from "next/link";
import { SkillContent } from "@/lib/content";

type Props = {
  skill: SkillContent;
};

const localFileMap: Record<string, string> = {
  // 将 PDF 放在项目 public/ 目录下，使用站点内链接避免浏览器阻止 file://
  "water-purification": "/Field_Water_Mastery.pdf"
};

export function SkillCard({ skill }: Props) {
  const mapped = localFileMap[skill.slug];
  const href = skill.link || mapped || `/skills/${skill.slug}`;
  const content = (
    <>
      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
        <Image
          src={skill.image}
          alt={skill.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
        <div className="absolute bottom-2 left-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-700">
          动手 x 冒险
        </div>
      </div>
      <div className="space-y-2 p-4">
        <h3 className="font-display text-lg text-forest">{skill.title}</h3>
        <p className="text-sm text-slate-600">{skill.subtitle}</p>
        <p className="text-xs font-semibold text-ocean">点击查看 →</p>
      </div>
    </>
  );

  if (href.startsWith("file://")) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="group block overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
    >
      {content}
    </Link>
  );
}

