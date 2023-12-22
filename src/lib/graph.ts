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

  for (let i = 1; i < width; ++i) {
    const x = i / width;
    const y = height - func(x) * height;
    const y_prev = height - func((i - 1) / width) * height;

    if (options?.dash && i % options.dash === 0) {
      i += options.dash;
      continue;
    }
    ctx.beginPath();
    ctx.moveTo(i - 1, y_prev);
    ctx.lineTo(i, y);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.stroke();
  }
}
