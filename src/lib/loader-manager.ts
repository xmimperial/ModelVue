/**
 * @fileOverview Dynamic Loader Management System for ModelVue
 * 
 * This module handles the complexity of mapping file extensions to their 
 * respective Three.js loaders and managing the asynchronous loading process.
 */

import * as THREE from 'three';

export type SupportedFormat = 'gltf' | 'glb' | 'obj' | 'fbx' | 'stl' | 'ply' | 'dae' | '3mf' | '3ds' | 'amf' | 'wrl';

/**
 * Registry of dynamic loader importers.
 * We use dynamic imports to keep the main bundle light.
 */
const LOADER_MAPPING: Record<string, () => Promise<any>> = {
  glb: () => import('three/examples/jsm/loaders/GLTFLoader.js'),
  gltf: () => import('three/examples/jsm/loaders/GLTFLoader.js'),
  obj: () => import('three/examples/jsm/loaders/OBJLoader.js'),
  fbx: () => import('three/examples/jsm/loaders/FBXLoader.js'),
  stl: () => import('three/examples/jsm/loaders/STLLoader.js'),
  ply: () => import('three/examples/jsm/loaders/PLYLoader.js'),
  dae: () => import('three/examples/jsm/loaders/ColladaLoader.js'),
  '3mf': () => import('three/examples/jsm/loaders/3MFLoader.js'),
  '3ds': () => import('three/examples/jsm/loaders/TDSLoader.js'),
  amf: () => import('three/examples/jsm/loaders/AMFLoader.js'),
  wrl: () => import('three/examples/jsm/loaders/VRMLLoader.js'),
};

/**
 * Loader Manager Class
 * Orchestrates the detection, mapping, and execution of the 3D file loading pipeline.
 */
export class LoaderManager {
  /**
   * Loads a 3D model file asynchronously.
   * @param file The File object from a drop or input event.
   * @returns A promise resolving to a THREE.Object3D.
   */
  static async load(file: File): Promise<THREE.Object3D> {
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    const importFn = LOADER_MAPPING[extension];

    if (!importFn) {
      throw new Error(`Format .${extension} is not supported by the loader manager.`);
    }

    const url = URL.createObjectURL(file);
    const cleanup = () => URL.revokeObjectURL(url);

    try {
      const module = await importFn();
      
      return await new Promise((resolve, reject) => {
        // Resolve the specific loader class from the imported module
        const LoaderClass = module.GLTFLoader || 
                          module.OBJLoader || 
                          module.FBXLoader || 
                          module.STLLoader || 
                          module.PLYLoader || 
                          module.ColladaLoader || 
                          module.ThreeMFLoader || 
                          module.TDSLoader || 
                          module.AMFLoader || 
                          module.VRMLLoader;

        if (!LoaderClass) {
          reject(new Error(`Failed to initialize loader for .${extension}`));
          return;
        }

        const loader = new LoaderClass();

        loader.load(
          url,
          (result: any) => {
            cleanup();
            
            // Normalize outputs (Some loaders return scenes, others geometries, others groups)
            if (result.scene) resolve(result.scene);
            else if (result instanceof THREE.BufferGeometry) {
              const material = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.5, metalness: 0.5 });
              resolve(new THREE.Mesh(result, material));
            } else if (result.isObject3D || result instanceof THREE.Object3D) {
              resolve(result);
            } else {
              reject(new Error('Loader returned an unrecognizable format.'));
            }
          },
          undefined,
          (err: any) => {
            cleanup();
            reject(err);
          }
        );
      });
    } catch (err) {
      cleanup();
      throw err;
    }
  }
}
