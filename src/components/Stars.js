import { useRef, Suspense, useMemo } from "react";
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm'
import "../styles/Stars.css"
const Stars = ({ props, darkMode }) => {
    const ref = useRef();
    const sphere = useMemo(() => random.inSphere(new Float32Array(5000), { radius: 1.2 }), [])
    useFrame((state, delta) => {
        ref.current.rotation.x -= delta / 20;
        ref.current.rotation.x -= delta / 30;

    });
    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
                <PointMaterial transparent color={darkMode ? "#f272c8" : "#E04BB0"}
                    size={0.002}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    )
}
const StarsCanvas = ({ darkMode }) => {
    return (
        <div className="stars-canvas">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <Suspense fallback={null}>
                    <Stars darkMode={darkMode} />
                </Suspense>
            </Canvas>
        </div>
    )
}
export default StarsCanvas