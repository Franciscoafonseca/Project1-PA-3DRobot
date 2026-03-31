// ------------------------------------------------------------
// POSIÇÃO DOS HOLOFOTES
// ------------------------------------------------------------
function getFloodlightRigPositions() {
  const halfField = getPitchHalfWidth();
  const z = Scene.pitch.goalLineZ - Scene.floodlights.zBehindGoalLine;
  const yTop = Scene.floorY - Scene.floodlights.poleHeight;

  const leftX = -halfField + Scene.floodlights.sideInsetFromSideline;
  const rightX = halfField - Scene.floodlights.sideInsetFromSideline;

  return [
    [leftX, yTop, z],
    [rightX, yTop, z],
  ];
}

// ------------------------------------------------------------
// ALVO DO HOLOFOTE
// ------------------------------------------------------------
// Se ativado, segue o robot
function getFloodlightTarget() {
  if (robot && Scene.spotlightFollowRobot) {
    return [robot.pos[0], robot.pos[1] + 120, robot.pos[2]];
  }

  return [0, Scene.floorY - 40, 0];
}

// ------------------------------------------------------------
// CONFIGURAÇÃO DAS LUZES
// ------------------------------------------------------------
function setupSceneLights() {
  // luz ambiente (base)
  ambientLight(78, 78, 84);

  // luz direcional (simula luz distante)
  directionalLight(150, 160, 175, -0.22, -1.0, -0.18);
  directionalLight(120, 128, 140, 0.35, -0.55, 0.22);

  if (!Scene.floodlights.enabled) return;

  const target = getFloodlightTarget();
  const rigs = getFloodlightRigPositions();

  // holofotes (spotlights)
  for (const rig of rigs) {
    const pos = [rig[0], rig[1], rig[2]];
    const dir = Vec3.normalize(Vec3.sub(target, pos));

    spotLight(
      255,
      248,
      235,
      pos[0],
      pos[1],
      pos[2],
      dir[0],
      dir[1],
      dir[2],
      Scene.floodlights.coneAngle,
      Scene.floodlights.concentration,
    );
  }

  // luz adicional global
  pointLight(110, 115, 125, 0, Scene.floorY - 700, 200);
}

// ------------------------------------------------------------
// DESENHO DOS POSTES E PAINÉIS DE LUZ
// ------------------------------------------------------------
function drawFloodlightRigs() {
  const rigs = getFloodlightRigPositions();
  const target = getFloodlightTarget();

  stroke(185, 185, 190);
  strokeWeight(10);

  for (const rig of rigs) {
    const [x, yTop, z] = rig;

    // Poste principal
    line(x, Scene.floorY, z, x, yTop + 70, z);

    // Rotação horizontal do painel na direção do alvo
    const dx = target[0] - x;
    const dz = target[2] - z;
    const yaw = Math.atan2(dx, dz) + Scene.floodlights.panelYawBias;

    drawFloodlightPanel(x, yTop, z, yaw);
  }

  noStroke();
}

// ------------------------------------------------------------
// DESENHO DO PAINEL DE HOLOFOTES
// ------------------------------------------------------------
function drawFloodlightPanel(x, y, z, yaw = 0) {
  const target = getFloodlightTarget();
  const dx = target[0] - x;
  const dy = target[1] - y;
  const dz = target[2] - z;

  // Inclinação vertical do painel
  const horiz = Math.sqrt(dx * dx + dz * dz);
  const pitch = -Math.atan2(dy, horiz);

  const frame = Mat4.compose(
    Mat4.translation(x, y, z),
    Mat4.rotateY(yaw),
    Mat4.rotateX(pitch),
  );

  drawSceneMesh(sceneMeshes.floodlightFrame, frame, "floodlight_body");

  const cols = 8;
  const rows = 5;
  const spacingX = 48;
  const spacingY = 38;

  const startX = -((cols - 1) * spacingX) * 0.5;
  const startY = -((rows - 1) * spacingY) * 0.5;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const lx = startX + col * spacingX;
      const ly = startY + row * spacingY;

      const lampMatrix = Mat4.compose(
        Mat4.translation(x, y, z),
        Mat4.rotateY(yaw),
        Mat4.rotateX(pitch),
        Mat4.translation(lx, ly, 28),
        Mat4.rotateX(Math.PI / 2),
      );

      drawSceneMesh(sceneMeshes.floodlightLamp, lampMatrix, "floodlight_led");
    }
  }
}
