/* eslint-disable react/no-unknown-property */
import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Tube } from '@react-three/drei';
import { useGlobalDataStore } from '@/store/globalDataStore';

const WellboreMesh = () => {
    const { activeWell, wellLogs } = useGlobalDataStore();
    
    // Memoize trajectory calculation
    const path = useMemo(() => {
        // Default vertical path if no well is active
        if (!activeWell || !wellLogs[activeWell]) {
             return new THREE.CatmullRomCurve3([
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(0, -100, 0)
            ]);
        }

        const logs = wellLogs[activeWell];
        // Look for a depth array to define length
        const depthKey = Object.keys(logs).find(k => k.toLowerCase().includes('depth') || k.toLowerCase() === 'md' || k.toLowerCase() === 'tvd');
        
        if (!depthKey || !logs[depthKey].value_array) {
             // Fallback for well with no logs
             return new THREE.CatmullRomCurve3([
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(0, -50, 0)
            ]);
        }

        const depths = logs[depthKey].value_array;
        // Filter out nulls/NaNs
        const validDepths = depths.filter(d => d !== null && !isNaN(d));
        
        if (validDepths.length < 2) {
             return new THREE.CatmullRomCurve3([
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(0, -50, 0)
            ]);
        }

        const maxDepth = Math.max(...validDepths);
        const minDepth = Math.min(...validDepths);
        
        // Simple vertical wellbore for now, scaled down
        // In a real app, we would parse deviation surveys here
        const points = [];
        const steps = 20;
        const interval = (maxDepth - minDepth) / steps;
        
        for(let i=0; i <= steps; i++) {
            const d = minDepth + (i * interval);
            // Invert Y for 3D visualization (down is negative Y)
            // Scale depth down by factor of 10 for better visualization
            points.push(new THREE.Vector3(0, -d/10, 0)); 
        }

        return new THREE.CatmullRomCurve3(points);

    }, [activeWell, wellLogs]);

    return (
        <group>
            <Tube args={[path, 64, 0.5, 8, false]}>
                <meshStandardMaterial color="#BFFF00" roughness={0.4} metalness={0.8} />
            </Tube>
        </group>
    );
};

export default WellboreMesh;