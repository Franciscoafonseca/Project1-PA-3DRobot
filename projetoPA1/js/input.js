// js/input.js
// ============================================================
// INPUT SYSTEM
// Controls robot movement, joints, kick, jump header, and camera
// ============================================================

const Input = {
  keys: Object.create(null),

  config: {
    moveSpeed: 10,
    backwardSpeedFactor: 0.65,
    rotateSpeed: 0.03,

    jointSpeed: 0.025,
    headSpeed: 0.02,
    fingerSpeed: 0.02,

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

  if (k === "z" || k === "Z") {
    triggerJumpHeader();
  }

  if (k === "r" || k === "R") {
    resetRobotPose();
  }

  if (k === "c" || k === "C") {
    if (typeof Scene !== "undefined") {
      Scene.spotlightFollowRobot = !Scene.spotlightFollowRobot;
    }
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
  const backwardSpeed = moveSpeed * Input.config.backwardSpeedFactor;
  const rotateSpeed = Input.config.rotateSpeed;

  robot.moving = false;
  robot.moveMode = "none";

  // while jumping header, allow body rotation only
  if (robot.jumpHeaderActive) {
    if (isKeyDownChar("a")) {
      robot.yaw += rotateSpeed;
    }

    if (isKeyDownChar("d")) {
      robot.yaw -= rotateSpeed;
    }

    return;
  }

  // W = run forward
  if (isKeyDownChar("w")) {
    robot.pos[0] += Math.sin(robot.yaw) * moveSpeed;
    robot.pos[2] += Math.cos(robot.yaw) * moveSpeed;
    robot.moving = true;
    robot.moveMode = "forward";
  }

  // S = walk backward
  if (isKeyDownChar("s")) {
    robot.pos[0] -= Math.sin(robot.yaw) * backwardSpeed;
    robot.pos[2] -= Math.cos(robot.yaw) * backwardSpeed;
    robot.moving = true;
    robot.moveMode = "backward";
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
// Manual articulation controls
// ------------------------------------------------------------
function updateRobotJointInput() {
  const jointSpeed = Input.config.jointSpeed;
  const headSpeed = Input.config.headSpeed;
  const fingerSpeed = Input.config.fingerSpeed;

  // Head yaw Q / E
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
    robot.rightElbow += jointSpeed;
  }

  if (isKeyDownChar("k")) {
    robot.leftElbow -= jointSpeed;
    robot.rightElbow -= jointSpeed;
  }

  // Wrists T / Y
  if (isKeyDownChar("t")) {
    robot.leftWrist += jointSpeed;
    robot.rightWrist += jointSpeed;
  }

  if (isKeyDownChar("y")) {
    robot.leftWrist -= jointSpeed;
    robot.rightWrist -= jointSpeed;
  }

  // Hips U / O
  if (isKeyDownChar("u")) {
    robot.leftHip -= jointSpeed;
    robot.rightHip -= jointSpeed;
  }

  if (isKeyDownChar("o")) {
    robot.leftHip += jointSpeed;
    robot.rightHip += jointSpeed;
  }

  // Knees N / M
  if (isKeyDownChar("n")) {
    robot.leftKnee += jointSpeed;
    robot.rightKnee += jointSpeed;
  }

  if (isKeyDownChar("m")) {
    robot.leftKnee -= jointSpeed;
    robot.rightKnee -= jointSpeed;
  }

  // Ankles B / V
  if (isKeyDownChar("b")) {
    robot.leftAnkle += jointSpeed;
    robot.rightAnkle += jointSpeed;
  }

  if (isKeyDownChar("v")) {
    robot.leftAnkle -= jointSpeed;
    robot.rightAnkle -= jointSpeed;
  }

  // Fingers Z/X are now used by jump header, so use F/G for fingers
  if (isKeyDownChar("f")) {
    robot.leftFingerCurl += fingerSpeed;
    robot.rightFingerCurl += fingerSpeed;
    robot.leftThumbCurl += fingerSpeed * 0.7;
    robot.rightThumbCurl += fingerSpeed * 0.7;
  }

  if (isKeyDownChar("g")) {
    robot.leftFingerCurl -= fingerSpeed;
    robot.rightFingerCurl -= fingerSpeed;
    robot.leftThumbCurl -= fingerSpeed * 0.7;
    robot.rightThumbCurl -= fingerSpeed * 0.7;
  }

  clampRobotJoints();
}

// ------------------------------------------------------------
// CAMERA
// Arrow keys orbit camera
// 1 / 2 zoom
// ------------------------------------------------------------
function updateCameraInput() {
  if (typeof Scene === "undefined" || !Scene.camera) return;

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
  robot.headYaw = clampValue(robot.headYaw, -1.0, 1.0);
  robot.headPitch = clampValue(robot.headPitch, -0.45, 0.35);

  robot.leftShoulder = clampValue(robot.leftShoulder, -1.3, 1.3);
  robot.rightShoulder = clampValue(robot.rightShoulder, -1.3, 1.3);

  robot.leftShoulderSpread = clampValue(robot.leftShoulderSpread, -1.2, 1.2);
  robot.rightShoulderSpread = clampValue(robot.rightShoulderSpread, -1.2, 1.2);

  robot.leftWrist = clampValue(robot.leftWrist, -0.5, 0.5);
  robot.rightWrist = clampValue(robot.rightWrist, -0.5, 0.5);

  robot.leftHip = clampValue(robot.leftHip, -0.9, 0.9);
  robot.rightHip = clampValue(robot.rightHip, -0.9, 0.9);

  robot.leftElbow = clampValue(robot.leftElbow, 0.0, 1.3);
  robot.rightElbow = clampValue(robot.rightElbow, 0.0, 1.3);

  robot.leftKnee = clampValue(robot.leftKnee, 0.0, 1.3);
  robot.rightKnee = clampValue(robot.rightKnee, 0.0, 1.3);

  robot.leftAnkle = clampValue(robot.leftAnkle || 0, -0.45, 0.3);
  robot.rightAnkle = clampValue(robot.rightAnkle || 0, -0.45, 0.3);

  robot.leftFingerCurl = clampValue(robot.leftFingerCurl, 0.05, 0.75);
  robot.rightFingerCurl = clampValue(robot.rightFingerCurl, 0.05, 0.75);

  robot.leftThumbCurl = clampValue(robot.leftThumbCurl, 0.02, 0.7);
  robot.rightThumbCurl = clampValue(robot.rightThumbCurl, 0.02, 0.7);
}

// ------------------------------------------------------------
// SMALL UTILS
// ------------------------------------------------------------
function clampValue(v, minV, maxV) {
  return Math.max(minV, Math.min(maxV, v));
}
