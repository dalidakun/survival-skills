export const metadata = {
  title: "关于 | 生存冒险课堂"
};

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <p className="badge bg-sunrise/10 text-sunrise">关于我们</p>
      <h1 className="font-display text-3xl text-slate-900">为什么做这个站点？</h1>
      <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-white/60">
        <p className="text-slate-700">
          我们想给 12-18 岁的青少年一个充满好奇、行动和安全感的生存技能学习场。用轻松的语气、彩色插画和短小步骤，让每个人都能在几分钟内学会一项新技能。
        </p>
        <p className="text-slate-700">
          技能来自户外教练的实践清单，重点强调「先安全、再好玩」：每个步骤都有安全提示，小贴士鼓励尝试不同变体，培养自信和解决问题的能力。
        </p>
        <p className="text-slate-700">
          本项目使用 Next.js + React + Tailwind CSS 构建，内容存放在
          Markdown 文件中，便于扩展和协作。
        </p>
      </div>
      <div className="rounded-2xl bg-ocean/10 p-6 text-slate-800">
        <p className="font-semibold text-ocean">想贡献内容？</p>
        <p className="text-sm">
          添加新的技能 Markdown，或在管理页上传图片与文档。欢迎分享你的冒险经验！
        </p>
      </div>
    </div>
  );
}

