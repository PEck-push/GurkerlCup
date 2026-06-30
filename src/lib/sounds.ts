/**
 * Sound-Engine für den Beamer – per Web Audio API synthetisiert.
 * Keine Audiodateien, keine Lizenzen, kostenlos. Stummschaltbar (localStorage).
 */

let ctx: AudioContext | null = null;
const MUTE_KEY = 'gc_sound_muted';

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

export function isMuted(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(MUTE_KEY) === '1';
}

export function setMuted(m: boolean) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MUTE_KEY, m ? '1' : '0');
  if (!m) getCtx(); // beim Einschalten Kontext freischalten (User-Geste)
}

/** Muss einmal nach einer User-Geste laufen (z.B. Beamer-Login), um Autoplay-Sperre zu lösen. */
export function unlockAudio() {
  getCtx();
}

function whiteNoiseBuffer(c: AudioContext, seconds: number): AudioBuffer {
  const len = Math.floor(c.sampleRate * seconds);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

/** Kurzer Klick (Slot-Machine-Walzen-Tick). */
export function playTick() {
  if (isMuted()) return;
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = 'square';
  osc.frequency.value = 880;
  gain.gain.setValueAtTime(0.0001, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.18, c.currentTime + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.06);
  osc.connect(gain).connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + 0.07);
}

/** Trommelwirbel über `ms` Millisekunden (crescendo aus gefiltertem Rauschen). */
export function playDrumroll(ms = 1500) {
  if (isMuted()) return;
  const c = getCtx();
  if (!c) return;
  const seconds = ms / 1000;
  const src = c.createBufferSource();
  src.buffer = whiteNoiseBuffer(c, seconds);

  const band = c.createBiquadFilter();
  band.type = 'bandpass';
  band.frequency.value = 1900;
  band.Q.value = 0.8;

  // Tremolo (Wirbel-Effekt)
  const trem = c.createGain();
  const lfo = c.createOscillator();
  const lfoGain = c.createGain();
  lfo.type = 'square';
  lfo.frequency.setValueAtTime(14, c.currentTime);
  lfo.frequency.linearRampToValueAtTime(34, c.currentTime + seconds); // schneller werdend
  lfoGain.gain.value = 0.5;
  lfo.connect(lfoGain).connect(trem.gain);
  trem.gain.value = 0.5;

  const out = c.createGain();
  out.gain.setValueAtTime(0.04, c.currentTime);
  out.gain.linearRampToValueAtTime(0.32, c.currentTime + seconds * 0.9); // crescendo
  out.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + seconds);

  src.connect(band).connect(trem).connect(out).connect(c.destination);
  lfo.start();
  src.start();
  src.stop(c.currentTime + seconds);
  lfo.stop(c.currentTime + seconds);
}

/** Kurzer "Treffer"-Akzent, wenn ein Name aufpoppt. */
export function playDing() {
  if (isMuted()) return;
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime;
  [523.25, 783.99].forEach((f, i) => {
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = 'triangle';
    osc.frequency.value = f;
    const start = t + i * 0.04;
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(0.25, start + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, start + 0.35);
    osc.connect(g).connect(c.destination);
    osc.start(start);
    osc.stop(start + 0.4);
  });
}

/** Sieger-Fanfare (aufsteigende Akkordfolge). */
export function playFanfare() {
  if (isMuted()) return;
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
  notes.forEach((f, i) => {
    const start = t + i * 0.14;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = 'sawtooth';
    osc.frequency.value = f;
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(0.22, start + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, start + (i === notes.length - 1 ? 0.9 : 0.3));
    const filt = c.createBiquadFilter();
    filt.type = 'lowpass';
    filt.frequency.value = 3000;
    osc.connect(filt).connect(g).connect(c.destination);
    osc.start(start);
    osc.stop(start + 1);
  });
}
