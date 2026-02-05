/* eslint-disable react/no-unknown-property */
import React, { useMemo, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Center } from '@react-three/drei';
import * as THREE from 'three';
import { useVisualization } from '@/contexts/VisualizationContext';
import { useVolumetrics } from '@/hooks/useVolumetrics';

// Helper to create geometry from point cloud for surfaces
const SurfaceMesh = ({ points, color, opacity = 0.8, visible, zScale = 1 }) => {
  const meshRef = useRef();

  const geometry = useMemo(() => {
    if (!points || points.length === 0) return null;
    
    // Create a simple triangulation (PlaneGeometry perturbed) or Points for simplicity in Phase 3
    // Ideally use delaunay triangulation. For this demo, we'll use Points to visualize structure
    const positions = new Float32Array(points.length * 3);
    
    points.forEach((p, i) => {
      positions[i * 3] = p.x;
      positions[i * 3 + 1] = p.z * zScale; // Y is up in Three.js usually, but let's map Z to Y for depth
      positions[i * 3 + 2] = p.y;
    });

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [points, zScale]);

  if (!visible || !geometry) return null;

  return (
    <points ref={meshRef}>
      <primitive object={geometry} />
      <pointsMaterial size={4} color={color} sizeAttenuation={false} />
    </points>
  );
};

const SceneContent = () => {
    const { state: visState } = useVisualization();
    const { state: volState } = useVolumetrics();
    
    const surfaces = volState.data.surfaces || [];
    const zScale = visState.settings.verticalExaggeration;

    return (
        <group>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            
            {/* Grid helper */}
            {visState.settings.showGrid && (
                <Grid 
                    position={[0, 0, 0]} 
                    args={[10000, 10000]} 
                    cellColor="#6f6f6f" 
                    sectionColor="#9d4b4b" 
                    fadeDistance={50000}
                    infiniteGrid 
                />
            )}

            <Center>
                {visState.settings.showSurfaces && surfaces.map((surf, idx) => (
                    <SurfaceMesh 
                        key={surf.id} 
                        points={surf.points} 
                        color={idx === 0 ? '#ef4444' : '#3b82f6'} // Red for top, Blue for base (heuristic)
                        visible={true}
                        zScale={zScale * -1} // Invert Z for depth (negative is down)
                    />
                ))}
            </Center>

            <OrbitControls makeDefault />
        </group>
    );
};

const Canvas3D = () => {
  return (
    <div className="w-full h-full bg-slate-950">
      <Canvas camera={{ position: [100, 100, 100], fov: 50 }}>
        <SceneContent />
      </Canvas>
    </div>
  );
};

export default Canvas3D;