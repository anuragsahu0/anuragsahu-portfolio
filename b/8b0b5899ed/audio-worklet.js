// AudioWorklet processor: plays the engine mixer's stereo output from the ring buffer in the shared wasm memory
// (platform/audio/browser_audio_wasm.cpp). Header (uint32 words): write, read, capacity, heartbeat; float data (interleaved L R) at byte 64.
class GameAudio extends AudioWorkletProcessor {
	constructor(options) {
		super();
		const { memory, ring, capacity } = options.processorOptions;
		this.hdr = new Int32Array(memory.buffer, ring, 8);		// word 4: peak sample since the page last looked (x 1e6), diagnostics
		this.data = new Float32Array(memory.buffer, ring + 64, capacity * 2);
		this.mask = capacity - 1;
	}
	process(inputs, outputs) {
		const out = outputs[0], left = out[0], right = out[1] || out[0], n = left.length;
		const read = Atomics.load(this.hdr, 1), write = Atomics.load(this.hdr, 0);
		const avail = (write - read) >>> 0, take = Math.min(avail, n);
		for (let i = 0; i < take; i++) {
			const at = ((read + i) & this.mask) * 2;
			left[i] = this.data[at];
			right[i] = this.data[at + 1];
		}
		let peak = 0;
		for (let i = 0; i < take; i++) peak = Math.max(peak, Math.abs(left[i]), Math.abs(right[i]));
		if (peak > 0) Atomics.store(this.hdr, 4, Math.max(Atomics.load(this.hdr, 4), (peak * 1e6) | 0));
		for (let i = take; i < n; i++) { left[i] = 0; right[i] = 0; }		// underrun: silence
		Atomics.store(this.hdr, 1, (read + take) | 0);
		Atomics.add(this.hdr, 3, 1);
		return true;
	}
}
registerProcessor('game-audio', GameAudio);
