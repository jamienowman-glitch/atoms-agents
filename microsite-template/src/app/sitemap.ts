import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const routes = [
    "",
    "/agnx-marketing-agents",
    "/agnx-marketing-agents/aftertime-video-editing-agent",
    "/agnx-marketing-agents/caidence-social-media-agents",
    "/agnx-marketing-agents/shopify-sales-ai-agents",
    "/cubed3-marketing",
    "/cubed3-marketing/mynx-cad-pricing-agent",
    "/login",
    "/many-worlds",
    "/mc2-personal-energy",
    "/mc2-personal-energy/b2-nutritional-guidance-agent",
    "/mc2-personal-energy/vo2-endurance-agent",
    "/p2-wealth-creation",
    "/pricing",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
