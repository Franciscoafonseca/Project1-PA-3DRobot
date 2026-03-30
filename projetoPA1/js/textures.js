// js/textures.js
// ============================================================
// TEXTURE SYSTEM - CLEAN / CONSISTENT
// ============================================================

const Textures = {
  metal: null,
  metalPattern: null,
  plastic: null,
  glass: null,
  skin: null,
  jersey: null,
  shorts: null,
  boots: null,
  football: null,
  hair: null,
  grass: null,
  cimento: null,
};

function loadTextures() {
  Textures.metal = loadImage("assets/textures/metal.jpg");
  Textures.metalPattern = loadImage("assets/textures/metal-pattern.jpg");

  Textures.plastic = loadImage("assets/textures/plastico.png");
  Textures.glass = loadImage("assets/textures/vidro.jpg");

  Textures.skin = loadImage("assets/textures/skin.jpg");
  Textures.hair = loadImage("assets/textures/cabelo.jpg");

  // azul -> camisola
  Textures.jersey = loadImage("assets/textures/tecido.jpg");

  // branco -> calções
  Textures.shorts = loadImage("assets/textures/shorts.jpg");

  // chuteira
  Textures.boots = loadImage("assets/textures/lether.jpg");

  Textures.grass = loadImage("assets/textures/relva.jpg");
  Textures.cimento = loadImage("assets/textures/cimento.jpg");

  // só deixa esta linha se o ficheiro existir mesmo
  Textures.football = loadImage("assets/textures/ball.jpg");
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
        ambientMaterial(210, 210, 215);
        specularMaterial(255, 255, 255);
        shininess(90);
        return true;
      }
      ambientMaterial(180, 180, 185);
      specularMaterial(255, 255, 255);
      shininess(90);
      return false;

    case "plastic":
      if (Textures.plastic) {
        texture(Textures.plastic);
        ambientMaterial(255, 255, 255);
        specularMaterial(110, 110, 120);
        shininess(18);
        return true;
      }
      ambientMaterial(90, 100, 110);
      specularMaterial(140, 145, 155);
      shininess(18);
      return false;

    case "seat":
      ambientMaterial(0, 57, 164);
      specularMaterial(55, 55, 65);
      shininess(6);
      return false;

    case "glass":
      if (Textures.glass) {
        texture(Textures.glass);
        ambientMaterial(170, 210, 245);
        emissiveMaterial(20, 40, 60);
        specularMaterial(255, 255, 255);
        shininess(20);
        return true;
      }
      ambientMaterial(160, 205, 245);
      emissiveMaterial(20, 40, 60);
      specularMaterial(255, 255, 255);
      shininess(20);
      return false;

    case "skin":
      if (Textures.skin) {
        texture(Textures.skin);
        ambientMaterial(255, 255, 255);
        specularMaterial(30, 30, 30);
        shininess(4);
        return true;
      }
      ambientMaterial(220, 190, 170);
      specularMaterial(30, 30, 30);
      shininess(4);
      return false;

    case "jersey":
      if (Textures.jersey) {
        texture(Textures.jersey);
        ambientMaterial(255, 255, 255);
        specularMaterial(70, 70, 70);
        shininess(8);
        return true;
      }
      ambientMaterial(35, 70, 180);
      specularMaterial(70, 70, 70);
      shininess(8);
      return false;

    case "shorts":
      if (Textures.shorts) {
        texture(Textures.shorts);
        ambientMaterial(255, 255, 255);
        specularMaterial(55, 55, 55);
        shininess(6);
        return true;
      }
      ambientMaterial(235, 235, 235);
      specularMaterial(55, 55, 55);
      shininess(6);
      return false;

    case "boots":
      if (Textures.boots) {
        texture(Textures.boots);
        ambientMaterial(255, 255, 255);
        specularMaterial(80, 80, 80);
        shininess(20);
        return true;
      }
      ambientMaterial(170, 255, 60);
      specularMaterial(80, 80, 80);
      shininess(20);
      return false;

    case "football":
      if (Textures.football) {
        texture(Textures.football);
        ambientMaterial(255, 255, 255);
        specularMaterial(120, 120, 120);
        shininess(18);
        return true;
      }
      ambientMaterial(255, 255, 255);
      specularMaterial(120, 120, 120);
      shininess(18);
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
      specularMaterial(18, 18, 18);
      shininess(2);
      return false;

    case "cimento":
      if (Textures.cimento) {
        texture(Textures.cimento);
        ambientMaterial(255, 255, 255);
        specularMaterial(35, 35, 35);
        shininess(3);
        return true;
      }
      ambientMaterial(185, 185, 190);
      specularMaterial(35, 35, 35);
      shininess(3);
      return false;

    case "floodlight_body":
      if (Textures.metalPattern) {
        texture(Textures.metalPattern);
        ambientMaterial(255, 255, 255);
        specularMaterial(255, 255, 255);
        shininess(70);
        return true;
      }
      if (Textures.metal) {
        texture(Textures.metal);
        ambientMaterial(255, 255, 255);
        specularMaterial(255, 255, 255);
        shininess(70);
        return true;
      }
      ambientMaterial(175, 175, 180);
      specularMaterial(255, 255, 255);
      shininess(70);
      return false;

    case "floodlight_led":
      ambientMaterial(245, 245, 235);
      emissiveMaterial(255, 250, 210);
      specularMaterial(180, 180, 160);
      shininess(22);
      return false;

    case "stand_front":
      if (Textures.cimento) {
        texture(Textures.cimento);
        ambientMaterial(255, 255, 255);
        specularMaterial(25, 25, 25);
        shininess(2);
        return true;
      }
      ambientMaterial(185, 185, 190);
      specularMaterial(25, 25, 25);
      shininess(2);
      return false;

    case "corner_flag_pole":
      ambientMaterial(245, 245, 245);
      specularMaterial(90, 90, 90);
      shininess(18);
      return false;

    case "hair":
      if (Textures.hair) {
        texture(Textures.hair);
        ambientMaterial(255, 255, 255);
        specularMaterial(90, 90, 90);
        shininess(10);
        return true;
      }
      ambientMaterial(120, 80, 50);
      specularMaterial(90, 90, 90);
      shininess(10);
      return false;

    case "led_blue":
      ambientMaterial(120, 200, 255);
      emissiveMaterial(240, 252, 255);
      specularMaterial(255, 255, 255);
      shininess(140);
      return false;

    default:
      ambientMaterial(170, 170, 170);
      specularMaterial(90, 90, 90);
      shininess(10);
      return false;
  }
}
