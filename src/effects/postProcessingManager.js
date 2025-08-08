import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
import { RGBShiftShader } from "three/examples/jsm/shaders/RGBShiftShader.js";
import { Vector2 } from "three";

export class PostProcessingManager {
  constructor(renderer, scene, camera) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.composer = null;
    this.blurPass = null;
    this.rgbShiftPass = null;
    this.bloomPass = null;
    this.fxaaPass = null;
  }

  init(radialBlurShader) {
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));

    // BLOOM
    this.bloomPass = new UnrealBloomPass(
      new Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.07
    );
    this.composer.addPass(this.bloomPass);

    this.blurPass = new ShaderPass(radialBlurShader);
    this.composer.addPass(this.blurPass);

    // RGB SHIFT
    this.rgbShiftPass = new ShaderPass(RGBShiftShader);
    this.composer.addPass(this.rgbShiftPass);

    // FXAA
    this.fxaaPass = new ShaderPass(FXAAShader);
    const pixelRatio = this.renderer.getPixelRatio();
    this.fxaaPass.uniforms["resolution"].value.x =
      1 / (window.innerWidth * pixelRatio);
    this.fxaaPass.uniforms["resolution"].value.y =
      1 / (window.innerHeight * pixelRatio);
    this.composer.addPass(this.fxaaPass);
  }

  updateBlurStrength(strength) {
    if (this.blurPass) {
      this.blurPass.uniforms.blurStrength.value = strength;
    }
  }

  updateRGBShift(amount, angle) {
    if (this.rgbShiftPass) {
      this.rgbShiftPass.uniforms.amount.value = amount;
      this.rgbShiftPass.uniforms.angle.value = angle;
    }
  }

  render() {
    this.composer.render();
  }

  resize(width, height) {
    this.composer.setSize(width, height);

    // Update FXAA resolution
    if (this.fxaaPass) {
      const pixelRatio = this.renderer.getPixelRatio();
      this.fxaaPass.uniforms["resolution"].value.x = 1 / (width * pixelRatio);
      this.fxaaPass.uniforms["resolution"].value.y = 1 / (height * pixelRatio);
    }
  }
}
