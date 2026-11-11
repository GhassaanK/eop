import type { MetadataRoute } from "next";
import { navigation, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return navigation.map(({ href }) => ({ url: new URL(href, site.url).href }));
}
