export * from "./layer";

export type FrameObject = {
  delay: number;
  delayMs: number;
  disposalType: number;
  height: number;
  width: number;
  left: number;
  top: number;
  imageData: ImageData;
};