# ModelVue Accessibility Guide

ModelVue is designed to be accessible to all users, including those relying on assistive technologies or keyboard-only navigation.

## Core Accessibility Features

1.  **Keyboard Navigation**:
    - All interactive elements (buttons, inputs, labels) are focusable and reachable via the `Tab` key.
    - Custom label buttons for file uploads handle `Enter` and `Space` keys for activation.
    - `ThreeCanvas` is focusable to allow for future keyboard-based rotation controls.

2.  **ARIA Landmarks**:
    - `main`: Assigned to the core viewer layout.
    - `aside`: Used for the sidebar properties and settings panel.
    - `nav`: Used for the bottom floating controls.
    - `role="img"`: Assigned to the Three.js canvas with a descriptive `aria-label`.

3.  **Screen Reader Support**:
    - `aria-live="polite"`: Used for non-interruptive state updates (e.g., "Analyzing geometry...").
    - `aria-live="assertive"`: Used for critical error reporting.
    - Tooltips provide contextual help and are properly associated with their trigger buttons.

4.  **Visual Contrast**:
    - The dark theme uses high-contrast text and interactive elements (`#2E81FF` on dark backgrounds) to ensure readability for users with visual impairments.

## Accessibility Checklist

- [x] All buttons have unique `aria-label` descriptors.
- [x] Semantic HTML tags (`aside`, `nav`, `main`) are used for layout landmarks.
- [x] Interactive components from ShadCN UI (Radix-based) maintain their native accessibility roles.
- [x] Drag-and-drop overlay uses `aria-hidden` patterns when inactive to prevent interference.
- [x] Loading and error states use ARIA live regions to notify screen readers of session changes.

## Future Improvements

- Implementation of keyboard-only rotation and zooming within the `ThreeCanvas`.
- High-contrast mode toggle for extreme visual environments.
- Detailed screen reader descriptions for complex 3D meshes using metadata summaries.