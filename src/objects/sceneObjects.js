import {
  MeshStandardMaterial,
  MeshBasicMaterial,
  Mesh,
  Vector3,
  BoxGeometry,
  IcosahedronGeometry,
  PlaneGeometry,
  Points,
  PointsMaterial,
  BufferGeometry,
  BufferAttribute,
  AdditiveBlending,
  DoubleSide,
} from "three";

// Scene objects management (moving objects, neon planes, particles)
export class SceneObjects {
  constructor() {
    this.movingObjects = [];
    this.neonPlanes = [];
    this.particleSystem = null;
    this.particleMaterial = null;
    this.movingObjMat = null;
    this.cameraTarget = new Vector3();

    this.boxGeo = new BoxGeometry(0.1, 0.1, 0.1);
    this.icoGeo = new IcosahedronGeometry(0.1, 0);
  }

  init(curvePath, radius, loadedTextures) {
    this.curvePath = curvePath;
    this.radius = radius;
    this.loadedTextures = loadedTextures;

    // Create moving objects material
    this.movingObjMat = new MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 1.0,
      transparent: true,
      wireframe: true,
      opacity: 0.4,
    });

    this.createMovingObjects();
    this.createNeonPlanes();
    this.particleSystem = this.createParticles(500);

    return {
      movingObjects: this.movingObjects,
      neonPlanes: this.neonPlanes,
      particleSystem: this.particleSystem,
    };
  }

  getTubeFrame(path, u, normal, binormal) {
    const epsilon = 0.0001;
    const tangent = path.getTangentAt(u);

    const nextU = (u + epsilon) % 1;
    const nextTangent = path.getTangentAt(nextU);

    binormal.crossVectors(tangent, nextTangent).normalize();
    if (binormal.lengthSq() === 0) {
      binormal.set(0, 0, 1); // fallback
    }
    normal.crossVectors(binormal, tangent).normalize();
  }

  createMovingObjects(objectCount = 30) {
    for (let i = 0; i < objectCount; i++) {
      const u = Math.random();
      const v = Math.random() * Math.PI * 2;
      const segment = this.curvePath.getPointAt(u);

      const normal = new Vector3();
      const binormal = new Vector3();
      this.getTubeFrame(this.curvePath, u, normal, binormal);

      const radiusOffset = (Math.random() - 0.5) * 0.5;
      const r = this.radius + radiusOffset;

      const cx = -r * Math.cos(v);
      const cy = r * Math.sin(v);

      const pos = new Vector3();
      pos
        .copy(segment)
        .add(normal.clone().multiplyScalar(cx))
        .add(binormal.clone().multiplyScalar(cy));

      const geometry = Math.random() > 0.5 ? this.boxGeo : this.icoGeo;
      const mesh = new Mesh(geometry, this.movingObjMat);
      mesh.position.copy(pos);

      mesh.rotationAxis = new Vector3(
        Math.random(),
        Math.random(),
        Math.random()
      ).normalize();
      mesh.rotationSpeed = 0.01 + Math.random() * 0.02;

      this.movingObjects.push(mesh);
    }
  }

  createNeonPlanes(totalPlanes = 12) {
    const planeGeometry = new PlaneGeometry(1, 1);
    const textures = this.loadedTextures;

    for (let i = 0; i < totalPlanes; i++) {
      const texture = textures[i % textures.length];

      const material = new MeshBasicMaterial({
        map: texture,
        transparent: true,
        blending: AdditiveBlending,
        depthWrite: false,
        side: DoubleSide,
        opacity: 0.5,
      });

      const mesh = new Mesh(planeGeometry, material);

      const u = i / totalPlanes;
      const v = Math.random() * Math.PI * 2;

      const segment = this.curvePath.getPointAt(u);

      const normal = new Vector3();
      const binormal = new Vector3();
      this.getTubeFrame(this.curvePath, u, normal, binormal);

      const cx = -1.5 * Math.cos(v);
      const cy = 1.5 * Math.sin(v);

      const pos = new Vector3()
        .copy(segment)
        .add(normal.clone().multiplyScalar(cx))
        .add(binormal.clone().multiplyScalar(cy));

      mesh.position.copy(pos);
      this.neonPlanes.push(mesh);
    }
  }

  createParticles(count = 1000) {
    const geometry = new BufferGeometry();
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    geometry.setAttribute("position", new BufferAttribute(positions, 3));

    const material = new PointsMaterial({
      color: 0xffffff,
      size: 0.02,
      transparent: true,
      blending: AdditiveBlending,
    });

    this.particleMaterial = material;
    return new Points(geometry, material);
  }

  animateMovingObjects() {
    this.movingObjects.forEach((mesh) => {
      mesh.rotateOnAxis(mesh.rotationAxis, mesh.rotationSpeed);
    });
  }

  animateNeonPlanes(camera) {
    this.cameraTarget.copy(camera.position);
    for (const mesh of this.neonPlanes) {
      mesh.lookAt(this.cameraTarget);
    }
  }

  updateColors(hue, lightness) {
    // Update moving objects material
    this.movingObjMat.color.setHSL(hue, 1.0, 0.6);
    this.movingObjMat.emissive.setHSL(hue, 1.0, 0.6);

    // Update particle material
    if (this.particleMaterial) {
      this.particleMaterial.color.setHSL(hue, 1.0, lightness);
    }
  }

  applyAudioEffects(midLevel) {
    // Efecto de pulsación suave en planos de neón según frecuencias medias
    this.neonPlanes.forEach((mesh) => {
      mesh.scale.setScalar(1 + midLevel * 0.2);
    });
  }
}
