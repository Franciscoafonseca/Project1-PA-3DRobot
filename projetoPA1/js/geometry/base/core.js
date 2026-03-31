// js/geometry/core.js
// ============================================================
// GEOMETRY CORE
// Helpers matemáticos, utilitários de mesh e drawMesh
// ============================================================

class Geometry {
  // ----------------------------------------------------------
  // HELPERS 2D / 3D
  // ----------------------------------------------------------

  // Área assinada de um polígono 2D.
  // Serve para perceber a orientação dos pontos (CW ou CCW).
  static signedArea2D(points) {
    let area = 0;

    for (let i = 0; i < points.length; i++) {
      const [x1, y1] = points[i];
      const [x2, y2] = points[(i + 1) % points.length];
      area += x1 * y2 - x2 * y1;
    }

    return area * 0.5;
  }

  // Centro de um triângulo 3D.
  static triangleCentroid(a, b, c) {
    return [
      (a[0] + b[0] + c[0]) / 3,
      (a[1] + b[1] + c[1]) / 3,
      (a[2] + b[2] + c[2]) / 3,
    ];
  }

  // Centro médio de todos os vértices de uma mesh.
  static meshCentroid(mesh) {
    if (!mesh || !mesh.vertices || mesh.vertices.length === 0) {
      return [0, 0, 0];
    }

    let sx = 0;
    let sy = 0;
    let sz = 0;

    for (const v of mesh.vertices) {
      sx += v[0];
      sy += v[1];
      sz += v[2];
    }

    const inv = 1 / mesh.vertices.length;
    return [sx * inv, sy * inv, sz * inv];
  }

  // Produto escalar entre dois vetores 3D.
  static dot3(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }

  // Subtração vetorial 3D: a - b
  static sub3(a, b) {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  }

  // Garante que um perfil 2D está em orientação anti-horária.
  static ensureCCWProfile(points) {
    if (!points || points.length < 3) {
      return points ? points.slice() : [];
    }

    const area = Geometry.signedArea2D(points);

    if (area < 0) {
      return points
        .slice()
        .reverse()
        .map((p) => [...p]);
    }

    return points.slice().map((p) => [...p]);
  }

  // Adiciona um quadrilátero já triangulado em 2 triângulos.
  static addQuad(triangles, i0, i1, i2, i3) {
    triangles.push([i0, i1, i2]);
    triangles.push([i0, i2, i3]);
  }

  // Junta várias meshes numa só.
  static mergeMeshes(meshes) {
    return Mesh.merge(...meshes);
  }

  // Clamp básico.
  static clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  // Interpolação linear.
  static lerp(a, b, t) {
    return a + (b - a) * t;
  }

  // ----------------------------------------------------------
  // ROTAÇÃO DE PONTOS
  // ----------------------------------------------------------

  static rotatePointX(p, angle) {
    const [x, y, z] = p;
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return [x, y * c - z * s, y * s + z * c];
  }

  static rotatePointY(p, angle) {
    const [x, y, z] = p;
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return [x * c + z * s, y, -x * s + z * c];
  }

  static rotatePointZ(p, angle) {
    const [x, y, z] = p;
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return [x * c - y * s, x * s + y * c, z];
  }

  // ----------------------------------------------------------
  // ROTAÇÃO DE MESHES
  // ----------------------------------------------------------

  static rotateMeshX(mesh, angle) {
    return {
      vertices: mesh.vertices.map((v) => Geometry.rotatePointX(v, angle)),
      triangles: mesh.triangles.map((t) => [...t]),
      uvs: mesh.uvs ? mesh.uvs.map((uv) => [...uv]) : [],
    };
  }

  static rotateMeshY(mesh, angle) {
    return {
      vertices: mesh.vertices.map((v) => Geometry.rotatePointY(v, angle)),
      triangles: mesh.triangles.map((t) => [...t]),
      uvs: mesh.uvs ? mesh.uvs.map((uv) => [...uv]) : [],
    };
  }

  static rotateMeshZ(mesh, angle) {
    return {
      vertices: mesh.vertices.map((v) => Geometry.rotatePointZ(v, angle)),
      triangles: mesh.triangles.map((t) => [...t]),
      uvs: mesh.uvs ? mesh.uvs.map((uv) => [...uv]) : [],
    };
  }

  // ----------------------------------------------------------
  // PERFIS 2D - UTILITÁRIOS
  // ----------------------------------------------------------

  static profileBounds(points) {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    for (const p of points) {
      minX = Math.min(minX, p[0]);
      maxX = Math.max(maxX, p[0]);
      minY = Math.min(minY, p[1]);
      maxY = Math.max(maxY, p[1]);
    }

    return { minX, maxX, minY, maxY };
  }

  static reverseProfile(points) {
    return points
      .slice()
      .reverse()
      .map((p) => [...p]);
  }

  // ----------------------------------------------------------
  // DESENHO DE MESH INDEXADA
  // ----------------------------------------------------------

  // Desenha uma mesh usando TRIANGLES.
  // Se useTexture=true e existirem UVs, envia coordenadas UV por vértice.
  static drawMesh(mesh, useTexture = false) {
    beginShape(TRIANGLES);

    const center = Geometry.meshCentroid(mesh);

    for (const tri of mesh.triangles) {
      const ia = tri[0];
      const ib = tri[1];
      const ic = tri[2];

      const a = mesh.vertices[ia];
      const b = mesh.vertices[ib];
      const c = mesh.vertices[ic];

      let n = Geo.triangleNormal(a, b, c);

      const triCenter = Geometry.triangleCentroid(a, b, c);
      const outward = Geometry.sub3(triCenter, center);

      // Se a normal estiver virada para dentro, inverte.
      if (Geometry.dot3(n, outward) < 0) {
        n = [-n[0], -n[1], -n[2]];
      }

      const len = Math.hypot(n[0], n[1], n[2]) || 1;
      normal(n[0] / len, n[1] / len, n[2] / len);

      if (useTexture && mesh.uvs && mesh.uvs.length > 0) {
        const uva = mesh.uvs[ia] || [0, 0];
        const uvb = mesh.uvs[ib] || [1, 0];
        const uvc = mesh.uvs[ic] || [1, 1];

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
