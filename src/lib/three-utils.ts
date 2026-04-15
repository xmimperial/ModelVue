
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';

export type SupportedFormat = 'gltf' | 'glb' | 'obj' | 'fbx' | 'stl' | 'ply';

export async function loadModel(file: File): Promise<THREE.Object3D> {
  const extension = file.name.split('.').pop()?.toLowerCase() as SupportedFormat;
  const url = URL.createObjectURL(file);

  return new Promise((resolve, reject) => {
    let loader: any;

    switch (extension) {
      case 'glb':
      case 'gltf':
        loader = new GLTFLoader();
        loader.load(url, (gltf: any) => resolve(gltf.scene), undefined, reject);
        break;
      case 'obj':
        loader = new OBJLoader();
        loader.load(url, resolve, undefined, reject);
        break;
      case 'fbx':
        loader = new FBXLoader();
        loader.load(url, resolve, undefined, reject);
        break;
      case 'stl':
        loader = new STLLoader();
        loader.load(url, (geometry: THREE.BufferGeometry) => {
          const material = new THREE.MeshStandardMaterial({ color: 0x888888 });
          resolve(new THREE.Mesh(geometry, material));
        }, undefined, reject);
        break;
      case 'ply':
        loader = new PLYLoader();
        loader.load(url, (geometry: THREE.BufferGeometry) => {
          geometry.computeVertexNormals();
          const material = new THREE.MeshStandardMaterial({ color: 0x888888 });
          resolve(new THREE.Mesh(geometry, material));
        }, undefined, reject);
        break;
      default:
        reject(new Error(`Format .${extension} is not supported directly in this preview.`));
    }
  });
}

export function fitModelToView(object: THREE.Object3D, camera: THREE.PerspectiveCamera, controls: any) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3()).length();
  const center = box.getCenter(new THREE.Vector3());

  controls.reset();

  const halfSize = size * 0.5;
  const halfFov = THREE.MathUtils.degToRad(camera.fov * 0.5);
  const distance = halfSize / Math.tan(halfFov);

  camera.position.copy(center);
  camera.position.z += distance * 1.5;
  camera.position.y += distance * 0.5;
  camera.position.x += distance * 0.5;
  
  camera.lookAt(center);
  controls.target.copy(center);
  controls.update();
}
