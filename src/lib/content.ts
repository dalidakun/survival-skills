import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type SkillContent = {
  slug: string;
  title: string;
  subtitle: string;
  image: string;
  updatedAtMs?: number;
  link?: string;
  intro: string;
  principle: string;
  steps: string[];
  safety: string;
  tips: string[];
  related: string[];
};

const contentDir = path.join(process.cwd(), "content");

function parseSkill(filePath: string): SkillContent | null {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data } = matter(raw);

  if (!data.slug || !data.title) {
    return null;
  }

  return {
    slug: String(data.slug),
    title: String(data.title),
    subtitle: String(data.subtitle || ""),
    image: String(
      data.image ||
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
    ),
    link: data.link ? String(data.link) : undefined,
    intro: String(data.intro || ""),
    principle: String(data.principle || ""),
    steps: Array.isArray(data.steps)
      ? data.steps.map((s: unknown) => String(s))
      : [],
    safety: String(data.safety || ""),
    tips: Array.isArray(data.tips)
      ? data.tips.map((t: unknown) => String(t))
      : [],
    related: Array.isArray(data.related)
      ? data.related.map((r: unknown) => String(r))
      : []
  };
}

export function getAllSkills(): SkillContent[] {
  if (!fs.existsSync(contentDir)) {
    return [];
  }

  const files = fs
    .readdirSync(contentDir)
    .filter((name) => name.endsWith(".md"))
    .map((name) => path.join(contentDir, name));

  const withTime = files
    .map((filePath) => {
      const stat = fs.statSync(filePath);
      const skill = parseSkill(filePath);
      if (skill) {
        skill.updatedAtMs = stat.mtimeMs;
      }
      return { skill, mtime: stat.mtimeMs };
    })
    .filter(
      (item): item is { skill: SkillContent; mtime: number } =>
        Boolean(item.skill)
    );

  return withTime
    .sort((a, b) => b.mtime - a.mtime)
    .map((item) => item.skill);
}

export function getSkill(slug: string): SkillContent | null {
  const files = fs
    .readdirSync(contentDir)
    .filter((name) => name.endsWith(".md"));

  for (const fileName of files) {
    const filePath = path.join(contentDir, fileName);
    const parsed = parseSkill(filePath);
    if (parsed?.slug === slug) {
      const stat = fs.statSync(filePath);
      parsed.updatedAtMs = stat.mtimeMs;
      return parsed;
    }
  }
  return null;
}

export function getRelatedSkills(slugs: string[]): SkillContent[] {
  const all = getAllSkills();
  return all.filter((skill) => slugs.includes(skill.slug));
}

