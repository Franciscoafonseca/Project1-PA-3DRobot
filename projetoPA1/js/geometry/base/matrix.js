// ============================================================
// FINAL MATRIX LIBRARY FOR PA PROJECT
// Computer Graphics - p5.js WEBGL
//
// Conventions used:
// - 4x4 matrices in column-major order
// - vectors treated as column vectors
// - point transformation: p' = M * p
//
// Matrix layout in memory:
// [ 0  4  8 12 ]
// [ 1  5  9 13 ]
// [ 2  6 10 14 ]
// [ 3  7 11 15 ]
// ============================================================

class Mat4 {
  static identity() {
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  }

  static clone(m) {
    return [...m];
  }

  static multiply(a, b) {
    const out = new Array(16).fill(0);

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        let sum = 0;
        for (let k = 0; k < 4; k++) {
          sum += a[k * 4 + row] * b[col * 4 + k];
        }
        out[col * 4 + row] = sum;
      }
    }

    return out;
  }

  static compose(...matrices) {
    let out = Mat4.identity();
    for (const m of matrices) {
      out = Mat4.multiply(out, m);
    }
    return out;
  }

  static translation(tx, ty, tz) {
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1];
  }

  static scale(sx, sy, sz) {
    return [sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1];
  }

  static rotateX(angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);

    return [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1];
  }

  static rotateY(angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);

    return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1];
  }

  static rotateZ(angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);

    return [c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  }

  static transpose(m) {
    return [
      m[0],
      m[4],
      m[8],
      m[12],
      m[1],
      m[5],
      m[9],
      m[13],
      m[2],
      m[6],
      m[10],
      m[14],
      m[3],
      m[7],
      m[11],
      m[15],
    ];
  }

  static transformPoint(m, point) {
    const x = point[0];
    const y = point[1];
    const z = point[2];
    const w = 1;

    return [
      m[0] * x + m[4] * y + m[8] * z + m[12] * w,
      m[1] * x + m[5] * y + m[9] * z + m[13] * w,
      m[2] * x + m[6] * y + m[10] * z + m[14] * w,
    ];
  }

  static transformVector(m, vector) {
    const x = vector[0];
    const y = vector[1];
    const z = vector[2];
    const w = 0;

    return [
      m[0] * x + m[4] * y + m[8] * z + m[12] * w,
      m[1] * x + m[5] * y + m[9] * z + m[13] * w,
      m[2] * x + m[6] * y + m[10] * z + m[14] * w,
    ];
  }

  static transformPoints(m, points) {
    const out = [];
    for (const p of points) {
      out.push(Mat4.transformPoint(m, p));
    }
    return out;
  }

  static transformTriangles(m, triangles) {
    const out = [];
    for (const tri of triangles) {
      out.push([
        Mat4.transformPoint(m, tri[0]),
        Mat4.transformPoint(m, tri[1]),
        Mat4.transformPoint(m, tri[2]),
      ]);
    }
    return out;
  }

  static transformMesh(m, mesh) {
    const transformed = {
      vertices: [],
      triangles: [],
      uvs: mesh.uvs ? [...mesh.uvs] : [],
      normals: [],
    };

    if (mesh.vertices) {
      transformed.vertices = Mat4.transformPoints(m, mesh.vertices);
    }

    if (mesh.triangles) {
      transformed.triangles = mesh.triangles.map((tri) => [...tri]);
    }

    if (mesh.normals && mesh.normals.length > 0) {
      transformed.normals = mesh.normals.map((n) =>
        Vec3.normalize(Mat4.transformVector(m, n)),
      );
    }

    return transformed;
  }

  static inverseAffine(m) {
    const r00 = m[0],
      r01 = m[4],
      r02 = m[8];
    const r10 = m[1],
      r11 = m[5],
      r12 = m[9];
    const r20 = m[2],
      r21 = m[6],
      r22 = m[10];

    const tx = m[12];
    const ty = m[13];
    const tz = m[14];

    const det =
      r00 * (r11 * r22 - r12 * r21) -
      r01 * (r10 * r22 - r12 * r20) +
      r02 * (r10 * r21 - r11 * r20);

    if (Math.abs(det) < 1e-10) {
      throw new Error("Matrix is not invertible.");
    }

    const invDet = 1 / det;

    const i00 = (r11 * r22 - r12 * r21) * invDet;
    const i01 = -(r01 * r22 - r02 * r21) * invDet;
    const i02 = (r01 * r12 - r02 * r11) * invDet;

    const i10 = -(r10 * r22 - r12 * r20) * invDet;
    const i11 = (r00 * r22 - r02 * r20) * invDet;
    const i12 = -(r00 * r12 - r02 * r10) * invDet;

    const i20 = (r10 * r21 - r11 * r20) * invDet;
    const i21 = -(r00 * r21 - r01 * r20) * invDet;
    const i22 = (r00 * r11 - r01 * r10) * invDet;

    const itx = -(i00 * tx + i01 * ty + i02 * tz);
    const ity = -(i10 * tx + i11 * ty + i12 * tz);
    const itz = -(i20 * tx + i21 * ty + i22 * tz);

    return [
      i00,
      i10,
      i20,
      0,
      i01,
      i11,
      i21,
      0,
      i02,
      i12,
      i22,
      0,
      itx,
      ity,
      itz,
      1,
    ];
  }

  static normalMatrixFromAffine(m) {
    const inv = Mat4.inverseAffine(m);
    const invT = Mat4.transpose(inv);

    return [
      invT[0],
      invT[4],
      invT[8],
      invT[1],
      invT[5],
      invT[9],
      invT[2],
      invT[6],
      invT[10],
    ];
  }

  static transformNormal(normalMatrix3, n) {
    const x = n[0];
    const y = n[1];
    const z = n[2];

    return Vec3.normalize([
      normalMatrix3[0] * x + normalMatrix3[3] * y + normalMatrix3[6] * z,
      normalMatrix3[1] * x + normalMatrix3[4] * y + normalMatrix3[7] * z,
      normalMatrix3[2] * x + normalMatrix3[5] * y + normalMatrix3[8] * z,
    ]);
  }

  static print(m, label = "Mat4") {
    console.log(label);
    console.log(
      `[${m[0].toFixed(3)}, ${m[4].toFixed(3)}, ${m[8].toFixed(3)}, ${m[12].toFixed(3)}]`,
    );
    console.log(
      `[${m[1].toFixed(3)}, ${m[5].toFixed(3)}, ${m[9].toFixed(3)}, ${m[13].toFixed(3)}]`,
    );
    console.log(
      `[${m[2].toFixed(3)}, ${m[6].toFixed(3)}, ${m[10].toFixed(3)}, ${m[14].toFixed(3)}]`,
    );
    console.log(
      `[${m[3].toFixed(3)}, ${m[7].toFixed(3)}, ${m[11].toFixed(3)}, ${m[15].toFixed(3)}]`,
    );
  }
}

// ============================================================
// Vec3 utilities
// ============================================================

class Vec3 {
  static create(x = 0, y = 0, z = 0) {
    return [x, y, z];
  }

  static clone(v) {
    return [...v];
  }

  static add(a, b) {
    return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  }

  static sub(a, b) {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  }

  static scale(v, s) {
    return [v[0] * s, v[1] * s, v[2] * s];
  }

  static dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }

  static cross(a, b) {
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0],
    ];
  }

  static length(v) {
    return Math.hypot(v[0], v[1], v[2]);
  }

  static normalize(v) {
    const len = Vec3.length(v);
    if (len < 1e-10) return [0, 0, 0];
    return [v[0] / len, v[1] / len, v[2] / len];
  }

  static midpoint(a, b) {
    return [(a[0] + b[0]) * 0.5, (a[1] + b[1]) * 0.5, (a[2] + b[2]) * 0.5];
  }

  static distance(a, b) {
    return Vec3.length(Vec3.sub(a, b));
  }
}

// ============================================================
// Geometry helpers
// ============================================================

class Geo {
  static triangleNormal(a, b, c) {
    const ab = Vec3.sub(b, a);
    const ac = Vec3.sub(c, a);
    return Vec3.normalize(Vec3.cross(ab, ac));
  }

  static computeFaceNormals(vertices, triangles) {
    const normals = [];

    for (const tri of triangles) {
      const a = vertices[tri[0]];
      const b = vertices[tri[1]];
      const c = vertices[tri[2]];
      normals.push(Geo.triangleNormal(a, b, c));
    }

    return normals;
  }

  static applyMatrixToVertices(vertices, matrix) {
    return vertices.map((v) => Mat4.transformPoint(matrix, v));
  }

  static applyNormalMatrixToNormals(normals, normalMatrix3) {
    return normals.map((n) => Mat4.transformNormal(normalMatrix3, n));
  }
}
