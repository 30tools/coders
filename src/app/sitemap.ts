import { MetadataRoute } from 'next';
import { toolsData } from '@/lib/tools-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://coders.30tools.com';
  const { tools } = toolsData;
  
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/profile`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Add all tools to sitemap dynamically
  tools.forEach(tool => {
    routes.push({
      url: `${baseUrl}${tool.url}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: tool.featured ? 0.8 : tool.popular ? 0.7 : 0.6,
    });
  });

  // Add category pages if they exist
  const categories = [...new Set(tools.map(tool => tool.category))];
  categories.forEach(category => {
    routes.push({
      url: `${baseUrl}/tools/category/${category}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  });

  return routes;
}