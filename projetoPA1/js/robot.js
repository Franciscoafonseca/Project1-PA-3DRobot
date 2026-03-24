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
    pos: [0, -48, 0],
    yaw: 0,

    torsoLean: 0,
    torsoTwist: 0,
    kickOffsetX: 0,
    kickOffsetZ: 0,
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

    leftAnkle: 0,
    rightAnkle: 0,

    moving: false,
    idle: true,
    walkPhase: 0,

    kickActive: false,
    kickPhase: 0,
    kickingLeg: "right",

    ballAlreadyKicked: false,
  };

  football = {
    pos: [28, 198, 120],
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
  robot.torsoTwist = lerpValue(robot.torsoTwist, Math.sin(t * 1.2) * 0.015, 0.08);
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
  robot.torsoTwist = lerpValue(robot.torsoTwist, -Math.sin(robot.walkPhase) * 0.08, 0.18);
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

  robot.kickPhase += 0.06;
  const t = clampUnit(robot.kickPhase);

  const kickLeg = robot.kickingLeg === "right" ? "right" : "left";
  const supportLeg = kickLeg === "right" ? "left" : "right";
  const kickSign = kickLeg === "right" ? 1 : -1;

  // Fases do remate: 0-0.3 prepara, 0.3-0.6 acelera, 0.6-0.9 follow-through
  function setLeg(leg, hipTarget, kneeTarget, ankleTarget, speed = 0.26) {
    if (leg === "right") {
      robot.rightHip = lerpValue(robot.rightHip, hipTarget, speed);
      robot.rightKnee = lerpValue(robot.rightKnee, kneeTarget, speed);
      robot.rightAnkle = lerpValue(robot.rightAnkle, ankleTarget, speed);
    } else {
      robot.leftHip = lerpValue(robot.leftHip, hipTarget, speed);
      robot.leftKnee = lerpValue(robot.leftKnee, kneeTarget, speed);
      robot.leftAnkle = lerpValue(robot.leftAnkle, ankleTarget, speed);
    }
  }

  // tronco e braços: contra-balanço para parecer remate humano
  const prepEnd = 0.30;
  const impactEnd = 0.58;
  const followEnd = 0.86;

  const kickProgress =
    t < prepEnd
      ? 0
      : t < impactEnd
        ? (t - prepEnd) / (impactEnd - prepEnd)
        : 1;

  const bodyLean = t < prepEnd ? -0.04 : t < impactEnd ? 0.15 : 0.08;
  const bodyTwist =
    t < prepEnd
      ? -0.22 * kickSign
      : t < impactEnd
        ? 0.3 * kickSign
        : 0.14 * kickSign;

  // transferência de peso + pequeno passo de ataque
  const sideShift =
    t < prepEnd
      ? lerpValue(0, -8 * kickSign, easeInOutCubic(t / prepEnd))
      : t < impactEnd
        ? lerpValue(-8 * kickSign, 5 * kickSign, easeOutQuart((t - prepEnd) / (impactEnd - prepEnd)))
        : lerpValue(5 * kickSign, 0, easeInOutCubic((t - impactEnd) / (1 - impactEnd)));

  const forwardStep =
    t < prepEnd
      ? lerpValue(0, -7, easeInOutCubic(t / prepEnd))
      : t < impactEnd
        ? lerpValue(-7, 15, easeOutQuart((t - prepEnd) / (impactEnd - prepEnd)))
        : lerpValue(15, 0, easeInOutCubic((t - impactEnd) / (1 - impactEnd)));

  robot.kickOffsetX = sideShift;
  robot.kickOffsetZ = forwardStep;

  robot.torsoLean = lerpValue(robot.torsoLean, bodyLean, 0.2);
  robot.torsoTwist = lerpValue(robot.torsoTwist, bodyTwist, 0.22);
  robot.headPitch = lerpValue(robot.headPitch, -0.04 + kickProgress * 0.04, 0.16);

  // braço oposto abre no impacto, braço do lado do remate fecha
  if (kickLeg === "right") {
    robot.rightShoulder = lerpValue(robot.rightShoulder, -0.32, 0.2);
    robot.leftShoulder = lerpValue(robot.leftShoulder, 0.46, 0.2);
    robot.rightElbow = lerpValue(robot.rightElbow, 0.34, 0.18);
    robot.leftElbow = lerpValue(robot.leftElbow, 0.12, 0.18);
  } else {
    robot.leftShoulder = lerpValue(robot.leftShoulder, 0.32, 0.2);
    robot.rightShoulder = lerpValue(robot.rightShoulder, -0.46, 0.2);
    robot.leftElbow = lerpValue(robot.leftElbow, 0.34, 0.18);
    robot.rightElbow = lerpValue(robot.rightElbow, 0.12, 0.18);
  }

  // perna de apoio: flexão progressiva para absorver peso
  const supportHip = -0.07 - Math.sin(t * Math.PI) * 0.07;
  const supportKnee = 0.16 + Math.sin(t * Math.PI) * 0.16;
  setLeg(supportLeg, supportHip, supportKnee, -0.06, 0.22);

  // biomecânica do remate (coxa e joelho em fases)

  if (t < prepEnd) {
    const p = easeInOutCubic(t / prepEnd);
    const hip = lerpValue(0, -0.36, p);
    const knee = lerpValue(0, 0.88, p);
    const ankle = lerpValue(0, -0.22, p);
    setLeg(kickLeg, hip, knee, ankle, 0.34);
  } else if (t < impactEnd) {
    const p = easeOutQuart((t - prepEnd) / (impactEnd - prepEnd));
    const hip = lerpValue(-0.36, 0.92, p);
    const knee = lerpValue(0.88, 0.02, p);
    const ankle = lerpValue(-0.22, 0.42, p);
    setLeg(kickLeg, hip, knee, ankle, 0.4);

    if (!robot.ballAlreadyKicked && t > 0.52) {
      tryKickBall(kickLeg, p);
      robot.ballAlreadyKicked = true;
    }
  } else if (t < followEnd) {
    const p = easeInOutCubic((t - impactEnd) / (followEnd - impactEnd));
    const hip = lerpValue(0.92, 0.34, p);
    const knee = lerpValue(0.02, 0.34, p);
    const ankle = lerpValue(0.42, 0.08, p);
    setLeg(kickLeg, hip, knee, ankle, 0.24);
  } else {
    const p = easeInOutCubic((t - followEnd) / (1.0 - followEnd));
    const hip = lerpValue(0.32, 0, p);
    const knee = lerpValue(0.28, 0, p);
    const ankle = lerpValue(0.1, 0, p);
    setLeg(kickLeg, hip, knee, ankle, 0.24);
    setLeg(supportLeg, 0, 0, 0, 0.22);
  }

  if (robot.kickPhase >= 1.0) {
    robot.kickActive = false;
    robot.kickPhase = 0;
    robot.ballAlreadyKicked = false;

    robot.torsoTwist = lerpValue(robot.torsoTwist, 0, 0.35);
    robot.kickOffsetX = 0;
    robot.kickOffsetZ = 0;
    robot.leftShoulder = lerpValue(robot.leftShoulder, -0.08, 0.26);
    robot.rightShoulder = lerpValue(robot.rightShoulder, 0.08, 0.26);
    robot.leftElbow = lerpValue(robot.leftElbow, 0.18, 0.2);
    robot.rightElbow = lerpValue(robot.rightElbow, 0.18, 0.2);
  }
}

function tryKickBall(leg, impactPhase = 1) {
  const footPos = getFootWorldPosition(leg);
  const ballToFoot = Vec3.sub(football.pos, footPos);
  const dist = Vec3.length(ballToFoot);
  const kickSign = leg === "right" ? 1 : -1;

  if (dist < football.radius + 74) {
    const dir = Vec3.normalize([
      Math.sin(robot.yaw + robot.torsoTwist * 0.55) + kickSign * 0.08,
      -0.22,
      Math.cos(robot.yaw + robot.torsoTwist * 0.55),
    ]);

    const contactBoost = clampUnit((football.radius + 74 - dist) / 28);
    const power = 8.4 + impactPhase * 3.4 + contactBoost * 2.2;
    const lift = 2.1 + impactPhase * 1.5;

    football.velocity = [dir[0] * power, -lift, dir[2] * power];
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
    Mat4.translation(
      robot.pos[0] + robot.kickOffsetX,
      robot.pos[1],
      robot.pos[2] + robot.kickOffsetZ,
    ),
    Mat4.rotateY(robot.yaw),
    Mat4.rotateY(robot.torsoTwist),
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
  const useTexture = applyMaterial("plastic", "plastic");
  Geometry.drawMesh(worldMesh, useTexture);
  pop();
}

// ------------------------------------------------------------
// DRAW HELPERS
// ------------------------------------------------------------
function drawPart(
  mesh,
  matrix,
  materialType = "metal",
  textureType = materialType,
) {
  const worldMesh = Mesh.transformed(mesh, matrix);

  push();
  const useTexture = applyMaterial(materialType, textureType);
  Geometry.drawMesh(worldMesh, useTexture);
  pop();
}

function getLoadedTexture(textureType) {
  const globalScope = typeof globalThis !== "undefined" ? globalThis : window;

  if (textureType === "metal" && globalScope.imgMetal) return globalScope.imgMetal;
  if (textureType === "plastic" && globalScope.imgPlastic)
    return globalScope.imgPlastic;
  if (textureType === "glass" && globalScope.imgLed) return globalScope.imgLed;

  if (typeof Textures !== "undefined" && Textures[textureType]) {
    return Textures[textureType];
  }

  return null;
}

function drawPartUV(
  mesh,
  matrix,
  materialType = "metal",
  textureType = materialType,
) {
  const worldMesh = Mesh.transformed(mesh, matrix);

  push();
  applyMaterial(materialType, textureType);

  const imageTex = getLoadedTexture(textureType);
  if (imageTex) {
    texture(imageTex);
  }

  const useTexture = !!imageTex && mesh.uvs && mesh.uvs.length > 0;
  Geometry.drawMesh(worldMesh, useTexture);
  pop();
}

function drawTorso(root) {
  drawPart(robotMeshes.torso, root, "metal", "metal");

  const chestPanel = Mat4.compose(root, Mat4.translation(0, -10, 34));
  drawPanel(robotMeshes.chestPanel, chestPanel, "plastic", "glass");
}

function drawHead(root) {
  const neckBase = Mat4.compose(root, Mat4.translation(0, -88, 0));
  drawPart(robotMeshes.neck, neckBase, "metal", "metal");

  const headPivot = Mat4.compose(
    neckBase,
    Mat4.translation(0, -12, 0),
    Mat4.rotateY(robot.headYaw),
    Mat4.rotateX(robot.headPitch),
  );

  const head = Mat4.compose(headPivot, Mat4.translation(0, -22, 0));
  drawPart(robotMeshes.head, head, "plastic", "plastic");

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
  drawPart(robotMeshes.joint, shoulderMount, "metal", "metal");

  // CORREÇÃO: braço anda para a frente/trás no eixo X
  const shoulderPivot = Mat4.compose(
    shoulderMount,
    Mat4.rotateX(shoulderAngle),
  );

  const upperArm = Mat4.compose(shoulderPivot, Mat4.translation(0, 34, 0));
  drawPart(robotMeshes.upperArm, upperArm, "metal", "metal");

  const elbowMount = Mat4.compose(shoulderPivot, Mat4.translation(0, 68, 0));
  drawPart(robotMeshes.joint, elbowMount, "metal", "metal");

  // CORREÇÃO: cotovelo dobra no mesmo plano do andar
  const elbowPivot = Mat4.compose(elbowMount, Mat4.rotateX(elbowAngle));

  const foreArm = Mat4.compose(elbowPivot, Mat4.translation(0, 30, 0));
  drawPart(robotMeshes.foreArm, foreArm, "metal", "metal");

  const wrist = Mat4.compose(elbowPivot, Mat4.translation(0, 60, 0));
  drawPart(robotMeshes.joint, wrist, "metal", "metal");

  const handBase = Mat4.compose(wrist, Mat4.translation(0, 10, 0));
  drawPart(robotMeshes.handBase, handBase, "plastic", "plastic");
}

function drawPanel(
  panelObj,
  matrix,
  outerMaterial = "plastic",
  innerMaterial = "glass",
  outerTexture = outerMaterial,
  innerTexture = innerMaterial,
) {
  const outerWorld = Mesh.transformed(panelObj.shell, matrix);
  push();
  let useTexture = applyMaterial(outerMaterial, outerTexture);
  Geometry.drawMesh(outerWorld, useTexture);
  pop();

  const innerWorld = Mesh.transformed(panelObj.inner, matrix);
  push();
  useTexture = applyMaterial(innerMaterial, innerTexture);
  Geometry.drawMesh(innerWorld, useTexture);
  pop();
}

function drawLeg(pelvisMatrix, left) {
  const side = left ? -1 : 1;
  const hipAngle = left ? robot.leftHip : robot.rightHip;
  const kneeAngle = left ? robot.leftKnee : robot.rightKnee;
  const ankleAngle = left ? robot.leftAnkle : robot.rightAnkle;

  const hipMount = Mat4.compose(
    pelvisMatrix,
    Mat4.translation(20 * side, 18, 0),
  );
  drawPart(robotMeshes.joint, hipMount, "metal", "metal");

  // CORREÇÃO: anca move perna para a frente/trás no eixo X
  const hipPivot = Mat4.compose(hipMount, Mat4.rotateX(hipAngle));

  const thigh = Mat4.compose(hipPivot, Mat4.translation(0, 38, 0));
  drawPartUV(robotMeshes.thigh, thigh, "metal", "metal");

  const kneeMount = Mat4.compose(hipPivot, Mat4.translation(0, 76, 0));
  drawPart(robotMeshes.joint, kneeMount, "metal", "metal");

  // CORREÇÃO: joelho dobra no eixo X
  const kneePivot = Mat4.compose(kneeMount, Mat4.rotateX(-kneeAngle));

  const shin = Mat4.compose(kneePivot, Mat4.translation(0, 36, 0));
  drawPartUV(robotMeshes.shin, shin, "metal", "metal");

  const ankle = Mat4.compose(kneePivot, Mat4.translation(0, 72, 0));
  drawPart(robotMeshes.joint, ankle, "metal", "metal");

  const ankleRot = Mat4.compose(ankle, Mat4.rotateX(ankleAngle));

  const foot = Mat4.compose(ankleRot, Mat4.translation(0, 10, 8));
  drawPartUV(robotMeshes.foot, foot, "plastic", "plastic");
}

// ------------------------------------------------------------
// HELPERS
// ------------------------------------------------------------
function getFootWorldPosition(leg) {
  const left = leg === "left";
  const side = left ? -1 : 1;
  const hipAngle = left ? robot.leftHip : robot.rightHip;
  const kneeAngle = left ? robot.leftKnee : robot.rightKnee;
  const ankleAngle = left ? robot.leftAnkle : robot.rightAnkle;

  const root = Mat4.compose(
    Mat4.translation(
      robot.pos[0] + robot.kickOffsetX,
      robot.pos[1],
      robot.pos[2] + robot.kickOffsetZ,
    ),
    Mat4.rotateY(robot.yaw),
    Mat4.rotateY(robot.torsoTwist),
    Mat4.rotateX(robot.torsoLean),
  );

  const pelvis = Mat4.compose(root, Mat4.translation(0, 84, 0));
  const hipMount = Mat4.compose(pelvis, Mat4.translation(20 * side, 18, 0));
  const hipPivot = Mat4.compose(hipMount, Mat4.rotateX(hipAngle));
  const kneeMount = Mat4.compose(hipPivot, Mat4.translation(0, 76, 0));
  const kneePivot = Mat4.compose(kneeMount, Mat4.rotateX(-kneeAngle));
  const ankle = Mat4.compose(kneePivot, Mat4.translation(0, 72, 0));
  const ankleRot = Mat4.compose(ankle, Mat4.rotateX(ankleAngle));
  const footMatrix = Mat4.compose(ankleRot, Mat4.translation(0, 10, 8));

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

  robot.leftAnkle = 0;
  robot.rightAnkle = 0;

  robot.torsoLean = 0;
  robot.torsoTwist = 0;
  robot.kickOffsetX = 0;
  robot.kickOffsetZ = 0;
  robot.kickActive = false;
  robot.kickPhase = 0;
  robot.ballAlreadyKicked = false;
}

function lerpValue(a, b, t) {
  return a + (b - a) * t;
}

function clampUnit(v) {
  return Math.max(0, Math.min(1, v));
}

function easeInOutCubic(t) {
  if (t < 0.5) return 4 * t * t * t;
  const f = -2 * t + 2;
  return 1 - (f * f * f) / 2;
}

function easeOutQuart(t) {
  const f = 1 - t;
  return 1 - f * f * f * f;
}
