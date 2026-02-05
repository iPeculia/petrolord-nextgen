/* eslint-disable react/no-unknown-property */
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Stars } from '@react-three/drei';
import WellboreMesh from './WellboreMesh';
import { useVisualization3DStore } from '@/modules/geoscience/petrophysical-analysis/store/visualization3DStore';

const Scene3D = () => {
  const { settings } = useVisualization3DStore();

  return (
    <Canvas camera={{ position: [50, 50, 50], fov: 50 }}>
      <Suspense fallback={null}>
        <color attach="background" args={[settings.backgroundColor]} />
        
        <ambientLight intensity={0.4} color="#ffffff" />
        {/* Fixed: skyColor is not a valid prop for hemisphereLight in R3F/Three, use color for sky */}
        <hemisphereLight intensity={0.5} groundColor="#000000" color="#ffffff" />
        <directionalLight position={[10, 20, 10]} intensity={1.2} castShadow />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#BFFF00" />

        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

        {/* Controls */}
        <OrbitControls makeDefault />

        {/* Helpers */}
        {settings.showGrid && (
          <Grid 
            args={[200, 200]} 
            cellSize={10} 
            cellThickness={0.5} 
            cellColor="#64748b" 
            sectionSize={50} 
            sectionThickness={1}
            sectionColor="#94a3b8"
            fadeDistance={150}
            position={[0, -50, 0]}
          />
        )}

        {settings.showAxes && <axesHelper args={[20]} />}

        {/* Content */}
        {settings.showTrajectory && <WellboreMesh />}

      </Suspense>
    </Canvas>
  );
};

export default Scene3D;