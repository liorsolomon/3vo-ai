import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thank You — prompts.3vo.ai",
  robots: { index: false, follow: false },
};

export default function SuccessLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
