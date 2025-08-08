// radial blur fragment shader
uniform sampler2D tDiffuse;
uniform vec2 resolution;
uniform vec2 center;
uniform float blurStrength;
varying vec2 vUv;
const int samples = 5;
void main() {
  vec2 uv = vUv;
  vec2 dir = uv - center;
  vec4 color = vec4(0.0);
  float total = 0.0;
  for (int i = 0; i < samples; i++) {
    float t = float(i) / float(samples - 1);
    vec2 offset = dir * t * blurStrength;
    color += texture2D(tDiffuse, uv - offset);
    total += 1.0;
  }
  gl_FragColor = color / total;
}
