# Deployment Guide - LagJobb

## Prerequisites

1. **PocketBase Server**

   - Set up a PocketBase instance (self-hosted or managed)
   - Configure collections as per README.md
   - Set up SSL certificate for production

2. **Google Maps API Key**

   - Get API key from Google Cloud Console
   - Enable Maps JavaScript API
   - Enable Places API (if needed)
   - Set up billing and usage limits

3. **Domain & Hosting**
   - Domain name registered
   - Web hosting or CDN
   - SSL certificate

## Environment Setup

### Development

```bash
# .env
PB_URL=http://localhost:8090
GOOGLE_MAPS_API_KEY=your_dev_api_key
```

### Production

```bash
# .env.production
PB_URL=https://api.lagjobb.se
GOOGLE_MAPS_API_KEY=your_prod_api_key
```

## Build Process

### Development Build

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

The build output will be in `dist/spa/` directory.

## Deployment Options

### Option 1: Static Hosting (Netlify/Vercel)

1. **Netlify**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

Configuration (`netlify.toml`):

```toml
[build]
  command = "npm run build"
  publish = "dist/spa"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

2. **Vercel**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Option 2: Docker

Create `Dockerfile`:

```dockerfile
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist/spa /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

`nginx.conf`:

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_types text/css application/javascript application/json;
}
```

Build and run:

```bash
docker build -t lagjobb-app .
docker run -p 80:80 lagjobb-app
```

### Option 3: Traditional Web Server

1. **Apache**

`.htaccess`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

2. **Nginx**

```nginx
server {
    listen 80;
    server_name lagjobb.se;
    root /var/www/lagjobb/dist/spa;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # SSL configuration
    listen 443 ssl;
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
}
```

## PocketBase Deployment

### Self-Hosted

1. Download PocketBase binary
2. Set up collections via admin UI
3. Configure CORS settings
4. Set up reverse proxy (Nginx/Caddy)
5. Enable SSL

Example Caddy config:

```
api.lagjobb.se {
    reverse_proxy localhost:8090
}
```

### PocketHost (Managed)

1. Sign up at pockethost.io
2. Create new instance
3. Import collections schema
4. Update PB_URL in environment

## CI/CD Pipeline

### GitHub Actions

`.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: "20"

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          PB_URL: ${{ secrets.PB_URL }}
          GOOGLE_MAPS_API_KEY: ${{ secrets.GOOGLE_MAPS_API_KEY }}

      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        with:
          args: deploy --prod
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## Post-Deployment Checklist

- [ ] Test all authentication flows
- [ ] Verify Google Maps integration
- [ ] Check PocketBase connection
- [ ] Test image uploads
- [ ] Verify all routes work
- [ ] Test mobile responsiveness
- [ ] Check SSL certificate
- [ ] Set up monitoring
- [ ] Configure analytics
- [ ] Test performance
- [ ] Set up error tracking (Sentry)
- [ ] Configure backups for PocketBase

## Monitoring

### Recommended Tools

- **Uptime**: UptimeRobot, Pingdom
- **Analytics**: Google Analytics, Plausible
- **Errors**: Sentry
- **Performance**: Lighthouse CI

## Backup Strategy

1. **PocketBase Data**

   - Daily automated backups
   - Store in S3/Cloud Storage
   - Test restore procedures

2. **User Uploads**
   - Backup images/files
   - Sync to cloud storage

## Security Checklist

- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set secure PocketBase rules
- [ ] Implement rate limiting
- [ ] Set up CSP headers
- [ ] Enable HSTS
- [ ] Configure firewall rules
- [ ] Regular security updates
- [ ] Use environment variables for secrets
- [ ] Implement proper authentication

## Performance Optimization

1. **Frontend**

   - Enable Gzip/Brotli compression
   - Set proper cache headers
   - Use CDN for static assets
   - Lazy load images
   - Code splitting

2. **Backend (PocketBase)**
   - Enable caching
   - Optimize database indexes
   - Set up CDN for uploads
   - Monitor query performance

## Rollback Plan

1. Keep previous build artifacts
2. Document deployment steps
3. Test rollback procedure
4. Have database backup ready
5. Maintain version tags in Git

## Support & Maintenance

- Monitor error logs daily
- Update dependencies monthly
- Review security patches weekly
- Check performance metrics
- User feedback collection
