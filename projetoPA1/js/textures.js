// js/textures.js
// ============================================================
// TEXTURE SYSTEM - SIMPLIFIED / REUSABLE
// ============================================================

const Textures = {
  metal: null,
  metaldelado: null,
  plastic: null,
  leather: null,
  glass: null,
  skin: null,
  jersey: null,
  shorts: null,
  sock: null,
  boots: null,

  grass: null,
  cimento: null,
};

function loadTextures() {
  // robot / props
  Textures.metal = loadImage("assets/textures/metal.jpg");
  Textures.metaldelado = loadImage("assets/textures/metal-pattern.jpg");
  Textures.plastic = loadImage("assets/textures/plastico.png");
  Textures.leather = loadImage("assets/textures/shoeslether.jpg");
  Textures.glass = loadImage("assets/textures/vidro.png");
  Textures.skin = loadImage("assets/textures/skin.jpg");
  Textures.jersey = loadImage("assets/textures/tecido.jpg");
  Textures.shorts = loadImage("assets/textures/shorts.jpg");
  Textures.sock = loadImage("assets/textures/sock.png");
  Textures.boots = loadImage("assets/textures/lether.jpg");

  // cenário
  Textures.grass = loadImage("assets/textures/relva.jpg");
  Textures.cimento = loadImage("assets/textures/cimento.jpg");
}

function setupTextureSystem() {
  textureWrap(REPEAT, REPEAT);
}

function applyMaterial(type) {
  noStroke();

  switch (type) {
    case "metal":
      if (Textures.metal) {
        texture(Textures.metal);
        ambientMaterial(165, 165, 170);
        specularMaterial(255, 255, 255);
        shininess(110);
        return true;
      }
      ambientMaterial(165, 165, 170);
      specularMaterial(255, 255, 255);
      shininess(110);
      return false;

    case "plastic":
      if (Textures.plastic) {
        texture(Textures.plastic);
        ambientMaterial(255, 255, 255);
        specularMaterial(100, 100, 100);
        shininess(18);
        return true;
      }
      ambientMaterial(90, 95, 105);
      specularMaterial(150, 155, 165);
      shininess(22);
      return false;

    case "seat":
      ambientMaterial(0, 57, 164);
      specularMaterial(55, 55, 65);
      shininess(6);
      return false;

    case "leather":
      if (Textures.leather) {
        texture(Textures.leather);
        ambientMaterial(90, 60, 40);
        specularMaterial(140, 95, 70);
        shininess(28);
        return true;
      }
      ambientMaterial(90, 60, 40);
      specularMaterial(140, 95, 70);
      shininess(28);
      return false;

    case "glass":
      if (Textures.glass) {
        texture(Textures.glass);
        ambientMaterial(80, 160, 255);
        emissiveMaterial(90, 180, 255);
        specularMaterial(255, 255, 255);
        shininess(22);
        return true;
      }
      ambientMaterial(80, 160, 255);
      emissiveMaterial(90, 180, 255);
      specularMaterial(255, 255, 255);
      shininess(22);
      return false;

    case "skin":
      if (Textures.skin) {
        texture(Textures.skin);
        ambientMaterial(255, 255, 255);
        specularMaterial(35, 35, 35);
        shininess(4);
        return true;
      }
      ambientMaterial(220, 190, 170);
      return false;

    case "jersey":
      if (Textures.jersey) {
        texture(Textures.jersey);
        ambientMaterial(185, 35, 35);
        specularMaterial(95, 95, 95);
        shininess(8);
        return true;
      }
      ambientMaterial(185, 35, 35);
      specularMaterial(95, 95, 95);
      shininess(8);
      return false;

    case "shorts":
      if (Textures.shorts) {
        texture(Textures.shorts);
        ambientMaterial(240, 240, 240);
        return true;
      }
      ambientMaterial(240, 240, 240);
      return false;

    case "sock":
      if (Textures.sock) {
        texture(Textures.sock);
        ambientMaterial(230, 230, 230);
        specularMaterial(70, 70, 70);
        shininess(5);
        return true;
      }
      ambientMaterial(230, 230, 230);
      specularMaterial(70, 70, 70);
      shininess(5);
      return false;

    case "boots":
      if (Textures.boots) {
        texture(Textures.boots);
        ambientMaterial(28, 28, 28);
        specularMaterial(180, 180, 180);
        shininess(26);
        return true;
      }
      ambientMaterial(28, 28, 28);
      specularMaterial(180, 180, 180);
      shininess(26);
      return false;

    case "grass":
      if (Textures.grass) {
        texture(Textures.grass);
        ambientMaterial(255, 255, 255);
        specularMaterial(18, 18, 18);
        shininess(2);
        return true;
      }
      ambientMaterial(70, 150, 70);
      return false;

    case "cimento":
      if (Textures.cimento) {
        texture(Textures.cimento);
        ambientMaterial(210, 210, 210);
        specularMaterial(35, 35, 35);
        shininess(3);
        return true;
      }
      ambientMaterial(180, 180, 185);
      specularMaterial(40, 40, 45);
      shininess(3);
      return false;

    case "floodlight_body":
      if (Textures.metaldelado) {
        texture(Textures.metaldelado);
        ambientMaterial(190, 190, 195);
        specularMaterial(255, 255, 255);
        shininess(70);
        return true;
      }
      if (Textures.metal) {
        texture(Textures.metal);
        ambientMaterial(180, 180, 185);
        specularMaterial(255, 255, 255);
        shininess(60);
        return true;
      }
      ambientMaterial(170, 172, 178);
      specularMaterial(255, 255, 255);
      shininess(22);
      return false;

    case "floodlight_led":
      ambientMaterial(245, 245, 235);
      specularMaterial(180, 180, 160);
      shininess(22);
      return false;

    case "stand_front":
      if (Textures.cimento) {
        texture(Textures.cimento);
        ambientMaterial(215, 215, 215);
        specularMaterial(25, 25, 25);
        shininess(2);
        return true;
      }
      ambientMaterial(180, 180, 185);
      specularMaterial(40, 40, 45);
      shininess(3);
      return false;

    case "corner_flag_pole":
      ambientMaterial(245, 245, 245);
      specularMaterial(90, 90, 90);
      shininess(18);
      return false;

    default:
      ambientMaterial(170, 170, 170);
      specularMaterial(90, 90, 90);
      shininess(10);
      return false;
  }
}
