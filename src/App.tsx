import React from "react";
import { EASINGS, EASINGS_MAP, LinearInOut } from "./lib/easings";
import { useForm } from "react-hook-form";
import { generateKeyframeJSON } from "./lib/generator";
import hi from "highlight.js";
import hijson from "highlight.js/lib/languages/json";
import { selectElementContents } from "./util";
import { parseClip } from "./lib/clip";

hi.registerLanguage("json", hijson);

function drawFunction(canvas: HTMLCanvasElement, func: (x: number) => number) {
  const ctx = canvas.getContext("2d");
  if (ctx === null) {
    return;
  }
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);

  for (let i = 1; i < width; ++i) {
    const x = i / width;
    const y = func(x) * height;
    const y_prev = func((i - 1) / width) * height;

    ctx.beginPath();
    ctx.moveTo(i - 1, y_prev);
    ctx.lineTo(i, y);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "white";
    ctx.stroke();
  }
}

function App() {
  const generatePreview = (ease: string) => {
    const canvas = document.getElementById("preview-canvas");
    if (!canvas) {
      return;
    }
    if (canvas instanceof HTMLCanvasElement) {
      drawFunction(canvas, EASINGS_MAP[ease]);
    }
  };

  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      fps: 60,
      duration: 5,
      ease: EASINGS[0].name,
      start: {
        x: 0,
        y: 0,
        opacity: 100,
        width: 1920,
        height: 1080,
      },
      end: {
        x: 0,
        y: 0,
        opacity: 100,
        width: 1920,
        height: 1080,
      },
    },
  });

  const onSubmit = () => {};

  const values = watch();

  const ease = values.ease;
  React.useEffect(() => {
    if (ease) {
      generatePreview(ease);
    }
  }, [ease]);

  React.useEffect(() => {
    if (values) {
      const json = generateKeyframeJSON({
        ...values,
        ease: {
          name: values.ease,
          func: EASINGS_MAP[values.ease],
        },
      });

      const keyframes = document.getElementById("keyframes");
      if (keyframes) {
        keyframes.innerHTML = hi.highlight(JSON.stringify(json, null, "  "), {
          language: "json",
        }).value;
      }
    }
  }, [values]);

  return (
    <div className="App" style={{ margin: "auto", padding: "20px" }}>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div
          id="form"
          style={{
            marginRight: "40px",
          }}
        >
          <h1 style={{ marginTop: 0 }}>Options</h1>
          <form id="options" onSubmit={handleSubmit(onSubmit)}>
            <label>FPS</label>
            <input {...register("fps", { valueAsNumber: true, min: 0 })} />
            <br />
            <label>Duration</label>
            <input {...register("duration", { valueAsNumber: true, min: 0 })} />
            <br />
            <label>Ease Type</label>
            <select {...register("ease")}>
              {EASINGS.map((ease, i) => (
                <option key={i} value={ease.name}>
                  {ease.name}
                </option>
              ))}
            </select>
            <h2>Start</h2>
            <label>X</label>
            <input {...register("start.x", { valueAsNumber: true })} />
            <br />

            <label>Y</label>
            <input {...register("start.y", { valueAsNumber: true })} />
            <br />

            <label>Width</label>
            <input
              {...register("start.width", { valueAsNumber: true, min: 0 })}
            />
            <br />

            <label>Height</label>
            <input
              {...register("start.height", { valueAsNumber: true, min: 0 })}
            />
            <br />

            <label>Opacity</label>
            <input
              {...register("start.opacity", {
                valueAsNumber: true,
                min: 0,
                max: 100,
              })}
            />
            <h2>End</h2>
            <label>X</label>
            <input {...register("end.x", { valueAsNumber: true })} />
            <br />
            <label>Y</label>
            <input {...register("end.y", { valueAsNumber: true })} />
            <br />

            <label>Width</label>
            <input
              {...register("end.width", { valueAsNumber: true, min: 0 })}
            />
            <br />

            <label>Height</label>
            <input
              {...register("end.height", { valueAsNumber: true, min: 0 })}
            />
            <br />

            <label>Opacity</label>
            <input
              {...register("end.opacity", {
                valueAsNumber: true,
                min: 0,
                max: 100,
              })}
            />
          </form>
          <div>
            <h1>Preview</h1>
            <canvas
              width={500}
              height={300}
              style={{
                border: "1px solid #3a3a3c",
                backgroundColor: "#0a0a0c",
              }}
              id="preview-canvas"
            ></canvas>
          </div>
        </div>
        <div id="io">
          <h1>Keyframe Output</h1>
          <pre
            onClick={() => {
              selectElementContents(document.getElementById("keyframes")!);
            }}
            style={{
              minWidth: "80ch",
              maxWidth: "80ch",
              overflowX: "scroll",
              border: "1px solid #3a3a3c",
              padding: "20px",
            }}
          >
            <code
              style={{
                minWidth: "80ch",
                maxWidth: "80ch",
                overflowX: "scroll",
              }}
              id="keyframes"
              className="language-json"
            ></code>
          </pre>
          {/* <h1>Clip Input</h1>
          <textarea id="clip-paste"></textarea> */}
          <h1>How To Use</h1>
          <div>
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/1c1yGZ14XYo?si=MBIt2f1EhwV-P0UI"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
