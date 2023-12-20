import { AbstractEasing, EasingFunc } from "./easings";

/**
 * Linear interpolate on the scale given by a to b, using t as the point on that scale.
 *
 *   50 == lerp(0, 100, 0.5)
 *
 *   4.2 == lerp(1, 5, 0.8)
 */
export function linearInterpolate(a: number, b: number, t: number): number {
  t = Math.max(0, Math.min(t, 1));
  return a === b ? a : (1 - t) * a + t * b;
}

export type Settings = {
  duration: number;
  fps: number;
  ease: {
    name: string;
    func: EasingFunc;
  };
  start: Keyframe;
  end: Keyframe;
};

export type Keyframe = {
  x: number;
  y: number;
  opacity: number;
  width: number;
  height: number;
};

function get_frames(settings: Settings) {
  return settings.fps * settings.duration;
}

function generate_values(settings: Settings) {
  const t: string[] = [];
  const max_range = get_frames(settings) - 1;

  const start = settings.start;
  const end = settings.end;

  for (let i = 0; i < max_range + 1; ++i) {
    const value01 = i / max_range;
    const value = settings.ease.func(value01);

    const x = linearInterpolate(start.x, end.x, value);
    const y = linearInterpolate(start.y, end.y, value);
    const width = linearInterpolate(start.width, end.width, value);
    const height = linearInterpolate(start.height, end.height, value);
    const opacity = linearInterpolate(start.opacity, end.opacity, value);

    t.push(`${i} = ${x} ${y} ${width} ${height} ${opacity}`);
  }

  return t.join(";");
}

export function generateKeyframeJSON(settings: Settings) {
  return [
    {
      DisplayName: "Generated easing for " + settings.ease.name,
      in: 0,
      max: 0,
      min: 0,
      name: "rect",
      opacity: true,
      out: get_frames(settings),
      type: 7,
      value: generate_values(settings),
    },
  ];
}
