export type Clip = {
  fps: number;
};

export function parseClip(inputContents: string): Clip {
  const parser = new DOMParser();
  const result: XMLDocument = parser.parseFromString(
    inputContents,
    "application/xml"
  );
  const fps = result.firstElementChild?.getAttribute("fps");
  const parsedFPS = fps ? Number.parseInt(fps) : undefined;
  if (!parsedFPS || isNaN(parsedFPS)) {
    throw new Error("Parsed Clip XML has invalid FPS: " + fps);
  }

  return {
    fps: parsedFPS,
  };
}
