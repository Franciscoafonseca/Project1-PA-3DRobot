let robot = null;
let robotMeshes = null;
let football = null;

//inicializacao
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

    leftWrist: 0,
    rightWrist: 0,

    leftFingerCurl: 0.15,
    rightFingerCurl: 0.15,

    leftThumbCurl: 0.1,
    rightThumbCurl: 0.1,

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
    pos: [85, 198, 110],
    radius: 20,
    velocity: [0, 0, 0],
  };

  buildRobotMeshes();
}

//meshes

function buildRobotMeshes() {
  robotMeshes = {
    torso: Geometry.makeChest(86, 112, 48),

    pelvis: Geometry.makePelvisAdvanced(92, 38, 54),
    shorts: Geometry.makeShortsAdvanced(82, 24, 42),

    head: Geometry.makeRobotHead(52, 46, 42),
    neck: Geometry.makeCapsuleY(7, 14, 12, 4),

    facePanel: Geometry.makeRoundedPanel(16, 7, 2.5, 2.2, 0.12),
    chestPanel: Geometry.makeBeveledPanel(18, 14, 3, 2.5, 0.14, 4),

    shoulder: Geometry.makeShoulderCap(12.5, 12),
    upperArm: Geometry.makeUpperArmRounded(54, 16.5, 13.5, 16.0, 12.5),
    elbow: Geometry.makeElbowDisc(6.8, 7.0),
    forearm: Geometry.makeForearmRounded(48, 13.2, 9.8, 12.8, 9.0),
    wrist: Geometry.makeWristJoint(4.1, 6.8, 22),
    palm: Geometry.makePalmRounded(13.8, 12.6, 8.8),

    fingerSegment: Geometry.makeFingerRounded(7, 3, 2, 3, 2),
    fingerJoint: Geometry.makeFingerJoint(1.08, 2.0, 12),

    // legs
    hipJoint: Geometry.makeHipJoint(7.8, 14, 11),
    thigh: Geometry.makeThighHumanized(11.5, 62),
    knee: Geometry.makeKneeHumanized(8.5, 7.0, 8.2),
    shin: Geometry.makeShinHumanized(8.6, 5.8, 60),
    foot: Geometry.makeFootballBootProfile(36, 12, 16),

    football: Geometry.makeFootball(football.radius),
  };
}

//robot draw

function drawRobot() {
  if (!robot || !robotMeshes) return;

  const root = Mat4.compose(
    Mat4.translation(robot.pos[0], robot.pos[1], robot.pos[2]),
    Mat4.rotateY(robot.yaw),
    Mat4.rotateX(robot.torsoLean),
  );

  const pelvisMatrix = Mat4.compose(root, Mat4.translation(0, 84, 0));
  drawPelvis(pelvisMatrix);
  drawLowerBody(pelvisMatrix);

  const torsoMatrix = root;
  drawTorso(torsoMatrix);
  drawHead(torsoMatrix);
  drawArm(torsoMatrix, true);
  drawArm(torsoMatrix, false);
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
function drawPanel(
  panelObj,
  matrix,
  outerMaterial = "plastic",
  innerMaterial = "glass",
) {
  if (!panelObj) {
    console.warn("drawPanel recebeu um panelObj nulo/undefined:", panelObj);
    return;
  }

  // Caso 1: painel composto { shell, inner }
  if (panelObj.shell && panelObj.inner) {
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
    return;
  }

  // Caso 2: mesh simples { vertices, triangles, uvs }
  if (panelObj.vertices && panelObj.triangles) {
    const panelWorld = Mesh.transformed(panelObj, matrix);
    push();
    const useTexture = applyMaterial(outerMaterial);
    Geometry.drawMesh(panelWorld, useTexture);
    pop();
    return;
  }

  console.warn("drawPanel recebeu um panelObj inválido:", panelObj);
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

//reset

function resetRobotPose() {
  robot.headYaw = 0;
  robot.headPitch = 0;

  robot.leftShoulder = -0.08;
  robot.rightShoulder = 0.08;

  robot.leftElbow = 0.18;
  robot.rightElbow = 0.18;

  robot.leftWrist = 0;
  robot.rightWrist = 0;

  robot.leftFingerCurl = 0.15;
  robot.rightFingerCurl = 0.15;

  robot.leftThumbCurl = 0.1;
  robot.rightThumbCurl = 0.1;

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
