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

Geometry.makeBootStud = function (radius = 0.7, height = 1.6) {
  return Mesh.transformed(
    Geometry.makeCylinder(radius, height, 10),
    Mat4.rotateX(Math.PI / 2),
  );
};

Geometry.makeFootballBootUpper = function (
  length = 36,
  height = 15.5,
  width = 13.5,
) {
  const vertices = [];
  const triangles = [];
  const uvs = [];

  const rings = 14;
  const sides = 20;

  function idx(ir, is) {
    return ir * (sides + 1) + is;
  }

  for (let ir = 0; ir <= rings; ir++) {
    const t = ir / rings;
    const z = -length * 0.5 + t * length;

    // largura do pé ao longo do comprimento
    let halfW;
    if (t < 0.18) {
      halfW = width * (0.3 + t * 0.55);
    } else if (t < 0.7) {
      halfW = width * (0.4 - (t - 0.18) * 0.1);
    } else {
      halfW = width * (0.35 - (t - 0.7) * 0.18);
    }

    // altura do upper ao longo do comprimento
    let upperH;
    if (t < 0.2) {
      upperH = height * (0.55 + t * 0.9);
    } else if (t < 0.72) {
      upperH = height * (0.73 - (t - 0.2) * 0.08);
    } else {
      upperH = height * (0.69 - (t - 0.72) * 0.45);
    }

    // deslocamento vertical: calcanhar mais alto, biqueira mais baixa
    let yOffset;
    if (t < 0.25) yOffset = -height * 0.08;
    else if (t < 0.75) yOffset = -height * 0.02;
    else yOffset = height * (t - 0.75) * 0.22;

    // peito do pé um pouco mais levantado
    const instepBulge =
      Math.sin(Math.min(1, Math.max(0, (t - 0.18) / 0.45)) * Math.PI) *
      height *
      0.08;

    for (let is = 0; is <= sides; is++) {
      const u = is / sides;
      const a = -Math.PI + u * 2 * Math.PI;

      // elipse base
      let x = Math.sin(a) * halfW;
      let y = Math.cos(a) * upperH * 0.58;

      // achatar parte inferior, arredondar parte superior
      if (y > 0) y *= 0.62;
      else y *= 1.05;

      // mais volume no topo do meio do pé
      if (y < 0) y -= instepBulge;

      // afinar laterais perto da sola
      const sidePinch =
        1.0 - Math.pow(Math.abs(x) / Math.max(0.001, halfW), 1.8) * 0.08;
      y *= sidePinch;

      vertices.push([x, y + yOffset, z]);
      uvs.push([u, t]);
    }
  }

  for (let ir = 0; ir < rings; ir++) {
    for (let is = 0; is < sides; is++) {
      const a = idx(ir, is);
      const b = idx(ir, is + 1);
      const c = idx(ir + 1, is + 1);
      const d = idx(ir + 1, is);

      triangles.push([a, c, b]);
      triangles.push([a, d, c]);
    }
  }

  return Mesh.create(vertices, triangles, uvs);
};

Geometry.makeFootballBootSole = function (
  length = 34,
  height = 12.2,
  width = 12.0,
) {
  return Mesh.transformed(
    Geometry.makeRoundedRectPrism(
      width * 0.92,
      height * 0.1,
      length * 0.94,
      1.6,
      4,
    ),
    Mat4.translation(0, height * 0.44, 0),
  );
};

Geometry.makeFootballBootToeCap = function (
  length = 36,
  height = 15.5,
  width = 13.5,
) {
  const cap = Geometry.makeCapsuleZ(width * 0.27, width * 0.32, 18, 8);

  return Mesh.transformed(
    cap,
    Mat4.compose(
      Mat4.translation(0, height * 0.14, length * 0.34),
      Mat4.scale(1.0, height / width, 1.0),
    ),
  );
};

Geometry.makeFootballBootHeel = function (
  length = 34,
  height = 12.2,
  width = 12.0,
) {
  return Mesh.transformed(
    Geometry.makeRoundedRectPrism(
      width * 0.48,
      height * 0.2,
      length * 0.16,
      1.4,
      4,
    ),
    Mat4.translation(0, height * 0.34, -length * 0.35),
  );
};

Geometry.makeFootballBootCollar = function (
  length = 36,
  height = 15.5,
  width = 13.5,
) {
  return Mesh.transformed(
    Geometry.makeRoundedRectPrism(
      width * 0.46,
      height * 0.24,
      length * 0.18,
      1.5,
      4,
    ),
    Mat4.translation(0, -height * 0.34, -length * 0.16),
  );
};

Geometry.makeFootballBootLaceBand = function (
  length = 36,
  height = 15.5,
  width = 13.5,
) {
  return Mesh.transformed(
    Geometry.makeRoundedRectPrism(
      width * 0.14,
      height * 0.05,
      length * 0.42,
      1.0,
      4,
    ),
    Mat4.translation(0, -height * 0.2, length * 0.04),
  );
};

Geometry.makeFootballBootProfile = function (
  length = 34,
  height = 12.2,
  width = 12.0,
) {
  const upper = Geometry.makeFootballBootUpper(length, height, width);
  const sole = Geometry.makeFootballBootSole(length, height, width);
  const toeCap = Geometry.makeFootballBootToeCap(length, height, width);
  const heel = Geometry.makeFootballBootHeel(length, height, width);
  const collar = Geometry.makeFootballBootCollar(length, height, width);
  const laceBand = Geometry.makeFootballBootLaceBand(length, height, width);

  const studY = height * 0.5;

  const studs = [
    Mesh.transformed(
      Geometry.makeBootStud(width * 0.055, height * 0.11),
      Mat4.translation(-width * 0.2, studY, length * 0.3),
    ),
    Mesh.transformed(
      Geometry.makeBootStud(width * 0.055, height * 0.11),
      Mat4.translation(width * 0.2, studY, length * 0.3),
    ),

    Mesh.transformed(
      Geometry.makeBootStud(width * 0.052, height * 0.1),
      Mat4.translation(-width * 0.24, studY, length * 0.08),
    ),
    Mesh.transformed(
      Geometry.makeBootStud(width * 0.052, height * 0.1),
      Mat4.translation(width * 0.24, studY, length * 0.08),
    ),

    Mesh.transformed(
      Geometry.makeBootStud(width * 0.05, height * 0.1),
      Mat4.translation(-width * 0.2, studY, -length * 0.12),
    ),
    Mesh.transformed(
      Geometry.makeBootStud(width * 0.05, height * 0.1),
      Mat4.translation(width * 0.2, studY, -length * 0.12),
    ),

    Mesh.transformed(
      Geometry.makeBootStud(width * 0.06, height * 0.12),
      Mat4.translation(-width * 0.14, studY, -length * 0.34),
    ),
    Mesh.transformed(
      Geometry.makeBootStud(width * 0.06, height * 0.12),
      Mat4.translation(width * 0.14, studY, -length * 0.34),
    ),
  ];

  return Geometry.mergeMeshes([
    upper,
    sole,
    toeCap,
    heel,
    collar,
    laceBand,
    ...studs,
  ]);
};
// ----------------------------------------------------------
// FOOTBALL
// ----------------------------------------------------------

Geometry.makeFootball = function (radius = 28) {
  return Geometry.makeUvSphere(radius, 24, 32);
};
