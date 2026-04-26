import type { Metadata } from "next";
import CTFGate from "../components/CTFGate";

export const metadata: Metadata = {
  title: "Early Access — 3vo.ai",
  robots: { index: false, follow: false },
};

export default function WaitlistPage() {
  return <CTFGate />;
}
