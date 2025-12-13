import { getAllSkills } from "@/lib/content";
import SearchClient from "./search-client";

export const metadata = {
  title: "搜索 | 生存冒险课堂"
};

export default function SearchPage({
  searchParams
}: {
  searchParams: { q?: string };
}) {
  const skills = getAllSkills();
  const initialQuery = typeof searchParams.q === "string" ? searchParams.q : "";
  return <SearchClient skills={skills} initialQuery={initialQuery} />;
}

