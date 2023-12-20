export type Clip = {
  fps: number;
  duration: number;
  durationFrames: number;
};

export function parseClip(inputContents: string): Clip {
  const parser = new DOMParser();
  const result: XMLDocument = parser.parseFromString(
    inputContents,
    "application/xml"
  );

  const kdenliveScene = result.firstElementChild;
  if (kdenliveScene == null) {
    throw new Error("No scene");
  }

  const fps = kdenliveScene.getAttribute("fps");
  const parsedFPS = fps ? Number.parseInt(fps) : undefined;
  if (!parsedFPS || isNaN(parsedFPS)) {
    throw new Error("Parsed Clip XML has invalid FPS: " + fps);
  }

  const durationFrames = +kdenliveScene.getAttribute("duration")!;

  console.log(durationFrames);

  return {
    fps: parsedFPS,
    durationFrames,
    duration: durationFrames / parsedFPS,
  };
}
