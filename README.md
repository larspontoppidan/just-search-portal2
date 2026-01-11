# Just Search Portal v2

Just Search Portal (v2) is a lightweight New Tab page for sending search queries directly to search engines, without distractions and respecting privacy. 

Try the page [here](https://justsearchportal.com). Read more [here](https://larsee.com/blog/2025/12/just-search-portal-v2).

## Tech stack

- **React 18 / TypeScript** - Frontend technology
- **Vite** - Build tool and dev server
- **ESLint** - Code linting
- **Prettier** - Code formatting

## Getting Started

Supported npm commands:

- `npm install` Install dependencies
- `npm run lint` Run code checks
- `npm run format` Pretty the code
- `npm run build` Perform production build
- `npm run dev` Run the development server to test locally


## Deployment

### Build Output

The `dist` folder contains the build output:

- `index.html` The entire portal implementation is contained in this file.
- `sw.js` Service worker for caching icons locally.
- `opensearch.xml` for OpenSearch plugin integration.

### Nginx Configuration

For hosting with nginx with proper caching, use the following configuration. This ensures browsers cache assets for 24 hours, then revalidate with the server using ETag (via 304 responses).

```nginx
server {
    listen 80;
    server_name search.example.com;
    root /var/www/justsearch;
    index index.html;

    location / {
        try_files $uri /index.html;
        
        # Cache assets for 24h, then revalidate with ETag
        add_header Cache-Control "max-age=86400, must-revalidate";
        
        # ETag is enabled by default in nginx
        etag on;
    }

    # Optional: Enable gzip compression
    gzip on;
    gzip_types text/html text/css application/javascript;
}
```

---

By Lars Ole Pontoppidan, 2025
