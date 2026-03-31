// js/geometry/advanced.js
// ============================================================
// GEOMETRY ADVANCED
// Formas arredondadas, orgânicas e peças mais complexas
// ============================================================

// ----------------------------------------------------------
// FORMAS ARREDONDADAS / SUAVES
// ----------------------------------------------------------

Geometry.makeRoundedRectPrism = function (
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
};

Geometry.makeCapsulePrism = function (
  length = 120,
  radius = 20,
  depth = 24,
  capSegments = 10,
) {
  const profile = Geometry.makeCapsuleProfile(length, radius, capSegments);
  return Geometry.extrudeConvexProfile(profile, depth);
};

Geometry.makeCapsuleY = function (
  radius = 14,
  height = 70,
  sides = 30,
  hemiSteps = 6,
) {
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
};

Geometry.makeCapsuleX = function (
  radius = 14,
  length = 70,
  sides = 16,
  hemiSteps = 6,
) {
  const yCapsule = Geometry.makeCapsuleY(radius, length, sides, hemiSteps);
  return Geometry.rotateMeshZ(yCapsule, Math.PI / 2);
};

Geometry.makeCapsuleZ = function (
  radius = 14,
  length = 70,
  sides = 16,
  hemiSteps = 6,
) {
  const yCapsule = Geometry.makeCapsuleY(radius, length, sides, hemiSteps);
  return Geometry.rotateMeshX(yCapsule, Math.PI / 2);
};

Geometry.makeBeveledPanel = function (
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
};

Geometry.makeVisor = function (
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
};

Geometry.makeEyeSocket = function (radius = 7, depth = 8, segments = 16) {
  return Geometry.makeCapsulePrism(radius * 2.2, radius, depth, segments / 2);
};

// ----------------------------------------------------------
// PAINÉIS
// ----------------------------------------------------------

Geometry.makePanel = function (
  width = 60,
  height = 30,
  depth = 6,
  inset = 0.18,
) {
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
};

Geometry.makeRoundedPanel = function (
  width = 60,
  height = 30,
  depth = 8,
  radius = 8,
  inset = 0.14,
) {
  const shell = Geometry.makeRoundedRectPrism(width, height, depth, radius, 6);

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
};

// ----------------------------------------------------------
// FORMAS ORGÂNICAS
// ----------------------------------------------------------

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

// ----------------------------------------------------------
// TRAPÉZIO ARREDONDADO MAIS COMPLEXO
// ----------------------------------------------------------

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

    // Percurso horário
    arc(hw - rr, hd - rr, -Math.PI * 0.5, 0.0);
    arc(hw - rr, -hd + rr, 0.0, Math.PI * 0.5);
    arc(-hw + rr, -hd + rr, Math.PI * 0.5, Math.PI);
    arc(-hw + rr, hd - rr, Math.PI, Math.PI * 1.5);

    // Remove pontos duplicados consecutivos
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

    const width = topWidth + (bottomWidth - topWidth) * v;
    const localDepth = depth * (1.0 - 0.1 * v);
    const frontBulge = Math.sin(v * Math.PI) * depthCurve;
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

      // Dá volume extra à frente
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

  // Laterais
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

  // Tampa superior
  const topCenterIndex = vertices.length;
  vertices.push([0, -height * 0.5, 0]);
  uvs.push([0.5, 0.5]);

  for (let ix = 0; ix < ringSize; ix++) {
    const a = idx(0, ix);
    const b = idx(0, ix + 1);
    triangles.push([topCenterIndex, b, a]);
  }

  // Tampa inferior
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

// ----------------------------------------------------------
// MEMBROS / JUNTAS / BOTAS
// ----------------------------------------------------------

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
