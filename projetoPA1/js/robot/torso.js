function drawBackPanel(torsoBody, number = 8) {
  const backPanelMatrix = Mat4.compose(
    torsoBody,
    Mat4.translation(0, -2, -19.5),
  );

  drawPanel(robotMeshes.backPanel, backPanelMatrix, "vidro", "led_blue");

  const digitBase = Mat4.compose(torsoBody, Mat4.translation(0, -2, -22.2));

  function drawDigitSegment(seg) {
    const mesh =
      seg.type === "v" ? robotMeshes.backDigitV : robotMeshes.backDigitH;

    // espelha no X para o número ficar correto nas costas
    const m = Mat4.compose(digitBase, Mat4.translation(-seg.x, seg.y, 0));

    drawPart(mesh, m, "glass");
  }

  const segments = {
    top: { x: 0, y: -14, type: "h" },
    mid: { x: 0, y: 0, type: "h" },
    bot: { x: 0, y: 14, type: "h" },
    tl: { x: -8, y: -7, type: "v" },
    tr: { x: 8, y: -7, type: "v" },
    bl: { x: -8, y: 7, type: "v" },
    br: { x: 8, y: 7, type: "v" },
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

  const active = digitMap[number] || digitMap[8];

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

  // // peitorais - maiores e a preencher o topo
  // const pecL = Mat4.compose(torsoBody, Mat4.translation(-17.5, -34, 19.5));
  // const pecR = Mat4.compose(torsoBody, Mat4.translation(17.5, -34, 19.5));
  // drawPart(robotMeshes.pecL, pecL, "metal");
  // drawPart(robotMeshes.pecR, pecR, "metal");
  // peitorais grandes e alinhados com o topo do tronco
  const pecL = Mat4.compose(torsoBody, Mat4.translation(-18.5, -36, 20.0));
  const pecR = Mat4.compose(torsoBody, Mat4.translation(18.5, -36, 20.0));

  drawPart(robotMeshes.pecL, pecL, "jersey");
  drawPart(robotMeshes.pecR, pecR, "jersey");

  // 6-pack proporcional
  // linha superior
  const upperAbsL = Mat4.compose(torsoBody, Mat4.translation(-11, -7, 19.8));
  const upperAbsR = Mat4.compose(torsoBody, Mat4.translation(11, -7, 19.8));

  // linha do meio
  const midAbsL = Mat4.compose(torsoBody, Mat4.translation(-10, 13, 19.0));
  const midAbsR = Mat4.compose(torsoBody, Mat4.translation(10, 13, 19.0));

  // linha inferior
  const lowerAbsL = Mat4.compose(torsoBody, Mat4.translation(-9, 33, 18.0));
  const lowerAbsR = Mat4.compose(torsoBody, Mat4.translation(9, 33, 18.0));

  drawPart(robotMeshes.upperAbs, upperAbsL, "jersey");
  drawPart(robotMeshes.upperAbs, upperAbsR, "jersey");

  drawPart(robotMeshes.midAbs, midAbsL, "jersey");
  drawPart(robotMeshes.midAbs, midAbsR, "jersey");

  drawPart(robotMeshes.lowerAbs, lowerAbsL, "jersey");
  drawPart(robotMeshes.lowerAbs, lowerAbsR, "jersey");

  const lowerTorso = Mat4.compose(torsoBody, Mat4.translation(0, 55, 5));
  drawPart(robotMeshes.lowerTorso, lowerTorso, "metal");
  drawBackPanel(torsoBody, 7);
}
