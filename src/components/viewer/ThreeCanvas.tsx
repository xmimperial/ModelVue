
"use client"

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { fitModelToView, loadModel } from '@/lib/three-utils';

interface ThreeCanvasProps {
  file: File | null;
  onModelLoaded?: (metadata: any) => void;
  onLoading?: (isLoading: boolean) => void;
  onError?: (error: string) => void;
  fitToViewTrigger?: number;
  resetCameraTrigger?: number;
}

const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  file,
  onModelLoaded,
  onLoading,
  onError,
  fitToViewTrigger,
  resetCameraTrigger
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const gridRef = useRef<THREE.GridHelper | null>(null);
  const axesRef = useRef<THREE.AxesHelper | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x21252C);
    sceneRef.current = scene;

    // Camera Setup
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    camera.position.set(5, 5, 5);
    cameraRef.current = camera;

    // Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Helpers
    const gridHelper = new THREE.GridHelper(20, 20, 0x2E81FF, 0x444444);
    gridRef.current = gridHelper;
    scene.add(gridHelper);

    const axesHelper = new THREE.AxesHelper(5);
    axesRef.current = axesHelper;
    scene.add(axesHelper);

    // Resize Handler
    const handleResize = () => {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    if (!file || !sceneRef.current) return;

    const handleModelLoading = async () => {
      onLoading?.(true);
      if (modelRef.current) {
        sceneRef.current?.remove(modelRef.current);
      }

      try {
        const object = await loadModel(file);
        modelRef.current = object;
        sceneRef.current?.add(object);

        if (cameraRef.current && controlsRef.current) {
          fitModelToView(object, cameraRef.current, controlsRef.current);
        }

        // Calculate basic metadata
        const box = new THREE.Box3().setFromObject(object);
        const size = box.getSize(new THREE.Vector3());
        let polyCount = 0;
        object.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            polyCount += (child as THREE.Mesh).geometry.attributes.position.count / 3;
          }
        });

        onModelLoaded?.({
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          dimensions: `${size.x.toFixed(2)} x ${size.y.toFixed(2)} x ${size.z.toFixed(2)}`,
          polygons: Math.floor(polyCount).toLocaleString(),
          format: file.name.split('.').pop()?.toUpperCase()
        });
      } catch (err: any) {
        onError?.(err.message || 'Failed to load model');
      } finally {
        onLoading?.(false);
      }
    };

    handleModelLoading();
  }, [file]);

  useEffect(() => {
    if (fitToViewTrigger && modelRef.current && cameraRef.current && controlsRef.current) {
      fitModelToView(modelRef.current, cameraRef.current, controlsRef.current);
    }
  }, [fitToViewTrigger]);

  useEffect(() => {
    if (resetCameraTrigger && cameraRef.current && controlsRef.current) {
      controlsRef.current.reset();
      cameraRef.current.position.set(5, 5, 5);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  }, [resetCameraTrigger]);

  return <div ref={containerRef} className="canvas-container" />;
};

export default ThreeCanvas;
