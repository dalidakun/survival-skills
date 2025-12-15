import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type SkillContent = {
  slug: string;
  title: string;
  subtitle: string;
  image: string;
  updatedAtMs?: number;
  order?: number; // 手动排序字段，数字越小越靠前
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
    const updatedAtStr = String(data.updatedAt).trim();
    if (updatedAtStr) {
      const updatedAtDate = new Date(updatedAtStr);
      if (!isNaN(updatedAtDate.getTime())) {
        updatedAtMs = updatedAtDate.getTime();
      } else {
        // 如果解析失败，输出警告（仅在开发环境）
        if (process.env.NODE_ENV === 'development') {
          console.warn(`Failed to parse updatedAt: ${updatedAtStr} for file: ${filePath}`);
        }
      }
    }
  }

  // 解析 order 字段（如果存在）
  let order: number | undefined;
  if (data.order !== undefined && data.order !== null) {
    const orderNum = Number(data.order);
    if (!isNaN(orderNum)) {
      order = orderNum;
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
    order, // 手动排序字段
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
        if (!skill.updatedAtMs || skill.updatedAtMs === 0) {
          skill.updatedAtMs = stat.mtimeMs;
        }
      }
      // 使用 updatedAtMs 或文件修改时间进行排序（降序，最新的在前）
      const sortTime = skill?.updatedAtMs || stat.mtimeMs;
      return { skill, mtime: sortTime };
    })
    .filter(
      (item): item is { skill: SkillContent; mtime: number } =>
        Boolean(item.skill)
    );

  // 排序逻辑：优先按 order 排序（数字越小越靠前），如果 order 相同或不存在，则按时间降序排序（最新的在前）
  const sorted = withTime.sort((a, b) => {
    const aOrder = a.skill.order;
    const bOrder = b.skill.order;
    
    // 如果两个都有 order，按 order 排序
    if (aOrder !== undefined && bOrder !== undefined) {
      if (aOrder !== bOrder) {
        return aOrder - bOrder; // order 越小越靠前
      }
    }
    // 如果只有一个有 order，有 order 的靠前
    if (aOrder !== undefined && bOrder === undefined) {
      return -1; // a 靠前
    }
    if (aOrder === undefined && bOrder !== undefined) {
      return 1; // b 靠前
    }
    // 如果都没有 order，按时间降序排序（最新的在前）
    return b.mtime - a.mtime;
  });
  
  // 调试输出（仅在开发环境）
  if (process.env.NODE_ENV === 'development' && sorted.length > 0) {
    console.log('Articles sorted by time (newest first):');
    sorted.slice(0, 3).forEach((item, idx) => {
      console.log(`${idx + 1}. ${item.skill.title}: ${new Date(item.mtime).toISOString()}, updatedAtMs: ${item.skill.updatedAtMs}`);
    });
  }
  
  return sorted.map((item) => item.skill);
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

