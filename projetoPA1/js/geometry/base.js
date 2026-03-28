// js/geometry/base.js
// ============================================================
// BASE GEOMETRY LIBRARY
// Generic helpers, profiles, primitives and rounded shapes
// ============================================================

class Geometry {
  // ----------------------------------------------------------
  // BASIC HELPERS
  // ----------------------------------------------------------

  static addQuad(triangles, i0, i1, i2, i3) {
    triangles.push([i0, i1, i2]);
    triangles.push([i0, i2, i3]);
  }

  static mergeMeshes(meshes) {
    return Mesh.merge(...meshes);
  }

  static clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  static lerp(a, b, t) {
    return a + (b - a) * t;
  }

  static rotatePointX(p, angle) {
    const [x, y, z] = p;
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return [x, y * c - z * s, y * s + z * c];
  }

  static rotatePointY(p, angle) {
    const [x, y, z] = p;
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return [x * c + z * s, y, -x * s + z * c];
  }

  static rotatePointZ(p, angle) {
    const [x, y, z] = p;
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return [x * c - y * s, x * s + y * c, z];
  }

  static rotateMeshX(mesh, angle) {
    return {
      vertices: mesh.vertices.map((v) => Geometry.rotatePointX(v, angle)),
      triangles: mesh.triangles.map((t) => [...t]),
      uvs: mesh.uvs ? mesh.uvs.map((uv) => [...uv]) : [],
    };
  }

  static rotateMeshY(mesh, angle) {
    return {
      vertices: mesh.vertices.map((v) => Geometry.rotatePointY(v, angle)),
      triangles: mesh.triangles.map((t) => [...t]),
      uvs: mesh.uvs ? mesh.uvs.map((uv) => [...uv]) : [],
    };
  }

  static rotateMeshZ(mesh, angle) {
    return {
      vertices: mesh.vertices.map((v) => Geometry.rotatePointZ(v, angle)),
      triangles: mesh.triangles.map((t) => [...t]),
      uvs: mesh.uvs ? mesh.uvs.map((uv) => [...uv]) : [],
    };
  }

  static profileBounds(points) {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    for (const p of points) {
      minX = Math.min(minX, p[0]);
      maxX = Math.max(maxX, p[0]);
      minY = Math.min(minY, p[1]);
      maxY = Math.max(maxY, p[1]);
    }

    return { minX, maxX, minY, maxY };
  }

  static reverseProfile(points) {
    return points
      .slice()
      .reverse()
      .map((p) => [...p]);
  }

  // ----------------------------------------------------------
  // PROFILE GENERATION (2D)
  // ----------------------------------------------------------

  static makeCircleProfile(radius = 50, segments = 24) {
    const pts = [];
    for (let i = 0; i < segments; i++) {
      const a = (Math.PI * 2 * i) / segments;
      pts.push([Math.cos(a) * radius, Math.sin(a) * radius]);
    }
    return pts;
  }

  static makeRoundedRectProfile(
    width = 100,
    height = 100,
    radius = 16,
    cornerSegments = 6,
  ) {
    const w = width / 2;
    const h = height / 2;
    const r = Math.min(radius, w, h);

    const pts = [];

    const corners = [
      { cx: w - r, cy: -h + r, a0: -Math.PI / 2, a1: 0 },
      { cx: w - r, cy: h - r, a0: 0, a1: Math.PI / 2 },
      { cx: -w + r, cy: h - r, a0: Math.PI / 2, a1: Math.PI },
      { cx: -w + r, cy: -h + r, a0: Math.PI, a1: Math.PI * 1.5 },
    ];

    for (let c = 0; c < corners.length; c++) {
      const corner = corners[c];
      const steps = Math.max(2, cornerSegments);

      for (let i = 0; i < steps; i++) {
        const t = i / (steps - 1);
        const a = Geometry.lerp(corner.a0, corner.a1, t);
        pts.push([corner.cx + Math.cos(a) * r, corner.cy + Math.sin(a) * r]);
      }

      if (c < corners.length - 1) pts.pop();
    }

    return pts;
  }

  static makeCapsuleProfile(length = 120, radius = 24, capSegments = 10) {
    const halfBody = Math.max(0, length / 2 - radius);
    const pts = [];

    for (let i = 0; i <= capSegments; i++) {
      const t = i / capSegments;
      const a = -Math.PI / 2 + t * Math.PI;
      pts.push([halfBody + Math.cos(a) * radius, Math.sin(a) * radius]);
    }

    for (let i = 0; i <= capSegments; i++) {
      const t = i / capSegments;
      const a = Math.PI / 2 + t * Math.PI;
      pts.push([-halfBody + Math.cos(a) * radius, Math.sin(a) * radius]);
    }

    return pts;
  }

  static makeOctagonProfile(width = 100, height = 100, cut = 12) {
    const w = width / 2;
    const h = height / 2;
    const c = Math.min(cut, w * 0.9, h * 0.9);

    return [
      [-w + c, -h],
      [w - c, -h],
      [w, -h + c],
      [w, h - c],
      [w - c, h],
      [-w + c, h],
      [-w, h - c],
      [-w, -h + c],
    ];
  }

  // ----------------------------------------------------------
  // GENERIC CONVEX PROFILE EXTRUSION
  // ----------------------------------------------------------

  static extrudeConvexProfile(profile, depth = 20) {
    const vertices = [];
    const triangles = [];
    const uvs = [];

    const zFront = depth / 2;
    const zBack = -depth / 2;
    const n = profile.length;

    if (n < 3) return Mesh.create([], [], []);

    const { minX, maxX, minY, maxY } = Geometry.profileBounds(profile);
    const spanX = Math.max(1e-6, maxX - minX);
    const spanY = Math.max(1e-6, maxY - minY);

    for (let i = 0; i < n; i++) {
      const [x, y] = profile[i];
      vertices.push([x, y, zFront]);
      uvs.push([(x - minX) / spanX, (y - minY) / spanY]);
    }

    for (let i = 0; i < n; i++) {
      const [x, y] = profile[i];
      vertices.push([x, y, zBack]);
      uvs.push([1 - (x - minX) / spanX, (y - minY) / spanY]);
    }

    for (let i = 1; i < n - 1; i++) {
      triangles.push([0, i, i + 1]);
    }

    const backOffset = n;
    for (let i = 1; i < n - 1; i++) {
      triangles.push([backOffset, backOffset + i + 1, backOffset + i]);
    }

    for (let i = 0; i < n; i++) {
      const next = (i + 1) % n;
      const a = i;
      const b = next;
      const c = backOffset + next;
      const d = backOffset + i;
      Geometry.addQuad(triangles, a, b, c, d);
    }

    return Mesh.create(vertices, triangles, uvs);
  }

  // ----------------------------------------------------------
  // BASIC SHAPES
  // ----------------------------------------------------------

  static makeTriangle() {
    const vertices = [
      [0, -50, 0],
      [-50, 50, 0],
      [50, 50, 0],
    ];

    const triangles = [[0, 1, 2]];
    const uvs = [
      [0.5, 0],
      [0, 1],
      [1, 1],
    ];

    return Mesh.create(vertices, triangles, uvs);
  }

  static makeQuad(width = 100, height = 100) {
    const w = width / 2;
    const h = height / 2;

    const vertices = [
      [-w, -h, 0],
      [w, -h, 0],
      [w, h, 0],
      [-w, h, 0],
    ];

    const triangles = [
      [0, 1, 2],
      [0, 2, 3],
    ];

    const uvs = [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
    ];

    return Mesh.create(vertices, triangles, uvs);
  }

  static makeBox(width = 100, height = 100, depth = 100) {
    const x = width / 2;
    const y = height / 2;
    const z = depth / 2;

    const vertices = [
      [-x, -y, z],
      [x, -y, z],
      [x, y, z],
      [-x, y, z],
      [x, -y, -z],
      [-x, -y, -z],
      [-x, y, -z],
      [x, y, -z],
      [-x, -y, -z],
      [-x, -y, z],
      [-x, y, z],
      [-x, y, -z],
      [x, -y, z],
      [x, -y, -z],
      [x, y, -z],
      [x, y, z],
      [-x, y, z],
      [x, y, z],
      [x, y, -z],
      [-x, y, -z],
      [-x, -y, -z],
      [x, -y, -z],
      [x, -y, z],
      [-x, -y, z],
    ];

    const triangles = [];
    for (let f = 0; f < 6; f++) {
      const base = f * 4;
      Geometry.addQuad(triangles, base, base + 1, base + 2, base + 3);
    }

    const uvs = [];
    for (let i = 0; i < 6; i++) {
      uvs.push([0, 0], [1, 0], [1, 1], [0, 1]);
    }

    return Mesh.create(vertices, triangles, uvs);
  }

  static makeTrapezoidPrism(
    topWidth = 80,
    bottomWidth = 100,
    height = 100,
    depth = 60,
  ) {
    const ty = -height / 2;
    const by = height / 2;
    const z = depth / 2;
    const tx = topWidth / 2;
    const bx = bottomWidth / 2;

    const vertices = [
      [-tx, ty, z],
      [tx, ty, z],
      [bx, by, z],
      [-bx, by, z],
      [tx, ty, -z],
      [-tx, ty, -z],
      [-bx, by, -z],
      [bx, by, -z],
      [-tx, ty, -z],
      [-tx, ty, z],
      [-bx, by, z],
      [-bx, by, -z],
      [tx, ty, z],
      [tx, ty, -z],
      [bx, by, -z],
      [bx, by, z],
      [-tx, ty, z],
      [tx, ty, z],
      [tx, ty, -z],
      [-tx, ty, -z],
      [-bx, by, -z],
      [bx, by, -z],
      [bx, by, z],
      [-bx, by, z],
    ];

    const triangles = [];
    for (let f = 0; f < 6; f++) {
      const base = f * 4;
      Geometry.addQuad(triangles, base, base + 1, base + 2, base + 3);
    }

    const uvs = [];
    for (let i = 0; i < 6; i++) {
      uvs.push([0, 0], [1, 0], [1, 1], [0, 1]);
    }

    return Mesh.create(vertices, triangles, uvs);
  }

  // ----------------------------------------------------------
  // CYLINDER / DISC / RING / SPHERE
  // ----------------------------------------------------------

  static makeCylinder(radius = 20, height = 100, sides = 24) {
    const vertices = [];
    const triangles = [];
    const uvs = [];

    const topY = -height / 2;
    const bottomY = height / 2;

    const topCenterIndex = 0;
    const bottomCenterIndex = 1;

    vertices.push([0, topY, 0]);
    vertices.push([0, bottomY, 0]);
    uvs.push([0.5, 0.5]);
    uvs.push([0.5, 0.5]);

    const topRing = [];
    const bottomRing = [];

    for (let i = 0; i < sides; i++) {
      const angle = (Math.PI * 2 * i) / sides;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      topRing.push(vertices.length);
      vertices.push([x, topY, z]);
      uvs.push([(x / radius + 1) * 0.5, (z / radius + 1) * 0.5]);

      bottomRing.push(vertices.length);
      vertices.push([x, bottomY, z]);
      uvs.push([(x / radius + 1) * 0.5, (z / radius + 1) * 0.5]);
    }

    for (let i = 0; i < sides; i++) {
      const next = (i + 1) % sides;
      triangles.push([topCenterIndex, topRing[i], topRing[next]]);
    }

    for (let i = 0; i < sides; i++) {
      const next = (i + 1) % sides;
      triangles.push([bottomCenterIndex, bottomRing[next], bottomRing[i]]);
    }

    for (let i = 0; i < sides; i++) {
      const next = (i + 1) % sides;
      const topA = topRing[i];
      const topB = topRing[next];
      const botA = bottomRing[i];
      const botB = bottomRing[next];

      triangles.push([topA, topB, botB]);
      triangles.push([topA, botB, botA]);
    }

    return Mesh.create(vertices, triangles, uvs);
  }

  static makeDisc(radius = 30, segments = 24) {
    const vertices = [[0, 0, 0]];
    const triangles = [];
    const uvs = [[0.5, 0.5]];

    for (let i = 0; i < segments; i++) {
      const a = (Math.PI * 2 * i) / segments;
      const x = Math.cos(a) * radius;
      const y = Math.sin(a) * radius;
      vertices.push([x, y, 0]);
      uvs.push([(x / radius + 1) * 0.5, (y / radius + 1) * 0.5]);
    }

    for (let i = 0; i < segments; i++) {
      const next = 1 + ((i + 1) % segments);
      triangles.push([0, 1 + i, next]);
    }

    return Mesh.create(vertices, triangles, uvs);
  }

  static makeRing(innerRadius = 16, outerRadius = 28, segments = 24) {
    const vertices = [];
    const triangles = [];
    const uvs = [];

    const inner = [];
    const outer = [];

    for (let i = 0; i < segments; i++) {
      const a = (Math.PI * 2 * i) / segments;
      const c = Math.cos(a);
      const s = Math.sin(a);

      outer.push(vertices.length);
      vertices.push([c * outerRadius, s * outerRadius, 0]);
      uvs.push([(c + 1) * 0.5, (s + 1) * 0.5]);

      inner.push(vertices.length);
      vertices.push([c * innerRadius, s * innerRadius, 0]);
      uvs.push([
        ((c * innerRadius) / outerRadius + 1) * 0.5,
        ((s * innerRadius) / outerRadius + 1) * 0.5,
      ]);
    }

    for (let i = 0; i < segments; i++) {
      const next = (i + 1) % segments;
      triangles.push([outer[i], outer[next], inner[next]]);
      triangles.push([outer[i], inner[next], inner[i]]);
    }

    return Mesh.create(vertices, triangles, uvs);
  }

  static makeUvSphere(radius = 30, latSteps = 8, lonSteps = 12) {
    const vertices = [];
    const triangles = [];
    const uvs = [];

    for (let lat = 0; lat <= latSteps; lat++) {
      const v = lat / latSteps;
      const theta = v * Math.PI;

      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      for (let lon = 0; lon <= lonSteps; lon++) {
        const u = lon / lonSteps;
        const phi = u * Math.PI * 2;

        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);

        const x = radius * sinTheta * cosPhi;
        const y = radius * cosTheta;
        const z = radius * sinTheta * sinPhi;

        vertices.push([x, y, z]);
        uvs.push([u, v]);
      }
    }

    const cols = lonSteps + 1;

    for (let lat = 0; lat < latSteps; lat++) {
      for (let lon = 0; lon < lonSteps; lon++) {
        const a = lat * cols + lon;
        const b = a + 1;
        const c = a + cols;
        const d = c + 1;

        triangles.push([a, c, d]);
        triangles.push([a, d, b]);
      }
    }

    return Mesh.create(vertices, triangles, uvs);
  }

  static makeSphereSlice(
    radius = 20,
    thetaStart = 0,
    thetaEnd = Math.PI,
    latSteps = 6,
    lonSteps = 14,
  ) {
    const vertices = [];
    const triangles = [];
    const uvs = [];

    for (let lat = 0; lat <= latSteps; lat++) {
      const v = lat / latSteps;
      const theta = Geometry.lerp(thetaStart, thetaEnd, v);

      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      for (let lon = 0; lon <= lonSteps; lon++) {
        const u = lon / lonSteps;
        const phi = u * Math.PI * 2;

        const x = radius * sinTheta * Math.cos(phi);
        const y = radius * cosTheta;
        const z = radius * sinTheta * Math.sin(phi);

        vertices.push([x, y, z]);
        uvs.push([u, v]);
      }
    }

    const cols = lonSteps + 1;

    for (let lat = 0; lat < latSteps; lat++) {
      for (let lon = 0; lon < lonSteps; lon++) {
        const a = lat * cols + lon;
        const b = a + 1;
        const c = a + cols;
        const d = c + 1;

        triangles.push([a, c, d]);
        triangles.push([a, d, b]);
      }
    }

    return Mesh.create(vertices, triangles, uvs);
  }

  // ----------------------------------------------------------
  // ADVANCED SOFT / ROUNDED SHAPES
  // ----------------------------------------------------------

  static makeRoundedRectPrism(
    width = 100,
    height = 100,
    depth = 30,
    radius = 14,
    cornerSegments = 6,
  ) {
    const profile = Geometry.makeRoundedRectProfile(
      width,
      height,
      radius,
      cornerSegments,
    );
    return Geometry.extrudeConvexProfile(profile, depth);
  }

  static makeCapsulePrism(
    length = 120,
    radius = 20,
    depth = 24,
    capSegments = 10,
  ) {
    const profile = Geometry.makeCapsuleProfile(length, radius, capSegments);
    return Geometry.extrudeConvexProfile(profile, depth);
  }

  static makeCapsuleY(radius = 14, height = 70, sides = 30, hemiSteps = 6) {
    const bodyHeight = Math.max(0, height - radius * 2);
    const parts = [];

    if (bodyHeight > 0.001) {
      parts.push(Geometry.makeCylinder(radius, bodyHeight, sides));
    }

    const topHemisphere = Mesh.transformed(
      Geometry.makeSphereSlice(radius, 0, Math.PI / 2, hemiSteps, sides),
      Mat4.translation(0, -bodyHeight / 2, 0),
    );

    const bottomHemisphere = Mesh.transformed(
      Geometry.makeSphereSlice(radius, Math.PI / 2, Math.PI, hemiSteps, sides),
      Mat4.translation(0, bodyHeight / 2, 0),
    );

    parts.push(topHemisphere, bottomHemisphere);

    return Geometry.mergeMeshes(parts);
  }

  static makeCapsuleX(radius = 14, length = 70, sides = 16, hemiSteps = 6) {
    const yCapsule = Geometry.makeCapsuleY(radius, length, sides, hemiSteps);
    return Geometry.rotateMeshZ(yCapsule, Math.PI / 2);
  }

  static makeCapsuleZ(radius = 14, length = 70, sides = 16, hemiSteps = 6) {
    const yCapsule = Geometry.makeCapsuleY(radius, length, sides, hemiSteps);
    return Geometry.rotateMeshX(yCapsule, Math.PI / 2);
  }

  static makeBeveledPanel(
    width = 70,
    height = 40,
    depth = 10,
    cornerRadius = 10,
    inset = 0.12,
    cornerSegments = 6,
  ) {
    const shell = Geometry.makeRoundedRectPrism(
      width,
      height,
      depth,
      cornerRadius,
      cornerSegments,
    );

    const inner = Mesh.transformed(
      Geometry.makeRoundedRectPrism(
        width * (1 - inset),
        height * (1 - inset),
        depth * 0.45,
        cornerRadius * 0.65,
        Math.max(3, cornerSegments - 1),
      ),
      Mat4.translation(0, 0, depth * 0.28),
    );

    return Geometry.mergeMeshes([shell, inner]);
  }

  static makeVisor(
    width = 52,
    height = 20,
    depth = 10,
    cornerRadius = 8,
    cornerSegments = 6,
  ) {
    return Geometry.makeRoundedRectPrism(
      width,
      height,
      depth,
      cornerRadius,
      cornerSegments,
    );
  }

  static makeEyeSocket(radius = 7, depth = 8, segments = 16) {
    return Geometry.makeCapsulePrism(radius * 2.2, radius, depth, segments / 2);
  }

  // ----------------------------------------------------------
  // PANELS
  // ----------------------------------------------------------

  static makePanel(width = 60, height = 30, depth = 6, inset = 0.18) {
    const shell = Geometry.makeBox(width, height, depth);

    const inner = Geometry.makeBox(
      width * (1 - inset),
      height * (1 - inset),
      depth * 0.5,
    );

    const innerMoved = Mesh.transformed(
      inner,
      Mat4.translation(0, 0, depth * 0.25),
    );

    return { shell, inner: innerMoved };
  }

  static makeRoundedPanel(
    width = 60,
    height = 30,
    depth = 8,
    radius = 8,
    inset = 0.14,
  ) {
    const shell = Geometry.makeRoundedRectPrism(
      width,
      height,
      depth,
      radius,
      6,
    );

    const inner = Mesh.transformed(
      Geometry.makeRoundedRectPrism(
        width * (1 - inset),
        height * (1 - inset),
        depth * 0.45,
        radius * 0.7,
        5,
      ),
      Mat4.translation(0, 0, depth * 0.26),
    );

    return { shell, inner };
  }
}
// ----------------------------------------------------------
// ORGANIC / SOFT PROFILE HELPERS
// ----------------------------------------------------------

Geometry.makeSuperellipseProfile = function (
  width = 100,
  height = 100,
  power = 3.6,
  segments = 28,
) {
  const pts = [];
  const a = width / 2;
  const b = height / 2;
  const n = Math.max(0.25, power);

  for (let i = 0; i < segments; i++) {
    const t = (Math.PI * 2 * i) / segments;
    const ct = Math.cos(t);
    const st = Math.sin(t);

    const x = Math.sign(ct) * a * Math.pow(Math.abs(ct), 2 / n);
    const y = Math.sign(st) * b * Math.pow(Math.abs(st), 2 / n);

    pts.push([x, y]);
  }

  return pts;
};

Geometry.resampleProfile = function (profile, targetCount = 24) {
  if (!profile || profile.length < 3) return profile ? profile.slice() : [];

  const pts = profile.map((p) => [p[0], p[1]]);
  const edges = [];
  let perimeter = 0;

  for (let i = 0; i < pts.length; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const len = Math.hypot(dx, dy);
    edges.push(len);
    perimeter += len;
  }

  if (perimeter < 1e-6) return pts.slice(0, targetCount);

  const result = [];
  const step = perimeter / targetCount;

  for (let s = 0; s < targetCount; s++) {
    const dist = s * step;

    let acc = 0;
    for (let i = 0; i < pts.length; i++) {
      const edgeLen = edges[i];
      const nextAcc = acc + edgeLen;

      if (dist <= nextAcc || i === pts.length - 1) {
        const a = pts[i];
        const b = pts[(i + 1) % pts.length];
        const t = edgeLen < 1e-6 ? 0 : (dist - acc) / edgeLen;

        result.push([
          Geometry.lerp(a[0], b[0], t),
          Geometry.lerp(a[1], b[1], t),
        ]);
        break;
      }

      acc = nextAcc;
    }
  }

  return result;
};

Geometry.loftProfiles = function (
  profileA,
  profileB,
  height = 100,
  closeCaps = true,
) {
  const count = Math.max(profileA.length, profileB.length, 3);
  const a = Geometry.resampleProfile(profileA, count);
  const b = Geometry.resampleProfile(profileB, count);

  const vertices = [];
  const triangles = [];
  const uvs = [];

  const yTop = -height / 2;
  const yBottom = height / 2;

  for (let i = 0; i < count; i++) {
    const p = a[i];
    vertices.push([p[0], yTop, p[1]]);
    uvs.push([i / count, 0]);
  }

  for (let i = 0; i < count; i++) {
    const p = b[i];
    vertices.push([p[0], yBottom, p[1]]);
    uvs.push([i / count, 1]);
  }

  for (let i = 0; i < count; i++) {
    const next = (i + 1) % count;

    const a0 = i;
    const a1 = next;
    const b1 = count + next;
    const b0 = count + i;

    Geometry.addQuad(triangles, a0, a1, b1, b0);
  }

  if (closeCaps) {
    const topCenter = vertices.length;
    vertices.push([0, yTop, 0]);
    uvs.push([0.5, 0.5]);

    const bottomCenter = vertices.length;
    vertices.push([0, yBottom, 0]);
    uvs.push([0.5, 0.5]);

    for (let i = 0; i < count; i++) {
      const next = (i + 1) % count;
      triangles.push([topCenter, next, i]);
      triangles.push([bottomCenter, count + i, count + next]);
    }
  }

  return Mesh.create(vertices, triangles, uvs);
};

Geometry.makeSoftBox = function (
  width = 100,
  height = 100,
  depth = 100,
  roundness = 3.4,
  segments = 28,
) {
  const profile = Geometry.makeSuperellipseProfile(
    width,
    depth,
    roundness,
    segments,
  );
  return Geometry.loftProfiles(profile, profile, height, true);
};

Geometry.makeRoundedTaperedPrism = function (
  topWidth = 70,
  bottomWidth = 90,
  height = 100,
  topDepth = 50,
  bottomDepth = 60,
  roundness = 3.8,
  segments = 28,
) {
  const topProfile = Geometry.makeSuperellipseProfile(
    topWidth,
    topDepth,
    roundness,
    segments,
  );

  const bottomProfile = Geometry.makeSuperellipseProfile(
    bottomWidth,
    bottomDepth,
    roundness,
    segments,
  );

  return Geometry.loftProfiles(topProfile, bottomProfile, height, true);
};

Geometry.makeRoundedBox = function (
  width = 100,
  height = 100,
  depth = 100,
  radius = 14,
  cornerSegments = 6,
) {
  const roundness = Geometry.clamp(2.8 + radius * 0.08, 3.2, 5.2);
  const segments = Math.max(20, cornerSegments * 4);
  return Geometry.makeSoftBox(width, height, depth, roundness, segments);
};

Geometry.makeSoftPalm = function (width = 16.2, height = 10.0, depth = 10.2) {
  const main = Geometry.makeSoftBox(width, height, depth, 5.0, 24);

  const palmPad = Mesh.transformed(
    Geometry.makeSoftBox(width * 0.72, height * 0.22, depth * 0.2, 4.0, 16),
    Mat4.translation(0, height * 0.05, depth * 0.06),
  );

  return Geometry.mergeMeshes([main, palmPad]);
};

Geometry.makeSoftFingerSegment = function (
  length = 10,
  topWidth = 3.6,
  bottomWidth = 3.0,
  topDepth = 3.4,
  bottomDepth = 2.8,
) {
  return Geometry.makeRoundedTaperedPrism(
    topWidth,
    bottomWidth,
    length,
    topDepth,
    bottomDepth,
    4.8,
    18,
  );
};

Geometry.makeRoundedTrapezoidPrism = function (
  topWidth = 20,
  bottomWidth = 16,
  height = 20,
  depth = 18,
  cornerRadius = 2.2,
  widthSegments = 10,
  heightSegments = 6,
  depthCurve = 1.2,
) {
  const vertices = [];
  const triangles = [];
  const uvs = [];

  function roundedRectPoints(w, d, r, segments = 3) {
    const hw = w * 0.5;
    const hd = d * 0.5;
    const rr = Math.min(r, hw * 0.45, hd * 0.45);

    const pts = [];

    function arc(cx, cz, start, end) {
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const a = start + (end - start) * t;
        pts.push([cx + Math.cos(a) * rr, cz + Math.sin(a) * rr]);
      }
    }

    // começa no canto superior direito e segue no sentido horário
    arc(hw - rr, hd - rr, -Math.PI * 0.5, 0.0); // top-right
    arc(hw - rr, -hd + rr, 0.0, Math.PI * 0.5); // bottom-right
    arc(-hw + rr, -hd + rr, Math.PI * 0.5, Math.PI); // bottom-left
    arc(-hw + rr, hd - rr, Math.PI, Math.PI * 1.5); // top-left

    // remover duplicados consecutivos
    const clean = [];
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      const prev = clean[clean.length - 1];
      if (
        !prev ||
        Math.abs(prev[0] - p[0]) > 1e-6 ||
        Math.abs(prev[1] - p[1]) > 1e-6
      ) {
        clean.push(p);
      }
    }

    return clean;
  }

  const ringTemplate = roundedRectPoints(
    topWidth,
    depth,
    cornerRadius,
    Math.max(2, Math.floor(widthSegments / 4)),
  );
  const ringSize = ringTemplate.length;

  for (let iy = 0; iy <= heightSegments; iy++) {
    const v = iy / heightSegments;

    // topo mais largo, base mais estreita
    const width = topWidth + (bottomWidth - topWidth) * v;

    // ligeira redução da profundidade em baixo para parecer tecido
    const localDepth = depth * (1.0 - 0.1 * v);

    // ligeiro bojo frontal a meio
    const frontBulge = Math.sin(v * Math.PI) * depthCurve;

    // ligeira curva vertical: frente cai mais do que atrás
    const y = -height * 0.5 + v * height;

    const ring = roundedRectPoints(
      width,
      localDepth,
      cornerRadius,
      Math.max(2, Math.floor(widthSegments / 4)),
    );

    for (let i = 0; i < ring.length; i++) {
      const p = ring[i];
      const x = p[0];
      let z = p[1];

      // empurra só a parte da frente para fora para dar volume
      if (z > 0) {
        const frontFactor = z / (localDepth * 0.5);
        z += frontBulge * frontFactor;
      }

      vertices.push([x, y, z]);
      uvs.push([i / (ring.length - 1), v]);
    }
  }

  function idx(iy, ix) {
    return iy * ringSize + (ix % ringSize);
  }

  // lados
  for (let iy = 0; iy < heightSegments; iy++) {
    for (let ix = 0; ix < ringSize; ix++) {
      const a = idx(iy, ix);
      const b = idx(iy, ix + 1);
      const c = idx(iy + 1, ix + 1);
      const d = idx(iy + 1, ix);

      triangles.push([a, b, c]);
      triangles.push([a, c, d]);
    }
  }

  // tampa de cima
  const topCenterIndex = vertices.length;
  vertices.push([0, -height * 0.5, 0]);
  uvs.push([0.5, 0.5]);

  for (let ix = 0; ix < ringSize; ix++) {
    const a = idx(0, ix);
    const b = idx(0, ix + 1);
    triangles.push([topCenterIndex, b, a]);
  }

  // tampa de baixo
  const bottomCenterIndex = vertices.length;
  vertices.push([0, height * 0.5, 0]);
  uvs.push([0.5, 0.5]);

  for (let ix = 0; ix < ringSize; ix++) {
    const a = idx(heightSegments, ix);
    const b = idx(heightSegments, ix + 1);
    triangles.push([bottomCenterIndex, a, b]);
  }

  return Mesh.create(vertices, triangles, uvs);
};

Geometry.makeCapsuleLimb = function (
  height = 60,
  radiusTopX = 14,
  radiusTopZ = 12,
  radiusBottomX = 10,
  radiusBottomZ = 8,
  roundness = 4.6,
  segments = 30,
) {
  const topProfile = Geometry.makeSuperellipseProfile(
    radiusTopX * 2,
    radiusTopZ * 2,
    roundness,
    segments,
  );

  const bottomProfile = Geometry.makeSuperellipseProfile(
    radiusBottomX * 2,
    radiusBottomZ * 2,
    roundness,
    segments,
  );

  return Geometry.loftProfiles(topProfile, bottomProfile, height, true);
};

Geometry.makeOvalJoint = function (
  radiusX = 8,
  radiusY = 7,
  radiusZ = 8,
  latSteps = 14,
  lonSteps = 20,
) {
  const sphere = Geometry.makeUvSphere(1, latSteps, lonSteps);
  return Mesh.transformed(sphere, Mat4.scale(radiusX, radiusY, radiusZ));
};

Geometry.makeBootShell = function (length = 36, height = 12, width = 16) {
  const sole = Geometry.rotateMeshX(
    Geometry.makeRoundedRectPrism(width, length, height * 0.14, 4, 4),
    Math.PI / 2,
  );

  const upper = Mesh.transformed(
    Geometry.rotateMeshX(
      Geometry.makeRoundedTaperedPrism(
        width * 0.92,
        width * 0.56,
        length * 0.8,
        height * 0.92,
        height * 0.4,
        4.2,
        26,
      ),
      Math.PI / 2,
    ),
    Mat4.translation(0, -height * 0.16, length * 0.02),
  );

  const toe = Mesh.transformed(
    Geometry.rotateMeshX(
      Geometry.makeRoundedTaperedPrism(
        width * 0.5,
        width * 0.2,
        length * 0.24,
        height * 0.3,
        height * 0.1,
        3.0,
        20,
      ),
      Math.PI / 2,
    ),
    Mat4.translation(0, -height * 0.05, length * 0.4),
  );

  const heel = Mesh.transformed(
    Geometry.rotateMeshX(
      Geometry.makeRoundedRectPrism(
        width * 0.42,
        length * 0.18,
        height * 0.24,
        4,
        4,
      ),
      Math.PI / 2,
    ),
    Mat4.translation(0, -height * 0.02, -length * 0.26),
  );

  const collar = Mesh.transformed(
    Geometry.rotateMeshX(
      Geometry.makeRoundedRectPrism(
        width * 0.42,
        length * 0.18,
        height * 0.24,
        4,
        4,
      ),
      Math.PI / 2,
    ),
    Mat4.translation(0, -height * 0.34, -length * 0.06),
  );

  return Geometry.mergeMeshes([sole, upper, toe, heel, collar]);
};

Geometry.drawMesh = function (mesh, useTexture = false) {
  beginShape(TRIANGLES);

  for (const tri of mesh.triangles) {
    const a = mesh.vertices[tri[0]];
    const b = mesh.vertices[tri[1]];
    const c = mesh.vertices[tri[2]];

    const n = Geo.triangleNormal(a, b, c);

    // ligeira suavização artificial
    const len = Math.hypot(n[0], n[1], n[2]) || 1;
    normal(n[0] / len, n[1] / len, n[2] / len);

    if (useTexture && mesh.uvs && mesh.uvs.length > 0) {
      const uva = mesh.uvs[tri[0]] || [0, 0];
      const uvb = mesh.uvs[tri[1]] || [1, 0];
      const uvc = mesh.uvs[tri[2]] || [1, 1];

      vertex(a[0], a[1], a[2], uva[0], uva[1]);
      vertex(b[0], b[1], b[2], uvb[0], uvb[1]);
      vertex(c[0], c[1], c[2], uvc[0], uvc[1]);
    } else {
      vertex(a[0], a[1], a[2]);
      vertex(b[0], b[1], b[2]);
      vertex(c[0], c[1], c[2]);
    }
  }

  endShape();
};
