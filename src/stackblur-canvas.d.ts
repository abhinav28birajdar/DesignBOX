declare module "stackblur-canvas" {
  export function imageDataRGBA(imageData: ImageData, topX: number, topY: number, width: number, height: number, radius: number): void;
  export function imageDataRGB(imageData: ImageData, topX: number, topY: number, width: number, height: number, radius: number): void;
}
