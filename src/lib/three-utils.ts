
/**
 * @fileOverview 3D Rendering Pipeline Module for ModelVue
 * 
 * Optimized for performance:
 * 1. Lazy Loading: Loaders are imported dynamically only when needed.
 * 2. Memory Efficiency: Explicit disposal of geometries, materials, and textures.
 * 3. Normalization: Standardized viewport fitting logic.
 */

import * as THREE from 'three';

export type SupportedFormat = 'gltf' | 'glb' | 'obj' | 'fbx' | 'stl' | 'ply';

/**
 * Stage 2: Parse - Asynchronously load the model using dynamic imports
 */
export async function loadModel(file: File): Promise<THREE.Object3D> {
  const extension = file.name.split('.').pop()?.toLowerCase() as SupportedFormat;
  const url = URL.createObjectURL(file);

  return new Promise(async (resolve, reject) => {
    const cleanupUrl = () => URL.revokeObjectURL(url);

    try {
      switch (extension) {
        case 'glb':
        case 'gltf': {
          const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
          const loader = new GLTFLoader();
          loader.load(url, (gltf) => {
            cleanupUrl();
            resolve(gltf.scene);
          }, undefined, (err) => {
            cleanupUrl();
            reject(err);
          });
          break;
        }
        case 'obj': {
          const { OBJLoader } = await import('three/examples/jsm/loaders/OBJLoader.js');
          const loader = new OBJLoader();
          loader.load(url, (obj) => {
            cleanupUrl();
            resolve(obj);
          }, undefined, (err) => {
            cleanupUrl();
            reject(err);
          });
          break;
        }
        case 'fbx': {
          const { FBXLoader } = await import('three/examples/jsm/loaders/FBXLoader.js');
          const loader = new FBXLoader();
          loader.load(url, (fbx) => {
            cleanupUrl();
            resolve(fbx);
          }, undefined, (err) => {
            cleanupUrl();
            reject(err);
          });
          break;
        }
        case 'stl': {
          const { STLLoader } = await import('three/examples/jsm/loaders/STLLoader.js');
          const loader = new STLLoader();
          loader.load(url, (geometry) => {
            cleanupUrl();
            const material = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.5, metalness: 0.5 });
            resolve(new THREE.Mesh(geometry, material));
          }, undefined, (err) => {
            cleanupUrl();
            reject(err);
          });
          break;
        }
        case 'ply': {
          const { PLYLoader } = await import('three/examples/jsm/loaders/PLYLoader.js');
          const loader = new PLYLoader();
          loader.load(url, (geometry) => {
            cleanupUrl();
            geometry.computeVertexNormals();
            const material = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.5, metalness: 0.5 });
            resolve(new THREE.Mesh(geometry, material));
          }, undefined, (err) => {
            cleanupUrl();
            reject(err);
          });
          break;
        }
        default:
          cleanupUrl();
          reject(new Error(`Format .${extension} is not supported natively in the optimized pipeline.`));
      }
    } catch (err) {
      cleanupUrl();
      reject(err);
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
