import type { Metadata } from "next";
import { Syne, Space_Mono, Share_Tech_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const shareTechMono = Share_Tech_Mono({
  variable: "--font-share-tech-mono",
  subsets: ["latin"],
  weight: "400",
});

const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
const bingVerification = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION;

export const metadata: Metadata = {
  title: "3vo.ai — New way to internet.",
  description:
    "3vo.ai is a lean studio building at the intersection of agents, crypto, and the creator economy. We ship products that generate revenue, then iterate.",
  metadataBase: new URL("https://3vo.ai"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "3vo.ai — New way to internet.",
    description:
      "3vo.ai is a lean studio building at the intersection of agents, crypto, and the creator economy. We ship products that generate revenue, then iterate.",
    url: "https://3vo.ai",
    siteName: "3vo.ai",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "3vo.ai — New way to internet.",
    description:
      "3vo.ai is a lean studio building at the intersection of agents, crypto, and the creator economy. We ship products that generate revenue, then iterate.",
  },
  ...(googleVerification || bingVerification
    ? {
        verification: {
          ...(googleVerification ? { google: googleVerification } : {}),
          other: bingVerification
            ? { "msvalidate.01": bingVerification }
            : undefined,
        },
      }
    : {}),
};

const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${spaceMono.variable} ${shareTechMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0A0A0A] text-[#E8E8E8]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "3vo.ai",
                url: "https://3vo.ai",
                logo: "https://3vo.ai/opengraph-image",
                description:
                  "AI-native product studio building at the intersection of agents, crypto, and the creator economy.",
                sameAs: ["https://twitter.com/3voai"],
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "3vo.ai",
                url: "https://3vo.ai",
                description:
                  "AI-native product studio. Notion templates, AI prompt packs, automation workflows, niche research, and more — all built for solopreneurs and indie founders.",
              },
              {
                "@context": "https://schema.org",
                "@type": "ItemList",
                name: "3vo.ai Product Catalog",
                url: "https://3vo.ai",
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "Notion Template OS",
                    url: "https://templates.3vo.ai",
                    description: "Professional Notion templates for freelancers — NDAs, SOWs, proposals, and client docs.",
                  },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "AI Prompt Packs",
                    url: "https://prompts.3vo.ai",
                    description: "500+ AI prompts for the roles a solo founder has to play: marketing, product, outreach, and validation.",
                  },
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: "Automation Workflow Templates",
                    url: "https://tools.3vo.ai",
                    description: "No-code automation templates for small businesses built on n8n and Make.",
                  },
                  {
                    "@type": "ListItem",
                    position: 4,
                    name: "Niche Reports",
                    url: "https://validate.3vo.ai",
                    description: "Data-backed market research reports for founders validating a niche.",
                  },
                  {
                    "@type": "ListItem",
                    position: 5,
                    name: "VC Match Kit",
                    url: "https://vc.3vo.ai",
                    description: "Match your startup with relevant VCs before a fundraise.",
                  },
                  {
                    "@type": "ListItem",
                    position: 6,
                    name: "Goffer AI",
                    url: "https://goffer.ai",
                    description: "AI knowledge assistant for teams.",
                  },
                  {
                    "@type": "ListItem",
                    position: 7,
                    name: "LinkedIn Signal Outreach Pack",
                    url: "https://liorscribe.gumroad.com/l/gpwny",
                    description: "LinkedIn outreach templates and signals for B2B sales.",
                  },
                ],
              },
            ]),
          }}
        />
        {children}

        {/* Consent Mode v2 defaults — must be set before GA4 loads */}
        {GA4_ID && (
          <Script id="google-consent-defaults" strategy="beforeInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                'analytics_storage': 'granted',
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'wait_for_update': 500
              });
            `}
          </Script>
        )}

        {/* Google Analytics 4 */}
        {GA4_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                gtag('js', new Date());
                gtag('config', '${GA4_ID}');
              `}
            </Script>
          </>
        )}

        {/* Meta Pixel */}
        {META_PIXEL_ID && (
          <Script id="meta-pixel-init" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${META_PIXEL_ID}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}
      </body>
    </html>
  );
}
