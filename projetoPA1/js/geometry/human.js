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

Geometry.makeChest = function (width = 86, height = 112, depth = 48) {
  const core = Geometry.makeRoundedTaperedPrism(
    width * 0.9,
    width,
    height,
    depth * 0.92,
    depth,
    8,
    28,
  );

  const breastplate = Mesh.transformed(
    Geometry.makeRoundedRectPrism(
      width * 0.7,
      height * 0.34,
      depth * 0.16,
      8,
      5,
    ),
    Mat4.translation(0, -height * 0.16, depth * 0.34),
  );

  const abdomen = Mesh.transformed(
    Geometry.makeRoundedRectPrism(
      width * 0.46,
      height * 0.2,
      depth * 0.12,
      6,
      4,
    ),
    Mat4.translation(0, height * 0.18, depth * 0.32),
  );

  const sideL = Mesh.transformed(
    Geometry.makeRoundedRectPrism(
      width * 0.12,
      height * 0.36,
      depth * 0.22,
      4,
      4,
    ),
    Mat4.translation(-width * 0.38, -height * 0.06, depth * 0.05),
  );

  const sideR = Mesh.transformed(
    Geometry.makeRoundedRectPrism(
      width * 0.12,
      height * 0.36,
      depth * 0.22,
      4,
      4,
    ),
    Mat4.translation(width * 0.38, -height * 0.06, depth * 0.05),
  );

  return Geometry.mergeMeshes([core, breastplate, abdomen, sideL, sideR]);
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
  return Geometry.makeRoundedTaperedPrism(
    topWidth,
    bottomWidth,
    length,
    topDepth,
    bottomDepth,
    5.2,
    34,
  );
};

Geometry.makeForearmRounded = function (
  length = 48,
  elbowWidth = 13.2,
  wristWidth = 9.8,
  elbowDepth = 12.8,
  wristDepth = 9.0,
) {
  return Geometry.makeRoundedTaperedPrism(
    elbowWidth,
    wristWidth,
    length,
    elbowDepth,
    wristDepth,
    4.8,
    34,
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

Geometry.makeShortsAdvanced = function (width = 82, height = 24, depth = 42) {
  const waistHeight = height * 0.3;
  const legHeight = height * 0.75;
  const legWidth = width * 0.36;
  const gap = width * 0.04;

  const waist = Geometry.makeRoundedRectPrism(width, waistHeight, depth, 8, 5);

  const leftLeg = Mesh.transformed(
    Geometry.makeRoundedRectPrism(legWidth, legHeight, depth * 0.75, 6, 4),
    Mat4.translation(
      -(legWidth * 0.5 + gap * 0.5),
      waistHeight * 0.5 + legHeight * 0.65,
      1.5,
    ),
  );

  const rightLeg = Mesh.transformed(
    Geometry.makeRoundedRectPrism(legWidth, legHeight, depth * 0.75, 6, 4),
    Mat4.translation(
      legWidth * 0.5 + gap * 0.5,
      waistHeight * 0.5 + legHeight * 0.65,
      1.5,
    ),
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

Geometry.makeHipJoint = function (radius = 7.8, width = 14, depth = 11) {
  return Geometry.makeCapsuleX(radius, width, 18, 6);
};
// ----------------------------------------------------------
// THIGH / KNEE / SHIN
// ----------------------------------------------------------

Geometry.makeThighHumanized = function (radiusTop = 11.5, height = 62) {
  const shell = Geometry.makeCapsuleLimb(
    height,
    radiusTop * 1.0,
    radiusTop * 0.92,
    radiusTop * 0.68,
    radiusTop * 0.62,
    4.8,
    30,
  );

  const frontSmooth = Mesh.transformed(
    Geometry.makeRoundedRectPrism(
      radiusTop * 0.9,
      height * 0.46,
      radiusTop * 0.2,
      4,
      4,
    ),
    Mat4.translation(0, 0, radiusTop * 0.42),
  );

  return Geometry.mergeMeshes([shell, frontSmooth]);
};

Geometry.makeKneeHumanized = function (
  radiusX = 8.5,
  radiusY = 7.0,
  radiusZ = 8.2,
) {
  const core = Geometry.makeOvalJoint(radiusX, radiusY, radiusZ, 14, 20);

  const cap = Mesh.transformed(
    Geometry.makeRoundedRectPrism(
      radiusX * 0.7,
      radiusY * 0.3,
      radiusZ * 0.16,
      4,
      4,
    ),
    Mat4.translation(0, 0.2, radiusZ * 0.52),
  );

  return Geometry.mergeMeshes([core, cap]);
};

Geometry.makeShinHumanized = function (
  radiusTop = 8.6,
  radiusBottom = 5.8,
  height = 60,
) {
  const shell = Geometry.makeCapsuleLimb(
    height,
    radiusTop * 0.8,
    radiusTop * 0.72,
    radiusBottom * 0.72,
    radiusBottom * 0.64,
    4.8,
    30,
  );

  const shinFront = Mesh.transformed(
    Geometry.makeRoundedRectPrism(
      radiusTop * 0.72,
      height * 0.56,
      radiusTop * 0.14,
      4,
      4,
    ),
    Mat4.translation(0, -1, radiusTop * 0.34),
  );

  const calfBulge = Mesh.transformed(
    Geometry.makeRoundedRectPrism(
      radiusTop * 0.54,
      height * 0.24,
      radiusTop * 0.22,
      4,
      4,
    ),
    Mat4.translation(0, height * 0.08, -radiusTop * 0.2),
  );

  return Geometry.mergeMeshes([shell, shinFront, calfBulge]);
};

// ----------------------------------------------------------
// BOOT
// ----------------------------------------------------------

// ----------------------------------------------------------
// BOOT
// ----------------------------------------------------------

Geometry.makeFootballBootProfile = function (
  length = 36,
  height = 12,
  width = 16,
) {
  const shell = Geometry.makeBootShell(length, height, width);

  const lacePlate = Mesh.transformed(
    Geometry.rotateMeshX(
      Geometry.makeRoundedRectPrism(
        width * 0.24,
        length * 0.32,
        height * 0.05,
        4,
        4,
      ),
      Math.PI / 2,
    ),
    Mat4.translation(0, -height * 0.24, length * 0.02),
  );

  const studFL = Mesh.transformed(
    Geometry.makeCylinder(width * 0.05, height * 0.11, 8),
    Mat4.translation(-width * 0.18, height * 0.16, length * 0.2),
  );
  const studFR = Mesh.transformed(
    Geometry.makeCylinder(width * 0.05, height * 0.11, 8),
    Mat4.translation(width * 0.18, height * 0.16, length * 0.2),
  );
  const studML = Mesh.transformed(
    Geometry.makeCylinder(width * 0.045, height * 0.1, 8),
    Mat4.translation(-width * 0.2, height * 0.16, -length * 0.02),
  );
  const studMR = Mesh.transformed(
    Geometry.makeCylinder(width * 0.045, height * 0.1, 8),
    Mat4.translation(width * 0.2, height * 0.16, -length * 0.02),
  );
  const studHL = Mesh.transformed(
    Geometry.makeCylinder(width * 0.05, height * 0.11, 8),
    Mat4.translation(-width * 0.14, height * 0.16, -length * 0.24),
  );
  const studHR = Mesh.transformed(
    Geometry.makeCylinder(width * 0.05, height * 0.11, 8),
    Mat4.translation(width * 0.14, height * 0.16, -length * 0.24),
  );

  return Geometry.mergeMeshes([
    shell,
    lacePlate,
    studFL,
    studFR,
    studML,
    studMR,
    studHL,
    studHR,
  ]);
};

// ----------------------------------------------------------
// FOOTBALL
// ----------------------------------------------------------

Geometry.makeFootball = function (radius = 28) {
  return Geometry.makeUvSphere(radius, 24, 32);
};
