// js/robot.js
// ============================================================
// FINAL ROBOT SYSTEM
// Humanoid football robot
// All transforms are done with custom matrices on CPU side
// ============================================================

// ------------------------------------------------------------
// GLOBAL ROBOT DATA
// ------------------------------------------------------------
let robot = null;
let robotMeshes = null;
let football = null;

// ------------------------------------------------------------
// INITIALIZATION
// ------------------------------------------------------------
function initRobot() {
  robot = {
    // world position
    pos: [0, -70, 0],
    yaw: 0,

    // upper body
    torsoLean: 0,
    headYaw: 0,
    headPitch: 0,

    // arms
    leftShoulder: -0.08,
    rightShoulder: 0.08,
    leftElbow: 0.28,
    rightElbow: -0.28,

    // legs
    leftHip: 0,
    rightHip: 0,
    leftKnee: 0,
    rightKnee: 0,

    // hands
    leftClaw: 0.2,
    rightClaw: 0.2,

    // animation
    moving: false,
    idle: true,
    walkPhase: 0,
    kickActive: false,
    kickPhase: 0,
    kickingLeg: "right",
  };

  football = {
    pos: [95, 170, 120],
    radius: 24,
    velocity: [0, 0, 0],
  };

  buildRobotMeshes();
}

function buildRobotMeshes() {
  robotMeshes = {
    torso: Geometry.makeTorso(132, 160, 86),
    torsoBack: Geometry.makeTrapezoidPrism(104, 126, 86, 38),
    pelvis: Geometry.makePelvis(80, 110, 44, 64),
    head: Geometry.makeHead(70, 86, 88, 76),
    neck: Geometry.makeCylinder(11, 24, 12),

    chestPanel: Geometry.makePanel(52, 30, 6, 0.16),
    facePanel: Geometry.makePanel(40, 18, 5, 0.14),
    kneePanel: Geometry.makePanel(24, 18, 5, 0.12),

    upperArm: Geometry.makeCylinder(17, 92, 10),
    foreArm: Geometry.makeCylinder(15, 86, 10),
    joint: Geometry.makeCylinder(13, 20, 12),

    thigh: Geometry.makeCylinder(20, 105, 10),
    shin: Geometry.makeCylinder(17, 100, 10),

    foot: Geometry.makeFoot(72, 24, 42),
    shoulderArmor: Geometry.makeShoulderArmor(42, 30, 42),
    clawFinger: Geometry.makeClawFinger(32, 12, 10),

    backpack: Geometry.makeBox(52, 84, 24),
    football: Geometry.makeFootball(football.radius),
  };
}

// ------------------------------------------------------------
// UPDATE
// ------------------------------------------------------------
function updateRobot() {
  if (!robot) return;

  applyIdleAnimation();
  applyWalkAnimation();
  updateKickAnimation();
  updateFootballPhysics();
}

function applyIdleAnimation() {
  if (robot.moving || robot.kickActive || !robot.idle) return;

  const t = millis() * 0.0016;

  robot.torsoLean = Math.sin(t * 1.5) * 0.02;
  robot.headPitch = Math.sin(t * 1.2) * 0.03;

  robot.leftShoulder = lerpValue(
    robot.leftShoulder,
    -0.06 + Math.sin(t) * 0.015,
    0.06,
  );
  robot.rightShoulder = lerpValue(
    robot.rightShoulder,
    0.06 - Math.sin(t) * 0.015,
    0.06,
  );

  robot.leftElbow = lerpValue(
    robot.leftElbow,
    0.28 + Math.sin(t * 1.3) * 0.02,
    0.05,
  );
  robot.rightElbow = lerpValue(
    robot.rightElbow,
    -0.28 - Math.sin(t * 1.3) * 0.02,
    0.05,
  );
}

function applyWalkAnimation() {
  if (!robot.moving || robot.kickActive) return;

  robot.walkPhase += 0.14;

  const swing = Math.sin(robot.walkPhase) * 0.42;
  const counter = Math.sin(robot.walkPhase + Math.PI) * 0.42;
  const bendA = Math.max(0, Math.sin(robot.walkPhase + 0.35)) * 0.42;
  const bendB = Math.max(0, Math.sin(robot.walkPhase + Math.PI + 0.35)) * 0.42;

  robot.leftHip = lerpValue(robot.leftHip, swing, 0.35);
  robot.rightHip = lerpValue(robot.rightHip, counter, 0.35);

  robot.leftShoulder = lerpValue(robot.leftShoulder, -swing * 0.8, 0.35);
  robot.rightShoulder = lerpValue(robot.rightShoulder, -counter * 0.8, 0.35);

  robot.leftKnee = lerpValue(robot.leftKnee, bendA, 0.35);
  robot.rightKnee = lerpValue(robot.rightKnee, -bendB, 0.35);

  robot.torsoLean = lerpValue(
    robot.torsoLean,
    Math.sin(robot.walkPhase) * 0.04,
    0.25,
  );
  robot.headPitch = lerpValue(
    robot.headPitch,
    Math.sin(robot.walkPhase * 2.0) * 0.02,
    0.18,
  );
}

function triggerKick(leg = "right") {
  if (robot.kickActive) return;

  robot.kickActive = true;
  robot.kickPhase = 0;
  robot.kickingLeg = leg;
}

function updateKickAnimation() {
  if (!robot.kickActive) return;

  robot.kickPhase += 0.08;
  const t = robot.kickPhase;

  // reset upper body a bit
  robot.torsoLean = lerpValue(robot.torsoLean, 0.04, 0.15);
  robot.headPitch = lerpValue(robot.headPitch, -0.03, 0.15);

  if (robot.kickingLeg === "right") {
    if (t < 0.45) {
      robot.rightHip = lerpValue(robot.rightHip, -0.55, 0.28);
      robot.rightKnee = lerpValue(robot.rightKnee, -0.55, 0.28);
      robot.leftHip = lerpValue(robot.leftHip, 0.15, 0.18);
    } else if (t < 0.9) {
      robot.rightHip = lerpValue(robot.rightHip, 0.9, 0.34);
      robot.rightKnee = lerpValue(robot.rightKnee, 0.05, 0.34);
      robot.leftHip = lerpValue(robot.leftHip, 0.12, 0.16);

      tryKickBall("right");
    } else {
      robot.rightHip = lerpValue(robot.rightHip, 0, 0.22);
      robot.rightKnee = lerpValue(robot.rightKnee, 0, 0.22);
      robot.leftHip = lerpValue(robot.leftHip, 0, 0.22);
    }
  } else {
    if (t < 0.45) {
      robot.leftHip = lerpValue(robot.leftHip, 0.55, 0.28);
      robot.leftKnee = lerpValue(robot.leftKnee, 0.55, 0.28);
      robot.rightHip = lerpValue(robot.rightHip, -0.15, 0.18);
    } else if (t < 0.9) {
      robot.leftHip = lerpValue(robot.leftHip, -0.9, 0.34);
      robot.leftKnee = lerpValue(robot.leftKnee, -0.05, 0.34);
      robot.rightHip = lerpValue(robot.rightHip, -0.12, 0.16);

      tryKickBall("left");
    } else {
      robot.leftHip = lerpValue(robot.leftHip, 0, 0.22);
      robot.leftKnee = lerpValue(robot.leftKnee, 0, 0.22);
      robot.rightHip = lerpValue(robot.rightHip, 0, 0.22);
    }
  }

  if (robot.kickPhase >= 1.2) {
    robot.kickActive = false;
    robot.kickPhase = 0;
  }
}

function tryKickBall(leg) {
  const footPos = getFootWorldPosition(leg);
  const toBall = Vec3.sub(football.pos, footPos);
  const dist = Vec3.length(toBall);

  if (dist < football.radius + 34) {
    const dir = Vec3.normalize([
      Math.sin(robot.yaw),
      -0.02,
      Math.cos(robot.yaw),
    ]);

    football.velocity = [dir[0] * 9.5, -1.0, dir[2] * 9.5];
  }
}

function updateFootballPhysics() {
  football.pos = Vec3.add(football.pos, football.velocity);

  football.velocity[1] += 0.22;

  football.velocity[0] *= 0.992;
  football.velocity[2] *= 0.992;

  const floorY = 194;

  if (football.pos[1] > floorY) {
    football.pos[1] = floorY;
    football.velocity[1] *= -0.45;

    if (Math.abs(football.velocity[1]) < 0.3) {
      football.velocity[1] = 0;
    }

    football.velocity[0] *= 0.96;
    football.velocity[2] *= 0.96;
  }
}

// ------------------------------------------------------------
// DRAW
// ------------------------------------------------------------
function drawRobot() {
  if (!robot || !robotMeshes) return;

  const root = Mat4.compose(
    Mat4.translation(robot.pos[0], robot.pos[1], robot.pos[2]),
    Mat4.rotateY(robot.yaw),
    Mat4.rotateZ(robot.torsoLean),
  );

  drawTorso(root);
  drawHead(root);
  drawArm(root, true);
  drawArm(root, false);

  const pelvisMatrix = Mat4.compose(root, Mat4.translation(0, 103, 0));
  drawPart(robotMeshes.pelvis, pelvisMatrix, "plastic");

  drawLeg(pelvisMatrix, true);
  drawLeg(pelvisMatrix, false);
}

function drawFootball() {
  if (!football || !robotMeshes) return;

  const m = Mat4.translation(football.pos[0], football.pos[1], football.pos[2]);

  const worldMesh = Mesh.transformed(robotMeshes.football, m);

  applyMaterial("plastic");
  Geometry.drawMesh(worldMesh, false);
}
// ------------------------------------------------------------
// DRAW HELPERS
// ------------------------------------------------------------
function drawPart(mesh, matrix, materialType = "metal") {
  const worldMesh = Mesh.transformed(mesh, matrix);
  applyMaterial(materialType);
  Geometry.drawMesh(worldMesh, false);
}
function drawPanel(
  panelObj,
  matrix,
  outerMaterial = "plastic",
  innerMode = "emissive",
) {
  const outerWorld = Mesh.transformed(panelObj.shell, matrix);
  applyMaterial(outerMaterial);
  Geometry.drawMesh(outerWorld, false);

  const innerWorld = Mesh.transformed(panelObj.inner, matrix);
  if (innerMode === "glass") {
    applyMaterial("glass");
  } else {
    applyEmissive([0, 210, 255]);
  }
  Geometry.drawMesh(innerWorld, false);
}
function drawTorso(root) {
  drawPart(robotMeshes.torso, root, "metal");

  const torsoBack = Mat4.compose(root, Mat4.translation(0, -8, -52));
  drawPart(robotMeshes.torsoBack, torsoBack, "plastic");

  const backpack = Mat4.compose(root, Mat4.translation(0, -6, -56));
  drawPart(robotMeshes.backpack, backpack, "plastic");

  const chestPanel = Mat4.compose(root, Mat4.translation(0, -16, 47));
  drawPanel(robotMeshes.chestPanel, chestPanel, "plastic", "emissive");
}
function drawHead(root) {
  const neckBase = Mat4.compose(root, Mat4.translation(0, -102, 0));
  drawPart(robotMeshes.neck, neckBase, "metal");

  const headPivot = Mat4.compose(
    neckBase,
    Mat4.translation(0, -18, 0),
    Mat4.rotateY(robot.headYaw),
    Mat4.rotateX(robot.headPitch),
  );

  const head = Mat4.compose(headPivot, Mat4.translation(0, -34, 0));
  drawPart(robotMeshes.head, head, "plastic");

  const facePanel = Mat4.compose(head, Mat4.translation(0, -2, 41));
  drawPanel(robotMeshes.facePanel, facePanel, "plastic", "glass");
}

function drawArm(torsoMatrix, left) {
  const side = left ? -1 : 1;
  const shoulderAngle = left ? robot.leftShoulder : robot.rightShoulder;
  const elbowAngle = left ? robot.leftElbow : robot.rightElbow;
  const clawAngle = left ? robot.leftClaw : robot.rightClaw;

  const shoulderMount = Mat4.compose(
    torsoMatrix,
    Mat4.translation(84 * side, -56, 0),
  );

  drawPart(robotMeshes.joint, shoulderMount, "metal");

  const armor = Mat4.compose(shoulderMount, Mat4.translation(12 * side, -4, 0));
  drawPart(robotMeshes.shoulderArmor, armor, "plastic");

  const shoulderPivot = Mat4.compose(
    shoulderMount,
    Mat4.rotateZ(shoulderAngle * side),
  );

  const upperArm = Mat4.compose(shoulderPivot, Mat4.translation(0, 48, 0));
  drawPart(robotMeshes.upperArm, upperArm, "metal");

  const elbowMount = Mat4.compose(shoulderPivot, Mat4.translation(0, 94, 0));
  drawPart(robotMeshes.joint, elbowMount, "metal");

  const elbowPivot = Mat4.compose(elbowMount, Mat4.rotateZ(elbowAngle * side));

  const foreArm = Mat4.compose(elbowPivot, Mat4.translation(0, 43, 0));
  drawPart(robotMeshes.foreArm, foreArm, "metal");

  const wrist = Mat4.compose(elbowPivot, Mat4.translation(0, 88, 0));
  drawPart(robotMeshes.joint, wrist, "metal");

  const palmMesh = Geometry.makeBox(22, 24, 22);
  const palm = Mat4.compose(wrist, Mat4.translation(0, 18, 0));
  drawPart(palmMesh, palm, "plastic");

  const fingerA = Mat4.compose(
    palm,
    Mat4.translation(0, 12, 10),
    Mat4.rotateZ(clawAngle * side),
    Mat4.translation(0, 14, 0),
  );
  drawPart(robotMeshes.clawFinger, fingerA, "metal");

  const fingerB = Mat4.compose(
    palm,
    Mat4.translation(0, 12, -10),
    Mat4.rotateZ(-clawAngle * side),
    Mat4.translation(0, 14, 0),
  );
  drawPart(robotMeshes.clawFinger, fingerB, "metal");
}

function drawLeg(pelvisMatrix, left) {
  const side = left ? -1 : 1;
  const hipAngle = left ? robot.leftHip : robot.rightHip;
  const kneeAngle = left ? robot.leftKnee : robot.rightKnee;

  const hipMount = Mat4.compose(
    pelvisMatrix,
    Mat4.translation(30 * side, 32, 0),
  );
  drawPart(robotMeshes.joint, hipMount, "metal");

  const hipPivot = Mat4.compose(hipMount, Mat4.rotateZ(hipAngle * side));

  const thigh = Mat4.compose(hipPivot, Mat4.translation(0, 52, 0));
  drawPart(robotMeshes.thigh, thigh, "metal");

  const kneeMount = Mat4.compose(hipPivot, Mat4.translation(0, 104, 0));
  drawPart(robotMeshes.joint, kneeMount, "metal");

  const kneePanel = Mat4.compose(kneeMount, Mat4.translation(0, 0, 16));
  drawPanel(robotMeshes.kneePanel, kneePanel, "plastic", "glass");

  const kneePivot = Mat4.compose(kneeMount, Mat4.rotateZ(kneeAngle * side));

  const shin = Mat4.compose(kneePivot, Mat4.translation(0, 50, 0));
  drawPart(robotMeshes.shin, shin, "metal");

  const foot = Mat4.compose(kneePivot, Mat4.translation(0, 102, 16));
  drawPart(robotMeshes.foot, foot, "leather");
}

// ------------------------------------------------------------
// WORLD POSITION HELPERS
// ------------------------------------------------------------
function getFootWorldPosition(leg) {
  const left = leg === "left";
  const side = left ? -1 : 1;
  const hipAngle = left ? robot.leftHip : robot.rightHip;
  const kneeAngle = left ? robot.leftKnee : robot.rightKnee;

  const root = Mat4.compose(
    Mat4.translation(robot.pos[0], robot.pos[1], robot.pos[2]),
    Mat4.rotateY(robot.yaw),
    Mat4.rotateZ(robot.torsoLean),
  );

  const pelvis = Mat4.compose(root, Mat4.translation(0, 103, 0));
  const hipMount = Mat4.compose(pelvis, Mat4.translation(30 * side, 32, 0));
  const hipPivot = Mat4.compose(hipMount, Mat4.rotateZ(hipAngle * side));
  const kneeMount = Mat4.compose(hipPivot, Mat4.translation(0, 104, 0));
  const kneePivot = Mat4.compose(kneeMount, Mat4.rotateZ(kneeAngle * side));
  const footMatrix = Mat4.compose(kneePivot, Mat4.translation(0, 102, 16));

  return Mat4.transformPoint(footMatrix, [0, 16, 22]);
}

// ------------------------------------------------------------
// RESET
// ------------------------------------------------------------
function resetRobotPose() {
  robot.headYaw = 0;
  robot.headPitch = 0;

  robot.leftShoulder = -0.08;
  robot.rightShoulder = 0.08;

  robot.leftElbow = 0.28;
  robot.rightElbow = -0.28;

  robot.leftHip = 0;
  robot.rightHip = 0;
  robot.leftKnee = 0;
  robot.rightKnee = 0;

  robot.leftClaw = 0.2;
  robot.rightClaw = 0.2;

  robot.torsoLean = 0;
}

// ------------------------------------------------------------
// SMALL UTILITIES
// ------------------------------------------------------------
function lerpValue(a, b, t) {
  return a + (b - a) * t;
}
