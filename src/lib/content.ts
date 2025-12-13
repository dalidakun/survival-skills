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

  // 优先使用 frontmatter 中的 updatedAt，否则使用文件修改时间
  let updatedAtMs: number | undefined;
  if (data.updatedAt) {
    // 如果 frontmatter 中有 updatedAt，使用它
    const updatedAtStr = String(data.updatedAt);
    const updatedAtDate = new Date(updatedAtStr);
    if (!isNaN(updatedAtDate.getTime())) {
      updatedAtMs = updatedAtDate.getTime();
    } else {
      // 如果解析失败，尝试其他格式
      console.warn(`Failed to parse updatedAt: ${updatedAtStr}`);
    }
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
    updatedAtMs, // 先设置为 undefined，后面会用文件修改时间或这个值
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
        // 如果 frontmatter 中没有 updatedAtMs，使用文件修改时间
        if (!skill.updatedAtMs) {
          skill.updatedAtMs = stat.mtimeMs;
        }
      }
      // 使用 updatedAtMs 或文件修改时间进行排序
      const sortTime = skill?.updatedAtMs || stat.mtimeMs;
      return { skill, mtime: sortTime };
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
      // 如果 frontmatter 中没有 updatedAtMs，使用文件修改时间
      if (!parsed.updatedAtMs) {
        const stat = fs.statSync(filePath);
        parsed.updatedAtMs = stat.mtimeMs;
      }
      return parsed;
    }
  }
  return null;
}

export function getRelatedSkills(slugs: string[]): SkillContent[] {
  const all = getAllSkills();
  return all.filter((skill) => slugs.includes(skill.slug));
}

