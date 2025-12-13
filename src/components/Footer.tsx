export function Footer() {
  return (
    <footer className="mt-16 bg-slate-900 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-lg">生存冒险课堂</p>
          <p className="text-sm text-slate-300">
            轻松学会野外技能，带着好奇与自信出发。
          </p>
        </div>
        <div className="text-sm text-slate-300">
          <p>联系： adventure-kids@example.com</p>
          <p className="text-slate-400">制作：Next.js + React + Tailwind CSS</p>
        </div>
      </div>
    </footer>
  );
}

