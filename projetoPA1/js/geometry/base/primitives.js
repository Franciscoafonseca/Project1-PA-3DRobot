// js/geometry/primitives.js
// ============================================================
// GEOMETRY PRIMITIVES
// Formas base trianguladas
// ============================================================

// ----------------------------------------------------------
// FORMAS PLANAS / BASE
// ----------------------------------------------------------

Geometry.makeTriangle = function () {
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
};

Geometry.makeQuad = function (width = 100, height = 100) {
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
};

Geometry.makeBox = function (width = 100, height = 100, depth = 100) {
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
};

Geometry.makeTrapezoidPrism = function (
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
};

// ----------------------------------------------------------
// CILINDROS / DISCOS / ANÉIS / ESFERAS
// ----------------------------------------------------------

Geometry.makeCylinder = function (radius = 20, height = 100, sides = 24) {
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

  // Tampa superior
  for (let i = 0; i < sides; i++) {
    const next = (i + 1) % sides;
    triangles.push([topCenterIndex, topRing[i], topRing[next]]);
  }

  // Tampa inferior
  for (let i = 0; i < sides; i++) {
    const next = (i + 1) % sides;
    triangles.push([bottomCenterIndex, bottomRing[next], bottomRing[i]]);
  }

  // Laterais
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
};

Geometry.makeDisc = function (radius = 30, segments = 24) {
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
};

Geometry.makeRing = function (
  innerRadius = 16,
  outerRadius = 28,
  segments = 24,
) {
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
};

Geometry.makeUvSphere = function (radius = 30, latSteps = 8, lonSteps = 12) {
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
};

Geometry.makeSphereSlice = function (
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
};
