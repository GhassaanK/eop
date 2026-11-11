import type { Metadata } from "next";

export const site = {
  name: "Echo of Palestine",
  url: "https://echoofpalestine.com",
  facebook: "https://www.facebook.com/eopinternationalconference/",
  // Temporary destinations requested by the client. Confirm before launch.
  instagram: "https://www.instagram.com/eop-conference/",
  x: "https://x.com/eop-conference",
  whatsapp: "https://wa.me/923000000000",
  initiative: "International Student Solidarity Movement for Palestine",
};

export const navigation = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/vision-mission", label: "Vision & Mission" },
  { href: "/join-us", label: "Join Us" },
];

export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title, description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, siteName: site.name, type: "website", locale: "en_US", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Echo of Palestine. From solidarity to sustained action." }] },
    twitter: { card: "summary_large_image", title, description, images: ["/opengraph-image"] },
  };
}
