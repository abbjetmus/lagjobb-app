# SEO Implementation Guide

## What Was Implemented

### 1. Router Mode Change
- Changed from `hash` mode to `history` mode for SEO-friendly URLs
- URLs now appear as `/sok-uppdrag` instead of `/#/sok-uppdrag`

### 2. SEO Composable (`src/composables/useSEO.ts`)
- Reusable composable for adding meta tags and structured data
- Supports both static and computed/reactive values
- Automatically generates:
  - Page titles
  - Meta descriptions
  - Open Graph tags (for social sharing)
  - Twitter Card tags
  - Canonical URLs
  - Structured data (JSON-LD schema.org)

### 3. Enhanced Base Meta Tags (`index.html`)
- Added language attribute (`lang="sv"`)
- Added robots meta tags
- Added Open Graph base tags
- Added geo-location tags
- Added theme-color for mobile

### 4. SEO on Key Pages
- **IndexPage**: Homepage with WebSite schema
- **SearchJobsPage**: Search page with CollectionPage schema
- **JobDetailsPage**: Individual jobs with JobPosting schema (dynamic)

### 5. SEO Files
- `robots.txt`: Tells search engines what to crawl
- `_redirects`: Ensures SPA routing works correctly

## How to Use

### Adding SEO to a New Page

```typescript
import { useSEO } from 'src/composables/useSEO';

useSEO({
  title: 'Page Title - Lagjobb',
  description: 'Page description for search engines',
  image: '/path-to-image.jpg', // Optional
  url: 'https://lagjobb.se/page-url', // Optional
  type: 'website', // or 'article'
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    // ... schema data
  }
});
```

### Using Computed Values

```typescript
const pageTitle = computed(() => `Dynamic ${data.value.title}`);
const pageDescription = computed(() => data.value.description);

useSEO({
  title: pageTitle,
  description: pageDescription,
  // ... other config
});
```

## Important Notes

### Server Configuration
Since we're using `history` mode, your server must redirect all routes to `index.html`. The `socialengine/nginx-spa` Docker image already handles this, but if you switch hosting:

- **Nginx**: Add `try_files $uri $uri/ /index.html;`
- **Apache**: Add `.htaccess` with rewrite rules
- **Netlify/Vercel**: Use `_redirects` file (already created)

### Environment Variables
Set `APP_URL` environment variable to your production domain:
```
APP_URL=https://lagjobb.se
```

### Testing SEO
1. Use Google's Rich Results Test: https://search.google.com/test/rich-results
2. Use Facebook's Sharing Debugger: https://developers.facebook.com/tools/debug/
3. Check page source to see meta tags
4. Validate structured data: https://validator.schema.org/

### Additional Recommendations

1. **Create a sitemap.xml** - Generate dynamically or statically
2. **Submit to Google Search Console** - Add your site
3. **Add more structured data** for:
   - Organization schema
   - BreadcrumbList schema
   - Review/Rating schema (if applicable)
4. **Monitor Core Web Vitals** - Page speed affects SEO
5. **Add more meta tags** to other public pages:
   - `/kontakta-oss`
   - `/om-oss`
   - `/hur-det-funkar`
   - `/grupper`
   - etc.

## Next Steps

1. Test the build locally: `npm run build`
2. Verify meta tags appear in the built HTML
3. Deploy and test with Google Search Console
4. Add SEO to remaining public pages
5. Consider implementing SSR for even better SEO (Quasar supports this)

