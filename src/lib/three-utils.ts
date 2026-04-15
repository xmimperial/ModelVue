
/**
 * @fileOverview 3D Rendering Pipeline Module for ModelVue
 * 
 * This module defines the core lifecycle of the 3D model processing:
 * 1. Upload/Ingest: Receive raw file data.
 * 2. Parse/Detect: Identify format and route to appropriate Three.js loader.
 * 3. Normalize: Center the geometry and scale it to fit the standard viewport.
 * 4. Cleanup: Explicitly dispose of GPU-bound resources (geometries, materials, textures).
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';

export type SupportedFormat = 'gltf' | 'glb' | 'obj' | 'fbx' | 'stl' | 'ply';

/**
 * Stage 2: Parse - Asynchronously load the model based on extension
 */
export async function loadModel(file: File): Promise<THREE.Object3D> {
  const extension = file.name.split('.').pop()?.toLowerCase() as SupportedFormat;
  const url = URL.createObjectURL(file);

  return new Promise((resolve, reject) => {
    let loader: any;

    const cleanupUrl = () => URL.revokeObjectURL(url);

    switch (extension) {
      case 'glb':
      case 'gltf':
        loader = new GLTFLoader();
        loader.load(url, (gltf: any) => {
          cleanupUrl();
          resolve(gltf.scene);
        }, undefined, (err: any) => {
          cleanupUrl();
          reject(err);
        });
        break;
      case 'obj':
        loader = new OBJLoader();
        loader.load(url, (obj: THREE.Object3D) => {
          cleanupUrl();
          resolve(obj);
        }, undefined, (err: any) => {
          cleanupUrl();
          reject(err);
        });
        break;
      case 'fbx':
        loader = new FBXLoader();
        loader.load(url, (fbx: THREE.Object3D) => {
          cleanupUrl();
          resolve(fbx);
        }, undefined, (err: any) => {
          cleanupUrl();
          reject(err);
        });
        break;
      case 'stl':
        loader = new STLLoader();
        loader.load(url, (geometry: THREE.BufferGeometry) => {
          cleanupUrl();
          const material = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.5, metalness: 0.5 });
          resolve(new THREE.Mesh(geometry, material));
        }, undefined, (err: any) => {
          cleanupUrl();
          reject(err);
        });
        break;
      case 'ply':
        loader = new PLYLoader();
        loader.load(url, (geometry: THREE.BufferGeometry) => {
          cleanupUrl();
          geometry.computeVertexNormals();
          const material = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.5, metalness: 0.5 });
          resolve(new THREE.Mesh(geometry, material));
        }, undefined, (err: any) => {
          cleanupUrl();
          reject(err);
        });
        break;
      default:
        cleanupUrl();
        reject(new Error(`Format .${extension} is not supported natively.`));
    }
  });
}

/**
 * Stage 3: Normalize - Center and scale the model for the viewport
 */
export function fitModelToView(object: THREE.Object3D, camera: THREE.PerspectiveCamera, controls: any) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3()).length();
  const center = box.getCenter(new THREE.Vector3());

  // Center the model relative to its own bounding box
  object.position.x += (object.position.x - center.x);
  object.position.y += (object.position.y - center.y);
  object.position.z += (object.position.z - center.z);

  controls.reset();

  const halfSize = size * 0.5;
  const halfFov = THREE.MathUtils.degToRad(camera.fov * 0.5);
  const distance = halfSize / Math.tan(halfFov);

  camera.position.set(center.x, center.y, center.z);
  camera.position.z += distance * 1.5;
  camera.position.y += distance * 0.5;
  camera.position.x += distance * 0.5;
  
  camera.lookAt(center);
  controls.target.copy(center);
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
  
  // Dispose textures attached to material
  for (const key in material) {
    const value = (material as any)[key];
    if (value && value instanceof THREE.Texture) {
      value.dispose();
    }
  }
}
