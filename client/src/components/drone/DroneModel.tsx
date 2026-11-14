import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface DroneModelProps {
  selectedHotspot: number | null;
  onSelectHotspot: (id: number) => void;
  activeStage?: number; // 1: Scan, 2: Detect, 3: Apply, 4: Wipe, 5: Finish, 6: Verify
}

export const DroneModel: React.FC<DroneModelProps> = ({
  selectedHotspot,
  onSelectHotspot,
  activeStage = 1
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const prop1Ref = useRef<THREE.Group>(null);
  const prop2Ref = useRef<THREE.Group>(null);
  const prop3Ref = useRef<THREE.Group>(null);
  const prop4Ref = useRef<THREE.Group>(null);
  const lidarRef = useRef<THREE.Group>(null);
  const rollerRef = useRef<THREE.Mesh>(null);
  const scanConeRef = useRef<THREE.Mesh>(null);

  // Animation frame loop: spin propellers, rotate LiDAR, gently hover
  useFrame((state, delta) => {
    // Propeller spinning
    const propSpeed = 24;
    if (prop1Ref.current) prop1Ref.current.rotation.y += propSpeed * delta;
    if (prop2Ref.current) prop2Ref.current.rotation.y -= propSpeed * delta;
    if (prop3Ref.current) prop3Ref.current.rotation.y += propSpeed * delta;
    if (prop4Ref.current) prop4Ref.current.rotation.y -= propSpeed * delta;

    // LiDAR rotation
    if (lidarRef.current) {
      lidarRef.current.rotation.y += 4 * delta;
    }

    // Microfiber roller rotation during wipe stage or idle
    if (rollerRef.current) {
      rollerRef.current.rotation.x += (activeStage === 4 ? 12 : 2) * delta;
    }

    // Gentle hover bobbing
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.08;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.8) * 0.02;
    }

    // Pulse scanning cone opacity
    if (scanConeRef.current && (scanConeRef.current.material as THREE.MeshBasicMaterial)) {
      (scanConeRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.18 + Math.sin(state.clock.elapsedTime * 4) * 0.08;
    }
  });

  // Carbon / Metallic Materials
  const chassisMaterial = new THREE.MeshStandardMaterial({
    color: '#091426',
    metalness: 0.85,
    roughness: 0.25
  });

  const armMaterial = new THREE.MeshStandardMaterial({
    color: '#050B16',
    metalness: 0.9,
    roughness: 0.35
  });

  const titaniumMaterial = new THREE.MeshStandardMaterial({
    color: '#1E293B',
    metalness: 0.9,
    roughness: 0.2
  });

  const cyanLedMaterial = new THREE.MeshBasicMaterial({
    color: '#00D9FF'
  });

  const propMaterial = new THREE.MeshStandardMaterial({
    color: '#0A192F',
    metalness: 0.4,
    roughness: 0.3,
    transparent: true,
    opacity: 0.85
  });

  const isHighlighted = (id: number) => selectedHotspot === id;

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* ========================================================== */}
      {/* 1. CENTRAL FUSELAGE CHASSIS                                 */}
      {/* ========================================================== */}
      <mesh position={[0, 0, 0]} material={chassisMaterial} castShadow>
        <boxGeometry args={[1.1, 0.45, 1.8]} />
      </mesh>

      {/* Aerodynamic Cockpit Hood */}
      <mesh position={[0, 0.28, 0.1]} material={titaniumMaterial} castShadow>
        <cylinderGeometry args={[0.42, 0.55, 0.2, 8]} />
      </mesh>

      {/* LED Telemetry Accent Strips */}
      <mesh position={[0.56, 0.05, 0]}>
        <boxGeometry args={[0.03, 0.08, 1.6]} />
        <primitive object={cyanLedMaterial} />
      </mesh>
      <mesh position={[-0.56, 0.05, 0]}>
        <boxGeometry args={[0.03, 0.08, 1.6]} />
        <primitive object={cyanLedMaterial} />
      </mesh>

      {/* ========================================================== */}
      {/* 2. BOOM ARMS & MOTORS (QUAD-ROTOR CONFIGURATION)           */}
      {/* ========================================================== */}
      {/* Front-Right Arm */}
      <group position={[0.5, 0.05, 0.6]} rotation={[0, -Math.PI / 4, 0]}>
        <mesh position={[0.9, 0, 0]} material={armMaterial} castShadow>
          <boxGeometry args={[1.8, 0.1, 0.14]} />
        </mesh>
        {/* Motor Hub */}
        <mesh position={[1.8, 0.1, 0]} material={titaniumMaterial}>
          <cylinderGeometry args={[0.22, 0.22, 0.25, 16]} />
        </mesh>
        {/* Propeller 1 */}
        <group ref={prop1Ref} position={[1.8, 0.24, 0]}>
          <mesh material={propMaterial}>
            <boxGeometry args={[1.6, 0.02, 0.16]} />
          </mesh>
          <mesh position={[0, 0.04, 0]} material={cyanLedMaterial}>
            <sphereGeometry args={[0.06, 12, 12]} />
          </mesh>
        </group>
      </group>

      {/* Front-Left Arm */}
      <group position={[-0.5, 0.05, 0.6]} rotation={[0, Math.PI / 4, 0]}>
        <mesh position={[-0.9, 0, 0]} material={armMaterial} castShadow>
          <boxGeometry args={[1.8, 0.1, 0.14]} />
        </mesh>
        <mesh position={[-1.8, 0.1, 0]} material={titaniumMaterial}>
          <cylinderGeometry args={[0.22, 0.22, 0.25, 16]} />
        </mesh>
        {/* Propeller 2 */}
        <group ref={prop2Ref} position={[-1.8, 0.24, 0]}>
          <mesh material={propMaterial}>
            <boxGeometry args={[1.6, 0.02, 0.16]} />
          </mesh>
          <mesh position={[0, 0.04, 0]} material={cyanLedMaterial}>
            <sphereGeometry args={[0.06, 12, 12]} />
          </mesh>
        </group>
      </group>

      {/* Rear-Right Arm */}
      <group position={[0.5, 0.05, -0.6]} rotation={[0, Math.PI / 4, 0]}>
        <mesh position={[0.9, 0, 0]} material={armMaterial} castShadow>
          <boxGeometry args={[1.8, 0.1, 0.14]} />
        </mesh>
        <mesh position={[1.8, 0.1, 0]} material={titaniumMaterial}>
          <cylinderGeometry args={[0.22, 0.22, 0.25, 16]} />
        </mesh>
        {/* Propeller 3 */}
        <group ref={prop3Ref} position={[1.8, 0.24, 0]}>
          <mesh material={propMaterial}>
            <boxGeometry args={[1.6, 0.02, 0.16]} />
          </mesh>
          <mesh position={[0, 0.04, 0]} material={cyanLedMaterial}>
            <sphereGeometry args={[0.06, 12, 12]} />
          </mesh>
        </group>
      </group>

      {/* Rear-Left Arm */}
      <group position={[-0.5, 0.05, -0.6]} rotation={[0, -Math.PI / 4, 0]}>
        <mesh position={[-0.9, 0, 0]} material={armMaterial} castShadow>
          <boxGeometry args={[1.8, 0.1, 0.14]} />
        </mesh>
        <mesh position={[-1.8, 0.1, 0]} material={titaniumMaterial}>
          <cylinderGeometry args={[0.22, 0.22, 0.25, 16]} />
        </mesh>
        {/* Propeller 4 */}
        <group ref={prop4Ref} position={[-1.8, 0.24, 0]}>
          <mesh material={propMaterial}>
            <boxGeometry args={[1.6, 0.02, 0.16]} />
          </mesh>
          <mesh position={[0, 0.04, 0]} material={cyanLedMaterial}>
            <sphereGeometry args={[0.06, 12, 12]} />
          </mesh>
        </group>
      </group>

      {/* ========================================================== */}
      {/* 3. HOTSPOT 1: LIDAR & SPATIAL PROXIMITY SUITE              */}
      {/* ========================================================== */}
      <group position={[0, 0.42, 0]}>
        <mesh material={titaniumMaterial}>
          <cylinderGeometry args={[0.3, 0.35, 0.15, 24]} />
        </mesh>
        {/* Rotating LiDAR optics turret */}
        <group ref={lidarRef} position={[0, 0.1, 0]}>
          <mesh>
            <cylinderGeometry args={[0.25, 0.25, 0.12, 24]} />
            <meshStandardMaterial
              color={isHighlighted(1) ? '#65F4FF' : '#0B1E38'}
              emissive={isHighlighted(1) ? '#00D9FF' : '#003366'}
              emissiveIntensity={isHighlighted(1) ? 2.5 : 0.6}
            />
          </mesh>
          <mesh position={[0.2, 0, 0]}>
            <boxGeometry args={[0.08, 0.06, 0.12]} />
            <meshBasicMaterial color="#00D9FF" />
          </mesh>
        </group>

        {/* 3D Hotspot Button 1 */}
        <Html position={[0, 0.45, 0]} center distanceFactor={10}>
          <button
            onClick={() => onSelectHotspot(1)}
            className={`p-1.5 rounded-full border transition-all duration-300 ${
              isHighlighted(1)
                ? 'bg-primary text-background border-white scale-125 shadow-glow-cyan'
                : 'bg-surface/90 text-primary border-primary/50 hover:scale-110'
            }`}
            title="Inspect Distance & Proximity Sensors"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
          </button>
        </Html>
      </group>

      {/* ========================================================== */}
      {/* 4. HOTSPOT 2: AI DIRT DETECTION STEREO GIMBAL              */}
      {/* ========================================================== */}
      <group position={[0, 0.05, 0.95]}>
        {/* Gimbal Bracket */}
        <mesh material={titaniumMaterial}>
          <boxGeometry args={[0.45, 0.28, 0.2]} />
        </mesh>
        {/* Dual Stereo Optical Lenses */}
        <mesh position={[-0.12, 0, 0.11]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.06, 16]} />
          <meshStandardMaterial
            color="#00D9FF"
            emissive={isHighlighted(2) ? '#65F4FF' : '#00A8C6'}
            emissiveIntensity={isHighlighted(2) ? 3 : 1}
          />
        </mesh>
        <mesh position={[0.12, 0, 0.11]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.06, 16]} />
          <meshStandardMaterial
            color="#00D9FF"
            emissive={isHighlighted(2) ? '#65F4FF' : '#00A8C6'}
            emissiveIntensity={isHighlighted(2) ? 3 : 1}
          />
        </mesh>

        {/* Projected AI Scanning Fan Cone (Visible in Scan / Detect stages) */}
        <mesh
          ref={scanConeRef}
          position={[0, -0.2, 1.2]}
          rotation={[-Math.PI / 6, 0, 0]}
        >
          <coneGeometry args={[1.2, 2.2, 16, 1, true]} />
          <meshBasicMaterial
            color="#00D9FF"
            wireframe
            transparent
            opacity={0.22}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* 3D Hotspot Button 2 */}
        <Html position={[0, 0.25, 0.15]} center distanceFactor={10}>
          <button
            onClick={() => onSelectHotspot(2)}
            className={`p-1.5 rounded-full border transition-all duration-300 ${
              isHighlighted(2)
                ? 'bg-primary text-background border-white scale-125 shadow-glow-cyan'
                : 'bg-surface/90 text-primary border-primary/50 hover:scale-110'
            }`}
            title="Inspect AI Dirt Detection Camera"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
          </button>
        </Html>
      </group>

      {/* ========================================================== */}
      {/* 5. HOTSPOT 3: HYBRID CLEANING MODULE (UNDERBELLY)          */}
      {/* ========================================================== */}
      <group position={[0, -0.32, 0]}>
        {/* Reservoir & Main Enclosure */}
        <mesh material={chassisMaterial}>
          <boxGeometry args={[0.9, 0.22, 1.1]} />
        </mesh>

        {/* Atomized Spray Manifold (Front of cleaning pack) */}
        <mesh position={[0, -0.1, 0.45]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 0.8, 12]} />
          <meshStandardMaterial color="#65F4FF" metalness={0.9} />
        </mesh>
        {/* 4 Spray Nozzles */}
        {[-0.3, -0.1, 0.1, 0.3].map((pos, idx) => (
          <mesh key={idx} position={[pos, -0.14, 0.45]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial color="#27E5A2" />
          </mesh>
        ))}

        {/* Rotating Microfiber Roller (Center of cleaning pack) */}
        <mesh
          ref={rollerRef}
          position={[0, -0.15, 0.1]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.1, 0.1, 0.78, 16]} />
          <meshStandardMaterial
            color={isHighlighted(3) ? '#65F4FF' : '#1A365D'}
            roughness={0.8}
            emissive={isHighlighted(3) ? '#00D9FF' : '#001A33'}
            emissiveIntensity={isHighlighted(3) ? 1.8 : 0.2}
          />
        </mesh>

        {/* Hydrophobic Silicone Squeegee Blade (Rear of cleaning pack) */}
        <mesh position={[0, -0.16, -0.3]}>
          <boxGeometry args={[0.82, 0.08, 0.03]} />
          <meshStandardMaterial color="#27E5A2" roughness={0.1} metalness={0.2} />
        </mesh>

        {/* 3D Hotspot Button 3 */}
        <Html position={[0, -0.28, 0]} center distanceFactor={10}>
          <button
            onClick={() => onSelectHotspot(3)}
            className={`p-1.5 rounded-full border transition-all duration-300 ${
              isHighlighted(3)
                ? 'bg-primary text-background border-white scale-125 shadow-glow-cyan'
                : 'bg-surface/90 text-primary border-primary/50 hover:scale-110'
            }`}
            title="Inspect Hybrid Cleaning Assembly"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
          </button>
        </Html>
      </group>

      {/* ========================================================== */}
      {/* 6. HOTSPOT 4: POST-CLEANING VERIFICATION CAMERA            */}
      {/* ========================================================== */}
      <group position={[0, -0.28, -0.75]}>
        <mesh material={titaniumMaterial}>
          <boxGeometry args={[0.26, 0.14, 0.16]} />
        </mesh>
        <mesh position={[0, -0.08, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.04, 16]} />
          <meshStandardMaterial
            color="#27E5A2"
            emissive={isHighlighted(4) ? '#27E5A2' : '#0D533C'}
            emissiveIntensity={isHighlighted(4) ? 3 : 0.8}
          />
        </mesh>

        {/* 3D Hotspot Button 4 */}
        <Html position={[0, -0.22, 0]} center distanceFactor={10}>
          <button
            onClick={() => onSelectHotspot(4)}
            className={`p-1.5 rounded-full border transition-all duration-300 ${
              isHighlighted(4)
                ? 'bg-primary text-background border-white scale-125 shadow-glow-cyan'
                : 'bg-surface/90 text-primary border-primary/50 hover:scale-110'
            }`}
            title="Inspect Verification Camera"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
          </button>
        </Html>
      </group>
    </group>
  );
};
