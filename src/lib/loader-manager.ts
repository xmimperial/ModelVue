/**
 * @fileOverview Dynamic Loader Management System for ModelVue
 * 
 * This module handles the complexity of mapping file extensions to their 
 * respective Three.js loaders and managing the asynchronous loading process.
 */

import * as THREE from 'three';

export type SupportedFormat = 
  | 'gltf' | 'glb' | 'obj' | 'fbx' | 'stl' | 'ply' | 'dae' 
  | '3mf' | '3ds' | 'amf' | 'wrl';

/**
 * Registry of dynamic loader importers using modern three/addons paths.
 */
const LOADER_MAPPING: Record<string, () => Promise<any>> = {
  glb: () => import('three/addons/loaders/GLTFLoader.js'),
  gltf: () => import('three/addons/loaders/GLTFLoader.js'),
  obj: () => import('three/addons/loaders/OBJLoader.js'),
  fbx: () => import('three/addons/loaders/FBXLoader.js'),
  stl: () => import('three/addons/loaders/STLLoader.js'),
  ply: () => import('three/addons/loaders/PLYLoader.js'),
  dae: () => import('three/addons/loaders/ColladaLoader.js'),
  '3mf': () => import('three/addons/loaders/3MFLoader.js'),
  '3ds': () => import('three/addons/loaders/TDSLoader.js'),
  amf: () => import('three/addons/loaders/AMFLoader.js'),
  wrl: () => import('three/addons/loaders/VRMLLoader.js'),
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
    
    // Industrial CAD formats that typically require server-side conversion or specialized heavy WASM
    const cadFormats = ['step', 'stp', 'iges', 'igs', 'brep', 'fcstd', 'ifc', 'bim', '3dm', 'off'];
    if (cadFormats.includes(extension)) {
      throw new Error(`Format .${extension} is a CAD or specialized industrial format. These require server-side conversion or specialized parsers not available in this client-side inspection mode.`);
    }

    const importFn = LOADER_MAPPING[extension];

    if (!importFn) {
      throw new Error(`Format .${extension} is not directly supported for browser-native inspection yet.`);
    }

    const url = URL.createObjectURL(file);
    const cleanup = () => URL.revokeObjectURL(url);

    try {
      const module = await importFn();
      
      return await new Promise((resolve, reject) => {
        // Dynamic resolution of the specific loader class from the imported module
        const LoaderClass = 
          module.GLTFLoader || 
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
          reject(new Error(`Failed to initialize parser for .${extension}`));
          return;
        }

        const loader = new LoaderClass();

        loader.load(
          url,
          (result: any) => {
            cleanup();
            
            // 1. Handle Scene/Group objects (GLTF, Collada, FBX, OBJ)
            if (result.scene && (result.scene.isObject3D || result.scene instanceof THREE.Object3D)) {
              resolve(result.scene);
              return;
            }
            
            // 2. Handle direct Object3D returns
            if (result.isObject3D || result instanceof THREE.Object3D) {
              resolve(result);
              return;
            }

            // 3. Handle BufferGeometry returns (STL, PLY)
            if (result.isBufferGeometry || result instanceof THREE.BufferGeometry) {
              const material = new THREE.MeshStandardMaterial({ 
                color: 0x888888, 
                roughness: 0.5, 
                metalness: 0.5,
                side: THREE.DoubleSide
              });
              resolve(new THREE.Mesh(result, material));
              return;
            }

            // 4. Nested structure fallback
            const fallback = result.group || result.object || (result.scenes && result.scenes[0]);
            if (fallback && (fallback.isObject3D || fallback instanceof THREE.Object3D)) {
              resolve(fallback);
              return;
            }

            reject(new Error(`The loader for .${extension} parsed the file but couldn't create a valid 3D scene.`));
          },
          undefined,
          (err: any) => {
            cleanup();
            console.error('Loader error:', err);
            reject(new Error(`Failed to parse the file structure for .${extension}. The file might be corrupted or in an incompatible sub-version.`));
          }
        );
      });
    } catch (err) {
      cleanup();
      console.error('Import error:', err);
      throw new Error(`The parser for .${extension} could not be initialized in this environment.`);
    }
  }
}
