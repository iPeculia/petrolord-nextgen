# Deployment Guide

## Progressive Web App (PWA)
This application is configured as a PWA. 
- **Manifest**: Located at `public/manifest.json`
- **Service Worker**: Located at `public/sw.js`
- **Registration**: Handled in `src/main.jsx` via `src/serviceWorkerRegistration.js`

To test PWA functionality locally:
1. Run `npm run build`
2. Serve the `dist` folder using a static server (e.g., `serve -s dist`)
3. Open in browser and check Application tab in DevTools.

## Cloud Deployment

### Docker
A `Dockerfile` is provided in `deployment/` for containerizing the application.
To build locally:
\`\`\`bash
docker build -t petrolord-app -f deployment/Dockerfile .
\`\`\`

To run:
\`\`\`bash
docker run -p 8080:80 petrolord-app
\`\`\`

### CI/CD
A GitHub Actions workflow is located at `.github/workflows/deploy.yml`.
It performs:
1. Linting and Building
2. Building a Docker image
3. Pushing to GitHub Container Registry (GHCR)

### Cloud Providers
**AWS**:
- Deploy the Docker container to **AWS App Runner** or **ECS (Fargate)**.
- Alternatively, host static files from `dist/` on **S3** behind **CloudFront**.

**Azure**:
- Deploy container to **Azure Container Apps** or **App Service for Containers**.
- Or use **Azure Static Web Apps** connected to your GitHub repo.

**Google Cloud**:
- Deploy container to **Cloud Run**.
- Or use **Firebase Hosting** for static assets.

## Mobile Deployment
While this is a web application, it is optimized for mobile devices via:
- Responsive `Layout.jsx`
- `MobileNavigation.jsx` bottom bar
- Touch-friendly UI components
- Offline capabilities via Service Worker

To create a native wrapper (optional):
- Use **Capacitor** or **Cordova** to wrap the `dist` output.
\`\`\`bash
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
npx cap init
npx cap add android
npx cap sync
\`\`\`