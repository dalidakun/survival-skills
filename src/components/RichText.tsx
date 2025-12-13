import MarkdownIt from "markdown-it";

const md = new MarkdownIt({
  breaks: true,
  linkify: true
});

type Props = {
  children: string;
};

export function RichText({ children }: Props) {
  const html = md.render(children || "");
  return (
    <div
      className="prose prose-slate max-w-none prose-p:leading-relaxed prose-headings:text-forest prose-strong:text-forest prose-a:text-ocean"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

