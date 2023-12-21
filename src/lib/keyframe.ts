import z from "zod";

export const rawEffectParser = z.object({
  DisplayName: z.string(),
  name: z.string(),
  in: z.number(),
  out: z.number(),
  max: z.number(),
  min: z.number(),
  opacity: z.boolean(),
  type: z.number(),
  value: z.string(),
});

export type RawKeyFrame = z.infer<typeof rawEffectParser>;

export type KeyFrameEntry = {
  frame: number;
  values: Array<number>;
};

export type EffectKeyframes = {
  name: string;
  displayName: string;
  in: number;
  out: number;
  max: number;
  min: number;
  type: number;
  entries: Array<KeyFrameEntry>;
};

function parseKeyframeEntries(value: string): Array<KeyFrameEntry> {
  const keyframes = value.split(";").map((x) => x.trim());
  const parseFrame = (frame: string): KeyFrameEntry => {
    const [frameIndex, values] = frame.split("=").map((x) => x.trim());

    return {
      frame: +frameIndex,
      values: values
        .split(" ")
        .map((x) => x.trim())
        .map((y) => Number.parseInt(y)),
    };
  };

  return keyframes.map(parseFrame);
}

export function parseRawEffect(rawParsed: RawKeyFrame): EffectKeyframes {
  const entries = parseKeyframeEntries(rawParsed.value);

  return {
    name: rawParsed.name,
    displayName: rawParsed.DisplayName,
    in: rawParsed.in,
    out: rawParsed.out,
    min: rawParsed.min,
    max: rawParsed.max,
    type: rawParsed.type,
    entries: entries,
  };
}

export function unparseEffects(keyframe: EffectKeyframes): RawKeyFrame {
  return {
    DisplayName: keyframe.displayName,
    name: keyframe.name,
    in: keyframe.in,
    out: keyframe.out,
    max: keyframe.max,
    min: keyframe.min,
    opacity: true,
    type: keyframe.type,
    value: keyframe.entries
      .map((x) => `${x.frame} = ${x.values.join(" ")}`)
      .join(";"),
  };
}

export const rawEffectsParser = z.array(rawEffectParser);

export type PastedEffects = z.infer<typeof rawEffectsParser>;
