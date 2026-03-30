// js/geometry/humanoid.js
// ============================================================
// ROBOT / HUMANOID PARTS
// Updated clean version
// ============================================================

// ----------------------------------------------------------
// HEAD / TORSO
// ----------------------------------------------------------

Geometry.makeRobotHead = function (width = 52, height = 46, depth = 42) {
  const shell = Geometry.makeRoundedBox(width, height, depth, 8, 5);

  const brow = Mesh.transformed(
    Geometry.makeRoundedRectPrism(
      width * 0.82,
      height * 0.16,
      depth * 0.12,
      5,
      4,
    ),
    Mat4.translation(0, -height * 0.2, depth * 0.34),
  );

  const cheekL = Mesh.transformed(
    Geometry.makeRoundedRectPrism(
      width * 0.14,
      height * 0.28,
      depth * 0.14,
      4,
      4,
    ),
    Mat4.translation(-width * 0.32, height * 0.08, depth * 0.28),
  );

  const cheekR = Mesh.transformed(
    Geometry.makeRoundedRectPrism(
      width * 0.14,
      height * 0.28,
      depth * 0.14,
      4,
      4,
    ),
    Mat4.translation(width * 0.32, height * 0.08, depth * 0.28),
  );

  const jaw = Mesh.transformed(
    Geometry.makeRoundedRectPrism(
      width * 0.68,
      height * 0.18,
      depth * 0.14,
      4,
      4,
    ),
    Mat4.translation(0, height * 0.22, depth * 0.28),
  );

  return Geometry.mergeMeshes([shell, brow, cheekL, cheekR, jaw]);
};

Geometry.makeStylizedRobotHead = function (
  width = 54,
  height = 50,
  depth = 46,
) {
  const shell = Geometry.makeRoundedBox(width, height, depth, 9, 6);

  const forehead = Mesh.transformed(
    Geometry.makeRoundedRectPrism(
      width * 0.72,
      height * 0.13,
      depth * 0.1,
      3.5,
      4,
    ),
    Mat4.translation(0, -height * 0.3, depth * 0.34),
  );

  const brow = Mesh.transformed(
    Geometry.makeRoundedRectPrism(
      width * 0.84,
      height * 0.1,
      depth * 0.1,
      3.5,
      4,
    ),
    Mat4.translation(0, -height * 0.16, depth * 0.35),
  );

  const cheekL = Mesh.transformed(
    Geometry.makeRoundedRectPrism(
      width * 0.18,
      height * 0.26,
      depth * 0.12,
      3,
      4,
    ),
    Mat4.translation(-width * 0.32, height * 0.1, depth * 0.31),
  );

  const cheekR = Mesh.transformed(
    Geometry.makeRoundedRectPrism(
      width * 0.18,
      height * 0.26,
      depth * 0.12,
      3,
      4,
    ),
    Mat4.translation(width * 0.32, height * 0.1, depth * 0.31),
  );

  const jaw = Mesh.transformed(
    Geometry.makeRoundedRectPrism(
      width * 0.66,
      height * 0.18,
      depth * 0.12,
      3.2,
      4,
    ),
    Mat4.translation(0, height * 0.26, depth * 0.29),
  );

  const chin = Mesh.transformed(
    Geometry.makeRoundedRectPrism(
      width * 0.22,
      height * 0.1,
      depth * 0.1,
      2.2,
      4,
    ),
    Mat4.translation(0, height * 0.36, depth * 0.34),
  );

  return Geometry.mergeMeshes([
    shell,
    forehead,
    brow,
    cheekL,
    cheekR,
    jaw,
    chin,
  ]);
};

Geometry.makeRobotEar = function (width = 8, height = 12, depth = 8) {
  const outer = Geometry.makeRoundedRectPrism(width, height, depth, 2.5, 4);

  const inner = Mesh.transformed(
    Geometry.makeRoundedRectPrism(
      width * 0.58,
      height * 0.58,
      depth * 0.35,
      1.6,
      3,
    ),
    Mat4.translation(0, 0, depth * 0.22),
  );

  return Geometry.mergeMeshes([outer, inner]);
};

Geometry.makeChest = function (width = 76, height = 106, depth = 40) {
  const core = Geometry.makeRoundedTaperedPrism(
    width * 0.96,
    width * 0.84,
    height,
    depth * 0.98,
    depth * 0.82,
    7.5,
    28,
  );

  const collarBase = Mesh.transformed(
    Geometry.makeRoundedRectPrism(
      width * 0.22,
      height * 0.08,
      depth * 0.2,
      5,
      4,
    ),
    Mat4.translation(0, -height * 0.49, 0),
  );

  return Geometry.mergeMeshes([core, collarBase]);
};
// ----------------------------------------------------------
// ARM SYSTEM
// ----------------------------------------------------------

Geometry.makeShoulderCap = function (radius = 12.5, length = 12) {
  return Geometry.makeCapsuleY(radius, length, 30, 10);
};
Geometry.makeUpperArmRounded = function (
  length = 54,
  topWidth = 16.5,
  bottomWidth = 13.5,
  topDepth = 16.0,
  bottomDepth = 12.5,
) {
  return Geometry.makeFunnelLimb(
    topWidth * 0.5,
    bottomWidth * 0.5,
    topDepth * 0.5,
    bottomDepth * 0.5,
    length,
    36,
    16,
    2.4,
  );
};

Geometry.makeForearmRounded = function (
  length = 48,
  elbowWidth = 13.2,
  wristWidth = 9.8,
  elbowDepth = 12.8,
  wristDepth = 9.0,
) {
  return Geometry.makeFunnelLimb(
    elbowWidth * 0.5,
    wristWidth * 0.5,
    elbowDepth * 0.5,
    wristDepth * 0.5,
    length,
    36,
    16,
    2.0,
  );
};

Geometry.makeElbowDisc = function (radius = 6.8, depth = 7.0) {
  const core = Geometry.makeCapsuleZ(radius, depth, 28, 10);

  const sideRing = Mesh.transformed(
    Geometry.makeRoundedRectPrism(
      radius * 1.08,
      radius * 0.46,
      depth * 0.34,
      4,
      4,
    ),
    Mat4.translation(0, 0, 0),
  );

  return Geometry.mergeMeshes([core, sideRing]);
};

Geometry.makeWristJoint = function (radius = 4.1, height = 6.8, segments = 22) {
  const core = Geometry.makeCapsuleY(radius, height, segments, 8);

  const cuff = Mesh.transformed(
    Geometry.makeRoundedRectPrism(
      radius * 1.4,
      height * 0.5,
      radius * 0.8,
      4,
      4,
    ),
    Mat4.translation(0, 0, 0),
  );

  return Geometry.mergeMeshes([core, cuff]);
};

Geometry.makePalmRounded = function (width = 13.8, height = 12.6, depth = 8.8) {
  return Geometry.makeSoftPalm(width, height, depth);
};

Geometry.makeFingerRounded = function (
  length = 7,
  topWidth = 3,
  bottomWidth = 2,
  topDepth = 3,
  bottomDepth = 2,
) {
  return Geometry.makeSoftFingerSegment(
    length,
    topWidth,
    bottomWidth,
    topDepth,
    bottomDepth,
  );
};

Geometry.makeFingerJoint = function (
  radius = 1.08,
  height = 2.0,
  segments = 12,
) {
  return Geometry.makeCapsuleY(radius, height, segments, 6);
};

// ----------------------------------------------------------
// PELVIS / SHORTS
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
  // mais estreito nas laterais e um pouco mais orgânico,
  // para combinar melhor com as shells
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
// HIP / LEG JOINTS
// ----------------------------------------------------------

Geometry.makeShortsBase = function () {
  return Geometry.makeRoundedRectPrism(
    60, // largura
    10, // altura
    20, // profundidade
    6,
    4,
  );
};

Geometry.makeHipJoint = function (radius = 7.8, width = 14, depth = 11) {
  return Geometry.makeCapsuleX(radius, width, 18, 6);
};

// ----------------------------------------------------------
// THIGH / KNEE / SHIN
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

  // tampa superior (topo em y=0)
  const topCenter = vertices.length;
  vertices.push([0, 0, 0]);
  uvs.push([0.5, 0.5]);

  for (let ix = 0; ix < radialSegments; ix++) {
    const a = idx(0, ix);
    const b = idx(0, ix + 1);
    triangles.push([topCenter, b, a]);
  }

  // tampa inferior (base em y=height)
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

// ----------------------------------------------------------
// BOOT
// ----------------------------------------------------------
Geometry.makeCone = function (radius = 1, height = 2, segments = 16) {
  const vertices = [];
  const triangles = [];
  const uvs = [];

  const baseCenterIndex = 0;
  vertices.push([0, 0, 0]);
  uvs.push([0.5, 0.5]);

  const tipIndex = 1;
  vertices.push([0, height, 0]);
  uvs.push([0.5, 1.0]);

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const a = t * Math.PI * 2;

    const x = Math.cos(a) * radius;
    const z = Math.sin(a) * radius;

    vertices.push([x, 0, z]);
    uvs.push([0.5 + Math.cos(a) * 0.5, 0.5 + Math.sin(a) * 0.5]);
  }

  for (let i = 0; i < segments; i++) {
    const a = 2 + i;
    const b = 2 + i + 1;
    triangles.push([tipIndex, a, b]);
  }

  for (let i = 0; i < segments; i++) {
    const a = 2 + i + 1;
    const b = 2 + i;
    triangles.push([baseCenterIndex, a, b]);
  }

  return Mesh.create(vertices, triangles, uvs);
};

Geometry.makeConeStud = function (radius = 0.9, height = 2.2, segments = 12) {
  return Geometry.makeCone(radius, height, segments);
};

Geometry.makeSimpleFootballBoot = function (
  length = 46,
  height = 13.0,
  width = 15.0,
) {
  const body = Mesh.transformed(
    Geometry.makeCapsuleZ(width * 0.44, length * 0.88, 24, 10),
    Mat4.compose(
      Mat4.scale(1.0, height / width, 1.0),
      Mat4.translation(0, -height * 0.18, 0),
    ),
  );

  const top = Mesh.transformed(
    Geometry.makeRoundedRectPrism(
      width * 0.54,
      height * 0.24,
      length * 0.38,
      1.4,
      4,
    ),
    Mat4.translation(0, -height * 0.38, -length * 0.06),
  );

  return Geometry.mergeMeshes([body, top]);
};

Geometry.makeFootballBootProfile = function (
  length = 46,
  height = 13.0,
  width = 15.0,
) {
  const upper = Geometry.makeSimpleFootballBoot(length, height, width);

  const studs = [
    // frente
    Mesh.transformed(
      Geometry.makeConeStud(width * 0.072, height * 0.38, 12),
      Mat4.translation(-width * 0.24, height * 0.1, length * 0.26),
    ),
    Mesh.transformed(
      Geometry.makeConeStud(width * 0.072, height * 0.38, 12),
      Mat4.translation(width * 0.24, height * 0.1, length * 0.26),
    ),

    // antepé
    Mesh.transformed(
      Geometry.makeConeStud(width * 0.07, height * 0.36, 12),
      Mat4.translation(-width * 0.28, height * 0.14, length * 0.08),
    ),
    Mesh.transformed(
      Geometry.makeConeStud(width * 0.07, height * 0.36, 12),
      Mat4.translation(width * 0.28, height * 0.14, length * 0.08),
    ),

    // meio
    Mesh.transformed(
      Geometry.makeConeStud(width * 0.066, height * 0.34, 12),
      Mat4.translation(-width * 0.2, height * 0.18, -length * 0.08),
    ),
    Mesh.transformed(
      Geometry.makeConeStud(width * 0.066, height * 0.34, 12),
      Mat4.translation(width * 0.2, height * 0.18, -length * 0.08),
    ),

    // traseira
    Mesh.transformed(
      Geometry.makeConeStud(width * 0.078, height * 0.4, 12),
      Mat4.translation(-width * 0.16, height * 0.22, -length * 0.28),
    ),
    Mesh.transformed(
      Geometry.makeConeStud(width * 0.078, height * 0.4, 12),
      Mat4.translation(width * 0.16, height * 0.22, -length * 0.28),
    ),
  ];

  return Geometry.mergeMeshes([upper, ...studs]);
};
// ----------------------------------------------------------
// FOOTBALL
// ----------------------------------------------------------

Geometry.makeFootball = function (radius = 28) {
  return Geometry.makeUvSphere(radius, 24, 32);
};
