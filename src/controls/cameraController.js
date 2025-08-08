import { MathUtils } from "three";

export class CameraController {
  constructor(camera, curvePath) {
    this.camera = camera;
    this.curvePath = curvePath;
    this.scrollProgress = 0;
    this.currentP = 0;
    this.lastDeltaSpeed = 0.0;
    this.lastTime = 0;
  }

  init() {
    this.setupScrollControl();
  }

  setupScrollControl() {
    window.addEventListener("wheel", (event) => {
      const now = performance.now();
      if (now - this.lastTime < 50) return;
      this.lastTime = now;

      const deltaSpeed = MathUtils.clamp(event.deltaY * 0.0001, -0.1, 0.1);
      this.scrollProgress += deltaSpeed;
      this.lastDeltaSpeed = deltaSpeed;
    });
  }

  update() {
    const targetP = this.scrollProgress;
    this.currentP += (targetP - this.currentP) * 0.02;

    const pos = this.curvePath.getPoint(this.currentP % 1);
    const lookAt = this.curvePath.getPoint((this.currentP + 0.01) % 1);

    this.camera.position.copy(pos);
    this.camera.lookAt(lookAt);

    // Decay blur speed over time
    this.lastDeltaSpeed *= 0.9;
  }

  getBlurStrength() {
    return Math.abs(this.lastDeltaSpeed) * 7.0;
  }

  getSpeedBoost() {
    return (Math.abs(this.lastDeltaSpeed) / 0.1) * 0.25;
  }
}
