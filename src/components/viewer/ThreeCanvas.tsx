"use client"

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { fitModelToView, loadModel, disposeObject } from '@/lib/three-utils';
import { useViewerStore } from '@/store/use-viewer-store';

/**
 * Interactive Camera and Rendering System.
 * Implements OrbitControls for rotation, zoom, and panning.
 * Handles strict lifecycle management for resource cleanup.
 */
const ThreeCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);
  const axesHelperRef = useRef<THREE.AxesHelper | null>(null);

  // Store Subscriptions
  const file = useViewerStore((state) => state.file);
  const fitToViewTrigger = useViewerStore((state) => state.fitTrigger);
  const resetCameraTrigger = useViewerStore((state) => state.resetTrigger);
  const showGrid = useViewerStore((state) => state.showGrid);
  const showAxes = useViewerStore((state) => state.showAxes);
  const wireframe = useViewerStore((state) => state.wireframe);
  
  const setMetadata = useViewerStore((state) => state.setMetadata);
  const setError = useViewerStore((state) => state.setError);
  const setIsLoading = useViewerStore((state) => state.setIsLoading);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. SCENE INITIALIZATION
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x21252C);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    camera.position.set(20, 20, 20);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance' 
    });
    
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 2. CAMERA CONTROLS
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = true;
    controlsRef.current = controls;

    // 3. LIGHTING
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight.position.set(5, 10, 7.5);
    scene.add(dirLight);

    // 4. HELPERS
    const gridHelper = new THREE.GridHelper(100, 100, 0x2E81FF, 0x333333);
    gridHelper.visible = showGrid;
    scene.add(gridHelper);
    gridHelperRef.current = gridHelper;

    const axesHelper = new THREE.AxesHelper(5);
    axesHelper.visible = showAxes;
    scene.add(axesHelper);
    axesHelperRef.current = axesHelper;

    // 5. RENDER LOOP
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (controlsRef.current) controlsRef.current.update();
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    // CLEANUP ON UNMOUNT
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      
      if (modelRef.current) {
        disposeObject(modelRef.current);
      }

      if (rendererRef.current) {
        rendererRef.current.dispose();
      }

      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Sync helpers visibility
  useEffect(() => {
    if (gridHelperRef.current) gridHelperRef.current.visible = showGrid;
    if (axesHelperRef.current) axesHelperRef.current.visible = showAxes;
  }, [showGrid, showAxes]);

  // Sync wireframe mode
  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach(m => m.wireframe = wireframe);
          } else {
            mesh.material.wireframe = wireframe;
          }
        }
      });
    }
  }, [wireframe]);

  // Model Loading & Swapping Pipeline
  useEffect(() => {
    if (!sceneRef.current) return;

    // Handle File Reset
    if (!file) {
      if (modelRef.current) {
        sceneRef.current.remove(modelRef.current);
        disposeObject(modelRef.current);
        modelRef.current = null;
      }
      return;
    }

    const runPipeline = async () => {
      setIsLoading(true);
      
      // Clean up previous model resources
      if (modelRef.current) {
        sceneRef.current?.remove(modelRef.current);
        disposeObject(modelRef.current);
        modelRef.current = null;
      }

      try {
        const object = await loadModel(file);
        modelRef.current = object;
        sceneRef.current?.add(object);

        if (cameraRef.current && controlsRef.current) {
          fitModelToView(object, cameraRef.current, controlsRef.current);
        }

        // Extract metadata
        const box = new THREE.Box3().setFromObject(object);
        const size = box.getSize(new THREE.Vector3());
        let polyCount = 0;
        object.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.frustumCulled = true; 
            if (mesh.geometry.attributes.position) {
              polyCount += mesh.geometry.attributes.position.count / 3;
            }
          }
        });

        setMetadata({
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          dimensions: `${size.x.toFixed(2)} x ${size.y.toFixed(2)} x ${size.z.toFixed(2)}`,
          polygons: Math.floor(polyCount).toLocaleString(),
          format: file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN'
        });
      } catch (err: any) {
        setError(err.message || 'Failed to load model');
      } finally {
        setIsLoading(false);
      }
    };

    runPipeline();
  }, [file, setMetadata, setError, setIsLoading]);

  // Handle interaction triggers from store
  useEffect(() => {
    if (fitToViewTrigger > 0 && modelRef.current && cameraRef.current && controlsRef.current) {
      fitModelToView(modelRef.current, cameraRef.current, controlsRef.current);
    }
  }, [fitToViewTrigger]);

  useEffect(() => {
    if (resetCameraTrigger > 0 && cameraRef.current && controlsRef.current) {
      controlsRef.current.reset();
      cameraRef.current.position.set(20, 20, 20);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  }, [resetCameraTrigger]);

  return (
    <div 
      ref={containerRef} 
      className="canvas-container" 
      role="img" 
      aria-label="3D Model Viewer Scene"
      tabIndex={0}
    />
  );
};

export default ThreeCanvas;
