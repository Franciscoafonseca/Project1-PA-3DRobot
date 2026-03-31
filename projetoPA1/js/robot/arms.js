// ------------------------------------------------------------
// Desenha um braço completo.
// A transformação é hierárquica: ombro -> braço -> cotovelo
// -> antebraço -> pulso -> mão -> dedos.
// ------------------------------------------------------------
function drawArm(torsoMatrix, left) {
  const side = left ? -1 : 1;

  const shoulderAngle = left ? robot.leftShoulder : robot.rightShoulder;
  const shoulderSpread = left
    ? robot.leftShoulderSpread
    : robot.rightShoulderSpread;

  const elbowAngle = left ? robot.leftElbow : robot.rightElbow;
  const wristAngle = left ? robot.leftWrist : robot.rightWrist;
  const fingerCurl = left ? robot.leftFingerCurl : robot.rightFingerCurl;
  const thumbCurl = left ? robot.leftThumbCurl : robot.rightThumbCurl;

  // Ponto de ligação do ombro ao tronco
  const shoulderMount = Mat4.compose(
    torsoMatrix,
    Mat4.translation(45 * side, -29, 0),
  );

  // O ombro combina abertura lateral com rotação principal
  const shoulderPivot = Mat4.compose(
    shoulderMount,
    Mat4.rotateZ(-side * shoulderSpread),
    Mat4.rotateX(shoulderAngle),
  );

  drawPart(robotMeshes.shoulder, shoulderPivot, "metal");

  // Braço superior
  const upperArm = Mat4.compose(shoulderPivot, Mat4.translation(0, 6.0, 0));
  drawPart(robotMeshes.upperArm, upperArm, "skin");

  // Cotovelo
  const elbowMount = Mat4.compose(shoulderPivot, Mat4.translation(0, 58, 0));
  drawPart(robotMeshes.elbow, elbowMount, "metal");

  const elbowPivot = Mat4.compose(elbowMount, Mat4.rotateX(elbowAngle + 0.08));

  // Antebraço
  const forearm = Mat4.compose(elbowPivot, Mat4.translation(0, 4, 0));
  drawPart(robotMeshes.forearm, forearm, "skin");

  // Pulso
  const wristMount = Mat4.compose(elbowPivot, Mat4.translation(0, 42, 0));
  drawPart(robotMeshes.wrist, wristMount, "metal");

  const wristPivot = Mat4.compose(wristMount, Mat4.rotateX(wristAngle));

  // Base da mão
  const handBase = Mat4.compose(wristPivot, Mat4.translation(0, 9.0, 0));
  const handYaw = left ? Math.PI / 2 : -Math.PI / 2;

  const palm = Mat4.compose(
    handBase,
    Mat4.rotateY(handYaw),
    Mat4.rotateX(0.04),
  );

  drawPart(robotMeshes.palm, palm, "skin");
  drawHandFingers(palm, left, fingerCurl, thumbCurl);
}

// ------------------------------------------------------------
// Posiciona os quatro dedos principais e o polegar.
// O lado esquerdo e direito são espelhados para manter
// a simetria das mãos.
// ------------------------------------------------------------
function drawHandFingers(palmMatrix, left, fingerCurl, thumbCurl) {
  const side = left ? -1 : 1;

  const indexBase = Mat4.compose(
    palmMatrix,
    Mat4.translation(-3.55 * side, 5.0, 1.15),
  );
  drawFinger(indexBase, fingerCurl, 8.2, 6.1, 4.4);

  const middleBase = Mat4.compose(
    palmMatrix,
    Mat4.translation(-1.15 * side, 5.15, 0.38),
  );
  drawFinger(middleBase, fingerCurl, 8.9, 6.5, 4.7);

  const ringBase = Mat4.compose(
    palmMatrix,
    Mat4.translation(1.15 * side, 5.0, -0.38),
  );
  drawFinger(ringBase, fingerCurl, 8.3, 6.1, 4.4);

  const littleBase = Mat4.compose(
    palmMatrix,
    Mat4.translation(3.15 * side, 4.7, -1.05),
  );
  drawFinger(littleBase, fingerCurl, 6.8, 5.1, 3.7);

  const thumbBase = Mat4.compose(
    palmMatrix,
    Mat4.translation(-3.3 * side, 0.9, 2.2),
  );

  const thumbOpen = Mat4.compose(thumbBase, Mat4.rotateZ(-0.92 * side));
  const thumbTilt = Mat4.compose(thumbOpen, Mat4.rotateY(0.26 * side));
  const thumbPivot = Mat4.compose(
    thumbTilt,
    Mat4.rotateX(thumbCurl * 0.72 + 0.12),
  );

  drawFingerSegmentChain(thumbPivot, 5.2, 3.8, 0, 0.5);
}

// ------------------------------------------------------------
// Cria a rotação base de um dedo e delega o resto da cadeia.
// ------------------------------------------------------------
function drawFinger(baseMatrix, curl, len1, len2, len3) {
  const basePivot = Mat4.compose(baseMatrix, Mat4.rotateX(curl));
  drawFingerSegmentChain(basePivot, len1, len2, len3, curl);
}

// ------------------------------------------------------------
// Desenha a cadeia de segmentos de um dedo.
// Cada falange é ligada por uma pequena articulação.
// ------------------------------------------------------------
function drawFingerSegmentChain(basePivot, len1, len2, len3, curl) {
  const seg1 = Mat4.compose(basePivot, Mat4.translation(0, len1 * 0.5, 0));
  drawPart(robotMeshes.fingerSegment, seg1, "skin");

  const joint1 = Mat4.compose(basePivot, Mat4.translation(0, len1, 0));
  drawPart(robotMeshes.fingerJoint, joint1, "metal");

  const pivot2 = Mat4.compose(joint1, Mat4.rotateX(curl * 0.86));

  if (len2 > 0) {
    const seg2 = Mat4.compose(pivot2, Mat4.translation(0, len2 * 0.5, 0));
    drawPart(robotMeshes.fingerSegment, seg2, "skin");

    const joint2 = Mat4.compose(pivot2, Mat4.translation(0, len2, 0));
    drawPart(robotMeshes.fingerJoint, joint2, "metal");

    if (len3 > 0) {
      const pivot3 = Mat4.compose(joint2, Mat4.rotateX(curl * 0.68));
      const seg3 = Mat4.compose(pivot3, Mat4.translation(0, len3 * 0.5, 0));
      drawPart(robotMeshes.fingerSegment, seg3, "skin");
    }
  }
}
