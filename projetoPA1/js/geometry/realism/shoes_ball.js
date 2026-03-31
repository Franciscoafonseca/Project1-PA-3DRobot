// ----------------------------------------------------------
// CONE / PITOES
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

// ----------------------------------------------------------
// SAPATILHA
// ----------------------------------------------------------

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
    // calcanhar traseira
    Mesh.transformed(
      Geometry.makeConeStud(width * 0.072, height * 0.38, 12),
      Mat4.translation(-width * 0.24, height * 0.1, length * 0.26),
    ),
    Mesh.transformed(
      Geometry.makeConeStud(width * 0.072, height * 0.38, 12),
      Mat4.translation(width * 0.24, height * 0.1, length * 0.26),
    ),

    // calcanha entre o meio e a traseira
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
