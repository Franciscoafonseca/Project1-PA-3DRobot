// ------------------------------------------------------------
// ESTRUTURA CENTRAL DE TEXTURAS
// ------------------------------------------------------------

// Cada propriedade guarda uma imagem carregada com loadImage()
// A separação por nome facilita a reutilização em várias partes do robot e da cena
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

// ------------------------------------------------------------
// CARREGAMENTO DAS TEXTURAS
// ------------------------------------------------------------

// Esta funcao deve ser chamada durante a fase de preload
// Cada imagem representa uma textura usada em materiais específicos do projeto
function loadTextures() {
  Textures.metal = loadImage("assets/textures/metal.jpg");
  Textures.metalPattern = loadImage("assets/textures/metal-pattern.jpg");

  Textures.plastic = loadImage("assets/textures/plastico.png");
  Textures.glass = loadImage("assets/textures/vidro.jpg");

  Textures.skin = loadImage("assets/textures/skin.jpg");
  Textures.hair = loadImage("assets/textures/cabelo.jpg");

  // Tecido usado na camisola
  Textures.jersey = loadImage("assets/textures/tecido.jpg");

  // Tecido usado nos calcoes
  Textures.shorts = loadImage("assets/textures/shorts.jpg");

  // Material das sapatilhas
  Textures.boots = loadImage("assets/textures/lether.jpg");

  Textures.grass = loadImage("assets/textures/relva.jpg");
  Textures.cimento = loadImage("assets/textures/cimento.jpg");

  // Textura da bola
  Textures.football = loadImage("assets/textures/ball.jpg");
}

// ------------------------------------------------------------
// CONFIGURACAO GLOBAL DO SISTEMA DE TEXTURAS
// ------------------------------------------------------------

// O modo REPEAT permite repetir a textura no objeto,
// o que é especialmente útil na relva e no cimento.
function setupTextureSystem() {
  textureWrap(REPEAT, REPEAT);
}

// ------------------------------------------------------------
// APLICACAO DOS MATERIAIS
// ------------------------------------------------------------

// Esta função centraliza a lógica de materiais.
// Recebe uma string identificadora e aplica:
//
// - textura, se existir
// - material ambiente
// - componente especular
// - shininess
// - emissão, quando necessário
//
// Retorna true quando e aplicada textura real ou false quando apenas e usada a cor/material.
function applyMaterial(type) {
  noStroke();

  switch (type) {
    // --------------------------------------------------------
    // METAL
    // --------------------------------------------------------
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

    // --------------------------------------------------------
    // PLASTICO
    // --------------------------------------------------------
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

    // --------------------------------------------------------
    // BANCOS DAS BANCADAS
    // --------------------------------------------------------
    case "seat":
      ambientMaterial(0, 57, 164);
      specularMaterial(55, 55, 65);
      shininess(6);
      return false;

    // --------------------------------------------------------
    // VIDRO
    // --------------------------------------------------------
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

    // --------------------------------------------------------
    // PELE
    // --------------------------------------------------------
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

    // --------------------------------------------------------
    // CAMISOLA
    // --------------------------------------------------------
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

    // --------------------------------------------------------
    // CALCOES
    // --------------------------------------------------------
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

    // --------------------------------------------------------
    // SAPATILHAS
    // --------------------------------------------------------
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

    // --------------------------------------------------------
    // BOLA
    // --------------------------------------------------------
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

    // --------------------------------------------------------
    // RELVA
    // --------------------------------------------------------
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

    // --------------------------------------------------------
    // CIMENTO
    // --------------------------------------------------------
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

    // --------------------------------------------------------
    // CORPO DO HOLOFOTE
    // --------------------------------------------------------
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

    // --------------------------------------------------------
    // LAMPADA DO HOLOFOTE
    // --------------------------------------------------------
    case "floodlight_led":
      ambientMaterial(245, 245, 235);
      emissiveMaterial(255, 250, 210);
      specularMaterial(180, 180, 160);
      shininess(22);
      return false;

    // --------------------------------------------------------
    // FRENTE DA BANCADA
    // --------------------------------------------------------
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

    // --------------------------------------------------------
    // POSTE DA BANDEIRA
    // --------------------------------------------------------
    case "corner_flag_pole":
      ambientMaterial(245, 245, 245);
      specularMaterial(90, 90, 90);
      shininess(18);
      return false;

    // --------------------------------------------------------
    // CABELO
    // --------------------------------------------------------
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

    // --------------------------------------------------------
    // LED AZUL
    // --------------------------------------------------------
    // Material emissivo para dar aparencia de ser LED
    case "led_blue":
      ambientMaterial(120, 200, 255);
      emissiveMaterial(240, 252, 255);
      specularMaterial(255, 255, 255);
      shininess(140);
      return false;

    // --------------------------------------------------------
    // MATERIAL POR OMISSAO
    // --------------------------------------------------------
    default:
      ambientMaterial(170, 170, 170);
      specularMaterial(90, 90, 90);
      shininess(10);
      return false;
  }
}
