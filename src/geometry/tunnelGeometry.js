import {
  Vector3,
  CatmullRomCurve3,
  TubeGeometry,
  BufferGeometry,
  LineBasicMaterial,
  LineSegments,
  AdditiveBlending,
} from "three";

// Tunnel geometry and path generation
export class TunnelGeometry {
  constructor(radius = 0.5) {
    this.radius = radius;
    this.curvePath = null;
    this.tubeGeometry = null;
    this.tubeLines = null;
  }

  generateSmoothPathPoints(numPoints, radius = 10) {
    const points = [];
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;
      const x = radius * Math.cos(angle);
      const y = Math.sin(angle * 2) * radius * 0.5;
      const z = radius * Math.sin(angle);
      points.push(new Vector3(x, y, z));
    }
    return points;
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

  createQuadGridLines(geometry) {
    const { parameters } = geometry;
    const path = parameters.path;
    const tubularSegments = parameters.tubularSegments;
    const radialSegments = parameters.radialSegments;
    const radius = parameters.radius;

    const vertices = [];

    for (let i = 0; i <= tubularSegments; i++) {
      const u = i / tubularSegments;
      const segment = path.getPointAt(u);
      const normal = new Vector3();
      const binormal = new Vector3();
      this.getTubeFrame(path, u, normal, binormal);

      for (let j = 0; j <= radialSegments; j++) {
        const v = (j / radialSegments) * Math.PI * 2;
        const cx = -radius * Math.cos(v);
        const cy = radius * Math.sin(v);

        const pos = new Vector3();
        pos
          .copy(segment)
          .add(normal.clone().multiplyScalar(cx))
          .add(binormal.clone().multiplyScalar(cy));

        vertices.push(pos);
      }
    }

    const lineVertices = [];

    // CONNECT POINTS
    for (let i = 0; i < tubularSegments; i++) {
      for (let j = 0; j <= radialSegments; j++) {
        const index1 = i * (radialSegments + 1) + j;
        const index2 = (i + 1) * (radialSegments + 1) + j;
        lineVertices.push(vertices[index1], vertices[index2]);
      }
    }

    for (let i = 0; i <= tubularSegments; i++) {
      for (let j = 0; j < radialSegments; j++) {
        const index1 = i * (radialSegments + 1) + j;
        const index2 = i * (radialSegments + 1) + (j + 1);
        lineVertices.push(vertices[index1], vertices[index2]);
      }
    }

    const lineGeometry = new BufferGeometry().setFromPoints(lineVertices);
    const lineMaterial = new LineBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.9,
      blending: AdditiveBlending,
    });

    return new LineSegments(lineGeometry, lineMaterial);
  }

  init() {
    // Generate path points
    const points = this.generateSmoothPathPoints(6);
    this.curvePath = new CatmullRomCurve3(points, true);

    // Create tube geometry
    const tubularSegments = 80;
    const radialSegments = 8;
    const closed = true;

    this.tubeGeometry = new TubeGeometry(
      this.curvePath,
      tubularSegments,
      this.radius,
      radialSegments,
      closed
    );

    // Create tube lines
    this.tubeLines = this.createQuadGridLines(this.tubeGeometry);

    return {
      curvePath: this.curvePath,
      tubeGeometry: this.tubeGeometry,
      tubeLines: this.tubeLines,
    };
  }
}
