import { MetadataRoute } from "next";
import { supabaseServer } from "@/lib/supabaseServer";
import { getAllPosts } from "@/lib/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.lueurstudio-photographie.fr";
  const { data } = await supabaseServer.from("projects").select("slug");

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date("2025-04-01"), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/portfolio`, lastModified: new Date("2025-04-01"), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: new Date("2025-04-20"), changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/a-propos`, lastModified: new Date("2025-04-01"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/photographe-paris`, lastModified: new Date("2025-04-01"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/services/portrait`, lastModified: new Date("2025-04-01"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/services/evenement`, lastModified: new Date("2025-04-01"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/services/animal`, lastModified: new Date("2025-04-01"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/services/instagram-reseaux`, lastModified: new Date("2025-04-01"), changeFrequency: "monthly", priority: 0.8 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = (data || [])
    .filter((project: { slug: string; hidden?: boolean }) => project.hidden !== true)
    .map((project) => ({
      url: `${baseUrl}/portfolio/${project.slug}`,
      lastModified: new Date("2025-04-01"),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    }));

  const blogPosts = getAllPosts();
  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes, ...blogRoutes];
}


