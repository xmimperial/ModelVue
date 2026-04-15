# ModelVue Deployment & Build Strategy

ModelVue is designed for high-performance deployment using modern CI/CD pipelines.

## 1. Firebase App Hosting (Recommended)
This application is pre-configured for **Firebase App Hosting**, which provides seamless integration with Firebase Auth and Firestore.

### Steps:
1. **Connect Repository**: Connect your GitHub repository to Firebase App Hosting in the [Firebase Console](https://console.firebase.google.com/).
2. **Configuration**: The `apphosting.yaml` file defines the run configuration.
3. **Environment Variables**: Set `GEMINI_API_KEY` in the App Hosting secrets manager for GenAI features.

## 2. Vercel Deployment
ModelVue is fully compatible with Vercel's Edge network.

### Steps:
1. Import the project into Vercel.
2. Ensure the Framework Preset is set to **Next.js**.
3. Add Firebase configuration variables (from `src/firebase/config.ts`) if you prefer to use environment variables instead of the hardcoded config.

## 3. Build Optimizations
The build pipeline includes several optimizations:
- **Standalone Output**: Enabled in `next.config.ts` to reduce container size.
- **Dynamic Imports**: 3D loaders are lazy-loaded to keep initial JS bundles small.
- **Asset Hashing**: Next.js automatically handles caching and invalidation of static assets.

## 4. Environment Configuration
Ensure the following variables are available in your production environment:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `GEMINI_API_KEY` (Server-side only)

## 5. Performance Monitoring
- Use **Next.js Speed Insights** to monitor Core Web Vitals.
- Monitor **Firestore Usage** in the Google Cloud Console to ensure query efficiency.
