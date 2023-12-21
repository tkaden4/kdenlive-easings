import { Settings } from "./generator";

export type Preset = {
  name: string;
  settings: Partial<
    Omit<Settings, "start" | "end"> & {
      start: Partial<Settings["start"]>;
    } & {
      end: Partial<Settings["end"]>;
    }
  >;
};

export const thirtyHD: Preset = {
  name: "30fps 1080p",
  settings: {
    fps: 30,
    start: {
      width: 1920,
      height: 1080,
    },
    end: {
      width: 1920,
      height: 1080,
    },
  },
};

export const sixtyHD: Preset = {
  name: "60fps 1080p",
  settings: {
    fps: 60,
    start: {
      width: 1920,
      height: 1080,
    },
    end: {
      width: 1920,
      height: 1080,
    },
  },
};

export const thirtyHDVertical = {
  name: "30fps 1080p Vertical",
  settings: {
    fps: 30,
    start: {
      height: 1920,
      width: 1080,
    },
    end: {
      height: 1920,
      width: 1080,
    },
  },
};

export const sixtyHDVertical = {
  name: "60fps 1080p Vertical",
  settings: {
    fps: 60,
    start: {
      height: 1920,
      width: 1080,
    },
    end: {
      height: 1920,
      width: 1080,
    },
  },
};

export const PRESETS = [thirtyHD, sixtyHD, thirtyHDVertical, sixtyHDVertical];
