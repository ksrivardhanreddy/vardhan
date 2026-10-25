import "./globals.css";
import type { Metadata } from "next";
import { AiAssistant } from "@/components/portfolio-ai/AiAssistant";
import { Providers } from "./providers";
export const metadata: Metadata = {
  metadataBase: new URL("https://www.vardhan.pro"),
  title: "Srivardhan Reddy Kolan | Senior DevOps & Platform Engineer",
  description:
    "Senior DevOps and Platform Engineer specializing in AWS, Kubernetes, Terraform, Linux, and cloud infrastructure. Explore projects, experience, and certifications.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Vardhan · Reliable platforms. Safer releases.",
    description:
      "Senior DevOps Engineer building dependable cloud infrastructure, delivery workflows, and production platforms.",
    url: "/",
    siteName: "Vardhan",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Srivardhan Reddy Kolan — Senior DevOps & Platform Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Srivardhan Reddy Kolan | Senior DevOps & Platform Engineer",
    description: "AWS · Kubernetes · Terraform · Linux · Cloud Infrastructure",
    images: ["/opengraph-image.png"],
  },
  robots: { index: true, follow: true },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          {children}
          <AiAssistant />
        </Providers>
      </body>
    </html>
  );
}
