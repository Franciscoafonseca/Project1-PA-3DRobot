// js/robot.js
// ============================================================
// ROBOT SYSTEM - CORRECTED WALK / JOINT AXES VERSION
// ============================================================

let robot = null;
let robotMeshes = null;
let football = null;

// ------------------------------------------------------------
// INIT
// ------------------------------------------------------------
function initRobot() {
  robot = {
    pos: [0, -105, 0],
    yaw: 0,

    torsoLean: 0,
    headYaw: 0,
    headPitch: 0,

    leftShoulder: -0.08,
    rightShoulder: 0.08,
    leftElbow: 0.18,
    rightElbow: 0.18,

    leftHip: 0,
    rightHip: 0,
    leftKnee: 0,
    rightKnee: 0,

    moving: false,
    idle: true,
    walkPhase: 0,

    kickActive: false,
    kickPhase: 0,
    kickingLeg: "right",

    ballAlreadyKicked: false,
  };

  football = {
    pos: [85, 198, 110],
    radius: 20,
    velocity: [0, 0, 0],
  };

  buildRobotMeshes();
}

function buildRobotMeshes() {
  robotMeshes = {
    torso: Geometry.makeTrapezoidPrism(90, 104, 138, 64),
    pelvis: Geometry.makePelvis(64, 88, 30, 50),
    head: Geometry.makeHead(46, 58, 56, 50),
    neck: Geometry.makeCylinder(7, 16, 12),

    facePanel: Geometry.makePanel(20, 8, 3, 0.14),
    chestPanel: Geometry.makePanel(28, 18, 4, 0.18),

    upperArm: Geometry.makeCylinder(9, 68, 10),
    foreArm: Geometry.makeCylinder(8, 60, 10),
    joint: Geometry.makeCylinder(8, 12, 12),

    thigh: Geometry.makeCylinder(11, 78, 10),
    shin: Geometry.makeCylinder(10, 74, 10),

    foot: Geometry.makeFoot(38, 16, 22),
    handBase: Geometry.makeBox(12, 14, 12),

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

  const t = millis() * 0.0015;

  robot.torsoLean = Math.sin(t * 1.5) * 0.012;
  robot.headPitch = Math.sin(t * 1.1) * 0.015;

  robot.leftShoulder = lerpValue(
    robot.leftShoulder,
    -0.08 + Math.sin(t) * 0.01,
    0.05,
  );
  robot.rightShoulder = lerpValue(
    robot.rightShoulder,
    0.08 - Math.sin(t) * 0.01,
    0.05,
  );

  robot.leftElbow = lerpValue(
    robot.leftElbow,
    0.18 + Math.sin(t * 1.3) * 0.015,
    0.05,
  );
  robot.rightElbow = lerpValue(
    robot.rightElbow,
    0.18 - Math.sin(t * 1.3) * 0.015,
    0.05,
  );

  robot.leftHip = lerpValue(robot.leftHip, 0, 0.08);
  robot.rightHip = lerpValue(robot.rightHip, 0, 0.08);
  robot.leftKnee = lerpValue(robot.leftKnee, 0, 0.08);
  robot.rightKnee = lerpValue(robot.rightKnee, 0, 0.08);
}

function applyWalkAnimation() {
  if (!robot.moving || robot.kickActive) return;

  robot.walkPhase += 0.13;

  const swingL = Math.sin(robot.walkPhase) * 0.42;
  const swingR = Math.sin(robot.walkPhase + Math.PI) * 0.42;

  const kneeL = Math.max(0, Math.sin(robot.walkPhase)) * 0.38;
  const kneeR = Math.max(0, Math.sin(robot.walkPhase + Math.PI)) * 0.38;

  // pernas
  robot.leftHip = lerpValue(robot.leftHip, swingL, 0.28);
  robot.rightHip = lerpValue(robot.rightHip, swingR, 0.28);

  robot.leftKnee = lerpValue(robot.leftKnee, kneeL, 0.28);
  robot.rightKnee = lerpValue(robot.rightKnee, kneeR, 0.28);

  // braços em oposição às pernas
  robot.leftShoulder = lerpValue(robot.leftShoulder, -swingL * 0.75, 0.28);
  robot.rightShoulder = lerpValue(robot.rightShoulder, -swingR * 0.75, 0.28);

  // cotovelos levemente dobrados
  robot.leftElbow = lerpValue(
    robot.leftElbow,
    0.18 + Math.max(0, -Math.sin(robot.walkPhase)) * 0.1,
    0.18,
  );
  robot.rightElbow = lerpValue(
    robot.rightElbow,
    0.18 + Math.max(0, -Math.sin(robot.walkPhase + Math.PI)) * 0.1,
    0.18,
  );

  robot.torsoLean = lerpValue(robot.torsoLean, 0.03, 0.12);
  robot.headPitch = lerpValue(
    robot.headPitch,
    Math.sin(robot.walkPhase * 2.0) * 0.01,
    0.15,
  );
}

function triggerKick(leg = "right") {
  if (robot.kickActive) return;
  robot.kickActive = true;
  robot.kickPhase = 0;
  robot.kickingLeg = leg;
  robot.ballAlreadyKicked = false;
}

function updateKickAnimation() {
  if (!robot.kickActive) return;

  robot.kickPhase += 0.08;
  const t = robot.kickPhase;

  robot.torsoLean = lerpValue(robot.torsoLean, 0.05, 0.14);
  robot.headPitch = lerpValue(robot.headPitch, -0.02, 0.12);

  if (robot.kickingLeg === "right") {
    // perna esquerda suporta
    robot.leftHip = lerpValue(robot.leftHip, -0.08, 0.12);
    robot.leftKnee = lerpValue(robot.leftKnee, 0.08, 0.12);

    if (t < 0.38) {
      // levantar coxa
      robot.rightHip = lerpValue(robot.rightHip, -0.55, 0.24);
      robot.rightKnee = lerpValue(robot.rightKnee, 0.7, 0.24);
    } else if (t < 0.72) {
      // extensão do remate
      robot.rightHip = lerpValue(robot.rightHip, 0.42, 0.3);
      robot.rightKnee = lerpValue(robot.rightKnee, 0.08, 0.3);

      if (!robot.ballAlreadyKicked) {
        tryKickBall("right");
        robot.ballAlreadyKicked = true;
      }
    } else {
      robot.rightHip = lerpValue(robot.rightHip, 0, 0.18);
      robot.rightKnee = lerpValue(robot.rightKnee, 0, 0.18);
      robot.leftHip = lerpValue(robot.leftHip, 0, 0.18);
      robot.leftKnee = lerpValue(robot.leftKnee, 0, 0.18);
    }
  } else {
    // perna direita suporta
    robot.rightHip = lerpValue(robot.rightHip, -0.08, 0.12);
    robot.rightKnee = lerpValue(robot.rightKnee, 0.08, 0.12);

    if (t < 0.38) {
      robot.leftHip = lerpValue(robot.leftHip, -0.55, 0.24);
      robot.leftKnee = lerpValue(robot.leftKnee, 0.7, 0.24);
    } else if (t < 0.72) {
      robot.leftHip = lerpValue(robot.leftHip, 0.42, 0.3);
      robot.leftKnee = lerpValue(robot.leftKnee, 0.08, 0.3);

      if (!robot.ballAlreadyKicked) {
        tryKickBall("left");
        robot.ballAlreadyKicked = true;
      }
    } else {
      robot.leftHip = lerpValue(robot.leftHip, 0, 0.18);
      robot.leftKnee = lerpValue(robot.leftKnee, 0, 0.18);
      robot.rightHip = lerpValue(robot.rightHip, 0, 0.18);
      robot.rightKnee = lerpValue(robot.rightKnee, 0, 0.18);
    }
  }

  if (robot.kickPhase >= 1.1) {
    robot.kickActive = false;
    robot.kickPhase = 0;
    robot.ballAlreadyKicked = false;
  }
}

function tryKickBall(leg) {
  const footPos = getFootWorldPosition(leg);
  const dist = Vec3.distance(football.pos, footPos);

  if (dist < football.radius + 28) {
    const dir = Vec3.normalize([
      Math.sin(robot.yaw),
      -0.05,
      Math.cos(robot.yaw),
    ]);

    football.velocity = [dir[0] * 8.0, -1.0, dir[2] * 8.0];
  }
}

function updateFootballPhysics() {
  football.pos = Vec3.add(football.pos, football.velocity);

  football.velocity[1] += 0.2;
  football.velocity[0] *= 0.992;
  football.velocity[2] *= 0.992;

  const floorY = 200;

  if (football.pos[1] > floorY) {
    football.pos[1] = floorY;
    football.velocity[1] *= -0.42;

    if (Math.abs(football.velocity[1]) < 0.25) {
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
    Mat4.rotateX(robot.torsoLean),
  );

  drawTorso(root);
  drawHead(root);
  drawArm(root, true);
  drawArm(root, false);

  const pelvisMatrix = Mat4.compose(root, Mat4.translation(0, 84, 0));
  drawPart(robotMeshes.pelvis, pelvisMatrix, "plastic");

  drawLeg(pelvisMatrix, true);
  drawLeg(pelvisMatrix, false);
}

function drawFootball() {
  if (!football || !robotMeshes) return;

  const m = Mat4.translation(football.pos[0], football.pos[1], football.pos[2]);
  const worldMesh = Mesh.transformed(robotMeshes.football, m);

  push();
  applyMaterial("plastic");
  Geometry.drawMesh(worldMesh, false);
  pop();
}

// ------------------------------------------------------------
// DRAW HELPERS
// ------------------------------------------------------------
function drawPart(mesh, matrix, materialType = "metal") {
  const worldMesh = Mesh.transformed(mesh, matrix);

  push();
  const useTexture = applyMaterial(materialType);
  Geometry.drawMesh(worldMesh, useTexture);
  pop();
}

function drawTorso(root) {
  drawPart(robotMeshes.torso, root, "metal");

  const chestPanel = Mat4.compose(root, Mat4.translation(0, -10, 34));
  drawPanel(robotMeshes.chestPanel, chestPanel, "plastic", "glass");
}

function drawHead(root) {
  const neckBase = Mat4.compose(root, Mat4.translation(0, -88, 0));
  drawPart(robotMeshes.neck, neckBase, "metal");

  const headPivot = Mat4.compose(
    neckBase,
    Mat4.translation(0, -12, 0),
    Mat4.rotateY(robot.headYaw),
    Mat4.rotateX(robot.headPitch),
  );

  const head = Mat4.compose(headPivot, Mat4.translation(0, -22, 0));
  drawPart(robotMeshes.head, head, "plastic");

  const facePanel = Mat4.compose(head, Mat4.translation(0, -2, 27));
  drawPanel(robotMeshes.facePanel, facePanel, "plastic", "glass");
}

function drawArm(torsoMatrix, left) {
  const side = left ? -1 : 1;
  const shoulderAngle = left ? robot.leftShoulder : robot.rightShoulder;
  const elbowAngle = left ? robot.leftElbow : robot.rightElbow;

  const shoulderMount = Mat4.compose(
    torsoMatrix,
    Mat4.translation(56 * side, -42, 0),
  );
  drawPart(robotMeshes.joint, shoulderMount, "metal");

  // CORREÇÃO: braço anda para a frente/trás no eixo X
  const shoulderPivot = Mat4.compose(
    shoulderMount,
    Mat4.rotateX(shoulderAngle),
  );

  const upperArm = Mat4.compose(shoulderPivot, Mat4.translation(0, 34, 0));
  drawPart(robotMeshes.upperArm, upperArm, "metal");

  const elbowMount = Mat4.compose(shoulderPivot, Mat4.translation(0, 68, 0));
  drawPart(robotMeshes.joint, elbowMount, "metal");

  // CORREÇÃO: cotovelo dobra no mesmo plano do andar
  const elbowPivot = Mat4.compose(elbowMount, Mat4.rotateX(elbowAngle));

  const foreArm = Mat4.compose(elbowPivot, Mat4.translation(0, 30, 0));
  drawPart(robotMeshes.foreArm, foreArm, "metal");

  const wrist = Mat4.compose(elbowPivot, Mat4.translation(0, 60, 0));
  drawPart(robotMeshes.joint, wrist, "metal");

  const handBase = Mat4.compose(wrist, Mat4.translation(0, 10, 0));
  drawPart(robotMeshes.handBase, handBase, "plastic");
}

function drawPanel(
  panelObj,
  matrix,
  outerMaterial = "plastic",
  innerMaterial = "glass",
) {
  const outerWorld = Mesh.transformed(panelObj.shell, matrix);
  push();
  let useTexture = applyMaterial(outerMaterial);
  Geometry.drawMesh(outerWorld, useTexture);
  pop();

  const innerWorld = Mesh.transformed(panelObj.inner, matrix);
  push();
  useTexture = applyMaterial(innerMaterial);
  Geometry.drawMesh(innerWorld, useTexture);
  pop();
}

function drawLeg(pelvisMatrix, left) {
  const side = left ? -1 : 1;
  const hipAngle = left ? robot.leftHip : robot.rightHip;
  const kneeAngle = left ? robot.leftKnee : robot.rightKnee;

  const hipMount = Mat4.compose(
    pelvisMatrix,
    Mat4.translation(20 * side, 18, 0),
  );
  drawPart(robotMeshes.joint, hipMount, "metal");

  // CORREÇÃO: anca move perna para a frente/trás no eixo X
  const hipPivot = Mat4.compose(hipMount, Mat4.rotateX(hipAngle));

  const thigh = Mat4.compose(hipPivot, Mat4.translation(0, 38, 0));
  drawPart(robotMeshes.thigh, thigh, "metal");

  const kneeMount = Mat4.compose(hipPivot, Mat4.translation(0, 76, 0));
  drawPart(robotMeshes.joint, kneeMount, "metal");

  // CORREÇÃO: joelho dobra no eixo X
  const kneePivot = Mat4.compose(kneeMount, Mat4.rotateX(kneeAngle));

  const shin = Mat4.compose(kneePivot, Mat4.translation(0, 36, 0));
  drawPart(robotMeshes.shin, shin, "metal");

  const ankle = Mat4.compose(kneePivot, Mat4.translation(0, 72, 0));
  drawPart(robotMeshes.joint, ankle, "metal");

  const foot = Mat4.compose(ankle, Mat4.translation(0, 10, 8));
  drawPart(robotMeshes.foot, foot, "leather");
}

// ------------------------------------------------------------
// HELPERS
// ------------------------------------------------------------
function getFootWorldPosition(leg) {
  const left = leg === "left";
  const side = left ? -1 : 1;
  const hipAngle = left ? robot.leftHip : robot.rightHip;
  const kneeAngle = left ? robot.leftKnee : robot.rightKnee;

  const root = Mat4.compose(
    Mat4.translation(robot.pos[0], robot.pos[1], robot.pos[2]),
    Mat4.rotateY(robot.yaw),
    Mat4.rotateX(robot.torsoLean),
  );

  const pelvis = Mat4.compose(root, Mat4.translation(0, 84, 0));
  const hipMount = Mat4.compose(pelvis, Mat4.translation(20 * side, 18, 0));
  const hipPivot = Mat4.compose(hipMount, Mat4.rotateX(hipAngle));
  const kneeMount = Mat4.compose(hipPivot, Mat4.translation(0, 76, 0));
  const kneePivot = Mat4.compose(kneeMount, Mat4.rotateX(kneeAngle));
  const ankle = Mat4.compose(kneePivot, Mat4.translation(0, 72, 0));
  const footMatrix = Mat4.compose(ankle, Mat4.translation(0, 10, 8));

  return Mat4.transformPoint(footMatrix, [0, 6, 12]);
}

function resetRobotPose() {
  robot.headYaw = 0;
  robot.headPitch = 0;

  robot.leftShoulder = -0.08;
  robot.rightShoulder = 0.08;
  robot.leftElbow = 0.18;
  robot.rightElbow = 0.18;

  robot.leftHip = 0;
  robot.rightHip = 0;
  robot.leftKnee = 0;
  robot.rightKnee = 0;

  robot.torsoLean = 0;
  robot.kickActive = false;
  robot.kickPhase = 0;
  robot.ballAlreadyKicked = false;
}

function lerpValue(a, b, t) {
  return a + (b - a) * t;
}
