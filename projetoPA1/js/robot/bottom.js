// ------------------------------------------------------------
// Desenha a zona da bacia, caso exista mesh própria.
// ------------------------------------------------------------
function drawPelvis(pelvisMatrix) {
  const pelvisVisual = Mat4.compose(
    pelvisMatrix,
    Mat4.translation(0, 3.0, 0.0),
  );

  if (robotMeshes.pelvis) {
    drawPart(robotMeshes.pelvis, pelvisVisual, "shorts");
  }
}

// ------------------------------------------------------------
// Desenha uma perna completa.
// A hierarquia segue a estrutura natural da articulação:
// anca -> coxa -> joelho -> canela -> tornozelo -> pé.
// ------------------------------------------------------------
function drawLeg(pelvisMatrix, left) {
  const side = left ? -1 : 1;

  const hipAngle = left ? robot.leftHip : robot.rightHip;
  const kneeAngle = left ? robot.leftKnee : robot.rightKnee;
  const ankleAngle = left ? robot.leftAnkle || 0 : robot.rightAnkle || 0;

  const thighHeight = 58;
  const kneeHeight = 12;
  const shinHeight = 58;

  // Ligação da perna à bacia
  const hipMount = Mat4.compose(
    pelvisMatrix,
    Mat4.translation(17 * side, 10, 0),
  );

  const hipPivot = Mat4.compose(hipMount, Mat4.rotateX(hipAngle));

  // Aba dos calções acompanhando a coxa
  drawShortsLegFlap(hipPivot, left);

  // Coxa
  const thighStart = Mat4.compose(hipPivot, Mat4.translation(0, 2, 0));
  drawPart(robotMeshes.thigh, thighStart, "skin");

  // Joelho
  const kneeMount = Mat4.compose(
    thighStart,
    Mat4.translation(0, thighHeight + 7, 0),
  );
  drawPart(robotMeshes.knee, kneeMount, "metal");

  // A rotação do joelho é aplicada a partir deste pivot
  const kneePivot = Mat4.compose(kneeMount, Mat4.rotateX(-kneeAngle));

  // Canela
  const shinStart = Mat4.compose(
    kneePivot,
    Mat4.translation(0, kneeHeight - 5, 0),
  );
  drawPart(robotMeshes.shin, shinStart, "skin");

  // Tornozelo e pé
  const ankleMount = Mat4.compose(
    shinStart,
    Mat4.translation(0, shinHeight + 5, 0),
  );

  const footBase = Mat4.compose(ankleMount, Mat4.rotateX(ankleAngle - 0.08));
  const footMatrix = Mat4.compose(footBase, Mat4.translation(0, 0, 10));

  drawPart(robotMeshes.foot, footMatrix, "boots");
}

// ------------------------------------------------------------
// Parte superior dos calções.
// É ligeiramente subida para fechar melhor a ligação ao tronco.
// ------------------------------------------------------------
function drawShortsWaist(pelvisMatrix) {
  if (!robotMeshes?.shorts?.waist) return;

  const m = Mat4.compose(pelvisMatrix, Mat4.translation(0, -5.5, 0.0));
  drawPart(robotMeshes.shorts.waist, m, "shorts");
}

// ------------------------------------------------------------
// Aba lateral do calção.
// Fica presa à rotação da perna para acompanhar o movimento.
// ------------------------------------------------------------
function drawShortsLegFlap(hipPivot, left) {
  if (!robotMeshes?.shorts) return;

  const local = Mat4.compose(
    Mat4.translation(0, -7.0, 0.0),
    Mat4.rotateY(Math.PI * 0.5),
  );

  const m = Mat4.compose(hipPivot, local);

  drawPart(
    left ? robotMeshes.shorts.leftLeg : robotMeshes.shorts.rightLeg,
    m,
    "shorts",
  );
}

// ------------------------------------------------------------
// Desenha a parte inferior completa do robot.
// ------------------------------------------------------------
function drawLowerBody(pelvisMatrix) {
  const pelvisBodyMatrix = pelvisMatrix;

  drawShortsWaist(pelvisBodyMatrix);
  drawLeg(pelvisBodyMatrix, true);
  drawLeg(pelvisBodyMatrix, false);
}
