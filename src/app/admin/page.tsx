'use client';

import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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

  // 检查是否已登录
  useEffect(() => {
    const auth = sessionStorage.getItem("admin_authenticated");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

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
        <h1 className="font-display text-3xl text-slate-900">新增文章</h1>
        <button
          onClick={handleLogout}
          className="rounded-full bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-300"
        >
          退出登录
        </button>
      </div>
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
    </div>
  );
}


