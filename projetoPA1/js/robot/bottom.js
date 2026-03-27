// ------------------------------------------------------------
// PELVIS
// ------------------------------------------------------------
function drawPelvis(pelvisMatrix) {
  drawPart(robotMeshes.pelvis, pelvisMatrix, "plastic");
}

// ------------------------------------------------------------
// LEG
// ------------------------------------------------------------
function drawLeg(pelvisMatrix, left) {
  const side = left ? -1 : 1;
  const hipAngle = left ? robot.leftHip : robot.rightHip;
  const kneeAngle = left ? robot.leftKnee : robot.rightKnee;
  const ankleAngle = left ? robot.leftAnkle || 0 : robot.rightAnkle || 0;

  const hipMount = Mat4.compose(
    pelvisMatrix,
    Mat4.translation(16 * side, 10, 0),
  );
  drawPart(robotMeshes.hipJoint, hipMount, "metaldelado");

  const hipPivot = Mat4.compose(hipMount, Mat4.rotateX(hipAngle));

  drawShortsLegFlap(hipPivot, left);

  const thigh = Mat4.compose(hipPivot, Mat4.translation(0, 31, 0.5));
  drawPart(robotMeshes.thigh, thigh, "skin");

  const kneeMount = Mat4.compose(hipPivot, Mat4.translation(0, 61, 0.6));
  drawPart(robotMeshes.knee, kneeMount, "metaldelado");

  const kneePivot = Mat4.compose(kneeMount, Mat4.rotateX(kneeAngle));

  const shin = Mat4.compose(kneePivot, Mat4.translation(0, 31, 0.2));
  drawPart(robotMeshes.shin, shin, "skin");

  const footBase = Mat4.compose(kneePivot, Mat4.translation(0, 60, 8.8));
  const foot = Mat4.compose(footBase, Mat4.rotateX(ankleAngle - 0.08));
  drawPart(robotMeshes.foot, foot, "boots");
}

function drawShortsWaist(pelvisMatrix) {
  if (!robotMeshes?.shorts?.waist) return;

  const shortsWaistMatrix = Mat4.compose(
    pelvisMatrix,
    Mat4.translation(0, 4, 0),
  );

  drawPart(robotMeshes.shorts.waist, shortsWaistMatrix, "shorts");
}

function drawShortsLegFlap(hipPivot, left) {
  if (!robotMeshes?.shorts) return;

  const side = left ? -1 : 1;

  const flapMatrix = Mat4.compose(hipPivot, Mat4.translation(6 * side, 10, 0));

  drawPart(
    left ? robotMeshes.shorts.leftLeg : robotMeshes.shorts.rightLeg,
    flapMatrix,
    "shorts",
  );
}

function drawLowerBody(pelvisMatrix) {
  drawShortsWaist(pelvisMatrix);
  drawLeg(pelvisMatrix, true);
  drawLeg(pelvisMatrix, false);
}
