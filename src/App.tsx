import hi from "highlight.js";
import hijson from "highlight.js/lib/languages/json";
import _ from "lodash";
import React from "react";
import { useForm } from "react-hook-form";
import { parseClip } from "./lib/clip";
import { EASINGS, EASINGS_MAP, repeatEasing } from "./lib/easings";
import {
  RectangleEntry,
  parseRectangleEntry,
  parseRotationEntry,
} from "./lib/effects";
import { generateKeyFrameJSON } from "./lib/generator";
import { GraphOptions, drawFunction } from "./lib/graph";
import { parseRawEffect, rawEffectsParser } from "./lib/keyframe";
import { PRESETS } from "./lib/presets";
import { selectElementContents } from "./util";

hi.registerLanguage("json", hijson);

function App() {
  const generatePreview = (ease: string, repeat: number) => {
    const canvas = document.getElementById("preview-canvas");
    if (!canvas) {
      return;
    }
    if (canvas instanceof HTMLCanvasElement) {
      const ctx = canvas.getContext("2d")!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const fn = repeatEasing(EASINGS_MAP[ease], repeat);

      // We want to show overshoot for things like elastic
      const options: Partial<GraphOptions> = {
        domain: [0, 1],
        range: [-0.4, 1.4],
        width: 1,
        dash: 5,
      };

      // Draw the upper boundary
      drawFunction(canvas, (_x) => 1, {
        color: "tomato",
        ...options,
      });
      // Draw the 0 boundary
      drawFunction(canvas, (_x) => 0.5, {
        color: "grey",
        ...options,
      });
      // Draw the lower boundary
      drawFunction(canvas, (_x) => -0, {
        color: "deepskyblue",
        ...options,
      });
      // Draw all the repeat boundaries
      for (let i = 1; i < repeat; ++i) {
        if (i === repeat / 2) {
          continue;
        }
        drawFunction(canvas, (_x) => i / repeat, {
          // color: "#4a4a4c",
          color: "#3a3a3a",
          ...options,
        });
      }

      // Draw the ease function
      drawFunction(canvas, fn, {
        color: "white",
        ...options,
        width: 1,
        dash: 0,
      });
    }
  };

  const { register, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: {
      fps: 30,
      ease: EASINGS[0].name,
      repeat: 1,
      start: {
        frame: 0,
        x: 0,
        y: 0,
        opacity: 100,
        width: 1920,
        height: 1080,
        rotation: 0,
      },
      end: {
        frame: 0,
        x: 0,
        y: 0,
        opacity: 100,
        width: 1920,
        height: 1080,
        rotation: 0,
      },
    },
  });

  const onSubmit = () => {};

  const values = watch();

  type FormState = typeof values;

  const ease = values.ease;
  const repeat = values.repeat;

  React.useEffect(() => {
    if (ease) {
      generatePreview(ease, repeat);
    }
  }, [ease, repeat]);

  React.useEffect(() => {
    if (values) {
      const json = generateKeyFrameJSON({
        ...values,
        ease: {
          name: values.ease,
          func: repeatEasing(EASINGS_MAP[values.ease], values.repeat),
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

  const onInferFromClip = (e: string) => {
    try {
      const inferred = parseClip(e);
      setValue("fps", inferred.fps);
      setValue("start.frame", 0);
      setValue("end.frame", inferred.durationFrames);
    } catch {}
  };

  const onInferFromKeyFrames = (e: string) => {
    try {
      const effects = rawEffectsParser.parse(JSON.parse(e)).map(parseRawEffect);

      if (effects.length < 1) {
        return;
      }

      for (const effect of effects) {
        const [first, last] = [_.first(effect.entries), _.last(effect.entries)];

        if (first === undefined || last === undefined) {
          return;
        }

        if (first === last) {
          return;
        }
        setValue("start.frame", first.frame);
        setValue("end.frame", last.frame);

        if (effect.name === "rect") {
          const setFrame = (frame: "start" | "end", entry: RectangleEntry) => {
            setValue(`${frame}.x`, entry.x);
            setValue(`${frame}.y`, entry.y);
            setValue(`${frame}.width`, entry.width);
            setValue(`${frame}.height`, entry.height);
            setValue(`${frame}.opacity`, entry.opacity);
          };

          setFrame("start", parseRectangleEntry(first));
          setFrame("end", parseRectangleEntry(last));
        } else if (effect.name === "rotation") {
          const firstFrame = parseRotationEntry(first);
          const lastFrame = parseRotationEntry(last);

          setValue("start.rotation", firstFrame.angle);
          setValue("end.rotation", lastFrame.angle);
        }
      }
    } catch {}
  };

  const onChoosePreset = (presetName: string) => {
    const preset = PRESETS.find((x) => x.name === presetName);
    if (preset === undefined) {
      return;
    }
    const newValues: FormState = _.merge(values, preset.settings);
    reset(newValues);
  };

  return (
    <div
      className="App"
      style={{ margin: "auto", padding: "20px", textAlign: "left" }}
    >
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div
          id="form"
          style={{
            marginRight: "40px",
          }}
        >
          <select onChange={(e) => onChoosePreset(e.target.value)}>
            <option value="<choose preset>">{"<choose preset>"}</option>
            {PRESETS.map((x, i) => (
              <option key={i} value={x.name}>
                {x.name}
              </option>
            ))}
          </select>
          <h1 style={{ marginTop: 0 }}>
            Options
            <input
              style={{
                fontSize: "15px",
                marginLeft: "20px",
                fontFamily: "monospace",
                float: "right",
              }}
              placeholder="paste clip"
              onPaste={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onInferFromClip(e.clipboardData.getData("text"));
              }}
            ></input>
            <input
              style={{
                fontSize: "15px",
                marginLeft: "20px",
                fontFamily: "monospace",
                float: "right",
              }}
              placeholder="paste keyframes"
              onPaste={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onInferFromKeyFrames(e.clipboardData.getData("text"));
              }}
            ></input>
          </h1>
          <br />
          <form id="options" onSubmit={handleSubmit(onSubmit)}>
            <label>FPS</label>
            <input
              {...register("fps", {
                valueAsNumber: true,
                min: 0,
                required: true,
              })}
            />
            <br />
            <label>Ease Type</label>
            <select {...register("ease")}>
              {EASINGS.map((ease, i) => (
                <option key={i} value={ease.name}>
                  {ease.name}
                </option>
              ))}
            </select>
            <br />
            <label>Repeat</label>
            <input
              {...register("repeat", {
                valueAsNumber: true,
                min: 1,
                required: true,
              })}
            />

            <h2 style={{ color: "deepskyblue" }}>Start</h2>
            <label>Frame</label>
            <input {...register("start.frame", { valueAsNumber: true })} />
            <br />
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
            <br />

            <label>Rotation</label>
            <input
              {...register("start.rotation", {
                valueAsNumber: true,
              })}
            />
            <h2 style={{ color: "tomato" }}>End</h2>
            <label>Frame</label>
            <input {...register("end.frame", { valueAsNumber: true })} />
            <br />
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
            <br />

            <label>Rotation</label>
            <input
              {...register("end.rotation", {
                valueAsNumber: true,
              })}
            />
          </form>
          <div>
            <br />
            <div>
              <iframe
                width="450"
                height="254"
                src="https://www.youtube.com/embed/_miwNAN1qu8?si=zPA165c-epYFVKPV"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
        <div id="io">
          <h1>Preview</h1>
          <canvas
            width={888}
            height={400}
            style={{
              border: "1px solid #3a3a3c",
              backgroundColor: "#0a0a0c",
            }}
            id="preview-canvas"
          ></canvas>
          <br></br>
          <h1>Keyframe Output</h1>
          <pre
            style={{
              minWidth: "888px",
              maxWidth: "888px",
              maxHeight: "450px",
              minHeight: "450px",
              overflow: "scroll",
              border: "1px solid #3a3a3c",
            }}
          >
            <code
              onClick={() => {
                selectElementContents(document.getElementById("keyframes")!);
              }}
              style={{
                minWidth: "888px",
                maxWidth: "888px",
                overflowX: "scroll",
              }}
              id="keyframes"
              className="language-json"
            ></code>
          </pre>
        </div>
      </div>
    </div>
  );
}

export default App;
