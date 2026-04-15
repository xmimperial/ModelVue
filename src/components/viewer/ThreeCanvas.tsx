
"use client"

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { fitModelToView, loadModel, disposeObject } from '@/lib/three-utils';
import { useViewerStore } from '@/store/use-viewer-store';

/**
 * Optimized Three.js Canvas component.
 * Features:
 * - WebGL Power Preference for discrete GPUs
 * - Pixel ratio capping for mobile performance
 * - Dynamic resource lifecycle management
 * - Frustum culling (default) and efficient render loop
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

    // SCENE INITIALIZATION
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x21252C);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      5000
    );
    camera.position.set(10, 10, 10);
    cameraRef.current = camera;

    // PERFORMANCE: Use high-performance power preference for complex models
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance' 
    });
    
    // PERFORMANCE: Cap pixel ratio at 2 to avoid huge performance hits on 4K/retina screens
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    // LIGHTING
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(10, 20, 15);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // HELPERS
    const gridHelper = new THREE.GridHelper(50, 50, 0x2E81FF, 0x333333);
    gridHelper.visible = showGrid;
    scene.add(gridHelper);
    gridHelperRef.current = gridHelper;

    const axesHelper = new THREE.AxesHelper(10);
    axesHelper.visible = showAxes;
    scene.add(axesHelper);
    axesHelperRef.current = axesHelper;

    // OPTIMIZED RENDER LOOP
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

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      if (modelRef.current) disposeObject(modelRef.current);
      renderer.dispose();
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Sync Scene Settings
  useEffect(() => {
    if (gridHelperRef.current) gridHelperRef.current.visible = showGrid;
    if (axesHelperRef.current) axesHelperRef.current.visible = showAxes;
  }, [showGrid, showAxes]);

  // Sync Wireframe
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

  // Model Lifecycle Management
  useEffect(() => {
    if (!file || !sceneRef.current) return;

    const handleModelLifecycle = async () => {
      setIsLoading(true);
      
      // DISPOSE PREVIOUS MODEL
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

        // METADATA EXTRACTION
        const box = new THREE.Box3().setFromObject(object);
        const size = box.getSize(new THREE.Vector3());
        let polyCount = 0;
        object.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            // Frustum Culling is on by default, ensuring efficient rendering of large scenes
            mesh.frustumCulled = true; 
            if (mesh.geometry.attributes.position) {
              polyCount += mesh.geometry.attributes.position.count / 3;
            }
            if (wireframe) {
              if (Array.isArray(mesh.material)) {
                mesh.material.forEach(m => m.wireframe = true);
              } else {
                mesh.material.wireframe = true;
              }
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

    handleModelLifecycle();
  }, [file, setMetadata, setError, setIsLoading]);

  // Handle Fit & Reset Triggers
  useEffect(() => {
    if (fitToViewTrigger > 0 && modelRef.current && cameraRef.current && controlsRef.current) {
      fitModelToView(modelRef.current, cameraRef.current, controlsRef.current);
    }
  }, [fitToViewTrigger]);

  useEffect(() => {
    if (resetCameraTrigger > 0 && cameraRef.current && controlsRef.current) {
      controlsRef.current.reset();
      cameraRef.current.position.set(10, 10, 10);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  }, [resetCameraTrigger]);

  return <div ref={containerRef} className="canvas-container" />;
};

export default ThreeCanvas;
