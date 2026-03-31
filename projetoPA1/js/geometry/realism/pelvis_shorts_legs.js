// js/geometry/humanoid_pelvis_shorts.js
// ============================================================
// HUMANOID GEOMETRY - PELVIS / SHORTS
// Pelvis, base dos calções e shells superiores das pernas
// ============================================================

// ----------------------------------------------------------
// SHORT LEG SHELL
// ----------------------------------------------------------

Geometry.makeShortLegShell = function (
  topRadiusX = 12,
  bottomRadiusX = 10,
  topRadiusZ = 10,
  bottomRadiusZ = 8.5,
  height = 34,
  arcStart = -Math.PI * 1,
  arcEnd = Math.PI * 1,
  radialSegments = 44,
  heightSegments = 18,
) {
  const vertices = [];
  const triangles = [];
  const uvs = [];

  const ringVerts = radialSegments + 1;

  function idx(iy, ix) {
    return iy * ringVerts + ix;
  }

  for (let iy = 0; iy <= heightSegments; iy++) {
    const v = iy / heightSegments;
    const y = v * height;

    const rx = topRadiusX + (bottomRadiusX - topRadiusX) * v;
    const rz = topRadiusZ + (bottomRadiusZ - topRadiusZ) * v;

    // ligeiro volume frontal e traseiro para não parecer chapa
    const bulgeFront = Math.sin(v * Math.PI) * 1.0;
    const bulgeBack = Math.sin(v * Math.PI) * 0.35;

    for (let ix = 0; ix <= radialSegments; ix++) {
      const u = ix / radialSegments;
      const a = arcStart + (arcEnd - arcStart) * u;

      let x = Math.sin(a) * rx;
      let z = Math.cos(a) * rz;

      if (z > 0) z += bulgeFront;
      else z -= bulgeBack;

      vertices.push([x, y, z]);
      uvs.push([u, v]);
    }
  }

  for (let iy = 0; iy < heightSegments; iy++) {
    for (let ix = 0; ix < radialSegments; ix++) {
      const a = idx(iy, ix);
      const b = idx(iy, ix + 1);
      const c = idx(iy + 1, ix + 1);
      const d = idx(iy + 1, ix);

      triangles.push([a, c, b]);
      triangles.push([a, d, c]);
    }
  }

  return Mesh.create(vertices, triangles, uvs);
};

// ----------------------------------------------------------
// PELVIS
// ----------------------------------------------------------

Geometry.makePelvisAdvanced = function (width = 92, height = 38, depth = 54) {
  const core = Geometry.makeRoundedRectPrism(width, height * 0.72, depth, 8, 5);

  const frontPlate = Mesh.transformed(
    Geometry.makeRoundedRectPrism(
      width * 0.62,
      height * 0.24,
      depth * 0.16,
      5,
      4,
    ),
    Mat4.translation(0, height * 0.12, depth * 0.34),
  );

  const hipL = Mesh.transformed(
    Geometry.makeRoundedRectPrism(
      width * 0.16,
      height * 0.28,
      depth * 0.26,
      4,
      4,
    ),
    Mat4.translation(-width * 0.34, 0, 0),
  );

  const hipR = Mesh.transformed(
    Geometry.makeRoundedRectPrism(
      width * 0.16,
      height * 0.28,
      depth * 0.26,
      4,
      4,
    ),
    Mat4.translation(width * 0.34, 0, 0),
  );

  return Geometry.mergeMeshes([core, frontPlate, hipL, hipR]);
};

// ----------------------------------------------------------
// SHORTS
// ----------------------------------------------------------

Geometry.makeShortsAdvanced = function (
  width = 70,
  waistHeight = 32,
  depth = 33,
) {
  const legTopRadiusX = 17.5;
  const legBottomRadiusX = 17.0;
  const legTopRadiusZ = 16.5;
  const legBottomRadiusZ = 16.0;
  const legHeight = 55;

  const shortsWidth = width;
  const shortsHeight = waistHeight;
  const shortsDepth = depth;

  // perfil superior: mais largo e estável
  const bottomProfile = Geometry.makeSuperellipseProfile(
    shortsWidth,
    shortsDepth,
    4.6,
    40,
  );

  // perfil inferior:
  // mais estreito nas laterais e um pouco mais orgânico
  const topProfileRaw = Geometry.makeSuperellipseProfile(
    shortsWidth * 0.98,
    shortsDepth * 0.99,
    4.2,
    40,
  );

  // afundar ligeiramente as laterais em baixo para parecer mesmo calção
  const topProfile = topProfileRaw.map(([x, z]) => {
    const sideFactor = Math.abs(x) / (shortsWidth * 0.5);
    const inset = Math.pow(sideFactor, 1.35) * 3.0;
    return [x > 0 ? x - inset : x + inset, z];
  });

  const core = Geometry.loftProfiles(
    topProfile,
    bottomProfile,
    shortsHeight,
    true,
  );

  // borda de cima mais fina e sem interseção exagerada
  const waistbandProfile = Geometry.makeSuperellipseProfile(
    shortsWidth * 1.04,
    shortsDepth * 1.02,
    4.6,
    40,
  );

  const waistband = Mesh.transformed(
    Geometry.loftProfiles(
      waistbandProfile,
      waistbandProfile,
      shortsHeight * 0.12,
      true,
    ),
    Mat4.translation(0, -shortsHeight * 0.5, 0),
  );

  const waist = Geometry.mergeMeshes([core, waistband]);

  const leftLeg = Geometry.makeShortLegShell(
    legTopRadiusX,
    legBottomRadiusX,
    legTopRadiusZ,
    legBottomRadiusZ,
    legHeight,
    -Math.PI,
    Math.PI,
    44,
    18,
  );

  const rightLeg = Geometry.makeShortLegShell(
    legTopRadiusX,
    legBottomRadiusX,
    legTopRadiusZ,
    legBottomRadiusZ,
    legHeight,
    -Math.PI,
    Math.PI,
    44,
    18,
  );

  return {
    waist,
    leftLeg,
    rightLeg,
  };
};

// ----------------------------------------------------------
// HIP BASE / JOINT
// ----------------------------------------------------------

Geometry.makeShortsBase = function () {
  return Geometry.makeRoundedRectPrism(60, 10, 20, 6, 4);
};

Geometry.makeHipJoint = function (radius = 7.8, width = 14, depth = 11) {
  return Geometry.makeCapsuleX(radius, width, 18, 6);
};

// HUMANOID GEOMETRY - LEGS

// ----------------------------------------------------------
// GENERIC LIMB
// ----------------------------------------------------------

Geometry.makeFunnelLimb = function (
  topRadiusX = 14,
  bottomRadiusX = 10,
  topRadiusZ = 13,
  bottomRadiusZ = 9,
  height = 58,
  radialSegments = 44,
  heightSegments = 18,
  bulge = 1.2,
) {
  const vertices = [];
  const triangles = [];
  const uvs = [];

  const ringVerts = radialSegments + 1;

  function idx(iy, ix) {
    return iy * ringVerts + ix;
  }

  for (let iy = 0; iy <= heightSegments; iy++) {
    const v = iy / heightSegments;

    // TOPO em y=0, BASE em y=height
    const y = v * height;

    const rx = topRadiusX + (bottomRadiusX - topRadiusX) * v;
    const rz = topRadiusZ + (bottomRadiusZ - topRadiusZ) * v;

    const localBulge = Math.sin(v * Math.PI) * bulge;

    for (let ix = 0; ix <= radialSegments; ix++) {
      const u = ix / radialSegments;
      const a = -Math.PI + 2 * Math.PI * u;

      let x = Math.sin(a) * rx;
      let z = Math.cos(a) * rz;

      if (z > 0) z += localBulge;
      else z -= localBulge * 0.25;

      vertices.push([x, y, z]);
      uvs.push([u, v]);
    }
  }

  for (let iy = 0; iy < heightSegments; iy++) {
    for (let ix = 0; ix < radialSegments; ix++) {
      const a = idx(iy, ix);
      const b = idx(iy, ix + 1);
      const c = idx(iy + 1, ix + 1);
      const d = idx(iy + 1, ix);

      triangles.push([a, c, b]);
      triangles.push([a, d, c]);
    }
  }

  // tampa superior
  const topCenter = vertices.length;
  vertices.push([0, 0, 0]);
  uvs.push([0.5, 0.5]);

  for (let ix = 0; ix < radialSegments; ix++) {
    const a = idx(0, ix);
    const b = idx(0, ix + 1);
    triangles.push([topCenter, b, a]);
  }

  // tampa inferior
  const bottomCenter = vertices.length;
  vertices.push([0, height, 0]);
  uvs.push([0.5, 0.5]);

  for (let ix = 0; ix < radialSegments; ix++) {
    const a = idx(heightSegments, ix);
    const b = idx(heightSegments, ix + 1);
    triangles.push([bottomCenter, a, b]);
  }

  return Mesh.create(vertices, triangles, uvs);
};

// ----------------------------------------------------------
// THIGH / SHIN / KNEE
// ----------------------------------------------------------

Geometry.makeThighHumanized = function (topRadius = 15.8, height = 58) {
  return Geometry.makeFunnelLimb(
    topRadius,
    11.5,
    topRadius - 1.3,
    10.2,
    height,
    28,
    12,
    2.0,
  );
};

Geometry.makeShinHumanized = function (
  topRadius = 9.4,
  bottomRadius = 5.4,
  height = 58,
) {
  return Geometry.makeFunnelLimb(
    topRadius,
    bottomRadius,
    topRadius - 1.1,
    bottomRadius - 1.4,
    height,
    28,
    12,
    1.0,
  );
};

Geometry.makeKneeHumanized = function (
  radius = 7.6,
  length = 6.8,
  frontDepth = 8.0,
) {
  const core = Geometry.makeCapsuleY(radius, length, 24, 8);

  const kneecap = Mesh.transformed(
    Geometry.makeRoundedRectPrism(
      radius * 1.08,
      length * 0.72,
      frontDepth * 0.42,
      2.2,
      4,
    ),
    Mat4.translation(0, 0, radius * 0.42),
  );

  return Geometry.mergeMeshes([core, kneecap]);
};
