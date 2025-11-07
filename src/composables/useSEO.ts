import { useMeta } from 'quasar';
import type { ComputedRef } from 'vue';
import { computed, unref } from 'vue';
import { useRoute } from 'vue-router';

export interface SEOConfig {
  title: string | ComputedRef<string>;
  description: string | ComputedRef<string>;
  image?: string | ComputedRef<string | undefined>;
  url?: string | ComputedRef<string>;
  type?: 'website' | 'article';
  structuredData?: Record<string, unknown> | ComputedRef<Record<string, unknown> | undefined>;
}

export function useSEO(config: SEOConfig) {
  const route = useRoute();

  const getAbsoluteUrl = (path: string) => {
    if (typeof window === 'undefined') {
      const baseUrl = process.env.APP_URL || 'https://lagjobb.se';
      return `${baseUrl}${path}`;
    }
    return `${window.location.origin}${path}`;
  };

  const canonicalUrl = computed(() => {
    const url = unref(config.url);
    return url || getAbsoluteUrl(route.path);
  });

  const ogImage = computed(() => {
    const image = unref(config.image);
    return image
      ? (image.startsWith('http') ? image : getAbsoluteUrl(image))
      : getAbsoluteUrl('/soccer-team.jpg');
  });

  const title = computed(() => unref(config.title));
  const description = computed(() => unref(config.description));
  const structuredData = computed(() => unref(config.structuredData));

  const siteName = 'Lagjobb';

  useMeta(() => ({
    title: title.value,
    titleTemplate: (t: string) => t === siteName ? t : `${t} | ${siteName}`,
    meta: {
      description: {
        name: 'description',
        content: description.value
      },
      ogTitle: {
        property: 'og:title',
        content: title.value
      },
      ogDescription: {
        property: 'og:description',
        content: description.value
      },
      ogImage: {
        property: 'og:image',
        content: ogImage.value
      },
      ogImageSecure: {
        property: 'og:image:secure_url',
        content: ogImage.value
      },
      ogImageWidth: {
        property: 'og:image:width',
        content: '1300'
      },
      ogImageHeight: {
        property: 'og:image:height',
        content: '867'
      },
      ogImageAlt: {
        property: 'og:image:alt',
        content: title.value
      },
      ogUrl: {
        property: 'og:url',
        content: canonicalUrl.value
      },
      ogType: {
        property: 'og:type',
        content: config.type || 'website'
      },
      ogSiteName: {
        property: 'og:site_name',
        content: siteName
      },
      twitterCard: {
        name: 'twitter:card',
        content: 'summary_large_image'
      },
      twitterImage: {
        name: 'twitter:image',
        content: ogImage.value
      },
      twitterTitle: {
        name: 'twitter:title',
        content: title.value
      },
      twitterDescription: {
        name: 'twitter:description',
        content: description.value
      },
      canonical: {
        rel: 'canonical',
        href: canonicalUrl.value
      }
    },
    link: {
      canonical: {
        rel: 'canonical',
        href: canonicalUrl.value
      }
    },
    script: structuredData.value ? {
      ldJson: {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(structuredData.value)
      }
    } : {}
  }));

  return {
    canonicalUrl,
    ogImage
  };
}

