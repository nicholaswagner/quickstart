import { useCallback, useEffect, useRef } from "react";

import { useLilGui } from "../components/ui/LilGuiProvider/LilGuiProvider";

type ToggleSoundConfig = {
	volume: number; // 0..1 master level
	offset: number; // seconds to delay the whole click after the toggle is pressed
	travel: number; // seconds between the primary tick and the secondary click
	pitchMin: number; // low end of the random root cutoff (Hz) — picked fresh each press
	pitchMax: number; // high end of the random root cutoff (Hz)
	cushion: boolean; // layer a soft low "give" under the tick for tactility
};

const DEFAULTS: ToggleSoundConfig = {
	volume: 0.6,
	offset: 0.325,
	travel: 0.05,
	pitchMin: 500,
	pitchMax: 2210,
	cushion: true,
};

// How far the secondary click departs from the primary, and in which direction:
// the little two-tick gesture sweeps up when turning on, down when turning off.
const CONTOUR_UP = 1.5; // on  → brighter second tick (ascending)
const CONTOUR_DOWN = 0.6; // off → darker second tick (descending)

// Synthesises a soft, tactile "toggle" sound at runtime via Web Audio — no audio
// assets. Brief: a soft tactile tick with a subtle secondary click, communicating
// the state change without drawing attention to itself. So: a gentle lowpassed
// noise tick, a quieter secondary click `travel` seconds later, and an optional
// low cushion for physical "give". Returns a `play(on)` callback. When the lil-gui
// panel is mounted (`?showGui`) it registers a "Switch Sound" folder so the feel
// can be tweaked live, mirroring the Snark/RippleField pattern.
export function useToggleSound() {
	// Config lives in a ref so lil-gui can mutate it without re-rendering callers.
	const config = useRef<ToggleSoundConfig>({ ...DEFAULTS });
	// One AudioContext, created lazily on the first click (browsers block audio
	// until a user gesture — the toggle click itself satisfies that).
	const ctxRef = useRef<AudioContext | null>(null);
	const { gui } = useLilGui();

	// deps intentionally limited to `gui`: lil-gui owns the control state once
	// created, and the gui instance is stable for the provider's lifetime.
	useEffect(() => {
		if (!gui) return;
		const c = config.current;
		const folder = gui.addFolder("Switch Sound");

		folder.add(c, "volume", 0, 1, 0.01).name("Volume");
		folder.add(c, "offset", 0, 0.8, 0.005).name("Offset (s)");
		folder.add(c, "travel", 0.005, 0.08, 0.001).name("Travel");
		folder.add(c, "pitchMin", 200, 6000, 10).name("Pitch Min");
		folder.add(c, "pitchMax", 200, 6000, 10).name("Pitch Max");
		folder.add(c, "cushion").name("Cushion");

		return () => folder.destroy();
	}, [gui]);

	return useCallback((on: boolean) => {
		const c = config.current;
		if (c.volume <= 0) return;

		if (!ctxRef.current) ctxRef.current = new AudioContext();
		const ctx = ctxRef.current;
		if (ctx.state === "suspended") void ctx.resume();

		const now = ctx.currentTime + Math.max(0, c.offset);
		const out = ctx.createGain();
		out.gain.value = c.volume;
		out.connect(ctx.destination);

		// A short burst of lowpassed white noise — soft and rounded, not clicky.
		// The gentle (~1.2ms) attack and lowpass keep the highs from grabbing the ear.
		const tick = (at: number, cutoff: number, level: number, dur: number) => {
			const len = Math.max(1, Math.ceil(ctx.sampleRate * dur));
			const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
			const data = buffer.getChannelData(0);
			for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;

			const src = ctx.createBufferSource();
			src.buffer = buffer;

			const filter = ctx.createBiquadFilter();
			filter.type = "lowpass";
			filter.frequency.value = cutoff;
			filter.Q.value = 0.7; // low Q — no resonant ring

			const g = ctx.createGain();
			g.gain.setValueAtTime(0.0001, at);
			g.gain.exponentialRampToValueAtTime(level, at + 0.0012); // soft attack
			g.gain.exponentialRampToValueAtTime(0.0001, at + dur); // gentle decay

			src.connect(filter).connect(g).connect(out);
			src.start(at);
			src.stop(at + dur);
		};

		// A calm low sine "give" — adds physical weight without a pitched ring.
		const cushion = (at: number, freq: number, level: number, dur: number) => {
			const osc = ctx.createOscillator();
			osc.type = "sine";
			osc.frequency.value = freq;

			const g = ctx.createGain();
			g.gain.setValueAtTime(0.0001, at);
			g.gain.exponentialRampToValueAtTime(level, at + 0.005);
			g.gain.exponentialRampToValueAtTime(0.0001, at + dur);

			osc.connect(g).connect(out);
			osc.start(at);
			osc.stop(at + dur);
		};

		// fresh random root each press keeps it alive; the contour says on vs. off
		const lo = Math.min(c.pitchMin, c.pitchMax);
		const hi = Math.max(c.pitchMin, c.pitchMax);
		const root = lo + Math.random() * (hi - lo);
		const second = root * (on ? CONTOUR_UP : CONTOUR_DOWN);

		// 1) primary soft tactile tick
		tick(now, root, 0.28, 0.011);
		// 2) subtle secondary click — quieter, sweeping up (on) or down (off)
		tick(now + c.travel, second, 0.11, 0.007);
		// soft low-end give under the primary tick
		if (c.cushion) cushion(now, on ? 165 : 135, 0.12, 0.045);
	}, []);
}
