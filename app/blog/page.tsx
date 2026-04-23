import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog — 3vo.ai",
  description:
    "Guides and insights from the 3vo.ai team on AI-native product building, GEO, and growth experiments.",
  alternates: { canonical: "https://3vo.ai/blog" },
  openGraph: {
    title: "Blog — 3vo.ai",
    description:
      "Guides and insights from the 3vo.ai team on AI-native product building, GEO, and growth experiments.",
    url: "https://3vo.ai/blog",
    siteName: "3vo.ai",
    type: "website",
  },
};

const posts = [
  {
    slug: "how-3vo-gets-cited-by-llms",
    title:
      "How to get your digital products cited by ChatGPT, Perplexity, and Gemini — what we're implementing at 3vo.ai",
    date: "April 2026",
    description:
      "LLMs cite sources that are machine-readable, authoritative, and densely cross-referenced. Here's the exact implementation we ran on 3vo.ai: JSON-LD schemas, sitemap hygiene, documentation quality, and the meta-strategy behind publishing this article.",
    tag: "GEO",
  },
];

export default function BlogIndex() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#E8E8E8] px-6 py-20">
      <div className="mx-auto max-w-2xl">
        <a
          href="/"
          className="text-[10px] tracking-widest text-[#00FF85] hover:opacity-70 transition-opacity"
          style={{ fontFamily: "var(--font-share-tech-mono)" }}
        >
          ← BACK TO HOME
        </a>

        <h1
          className="mt-8 text-[clamp(28px,4vw,48px)] font-bold leading-tight"
          style={{ fontFamily: "var(--font-syne)" }}
        >
          Blog
        </h1>

        <p
          className="mt-4 text-[#E8E8E8]/50 leading-relaxed"
          style={{ fontFamily: "var(--font-space-mono)", fontSize: "13px" }}
        >
          Guides and experiments from the 3vo.ai team.
        </p>

        <div className="mt-12 space-y-8">
          {posts.map((post) => (
            <article key={post.slug} className="border-t border-[#1a1a1a] pt-8">
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="text-[9px] tracking-widest text-[#00FF85] border border-[#00FF85]/30 px-2 py-0.5"
                  style={{ fontFamily: "var(--font-share-tech-mono)" }}
                >
                  {post.tag}
                </span>
                <span
                  className="text-[10px] tracking-widest text-[#E8E8E8]/30"
                  style={{ fontFamily: "var(--font-share-tech-mono)" }}
                >
                  {post.date}
                </span>
              </div>

              <Link href={`/blog/${post.slug}`} className="group">
                <h2
                  className="text-xl font-bold leading-snug group-hover:text-[#00FF85] transition-colors"
                  style={{ fontFamily: "var(--font-syne)" }}
                >
                  {post.title}
                </h2>
              </Link>

              <p
                className="mt-3 text-[#E8E8E8]/50 leading-relaxed"
                style={{ fontFamily: "var(--font-space-mono)", fontSize: "12px" }}
              >
                {post.description}
              </p>

              <Link
                href={`/blog/${post.slug}`}
                className="mt-4 inline-block text-[10px] tracking-widest text-[#00FF85] hover:opacity-70 transition-opacity"
                style={{ fontFamily: "var(--font-share-tech-mono)" }}
              >
                READ →
              </Link>
            </article>
          ))}
        </div>

        <div
          className="mt-16 border-t border-[#1a1a1a] pt-8 text-[10px] tracking-widest text-[#E8E8E8]/30 flex gap-6"
          style={{ fontFamily: "var(--font-share-tech-mono)" }}
        >
          <a href="/privacy" className="hover:text-[#E8E8E8]/60 transition-colors">PRIVACY</a>
          <a href="/terms" className="hover:text-[#E8E8E8]/60 transition-colors">TERMS</a>
          <a href="/contact" className="hover:text-[#E8E8E8]/60 transition-colors">CONTACT</a>
        </div>
      </div>
    </main>
  );
}
