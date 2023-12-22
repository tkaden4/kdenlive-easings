import { EasingFunc } from "./easings";

/**
 * Linear interpolate on the scale given by a to b, using t as the point on that scale.
 *
 *   50 == lerp(0, 100, 0.5)
 *
 *   4.2 == lerp(1, 5, 0.8)
 */
export function linearInterpolate(a: number, b: number, t: number): number {
  return a === b ? a : (1 - t) * a + t * b;
}

export type Settings = {
  fps: number;
  ease: {
    name: string;
    func: EasingFunc;
  };
  start: Keyframe;
  end: Keyframe;
};

export type Keyframe = {
  frame: number;
  x: number;
  y: number;
  opacity: number;
  width: number;
  height: number;
  rotation: number;
};

function nframes(settings: Settings) {
  return settings.end.frame - settings.start.frame;
}

function generate_values(settings: Settings) {
  const t: string[] = [];
  const max_range = nframes(settings) - 1;

  const start = settings.start;
  const end = settings.end;

  for (let i = 0; i < max_range + 1; ++i) {
    const value01 = i / max_range;
    const value = settings.ease.func(value01);

    const x = linearInterpolate(start.x, end.x, value);
    const y = linearInterpolate(start.y, end.y, value);
    const width = linearInterpolate(start.width, end.width, value);
    const height = linearInterpolate(start.height, end.height, value);
    const opacity = linearInterpolate(start.opacity, end.opacity, value) / 100;

    t.push(
      `${settings.start.frame + i} = ${x} ${y} ${width} ${height} ${opacity}`
    );
  }

  return t.join(";");
}

function generate_rotation_values(settings: Settings) {
  const t: string[] = [];
  const max_range = nframes(settings) - 1;

  const start = settings.start;
  const end = settings.end;

  for (let i = 0; i < max_range + 1; ++i) {
    const value01 = i / max_range;
    const value = settings.ease.func(value01);

    const rotation = linearInterpolate(start.rotation, end.rotation, value);

    t.push(`${settings.start.frame + i} = ${rotation}`);
  }

  return t.join(";");
}

export function generateKeyFrameJSON(settings: Settings) {
  return [
    {
      DisplayName: "Generated easing for " + settings.ease.name,
      in: 0,
      max: 0,
      min: 0,
      name: "rect",
      opacity: true,
      out: settings.end.frame,
      type: 7,
      value: generate_values(settings),
    },
    {
      DisplayName: "Generated rotation easing for " + settings.ease.name,
      in: 0,
      max: 360,
      min: -360,
      name: "rotation",
      opacity: true,
      out: settings.end.frame,
      type: 9,
      value: generate_rotation_values(settings),
    },
  ];
}
