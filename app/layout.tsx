import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "./providers";
export const metadata: Metadata = {
  metadataBase: new URL("https://www.vardhan.pro"),
  title:
    "Vardhan | Senior DevOps Engineer · AWS, Kubernetes & Platform Engineering",
  description:
    "Srivardhan Reddy Kolan — Senior DevOps Engineer in Hyderabad. AWS, Kubernetes, Terraform, CI/CD, observability, and production reliability.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Vardhan · Reliable platforms. Safer releases.",
    description:
      "Senior DevOps Engineer building dependable cloud infrastructure, delivery workflows, and production platforms.",
    url: "/",
    siteName: "Vardhan",
    type: "website",
    locale: "en_IN",
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
