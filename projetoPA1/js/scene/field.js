// js/field.js
// ============================================================
// FIELD SYSTEM
// Campo, linhas, baliza, bandeiras e fundo.
// ============================================================

function drawPitchHalf() {
  const halfW = getGrassHalfWidth();
  const y = Scene.floorY;
  const farZ = getGrassBackZ();
  const nearZ = Scene.pitch.nearZ;

  const pitchMesh = Mesh.create(
    [
      [-halfW, y, farZ],
      [halfW, y, farZ],
      [halfW, y, nearZ],
      [-halfW, y, nearZ],
    ],
    [
      [0, 1, 2],
      [0, 2, 3],
    ],
    [
      [0, 0],
      [Scene.pitch.grassUVX, 0],
      [Scene.pitch.grassUVX, Scene.pitch.grassUVZ],
      [0, Scene.pitch.grassUVZ],
    ],
  );

  push();
  const useTexture = applyMaterial("grass");
  Geometry.drawMesh(pitchMesh, useTexture);
  pop();
}

function drawPenaltyAreaLines() {
  const y = Scene.floorY - 0.6;
  const halfW = getPitchHalfWidth();
  const goalZ = Scene.pitch.goalLineZ;

  stroke(245, 245, 245);
  strokeWeight(4);

  line(-halfW, y, Scene.pitch.nearZ, -halfW, y, goalZ);
  line(halfW, y, Scene.pitch.nearZ, halfW, y, goalZ);
  line(-halfW, y, goalZ, halfW, y, goalZ);

  drawBoxFromGoalLine(
    y,
    0,
    goalZ,
    Scene.pitch.penaltyBoxWidth,
    Scene.pitch.penaltyBoxDepth,
  );

  drawBoxFromGoalLine(
    y,
    0,
    goalZ,
    Scene.pitch.goalBoxWidth,
    Scene.pitch.goalBoxDepth,
  );

  noStroke();
}

function drawBoxFromGoalLine(y, cx, goalZ, width, depth) {
  const hw = width * 0.5;
  const zFront = goalZ + depth;

  line(cx - hw, y, zFront, cx + hw, y, zFront);
  line(cx - hw, y, goalZ, cx - hw, y, zFront);
  line(cx + hw, y, goalZ, cx + hw, y, zFront);
}

function drawCornerFlags() {
  const halfField = getPitchHalfWidth();
  const yBase = Scene.floorY;
  const zCorner = Scene.pitch.goalLineZ;

  drawCornerFlag(-halfField, yBase, zCorner, true);
  drawCornerFlag(halfField, yBase, zCorner, false);
}

function drawCornerFlag(x, yBase, z, isLeft) {
  const poleHeight = 240;
  const flagHeight = 60;
  const flagLength = 90;

  const poleMatrix = Mat4.compose(
    Mat4.translation(x, yBase - poleHeight * 0.5, z),
  );

  drawSceneMesh(sceneMeshes.cornerFlagPole, poleMatrix, "corner_flag_pole");

  const dir = isLeft ? 1 : -1;
  const yTop = yBase - poleHeight;

  push();
  noStroke();
  fill(255, 140, 40);

  beginShape(TRIANGLES);
  vertex(x, yTop, z);
  vertex(x, yTop + flagHeight, z);
  vertex(x + dir * flagLength, yTop + flagHeight * 0.55, z);
  endShape();

  pop();
}

function drawGoal() {
  const frontZ = Scene.pitch.goalLineZ;
  const y = Scene.floorY;

  const frontHalfWidth = Scene.goal.postHalfWidth;
  const goalHeight = Scene.goal.height;
  const goalDepth = Scene.goal.depth;
  const backInset = Scene.goal.backInset;

  const backZ = frontZ - goalDepth;
  const backHalfWidth = frontHalfWidth - backInset;

  stroke(248, 248, 248);
  strokeWeight(Scene.goal.frameStroke);

  line(-frontHalfWidth, y, frontZ, -frontHalfWidth, y - goalHeight, frontZ);
  line(frontHalfWidth, y, frontZ, frontHalfWidth, y - goalHeight, frontZ);
  line(
    -frontHalfWidth,
    y - goalHeight,
    frontZ,
    frontHalfWidth,
    y - goalHeight,
    frontZ,
  );

  line(-frontHalfWidth, y, frontZ, -backHalfWidth, y, backZ);
  line(frontHalfWidth, y, frontZ, backHalfWidth, y, backZ);

  line(
    -frontHalfWidth,
    y - goalHeight,
    frontZ,
    -backHalfWidth,
    y - goalHeight,
    backZ,
  );
  line(
    frontHalfWidth,
    y - goalHeight,
    frontZ,
    backHalfWidth,
    y - goalHeight,
    backZ,
  );

  line(-backHalfWidth, y, backZ, -backHalfWidth, y - goalHeight, backZ);
  line(backHalfWidth, y, backZ, backHalfWidth, y - goalHeight, backZ);
  line(
    -backHalfWidth,
    y - goalHeight,
    backZ,
    backHalfWidth,
    y - goalHeight,
    backZ,
  );
  line(-backHalfWidth, y, backZ, backHalfWidth, y, backZ);

  strokeWeight(Scene.goal.netStroke);
  stroke(230, 230, 230, 115);

  const cols = 18;
  const rows = 14;
  const depthSegs = 14;

  for (let i = 1; i < cols; i++) {
    const x = lerp(-backHalfWidth, backHalfWidth, i / cols);
    line(x, y, backZ, x, y - goalHeight, backZ);
  }

  for (let j = 1; j < rows; j++) {
    const yy = lerp(y, y - goalHeight, j / rows);
    line(-backHalfWidth, yy, backZ, backHalfWidth, yy, backZ);
  }

  for (let i = 0; i <= cols; i++) {
    const xf = lerp(-frontHalfWidth, frontHalfWidth, i / cols);
    const xb = lerp(-backHalfWidth, backHalfWidth, i / cols);
    line(xf, y - goalHeight, frontZ, xb, y - goalHeight, backZ);
  }

  for (let k = 1; k < depthSegs; k++) {
    const t = k / depthSegs;
    const z = lerp(frontZ, backZ, t);
    const xL = lerp(-frontHalfWidth, -backHalfWidth, t);
    const xR = lerp(frontHalfWidth, backHalfWidth, t);
    line(xL, y - goalHeight, z, xR, y - goalHeight, z);
  }

  for (let j = 1; j < rows; j++) {
    const yy = lerp(y, y - goalHeight, j / rows);
    line(-frontHalfWidth, yy, frontZ, -backHalfWidth, yy, backZ);
    line(frontHalfWidth, yy, frontZ, backHalfWidth, yy, backZ);
  }

  for (let k = 1; k < depthSegs; k++) {
    const t = k / depthSegs;
    const z = lerp(frontZ, backZ, t);

    const xL = lerp(-frontHalfWidth, -backHalfWidth, t);
    const xR = lerp(frontHalfWidth, backHalfWidth, t);

    line(xL, y, z, xL, y - goalHeight, z);
    line(xR, y, z, xR, y - goalHeight, z);
  }

  noStroke();
}
