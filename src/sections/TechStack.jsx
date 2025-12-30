import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, MeshTransmissionMaterial, Environment, Float } from "@react-three/drei";
import { useMediaQuery } from "react-responsive";
import { useRef, useState } from "react";
import * as THREE from "three";
import { techStackIcons } from "../constants";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Duplicate the names to create a seamless seamless loop effect
// Duplicate the names to create a seamless seamless loop effect
const originalTechNames = [
  "Next.js", "React", "Three.js", "GSAP", "Tailwind"
];
// Single list interaction
const techNames = [...originalTechNames];

const LiquidGlass = ({ position, scale }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  useFrame(() => {
    if (meshRef.current) {
      // "Squish" effect: Flatten Z, Expand X/Y
      const targetX = hovered ? 1.15 : 1.0;
      const targetY = hovered ? 1.15 : 1.0;
      const targetZ = hovered ? 0.8 : 1.0;

      // Smooth interpolation - Increased speed (0.3) for snappy squish
      meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, scale[0] * targetX, 0.3);
      meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, scale[1] * targetY, 0.3);
      meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, scale[2] * targetZ, 0.3);
    }
  });

  return (
    <Float speed={4} rotationIntensity={2} floatIntensity={2}>
      <mesh
        ref={meshRef} // Attached ref for animation
        position={position}
        // Scale is handled by useFrame, but initial scale is helpful
        scale={scale}
        onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
      >
        <sphereGeometry args={[1, 64, 64]} />
        {isMobile ? (
          <meshPhysicalMaterial
            transparent
            roughness={0}
            opacity={0.5}
            color="#ffffff"
          />
        ) : (
          <MeshTransmissionMaterial
            thickness={1.5}
            roughness={0.1}
            transmission={1}
            ior={1.2}
            chromaticAberration={0.05}
            backside={true}
            distortion={0.2}
            distortionScale={1}
            temporalDistortion={0.25}
            color={"#ffffff"}
            background={"#000000"}
          />
        )}
      </mesh>
    </Float>
  );
};

const TextList = ({ progress }) => {
  const { viewport } = useThree();
  const group = useRef();
  const textRefs = useRef([]);
  const itemHeight = 1.6;
  const fullHeight = techNames.length * itemHeight;

  useFrame(() => {
    // Use the mutable ref driven by GSAP
    const offset = progress.current;

    if (group.current) {
      // Center the scroll
      group.current.position.y = (fullHeight * offset) - (fullHeight / 2);
    }

    // Update opacity/scale focus
    textRefs.current.forEach((text, i) => {
      if (!text) return;

      const itemLocalY = i * itemHeight - (fullHeight / 2);
      const itemWorldY = group.current.position.y + itemLocalY;

      const dist = Math.abs(itemWorldY);
      const fadeRange = itemHeight * 0.7;

      let opacity = 1 - (dist / fadeRange);
      opacity = THREE.MathUtils.clamp(opacity, 0, 1);
      opacity = Math.pow(opacity, 2);

      text.material.opacity = opacity;
      text.visible = opacity > 0;

      const scale = 1 + opacity * 0.2;
      text.scale.set(scale, scale, scale);
    });
  });

  return (
    <group ref={group} position={[0, 0, -2]}>
      {techNames.map((name, i) => (
        <Text
          key={i}
          ref={(el) => (textRefs.current[i] = el)}
          position={[0, i * itemHeight - (fullHeight / 2), 0]}
          fontSize={viewport.width > 10 ? 1.5 : viewport.width / 8}
          color="white"
          anchorX="center"
          anchorY="middle"
          // Removed custom font URL due to crash
          fontWeight="900"
          letterSpacing={0.05}
          transparent
        >
          {name}
        </Text>
      ))}
    </group>
  );
}

const TechStackScene = ({ progress }) => {
  const { viewport } = useThree();
  const xOffset = viewport.width / 3;
  const yOffset = viewport.height / 3;
  const scaleSize = viewport.width / 9;

  return (
    <>
      <TextList progress={progress} />

      {/* Lower Left Sphere */}
      <LiquidGlass
        position={[-xOffset, -yOffset, 0]}
        scale={[scaleSize, scaleSize, scaleSize]}
      />

      {/* Upper Right Sphere */}
      <LiquidGlass
        position={[xOffset, yOffset, 0]}
        scale={[scaleSize, scaleSize, scaleSize]}
      />
    </>
  );
}

const TechStack = () => {
  const container = useRef();
  // Mutable ref to share state between GSAP (DOM) and R3F (Canvas) safely
  const progress = useRef(0);

  useGSAP(() => {
    ScrollTrigger.create({
      trigger: container.current,
      start: "top top",
      end: "+=2000", // Adapted for shorter list
      pin: true,
      scrub: 0, // Instant scrub for snappy feel
      onUpdate: (self) => {
        progress.current = self.progress;
      }
    });
  }, { scope: container });

  return (
    <div ref={container} id="skills-container" style={{ height: '100vh', width: '100%', position: 'relative' }}>
      <div className="absolute top-32 left-0 w-full flex justify-center pointer-events-none z-10">
        <h2 className="text-white text-3xl md:text-5xl font-bold font-sans uppercase tracking-wider">
          Expertise In
        </h2>
      </div>
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 1.5]}>
        <color attach="background" args={['#050505']} />

        <ambientLight intensity={1.0} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        <Environment preset="studio" />

        <TechStackScene progress={progress} />
      </Canvas>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 text-sm pointer-events-none font-sans">
        Scroll to spin the reel
      </div>
    </div>
  );
};

export default TechStack;