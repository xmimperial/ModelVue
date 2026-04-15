
# ModelVue Developer Guide

This guide outlines the technical architecture, coding standards, and best practices for developing on ModelVue.

## 1. Core Architecture

ModelVue is built using:
- **Framework**: Next.js 15 (App Router)
- **3D Engine**: Three.js
- **State Management**: Zustand
- **Backend**: Firebase (Auth & Firestore)
- **UI Components**: ShadCN UI + Tailwind CSS

## 2. The Rendering Pipeline

The 3D model processing follows a strict lifecycle to ensure performance and memory safety:

1.  **UPLOAD**: File received via `DropOverlay` or `FilePicker`.
2.  **PARSE**: `LoaderManager` dynamically imports the correct Three.js loader (lazy-loaded).
3.  **NORMALIZE**: `fitModelToView` centers the model and scales the camera.
4.  **RENDER**: `ThreeCanvas` handles the WebGL render loop with `OrbitControls`.
5.  **DISPOSE**: `disposeObject` recursively cleans up GPU resources (geometries, materials, textures) on model swap or unmount.

## 3. State Management (Zustand)

Global state is managed in `src/store/use-viewer-store.ts`. 
- **Guideline**: Only subscribe to the specific slice of state needed to prevent unnecessary re-renders.
- **Example**: `const showGrid = useViewerStore(state => state.showGrid);`

## 4. Firebase Usage

- **Auth**: Use the `useUser` hook for authentication state.
- **Firestore**: Use `useCollection` and `useDoc` hooks for real-time data.
- **Mutations**: Use non-blocking update functions from `src/firebase/non-blocking-updates.tsx` to handle writes without blocking the UI.

## 5. Coding Standards

- **TypeScript**: Use strict typing. Avoid `any` whenever possible.
- **Components**: Prefer functional components and ShadCN primitives.
- **Cleanup**: Always ensure `useEffect` cleanup functions dispose of Three.js objects.
- **Formatting**: Run `npm run format` before committing to maintain consistent code style.

## 6. Testing

- **Unit Tests**: Place in `src/lib/__tests__/`.
- **Command**: `npm test` or `npm run test:ui` for the interactive dashboard.

## 7. Useful Commands

- `npm run dev`: Start development server.
- `npm run lint`: Check for linting errors.
- `npm run typecheck`: Run full TypeScript compiler check.
- `npm run format`: Format all files with Prettier.
