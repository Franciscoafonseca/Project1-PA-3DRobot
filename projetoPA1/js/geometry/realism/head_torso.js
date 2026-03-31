// js/geometry/humanoid_head_torso.js
// ============================================================
// HUMANOID GEOMETRY - HEAD / TORSO
// Cabeça, orelhas e peito
// ============================================================

// ----------------------------------------------------------
// HEAD
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

// ----------------------------------------------------------
// TORSO
// ----------------------------------------------------------

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
