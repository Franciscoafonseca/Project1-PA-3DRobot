// ------------------------------------------------------------
// ANIMATION SYSTEM
// Full state-based animation controller for the robot
// ------------------------------------------------------------

// ------------------------------------------------------------
// MAIN UPDATE
// ------------------------------------------------------------
function updateRobot() {
  if (!robot) return;

  updateAnimationState();

  switch (robot.animState) {
    case "runForward":
      applyForwardRunAnimation();
      break;

    case "walkBackward":
      applyBackwardWalkAnimation();
      break;

    case "jumpHeader":
      updateJumpHeaderAnimation();
      break;

    case "kick":
      updateKickAnimation();
      break;

    default:
      applyIdleAnimation();
      break;
  }

  updateFootballPhysics();
}

// ------------------------------------------------------------
// STATE MACHINE
// ------------------------------------------------------------
function updateAnimationState() {
  if (robot.kickActive) {
    robot.animState = "kick";
    return;
  }

  if (robot.jumpHeaderActive) {
    robot.animState = "jumpHeader";
    return;
  }

  if (robot.moving && robot.moveMode === "forward") {
    robot.animState = "runForward";
    return;
  }

  if (robot.moving && robot.moveMode === "backward") {
    robot.animState = "walkBackward";
    return;
  }

  robot.animState = "idle";
}

// ------------------------------------------------------------
// IDLE
// ------------------------------------------------------------
function applyIdleAnimation() {
  if (!robot.idle) return;

  const t = millis() * 0.0015;

  robot.verticalOffset = lerpValue(robot.verticalOffset, 0, 0.08);

  robot.torsoLean = lerpValue(robot.torsoLean, Math.sin(t * 1.4) * 0.01, 0.05);
  robot.headYaw = lerpValue(robot.headYaw, Math.sin(t * 0.7) * 0.02, 0.05);
  robot.headPitch = lerpValue(robot.headPitch, Math.sin(t * 1.0) * 0.015, 0.05);

  const shoulderIdle = Math.sin(t) * 0.015;

  robot.leftShoulder = lerpValue(robot.leftShoulder, shoulderIdle, 0.05);
  robot.rightShoulder = lerpValue(robot.rightShoulder, shoulderIdle, 0.05);

  robot.leftElbow = lerpValue(
    robot.leftElbow,
    0.18 + Math.sin(t * 1.3) * 0.02,
    0.05,
  );
  robot.rightElbow = lerpValue(
    robot.rightElbow,
    0.18 - Math.sin(t * 1.3) * 0.02,
    0.05,
  );

  robot.leftWrist = lerpValue(robot.leftWrist, Math.sin(t * 1.8) * 0.015, 0.05);
  robot.rightWrist = lerpValue(
    robot.rightWrist,
    -Math.sin(t * 1.8) * 0.015,
    0.05,
  );

  robot.leftFingerCurl = lerpValue(robot.leftFingerCurl, 0.15, 0.05);
  robot.rightFingerCurl = lerpValue(robot.rightFingerCurl, 0.15, 0.05);
  robot.leftThumbCurl = lerpValue(robot.leftThumbCurl, 0.1, 0.05);
  robot.rightThumbCurl = lerpValue(robot.rightThumbCurl, 0.1, 0.05);

  robot.leftHip = lerpValue(robot.leftHip, 0, 0.06);
  robot.rightHip = lerpValue(robot.rightHip, 0, 0.06);

  robot.leftKnee = lerpValue(robot.leftKnee, 0.05, 0.06);
  robot.rightKnee = lerpValue(robot.rightKnee, 0.05, 0.06);

  robot.leftAnkle = lerpValue(robot.leftAnkle, 0, 0.06);
  robot.rightAnkle = lerpValue(robot.rightAnkle, 0, 0.06);
}

// ------------------------------------------------------------
// RUN FORWARD
// ------------------------------------------------------------
function applyForwardRunAnimation() {
  if (robot.jumpHeaderActive || robot.kickActive) return;

  robot.walkPhase += 0.24;

  const p = robot.walkPhase;
  const sinP = Math.sin(p);
  const sinOpp = Math.sin(p + Math.PI);
  const cosP = Math.cos(p);
  const cosOpp = Math.cos(p + Math.PI);

  // --------------------------------------------------
  // LEGS
  // perna livre sobe bem mais
  // perna de apoio mantém-se mais estável
  // --------------------------------------------------
  const leftHipTarget = sinP >= 0 ? sinP * 0.66 : sinP * 0.22;

  const rightHipTarget = sinOpp >= 0 ? sinOpp * 0.66 : sinOpp * 0.22;

  const leftKneeTarget =
    0.1 + Math.max(0, sinP) * 1.26 + Math.max(0, -sinP) * 0.04;

  const rightKneeTarget =
    0.1 + Math.max(0, sinOpp) * 1.26 + Math.max(0, -sinOpp) * 0.04;

  const leftAnkleTarget =
    -Math.max(0, sinP) * 0.4 + Math.max(0, -sinP) * 0.03 - cosP * 0.02;

  const rightAnkleTarget =
    -Math.max(0, sinOpp) * 0.4 + Math.max(0, -sinOpp) * 0.03 - cosOpp * 0.02;

  // --------------------------------------------------
  // ARMS
  // --------------------------------------------------
  const leftShoulderTarget = -sinP * 0.78;
  const rightShoulderTarget = -sinOpp * 0.78;

  const leftElbowTarget = 0.94 + Math.max(0, -sinP) * 0.2;
  const rightElbowTarget = 0.94 + Math.max(0, -sinOpp) * 0.2;

  const leftWristTarget = -sinP * 0.12;
  const rightWristTarget = -sinOpp * 0.12;

  // --------------------------------------------------
  // BODY
  // --------------------------------------------------
  const torsoLeanTarget = -0.1;
  const headPitchTarget = 0.01;
  const headYawTarget = 0;

  robot.verticalOffset = Math.abs(Math.sin(p * 2.0)) * 0.8;

  // ligeira oscilação da bacia, mas sem parecer salto
  robot.pelvisDrop = lerpValue(robot.pelvisDrop, 0.6, 0.1);
  robot.pelvisPitch = lerpValue(robot.pelvisPitch, -0.03, 0.1);

  robot.leftHip = lerpValue(robot.leftHip, leftHipTarget, 0.36);
  robot.rightHip = lerpValue(robot.rightHip, rightHipTarget, 0.36);

  robot.leftKnee = lerpValue(robot.leftKnee, leftKneeTarget, 0.42);
  robot.rightKnee = lerpValue(robot.rightKnee, rightKneeTarget, 0.42);

  robot.leftAnkle = lerpValue(robot.leftAnkle, leftAnkleTarget, 0.32);
  robot.rightAnkle = lerpValue(robot.rightAnkle, rightAnkleTarget, 0.32);

  robot.leftShoulder = lerpValue(robot.leftShoulder, leftShoulderTarget, 0.28);
  robot.rightShoulder = lerpValue(
    robot.rightShoulder,
    rightShoulderTarget,
    0.28,
  );

  robot.leftElbow = lerpValue(robot.leftElbow, leftElbowTarget, 0.26);
  robot.rightElbow = lerpValue(robot.rightElbow, rightElbowTarget, 0.26);

  robot.leftWrist = lerpValue(robot.leftWrist, leftWristTarget, 0.18);
  robot.rightWrist = lerpValue(robot.rightWrist, rightWristTarget, 0.18);

  robot.torsoLean = lerpValue(robot.torsoLean, torsoLeanTarget, 0.16);
  robot.headPitch = lerpValue(robot.headPitch, headPitchTarget, 0.12);
  robot.headYaw = lerpValue(robot.headYaw, headYawTarget, 0.12);

  robot.leftFingerCurl = lerpValue(robot.leftFingerCurl, 0.24, 0.1);
  robot.rightFingerCurl = lerpValue(robot.rightFingerCurl, 0.24, 0.1);
  robot.leftThumbCurl = lerpValue(robot.leftThumbCurl, 0.16, 0.1);
  robot.rightThumbCurl = lerpValue(robot.rightThumbCurl, 0.16, 0.1);
}
// ------------------------------------------------------------
// WALK BACKWARD
// ------------------------------------------------------------
function applyBackwardWalkAnimation() {
  if (robot.jumpHeaderActive || robot.kickActive) return;

  robot.walkPhase += 0.14;

  const p = robot.walkPhase;
  const sinP = Math.sin(p);
  const sinOpp = Math.sin(p + Math.PI);

  // shorter, more cautious backward movement
  const leftHipTarget = sinP >= 0 ? -sinP * 0.2 : -sinP * 0.12;
  const rightHipTarget = sinOpp >= 0 ? -sinOpp * 0.2 : -sinOpp * 0.12;

  const leftKneeTarget = 0.1 + Math.max(0, sinP) * 0.26;
  const rightKneeTarget = 0.1 + Math.max(0, sinOpp) * 0.26;

  const leftAnkleTarget = Math.max(0, sinP) * 0.1 - Math.max(0, -sinP) * 0.05;
  const rightAnkleTarget =
    Math.max(0, sinOpp) * 0.1 - Math.max(0, -sinOpp) * 0.05;

  const leftShoulderTarget = -sinP * 0.3;
  const rightShoulderTarget = -sinOpp * 0.3;

  const leftElbowTarget = 0.42 + Math.max(0, -sinP) * 0.12;
  const rightElbowTarget = 0.42 + Math.max(0, -sinOpp) * 0.12;

  const leftWristTarget = -sinP * 0.05;
  const rightWristTarget = -sinOpp * 0.05;

  const torsoLeanTarget = 0.03;
  const headPitchTarget = 0.0;
  const headYawTarget = 0.0;

  robot.verticalOffset = Math.abs(Math.sin(p * 2.0)) * 0.8;

  robot.leftHip = lerpValue(robot.leftHip, leftHipTarget, 0.24);
  robot.rightHip = lerpValue(robot.rightHip, rightHipTarget, 0.24);

  robot.leftKnee = lerpValue(robot.leftKnee, leftKneeTarget, 0.24);
  robot.rightKnee = lerpValue(robot.rightKnee, rightKneeTarget, 0.24);

  robot.leftAnkle = lerpValue(robot.leftAnkle, leftAnkleTarget, 0.18);
  robot.rightAnkle = lerpValue(robot.rightAnkle, rightAnkleTarget, 0.18);

  robot.leftShoulder = lerpValue(robot.leftShoulder, leftShoulderTarget, 0.2);
  robot.rightShoulder = lerpValue(
    robot.rightShoulder,
    rightShoulderTarget,
    0.2,
  );

  robot.leftElbow = lerpValue(robot.leftElbow, leftElbowTarget, 0.18);
  robot.rightElbow = lerpValue(robot.rightElbow, rightElbowTarget, 0.18);

  robot.leftWrist = lerpValue(robot.leftWrist, leftWristTarget, 0.14);
  robot.rightWrist = lerpValue(robot.rightWrist, rightWristTarget, 0.14);

  robot.torsoLean = lerpValue(robot.torsoLean, torsoLeanTarget, 0.1);
  robot.headPitch = lerpValue(robot.headPitch, headPitchTarget, 0.1);
  robot.headYaw = lerpValue(robot.headYaw, headYawTarget, 0.1);

  robot.leftFingerCurl = lerpValue(robot.leftFingerCurl, 0.18, 0.08);
  robot.rightFingerCurl = lerpValue(robot.rightFingerCurl, 0.18, 0.08);
  robot.leftThumbCurl = lerpValue(robot.leftThumbCurl, 0.12, 0.08);
  robot.rightThumbCurl = lerpValue(robot.rightThumbCurl, 0.12, 0.08);
}

// ------------------------------------------------------------
// KICK
// ------------------------------------------------------------
function triggerKick(leg = "right") {
  if (robot.kickActive || robot.jumpHeaderActive) return;
  robot.torsoDrop = 0;
  robot.kickActive = true;
  robot.kickPhase = 0;
  robot.kickingLeg = leg;
  robot.ballAlreadyKicked = false;
}

function updateKickAnimation() {
  if (!robot.kickActive) return;

  robot.kickPhase += 0.085;
  const t = robot.kickPhase;

  robot.verticalOffset = Math.sin(Math.min(t, 1.0) * Math.PI) * 1.5;
  robot.torsoLean = lerpValue(robot.torsoLean, -0.02, 0.14);
  robot.headPitch = lerpValue(robot.headPitch, -0.03, 0.12);
  robot.headYaw = lerpValue(robot.headYaw, 0, 0.1);

  if (robot.kickingLeg === "right") {
    // balance arm movement
    robot.leftShoulder = lerpValue(robot.leftShoulder, -0.4, 0.18);
    robot.rightShoulder = lerpValue(robot.rightShoulder, 0.24, 0.18);
    robot.leftElbow = lerpValue(robot.leftElbow, 0.58, 0.18);
    robot.rightElbow = lerpValue(robot.rightElbow, 0.4, 0.18);

    // support leg
    robot.leftHip = lerpValue(robot.leftHip, -0.08, 0.16);
    robot.leftKnee = lerpValue(robot.leftKnee, 0.2, 0.16);
    robot.leftAnkle = lerpValue(robot.leftAnkle, -0.05, 0.16);

    if (t < 0.3) {
      // wind-up
      robot.rightHip = lerpValue(robot.rightHip, -0.62, 0.28);
      robot.rightKnee = lerpValue(robot.rightKnee, 0.82, 0.28);
      robot.rightAnkle = lerpValue(robot.rightAnkle, 0.1, 0.22);
    } else if (t < 0.62) {
      // strike
      robot.rightHip = lerpValue(robot.rightHip, 0.52, 0.34);
      robot.rightKnee = lerpValue(robot.rightKnee, 0.06, 0.34);
      robot.rightAnkle = lerpValue(robot.rightAnkle, -0.18, 0.28);

      if (!robot.ballAlreadyKicked) {
        robot.ballAlreadyKicked = tryKickBall("right");
      }
    } else {
      // recovery
      robot.rightHip = lerpValue(robot.rightHip, 0.02, 0.18);
      robot.rightKnee = lerpValue(robot.rightKnee, 0.12, 0.18);
      robot.rightAnkle = lerpValue(robot.rightAnkle, 0.0, 0.18);

      robot.leftHip = lerpValue(robot.leftHip, 0.0, 0.18);
      robot.leftKnee = lerpValue(robot.leftKnee, 0.05, 0.18);
      robot.leftAnkle = lerpValue(robot.leftAnkle, 0.0, 0.18);
    }
  } else {
    robot.rightShoulder = lerpValue(robot.rightShoulder, -0.4, 0.18);
    robot.leftShoulder = lerpValue(robot.leftShoulder, 0.24, 0.18);
    robot.rightElbow = lerpValue(robot.rightElbow, 0.58, 0.18);
    robot.leftElbow = lerpValue(robot.leftElbow, 0.4, 0.18);

    robot.rightHip = lerpValue(robot.rightHip, -0.08, 0.16);
    robot.rightKnee = lerpValue(robot.rightKnee, 0.2, 0.16);
    robot.rightAnkle = lerpValue(robot.rightAnkle, -0.05, 0.16);

    if (t < 0.3) {
      robot.leftHip = lerpValue(robot.leftHip, -0.62, 0.28);
      robot.leftKnee = lerpValue(robot.leftKnee, 0.82, 0.28);
      robot.leftAnkle = lerpValue(robot.leftAnkle, 0.1, 0.22);
    } else if (t < 0.62) {
      robot.leftHip = lerpValue(robot.leftHip, 0.52, 0.34);
      robot.leftKnee = lerpValue(robot.leftKnee, 0.06, 0.34);
      robot.leftAnkle = lerpValue(robot.leftAnkle, -0.18, 0.28);

      if (!robot.ballAlreadyKicked) {
        robot.ballAlreadyKicked = tryKickBall("left");
      }
    } else {
      robot.leftHip = lerpValue(robot.leftHip, 0.02, 0.18);
      robot.leftKnee = lerpValue(robot.leftKnee, 0.12, 0.18);
      robot.leftAnkle = lerpValue(robot.leftAnkle, 0.0, 0.18);

      robot.rightHip = lerpValue(robot.rightHip, 0.0, 0.18);
      robot.rightKnee = lerpValue(robot.rightKnee, 0.05, 0.18);
      robot.rightAnkle = lerpValue(robot.rightAnkle, 0.0, 0.18);
    }
  }

  if (robot.kickPhase >= 1.0) {
    robot.kickActive = false;
    robot.kickPhase = 0;
    robot.ballAlreadyKicked = false;
  }
}

// ------------------------------------------------------------
// JUMP HEADER
// ------------------------------------------------------------
function triggerJumpHeader() {
  if (robot.jumpHeaderActive || robot.kickActive) return;

  robot.jumpHeaderActive = true;
  robot.jumpHeaderPhase = 0;
  robot._headerHitDone = false;

  robot.moving = false;
  robot.moveMode = "none";

  robot.verticalOffset = 0;
  robot.pelvisDrop = 0;
  robot.pelvisPitch = 0;
}

function updateJumpHeaderAnimation() {
  if (!robot.jumpHeaderActive) return;

  robot.jumpHeaderPhase += 0.036;

  const t = robot.jumpHeaderPhase;

  // neste salto não usamos queda artificial da bacia
  robot.pelvisDrop = 0;
  robot.pelvisPitch = 0;

  // --------------------------------------------------
  // 1) PREPARAÇÃO
  // corpo inteiro baixa
  // canelas quase verticais
  // braços recuam bastante para dar impulso
  // --------------------------------------------------
  if (t < 0.24) {
    const torsoLeanTarget = -0.2;

    robot.verticalOffset = lerpValue(robot.verticalOffset, 14.0, 0.18);

    robot.torsoLean = lerpValue(robot.torsoLean, torsoLeanTarget, 0.18);
    robot.headPitch = lerpValue(robot.headPitch, -0.04, 0.14);
    robot.headYaw = lerpValue(robot.headYaw, 0.0, 0.12);

    // coxa dobra, canela mantém-se quase vertical
    applyGroundedHeaderLegPose(
      0.65, // hipTarget
      torsoLeanTarget,
      0.02, // shinWorldTarget
      0.0, // ankleTarget
      0.18,
      0.18,
      0.12,
    );

    // braços bem para trás
    robot.leftShoulder = lerpValue(robot.leftShoulder, -0.95, 0.2);
    robot.rightShoulder = lerpValue(robot.rightShoulder, -0.95, 0.2);

    robot.leftElbow = lerpValue(robot.leftElbow, 1.05, 0.18);
    robot.rightElbow = lerpValue(robot.rightElbow, 1.05, 0.18);

    robot.leftWrist = lerpValue(robot.leftWrist, -0.12, 0.14);
    robot.rightWrist = lerpValue(robot.rightWrist, 0.12, 0.14);
  }

  // --------------------------------------------------
  // 2) IMPULSO
  // extensão forte
  // braços sobem para ajudar o salto
  // --------------------------------------------------
  else if (t < 0.42) {
    const k = (t - 0.24) / 0.16;
    const jumpK = Math.sin(k * Math.PI * 0.5);

    robot.verticalOffset = lerpValue(14.0, -36.0, jumpK);

    robot.torsoLean = lerpValue(robot.torsoLean, -0.02, 0.2);
    robot.headPitch = lerpValue(robot.headPitch, -0.1, 0.16);
    robot.headYaw = lerpValue(robot.headYaw, 0.0, 0.12);

    // extensão quase total
    robot.leftHip = lerpValue(robot.leftHip, 0.1, 0.24);
    robot.rightHip = lerpValue(robot.rightHip, 0.1, 0.24);

    robot.leftKnee = lerpValue(robot.leftKnee, 0.06, 0.24);
    robot.rightKnee = lerpValue(robot.rightKnee, 0.06, 0.24);

    robot.leftAnkle = lerpValue(robot.leftAnkle, 0.18, 0.18);
    robot.rightAnkle = lerpValue(robot.rightAnkle, 0.18, 0.18);

    // braços sobem forte
    robot.leftShoulder = lerpValue(robot.leftShoulder, 0.68, 0.22);
    robot.rightShoulder = lerpValue(robot.rightShoulder, 0.68, 0.22);

    robot.leftElbow = lerpValue(robot.leftElbow, 0.52, 0.18);
    robot.rightElbow = lerpValue(robot.rightElbow, 0.52, 0.18);

    robot.leftWrist = lerpValue(robot.leftWrist, 0.08, 0.14);
    robot.rightWrist = lerpValue(robot.rightWrist, -0.08, 0.14);
  }

  // --------------------------------------------------
  // 3) TOPO / CABECEAMENTO
  // mais tempo no ar e cabeceamento mais legível
  // --------------------------------------------------
  else if (t < 0.64) {
    robot.verticalOffset = -38.0;

    // em vez de inclinar para trás, fecha ligeiramente para a frente
    robot.torsoLean = lerpValue(robot.torsoLean, -0.1, 0.16);

    // cabeça ataca mais a bola
    robot.headPitch = lerpValue(robot.headPitch, -0.66, 0.24);
    robot.headYaw = lerpValue(robot.headYaw, 0.0, 0.1);

    // pernas fletem um pouco no ar
    robot.leftHip = lerpValue(robot.leftHip, 0.16, 0.12);
    robot.rightHip = lerpValue(robot.rightHip, 0.16, 0.12);

    robot.leftKnee = lerpValue(robot.leftKnee, 0.28, 0.12);
    robot.rightKnee = lerpValue(robot.rightKnee, 0.28, 0.12);

    robot.leftAnkle = lerpValue(robot.leftAnkle, -0.1, 0.1);
    robot.rightAnkle = lerpValue(robot.rightAnkle, -0.1, 0.1);
    // braços abertos
    robot.leftShoulder = lerpValue(robot.leftShoulder, 0.92, 0.16);
    robot.rightShoulder = lerpValue(robot.rightShoulder, 0.92, 0.16);

    robot.leftShoulderSpread = lerpValue(robot.leftShoulderSpread, 0.95, 0.18);
    robot.rightShoulderSpread = lerpValue(
      robot.rightShoulderSpread,
      0.95,
      0.18,
    );

    robot.leftElbow = lerpValue(robot.leftElbow, 1.1, 0.16);
    robot.rightElbow = lerpValue(robot.rightElbow, 1.1, 0.16);

    robot.leftWrist = lerpValue(robot.leftWrist, -0.14, 0.12);
    robot.rightWrist = lerpValue(robot.rightWrist, 0.14, 0.12);

    robot.leftFingerCurl = lerpValue(robot.leftFingerCurl, 0.05, 0.16);
    robot.rightFingerCurl = lerpValue(robot.rightFingerCurl, 0.05, 0.16);

    robot.leftThumbCurl = lerpValue(robot.leftThumbCurl, 0.02, 0.16);
    robot.rightThumbCurl = lerpValue(robot.rightThumbCurl, 0.02, 0.16);

    tryHeadBall();
  }

  // --------------------------------------------------
  // 4) DESCIDA
  // corpo mais direito antes do toque
  // --------------------------------------------------
  else if (t < 0.8) {
    const k = (t - 0.64) / 0.2;
    const torsoLeanTarget = -0.02;

    robot.verticalOffset = lerpValue(-38.0, -6.0, k);

    // torso mais direito
    robot.torsoLean = lerpValue(robot.torsoLean, torsoLeanTarget, 0.16);
    robot.headPitch = lerpValue(robot.headPitch, -0.1, 0.14);
    robot.headYaw = lerpValue(robot.headYaw, 0.0, 0.12);

    robot.leftHip = lerpValue(robot.leftHip, 0.24, 0.14);
    robot.rightHip = lerpValue(robot.rightHip, 0.24, 0.14);

    robot.leftKnee = lerpValue(robot.leftKnee, 0.34, 0.14);
    robot.rightKnee = lerpValue(robot.rightKnee, 0.34, 0.14);

    // pé já preparado para o toque
    robot.leftAnkle = lerpValue(robot.leftAnkle, 0.12, 0.16);
    robot.rightAnkle = lerpValue(robot.rightAnkle, 0.12, 0.16);

    robot.leftShoulder = lerpValue(robot.leftShoulder, 0.42, 0.14);
    robot.rightShoulder = lerpValue(robot.rightShoulder, 0.42, 0.14);

    robot.leftShoulderSpread = lerpValue(robot.leftShoulderSpread, 0.52, 0.14);
    robot.rightShoulderSpread = lerpValue(
      robot.rightShoulderSpread,
      0.52,
      0.14,
    );

    robot.leftElbow = lerpValue(robot.leftElbow, 0.96, 0.12);
    robot.rightElbow = lerpValue(robot.rightElbow, 0.96, 0.12);

    robot.leftWrist = lerpValue(robot.leftWrist, -0.08, 0.1);
    robot.rightWrist = lerpValue(robot.rightWrist, 0.08, 0.1);
  }

  // --------------------------------------------------
  // 5) CONTACTO + ABSORÇÃO
  // pés quase colados ao chão, joelhos fletem,
  // quem desce mais é o tronco
  // --------------------------------------------------
  else if (t < 1.02) {
    // depois do toque, não afundar a raiz toda
    robot.verticalOffset = lerpValue(robot.verticalOffset, 10.0, 0.12);

    // o torso é que baixa mais
    robot.torsoDrop = lerpValue(robot.torsoDrop, 16.0, 0.2);

    robot.torsoLean = lerpValue(robot.torsoLean, -0.12, 0.16);
    robot.headPitch = lerpValue(robot.headPitch, -0.03, 0.14);
    robot.headYaw = lerpValue(robot.headYaw, 0.0, 0.12);

    // perna realmente flete
    // perna flete mais e avança mais
    robot.leftHip = lerpValue(robot.leftHip, 0.52, 0.18);
    robot.rightHip = lerpValue(robot.rightHip, 0.52, 0.18);

    robot.leftKnee = lerpValue(robot.leftKnee, 0.92, 0.18);
    robot.rightKnee = lerpValue(robot.rightKnee, 0.92, 0.18);

    // MUITO IMPORTANTE:
    // acima de 0.08 para compensar o -0.08 fixo do pé
    // e manter a sola plana
    robot.leftAnkle = lerpValue(robot.leftAnkle, 0.18, 0.22);
    robot.rightAnkle = lerpValue(robot.rightAnkle, 0.18, 0.22);

    // braços à frente
    robot.leftShoulder = lerpValue(robot.leftShoulder, 0.26, 0.16);
    robot.rightShoulder = lerpValue(robot.rightShoulder, 0.26, 0.16);

    robot.leftShoulderSpread = lerpValue(robot.leftShoulderSpread, 0.08, 0.12);
    robot.rightShoulderSpread = lerpValue(
      robot.rightShoulderSpread,
      0.08,
      0.12,
    );

    robot.leftElbow = lerpValue(robot.leftElbow, 0.86, 0.14);
    robot.rightElbow = lerpValue(robot.rightElbow, 0.86, 0.14);

    robot.leftWrist = lerpValue(robot.leftWrist, -0.02, 0.1);
    robot.rightWrist = lerpValue(robot.rightWrist, 0.02, 0.1);

    robot.leftFingerCurl = lerpValue(robot.leftFingerCurl, 0.1, 0.12);
    robot.rightFingerCurl = lerpValue(robot.rightFingerCurl, 0.1, 0.12);

    robot.leftThumbCurl = lerpValue(robot.leftThumbCurl, 0.05, 0.12);
    robot.rightThumbCurl = lerpValue(robot.rightThumbCurl, 0.05, 0.12);
  }

  // --------------------------------------------------
  // 6) RECUPERAÇÃO
  // volta ao neutro
  // --------------------------------------------------
  else {
    robot.verticalOffset = lerpValue(robot.verticalOffset, 0.0, 0.14);

    robot.torsoLean = lerpValue(robot.torsoLean, 0.0, 0.1);
    robot.headPitch = lerpValue(robot.headPitch, 0.0, 0.1);
    robot.headYaw = lerpValue(robot.headYaw, 0.0, 0.1);

    robot.leftHip = lerpValue(robot.leftHip, 0.0, 0.1);
    robot.rightHip = lerpValue(robot.rightHip, 0.0, 0.1);

    robot.leftKnee = lerpValue(robot.leftKnee, 0.08, 0.08);
    robot.rightKnee = lerpValue(robot.rightKnee, 0.08, 0.08);

    // mantém o pé mais estável mais tempo
    robot.leftAnkle = lerpValue(robot.leftAnkle, 0.1, 0.1);
    robot.rightAnkle = lerpValue(robot.rightAnkle, 0.1, 0.1);

    robot.leftShoulder = lerpValue(robot.leftShoulder, 0.0, 0.14);
    robot.rightShoulder = lerpValue(robot.rightShoulder, 0.0, 0.14);

    robot.leftShoulderSpread = lerpValue(robot.leftShoulderSpread, 0.0, 0.14);
    robot.rightShoulderSpread = lerpValue(robot.rightShoulderSpread, 0.0, 0.14);

    // cotovelo recolhe mais rápido
    robot.leftElbow = lerpValue(robot.leftElbow, 0.22, 0.18);
    robot.rightElbow = lerpValue(robot.rightElbow, 0.22, 0.18);
    robot.torsoDrop = lerpValue(robot.torsoDrop, 0.0, 0.16);
    // pulso acompanha rápido
    robot.leftWrist = lerpValue(robot.leftWrist, 0.0, 0.16);
    robot.rightWrist = lerpValue(robot.rightWrist, 0.0, 0.16);

    robot.leftFingerCurl = lerpValue(robot.leftFingerCurl, 0.15, 0.12);
    robot.rightFingerCurl = lerpValue(robot.rightFingerCurl, 0.15, 0.12);

    robot.leftThumbCurl = lerpValue(robot.leftThumbCurl, 0.1, 0.12);
    robot.rightThumbCurl = lerpValue(robot.rightThumbCurl, 0.1, 0.12);
  }

  if (robot.jumpHeaderPhase >= 1.18) {
    robot.jumpHeaderActive = false;
    robot.jumpHeaderPhase = 0;
    robot.verticalOffset = 0;
    robot.pelvisDrop = 0;
    robot.pelvisPitch = 0;
    robot._headerHitDone = false;
  }
}

function applyGroundedHeaderLegPose(
  hipTarget,
  torsoLeanTarget,
  shinWorldTarget = 0.02,
  ankleTarget = 0.0,
  hipLerp = 0.16,
  kneeLerp = 0.16,
  ankleLerp = 0.12,
) {
  // Queremos:
  // worldShinAngle ~= 0  (canela quase perpendicular ao chão)
  //
  // No teu rig:
  // worldShinAngle ~= torsoLean + hipAngle - kneeAngle
  //
  // logo:
  // kneeAngle = torsoLean + hipAngle - shinWorldTarget

  const kneeTarget = clampValue(
    hipTarget - torsoLeanTarget - shinWorldTarget,
    0.02,
    1.2,
  );

  robot.leftHip = lerpValue(robot.leftHip, hipTarget, hipLerp);
  robot.rightHip = lerpValue(robot.rightHip, hipTarget, hipLerp);

  robot.leftKnee = lerpValue(robot.leftKnee, kneeTarget, kneeLerp);
  robot.rightKnee = lerpValue(robot.rightKnee, kneeTarget, kneeLerp);

  robot.leftAnkle = lerpValue(robot.leftAnkle, ankleTarget, ankleLerp);
  robot.rightAnkle = lerpValue(robot.rightAnkle, ankleTarget, ankleLerp);
}

// ------------------------------------------------------------
// BALL INTERACTION
// ------------------------------------------------------------
function tryKickBall(leg) {
  if (!football) return false;

  const footPos = getFootWorldPosition(leg);
  const dist = Vec3.distance(football.pos, footPos);

  if (dist < football.radius + 30) {
    const dir = Vec3.normalize([
      Math.sin(robot.yaw),
      -0.06,
      Math.cos(robot.yaw),
    ]);

    football.velocity = [dir[0] * 13.5, -1.9, dir[2] * 13.5];
    return true;
  }

  return false;
}

function tryHeadBall() {
  if (!football) return;
  if (robot._headerHitDone) return;

  const headPos = getHeadWorldPosition();
  const dist = Vec3.distance(football.pos, headPos);

  if (dist < football.radius + 26) {
    const dir = Vec3.normalize([
      Math.sin(robot.yaw),
      -0.3,
      Math.cos(robot.yaw),
    ]);

    football.velocity = [dir[0] * 7.0, dir[1] * 8.0, dir[2] * 7.0];

    robot._headerHitDone = true;
  }
}

// ------------------------------------------------------------
// FOOT / HEAD WORLD POSITION HELPERS
// Self-contained helpers to avoid missing references
// ------------------------------------------------------------
function getFootWorldPosition(leg) {
  const left = leg === "left";
  const side = left ? -1 : 1;

  const hipAngle = left ? robot.leftHip : robot.rightHip;
  const kneeAngle = left ? robot.leftKnee : robot.rightKnee;
  const ankleAngle = left ? robot.leftAnkle || 0 : robot.rightAnkle || 0;

  // approximate lengths based on current geometry hierarchy
  const upperLen = 65; // thighStart -> kneeMount
  const lowerLen = 63; // shinStart -> ankleMount
  const footLen = 18; // forward toe approximation

  // hip position in local robot space
  const hipLocal = [17 * side, 96, 0];

  // build sagittal-plane approximation
  // leg points down in +Y, rotation around X affects Y/Z
  let y = hipLocal[1];
  let z = hipLocal[2];

  // thigh
  y += Math.cos(hipAngle) * upperLen;
  z += Math.sin(hipAngle) * upperLen;

  // shin: bottom.js should use rotateX(-kneeAngle), so the shin angle is hip - knee
  const shinAngle = hipAngle - kneeAngle;
  y += Math.cos(shinAngle) * lowerLen;
  z += Math.sin(shinAngle) * lowerLen;

  // foot/toe direction: ankle adjustment, slight default boot pitch
  const footAngle = shinAngle + ankleAngle - 0.08;
  y += Math.sin(footAngle) * 2.0;
  z += Math.cos(footAngle) * footLen;

  // rotate whole local point by torso lean around X
  const lean = robot.torsoLean || 0;
  const yLean = y * Math.cos(lean) - z * Math.sin(lean);
  const zLean = y * Math.sin(lean) + z * Math.cos(lean);

  // rotate by yaw around Y
  const xWorld =
    robot.pos[0] +
    hipLocal[0] * Math.cos(robot.yaw) +
    zLean * Math.sin(robot.yaw);

  const zWorld =
    robot.pos[2] -
    hipLocal[0] * Math.sin(robot.yaw) +
    zLean * Math.cos(robot.yaw);

  const yWorld = robot.pos[1] + yLean;

  return [xWorld, yWorld, zWorld];
}

function getHeadWorldPosition() {
  // approximate head/front forehead point
  const localX = 0;
  const localY = -90;
  const localZ = 24;

  const lean = robot.torsoLean || 0;

  const yLean = localY * Math.cos(lean) - localZ * Math.sin(lean);
  const zLean = localY * Math.sin(lean) + localZ * Math.cos(lean);

  const xWorld =
    robot.pos[0] + localX * Math.cos(robot.yaw) + zLean * Math.sin(robot.yaw);

  const zWorld =
    robot.pos[2] - localX * Math.sin(robot.yaw) + zLean * Math.cos(robot.yaw);

  const yWorld = robot.pos[1] + yLean;

  return [xWorld, yWorld, zWorld];
}

// ------------------------------------------------------------
// FOOTBALL PHYSICS
// ------------------------------------------------------------
function updateFootballPhysics() {
  if (!football) return;

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
