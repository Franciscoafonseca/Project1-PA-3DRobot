// ------------------------------------------------------------
// DESENHO DA RELVA (metade do campo)
// ------------------------------------------------------------
// A relva é construída manualmente com um mesh (triângulos),
// respeitando o requisito do projeto de usar geometria própria
// e não primitivas de alto nível.
function drawPitchHalf() {
  const halfW = getGrassHalfWidth();
  const y = Scene.floorY;
  const farZ = getGrassBackZ();
  const nearZ = Scene.pitch.nearZ;

  // Definição manual dos vértices e índices (triangulação)
  const pitchMesh = Mesh.create(
    [
      [-halfW, y, farZ],
      [halfW, y, farZ],
      [halfW, y, nearZ],
      [-halfW, y, nearZ],
    ],
    [
      [0, 1, 2],
      [0, 2, 3], // quadrado dividido em dois triângulos
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

// ------------------------------------------------------------
// LINHAS DA ÁREA (linhas brancas)
// ------------------------------------------------------------
// Aqui usamos primitivas de linha apenas para representar
// marcações do campo (não são superfícies).
function drawPenaltyAreaLines() {
  const y = Scene.floorY - 0.6;
  const halfW = getPitchHalfWidth();
  const goalZ = Scene.pitch.goalLineZ;

  stroke(245, 245, 245);
  strokeWeight(4);

  // linhas laterais
  line(-halfW, y, Scene.pitch.nearZ, -halfW, y, goalZ);
  line(halfW, y, Scene.pitch.nearZ, halfW, y, goalZ);

  // linha de fundo
  line(-halfW, y, goalZ, halfW, y, goalZ);

  // áreas
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

// ------------------------------------------------------------
// DESENHO DE UMA "CAIXA" (área)
// ------------------------------------------------------------
function drawBoxFromGoalLine(y, cx, goalZ, width, depth) {
  const hw = width * 0.5;
  const zFront = goalZ + depth;

  line(cx - hw, y, zFront, cx + hw, y, zFront);
  line(cx - hw, y, goalZ, cx - hw, y, zFront);
  line(cx + hw, y, goalZ, cx + hw, y, zFront);
}

// ------------------------------------------------------------
// BANDEIRAS DE CANTO
// ------------------------------------------------------------
function drawCornerFlags() {
  const halfField = getPitchHalfWidth();
  const yBase = Scene.floorY;
  const zCorner = Scene.pitch.goalLineZ;

  drawCornerFlag(-halfField, yBase, zCorner, true);
  drawCornerFlag(halfField, yBase, zCorner, false);
}

// Cada bandeira é composta por:
// - um cilindro (poste)
// - um triângulo (bandeira)
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

  // triangulação manual da bandeira
  beginShape(TRIANGLES);
  vertex(x, yTop, z);
  vertex(x, yTop + flagHeight, z);
  vertex(x + dir * flagLength, yTop + flagHeight * 0.55, z);
  endShape();

  pop();
}

// ------------------------------------------------------------
// BALIZA
// ------------------------------------------------------------
// A baliza é desenhada com linhas (estrutura) + rede
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

  // estrutura frontal
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

  // restante estrutura + rede (gerada por subdivisão)
  // uso de loops para simular malha da rede
  strokeWeight(Scene.goal.netStroke);
  stroke(230, 230, 230, 115);

  const cols = 18;
  const rows = 14;

  for (let i = 1; i < cols; i++) {
    const x = lerp(-backHalfWidth, backHalfWidth, i / cols);
    line(x, y, backZ, x, y - goalHeight, backZ);
  }

  for (let j = 1; j < rows; j++) {
    const yy = lerp(y, y - goalHeight, j / rows);
    line(-backHalfWidth, yy, backZ, backHalfWidth, yy, backZ);
  }

  noStroke();
}
