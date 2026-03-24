// js/input.js
// ============================================================
// INPUT SYSTEM
// Controls robot movement, joints, kick, and camera orbit/zoom
// ============================================================

const Input = {
  keys: Object.create(null),

  config: {
    moveSpeed: 2.4,
    rotateSpeed: 0.03,
    jointSpeed: 0.025,
    headSpeed: 0.02,
    clawSpeed: 0.02,

    camYawSpeed: 0.02,
    camPitchSpeed: 0.015,
    camZoomSpeed: 8,
  },
};

// ------------------------------------------------------------
// INIT
// ------------------------------------------------------------
function initInput() {
  // Nothing required for now.
}

// ------------------------------------------------------------
// KEY HELPERS
// ------------------------------------------------------------
function isKeyDownCode(code) {
  return !!Input.keys[code];
}

function isKeyDownChar(ch) {
  return !!Input.keys[ch.toLowerCase()];
}

// ------------------------------------------------------------
// EVENT HOOKS
// Call these from sketch.js keyPressed/keyReleased
// ------------------------------------------------------------
function handleKeyPressed(k, keyCodeValue) {
  if (typeof k === "string") {
    Input.keys[k.toLowerCase()] = true;
  }
  Input.keys[keyCodeValue] = true;

  // one-shot actions
  if (k === " " || keyCodeValue === 32) {
    triggerKick("right");
  }

  if (k === "f" || k === "F") {
    triggerKick("left");
  }

  if (k === "g" || k === "G") {
    triggerKick("right");
  }

  if (k === "r" || k === "R") {
    resetRobotPose();
  }

  if (k === "c" || k === "C") {
    Scene.spotlightFollowRobot = !Scene.spotlightFollowRobot;
  }

  if (k === "p" || k === "P") {
    robot.idle = !robot.idle;
  }
}

function handleKeyReleased(k, keyCodeValue) {
  if (typeof k === "string") {
    Input.keys[k.toLowerCase()] = false;
  }
  Input.keys[keyCodeValue] = false;
}

// ------------------------------------------------------------
// MAIN UPDATE
// Call this every frame inside draw()
// ------------------------------------------------------------
function updateInput() {
  if (!robot) return;

  updateRobotMovementInput();
  updateRobotJointInput();
  updateCameraInput();
}

// ------------------------------------------------------------
// ROBOT MOVEMENT
// ------------------------------------------------------------
function updateRobotMovementInput() {
  const moveSpeed = Input.config.moveSpeed;
  const rotateSpeed = Input.config.rotateSpeed;

  robot.moving = false;

  // W / S = move forward / backward
  if (isKeyDownChar("w")) {
    robot.pos[0] += Math.sin(robot.yaw) * moveSpeed;
    robot.pos[2] += Math.cos(robot.yaw) * moveSpeed;
    robot.moving = true;
  }

  if (isKeyDownChar("s")) {
    robot.pos[0] -= Math.sin(robot.yaw) * moveSpeed;
    robot.pos[2] -= Math.cos(robot.yaw) * moveSpeed;
    robot.moving = true;
  }

  // A / D = rotate body
  if (isKeyDownChar("a")) {
    robot.yaw += rotateSpeed;
  }

  if (isKeyDownChar("d")) {
    robot.yaw -= rotateSpeed;
  }
}

// ------------------------------------------------------------
// ROBOT JOINTS
// ------------------------------------------------------------
function updateRobotJointInput() {
  const jointSpeed = Input.config.jointSpeed;
  const headSpeed = Input.config.headSpeed;
  const clawSpeed = Input.config.clawSpeed;

  // Head Q / E
  if (isKeyDownChar("q")) {
    robot.headYaw += headSpeed;
  }

  if (isKeyDownChar("e")) {
    robot.headYaw -= headSpeed;
  }

  // Shoulders J / L
  if (isKeyDownChar("j")) {
    robot.leftShoulder -= jointSpeed;
    robot.rightShoulder += jointSpeed;
  }

  if (isKeyDownChar("l")) {
    robot.leftShoulder += jointSpeed;
    robot.rightShoulder -= jointSpeed;
  }

  // Elbows I / K
  if (isKeyDownChar("i")) {
    robot.leftElbow += jointSpeed;
    robot.rightElbow -= jointSpeed;
  }

  if (isKeyDownChar("k")) {
    robot.leftElbow -= jointSpeed;
    robot.rightElbow += jointSpeed;
  }

  // Hips U / O
  if (isKeyDownChar("u")) {
    robot.leftHip -= jointSpeed;
    robot.rightHip += jointSpeed;
  }

  if (isKeyDownChar("o")) {
    robot.leftHip += jointSpeed;
    robot.rightHip -= jointSpeed;
  }

  // Knees N / M
  if (isKeyDownChar("n")) {
    robot.leftKnee += jointSpeed;
    robot.rightKnee -= jointSpeed;
  }

  if (isKeyDownChar("m")) {
    robot.leftKnee -= jointSpeed;
    robot.rightKnee += jointSpeed;
  }

  // Optional claw Z / X
  if (robot.leftClaw !== undefined && robot.rightClaw !== undefined) {
    if (isKeyDownChar("z")) {
      robot.leftClaw += clawSpeed;
      robot.rightClaw += clawSpeed;
    }

    if (isKeyDownChar("x")) {
      robot.leftClaw -= clawSpeed;
      robot.rightClaw -= clawSpeed;
    }
  }

  clampRobotJoints();
}

// ------------------------------------------------------------
// CAMERA
// Arrow keys orbit camera
// 1 / 2 zoom
// ------------------------------------------------------------
function updateCameraInput() {
  if (!Scene || !Scene.camera) return;

  const yawSpeed = Input.config.camYawSpeed;
  const pitchSpeed = Input.config.camPitchSpeed;
  const zoomSpeed = Input.config.camZoomSpeed;

  if (isKeyDownCode(LEFT_ARROW)) {
    Scene.camera.yaw -= yawSpeed;
  }

  if (isKeyDownCode(RIGHT_ARROW)) {
    Scene.camera.yaw += yawSpeed;
  }

  if (isKeyDownCode(UP_ARROW)) {
    Scene.camera.pitch -= pitchSpeed;
  }

  if (isKeyDownCode(DOWN_ARROW)) {
    Scene.camera.pitch += pitchSpeed;
  }

  if (isKeyDownChar("1")) {
    Scene.camera.distance -= zoomSpeed;
  }

  if (isKeyDownChar("2")) {
    Scene.camera.distance += zoomSpeed;
  }

  Scene.camera.pitch = clampValue(Scene.camera.pitch, -1.05, 0.45);
  Scene.camera.distance = clampValue(Scene.camera.distance, 220, 1200);
}

// ------------------------------------------------------------
// LIMITS
// ------------------------------------------------------------
function clampRobotJoints() {
  robot.headYaw = clampValue(robot.headYaw, -0.9, 0.9);
  robot.headPitch = clampValue(robot.headPitch, -0.35, 0.35);

  robot.leftShoulder = clampValue(robot.leftShoulder, -1.2, 1.2);
  robot.rightShoulder = clampValue(robot.rightShoulder, -1.2, 1.2);

  robot.leftElbow = clampValue(robot.leftElbow, -0.1, 1.2);
  robot.rightElbow = clampValue(robot.rightElbow, -1.2, 0.1);

  robot.leftHip = clampValue(robot.leftHip, -0.8, 0.8);
  robot.rightHip = clampValue(robot.rightHip, -0.8, 0.8);

  robot.leftKnee = clampValue(robot.leftKnee, -0.05, 1.0);
  robot.rightKnee = clampValue(robot.rightKnee, -1.0, 0.05);

  if (robot.leftClaw !== undefined && robot.rightClaw !== undefined) {
    robot.leftClaw = clampValue(robot.leftClaw, 0.05, 0.8);
    robot.rightClaw = clampValue(robot.rightClaw, 0.05, 0.8);
  }
}

// ------------------------------------------------------------
// SMALL UTILS
// ------------------------------------------------------------
function clampValue(v, minV, maxV) {
  return Math.max(minV, Math.min(maxV, v));
}
