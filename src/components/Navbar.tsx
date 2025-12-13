/* eslint-disable @next/next/no-img-element */
"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useRef, useState } from "react";

export function Navbar() {
  const router = useRouter();
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [isFocusInside, setIsFocusInside] = useState(false);
  const searchRef = useRef<HTMLFormElement | null>(null);
  const [searchError, setSearchError] = useState("");

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) {
      setSearchError("请输入内容");
      return;
    }
    router.push(`/search${q ? `?q=${encodeURIComponent(q)}` : ""}`);
    setShowSearch(false);
    setIsFocusInside(false);
    setSearchError("");
  }

  function closeSearch() {
    setShowSearch(false);
    setIsFocusInside(false);
  }

  function handleBlurCapture(e: React.FocusEvent) {
    const next = e.relatedTarget as HTMLElement | null;
    if (!next || (searchRef.current && !searchRef.current.contains(next))) {
      closeSearch();
    }
  }

  function handleMouseLeave() {
    if (!isFocusInside) {
      closeSearch();
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-4 px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-sm font-medium text-slate-700 transition hover:text-forest"
        >
          <span>蒙谦自然教育</span>
        </Link>

        <nav className="flex items-center gap-3 text-sm font-medium text-slate-700">
          {!showSearch && (
            <button
              type="button"
              onClick={() => {
                setShowSearch(true);
                setIsFocusInside(true);
              }}
              className="rounded-full px-3 py-2 transition hover:bg-ocean/10 hover:text-forest"
            >
              搜索
            </button>
          )}

          {showSearch && (
            <form
              ref={searchRef}
              onSubmit={handleSearchSubmit}
              onBlurCapture={handleBlurCapture}
              onMouseLeave={handleMouseLeave}
              className="flex items-center gap-2"
            >
              <input
                autoFocus
                value={query}
                onFocus={() => setIsFocusInside(true)}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (searchError) setSearchError("");
                }}
                placeholder={searchError || "搜索技能..."}
                className={`w-48 rounded-full border px-3 py-1.5 text-sm outline-none ring-forest/20 focus:ring-2 ${
                  searchError
                    ? "border-slate-200 placeholder:text-red-500"
                    : "border-slate-200"
                }`}
              />
              <button
                type="submit"
                className="rounded-full bg-forest px-3 py-1.5 text-white transition hover:-translate-y-0.5"
              >
                Go
              </button>
            </form>
          )}

          {(!showSearch || !isFocusInside) && (
            <Link
              href="/admin"
              className="rounded-full px-3 py-2 transition hover:bg-ocean/10 hover:text-forest"
            >
              管理
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

