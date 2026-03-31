// js/geometry/profiles.js
// ============================================================
// GEOMETRY PROFILES
// Perfis 2D, reamostragem, loft e extrusão
// ============================================================

// ----------------------------------------------------------
// PERFIS 2D BÁSICOS
// ----------------------------------------------------------

Geometry.makeCircleProfile = function (radius = 50, segments = 24) {
  const pts = [];

  for (let i = 0; i < segments; i++) {
    const a = (Math.PI * 2 * i) / segments;
    pts.push([Math.cos(a) * radius, Math.sin(a) * radius]);
  }

  return pts;
};

Geometry.makeRoundedRectProfile = function (
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
};

Geometry.makeCapsuleProfile = function (
  length = 120,
  radius = 24,
  capSegments = 10,
) {
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
};

Geometry.makeOctagonProfile = function (width = 100, height = 100, cut = 12) {
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
};

// ----------------------------------------------------------
// EXTRUSÃO DE PERFIL CONVEXO
// ----------------------------------------------------------

Geometry.extrudeConvexProfile = function (profile, depth = 20) {
  const vertices = [];
  const triangles = [];
  const uvs = [];

  const zFront = depth / 2;
  const zBack = -depth / 2;

  const fixedProfile = Geometry.ensureCCWProfile(profile);
  const n = fixedProfile.length;

  if (n < 3) return Mesh.create([], [], []);

  const { minX, maxX, minY, maxY } = Geometry.profileBounds(fixedProfile);
  const spanX = Math.max(1e-6, maxX - minX);
  const spanY = Math.max(1e-6, maxY - minY);

  // Face da frente
  for (let i = 0; i < n; i++) {
    const [x, y] = fixedProfile[i];
    vertices.push([x, y, zFront]);
    uvs.push([(x - minX) / spanX, (y - minY) / spanY]);
  }

  // Face de trás
  for (let i = 0; i < n; i++) {
    const [x, y] = fixedProfile[i];
    vertices.push([x, y, zBack]);
    uvs.push([1 - (x - minX) / spanX, (y - minY) / spanY]);
  }

  // Triangulação da tampa frontal
  for (let i = 1; i < n - 1; i++) {
    triangles.push([0, i, i + 1]);
  }

  // Triangulação da tampa traseira
  const backOffset = n;
  for (let i = 1; i < n - 1; i++) {
    triangles.push([backOffset, backOffset + i + 1, backOffset + i]);
  }

  // Lados
  for (let i = 0; i < n; i++) {
    const next = (i + 1) % n;
    const a = i;
    const b = next;
    const c = backOffset + next;
    const d = backOffset + i;
    Geometry.addQuad(triangles, a, b, c, d);
  }

  return Mesh.create(vertices, triangles, uvs);
};

// ----------------------------------------------------------
// PERFIS REALISTAS / SUAVES
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

// Reamostra um perfil para um número fixo de pontos.
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

// Cria uma forma ligando dois perfis ao longo de uma altura.
Geometry.loftProfiles = function (
  profileA,
  profileB,
  height = 100,
  closeCaps = true,
) {
  const count = Math.max(profileA.length, profileB.length, 3);

  const fixedA = Geometry.ensureCCWProfile(profileA);
  const fixedB = Geometry.ensureCCWProfile(profileB);

  const a = Geometry.resampleProfile(fixedA, count);
  const b = Geometry.resampleProfile(fixedB, count);

  const vertices = [];
  const triangles = [];
  const uvs = [];

  const yTop = -height / 2;
  const yBottom = height / 2;

  // Anel superior
  for (let i = 0; i < count; i++) {
    const p = a[i];
    vertices.push([p[0], yTop, p[1]]);
    uvs.push([i / count, 0]);
  }

  // Anel inferior
  for (let i = 0; i < count; i++) {
    const p = b[i];
    vertices.push([p[0], yBottom, p[1]]);
    uvs.push([i / count, 1]);
  }

  // Laterais
  for (let i = 0; i < count; i++) {
    const next = (i + 1) % count;

    const a0 = i;
    const a1 = next;
    const b1 = count + next;
    const b0 = count + i;

    Geometry.addQuad(triangles, a0, a1, b1, b0);
  }

  // Tampas
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
