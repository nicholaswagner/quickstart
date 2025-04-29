import { Flex, Heading } from "@radix-ui/themes";
import { AsciiRenderer } from "@react-three/drei";
import { Canvas, type ThreeElements, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Mesh } from "three";
import { debounce } from "../../utils/debounce";
import { useLilGui } from "../ui/lil-gui-provider/LilGuiProvider";
import styles from "./snark.module.css";

export const Snark = () => {
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

	const debouncedSetTweakables = useMemo(
		() =>
			debounce((updater: (prev: typeof tweakables) => typeof tweakables) => {
				setTweakables(updater);
			}, 300),
		[],
	);

	const { gui } = useLilGui();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <No need, this is for debugging>
	useEffect(() => {
		if (!gui) return;

		const folder = gui.addFolder("Hero Settings");

		folder
			.add(tweakables, "spotIntensity", 0, 10, 0.25)
			.name("Spotlight")
			.onChange((value: number) => {
				debouncedSetTweakables((prev) => ({
					...prev,
					spotIntensity: value,
				}));
			});

		folder
			.add(tweakables, "ambientIntensity", 0, 5, 0.25)
			.name("Ambient Light")
			.onChange((value: number) => {
				debouncedSetTweakables((prev) => ({
					...prev,
					ambientIntensity: value,
				}));
			});

		folder
			.add(tweakables, "tube", 0.001, 100, 0.05)
			.name("Mesh Size")
			.onChange((value: number) => {
				debouncedSetTweakables((prev) => ({ ...prev, tube: value }));
			});

		folder
			.add(tweakables, "radius", 1, 20, 0.5)
			.name("Mesh Radius")
			.onFinishChange((value: number) => {
				debouncedSetTweakables((prev) => ({ ...prev, radius: value }));
			});

		folder
			.addColor(tweakables, "color")
			.name("Mesh Material Color")
			.onChange((value: string) => {
				debouncedSetTweakables((prev) => ({ ...prev, color: value }));
			});

		folder
			.add(tweakables, "rotationSpeedX", -100, 100)
			.name("Rotate X")
			.onFinishChange((value: number) => {
				debouncedSetTweakables((prev) => ({ ...prev, rotationSpeedX: value }));
			});

		folder
			.add(tweakables, "rotationSpeedY", -100, 100)
			.name("Rotate Y")
			.onFinishChange((value: number) => {
				debouncedSetTweakables((prev) => ({ ...prev, rotationSpeedY: value }));
			});

		folder
			.add(tweakables, "showSnark")
			.name("Show Snark")
			.onChange((value: boolean) => {
				debouncedSetTweakables((prev) => ({ ...prev, showSnark: value }));
			});

		folder
			.add(tweakables, "showAscii")
			.name("Show ASCII")
			.onChange((value: boolean) => {
				debouncedSetTweakables((prev) => ({ ...prev, showAscii: value }));
			});

		folder
			.add(tweakables, "useMeshColor")
			.name("useMeshColor")
			.onChange((value: boolean) => {
				debouncedSetTweakables((prev) => ({ ...prev, useMeshColor: value }));
			});

		folder.open();

		return () => {
			folder.destroy();
		};
	}, [gui]);

	function Torusknot(_props: ThreeElements["mesh"]) {
		const meshRef = useRef<Mesh | null>(null);
		// const viewport = useThree((state) => state.viewport);
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
		<Flex id="canvas-container" className={styles.CanvasContainer}>
			<Flex width="100%" height="50vh" align="center" justify="center">
				<Canvas>
					<ambientLight intensity={tweakables.ambientIntensity} />
					<spotLight
						position={[10, 10, 10]}
						angle={0.15}
						penumbra={1}
						decay={2}
						intensity={tweakables.spotIntensity}
					/>
					<pointLight
						position={[-10, -10, -10]}
						decay={0}
						intensity={Math.PI}
					/>
					<color attach="background" args={["black"]} />
					<Torusknot />
					<Torusknot />
					{tweakables.showAscii && (
						<AsciiRenderer
							renderIndex={1}
							fgColor={
								tweakables.useMeshColor ? tweakables.color : "var(--accent-9)"
							}
							bgColor="transparent"
							// characters=" ⠁⠂⠃⠄⠅⠆⠇⠈⠉⠊⠋⠌⠍⠎⠏⠐⠑⠒⠓⠔⠕⠖⠗⠘⠙⠚⠛⠜⠝⠞⠟⠠⠡⠢⠣⠤⠥⠦⠧⠨⠩⠪⠫⠬⠭⠮⠯⠰⠱⠲⠳⠴⠵⠶⠷⠸⠹⠺⠻⠼⠽⠾⠿⣿" // brail
						/>
					)}
				</Canvas>
				{tweakables.showSnark && (
					<Flex className={styles.Hero}>
						<Flex direction="column">
							<Heading
								size={{ initial: "6", sm: "8", md: "9" }}
								align={{ initial: "center", sm: "left" }}
								weight="bold"
							>
								<mark>
									“Code reviews aren’t for finding bugs. They’re for shared
									suffering and slowly losing faith in your coworkers. ”
								</mark>
							</Heading>
						</Flex>
					</Flex>
				)}
			</Flex>
		</Flex>
	);
};
