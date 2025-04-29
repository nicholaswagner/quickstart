import { AsciiRenderer } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import {
    type Group,
    type InstancedMesh,
    MathUtils,
    type MeshStandardMaterial,
    Object3D,
} from "three";

import { useLilGui } from "../ui/lil-gui-provider/LilGuiProvider";
import styles from "./RippleField.module.css";

const GRID = 44; // GRID x GRID instanced nodes
const COUNT = GRID * GRID;

// const characters = " ░▒▓█";
const characters = "█▓▒░ ";

// Continuous params live in a ref so lil-gui can mutate them every frame
// without churning React state. `ascii` is React state because it adds/removes
// a node from the tree.
type Config = {
    amplitude: number;
    frequency: number;
    speed: number;
    spacing: number;
    nodeSize: number;
    falloff: number;
    autoRotate: boolean;
    color: string;
};

const DEFAULTS: Config = {
    amplitude: 0.9,
    frequency: 0.55,
    speed: 2.2,
    spacing: 0.42,
    nodeSize: 0.12,
    falloff: 0.13,
    autoRotate: true,
    color: "#ffffff",
};

const dummy = new Object3D();

function Field({ config }: { config: React.RefObject<Config> }) {
    const groupRef = useRef<Group>(null);
    const meshRef = useRef<InstancedMesh>(null);
    // smoothed cursor position in the grid plane
    const cursor = useRef({ x: 0, z: 0 });

    useFrame((state, delta) => {
        const mesh = meshRef.current;
        const c = config.current;
        if (!mesh || !c) return;

        const t = state.clock.elapsedTime;
        const half = ((GRID - 1) * c.spacing) / 2;

        // map normalized pointer (-1..1) onto the grid, easing toward it
        cursor.current.x = MathUtils.lerp(cursor.current.x, state.pointer.x * half, 0.08);
        cursor.current.z = MathUtils.lerp(cursor.current.z, -state.pointer.y * half, 0.08);

        let i = 0;
        for (let gx = 0; gx < GRID; gx++) {
            for (let gz = 0; gz < GRID; gz++) {
                const wx = gx * c.spacing - half;
                const wz = gz * c.spacing - half;

                const dx = wx - cursor.current.x;
                const dz = wz - cursor.current.z;
                const dist = Math.sqrt(dx * dx + dz * dz);

                // ripple radiating from the cursor, decaying with distance...
                const ripple =
                    Math.sin(dist * c.frequency - t * c.speed) *
                    c.amplitude *
                    Math.exp(-dist * c.falloff);
                // ...plus a slow ambient swell so it's alive when the cursor is still
                const swell =
                    Math.sin(wx * 0.3 + t * 0.6) *
                    Math.cos(wz * 0.3 + t * 0.5) *
                    c.amplitude *
                    0.35;

                dummy.position.set(wx, ripple + swell, wz);
                dummy.scale.setScalar(c.nodeSize);
                dummy.updateMatrix();
                mesh.setMatrixAt(i++, dummy.matrix);
            }
        }
        mesh.instanceMatrix.needsUpdate = true;
        (mesh.material as MeshStandardMaterial).color.set(c.color);

        if (groupRef.current && c.autoRotate) {
            groupRef.current.rotation.y += delta * 0.05;
        }
    });

    return (
        <group ref={groupRef}>
            <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
                <icosahedronGeometry args={[0.5, 0]} />
                <meshStandardMaterial roughness={0.35} metalness={0.15} flatShading />
            </instancedMesh>
        </group>
    );
}

function Lighting() {
    // keep the spotlight anchored to the camera-facing side
    const { camera } = useThree();
    const ref = useRef<Group>(null);
    useFrame(() => {
        ref.current?.position.copy(camera.position);
    });
    return (
        <>
            <ambientLight intensity={0.35} />
            <group ref={ref}>
                <pointLight position={[0, 2, 0]} intensity={40} decay={2} />
            </group>
            <spotLight position={[8, 12, 8]} angle={0.3} penumbra={1} intensity={120} decay={2} />
        </>
    );
}

export const RippleField = ({ label }: { label?: string }) => {
    const config = useRef<Config>({ ...DEFAULTS });
    const [showAscii, setShowAscii] = useState(true);
    const { gui } = useLilGui();

    // deps intentionally limited to `gui`: lil-gui owns the control state, and
    // the gui instance is stable for the provider's lifetime.
    useEffect(() => {
        if (!gui) return;
        const c = config.current;
        const folder = gui.addFolder("Ripple Field");

        folder.add(c, "amplitude", 0, 2, 0.01).name("Amplitude");
        folder.add(c, "frequency", 0.05, 2, 0.01).name("Frequency");
        folder.add(c, "speed", 0, 6, 0.05).name("Speed");
        folder.add(c, "spacing", 0.2, 0.8, 0.01).name("Spacing");
        folder.add(c, "nodeSize", 0.04, 0.3, 0.005).name("Node Size");
        folder.add(c, "falloff", 0, 0.4, 0.005).name("Falloff");
        folder.add(c, "autoRotate").name("Auto Rotate");
        folder.addColor(c, "color").name("Node Color");

        const proxy = { ascii: showAscii };
        folder
            .add(proxy, "ascii")
            .name("ASCII Filter")
            .onChange((value: boolean) => setShowAscii(value));

        folder.open();
        return () => folder.destroy();
    }, [gui]);

    const title = (label?.split("/").filter(Boolean).pop() || "ripple field").replace(/[-_]/g, " ");

    return (
        <div className={styles.root}>
            <Canvas className={styles.canvas} camera={{ position: [0, 7, 11], fov: 45 }}>
                <Lighting />
                <Field config={config} />
                {showAscii && (
                    <AsciiRenderer
                        fgColor="var(--accent-9)"
                        bgColor="transparent"
                        resolution={0.18}
                        characters={characters}
                    />
                )}
            </Canvas>

            <div className={styles.hud}>
                <div>
                    <div className={styles.tag}>
                        // templates/{label || "$"}
                        <span className={styles.cursor}>▊</span>
                    </div>
                    <h1 className={styles.title}>{title}</h1>
                    <div className={styles.accentBar} />
                </div>

                <div className={styles.footer}>
                    <span>drag the cursor</span>
                    <span>
                        <span className={styles.kbd}>?showGui</span> for controls
                    </span>
                    <span>this route is a splat — try /templates/anything</span>
                </div>
            </div>
        </div>
    );

};