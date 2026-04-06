import type { Metadata } from "next";
import { Be_Vietnam_Pro, Geist } from "next/font/google";
import "./globals.css";
import StructuredData from "./components/StructuredData";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  variable: "--font-be-vietnam-pro",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Fishsauce Homestay - Booking Homestay Quanh Hà Nội",
  description: "Fishsauce Homestay cung cấp nhiều lựa chọn homestay từ nội thành tới ngoại thành Hà Nội, gần các danh lam thắng cảnh và điểm du lịch nổi tiếng.",
  keywords: [
    "homestay hà nội", "booking homestay hà nội", "homestay nội thành hà nội",
    "homestay ngoại thành hà nội", "fishsauce homestay", "homestay gần danh lam thắng cảnh"
  ],
  authors: [{ name: "Fishsauce Homestay" }],
  creator: "Fishsauce Homestay",
  publisher: "Fishsauce Homestay",
  metadataBase: new URL("https://tuahsuci.vercel.app"),
  alternates: {
    canonical: "https://tuahsuci.vercel.app"
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://tuahsuci.vercel.app",
    title: "Fishsauce Homestay - Booking Homestay Quanh Hà Nội",
    description: "Hệ thống homestay quanh Hà Nội, từ nội thành tới ngoại thành, phù hợp nghỉ dưỡng và du lịch trải nghiệm.",
    siteName: "Fishsauce Homestay",
    images: [
      {
        url: "/hero-image.webp",
        width: 1200,
        height: 630,
        alt: "Fishsauce Homestay - Booking homestay quanh Hà Nội"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Fishsauce Homestay - Booking Homestay Quanh Hà Nội",
    description: "Đặt homestay quanh Hà Nội nhanh chóng với nhiều lựa chọn nội thành và ngoại thành",
    images: ["/hero-image.webp"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  verification: {
    google: "your-google-site-verification-code-here"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={cn("scroll-smooth", "font-sans", geist.variable)}>
      <head>
        <meta name="apple-mobile-web-app-title" content="Homestay" />
        <meta name="theme-color" content="#27548A" />
        <meta name="msapplication-TileColor" content="#27548A" />
        <link rel="canonical" href="https://tuahsuci.vercel.app" />
        <StructuredData type="homepage" />
      </head>
      <body className={`${beVietnamPro.variable} antialiased`} suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
