// js/scene.js
// ============================================================
// SCENE SETUP
// Configuração global, câmara, helpers gerais e draw principal.
// ============================================================

const Scene = {
  camera: {
    yaw: 0,
    pitch: -0.72,
    distance: 1850,
    targetHeight: 0,
  },

  spotlightFollowRobot: true,

  floorY: 220,

  pitch: {
    width: 9800,
    nearZ: 5200,
    goalLineZ: -1700,

    sideGrassMargin: 1400,
    backGrassMargin: 900,

    penaltyBoxWidth: 5500,
    penaltyBoxDepth: 2200,

    goalBoxWidth: 3000,
    goalBoxDepth: 900,

    grassUVX: 32,
    grassUVZ: 40,
  },

  goal: {
    postHalfWidth: 1000,
    height: 600,
    depth: 420,
    backInset: 140,
    frameStroke: 18,
    netStroke: 1.5,
  },

  stands: {
    fieldGap: 260,
    levels: 6,
    zStart: -3400,
    zEnd: 3600,

    stepHeight: 180,
    treadDepth: 320,

    lipThickness: 10,
    lipInset: 2,

    backLevels: 6,
    backStepHeight: 180,
    backStepDepth: 320,

    backGapFromGoal: 850,

    // Bancos simplificados: um único bloco por assento
    seatRowInset: 220,
    seatWidth: 120,
    seatGap: 180,
    seatDepth: 70,
    seatHeight: 26,
    maxSeatsPerSideRow: 8,
    maxSeatsBackRow: 12,
  },

  floodlights: {
    enabled: true,

    poleHeight: 1500,
    sideInsetFromSideline: 950,
    zBehindGoalLine: 380,
    panelYawBias: 0.0,

    coneAngle: Math.PI / 6.2,
    concentration: 90,

    targetHeightOffset: -40,
  },

  backdrop: {
    extraWidth: 2200,
    z: -3000,
    topY: -1700,
    bottomY: 650,
  },

  shadow: {
    rx: 58,
    rz: 34,
    alpha: 55,
    zOffset: 8,
    yOffset: -1.2,
  },
};

let sceneMeshes = null;

// ============================================================
// INIT
// ============================================================

function initScene() {
  sceneMeshes = {
    floodlightFrame: Geometry.makeBox(420, 220, 44),
    floodlightLamp: Geometry.makeCylinder(18, 24, 18),
    cornerFlagPole: Geometry.makeCylinder(4, 240, 14),

    // Banco simplificado: apenas um bloco pequeno.
    stadiumSeatSimple: Geometry.makeBox(120, 26, 70),
  };

  snapRobotToGround();
}

function snapRobotToGround() {
  if (!robot) return;

  const feetOffset = 241;
  robot.pos[1] = Scene.floorY - feetOffset;
}

// ============================================================
// HELPERS GERAIS
// ============================================================

function getPitchHalfWidth() {
  return Scene.pitch.width * 0.5;
}

function getGrassHalfWidth() {
  return getPitchHalfWidth() + Scene.pitch.sideGrassMargin;
}

function getGrassBackZ() {
  return Scene.pitch.goalLineZ - Scene.pitch.backGrassMargin;
}

function getStandInnerX(leftSide) {
  const sign = leftSide ? -1 : 1;
  return sign * (getPitchHalfWidth() + Scene.stands.fieldGap);
}

function getStandOuterX(leftSide) {
  const sign = leftSide ? -1 : 1;
  const totalDepth = Scene.stands.levels * Scene.stands.treadDepth;
  return getStandInnerX(leftSide) + sign * totalDepth;
}

// ============================================================
// CÂMARA
// ============================================================

function setupSceneCamera() {
  const target = [
    robot.pos[0],
    robot.pos[1] + Scene.camera.targetHeight,
    robot.pos[2],
  ];

  const cx =
    target[0] +
    Math.sin(Scene.camera.yaw) *
      Math.cos(Scene.camera.pitch) *
      Scene.camera.distance;

  const cy = target[1] + Math.sin(Scene.camera.pitch) * Scene.camera.distance;

  const cz =
    target[2] +
    Math.cos(Scene.camera.yaw) *
      Math.cos(Scene.camera.pitch) *
      Scene.camera.distance;

  camera(cx, cy, cz, target[0], target[1], target[2], 0, 1, 0);
  perspective(PI / 3.2, width / height, 1, 7000);
}

// ============================================================
// DRAW PRINCIPAL
// ============================================================

function drawScene() {
  drawSideStands();
  drawBackStands();

  drawPitchHalf();
  drawPenaltyAreaLines();
  drawGoal();
  drawCornerFlags();

  if (Scene.floodlights.enabled) {
    drawFloodlightRigs();
  }

  drawRobotFakeShadow();
}

// ============================================================
// SOMBRA
// ============================================================

function drawRobotFakeShadow() {
  if (!robot) return;

  const shadowY = Scene.floorY + Scene.shadow.yOffset;
  const x = robot.pos[0];
  const z = robot.pos[2] + Scene.shadow.zOffset;

  push();
  noStroke();
  fill(0, 0, 0, Scene.shadow.alpha);

  beginShape();
  for (let i = 0; i < 40; i++) {
    const a = (TWO_PI * i) / 40;
    vertex(
      x + Math.cos(a) * Scene.shadow.rx,
      shadowY,
      z + Math.sin(a) * Scene.shadow.rz,
    );
  }
  endShape(CLOSE);
  pop();
}

// ============================================================
// DRAW DE MESHES
// ============================================================

function drawSceneMesh(mesh, matrix, materialType = "stadium") {
  const worldMesh = Mesh.transformed(mesh, matrix);

  push();
  const useTexture = applyMaterial(materialType);
  Geometry.drawMesh(worldMesh, useTexture);
  pop();
}
