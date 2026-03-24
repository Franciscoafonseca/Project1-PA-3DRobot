// js/geometry.js
// ============================================================
// FINAL GEOMETRY LIBRARY FOR PA PROJECT
// All geometry is custom polygonal geometry built from triangles
// No built-in 3D primitives are used.
// ============================================================

class Mesh {
  static create(vertices = [], triangles = [], uvs = []) {
    return {
      vertices,
      triangles,
      uvs,
    };
  }

  static clone(mesh) {
    return {
      vertices: mesh.vertices.map((v) => [...v]),
      triangles: mesh.triangles.map((t) => [...t]),
      uvs: mesh.uvs ? mesh.uvs.map((uv) => [...uv]) : [],
    };
  }

  static merge(...meshes) {
    const outVertices = [];
    const outTriangles = [];
    const outUvs = [];

    let vertexOffset = 0;

    for (const mesh of meshes) {
      for (const v of mesh.vertices) {
        outVertices.push([...v]);
      }

      for (const tri of mesh.triangles) {
        outTriangles.push([
          tri[0] + vertexOffset,
          tri[1] + vertexOffset,
          tri[2] + vertexOffset,
        ]);
      }

      if (mesh.uvs && mesh.uvs.length > 0) {
        for (const uv of mesh.uvs) {
          outUvs.push([...uv]);
        }
      }

      vertexOffset += mesh.vertices.length;
    }

    return {
      vertices: outVertices,
      triangles: outTriangles,
      uvs: outUvs,
    };
  }

  static transformed(mesh, matrix) {
    return {
      vertices: mesh.vertices.map((v) => Mat4.transformPoint(matrix, v)),
      triangles: mesh.triangles.map((t) => [...t]),
      uvs: mesh.uvs ? mesh.uvs.map((uv) => [...uv]) : [],
    };
  }
}

class Geometry {
  // ----------------------------------------------------------
  // BASIC HELPERS
  // ----------------------------------------------------------

  static quadToTriangles(i0, i1, i2, i3) {
    return [
      [i0, i1, i2],
      [i0, i2, i3],
    ];
  }

  static addQuad(triangles, i0, i1, i2, i3) {
    triangles.push([i0, i1, i2]);
    triangles.push([i0, i2, i3]);
  }

  // ----------------------------------------------------------
  // TRIANGLE
  // ----------------------------------------------------------

  static makeTriangle() {
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
  }

  // ----------------------------------------------------------
  // QUAD (2 TRIANGLES)
  // ----------------------------------------------------------

  static makeQuad(width = 100, height = 100) {
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
  }

  // ----------------------------------------------------------
  // BOX
  // Centered at origin
  // 6 faces, each face triangulated manually
  // Separate vertices per face for correct UV mapping
  // ----------------------------------------------------------

  static makeBox(width = 100, height = 100, depth = 100) {
    const x = width / 2;
    const y = height / 2;
    const z = depth / 2;

    const vertices = [
      // Front
      [-x, -y, z],
      [x, -y, z],
      [x, y, z],
      [-x, y, z],
      // Back
      [x, -y, -z],
      [-x, -y, -z],
      [-x, y, -z],
      [x, y, -z],
      // Left
      [-x, -y, -z],
      [-x, -y, z],
      [-x, y, z],
      [-x, y, -z],
      // Right
      [x, -y, z],
      [x, -y, -z],
      [x, y, -z],
      [x, y, z],
      // Top
      [-x, y, z],
      [x, y, z],
      [x, y, -z],
      [-x, y, -z],
      // Bottom
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
  }

  // ----------------------------------------------------------
  // TRAPEZOID PRISM
  // Useful for torso, pelvis, feet, armor pieces
  // topWidth can differ from bottomWidth
  // ----------------------------------------------------------

  static makeTrapezoidPrism(
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
      // Front
      [-tx, ty, z],
      [tx, ty, z],
      [bx, by, z],
      [-bx, by, z],
      // Back
      [tx, ty, -z],
      [-tx, ty, -z],
      [-bx, by, -z],
      [bx, by, -z],
      // Left
      [-tx, ty, -z],
      [-tx, ty, z],
      [-bx, by, z],
      [-bx, by, -z],
      // Right
      [tx, ty, z],
      [tx, ty, -z],
      [bx, by, -z],
      [bx, by, z],
      // Top
      [-tx, ty, z],
      [tx, ty, z],
      [tx, ty, -z],
      [-tx, ty, -z],
      // Bottom
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
  }

  // ----------------------------------------------------------
  // CYLINDER (LOW POLY)
  // Useful for arms, legs, neck, joints
  // The cylinder axis is Y
  // ----------------------------------------------------------

  static makeCylinder(radius = 20, height = 100, sides = 12) {
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

    // Top cap
    for (let i = 0; i < sides; i++) {
      const next = (i + 1) % sides;
      triangles.push([topCenterIndex, topRing[i], topRing[next]]);
    }

    // Bottom cap
    for (let i = 0; i < sides; i++) {
      const next = (i + 1) % sides;
      triangles.push([bottomCenterIndex, bottomRing[next], bottomRing[i]]);
    }

    // Side faces
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
  }

  // ----------------------------------------------------------
  // PANEL
  // Outer shell + inner inset area
  // Good for chest panel, face screen, knee panel
  // ----------------------------------------------------------

  static makePanel(width = 60, height = 30, depth = 6, inset = 0.18) {
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

    return {
      shell,
      inner: innerMoved,
    };
  }

  // ----------------------------------------------------------
  // FOOT
  // More realistic than a simple box
  // ----------------------------------------------------------

  static makeFoot(length = 70, height = 25, width = 40) {
    return Geometry.makeTrapezoidPrism(width * 0.55, width, height, length);
  }

  // ----------------------------------------------------------
  // CLAW FINGER
  // Good for robotic hand / gripper
  // ----------------------------------------------------------

  static makeClawFinger(length = 35, height = 14, depth = 12) {
    return Geometry.makeTrapezoidPrism(depth * 0.7, depth, length, height);
  }

  // ----------------------------------------------------------
  // SHOULDER ARMOR
  // ----------------------------------------------------------

  static makeShoulderArmor(width = 40, height = 30, depth = 40) {
    return Geometry.makeTrapezoidPrism(width * 0.75, width, height, depth);
  }

  // ----------------------------------------------------------
  // PELVIS
  // ----------------------------------------------------------

  static makePelvis(widthTop = 80, widthBottom = 110, height = 45, depth = 60) {
    return Geometry.makeTrapezoidPrism(widthTop, widthBottom, height, depth);
  }

  // ----------------------------------------------------------
  // HEAD
  // Slightly stylized humanoid robotic head
  // ----------------------------------------------------------

  static makeHead(widthTop = 70, widthBottom = 85, height = 90, depth = 75) {
    return Geometry.makeTrapezoidPrism(widthTop, widthBottom, height, depth);
  }

  // ----------------------------------------------------------
  // TORSO
  // Main torso block
  // ----------------------------------------------------------

  static makeTorso(width = 130, height = 160, depth = 85) {
    return Geometry.makeTrapezoidPrism(width * 0.9, width, height, depth);
  }

  // ----------------------------------------------------------
  // SIMPLE LOW POLY SPHERE
  // Optional: useful for football
  // Built from latitude/longitude triangulation
  // ----------------------------------------------------------

  static makeUvSphere(radius = 30, latSteps = 8, lonSteps = 12) {
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
  }

  // ----------------------------------------------------------
  // FOOTBALL
  // For now uses low-poly sphere base
  // Later we can texture it like a football
  // ----------------------------------------------------------

  static makeFootball(radius = 28) {
    return Geometry.makeUvSphere(radius, 10, 14);
  }

  // ----------------------------------------------------------
  // DRAW MESH
  // Draws transformed mesh directly using TRIANGLES
  // This respects the project rule of sending final vertices
  // to p5.js after CPU-side transformation.
  // ----------------------------------------------------------

  static drawMesh(mesh, useTexture = false) {
    beginShape(TRIANGLES);

    for (const tri of mesh.triangles) {
      const a = mesh.vertices[tri[0]];
      const b = mesh.vertices[tri[1]];
      const c = mesh.vertices[tri[2]];

      const n = Geo.triangleNormal(a, b, c);
      normal(n[0], n[1], n[2]);

      if (useTexture && mesh.uvs && mesh.uvs.length > 0) {
        const uva = mesh.uvs[tri[0]] || [0, 0];
        const uvb = mesh.uvs[tri[1]] || [1, 0];
        const uvc = mesh.uvs[tri[2]] || [1, 1];

        vertex(a[0], a[1], a[2], uva[0], uva[1]);
        vertex(b[0], b[1], b[2], uvb[0], uvb[1]);
        vertex(c[0], c[1], c[2], uvc[0], uvc[1]);
      } else {
        vertex(a[0], a[1], a[2]);
        vertex(b[0], b[1], b[2]);
        vertex(c[0], c[1], c[2]);
      }
    }

    endShape();
  }
}
