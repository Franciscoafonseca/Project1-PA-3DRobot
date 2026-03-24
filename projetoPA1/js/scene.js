// js/scene.js
// ============================================================
// SCENE SETUP
// ============================================================

const Scene = {
  camera: {
    yaw: -0.55,
    pitch: -0.18,
    distance: 620,
    targetHeight: 40,
  },

  spotlightFollowRobot: true,
};

function initScene() {}

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
  setupLighting();
}

function setupLighting() {
  ambientLight(8, 8, 12);

  directionalLight(255, 252, 240, -0.55, -1.0, -0.25);
  directionalLight(90, 120, 200, 0.6, -0.35, 0.2);

  const spotPos = Scene.spotlightFollowRobot
    ? [robot.pos[0], robot.pos[1] - 200, robot.pos[2] + 250]
    : [0, -250, 340];

  const spotTarget = Scene.spotlightFollowRobot
    ? [robot.pos[0], robot.pos[1] + 15, robot.pos[2]]
    : [0, 20, 0];

  const dir = Vec3.normalize(Vec3.sub(spotTarget, spotPos));

  spotLight(
    255,
    235,
    200,
    spotPos[0],
    spotPos[1],
    spotPos[2],
    dir[0],
    dir[1],
    dir[2],
    PI / 10,
    45,
  );
}

function drawScene() {
  drawBackgroundWall();
  drawFloor();
}

function drawFloor() {
  const size = 1400;
  const y = 220;

  const floorMesh = Mesh.create(
    [
      [-size, y, -size],
      [size, y, -size],
      [size, y, size],
      [-size, y, size],
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

  applyMaterial("floor");
  Geometry.drawMesh(floorMesh, false);

  drawFloorGrid(y, 700, 50);
}

function drawBackgroundWall() {
  const wallMesh = Mesh.create(
    [
      [-900, -500, -650],
      [900, -500, -650],
      [900, 350, -650],
      [-900, 350, -650],
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

  applyMaterial("wall");
  Geometry.drawMesh(wallMesh, false);
}

function drawFloorGrid(y = 220, size = 700, step = 50) {
  stroke(55, 60, 68);
  strokeWeight(1);

  for (let i = -size; i <= size; i += step) {
    line(i, y, -size, i, y, size);
    line(-size, y, i, size, y, i);
  }

  noStroke();
}
