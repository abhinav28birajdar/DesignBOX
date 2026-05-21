import { create } from "zustand";

export interface Keyframe {
  id: string;
  objectId: string;
  time: number; // ms from start
  properties: {
    x?: number;
    y?: number;
    scaleX?: number;
    scaleY?: number;
    angle?: number;
    opacity?: number;
  };
}

export interface AnimationTrack {
  id: string;
  objectId: string;
  keyframes: Keyframe[];
  duration: number; // Total animation duration in ms
  playing: boolean;
}

interface AnimationState {
  tracks: AnimationTrack[];
  currentTime: number; // Current playback time
  isPlaying: boolean;
  duration: number; // Total animation duration
  selectedKeyframeId: string | null;

  // Actions
  addTrack: (objectId: string) => void;
  removeTrack: (trackId: string) => void;
  addKeyframe: (trackId: string, time: number, properties: Keyframe["properties"]) => void;
  removeKeyframe: (trackId: string, keyframeId: string) => void;
  updateKeyframe: (trackId: string, keyframeId: string, properties: Partial<Keyframe["properties"]>) => void;
  setCurrentTime: (time: number) => void;
  setPlaying: (playing: boolean) => void;
  setDuration: (duration: number) => void;
  selectKeyframe: (keyframeId: string | null) => void;
  getTrackForObject: (objectId: string) => AnimationTrack | undefined;
  getPropertyAtTime: (trackId: string, timeMs: number, property: string) => number | undefined;
}

export const useAnimationStore = create<AnimationState>((set, get) => ({
  tracks: [],
  currentTime: 0,
  isPlaying: false,
  duration: 5000,
  selectedKeyframeId: null,

  addTrack: (objectId) =>
    set((state) => {
      const newTrack: AnimationTrack = {
        id: crypto.randomUUID(),
        objectId,
        keyframes: [],
        duration: state.duration,
        playing: false,
      };
      return { tracks: [...state.tracks, newTrack] };
    }),

  removeTrack: (trackId) =>
    set((state) => ({
      tracks: state.tracks.filter((t) => t.id !== trackId),
    })),

  addKeyframe: (trackId, time, properties) =>
    set((state) => ({
      tracks: state.tracks.map((track) => {
        if (track.id === trackId) {
          return {
            ...track,
            keyframes: [
              ...track.keyframes,
              {
                id: crypto.randomUUID(),
                objectId: track.objectId,
                time,
                properties,
              },
            ].sort((a, b) => a.time - b.time),
          };
        }
        return track;
      }),
    })),

  removeKeyframe: (trackId, keyframeId) =>
    set((state) => ({
      tracks: state.tracks.map((track) => {
        if (track.id === trackId) {
          return {
            ...track,
            keyframes: track.keyframes.filter((kf) => kf.id !== keyframeId),
          };
        }
        return track;
      }),
    })),

  updateKeyframe: (trackId, keyframeId, properties) =>
    set((state) => ({
      tracks: state.tracks.map((track) => {
        if (track.id === trackId) {
          return {
            ...track,
            keyframes: track.keyframes.map((kf) => {
              if (kf.id === keyframeId) {
                return {
                  ...kf,
                  properties: { ...kf.properties, ...properties },
                };
              }
              return kf;
            }),
          };
        }
        return track;
      }),
    })),

  setCurrentTime: (time) => set({ currentTime: time }),
  setPlaying: (playing) => set({ isPlaying: playing }),
  setDuration: (duration) => set({ duration }),
  selectKeyframe: (keyframeId) => set({ selectedKeyframeId: keyframeId }),

  getTrackForObject: (objectId) => {
    const state = get();
    return state.tracks.find((t) => t.objectId === objectId);
  },

  getPropertyAtTime: (trackId, timeMs, property) => {
    const state = get();
    const track = state.tracks.find((t) => t.id === trackId);
    if (!track || track.keyframes.length === 0) return undefined;

    const keyframes = track.keyframes.sort((a, b) => a.time - b.time);

    // Find keyframes before and after timeMs
    let before: Keyframe | undefined;
    let after: Keyframe | undefined;

    for (const kf of keyframes) {
      if (kf.time <= timeMs) before = kf;
      if (kf.time >= timeMs && !after) after = kf;
    }

    const propKey = property as keyof Keyframe["properties"];

    if (!before || !after) {
      return before?.properties[propKey] || after?.properties[propKey];
    }

    if (before.time === after.time) {
      return after.properties[propKey];
    }

    // Linear interpolation
    const beforeValue = before.properties[propKey];
    const afterValue = after.properties[propKey];

    if (beforeValue === undefined || afterValue === undefined) {
      return beforeValue ?? afterValue;
    }

    const progress = (timeMs - before.time) / (after.time - before.time);
    return beforeValue + (afterValue - beforeValue) * progress;
  },
}));
