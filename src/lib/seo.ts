import { Metadata } from 'next';

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  noIndex?: boolean;
  alternateLanguages?: Array<{ lang: string; url: string }>;
  structuredData?: object;
}

const defaultConfig = {
  siteName: 'Coders - The Ultimate Developer Toolbox',
  baseUrl: 'https://coders.30tools.com',
  defaultImage: '/og-image.png',
  twitterHandle: '@SH20RAJ',
  author: '30Tools Team',
  organization: '30Tools',
  description: 'Fast, free, and beautifully designed developer tools. Code formatters, API testers, converters, and 30+ essential coding utilities in one clean interface. Built by developers, for developers.',
};

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    canonicalUrl,
    ogImage = defaultConfig.defaultImage,
    ogType = 'website',
    twitterCard = 'summary_large_image',
    noIndex = false,
    alternateLanguages = [],
  } = config;

  const fullTitle = title.includes('Coders') ? title : `${title} | ${defaultConfig.siteName}`;
  const url = canonicalUrl || defaultConfig.baseUrl;
  const imageUrl = ogImage.startsWith('http') ? ogImage : `${defaultConfig.baseUrl}${ogImage}`;

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: defaultConfig.author, url: 'https://30tools.com' }],
    creator: defaultConfig.author,
    publisher: defaultConfig.organization,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(defaultConfig.baseUrl),
    alternates: {
      canonical: url,
      languages: alternateLanguages.reduce((acc, lang) => {
        acc[lang.lang] = lang.url;
        return acc;
      }, {} as Record<string, string>),
    },
    openGraph: {
      type: ogType,
      title: fullTitle,
      description,
      url,
      siteName: defaultConfig.siteName,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
    },
    twitter: {
      card: twitterCard,
      title: fullTitle,
      description,
      images: [imageUrl],
      creator: defaultConfig.twitterHandle,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_VERIFICATION_CODE,
      yandex: process.env.YANDEX_VERIFICATION_CODE,
    },
    manifest: '/manifest.json',
    other: {
      'msapplication-TileColor': '#000000',
      'theme-color': '#000000',
      ...(process.env.BING_VERIFICATION_CODE && {
        'msvalidate.01': process.env.BING_VERIFICATION_CODE,
      }),
    },
  };
}

export function generateStructuredData(type: 'WebApplication' | 'SoftwareApplication' | 'WebPage' | 'Tool', data: Record<string, unknown>) {
  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@type': type,
    url: defaultConfig.baseUrl,
    author: {
      '@type': 'Organization',
      name: defaultConfig.organization,
      url: 'https://30tools.com',
    },
    publisher: {
      '@type': 'Organization',
      name: defaultConfig.organization,
      logo: {
        '@type': 'ImageObject',
        url: `${defaultConfig.baseUrl}/logo.png`,
      },
    },
  };

  switch (type) {
    case 'WebApplication':
      return {
        ...baseStructuredData,
        name: data.name || defaultConfig.siteName,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Web',
        description: data.description || defaultConfig.description,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        aggregateRating: data.rating && typeof data.rating === 'object' && data.rating !== null && 'value' in data.rating && 'count' in data.rating && {
          '@type': 'AggregateRating',
          ratingValue: (data.rating as { value: number; count: number }).value,
          ratingCount: (data.rating as { value: number; count: number }).count,
        },
      };
    case 'SoftwareApplication':
      return {
        ...baseStructuredData,
        name: data.name,
        description: data.description,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Web Browser',
        softwareVersion: '1.0',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      };
    case 'WebPage':
      return {
        ...baseStructuredData,
        name: data.name,
        description: data.description,
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: data.image || defaultConfig.defaultImage,
        },
      };
    case 'Tool':
      return {
        ...baseStructuredData,
        '@type': 'SoftwareApplication',
        name: data.name,
        description: data.description,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Web Browser',
        softwareVersion: '1.0',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        featureList: data.features || [],
      };
    default:
      return baseStructuredData;
  }
}