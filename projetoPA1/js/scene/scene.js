// ------------------------------------------------------------
// CONFIGURAÇÃO GLOBAL DA CENA
// ------------------------------------------------------------
// O objeto Scene funciona como um ponto único de configuração.
// Desta forma, torna-se mais fácil ajustar proporções, distâncias,
// alturas e comportamento visual sem espalhar valores pelo código.
const Scene = {
  camera: {
    yaw: 0,
    pitch: -0.72,
    distance: 1850,
    targetHeight: 0,
  },

  // Quando verdadeiro, os holofotes acompanham o robot.
  // Isto ajuda a demonstrar interatividade e relação entre
  // movimento e iluminação, como pedido no projeto.
  spotlightFollowRobot: true,

  // Altura do "chao" da cena
  floorY: 220,

  // ----------------------------------------------------------
  // CONFIGURAÇÃO DO CAMPO
  // ----------------------------------------------------------
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

    // Escala UV usada para repetir a textura da relva
    grassUVX: 32,
    grassUVZ: 40,
  },

  // ----------------------------------------------------------
  // CONFIGURAÇÃO DA BALIZA
  // ----------------------------------------------------------
  goal: {
    postHalfWidth: 1000,
    height: 600,
    depth: 420,
    backInset: 140,
    frameStroke: 18,
    netStroke: 1.5,
  },

  // ----------------------------------------------------------
  // CONFIGURAÇÃO DAS BANCADAS
  // ----------------------------------------------------------
  stands: {
    fieldGap: 260,
    levels: 6,
    zStart: -3400,
    zEnd: 5000,

    stepHeight: 180,
    treadDepth: 320,

    lipThickness: 10,
    lipInset: 2,

    backLevels: 6,
    backStepHeight: 180,
    backStepDepth: 320,

    backGapFromGoal: 850,

    // Bancos simplificados para manter a cena leve, mas visualmente coerente
    seatRowInset: 220,
    seatWidth: 120,
    seatGap: 180,
    seatDepth: 70,
    seatHeight: 26,
    maxSeatsPerSideRow: 8,
    maxSeatsBackRow: 12,
  },

  // ----------------------------------------------------------
  // CONFIGURAÇÃO DOS HOLOFOTES
  // ----------------------------------------------------------
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

  // ----------------------------------------------------------
  // FUNDO DA CENA
  // ----------------------------------------------------------
  backdrop: {
    extraWidth: 2200,
    z: -3000,
    topY: -1700,
    bottomY: 650,
  },

  // ----------------------------------------------------------
  // SOMBRA FALSA DO ROBOT
  // ----------------------------------------------------------
  // Em vez de calcular sombras reais, usa-se uma elipse simples
  // no chão, o que melhora a perceção de contacto com o solo.
  shadow: {
    rx: 58,
    rz: 34,
    alpha: 55,
    zOffset: 8,
    yOffset: -1.2,
  },
};

// Meshes auxiliares da cena.
// São inicializados uma vez e reutilizados durante o desenho.
let sceneMeshes = null;

// ============================================================
// INICIALIZAÇÃO
// ============================================================

// Esta função cria os meshes necessários à cena.
// Todos os meshes são construídos com geometria própria,
// respeitando a exigência do projeto de evitar primitivas
// de alto nível como box(), sphere(), etc.
function initScene() {
  sceneMeshes = {
    floodlightFrame: Geometry.makeBox(420, 220, 44),
    floodlightLamp: Geometry.makeCylinder(18, 24, 18),
    cornerFlagPole: Geometry.makeCylinder(4, 240, 14),

    // Banco simplificado: apenas um bloco.
    stadiumSeatSimple: Geometry.makeBox(120, 26, 70),
  };

  // Garante que o robot começa corretamente pousado no chão.
  snapRobotToGround();
}

// ------------------------------------------------------------
// ALINHAMENTO INICIAL DO ROBOT COM O CHÃO
// ------------------------------------------------------------
function snapRobotToGround() {
  if (!robot) return;

  // Valor ajustado de forma prática para alinhar os pés
  // do robot com a altura do piso da cena.
  const feetOffset = 241;
  robot.pos[1] = Scene.floorY - feetOffset;
}

// ============================================================
// HELPERS GERAIS
// ============================================================

// Metade da largura do campo
function getPitchHalfWidth() {
  return Scene.pitch.width * 0.5;
}

// Metade da largura total da relva, incluindo margens
function getGrassHalfWidth() {
  return getPitchHalfWidth() + Scene.pitch.sideGrassMargin;
}

// Posição traseira da relva
function getGrassBackZ() {
  return Scene.pitch.goalLineZ - Scene.pitch.backGrassMargin;
}

// Limite interior da bancada lateral
function getStandInnerX(leftSide) {
  const sign = leftSide ? -1 : 1;
  return sign * (getPitchHalfWidth() + Scene.stands.fieldGap);
}

// Limite exterior da bancada lateral
function getStandOuterX(leftSide) {
  const sign = leftSide ? -1 : 1;
  const totalDepth = Scene.stands.levels * Scene.stands.treadDepth;
  return getStandInnerX(leftSide) + sign * totalDepth;
}

// ============================================================
// CÂMARA
// ============================================================

// A câmara é calculada manualmente a partir de yaw, pitch e distância.
// O alvo da câmara é a posição atual do robot, permitindo que a vista
// acompanhe a personagem principal da cena.
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

  // Perspetiva da cena
  perspective(PI / 3.2, width / height, 1, 7000);
}

// ============================================================
// DESENHO PRINCIPAL DA CENA
// ============================================================
// Esta função agrupa o desenho dos principais elementos do estádio
// Mantém o draw principal mais organizado e facilita a separação
// entre robot e ambiente
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
// SOMBRA FALSA
// ============================================================

// Esta sombra é apenas uma aproximação visual
// Não pretende ser fisicamente correta, mas ajuda bastante
// a reforçar a perceção espacial e o contacto com o chão
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
// DESENHO GENÉRICO DE MESHES DA CENA
// ============================================================

// Esta função recebe:
// - o mesh local
// - a matriz de transformação
// - o tipo de material
//
// Depois transforma o mesh para coordenadas do mundo
// e desenha-o com o material respetivo.
function drawSceneMesh(mesh, matrix, materialType = "stadium") {
  const worldMesh = Mesh.transformed(mesh, matrix);

  push();
  const useTexture = applyMaterial(materialType);
  Geometry.drawMesh(worldMesh, useTexture);
  pop();
}
