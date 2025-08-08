import { Vector2 } from "three";

// Custom radial blur shader
export const radialBlurShader = {
  uniforms: {
    tDiffuse: { value: null },
    resolution: { value: new Vector2(window.innerWidth, window.innerHeight) },
    center: { value: new Vector2(0.5, 0.5) },
    blurStrength: { value: 0.0 },
  },
  vertexShader: null, // Will be set from imported shader
  fragmentShader: null, // Will be set from imported shader
};

// Initialize shader with imported vertex and fragment shaders
export function initRadialBlurShader(vertexShader, fragmentShader) {
  radialBlurShader.vertexShader = vertexShader;
  radialBlurShader.fragmentShader = fragmentShader;
  return radialBlurShader;
}
