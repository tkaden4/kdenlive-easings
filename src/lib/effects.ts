import { EffectKeyframes, KeyFrameEntry } from "./keyframe";

export type RotationEntry = {
  frame: number;
  angle: number;
};

export type RectangleEntry = {
  frame: number;
  x: number;
  y: number;
  width: number;
  height: number;
  opacity: number;
};

export function parseRotationEntry(entry: KeyFrameEntry): RotationEntry {
  return {
    frame: entry.frame,
    angle: entry.values[0],
  };
}

export function parseRotation(effect: EffectKeyframes): RotationEntry[] {
  if (effect.name !== "rotation") {
    throw new Error("Not a rotation");
  }

  return effect.entries.map((entry) => parseRotationEntry(entry));
}

export function parseRectangleEntry(entry: KeyFrameEntry): RectangleEntry {
  const [x, y, width, height, opacity] = entry.values;

  return {
    frame: entry.frame,
    x,
    y,
    width,
    height,
    opacity: opacity * 100,
  };
}

export function parseRectangle(effect: EffectKeyframes) {
  if (effect.name !== "rect") {
    throw new Error("Not a rectangle");
  }
  return effect.entries.map((entry) => parseRectangleEntry(entry));
}
