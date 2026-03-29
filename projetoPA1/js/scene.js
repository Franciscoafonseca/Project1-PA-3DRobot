// js/scene.js
// ============================================================
// SCENE SETUP
// ============================================================

const Scene = {
  camera: {
    yaw: -0.42,
    pitch: -0.18,
    distance: 760,
    targetHeight: 35,
  },

  spotlightFollowRobot: false,

  floorY: 220,

  pitchHalfW: 900,
  pitchHalfD: 1200,
};

let sceneMeshes = null;

function initScene() {
  sceneMeshes = {
    floodlightFrame: Geometry.makeBox(120, 70, 26),
    floodlightLamp: Geometry.makeCylinder(8, 10, 16),
  };

  snapRobotToGround();
}

function snapRobotToGround() {
  if (!robot) return;

  // calibrado ao modelo atual
  const feetOffset = 241;
  robot.pos[1] = Scene.floorY - feetOffset;
}

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
  perspective(PI / 3.2, width / height, 1, 5000);
}
function setupSceneLights() {
  ambientLight(24, 24, 28);

  directionalLight(150, 160, 180, -0.25, -1.0, -0.15);
  directionalLight(65, 75, 95, 0.45, -0.35, 0.2);

  const target = [0, Scene.floorY - 20, -930];

  const floodlights = [
    [-900, -260, -700],
    [900, -260, -700],
  ];

  for (const pos of floodlights) {
    const dir = Vec3.normalize(Vec3.sub(target, pos));

    spotLight(
      255,
      246,
      230,
      pos[0],
      pos[1],
      pos[2],
      dir[0],
      dir[1],
      dir[2],
      PI / 8,
      45,
    );
  }
}
function drawScene() {
  drawSkyBackdrop();
  drawSideStands();
  drawPitchHalf();
  drawPenaltyAreaLines();
  drawGoal();
  drawFloodlightRigs();
  drawRobotFakeShadow();
}
function drawRobotFakeShadow() {
  if (!robot) return;

  const shadowY = Scene.floorY - 1.2;
  const x = robot.pos[0];
  const z = robot.pos[2] + 8;

  push();
  noStroke();
  fill(0, 0, 0, 55);

  beginShape();
  for (let i = 0; i < 40; i++) {
    const a = (TWO_PI * i) / 40;
    const rx = 58;
    const rz = 34;
    vertex(x + Math.cos(a) * rx, shadowY, z + Math.sin(a) * rz);
  }
  endShape(CLOSE);

  pop();
}

function drawSceneMesh(mesh, matrix, materialType = "stadium") {
  const worldMesh = Mesh.transformed(mesh, matrix);
  push();
  const useTexture = applyMaterial(materialType);
  Geometry.drawMesh(worldMesh, useTexture);
  pop();
}
function drawPitchHalf() {
  const halfW = 1100;
  const halfD = 1450;
  const y = Scene.floorY;

  const pitchMesh = Mesh.create(
    [
      [-halfW, y, -halfD],
      [halfW, y, -halfD],
      [halfW, y, 650],
      [-halfW, y, 650],
    ],
    [
      [0, 1, 2],
      [0, 2, 3],
    ],
    [
      [0, 0],
      [10, 0],
      [10, 16],
      [0, 16],
    ],
  );

  push();
  const useTexture = applyMaterial("grass");
  Geometry.drawMesh(pitchMesh, useTexture);
  pop();
}
function drawPenaltyAreaLines() {
  const y = Scene.floorY - 0.6;

  const halfW = 980;
  const endZ = -1100;

  stroke(245, 245, 245);
  strokeWeight(3);

  // linhas laterais visíveis
  line(-halfW, y, 560, -halfW, y, endZ);
  line(halfW, y, 560, halfW, y, endZ);

  // linha de fundo
  line(-halfW, y, endZ, halfW, y, endZ);

  // grande área
  drawGroundRectFromBack(y, 0, endZ + 300, 860, 300);

  // pequena área
  drawGroundRectFromBack(y, 0, endZ + 120, 420, 120);

  // marca de penálti
  drawGroundCircle(0, y, endZ + 420, 5, 20);

  // arco da área, centrado na marca de penálti
  drawGroundArc(0, y, endZ + 420, 145, PI * 0.14, PI * 0.86, 40);

  noStroke();
}

function drawGroundRectFromBack(y, cx, czFront, width, depth) {
  const hw = width * 0.5;
  const z0 = czFront - depth;
  const z1 = czFront;

  line(cx - hw, y, z0, cx + hw, y, z0);
  line(cx - hw, y, z1, cx + hw, y, z1);
  line(cx - hw, y, z0, cx - hw, y, z1);
  line(cx + hw, y, z0, cx + hw, y, z1);
}

function drawGroundArc(cx, y, cz, radius, a0, a1, segments = 32) {
  for (let i = 0; i < segments; i++) {
    const t0 = i / segments;
    const t1 = (i + 1) / segments;

    const ang0 = lerp(a0, a1, t0);
    const ang1 = lerp(a0, a1, t1);

    const x0 = cx + Math.cos(ang0) * radius;
    const z0 = cz + Math.sin(ang0) * radius;
    const x1 = cx + Math.cos(ang1) * radius;
    const z1 = cz + Math.sin(ang1) * radius;

    line(x0, y, z0, x1, y, z1);
  }
}

function drawGroundRect(y, cx, cz, width, depth) {
  const hw = width * 0.5;
  const hd = depth * 0.5;

  line(cx - hw, y, cz - hd, cx + hw, y, cz - hd);
  line(cx + hw, y, cz - hd, cx + hw, y, cz + hd);
  line(cx + hw, y, cz + hd, cx - hw, y, cz + hd);
  line(cx - hw, y, cz + hd, cx - hw, y, cz - hd);
}

function drawGroundCircle(cx, y, cz, radius, segments = 48) {
  for (let i = 0; i < segments; i++) {
    const a0 = (TWO_PI * i) / segments;
    const a1 = (TWO_PI * (i + 1)) / segments;

    const x0 = cx + Math.cos(a0) * radius;
    const z0 = cz + Math.sin(a0) * radius;
    const x1 = cx + Math.cos(a1) * radius;
    const z1 = cz + Math.sin(a1) * radius;

    line(x0, y, z0, x1, y, z1);
  }
}
function drawSkyBackdrop() {
  const wallMesh = Mesh.create(
    [
      [-1800, -1000, -2100],
      [1800, -1000, -2100],
      [1800, 320, -2100],
      [-1800, 320, -2100],
    ],
    [
      [0, 1, 2],
      [0, 2, 3],
    ],
    [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
    ],
  );

  push();
  const useTexture = applyMaterial("skywall");
  Geometry.drawMesh(wallMesh, useTexture);
  pop();
}

function drawStands() {
  const leftWall = Mesh.create(
    [
      [-1100, -600, -1200],
      [-900, -600, -1200],
      [-900, 260, 1200],
      [-1100, 260, 1200],
    ],
    [
      [0, 1, 2],
      [0, 2, 3],
    ],
    [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
    ],
  );

  const rightWall = Mesh.create(
    [
      [900, -600, -1200],
      [1100, -600, -1200],
      [1100, 260, 1200],
      [900, 260, 1200],
    ],
    [
      [0, 1, 2],
      [0, 2, 3],
    ],
    [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
    ],
  );

  push();
  let useTexture = applyMaterial("stadium");
  Geometry.drawMesh(leftWall, useTexture);
  Geometry.drawMesh(rightWall, useTexture);
  pop();
}
function drawFloodlightRigs() {
  const rigs = [
    [-900, -260, -700, 0.55],
    [900, -260, -700, -0.55],
  ];

  stroke(185, 185, 190);
  strokeWeight(5);

  for (const rig of rigs) {
    const [x, y, z, yaw] = rig;

    line(x, Scene.floorY, z, x, y + 40, z);
    drawFloodlightPanel(x, y, z, yaw);
  }

  noStroke();
}

function drawFloodlightPanel(x, y, z, yaw = 0) {
  const frame = Mat4.compose(Mat4.translation(x, y, z), Mat4.rotateY(yaw));
  drawSceneMesh(sceneMeshes.floodlightFrame, frame, "floodlight_body");

  const cols = 4;
  const rows = 3;
  const spacingX = 24;
  const spacingY = 20;

  const startX = -((cols - 1) * spacingX) * 0.5;
  const startY = -((rows - 1) * spacingY) * 0.5;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const lx = startX + col * spacingX;
      const ly = startY + row * spacingY;

      const lampMatrix = Mat4.compose(
        Mat4.translation(x, y, z),
        Mat4.rotateY(yaw),
        Mat4.translation(lx, ly, -15),
        Mat4.rotateX(Math.PI / 2),
      );

      drawSceneMesh(sceneMeshes.floodlightLamp, lampMatrix, "floodlight_led");
    }
  }
}
function drawGoal() {
  const goalZ = -1100;
  const y = Scene.floorY;

  const postHalfWidth = 320;
  const goalHeight = 240;
  const goalDepth = 150;
  const backSpread = 90;

  stroke(248, 248, 248);
  strokeWeight(7);

  // frente
  line(-postHalfWidth, y, goalZ, -postHalfWidth, y - goalHeight, goalZ);
  line(postHalfWidth, y, goalZ, postHalfWidth, y - goalHeight, goalZ);
  line(
    -postHalfWidth,
    y - goalHeight,
    goalZ,
    postHalfWidth,
    y - goalHeight,
    goalZ,
  );

  // profundidade
  line(
    -postHalfWidth,
    y,
    goalZ,
    -postHalfWidth - backSpread,
    y,
    goalZ - goalDepth,
  );
  line(
    postHalfWidth,
    y,
    goalZ,
    postHalfWidth + backSpread,
    y,
    goalZ - goalDepth,
  );

  line(
    -postHalfWidth,
    y - goalHeight,
    goalZ,
    -postHalfWidth - backSpread,
    y - goalHeight,
    goalZ - goalDepth,
  );
  line(
    postHalfWidth,
    y - goalHeight,
    goalZ,
    postHalfWidth + backSpread,
    y - goalHeight,
    goalZ - goalDepth,
  );

  // trás
  line(
    -postHalfWidth - backSpread,
    y,
    goalZ - goalDepth,
    -postHalfWidth - backSpread,
    y - goalHeight,
    goalZ - goalDepth,
  );
  line(
    postHalfWidth + backSpread,
    y,
    goalZ - goalDepth,
    postHalfWidth + backSpread,
    y - goalHeight,
    goalZ - goalDepth,
  );
  line(
    -postHalfWidth - backSpread,
    y - goalHeight,
    goalZ - goalDepth,
    postHalfWidth + backSpread,
    y - goalHeight,
    goalZ - goalDepth,
  );

  // rede
  strokeWeight(1.5);
  stroke(230, 230, 230, 110);

  for (let i = 0; i <= 10; i++) {
    const xFront = lerp(-postHalfWidth, postHalfWidth, i / 10);
    const xBack = lerp(
      -postHalfWidth - backSpread,
      postHalfWidth + backSpread,
      i / 10,
    );

    line(xFront, y, goalZ, xBack, y, goalZ - goalDepth);
    line(
      xFront,
      y - goalHeight,
      goalZ,
      xBack,
      y - goalHeight,
      goalZ - goalDepth,
    );
    line(xFront, y, goalZ, xFront, y - goalHeight, goalZ);
  }

  for (let j = 0; j <= 8; j++) {
    const yy = lerp(y, y - goalHeight, j / 8);
    line(-postHalfWidth, yy, goalZ, postHalfWidth, yy, goalZ);
    line(
      -postHalfWidth - backSpread,
      yy,
      goalZ - goalDepth,
      postHalfWidth + backSpread,
      yy,
      goalZ - goalDepth,
    );
  }

  noStroke();
}

function drawSideStands() {
  drawStandBlock(-1180, -980, 420, 420, 5, true);
  drawStandBlock(1180, -980, 420, 420, 5, false);
  drawBackStand();
}

function drawStandBlock(xCenter, zStart, width, depthStep, levels, leftSide) {
  for (let i = 0; i < levels; i++) {
    const yTop = Scene.floorY - i * 36;
    const z0 = zStart - i * depthStep * 0.42;
    const z1 = z0 - depthStep;

    const x0 = leftSide ? xCenter - width : xCenter;
    const x1 = leftSide ? xCenter : xCenter + width;

    const standMesh = Mesh.create(
      [
        [x0, yTop, z0],
        [x1, yTop, z0],
        [x1, yTop, z1],
        [x0, yTop, z1],
      ],
      [
        [0, 1, 2],
        [0, 2, 3],
      ],
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
      ],
    );

    push();
    const useTexture = applyMaterial("stand");
    Geometry.drawMesh(standMesh, useTexture);
    pop();
  }
}

function drawBackStand() {
  for (let i = 0; i < 6; i++) {
    const yTop = Scene.floorY - i * 42;
    const z0 = -1380 - i * 70;
    const z1 = z0 - 150;
    const x0 = -1050;
    const x1 = 1050;

    const standMesh = Mesh.create(
      [
        [x0, yTop, z0],
        [x1, yTop, z0],
        [x1, yTop, z1],
        [x0, yTop, z1],
      ],
      [
        [0, 1, 2],
        [0, 2, 3],
      ],
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
      ],
    );

    push();
    const useTexture = applyMaterial("stand");
    Geometry.drawMesh(standMesh, useTexture);
    pop();
  }
}
