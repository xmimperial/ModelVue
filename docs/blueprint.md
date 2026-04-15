# **App Name**: ModelVue

## Core Features:

- Drag & Drop File Upload: Allow users to drag and drop 3D model files (supporting multiple specified formats) into a full-screen drop zone with the message 'Drag and drop 3D models here'. The drop area will highlight on hover and include text 'Supported formats: 3dm, 3ds, 3mf, amf, bim, brep, dae, fbx, fcstd, gltf, ifc, iges, step, stl, obj, off, ply, wrl'.
- Basic Model Rendering: Initialize a Three.js scene with a PerspectiveCamera, WebGLRenderer, basic lighting (AmbientLight, DirectionalLight), and display a grid/axes helper. Models are auto-scaled and centered within the viewport using a bounding box.
- Interactive Camera Controls: Provide OrbitControls for rotate, zoom, and pan functionalities, along with a 'Reset Camera' button and 'Fit-to-View' functionality to enhance model exploration.
- Support for Core 3D Formats: Natively handle specified 3D file formats (.gltf, .glb, .obj, .fbx, .stl, .ply) by routing them to appropriate Three.js loaders (.GLTFLoader, .OBJLoader, .FBXLoader, .STLLoader, .PLYLoader) for parsing and rendering.
- Model Metadata Display: Display basic file information and model metadata in a minimal side panel, including a loading spinner during parsing and error messages for unsupported formats.

## Style Guidelines:

- Dark color scheme to allow 3D models to stand out and provide a focused viewing environment.
- Primary color: Deep, technological blue (#2E81FF) for interactive elements and highlights, conveying precision and modernity.
- Background color: A subtle, dark charcoal with a hint of blue (#21252C) to ensure focus on the 3D content and minimize eye strain.
- Accent color: Vibrant cyan (#32DAED) for occasional accents and dynamic elements, providing visual energy and contrast.
- Headline and Body font: 'Inter' (sans-serif) for its highly legible, neutral, and objective aesthetic, well-suited for a technical application.
- Data/Structured Text font: 'Source Code Pro' (monospace) for displaying metadata and numerical information, ensuring clear alignment and readability.