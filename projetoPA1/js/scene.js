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

  ambientEnabled: true,
  sideSpotlightsEnabled: true,
  followSpotlightEnabled: true,
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
  if (Scene.ambientEnabled) {
    ambientLight(24, 24, 30);
  }

  if (Scene.sideSpotlightsEnabled) {
    const leftSpotPos = [-560, -280, 80];
    const rightSpotPos = [560, -280, -80];

    const leftTarget = [-80, 70, 120];
    const rightTarget = [80, 70, 120];

    const leftDir = Vec3.normalize(Vec3.sub(leftTarget, leftSpotPos));
    const rightDir = Vec3.normalize(Vec3.sub(rightTarget, rightSpotPos));

    spotLight(
      160,
      170,
      235,
      leftSpotPos[0],
      leftSpotPos[1],
      leftSpotPos[2],
      leftDir[0],
      leftDir[1],
      leftDir[2],
      PI / 7,
      34,
    );

    spotLight(
      235,
      195,
      165,
      rightSpotPos[0],
      rightSpotPos[1],
      rightSpotPos[2],
      rightDir[0],
      rightDir[1],
      rightDir[2],
      PI / 7,
      34,
    );
  }

  const robotPos = robot ? robot.pos : [0, 0, 0];
  const robotYaw = robot ? robot.yaw : 0;
  const forward = [Math.sin(robotYaw), 0, Math.cos(robotYaw)];
  const right = [Math.cos(robotYaw), 0, -Math.sin(robotYaw)];

  if (!Scene.followSpotlightEnabled) return;

  const spotPos = Scene.spotlightFollowRobot
    ? [
        robotPos[0] - forward[0] * 200 + right[0] * 95,
        robotPos[1] - 230,
        robotPos[2] - forward[2] * 200 + right[2] * 95,
      ]
    : [0, -250, 340];

  const kickTarget =
    robot && robot.kickActive
      ? getFootWorldPosition(robot.kickingLeg || "right")
      : null;

  const spotTarget = kickTarget
    ? [kickTarget[0], kickTarget[1] - 8, kickTarget[2]]
    : Scene.spotlightFollowRobot
      ? [
          robotPos[0] + forward[0] * 120,
          robotPos[1] - 20,
          robotPos[2] + forward[2] * 120,
        ]
      : [0, 20, 0];

  const dir = Vec3.normalize(Vec3.sub(spotTarget, spotPos));

  const spotColor = robot && robot.kickActive ? [255, 245, 215] : [255, 235, 200];
  const spotCone = robot && robot.kickActive ? PI / 14 : PI / 10;
  const spotConcentration = robot && robot.kickActive ? 85 : 45;

  spotLight(
    spotColor[0],
    spotColor[1],
    spotColor[2],
    spotPos[0],
    spotPos[1],
    spotPos[2],
    dir[0],
    dir[1],
    dir[2],
    spotCone,
    spotConcentration,
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
