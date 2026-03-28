function drawBackPanel(torsoBody, number = 9) {
  const backPanelMatrix = Mat4.compose(
    torsoBody,
    Mat4.translation(0, -2, -18.5),
  );

  drawPanel(robotMeshes.backPanel, backPanelMatrix, "metal", "glass");

  const digitBase = Mat4.compose(torsoBody, Mat4.translation(0, -2, -20.8));

  function drawDigitSegment(seg) {
    const mesh =
      seg.type === "v" ? robotMeshes.backDigitV : robotMeshes.backDigitH;

    const m = Mat4.compose(digitBase, Mat4.translation(seg.x, seg.y, 0));
    drawPart(mesh, m, "glass");
  }

  const segments = {
    top: { x: 0, y: -11, type: "h" },
    mid: { x: 0, y: 0, type: "h" },
    bot: { x: 0, y: 11, type: "h" },
    tl: { x: -6, y: -5.5, type: "v" },
    tr: { x: 6, y: -5.5, type: "v" },
    bl: { x: -6, y: 5.5, type: "v" },
    br: { x: 6, y: 5.5, type: "v" },
  };

  const digitMap = {
    0: ["top", "bot", "tl", "tr", "bl", "br"],
    1: ["tr", "br"],
    2: ["top", "mid", "bot", "tr", "bl"],
    3: ["top", "mid", "bot", "tr", "br"],
    4: ["mid", "tl", "tr", "br"],
    5: ["top", "mid", "bot", "tl", "br"],
    6: ["top", "mid", "bot", "tl", "bl", "br"],
    7: ["top", "tr", "br"],
    8: ["top", "mid", "bot", "tl", "tr", "bl", "br"],
    9: ["top", "mid", "bot", "tl", "tr", "br"],
  };

  const active = digitMap[number] || digitMap[9];

  for (const key of active) {
    drawDigitSegment(segments[key]);
  }
}
function drawTorso(root) {
  const torsoBody = Mat4.compose(root, Mat4.translation(0, 5, 0));
  drawPart(robotMeshes.torso, torsoBody, "jersey");

  if (robotMeshes.neckRing) {
    const neckRing = Mat4.compose(root, Mat4.translation(0, -48, 0));
    drawPart(robotMeshes.neckRing, neckRing, "metal");
  }

  // peitorais - maiores, mais altos e mais largos
  const pecL = Mat4.compose(torsoBody, Mat4.translation(-16, -24, 18.5));
  const pecR = Mat4.compose(torsoBody, Mat4.translation(16, -24, 18.5));
  drawPart(robotMeshes.pecL, pecL, "metal");
  drawPart(robotMeshes.pecR, pecR, "metal");

  // esterno - mais pequeno e discreto
  const sternum = Mat4.compose(torsoBody, Mat4.translation(0, -12, 17.0));
  drawPart(robotMeshes.sternum, sternum, "metal");

  // linha superior (logo abaixo do peito)
  const upperAbsL = Mat4.compose(torsoBody, Mat4.translation(-7, 6, 18.5));
  const upperAbsR = Mat4.compose(torsoBody, Mat4.translation(7, 6, 18.5));

  // linha média
  const midAbsL = Mat4.compose(torsoBody, Mat4.translation(-6.5, 17, 17.8));
  const midAbsR = Mat4.compose(torsoBody, Mat4.translation(6.5, 17, 17.8));

  // linha inferior
  const lowerAbsL = Mat4.compose(torsoBody, Mat4.translation(-7.5, 29, 16.8));
  const lowerAbsR = Mat4.compose(torsoBody, Mat4.translation(7.5, 29, 16.8));

  drawPart(robotMeshes.upperAbs, upperAbsL, "metal");
  drawPart(robotMeshes.upperAbs, upperAbsR, "metal");

  drawPart(robotMeshes.midAbs, midAbsL, "metal");
  drawPart(robotMeshes.midAbs, midAbsR, "metal");

  drawPart(robotMeshes.lowerAbs, lowerAbsL, "metal");
  drawPart(robotMeshes.lowerAbs, lowerAbsR, "metal");
  // laterais / oblíquos
  const sideL = Mat4.compose(torsoBody, Mat4.translation(-28, 10, 3));
  const sideR = Mat4.compose(torsoBody, Mat4.translation(28, 10, 3));
  drawPart(robotMeshes.sideTorsoL, sideL, "metal");
  drawPart(robotMeshes.sideTorsoR, sideR, "metal");

  // encaixe com cintura
  const waistBridge = Mat4.compose(torsoBody, Mat4.translation(0, 44, 0));
  drawPart(robotMeshes.waistBridge, waistBridge, "metal");

  drawBackPanel(torsoBody, 9);
}
