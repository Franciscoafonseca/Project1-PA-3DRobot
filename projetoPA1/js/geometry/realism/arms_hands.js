// js/geometry/humanoid_arms_hands.js
// ============================================================
// HUMANOID GEOMETRY - ARMS / HANDS
// Ombros, braços, cotovelos, pulsos e dedos
// ============================================================

// ----------------------------------------------------------
// BRACO COMPLETO
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

// ----------------------------------------------------------
// SISTEMA DAS MAOS
// ----------------------------------------------------------

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
