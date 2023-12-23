// I stole this and adapted it to JS
// https://github.com/semitable/easing-functions/blob/master/easing_functions/easing.py

import _ from "lodash";

export type EasingFunc = (t: number) => number;

export abstract class AbstractEasing {
  private limit: [number, number] = [0, 1];
  private start: number;
  private end: number;
  private duration: number;

  constructor(start: number = 0, end: number = 1, duration: number = 1) {
    this.start = start;
    this.end = end;
    this.duration = duration;
  }

  abstract func(t: number): number;
  abstract name: string;

  ease(alpha: number): number {
    const t =
      (this.limit[0] * (1 - alpha) + this.limit[1] * alpha) / this.duration;
    const a = this.func(t);
    return this.end * a + this.start * (1 - a);
  }
}

export class LinearInOut extends AbstractEasing {
  public name: string = "LinearInOut";
  func(t: number): number {
    return t;
  }
}

//// Quadratic

export class QuadEaseInOut extends AbstractEasing {
  public name: string = "QuadEaseInOut";
  func(t: number): number {
    if (t < 0.5) return 2 * t * t;
    return -2 * t * t + 4 * t - 1;
  }
}

export class QuadEaseIn extends AbstractEasing {
  public name: string = "QuadEaseIn";
  func(t: number): number {
    return t * t;
  }
}

export class QuadEaseOut extends AbstractEasing {
  public name: string = "QuadEaseOut";
  func(t: number): number {
    return -(t * (t - 2));
  }
}

//// Cubic

export class CubicEaseIn extends AbstractEasing {
  public name: string = "CubicEaseIn";
  func(t: number): number {
    return t * t * t;
  }
}

export class CubicEaseOut extends AbstractEasing {
  public name: string = "CubicEaseOut";
  func(t: number): number {
    return (t - 1) * (t - 1) * (t - 1) + 1;
  }
}

export class CubicEaseInOut extends AbstractEasing {
  public name: string = "CubicEaseInOut";
  func(t: number): number {
    if (t < 0.5) return 4 * t * t * t;
    const p = 2 * t - 2;
    return 0.5 * p * p * p + 1;
  }
}

//// Quartic

export class QuarticEaseIn extends AbstractEasing {
  public name: string = "QuarticEaseIn";
  func(t: number): number {
    return t * t * t * t;
  }
}

export class QuarticEaseOut extends AbstractEasing {
  public name: string = "QuarticEaseOut";
  func(t: number): number {
    return (t - 1) * (t - 1) * (t - 1) * (1 - t) + 1;
  }
}

export class QuarticEaseInOut extends AbstractEasing {
  public name: string = "QuarticEaseInOut";
  func(t: number): number {
    if (t < 0.5) return 8 * t * t * t * t;
    const p = t - 1;
    return -8 * p * p * p * p + 1;
  }
}

//// Quintic

export class QuinticEaseIn extends AbstractEasing {
  public name: string = "QuinticEaseIn";
  func(t: number): number {
    return t * t * t * t * t;
  }
}

export class QuinticEaseOut extends AbstractEasing {
  public name: string = "QuinticEaseOut";
  func(t: number): number {
    return (t - 1) * (t - 1) * (t - 1) * (t - 1) * (t - 1) + 1;
  }
}

export class QuinticEaseInOut extends AbstractEasing {
  public name: string = "QuinticEaseInOut";
  func(t: number): number {
    if (t < 0.5) return 16 * t * t * t * t * t;
    const p = 2 * t - 2;
    return 0.5 * p * p * p * p * p + 1;
  }
}

//// Sine

export class SineEaseIn extends AbstractEasing {
  public name: string = "SineEaseIn";
  func(t: number): number {
    return Math.sin(((t - 1) * Math.PI) / 2) + 1;
  }
}

export class SineEaseOut extends AbstractEasing {
  public name: string = "SineEaseOut";
  func(t: number): number {
    return Math.sin((t * Math.PI) / 2);
  }
}

export class SineEaseInOut extends AbstractEasing {
  public name: string = "SineEaseInOut";
  func(t: number): number {
    return 0.5 * (1 - Math.cos(t * Math.PI));
  }
}

//// Circular

export class CircularEaseIn extends AbstractEasing {
  public name: string = "CircularEaseIn";
  func(t: number): number {
    return 1 - Math.sqrt(1 - t * t);
  }
}

export class CircularEaseOut extends AbstractEasing {
  public name: string = "CircularEaseOut";
  func(t: number): number {
    return Math.sqrt((2 - t) * t);
  }
}

export class CircularEaseInOut extends AbstractEasing {
  public name: string = "CircularEaseInOut";
  func(t: number): number {
    if (t < 0.5) return 0.5 * (1 - Math.sqrt(1 - 4 * (t * t)));
    return 0.5 * (Math.sqrt(-(2 * t - 3) * (2 * t - 1)) + 1);
  }
}

// Exponential

export class ExponentialEaseIn extends AbstractEasing {
  public name: string = "ExponentialEaseIn";
  func(t: number): number {
    return t === 0 ? 0 : Math.pow(2, 10 * (t - 1));
  }
}

export class ExponentialEaseOut extends AbstractEasing {
  public name: string = "ExponentialEaseOut";
  func(t: number): number {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }
}

export class ExponentialEaseInOut extends AbstractEasing {
  public name: string = "ExponentialEaseInOut";
  func(t: number): number {
    if (t === 0 || t === 1) return t;
    if (t < 0.5) return 0.5 * Math.pow(2, 20 * t - 10);
    return -0.5 * Math.pow(2, -20 * t + 10) + 1;
  }
}

// Elastic

export class ElasticEaseIn extends AbstractEasing {
  public name: string = "ElasticEaseIn";
  func(t: number): number {
    return Math.sin(((13 * Math.PI) / 2) * t) * Math.pow(2, 10 * (t - 1));
  }
}

export class ElasticEaseOut extends AbstractEasing {
  public name: string = "ElasticEaseOut";
  func(t: number): number {
    return Math.sin(((-13 * Math.PI) / 2) * (t + 1)) * Math.pow(2, -10 * t) + 1;
  }
}

export class ElasticEaseInOut extends AbstractEasing {
  public name: string = "ElasticEaseInOut";
  func(t: number): number {
    if (t < 0.5)
      return (
        0.5 *
        Math.sin(((13 * Math.PI) / 2) * (2 * t)) *
        Math.pow(2, 10 * (2 * t - 1))
      );
    return (
      0.5 *
      (Math.sin(((-13 * Math.PI) / 2) * (2 * t - 1 + 1)) *
        Math.pow(2, -10 * (2 * t - 1)) +
        2)
    );
  }
}

// Back

export class BackEaseIn extends AbstractEasing {
  public name: string = "BackEaseIn";
  func(t: number): number {
    return t * t * t - t * Math.sin(t * Math.PI);
  }
}

export class BackEaseOut extends AbstractEasing {
  public name: string = "BackEaseOut";
  func(t: number): number {
    const p = 1 - t;
    return 1 - (p * p * p - p * Math.sin(p * Math.PI));
  }
}

export class BackEaseInOut extends AbstractEasing {
  public name: string = "BackEaseInOut";
  func(t: number): number {
    if (t < 0.5) {
      const p = 2 * t;
      return 0.5 * (p * p * p - p * Math.sin(p * Math.PI));
    }

    const p = 1 - (2 * t - 1);
    return 0.5 * (1 - (p * p * p - p * Math.sin(p * Math.PI))) + 0.5;
  }
}

// Bounce

export class BounceEaseIn extends AbstractEasing {
  public name: string = "BounceEaseIn";
  func(t: number): number {
    return 1 - new BounceEaseOut(0, 1, 1).func(1 - t);
  }
}

export class BounceEaseOut extends AbstractEasing {
  public name: string = "BounceEaseOut";
  func(t: number): number {
    if (t < 4 / 11) return (121 * t * t) / 16;
    else if (t < 8 / 11)
      return (363 / 40.0) * t * t - (99 / 10.0) * t + 17 / 5.0;
    else if (t < 9 / 10)
      return (4356 / 361.0) * t * t - (35442 / 1805.0) * t + 16061 / 1805.0;
    return (54 / 5.0) * t * t - (513 / 25.0) * t + 268 / 25.0;
  }
}

export class BounceEaseInOut extends AbstractEasing {
  public name: string = "BounceEaseInOut";
  func(t: number): number {
    if (t < 0.5) return 0.5 * new BounceEaseIn(0, 1, 1).func(t * 2);
    return 0.5 * new BounceEaseOut(0, 1, 1).func(t * 2 - 1) + 0.5;
  }
}

// Divide the output range into n sections, and apply the easing func to get between each
export function repeatEasing(easing: EasingFunc, n: number): EasingFunc {
  if (n < 1) {
    return easing;
  }
  const one = easing(1) / n;
  const chunk = 1 / n;

  return (x: number) => {
    const nchunk = Math.floor(x / chunk);
    const actualX = (x - nchunk * chunk) / chunk;

    return one * nchunk + easing(actualX) / n;
  };
}

export const EASINGS = [
  LinearInOut,
  QuadEaseIn,
  QuadEaseOut,
  QuadEaseInOut,
  CubicEaseIn,
  CubicEaseOut,
  CubicEaseInOut,
  QuarticEaseIn,
  QuadEaseOut,
  QuarticEaseInOut,
  QuarticEaseIn,
  QuarticEaseOut,
  QuinticEaseIn,
  QuinticEaseOut,
  QuinticEaseInOut,
  SineEaseIn,
  SineEaseOut,
  SineEaseInOut,
  CircularEaseIn,
  CircularEaseOut,
  CircularEaseInOut,
  ExponentialEaseIn,
  ExponentialEaseOut,
  ExponentialEaseInOut,
  ElasticEaseIn,
  ElasticEaseOut,
  ElasticEaseInOut,
  BackEaseIn,
  BackEaseOut,
  BackEaseInOut,
  BounceEaseIn,
  BounceEaseOut,
  BounceEaseInOut,
].map((Clazz) => ({
  name: new Clazz().name,
  func: (t: number) => new Clazz().func(t),
}));

export const EASINGS_MAP: Record<string, EasingFunc> = _.fromPairs(
  EASINGS.map((easing) => [easing.name, easing.func])
);
