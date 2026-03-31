// ------------------------------------------------------------
// BANCADAS LATERAIS
// ------------------------------------------------------------

// Desenha as duas bancadas laterais
function drawSideStands() {
  drawLongSideStand(true);
  drawLongSideStand(false);
}

// Esta função constrói uma bancada lateral por níveis.
// Cada nível é formado por:
// - corpo principal
// - patamar superior
// - frente do degrau
// - fila de bancos
function drawLongSideStand(leftSide) {
  const levels = Scene.stands.levels;
  const zStart = Scene.stands.zStart;
  const zEnd = Scene.stands.zEnd;
  const stepHeight = Scene.stands.stepHeight;
  const treadDepth = Scene.stands.treadDepth;

  const xFrontBase = getStandInnerX(leftSide);
  const totalDepth = levels * treadDepth;
  const xBack = leftSide ? xFrontBase - totalDepth : xFrontBase + totalDepth;

  for (let i = 0; i < levels; i++) {
    const topY = Scene.floorY - (i + 1) * stepHeight;
    const bottomY = Scene.floorY - i * stepHeight;

    const xFront = leftSide
      ? xFrontBase - i * treadDepth
      : xFrontBase + i * treadDepth;

    const x0 = Math.min(xFront, xBack);
    const x1 = Math.max(xFront, xBack);

    // Corpo principal do degrau
    const bodyMesh = makeStandBlockMesh(
      x0,
      x1,
      topY + 22,
      bottomY,
      zStart,
      zEnd,
    );

    push();
    const useBodyTexture = applyMaterial("cimento");
    Geometry.drawMesh(bodyMesh, useBodyTexture);
    pop();

    // Patamar superior do degrau
    let tx0, tx1;
    if (leftSide) {
      tx0 = xFront - treadDepth;
      tx1 = xFront;
    } else {
      tx0 = xFront;
      tx1 = xFront + treadDepth;
    }

    const treadMesh = makeStandBlockMesh(
      Math.min(tx0, tx1),
      Math.max(tx0, tx1),
      topY,
      topY + 22,
      zStart,
      zEnd,
    );

    push();
    const useTopTexture = applyMaterial("cimento");
    Geometry.drawMesh(treadMesh, useTopTexture);
    pop();

    // Frente do degrau
    const frontThickness = 14;
    let fx0, fx1;

    if (leftSide) {
      fx0 = xFront - frontThickness;
      fx1 = xFront + 2;
    } else {
      fx0 = xFront - 2;
      fx1 = xFront + frontThickness;
    }

    const frontMesh = makeStandBlockMesh(
      Math.min(fx0, fx1),
      Math.max(fx0, fx1),
      topY,
      bottomY,
      zStart,
      zEnd,
    );

    push();
    const useFrontTexture = applyMaterial("cimento");
    Geometry.drawMesh(frontMesh, useFrontTexture);
    pop();

    // Fila de bancos do nível atual
    drawSimpleSeatRowOnStand(leftSide, xFront, topY, zStart, zEnd);
  }

  // Fecha as extremidades da bancada
  drawStandSideClosure(leftSide, zStart, zEnd);
}

// ------------------------------------------------------------
// BANCADA TRASEIRA
// ------------------------------------------------------------

// A bancada atrás da baliza segue a mesma lógica,
// mas a progressão faz-se em profundidade no eixo Z.
function drawBackStands() {
  const levels = Scene.stands.backLevels;
  const stepHeight = Scene.stands.backStepHeight;
  const stepDepth = Scene.stands.backStepDepth;

  const zFront = Scene.pitch.goalLineZ - Scene.stands.backGapFromGoal;
  const x0 = getStandOuterX(true);
  const x1 = getStandOuterX(false);

  for (let i = 0; i < levels; i++) {
    const topY = Scene.floorY - (i + 1) * stepHeight;
    const bottomY = Scene.floorY - i * stepHeight;

    const z0 = zFront - i * stepDepth;
    const z1 = zFront - (i + 1) * stepDepth;

    const bodyMesh = makeStandBlockMesh(x0, x1, topY + 22, bottomY, z1, z0);

    push();
    const useTexture1 = applyMaterial("cimento");
    Geometry.drawMesh(bodyMesh, useTexture1);
    pop();

    const topMesh = makeStandBlockMesh(x0, x1, topY, topY + 22, z1, z0);

    push();
    const useTexture2 = applyMaterial("cimento");
    Geometry.drawMesh(topMesh, useTexture2);
    pop();

    const frontMesh = makeStandBlockMesh(
      x0,
      x1,
      topY,
      bottomY,
      z0 - 2,
      z0 + 12,
    );

    push();
    const useTexture3 = applyMaterial("cimento");
    Geometry.drawMesh(frontMesh, useTexture3);
    pop();

    drawSimpleBackSeatRow(topY, z0, x0, x1);
  }
}

// ------------------------------------------------------------
// FILAS DE BANCOS LATERAIS
// ------------------------------------------------------------

// Calcula automaticamente quantos bancos cabem numa fila
// lateral e distribui-os ao longo da bancada.
function drawSimpleSeatRowOnStand(leftSide, xFront, topY, zStart, zEnd) {
  const cfg = Scene.stands;

  const seatPitch = cfg.seatWidth + cfg.seatGap;
  const usableZ0 = zStart + cfg.seatRowInset;
  const usableZ1 = zEnd - cfg.seatRowInset;

  let count = Math.floor((usableZ1 - usableZ0) / seatPitch);
  count = Math.max(0, Math.min(count, cfg.maxSeatsPerSideRow));

  if (count <= 0) return;

  const totalLen = (count - 1) * seatPitch;
  const startZ = (usableZ0 + usableZ1) * 0.5 - totalLen * 0.5;

  const rowX = leftSide
    ? xFront - cfg.treadDepth * 0.55
    : xFront + cfg.treadDepth * 0.55;

  const seatY = topY - cfg.seatHeight * 0.5 - 8;

  for (let i = 0; i < count; i++) {
    const z = startZ + i * seatPitch;

    const seatMatrix = Mat4.compose(Mat4.translation(rowX, seatY, z));

    drawSceneMesh(sceneMeshes.stadiumSeatSimple, seatMatrix, "seat");
  }
}

// ------------------------------------------------------------
// FILA DE BANCOS DA BANCADA TRASEIRA
// ------------------------------------------------------------
function drawSimpleBackSeatRow(topY, zFront, x0, x1) {
  const cfg = Scene.stands;

  const seatPitch = cfg.seatWidth + cfg.seatGap;
  const usableX0 = x0 + cfg.seatRowInset;
  const usableX1 = x1 - cfg.seatRowInset;

  let count = Math.floor((usableX1 - usableX0) / seatPitch);
  count = Math.max(0, Math.min(count, cfg.maxSeatsBackRow));

  if (count <= 0) return;

  const totalLen = (count - 1) * seatPitch;
  const startX = (usableX0 + usableX1) * 0.5 - totalLen * 0.5;

  const z = zFront - cfg.treadDepth * 0.45;
  const seatY = topY - cfg.seatHeight * 0.5 - 8;

  for (let i = 0; i < count; i++) {
    const x = startX + i * seatPitch;

    const seatMatrix = Mat4.compose(Mat4.translation(x, seatY, z));

    drawSceneMesh(sceneMeshes.stadiumSeatSimple, seatMatrix, "seat");
  }
}

// ------------------------------------------------------------
// FECHOS LATERAIS DAS BANCADAS
// ------------------------------------------------------------

// Esta função fecha as laterais com quads triangulados,
// evitando que a estrutura fique "aberta" nas extremidades.
function drawStandSideClosure(leftSide, zStart, zEnd) {
  const levels = Scene.stands.levels;
  const stepHeight = Scene.stands.stepHeight;
  const treadDepth = Scene.stands.treadDepth;
  const xFrontBase = getStandInnerX(leftSide);

  for (const z of [zStart, zEnd]) {
    for (let i = 0; i < levels; i++) {
      const topY = Scene.floorY - (i + 1) * stepHeight;
      const bottomY = Scene.floorY - i * stepHeight;

      const xFront = leftSide
        ? xFrontBase - i * treadDepth
        : xFrontBase + i * treadDepth;

      const xBack = leftSide
        ? xFrontBase - levels * treadDepth
        : xFrontBase + levels * treadDepth;

      const a = [xFront, topY, z];
      const b = [xBack, topY, z];
      const c = [xBack, bottomY, z];
      const d = [xFront, bottomY, z];

      const sideMesh = makeQuadMesh(a, b, c, d, 3, 2);

      push();
      const useTexture = applyMaterial("cimento");
      Geometry.drawMesh(sideMesh, useTexture);
      pop();
    }
  }
}

// ------------------------------------------------------------
// QUAD TRIANGULADO
// ------------------------------------------------------------

// Gera manualmente um quadrilátero dividido em dois triângulos.
// Esta abordagem está de acordo com o requisito do projeto de
// usar triangulação explícita.
function makeQuadMesh(a, b, c, d, uvScaleX = 1, uvScaleY = 1) {
  return Mesh.create(
    [a, b, c, d],
    [
      [0, 1, 2],
      [0, 2, 3],
    ],
    [
      [0, 0],
      [uvScaleX, 0],
      [uvScaleX, uvScaleY],
      [0, uvScaleY],
    ],
  );
}

// ------------------------------------------------------------
// BLOCO 3D DA BANCADA
// ------------------------------------------------------------
// Nao foram usados mais bancos para nao crashar o programa, ja estava muito pesado
// Esta funcao gera um paralelepípedo com UVs simples.
// É a base geométrica usada para degraus, frentes e patamares.
function makeStandBlockMesh(x0, x1, yTop, yBottom, z0, z1) {
  const dx = Math.abs(x1 - x0);
  const dz = Math.abs(z1 - z0);

  // Escala UV proporcional ao tamanho do bloco
  // para reduzir deformação da textura.
  const ux = Math.max(1, dx / 220);
  const uz = Math.max(1, dz / 220);

  return Mesh.create(
    [
      [x0, yTop, z0],
      [x1, yTop, z0],
      [x1, yTop, z1],
      [x0, yTop, z1],

      [x0, yBottom, z0],
      [x1, yBottom, z0],
      [x1, yBottom, z1],
      [x0, yBottom, z1],
    ],
    [
      [0, 1, 2],
      [0, 2, 3],
      [4, 7, 6],
      [4, 6, 5],
      [0, 4, 5],
      [0, 5, 1],
      [3, 2, 6],
      [3, 6, 7],
      [0, 3, 7],
      [0, 7, 4],
      [1, 5, 6],
      [1, 6, 2],
    ],
    [
      [0, 0],
      [ux, 0],
      [ux, uz],
      [0, uz],
      [0, 0],
      [ux, 0],
      [ux, uz],
      [0, uz],
    ],
  );
}
