/**
 * @fileOverview 3D Rendering Pipeline Utilities for ModelVue
 * 
 * Focuses on scene manipulation, camera normalization, and resource disposal.
 * Delegating loading logic to LoaderManager.
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
 */
export function fitModelToView(object: THREE.Object3D, camera: THREE.PerspectiveCamera, controls: any) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3()).length();
  const center = box.getCenter(new THREE.Vector3());

  // Reset internal position to center the geometry at world (0,0,0)
  const offset = new THREE.Vector3().subVectors(new THREE.Vector3(0,0,0), center);
  object.position.add(offset);

  controls.reset();

  const halfSize = size * 0.5;
  const halfFov = THREE.MathUtils.degToRad(camera.fov * 0.5);
  const distance = halfSize / Math.tan(halfFov);

  camera.position.set(0, size * 0.5, distance * 1.5);
  camera.lookAt(0, 0, 0);
  
  controls.target.set(0, 0, 0);
  controls.update();
}

/**
 * Stage 5: Dispose - Recursively clean up Three.js objects to prevent memory leaks
 */
export function disposeObject(object: THREE.Object3D) {
  object.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      mesh.geometry.dispose();

      if (Array.isArray(mesh.material)) {
        mesh.material.forEach(material => disposeMaterial(material));
      } else {
        disposeMaterial(mesh.material);
      }
    }
  });
}

function disposeMaterial(material: THREE.Material) {
  material.dispose();
  
  // Dispose all textures
  for (const key in material) {
    const value = (material as any)[key];
    if (value && value instanceof THREE.Texture) {
      value.dispose();
    }
  }
}
