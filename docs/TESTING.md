
# ModelVue Testing Strategy

ModelVue follows a multi-layered testing approach to ensure the reliability of the 3D rendering pipeline and UI state management.

## 1. Unit Testing (Vitest)
- **File Validation**: Tests in `src/lib/__tests__/file-validation.test.ts` ensure security constraints (size, extension, sanitization) are met.
- **Loader Routing**: Tests in `src/lib/__tests__/loader-manager.test.ts` verify that files are mapped to the correct Three.js loaders.
- **State Logic**: Store actions in Zustand are tested for predictable transitions.

## 2. Integration Testing (React Testing Library)
- **Model Viewer Flow**: Verifies that dropping a file triggers the `isLoading` state and eventually displays the metadata panels.
- **Scene Controls**: Ensures toggling UI switches updates the global store and propagates to the Three.js canvas.

## 3. End-to-End (E2E) Strategy
- **Framework**: We recommend Playwright for E2E testing.
- **Key Scenarios**:
  - Drag-and-drop a .glb file onto the browser window.
  - Verify the 3D canvas initializes.
  - Verify metadata (Polygon count, format) is correctly parsed and displayed.
  - Test the "Save to Profile" flow with Firebase Auth mocking.

## 4. Edge Case Handling
- **Corrupted Files**: The `LoaderManager` handles parser errors and surfaces them via `useViewerStore.setError()`.
- **Large Meshes**: Performance benchmarks should be run on files near the 50MB limit to ensure the browser doesn't crash.
- **Offline Access**: Verify that the viewer still functions for local file analysis when disconnected from Firebase.

## Running Tests
```bash
npm test          # Run all tests
npm run test:run  # Run tests once (CI)
```
