// js/geometry/mesh.js
// ============================================================
// MESH UTILITIES
// ============================================================

class Mesh {
  static create(vertices = [], triangles = [], uvs = []) {
    return { vertices, triangles, uvs };
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
      for (const v of mesh.vertices) outVertices.push([...v]);

      for (const tri of mesh.triangles) {
        outTriangles.push([
          tri[0] + vertexOffset,
          tri[1] + vertexOffset,
          tri[2] + vertexOffset,
        ]);
      }

      if (mesh.uvs && mesh.uvs.length > 0) {
        for (const uv of mesh.uvs) outUvs.push([...uv]);
      } else {
        for (let i = 0; i < mesh.vertices.length; i++) outUvs.push([0, 0]);
      }

      vertexOffset += mesh.vertices.length;
    }

    return Mesh.create(outVertices, outTriangles, outUvs);
  }

  static transformed(mesh, matrix) {
    return {
      vertices: mesh.vertices.map((v) => Mat4.transformPoint(matrix, v)),
      triangles: mesh.triangles.map((t) => [...t]),
      uvs: mesh.uvs ? mesh.uvs.map((uv) => [...uv]) : [],
    };
  }
}
