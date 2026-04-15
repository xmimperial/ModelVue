/**
 * @fileOverview 3D Rendering Pipeline Utilities for ModelVue
 * 
 * FOCUS: Camera interaction, scene normalization, and resource lifecycle.
 * 
 * LIFECYCLE FLOW:
 * 1. UPLOAD    - File received from DropZone/Input
 * 2. PARSE     - LoaderManager dynamically imports correct parser
 * 3. NORMALIZE - Center geometry and scale camera (fitModelToView)
 * 4. RENDER    - ThreeCanvas update loop handles frame drawing
 * 5. DISPOSE   - Recursive cleanup of GPU resources
 */

import * as THREE from 'three';
import { LoaderManager } from './loader-manager';

/**
 * Stage 2: Parse - Asynchronously load the model using the LoaderManager
 */
export async function loadModel(file: File): Promise<THREE.Object3D> {
  return LoaderManager.load(file);
}

/**
 * Stage 3: Normalize - Center and scale the model for the viewport
 * Uses bounding box logic to ensure any model size fits the screen.
 */
export function fitModelToView(
  object: THREE.Object3D, 
  camera: THREE.PerspectiveCamera, 
  controls: any
) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  // Center the model relative to world (0,0,0)
  object.position.x += (object.position.x - center.x);
  object.position.y += (object.position.y - center.y);
  object.position.z += (object.position.z - center.z);

  // Calculate required camera distance
  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = camera.fov * (Math.PI / 180);
  let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));

  // Multiplier to ensure some padding around the model
  cameraZ *= 2.0; 

  camera.position.set(cameraZ, cameraZ, cameraZ);
  
  // Set controls limit and target
  const minZ = box.min.z;
  const cameraToFarEdge = (minZ < 0) ? -minZ + cameraZ : cameraZ - minZ;

  camera.far = cameraToFarEdge * 10;
  camera.updateProjectionMatrix();

  if (controls) {
    controls.target.set(0, 0, 0);
    controls.maxDistance = cameraZ * 10;
    controls.update();
  }
}

/**
 * Stage 5: Dispose - Recursively clean up Three.js objects to prevent memory leaks.
 * This function ensures that geometries, materials, and textures are explicitly
 * removed from the GPU.
 */
export function disposeObject(object: THREE.Object3D | null) {
  if (!object) return;

  object.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      
      // Dispose Geometry
      if (mesh.geometry) {
        mesh.geometry.dispose();
      }

      // Dispose Materials
      if (mesh.material) {
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(material => disposeMaterial(material));
        } else {
          disposeMaterial(mesh.material);
        }
      }
    }
  });
}

/**
 * Internal helper to dispose of a material and its associated textures.
 */
function disposeMaterial(material: THREE.Material) {
  material.dispose();
  
  // Explicitly dispose all textures to free up VRAM
  for (const key in material) {
    const value = (material as any)[key];
    if (value && value instanceof THREE.Texture) {
      value.dispose();
    }
  }
}
