import { useEffect, useRef } from "react";
import { useAnimationStore } from "@/store/animationStore";
import { useCanvasStore } from "@/store/canvasStore";

export function AnimationTimelinePanel() {
  const tracks = useAnimationStore((state) => state.tracks);
  const currentTime = useAnimationStore((state) => state.currentTime);
  const isPlaying = useAnimationStore((state) => state.isPlaying);
  const duration = useAnimationStore((state) => state.duration);
  const selectedKeyframeId = useAnimationStore((state) => state.selectedKeyframeId);

  const setCurrentTime = useAnimationStore((state) => state.setCurrentTime);
  const setPlaying = useAnimationStore((state) => state.setPlaying);
  const setDuration = useAnimationStore((state) => state.setDuration);
  const addTrack = useAnimationStore((state) => state.addTrack);
  const removeTrack = useAnimationStore((state) => state.removeTrack);
  const addKeyframe = useAnimationStore((state) => state.addKeyframe);
  const removeKeyframe = useAnimationStore((state) => state.removeKeyframe);
  const selectKeyframe = useAnimationStore((state) => state.selectKeyframe);

  const canvas = useCanvasStore((state) => state.canvas);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Playback loop
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const newTime = elapsed % duration;

      setCurrentTime(newTime);

      if (elapsed > duration) {
        startTimeRef.current = Date.now();
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    startTimeRef.current = Date.now() - currentTime;
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, duration, currentTime, setCurrentTime]);

  const handleAddTrack = () => {
    if (canvas) {
      const active = canvas.getActiveObject() as any;
      if (active) {
        addTrack(active.name || active.id || "unnamed");
      }
    }
  };

  const handleAddKeyframe = (trackId: string) => {
    if (canvas) {
      const active = canvas.getActiveObject();
      if (active) {
        addKeyframe(trackId, currentTime, {
          x: active.left,
          y: active.top,
          scaleX: active.scaleX,
          scaleY: active.scaleY,
          angle: active.angle,
          opacity: active.opacity,
        });
      }
    }
  };

  const timelineScale = duration / 400;
  const playheadX = (currentTime / duration) * 400;

  return (
    <div className="flex flex-col gap-3 bg-[#111827] p-3 text-xs h-full">
      {/* Playback Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setPlaying(!isPlaying)}
          className="rounded bg-indigo-600 px-3 py-1 text-white hover:bg-indigo-700"
        >
          {isPlaying ? "⏸ Pause" : "▶ Play"}
        </button>
        <button
          onClick={() => setCurrentTime(0)}
          className="rounded bg-slate-700 px-2 py-1 hover:bg-slate-600"
        >
          ⏮ Reset
        </button>
        <input
          type="number"
          value={Math.round(duration / 1000)}
          onChange={(e) => setDuration(parseFloat(e.target.value) * 1000)}
          className="w-12 rounded bg-slate-800 px-2 py-1 text-white"
          placeholder="Duration"
        />
        <span className="text-slate-400">s</span>
        <div className="flex-1" />
        <span className="text-slate-400">
          {(currentTime / 1000).toFixed(2)}s / {(duration / 1000).toFixed(2)}s
        </span>
      </div>

      {/* Timeline Tracks */}
      <div className="overflow-y-auto border-t border-slate-700 pt-2 flex-1">
        {tracks.length === 0 ? (
          <div className="text-center text-slate-500 py-4">
            <p>No animation tracks</p>
            <button
              onClick={handleAddTrack}
              className="mt-2 text-indigo-400 hover:text-indigo-300"
            >
              + Add Track
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {tracks.map((track) => (
              <div
                key={track.id}
                className="flex items-center gap-2 bg-slate-800 rounded p-2"
              >
                <div className="w-24 truncate text-slate-300 text-[10px]">
                  {track.objectId}
                </div>

                {/* Timeline ruler */}
                <div className="relative flex-1 h-6 bg-slate-900 border border-slate-700 rounded overflow-hidden">
                  {/* Keyframe markers */}
                  {track.keyframes.map((kf) => {
                    const x = (kf.time / duration) * 400;
                    return (
                      <div
                        key={kf.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          selectKeyframe(kf.id);
                        }}
                        className={`absolute top-1/2 w-3 h-3 -ml-1.5 -mt-1.5 rounded-full cursor-pointer transition ${
                          selectedKeyframeId === kf.id
                            ? "bg-indigo-500 shadow-lg shadow-indigo-500/50"
                            : "bg-yellow-500 hover:bg-yellow-400"
                        }`}
                        style={{ left: `${x}px` }}
                        title={`${(kf.time / 1000).toFixed(2)}s`}
                      />
                    );
                  })}

                  {/* Playhead */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-red-500 pointer-events-none"
                    style={{ left: `${playheadX}px` }}
                  />
                </div>

                {/* Track controls */}
                <div className="flex gap-1">
                  <button
                    onClick={() => handleAddKeyframe(track.id)}
                    className="px-2 py-1 rounded bg-indigo-600 text-white text-[10px] hover:bg-indigo-700"
                    title="Add keyframe"
                  >
                    +KF
                  </button>
                  {selectedKeyframeId && (
                    <button
                      onClick={() => {
                        const kf = track.keyframes.find(
                          (k) => k.id === selectedKeyframeId
                        );
                        if (kf) {
                          removeKeyframe(track.id, kf.id);
                          selectKeyframe(null);
                        }
                      }}
                      className="px-2 py-1 rounded bg-red-700 text-white text-[10px] hover:bg-red-600"
                    >
                      Del
                    </button>
                  )}
                  <button
                    onClick={() => removeTrack(track.id)}
                    className="px-2 py-1 rounded bg-slate-700 text-white text-[10px] hover:bg-slate-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Track Button */}
      <button
        onClick={handleAddTrack}
        className="rounded bg-slate-700 px-3 py-1 text-xs text-slate-300 hover:bg-slate-600"
      >
        + Add Animation Track
      </button>
    </div>
  );
}
