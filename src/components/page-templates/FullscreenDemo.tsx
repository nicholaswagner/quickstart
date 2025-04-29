import { AsciiRenderer } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import type { ThreeElements } from "@react-three/fiber";
import { useRef, useState } from "react";
import type { Mesh } from "three";

export const FullscreenDemo = () => {
	const [tweakables, setTweakables] = useState({
		showSnark: true,
		color: "#ffffff",
		rotationSpeedX: 0.5,
		rotationSpeedY: 0.5,
		radius: 5,
		tube: 0.05,
		ambientIntensity: 0.1,
		spotIntensity: Math.PI,
		backgroundColor: "#000000",
		showAscii: true,
		useMeshColor: false,
	});

	// didn't bother copying over all the lil-gui setup from the <Snark/> component... its there if you want it

	function Torusknot(_props: ThreeElements["mesh"]) {
		const meshRef = useRef<Mesh | null>(null);
		useFrame((_state, delta) => {
			if (!meshRef.current) return;
			meshRef.current.rotation.x -= delta * tweakables.rotationSpeedX;
			meshRef.current.rotation.y += delta * tweakables.rotationSpeedY;
		});

		return (
			<mesh ref={meshRef} {..._props}>
				<torusKnotGeometry
					args={[tweakables.radius, tweakables.tube, 128, 32]}
				/>
				<meshStandardMaterial color={tweakables.color} />
			</mesh>
		);
	}

	return (
		<Canvas style={{ width: "100vw", height: "100vh" }}>
			<ambientLight intensity={tweakables.ambientIntensity} />
			<spotLight
				position={[10, 10, 10]}
				angle={0.15}
				penumbra={1}
				decay={2}
				intensity={tweakables.spotIntensity}
			/>
			<pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
			<color attach="background" args={["blue"]} />
			<Torusknot />
			<Torusknot />
			{tweakables.showAscii && (
				<AsciiRenderer
					renderIndex={1}
					fgColor={
						tweakables.useMeshColor ? tweakables.color : "var(--accent-9)"
					}
					bgColor="transparent"
				/>
			)}
		</Canvas>
	);
};
