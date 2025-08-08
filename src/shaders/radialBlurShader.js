import { Vector2 } from "three";

export const radialBlurShader = {
  uniforms: {
    tDiffuse: { value: null },
    resolution: { value: new Vector2(window.innerWidth, window.innerHeight) },
    center: { value: new Vector2(0.5, 0.5) },
    blurStrength: { value: 0.0 },
  },
  vertexShader: null,
  fragmentShader: null,
};

export function initRadialBlurShader(vertexShader, fragmentShader) {
  radialBlurShader.vertexShader = vertexShader;
  radialBlurShader.fragmentShader = fragmentShader;
  return radialBlurShader;
}
