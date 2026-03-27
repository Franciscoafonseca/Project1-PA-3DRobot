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

  robot.leftWrist = lerpValue(robot.leftWrist, 0, 0.08);
  robot.rightWrist = lerpValue(robot.rightWrist, 0, 0.08);

  robot.leftFingerCurl = lerpValue(
    robot.leftFingerCurl,
    0.15 + Math.sin(t * 1.2) * 0.02,
    0.05,
  );
  robot.rightFingerCurl = lerpValue(
    robot.rightFingerCurl,
    0.15 + Math.sin(t * 1.2) * 0.02,
    0.05,
  );

  robot.leftThumbCurl = lerpValue(robot.leftThumbCurl, 0.1, 0.05);
  robot.rightThumbCurl = lerpValue(robot.rightThumbCurl, 0.1, 0.05);

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

  robot.leftHip = lerpValue(robot.leftHip, swingL, 0.28);
  robot.rightHip = lerpValue(robot.rightHip, swingR, 0.28);

  robot.leftKnee = lerpValue(robot.leftKnee, kneeL, 0.28);
  robot.rightKnee = lerpValue(robot.rightKnee, kneeR, 0.28);

  robot.leftShoulder = lerpValue(robot.leftShoulder, -swingL * 0.75, 0.28);
  robot.rightShoulder = lerpValue(robot.rightShoulder, -swingR * 0.75, 0.28);

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

  robot.leftWrist = lerpValue(
    robot.leftWrist,
    Math.sin(robot.walkPhase) * 0.08,
    0.15,
  );
  robot.rightWrist = lerpValue(
    robot.rightWrist,
    Math.sin(robot.walkPhase + Math.PI) * 0.08,
    0.15,
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
    robot.leftHip = lerpValue(robot.leftHip, -0.08, 0.12);
    robot.leftKnee = lerpValue(robot.leftKnee, 0.08, 0.12);

    if (t < 0.38) {
      robot.rightHip = lerpValue(robot.rightHip, -0.55, 0.24);
      robot.rightKnee = lerpValue(robot.rightKnee, 0.7, 0.24);
    } else if (t < 0.72) {
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
