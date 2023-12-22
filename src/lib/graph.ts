import { linearInterpolate } from "./generator";

export type GraphOptions = {
  color: string;
  width: number;
  range: [number, number];
  domain: [number, number];
  dash: number;
};

export function drawFunction(
  canvas: HTMLCanvasElement,
  func: (x: number) => number,
  options?: Partial<GraphOptions>
) {
  const ctx = canvas.getContext("2d");
  if (ctx === null) {
    return;
  }

  const [minX, maxX] = options?.domain ?? [0, 1];
  const [minY, maxY] = options?.range ?? [0, 1];
  const color = options?.color ?? "white";
  const lineWidth = options?.width ?? 3;

  const width = canvas.width;
  const height = canvas.height;

  const f = (canvasX: number): number => {
    // const xScalingFactor = 1 / (maxX - minX);

    const x = linearInterpolate(minX, maxX, canvasX / width) - minX;
    const y = func(x);

    const yScalingFactor = 1 / (maxY - minY);

    const canvasY = linearInterpolate(0, height, y - minY) * yScalingFactor;
    return height - canvasY;
  };

  const interval = 1;

  for (
    let canvasX = interval;
    canvasX < width + interval;
    canvasX += interval
  ) {
    if (options?.dash && options.dash !== 0 && canvasX % options.dash === 0) {
      canvasX += options.dash;
      continue;
    }

    const y1 = f(canvasX);
    const y0 = f(canvasX - interval);

    ctx.beginPath();
    ctx.moveTo(canvasX - interval, y0);
    ctx.lineTo(canvasX, y1);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.stroke();
  }
}
