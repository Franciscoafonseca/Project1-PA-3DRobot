# Project1-PA-3DRobot

Projeto desenvolvido em **JavaScript**, utilizando **p5.js** em modo **WebGL**.

O objetivo do projeto é representar um jogador/robô de futebol em 3D, construído de forma manual através de geometria poligonal, matrizes de transformação, texturas, iluminação e animações interativas.

## Descrição

A aplicação apresenta uma cena 3D com um robô futebolista num campo de futebol.  
O robô é composto por várias partes articuladas, permitindo movimento, rotação, animações e interação através do teclado.

Um dos principais objetivos técnicos foi evitar o uso direto das primitivas e transformações 3D nativas do p5.js. Assim, grande parte do pipeline gráfico foi implementado manualmente, incluindo matrizes, geometria, normais, texturas e iluminação.

## Tecnologias utilizadas

- JavaScript
- p5.js
- WebGL
- HTML
- CSS

## Estrutura principal

```text
projetoPA1/
│
├── index.html
├── sketch.js
├── css/
├── assets/
│   └── textures/
└── js/
    ├── input.js
    ├── matrix.js
    ├── textures.js
    ├── geometry/
    ├── robot/
    └── scene/
```

## Componentes principais

### `index.html`

Página principal do projeto.  
Carrega o p5.js, os ficheiros JavaScript, o CSS e inicia a aplicação no navegador.

### `sketch.js`

Ficheiro principal da aplicação.  
Responsável por inicializar o canvas WebGL, carregar texturas, atualizar a cena, configurar a câmara, desenhar o robô e aplicar a iluminação.

### `js/matrix.js`

Implementa a biblioteca matemática do projeto.  
Inclui operações com matrizes 4x4, como translação, rotação, escala, multiplicação, inversão e transformação de pontos/vetores.

### `js/geometry/`

Contém a base geométrica usada para criar as malhas do robô.  
A geometria é construída através de vértices e triângulos, sem recurso direto a primitivas 3D prontas.

### `js/robot/`

Contém os ficheiros responsáveis pela construção do robô, incluindo cabeça, tronco, braços, pernas e animações.

### `js/scene/`

Contém os elementos da cena, como campo, bancadas, luzes e ambiente.

### `assets/textures/`

Contém as texturas usadas no projeto, como relva, pele, cabelo, metal, plástico, camisola, calções, chuteiras e bola.

## Funcionalidades

- Robô 3D articulado.
- Cena de futebol em WebGL.
- Campo, bancadas e bola.
- Animações do robô.
- Controlo por teclado.
- Texturas aplicadas manualmente com coordenadas UV.
- Iluminação com luz ambiente, luz direcional e spotlight.
- Modelo de reflexão de Phong.
- Câmara interativa.
- Transformações implementadas com matrizes 4x4.
- Geometria triangulada manualmente.

## Como executar

É recomendado executar o projeto através de um servidor local, para evitar problemas no carregamento das texturas.

### Usando Python

Na pasta `projetoPA1`, executar:

```bash
python -m http.server 8000
```

Depois abrir no navegador:

```text
http://localhost:8000
```

### Usando VS Code Live Server

1. Abrir a pasta `projetoPA1` no Visual Studio Code.
2. Instalar a extensão `Live Server`.
3. Clicar com o botão direito em `index.html`.
4. Selecionar `Open with Live Server`.

## Controlos

Os controlos são feitos através do teclado e permitem movimentar o robô, alterar articulações, controlar animações e ajustar a câmara.

Consultar o ficheiro `js/input.js` para verificar todas as teclas disponíveis.

## Implementação técnica

O projeto foi desenvolvido com foco em três áreas principais:

1. **Matrizes e transformações**  
   Foram implementadas matrizes 4x4 para posicionar, rodar e escalar as partes do robô.

2. **Geometria e triangulação**  
   As malhas foram construídas manualmente com vértices e triângulos, permitindo formar partes como tronco, braços, pernas e cabeça.

3. **Texturas e iluminação**  
   Foram aplicadas coordenadas UV às malhas e configurado um modelo de iluminação baseado em Phong, combinando luz ambiente, direcional e spotlight.

## Notas de execução

- Usar um navegador moderno, como Chrome, Edge ou Firefox.
- Executar preferencialmente por servidor local.
- Se as texturas não aparecerem, confirmar se a pasta `assets/textures/` está no local correto.
- Se a cena aparecer vazia, verificar a consola do navegador para erros JavaScript.
- O desempenho depende da placa gráfica e do navegador utilizado.

## Comandos úteis

Clonar o repositório:

```bash
git clone https://github.com/Franciscoafonseca/Project1-PA-3DRobot.git
```

Entrar na pasta do projeto:

```bash
cd Project1-PA-3DRobot/projetoPA1
```

Executar com Python:

```bash
python -m http.server 8000
```
