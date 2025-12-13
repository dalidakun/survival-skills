'use client';

import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { SkillContent } from "@/lib/content";

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [uploadMode, setUploadMode] = useState<"link" | "pdf">("link");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [authBusy, setAuthBusy] = useState(false);
  const [articles, setArticles] = useState<SkillContent[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(false);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"add" | "list">("add");

  // 检查是否已登录
  useEffect(() => {
    const auth = sessionStorage.getItem("admin_authenticated");
    if (auth === "true") {
      setIsAuthenticated(true);
      loadArticles();
    }
  }, []);

  // 加载文章列表
  async function loadArticles() {
    setLoadingArticles(true);
    try {
      const adminPassword = sessionStorage.getItem("admin_password") || password;
      const res = await fetch(`/api/get-articles?password=${encodeURIComponent(adminPassword)}`);
      const json = await res.json();
      if (res.ok) {
        setArticles(json.articles || []);
      } else {
        console.error("加载文章列表失败:", json.message);
      }
    } catch (error) {
      console.error("加载文章列表错误:", error);
    } finally {
      setLoadingArticles(false);
    }
  }

  // 删除文章
  async function handleDelete(slug: string, title: string) {
    if (!confirm(`确定要删除文章"${title}"吗？此操作无法撤销。`)) {
      return;
    }

    setDeletingSlug(slug);
    try {
      const adminPassword = sessionStorage.getItem("admin_password") || password;
      const formData = new FormData();
      formData.append("password", adminPassword);
      formData.append("slug", slug);

      const res = await fetch("/api/delete-article", {
        method: "POST",
        body: formData
      });
      const json = await res.json();

      if (res.ok) {
        setStatus("✅ 删除成功！文件已从 GitHub 删除，Vercel 会自动重新部署。");
        // 立即从列表中移除，无需等待重新加载
        setArticles((prev) => prev.filter((article) => article.slug !== slug));
      } else {
        throw new Error(json.message || "删除失败");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "删除失败，请稍后再试。";
      setStatus(`❌ ${message}`);
    } finally {
      setDeletingSlug(null);
    }
  }

  async function handleAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthBusy(true);
    setStatus("验证中…");

    try {
      // 简单的密码验证（实际部署时应该使用环境变量）
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });

      if (res.ok) {
        sessionStorage.setItem("admin_authenticated", "true");
        sessionStorage.setItem("admin_password", password);
        setIsAuthenticated(true);
        setStatus("✅ 验证成功");
      } else {
        const json = await res.json();
        throw new Error(json.message || "密码错误");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "验证失败，请稍后再试。";
      setStatus(`❌ ${message}`);
    } finally {
      setAuthBusy(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setStatus("提交中…");

    try {
      const formData = new FormData();
      const adminPassword = sessionStorage.getItem("admin_password") || password;
      formData.append("password", adminPassword);
      formData.append("title", title);

      if (uploadMode === "pdf" && pdfFile) {
        // 上传 PDF 文件
        formData.append("pdf", pdfFile);
        const uploadRes = await fetch("/api/upload-pdf", {
          method: "POST",
          body: formData
        });
        const uploadJson = await uploadRes.json();
        if (!uploadRes.ok) {
          throw new Error(uploadJson.message || "PDF 上传失败");
        }
        // 使用上传后的 URL
        formData.delete("pdf");
        formData.append("link", uploadJson.url);
      } else {
        // 使用外部链接
        formData.append("link", link);
      }

      const res = await fetch("/api/add-link", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "保存失败");
      }
      setStatus("✅ 已保存，回首页可见。");
      setTitle("");
      setLink("");
      setPdfFile(null);
      // 重新加载文章列表
      await loadArticles();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "上传失败，请稍后再试。";
      setStatus(`❌ ${message}`);
    } finally {
      setBusy(false);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("admin_authenticated");
    sessionStorage.removeItem("admin_password");
    setIsAuthenticated(false);
    setPassword("");
    // 刷新页面以更新导航栏
    window.location.reload();
  }

  // 如果未认证，显示登录表单
  if (!isAuthenticated) {
    return (
      <div className="mx-auto w-full max-w-md space-y-6 px-4">
        <h1 className="font-display text-3xl text-slate-900">管理员登录</h1>
        <form onSubmit={handleAuth} className="space-y-4">
          <label className="space-y-1 text-sm font-semibold text-slate-700">
            密码
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入管理员密码"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-forest/20 focus:ring-2"
            />
          </label>
          <button
            type="submit"
            disabled={authBusy}
            className="w-full rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-forest/30 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {authBusy ? "验证中…" : "登录"}
          </button>
          {status && <p className="text-sm text-slate-700">{status}</p>}
        </form>
      </div>
    );
  }

  // 已认证，显示管理表单
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-slate-900">文章管理</h1>
        <button
          onClick={handleLogout}
          className="rounded-full bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-300"
        >
          退出登录
        </button>
      </div>

      {/* 标签页切换 */}
      <div className="flex gap-4 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab("add")}
          className={`px-4 py-2 text-sm font-semibold transition ${
            activeTab === "add"
              ? "border-b-2 border-forest text-forest"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          新增文章
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("list");
            loadArticles();
          }}
          className={`px-4 py-2 text-sm font-semibold transition ${
            activeTab === "list"
              ? "border-b-2 border-forest text-forest"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          文章列表
        </button>
      </div>

      {/* 新增文章标签页 */}
      {activeTab === "add" && (
        <>
          <p className="text-sm text-slate-400">
            输入标题和链接，或上传 PDF 文件，提交后会在首页列表展示。
          </p>

          <div className="flex gap-4 border-b border-slate-200">
            <button
              type="button"
              onClick={() => setUploadMode("link")}
              className={`px-4 py-2 text-sm font-semibold transition ${
                uploadMode === "link"
                  ? "border-b-2 border-forest text-forest"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              使用链接
            </button>
            <button
              type="button"
              onClick={() => setUploadMode("pdf")}
              className={`px-4 py-2 text-sm font-semibold transition ${
                uploadMode === "pdf"
                  ? "border-b-2 border-forest text-forest"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              上传 PDF
            </button>
          </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="space-y-1 text-sm font-semibold text-slate-700">
          标题
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例如：户外净水快速指南"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-forest/20 focus:ring-2"
          />
        </label>

        {uploadMode === "link" ? (
          <label className="space-y-1 text-sm font-semibold text-slate-700">
            链接
            <input
              type="url"
              required
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://example.com/your-article.pdf"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-forest/20 focus:ring-2"
            />
          </label>
        ) : (
          <label className="space-y-1 text-sm font-semibold text-slate-700">
            PDF 文件
            <input
              type="file"
              required
              accept="application/pdf"
              onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-forest/20 focus:ring-2"
            />
            {pdfFile && (
              <p className="text-xs text-slate-500">
                已选择: {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </label>
        )}

          <button
            type="submit"
            disabled={busy}
            className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-forest/30 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? "提交中…" : "提交"}
          </button>
          {status && <p className="text-sm text-slate-700">{status}</p>}
        </form>
        </>
      )}

      {/* 文章列表标签页 */}
      {activeTab === "list" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">
              共 {articles.length} 篇文章，点击删除按钮可删除文章。
            </p>
            <button
              onClick={loadArticles}
              disabled={loadingArticles}
              className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 disabled:opacity-60"
            >
              {loadingArticles ? "加载中…" : "刷新"}
            </button>
          </div>

          {loadingArticles ? (
            <div className="text-center py-8 text-slate-500">加载中…</div>
          ) : articles.length === 0 ? (
            <div className="text-center py-8 text-slate-500">暂无文章</div>
          ) : (
            <div className="space-y-2">
              {articles.map((article) => (
                <div
                  key={article.slug}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 hover:bg-slate-50"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{article.title}</h3>
                    {article.link && (
                      <p className="text-xs text-slate-500 mt-1 truncate">
                        {article.link}
                      </p>
                    )}
                    <p className="text-xs text-slate-400 mt-1">
                      Slug: {article.slug}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(article.slug, article.title)}
                    disabled={deletingSlug === article.slug}
                    className="ml-4 rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-200 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {deletingSlug === article.slug ? "删除中…" : "删除"}
                  </button>
                </div>
              ))}
            </div>
          )}
          {status && <p className="text-sm text-slate-700">{status}</p>}
        </div>
      )}
    </div>
  );
}


